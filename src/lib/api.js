/*
 * Слой данных. С переменными VITE_SUPABASE_* читает из Supabase,
 * без них — из src/data/content.js. Компоненты не знают, откуда данные.
 */
import { supabase } from "./supabase";
import { BOOKING_LIMITS, DEMO_LIMITS, cleanPayload, isBot } from "./forms";
import { ARTISTS, CHART, CONCERTS, JOBS, LABEL, TEAM_PEOPLE, MERCH, LEGAL_PAGES, DOCUMENTS } from "../data/content";
import { byDateAsc, hasArtist, sortReleasesNewestFirst, todayISO, trackKey, uniqueReleases } from "./format";

export const isLive = Boolean(supabase);

async function from(table, query = (q) => q) {
  const { data, error } = await query(supabase.from(table).select("*"));
  if (error) throw error;
  return data;
}

/*
 * Кеш запросов: getArtists нужен шапке, футеру, лайнапу и странице одновременно —
 * без кеша это 3–4 одинаковых запроса на каждую страницу. Храним промис (а не результат),
 * чтобы параллельные вызовы шли одним запросом; ошибка из кеша удаляется.
 */
const CACHE_TTL_MS = 60_000;
const cache = new Map();

function cached(key, load) {
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < CACHE_TTL_MS) return hit.promise;
  const promise = load().catch((error) => {
    cache.delete(key);
    throw error;
  });
  cache.set(key, { promise, at: Date.now() });
  return promise;
}

/*
 * Витрина читает только опубликованное. Фильтры явные, хотя то же самое проверяют
 * политики RLS: так видно намерение и не зависим от того, кто вошёл.
 * Сортировка по датам и популярности — на клиенте (sortReleasesNewestFirst и ниже).
 */
const byPopularity = (a, b) => (b.streams || 0) - (a.streams || 0) || (b.popularity || 0) - (a.popularity || 0);
const byPublishedDesc = (a, b) => (b.published_at || "").localeCompare(a.published_at || "") || (a.sort || 0) - (b.sort || 0);

const mapRelease = (r) => ({ title: r.title, artists: r.artists, type: r.type, cover: r.cover, preview: r.preview, spotify: r.spotify, released_on: r.released_on });
const mapTrack = (t) => ({ title: t.title, artists: t.artists, streams: t.streams, popularity: t.popularity, cover: t.cover, preview: t.preview, spotify: t.spotify });

export const getLabel = async () => LABEL;

export function getArtists() {
  if (!isLive) return Promise.resolve(ARTISTS);
  return cached("artists", async () => {
    const rows = await from("artists", (q) => q.eq("hidden", false).order("sort"));
    return rows.map((a) => ({
      slug: a.slug, name: a.name, tagline: a.tagline, bio: a.bio, bioSource: a.bio_source,
      photo: a.photo, photoPosition: a.photo_position, palette: a.palette, socials: a.socials || []
    }));
  });
}

export function getChart() {
  if (!isLive) return Promise.resolve(CHART);
  return cached("chart", async () =>
    (await from("tracks", (q) => q.eq("in_chart", true).eq("hidden", false).order("streams", { ascending: false }))).map(mapTrack)
  );
}

export async function getArtist(slug) {
  const artists = await getArtists();
  const index = artists.findIndex((a) => a.slug === slug);
  if (index === -1) return null;
  const base = artists[index];
  const next = artists[(index + 1) % artists.length];
  const chart = await getChart();

  let full;
  if (!isLive) {
    full = ARTISTS[index];
  } else {
    const byArtist = (q) => q.eq("artist_slug", slug);
    const [releases, tracks, videos, events] = await cached(`artist:${slug}`, () => Promise.all([
      from("releases", (q) => byArtist(q).eq("hidden", false).order("sort")),
      from("tracks", (q) => byArtist(q).eq("hidden", false).order("streams", { ascending: false })),
      from("videos", (q) => byArtist(q).eq("hidden", false).order("sort")),
      from("events", (q) => byArtist(q).order("date", { ascending: false }))
    ]));
    full = {
      ...base,
      releases: releases.map(mapRelease),
      popular: tracks.map(mapTrack),
      videos: [...videos].sort(byPublishedDesc).map((v) => ({ id: v.youtube_id, title: v.title })),
      events: events.map((e) => ({ date: e.date, title: e.title, text: e.text, image: e.image }))
    };
  }

  // Популярные треки: свои + все треки чарта, где артист участвует
  const seen = new Set();
  const popular = [...(full.popular || []), ...chart.filter((t) => hasArtist(t.artists, base.name))]
    .filter((t) => (seen.has(trackKey(t)) ? false : seen.add(trackKey(t))))
    .sort(byPopularity);

  return { ...full, popular, releases: sortReleasesNewestFirst(full.releases || []), videos: full.videos || [], events: full.events || [], socials: full.socials || [], next };
}

