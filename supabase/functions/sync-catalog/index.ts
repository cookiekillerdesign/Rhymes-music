// Edge Function: заполняет и обновляет страницы артистов лейбла.
//
// Для каждого артиста с auto_sync = true:
//   1. Находит источники, если их не задали вручную: Spotify, YouTube-канал, статью Википедии.
//      Ищется только точное совпадение имени; результат помечается в artists.resolved для проверки.
//   2. Дополняет профиль — только пустые поля: фото, подпись по жанрам, био, ссылки на площадки.
//   3. Релизы и популярные треки (Spotify), клипы (канал артиста и канал лейбла),
//      концерты (афиши и Bandsintown, на модерацию).
//
// Запуск: по расписанию (supabase/cron.sql) или вручную:
//   curl -X POST "$URL/functions/v1/sync-catalog" -H "x-sync-secret: $SYNC_SECRET" -d '{"artist":"dora"}'
//
// Секреты: SYNC_SECRET, SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET.
// Необязательно: YOUTUBE_API_KEY, LABEL_YOUTUBE_CHANNEL_ID, BANDSINTOWN_APP_ID,
//                AUTO_PUBLISH_SOURCES (источники концертов без модерации), SPOTIFY_MARKET.
// Деплой: supabase functions deploy sync-catalog --no-verify-jwt
import { createClient, type SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";
import {
  bioFromExtract,
  clipsFromUploads,
  concertKey,
  dedupeReleases,
  isMusicianPage,
  largestImage,
  mapDeezerAlbum,
  mapDeezerTrack,
  mapSpotifyAlbum,
  mapSpotifyTrack,
  mergeSocials,
  pickDeezerArtist,
  pickSpotifyArtist,
  pickYoutubeChannel,
  safeHttpUrl,
  sameKey,
  taglineFromGenres,
  titleKey,
} from "./lib.ts";
import { env, errorText } from "./http.ts";
import * as spotify from "./sources/spotify.ts";
import * as deezer from "./sources/deezer.ts";
import * as youtube from "./sources/youtube.ts";
import * as wikipedia from "./sources/wikipedia.ts";
import { collectConcerts } from "./sources/tours.ts";

/** Повторный поиск источника, который не нашёлся, — не чаще раза в неделю */
const RETRY_NOT_FOUND_MS = 7 * 24 * 3600_000;

type Social = { name: string; url: string };
type Resolution = {
  status: "auto" | "not_found" | "ambiguous";
  at: string;
  /** Тёзки в Spotify: админ выбирает нужного, вставив ссылку вручную */
  candidates?: { id: string; name: string }[];
};

type Artist = {
  slug: string;
  name: string;
  photo: string | null;
  tagline: string | null;
  bio: string | null;
  bio_source: string | null;
  socials: Social[] | null;
  spotify_id: string | null;
  deezer_id: string | null;
  youtube_channel_id: string | null;
  wikipedia_title: string | null;
  bandsintown_name: string | null;
  tour_sources: string[] | null;
  resolved: Record<string, Resolution> | null;
};

type Report = {
  slug: string;
  found: string[];
  profile: string[];
  releases: number;
  tracks: number;
  videos: number;
  concerts: number;
  errors: string[];
};

const safeEqual = (a: string, b: string) => {
  if (!a || a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
};

/** Сегодня по Москве: даты концертов в базе локальные */
const todayMoscow = () => new Date(Date.now() + 3 * 3600_000).toISOString().slice(0, 10);

const shouldSearch = (artist: Artist, source: string) => {
  const last = artist.resolved?.[source];
  return !last || last.status === "auto" || Date.now() - Date.parse(last.at) > RETRY_NOT_FOUND_MS;
};

/** Выполняет шаг и складывает ошибку в отчёт, не прерывая остальные шаги */
async function step(report: Report, name: string, fn: () => Promise<void>) {
  try {
    await fn();
  } catch (e) {
    report.errors.push(`${name}: ${errorText(e)}`);
  }
}

/* ---------- 1. Поиск источников ---------- */

async function resolveSources(artist: Artist, report: Report): Promise<Partial<Artist>> {
  const patch: Partial<Artist> = {};
  const resolved = { ...(artist.resolved ?? {}) };
  const mark = (source: string, found: boolean) => {
    resolved[source] = { status: found ? "auto" : "not_found", at: new Date().toISOString() };
    if (found) report.found.push(source);
  };

  if (!artist.spotify_id && spotify.isConfigured() && shouldSearch(artist, "spotify")) {
    await step(report, "поиск Spotify", async () => {
      const match = pickSpotifyArtist(await spotify.searchArtists(artist.name), artist.name);
      if (match.status === "found") {
        patch.spotify_id = match.id;
        mark("spotify", true);
      } else if (match.status === "ambiguous") {
        // Несколько тёзок: не угадываем, а оставляем выбор админу
        resolved.spotify = { status: "ambiguous", at: new Date().toISOString(), candidates: match.candidates };
        report.errors.push(`Spotify: несколько артистов с именем «${artist.name}» — выберите нужного в админке`);
      } else {
        mark("spotify", false);
      }
    });
  }

  if (!artist.deezer_id && shouldSearch(artist, "deezer")) {
    await step(report, "поиск Deezer", async () => {
      const match = pickDeezerArtist(await deezer.searchArtists(artist.name), artist.name);
      if (match.status === "found") {
        patch.deezer_id = match.id;
        mark("deezer", true);
      } else if (match.status === "ambiguous") {
        resolved.deezer = { status: "ambiguous", at: new Date().toISOString(), candidates: match.candidates };
        report.errors.push(`Deezer: несколько артистов с именем «${artist.name}» — выберите нужного в админке`);
      } else {
        mark("deezer", false);
      }
    });
  }

  if (!artist.youtube_channel_id && youtube.isConfigured() && shouldSearch(artist, "youtube")) {
    await step(report, "поиск YouTube", async () => {
      const channelId = pickYoutubeChannel(await youtube.searchChannels(artist.name), artist.name);
      if (channelId) patch.youtube_channel_id = channelId;
      mark("youtube", Boolean(channelId));
    });
  }

  if (!artist.wikipedia_title && !artist.bio && shouldSearch(artist, "wikipedia")) {
    await step(report, "поиск Википедии", async () => {
      for (const title of await wikipedia.searchTitles(artist.name)) {
        if (isMusicianPage(await wikipedia.getSummary(title), artist.name)) {
          patch.wikipedia_title = title;
          break;
        }
      }
      mark("wikipedia", Boolean(patch.wikipedia_title));
    });
  }

  if (JSON.stringify(resolved) !== JSON.stringify(artist.resolved ?? {})) patch.resolved = resolved;
  return patch;
}

/* ---------- 2. Профиль: только пустые поля ---------- */

async function fillProfile(artist: Artist, report: Report): Promise<Partial<Artist>> {
  const patch: Partial<Artist> = {};
  const links: Social[] = [];

  if (artist.deezer_id && !artist.photo) {
    await step(report, "профиль Deezer", async () => {
      const profile = await deezer.getArtist(artist.deezer_id!);
      const photo = safeHttpUrl(profile.picture_xl);
      // У артистов без фото Deezer отдаёт заглушку с пустым хешем в пути
      if (photo && !photo.includes("/images/artist//")) patch.photo = photo;
    });
  }

  if (artist.spotify_id) {
    await step(report, "профиль Spotify", async () => {
      const profile = await spotify.getArtist(artist.spotify_id!);
      const photo = largestImage(profile.images);
      if (!artist.photo && !patch.photo && photo) patch.photo = photo; // фото Deezer (1000 px) приоритетнее
      const tagline = taglineFromGenres(profile.genres);
      if (!artist.tagline && tagline) patch.tagline = tagline;
      links.push({ name: "Spotify", url: `https://open.spotify.com/artist/${artist.spotify_id}` });
    });
  }

  if (artist.youtube_channel_id) {
    links.push({ name: "YouTube", url: `https://www.youtube.com/channel/${artist.youtube_channel_id}` });
  }

  if (!artist.bio && artist.wikipedia_title) {
    await step(report, "био из Википедии", async () => {
      const summary = await wikipedia.getSummary(artist.wikipedia_title!);
      if (!isMusicianPage(summary, artist.name)) return;
      patch.bio = bioFromExtract(summary.extract);
      patch.bio_source = summary.content_urls?.desktop?.page ?? null;
    });
  }

  const socials = mergeSocials(artist.socials ?? [], links);
  if (socials.length !== (artist.socials ?? []).length) patch.socials = socials;

  report.profile.push(...Object.keys(patch).filter((k) => k !== "bio_source"));
  return patch;
}

/* ---------- 3. Каталог ---------- */

/** Вставка без дублей: конфликт по (artist_slug, external_id) пропускается, а не роняет всю пачку */
async function insertNew(db: SupabaseClient, table: string, rows: Record<string, unknown>[]): Promise<number> {
  if (!rows.length) return 0;
  const { data, error } = await db.from(table)
    .upsert(rows, { onConflict: "artist_slug,external_id", ignoreDuplicates: true })
    .select("id");
  if (error) throw error;
  return data?.length ?? 0;
}

type ReleaseCandidate = {
  artist_slug: string;
  external_id: string;
  source: string;
  title: string;
  artists: string;
  type: string;
  cover: string | null;
  spotify: string | null;
  released_on: string | null;
};

/**
 * Сливает релизы источника с базой. Совпадение — по external_id, ссылке Spotify или названию:
 * релиз из второго источника не дублируется, а только дописывает пустые дату и обложку.
 */
async function mergeReleases(db: SupabaseClient, artist: Artist, candidates: ReleaseCandidate[]): Promise<number> {
  const rows = dedupeReleases(candidates);

  const { data: existing, error } = await db.from("releases")
    .select("id, spotify, external_id, title, released_on, cover")
    .eq("artist_slug", artist.slug);
  if (error) throw error;

  // Совпадение с известным релизом: по id Spotify, по ссылке или по названию
  // (вручную синглы часто заведены ссылкой на трек, а не на альбом)
  const findExisting = (r: (typeof rows)[number]) =>
    existing.find((e) =>
      e.external_id === r.external_id || (r.spotify !== null && e.spotify === r.spotify) ||
      sameKey(titleKey(e.title ?? ""), titleKey(r.title))
    );

  const added = await insertNew(db, "releases", rows.filter((r) => !findExisting(r)));

  for (const r of rows) {
    const known = findExisting(r);
    if (!known) continue;
    // Найденные синхронизацией обновляем целиком; у внесённых вручную только дополняем
    // пустую дату и обложку — без даты релиз не встанет на своё место в ленте «новые впереди»
    const patch = known.external_id === r.external_id
      ? { title: r.title, artists: r.artists, cover: r.cover, released_on: r.released_on }
      : { ...(known.released_on ? {} : { released_on: r.released_on }), ...(known.cover ? {} : { cover: r.cover }) };
    if (!Object.keys(patch).length) continue;
    const { error: updateError } = await db.from("releases").update(patch).eq("id", known.id);
    if (updateError) throw updateError;
  }
  return added;
}

const syncSpotifyReleases = async (db: SupabaseClient, artist: Artist) =>
  mergeReleases(db, artist, (await spotify.getAlbums(artist.spotify_id!)).map((a) => mapSpotifyAlbum(a, artist.slug)));

const syncDeezerReleases = async (db: SupabaseClient, artist: Artist) =>
  mergeReleases(db, artist, (await deezer.getAlbums(artist.deezer_id!)).map((a) => mapDeezerAlbum(a, artist.slug, artist.name)));

/**
 * «Популярное»: топ-треки Spotify (только с Extended Quota Mode — с марта 2026 в Development Mode
 * их нет) или Deezer (рейтинг rank). Выпавшие из топа треки этого источника удаляются;
 * скрытые админом не возвращаются.
 */
type TrackCandidate = {
  artist_slug: string;
  external_id: string;
  source: string;
  title: string;
  artists: string;
  cover: string | null;
  spotify: string | null;
  popularity: number;
};

async function mergeTracks(db: SupabaseClient, artist: Artist, rows: TrackCandidate[], source: string): Promise<number> {
  const { data: existing, error } = await db.from("tracks")
    .select("id, spotify, external_id, title, source, hidden")
    .eq("artist_slug", artist.slug);
  if (error) throw error;
  const findExisting = (t: (typeof rows)[number]) =>
    existing.find((e) =>
      e.external_id === t.external_id || (t.spotify !== null && e.spotify === t.spotify) ||
      sameKey(titleKey(e.title ?? ""), titleKey(t.title))
    );

  const added = await insertNew(db, "tracks", rows.filter((t) => !findExisting(t)));

  for (const t of rows) {
    const known = findExisting(t);
    if (!known || known.external_id !== t.external_id) continue;
    const { error: updateError } = await db.from("tracks").update({ popularity: t.popularity, cover: t.cover }).eq(
      "id",
      known.id,
    );
    if (updateError) throw updateError;
  }

  const current = new Set(rows.map((t) => t.external_id));
  const dropped = existing.filter((e) => e.source === source && !e.hidden && e.external_id && !current.has(e.external_id));
  if (dropped.length) {
    const { error: deleteError } = await db.from("tracks").delete().in("id", dropped.map((e) => e.id));
    if (deleteError) throw deleteError;
  }
  return added;
}

// deno-lint-ignore no-explicit-any -- элементы ленты YouTube разбирает clipsFromUploads
async function syncVideos(db: SupabaseClient, artist: Artist, labelUploads: any[]): Promise<number> {
  const candidates = [
    ...(artist.youtube_channel_id ? clipsFromUploads(await youtube.getUploads(artist.youtube_channel_id), artist, false) : []),
    ...clipsFromUploads(labelUploads, artist, true),
  ];
  if (!candidates.length) return 0;

  const { data: existing, error } = await db.from("videos").select("youtube_id").eq("artist_slug", artist.slug);
  if (error) throw error;
  const known = new Set(existing.map((v) => v.youtube_id));
  const fresh = [...new Map(candidates.map((v) => [v.youtube_id, v])).values()].filter((v) => !known.has(v.youtube_id));
  return insertNew(db, "videos", fresh);
}

async function syncConcerts(db: SupabaseClient, artist: Artist, today: string, errors: string[]): Promise<number> {
  const candidates = await collectConcerts(artist, today, errors);
  if (!candidates.length) return 0;

  const { data: existing, error } = await db.from("concerts")
    .select("id, external_id, source, date, city")
    .eq("artist_slug", artist.slug)
    .gte("date", today);
  if (error) throw error;

  // Ключ считаем и для ручных записей без external_id, чтобы не плодить дубли
  const byKey = new Map(existing.map((c) => [c.external_id ?? concertKey(artist.slug, c.date, c.city), c]));
  const trusted = new Set(env("AUTO_PUBLISH_SOURCES").split(",").map((s) => s.trim()).filter(Boolean));

  const added = await insertNew(
    db,
    "concerts",
    candidates.filter((c) => !byKey.has(c.external_id)).map((c) => ({
      ...c,
      status: trusted.has(c.source) ? "published" : "pending",
    })),
  );

  // Площадку и билеты обновляем только у записей, пришедших автоматически
  for (const c of candidates) {
    const row = byKey.get(c.external_id);
    if (!row || row.source === "manual") continue;
    const { error: updateError } = await db.from("concerts")
      .update({ venue: c.venue, ticket_url: c.ticket_url, updated_at: new Date().toISOString() })
      .eq("id", row.id);
    if (updateError) throw updateError;
  }
  return added;
}

/* ---------- Артист целиком ---------- */

// deno-lint-ignore no-explicit-any
async function syncArtist(db: SupabaseClient, input: Artist, today: string, labelUploads: any[]): Promise<Report> {
  const report: Report = { slug: input.slug, found: [], profile: [], releases: 0, tracks: 0, videos: 0, concerts: 0, errors: [] };
  let artist = input;

  const save = async (patch: Partial<Artist>) => {
    if (!Object.keys(patch).length) return;
    const { error } = await db.from("artists").update(patch).eq("slug", artist.slug);
    if (error) throw error;
    artist = { ...artist, ...patch };
  };

  await step(report, "источники", async () => save(await resolveSources(artist, report)));
  await step(report, "профиль", async () => save(await fillProfile(artist, report)));

  // Релизы: Deezer (обложки 1000 px, точные даты) и Spotify (ссылки для плеера) дополняют друг друга
  if (artist.deezer_id) {
    await step(report, "релизы Deezer", async () => void (report.releases += await syncDeezerReleases(db, artist)));
  }
  if (artist.spotify_id) {
    await step(report, "релизы Spotify", async () => void (report.releases += await syncSpotifyReleases(db, artist)));
  }
  // «Популярное»: Spotify при расширенной квоте, иначе рейтинг Deezer
  if (artist.spotify_id && spotify.hasExtendedQuota()) {
    await step(report, "треки Spotify", async () => {
      const rows = (await spotify.getTopTracks(artist.spotify_id!)).map((t) => mapSpotifyTrack(t, artist.slug));
      report.tracks = await mergeTracks(db, artist, rows, "spotify");
    });
  } else if (artist.deezer_id) {
    await step(report, "треки Deezer", async () => {
      const rows = (await deezer.getTopTracks(artist.deezer_id!)).map((t) => mapDeezerTrack(t, artist.slug));
      report.tracks = await mergeTracks(db, artist, rows, "deezer");
    });
  }
  if (youtube.isConfigured()) {
    await step(report, "клипы", async () => void (report.videos = await syncVideos(db, artist, labelUploads)));
  }
  await step(report, "концерты", async () => void (report.concerts = await syncConcerts(db, artist, today, report.errors)));
  // Отметка для очереди: в следующий запуск первыми пойдут те, кто дольше не обновлялся
  await step(report, "отметка", async () => {
    const { error } = await db.from("artists").update({ synced_at: new Date().toISOString() }).eq("slug", artist.slug);
    if (error) throw error;
  });
  return report;
}

const ARTIST_COLUMNS =
  "slug, name, photo, tagline, bio, bio_source, socials, spotify_id, deezer_id, youtube_channel_id, wikipedia_title, bandsintown_name, tour_sources, resolved";

// Админка вызывает функцию из браузера
const CORS = {
  "access-control-allow-origin": "*",
  "access-control-allow-headers": "authorization, apikey, content-type, x-client-info, x-sync-secret",
  "access-control-allow-methods": "POST, OPTIONS",
};
const json = (body: unknown, status = 200) => Response.json(body, { status, headers: CORS });

/** Доступ: расписание с SYNC_SECRET или вошедший в админку пользователь с ролью admin */
/**
 * Доступ: расписание (заголовок x-sync-secret) или вошедший в админку пользователь с ролью admin.
 * Секрет расписания сверяется с секретом функции SYNC_SECRET, а если он не задан — с секретом
 * в Vault базы (его создаёт cron.sql сам, вводить руками ничего не нужно).
 */
async function isAuthorized(req: Request, db: SupabaseClient): Promise<boolean> {
  const candidate = req.headers.get("x-sync-secret") ?? "";
  if (candidate) {
    if (env("SYNC_SECRET")) return safeEqual(candidate, env("SYNC_SECRET"));
    const { data, error } = await db.rpc("check_sync_secret", { candidate });
    if (!error && data === true) return true;
  }
  const token = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return false;
  const { data } = await db.auth.getUser(token);
  return data.user?.app_metadata?.role === "admin";
}

/** Сколько артистов обрабатывать за вызов и сколько времени тратить (лимит Edge Functions — 150 с) */
const BATCH_SIZE = () => Number(env("SYNC_BATCH_SIZE")) || 6;
const TIME_BUDGET_MS = 100_000;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: CORS });
  if (req.method !== "POST") return json({ error: "method not allowed" }, 405);

  const db = createClient(env("SUPABASE_URL"), env("SUPABASE_SERVICE_ROLE_KEY"));
  if (!(await isAuthorized(req, db))) return json({ error: "unauthorized" }, 401);

  // Тело может быть пустым, null или не объектом — это не повод падать
  const body: unknown = await req.json().catch(() => null);
  const onlySlug = body && typeof body === "object" && typeof (body as { artist?: unknown }).artist === "string"
    ? (body as { artist: string }).artist
    : null;
  const started = Date.now();
  const startedAt = new Date(started).toISOString();

  // Пачка: либо один артист по запросу из админки, либо те, кто дольше всех не обновлялся
  let query = db.from("artists").select(ARTIST_COLUMNS).eq("auto_sync", true);
  query = onlySlug
    ? query.eq("slug", onlySlug)
    : query.order("synced_at", { ascending: true, nullsFirst: true }).limit(BATCH_SIZE());
  const { data: artists, error } = await query;
  if (error) return json({ error: error.message }, 500);

  // Канал лейбла читаем один раз: клипы с него раскладываются по артистам по имени в названии
  const runErrors: string[] = [];
  let labelUploads: unknown[] = [];
  const labelChannel = env("LABEL_YOUTUBE_CHANNEL_ID");
  if (labelChannel && youtube.isConfigured()) {
    try {
      labelUploads = await youtube.getUploads(labelChannel);
    } catch (e) {
      runErrors.push(`канал лейбла: ${errorText(e)}`);
    }
  }

  const today = todayMoscow();
  const reports: Report[] = [];
  const skipped: string[] = [];
  // Последовательно: бережём лимиты Spotify, YouTube и сайтов-афиш. Не начинаем нового
  // артиста, если время на исходе, — он пойдёт первым в следующем запуске.
  for (const artist of artists as Artist[]) {
    if (Date.now() - started > TIME_BUDGET_MS) {
      skipped.push(artist.slug);
      continue;
    }
    reports.push(await syncArtist(db, artist, today, labelUploads));
  }

  const total = (key: "releases" | "tracks" | "videos" | "concerts") => reports.reduce((n, r) => n + r[key], 0);
  const summary = {
    artists: reports.length,
    postponed: skipped,
    sourcesFound: reports.flatMap((r) => r.found.map((s) => `${r.slug}: ${s}`)),
    profilesFilled: reports.filter((r) => r.profile.length).map((r) => `${r.slug}: ${r.profile.join(", ")}`),
    releases: total("releases"),
    tracks: total("tracks"),
    videos: total("videos"),
    concertsForReview: total("concerts"),
    errors: [...runErrors, ...reports.flatMap((r) => r.errors.map((e) => `${r.slug}: ${e}`))],
  };
  await db.from("sync_runs").insert({ started_at: startedAt, finished_at: new Date().toISOString(), summary, reports });

  return json(summary);
});