/** Все релизы видимых артистов от новых к старым */
export async function getReleases() {
  const artists = await getArtists();
  if (!isLive) {
    return uniqueReleases(sortReleasesNewestFirst(ARTISTS.flatMap((a) => (a.releases || []).map((r) => ({ ...r, slug: a.slug })))));
  }
  const visible = new Set(artists.map((a) => a.slug));
  const rows = await cached("releases", () => from("releases", (q) => q.eq("hidden", false).order("sort")));
  return uniqueReleases(sortReleasesNewestFirst(rows.filter((r) => visible.has(r.artist_slug)).map((r) => ({ ...mapRelease(r), slug: r.artist_slug }))));
}

/** Документы без базы: тексты из LEGAL_PAGES и файлы из DOCUMENTS — в том же виде, что из таблицы pages */
const LOCAL_PAGES = [
  ...LEGAL_PAGES.map((p) => ({ ...p, kind: "text", file_url: null, show_in_footer: true })),
  ...DOCUMENTS.map((d, i) => ({ slug: d.slug, title: d.title, kind: "file", file_url: d.url, body: "", sort: 10 + i, show_in_footer: true }))
];

/**
 * Все опубликованные документы по порядку: тексты (kind = text) показываются на /legal,
 * файлы (kind = file) — ссылками. Редактируются в админке → «Документы».
 */
export function getPages() {
  if (!isLive) return Promise.resolve(LOCAL_PAGES);
  return cached("pages", () => from("pages", (q) => q.eq("published", true).order("sort").order("title")));
}

/** Ссылка на документ: файл открывается напрямую, текст — разделом страницы /legal */
export const documentHref = (page) => (page.kind === "file" ? page.file_url : `/legal#${page.slug}`);

const mapMerch = (m) => ({
  id: String(m.id), artist: m.artist_slug, title: m.title, type: m.type, price: m.price,
  image: m.image, gallery: m.gallery ?? [], description: m.description ?? "", sizes: m.sizes ?? [],
  buyUrl: m.buy_url, status: m.status
});

/** Мерч: опубликованные позиции видимых артистов и самого лейбла (artist: null) */
export async function getMerch() {
  if (!isLive) return MERCH.map((m) => ({ ...m, id: String(m.id), status: "soon", gallery: [], description: "", sizes: [] }));
  const rows = await cached("merch", () => from("merch", (q) => q.eq("published", true).order("sort").order("id")));
  return rows.map(mapMerch);
}

/** Соцсети лейбла: из админки (settings.label_socials), без базы — из content.js */
export function getLabelSocials() {
  if (!isLive) return Promise.resolve(LABEL.socials);
  return cached("label_socials", async () => {
    const rows = await from("settings", (q) => q.eq("key", "label_socials"));
    return rows[0]?.value ?? LABEL.socials;
  });
}

/** Предстоящие концерты по дате. Прошедшие скрываются и в локальном режиме. */
export async function getConcerts() {
  const today = todayISO();
  if (!isLive) return CONCERTS.filter((c) => c.date >= today).sort(byDateAsc);
  const visible = new Set((await getArtists()).map((a) => a.slug));
  const rows = await cached("concerts", () => from("concerts", (q) => q.eq("status", "published").gte("date", today).order("date")));
  // Концерты артистов-черновиков не показываем (то же проверяет RLS через artist_visible)
  return rows.filter((c) => visible.has(c.artist_slug));
}

const mapJob = (j) => ({
  slug: j.slug, title: j.title, dept: j.dept, place: j.place, employment: j.employment, salary: j.salary,
  summary: j.summary, tasks: j.tasks || [], requirements: j.requirements || [], niceToHave: j.nice_to_have || [], offer: j.offer || []
});

export async function getJobs() {
  if (!isLive) return JOBS;
  const rows = await from("jobs", (q) => q.eq("published", true).order("sort"));
  return rows.map(mapJob);
}

export async function getTeamPeople() {
  if (!isLive) return TEAM_PEOPLE;
  return from("team_members", (q) => q.eq("published", true).order("sort"));
}

export async function submitBooking(payload) {
  // Бот заполнил поле-ловушку: делаем вид, что всё прошло, ничего не отправляя
  if (isBot(payload)) return { via: "db" };
  payload = cleanPayload(payload, BOOKING_LIMITS);
  if (isLive) {
    const { error } = await supabase.from("booking_requests").insert(payload);
    if (error) throw error;
    return { via: "db" };
  }
  const body = Object.entries(payload).map(([k, v]) => `${k}: ${v || "—"}`).join("\n");
  window.location.href = `mailto:sales@rhymesmusic.com?subject=${encodeURIComponent("Заявка на выступление")}&body=${encodeURIComponent(body)}`;
  return { via: "mail" };
}

export async function submitDemo(payload) {
  if (isBot(payload)) return { via: "db" };
  payload = cleanPayload(payload, DEMO_LIMITS);
  if (isLive) {
    const { error } = await supabase.from("demo_submissions").insert(payload);
    if (error) throw error;
    return { via: "db" };
  }
  const body = Object.entries(payload).map(([k, v]) => `${k}: ${v || "—"}`).join("\n");
  window.location.href = `mailto:demo@rhymesmusic.com?subject=${encodeURIComponent(`Демо: ${payload.artist_name}`)}&body=${encodeURIComponent(body)}`;
  return { via: "mail" };
}

/**
 * Закрытый раздел для организаторов. Пароль проверяет Edge Function на сервере
 * и возвращает временные ссылки на файлы из приватного бакета.
 */
export async function unlockBackstage(slug, password) {
  if (isLive) {
    const { data, error } = await supabase.functions.invoke("backstage", { body: { slug, password } });
    if (error) {
      const status = error.context?.status;
      throw new Error(
        status === 401 ? "Неверный пароль. Запросите доступ у букера лейбла."
          : status === 429 ? "Слишком много попыток. Попробуйте через 15 минут."
            : "Не получилось открыть пресс-кит. Попробуйте позже."
      );
    }
    return { files: data.files, expiresAt: data.expiresAt };
  }
  await new Promise((r) => setTimeout(r, 450));
  if (password !== "demo") throw new Error("Неверный пароль. Запросите доступ у букера лейбла.");
  const files = [
    { name: "Технический райдер", kind: "rider", meta: "PDF, звук и свет", url: null },
    { name: "Бытовой райдер", kind: "rider", meta: "PDF, гримёрка и трансфер", url: null },
    { name: "Stage plot", kind: "rider", meta: "PDF, схема сцены", url: null },
    ...Array.from({ length: 6 }, (_, i) => ({ name: `Промо ${i + 1}`, kind: "photo", meta: "JPG, 4000 px", url: null }))
  ];
  return { files, expiresAt: new Date(Date.now() + 30 * 60_000).toISOString() };
}

/**
 * Счётчик посещаемости: «день + адрес + 1» в базе, без cookies и данных о посетителе.
 * Автотесты и боты (navigator.webdriver) не считаются; ошибки не мешают странице.
 */
export function trackView(pathname) {
  if (!isLive || navigator.webdriver) return;
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  supabase.rpc("track_view", { p_path: path }).then(() => {}, () => {});
}
