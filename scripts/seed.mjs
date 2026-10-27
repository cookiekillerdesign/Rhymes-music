/*
 * Заливает локальный каталог (src/data/content.js) в Supabase.
 *
 *   VITE_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npm run seed            — бережно
 *   VITE_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npm run seed -- --force  — перезаписать
 *
 * Бережный режим (по умолчанию) ничего не удаляет и не перезаписывает: добавляет новых
 * артистов и записи каталога, которых в базе ещё нет (релиз — по названию, клип — по id,
 * концерт — по дате и городу), а у уже существующих релизов дописывает пустые дату и обложку.
 * Правки из админки и найденное синхронизацией остаются. Удалённое в админке вернётся —
 * чтобы убрать запись насовсем, её лучше скрыть (hidden), а не удалять.
 *
 * --force заменяет ручные записи (source = 'manual') каталогом и обновляет профили
 * артистов из content.js. Записи синхронизации (source = 'spotify', 'youtube', …) не трогает.
 */
import { createClient } from "@supabase/supabase-js";
import { ARTISTS, CHART, CONCERTS, DOCUMENTS, JOBS, LABEL, LEGAL_PAGES, MERCH, TEAM_PEOPLE } from "../src/data/content.js";

const url = process.env.VITE_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceKey) {
  console.error("Задайте VITE_SUPABASE_URL и SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}
const force = process.argv.includes("--force");
const db = createClient(url, serviceKey, { auth: { persistSession: false } });

const must = ({ data, error }) => {
  if (error) throw error;
  return data;
};
const report = [];

/* ---------- Артисты ---------- */
const artistRows = ARTISTS.map((a, i) => ({
  slug: a.slug, name: a.name, tagline: a.tagline ?? null, bio: a.bio ?? null, photo: a.photo ?? null,
  palette: a.palette, socials: a.socials ?? [], sort: i
}));
const insertedArtists = must(await db.from("artists").upsert(artistRows, { onConflict: "slug", ignoreDuplicates: !force }).select("slug"));
report.push(`артисты: ${force ? "обновлено" : "добавлено новых"} ${insertedArtists.length}`);

const titleKey = (t) => String(t ?? "").toLowerCase().replace(/ё/g, "е").replace(/[^\p{L}\p{N}()]+/gu, "");
const cityKey = (c) => String(c ?? "").trim().replace(/^(г|город)\.?\s+/i, "").toLowerCase().replace(/ё/g, "е");

/** Ключ записи для сравнения каталога с базой: что считать «тем же самым» */
const KEYS = {
  releases: (r) => `${r.artist_slug}|${titleKey(r.title)}`,
  tracks: (r) => `${r.artist_slug}|${titleKey(r.title)}`,
  videos: (r) => `${r.artist_slug}|${r.youtube_id}`,
  events: (r) => `${r.artist_slug}|${r.date}|${titleKey(r.title)}`,
  concerts: (r) => `${r.artist_slug}|${r.date}|${cityKey(r.city)}`
};

/**
 * Заливает строки каталога в таблицу.
 * --force: удаляет ручные строки этих артистов и вставляет каталог заново.
 * Бережно: вставляет только отсутствующие по ключу; у релизов дописывает пустые дату и обложку.
 */
async function seedTable(table, rowsBySlug, { hasSource = true } = {}) {
  const slugs = Object.keys(rowsBySlug);
  const rows = slugs.flatMap((s) => rowsBySlug[s]);
  if (force) {
    const del = db.from(table).delete().in("artist_slug", slugs);
    must(await (hasSource ? del.eq("source", "manual") : del));
    if (rows.length) must(await db.from(table).insert(rows));
    report.push(`${table}: заменено ${rows.length}`);
    return;
  }

  const existing = must(await db.from(table).select("*").in("artist_slug", slugs));
  const byKey = new Map(existing.map((r) => [KEYS[table](r), r]));
  const missing = rows.filter((r) => !byKey.has(KEYS[table](r)));
  if (missing.length) must(await db.from(table).insert(missing));

  let patched = 0;
  if (table === "releases") {
    for (const r of rows) {
      const known = byKey.get(KEYS.releases(r));
      if (!known) continue;
      const patch = {
        ...(!known.released_on && r.released_on ? { released_on: r.released_on } : {}),
        ...(!known.cover && r.cover ? { cover: r.cover } : {})
      };
      if (!Object.keys(patch).length) continue;
      must(await db.from("releases").update(patch).eq("id", known.id));
      patched++;
    }
  }
  report.push(`${table}: +${missing.length}${patched ? `, дополнено ${patched}` : ""}`);
}

const group = (items) => Object.fromEntries(ARTISTS.map((a) => [a.slug, items(a)]).filter(([, rows]) => rows.length));

await seedTable("releases", group((a) => (a.releases ?? []).map((r, i) => ({
  artist_slug: a.slug, sort: i, title: r.title, artists: r.artists, type: r.type, cover: r.cover ?? null,
  preview: r.preview ?? null, spotify: r.spotify ?? null, released_on: r.released_on ?? null
}))));
await seedTable("tracks", group((a) => (a.popular ?? []).map((t) => ({
  artist_slug: a.slug, in_chart: false, title: t.title, artists: t.artists, streams: t.streams ?? 0,
  cover: t.cover ?? null, preview: t.preview ?? null, spotify: t.spotify ?? null
}))));
await seedTable("videos", group((a) => (a.videos ?? []).map((v, i) => ({ artist_slug: a.slug, youtube_id: v.id, title: v.title, sort: i }))));
await seedTable("events", group((a) => (a.events ?? []).map((e) => ({ artist_slug: a.slug, ...e }))), { hasSource: false });
const concertsBySlug = {};
for (const c of CONCERTS) {
  (concertsBySlug[c.artist_slug] ??= []).push({ artist_slug: c.artist_slug, date: c.date, city: c.city, venue: c.venue, ticket_url: c.ticket_url });
}
await seedTable("concerts", concertsBySlug);

/* ---------- Чарт лейбла ---------- */
const bySlug = (name) => ARTISTS.find((a) => a.name.toLowerCase() === name.toLowerCase())?.slug ?? null;
const chartRows = CHART.map((t) => ({
  artist_slug: bySlug(t.artists.split(",")[0].trim()), in_chart: true, title: t.title, artists: t.artists,
  streams: t.streams ?? 0, cover: t.cover ?? null, preview: t.preview ?? null, spotify: t.spotify ?? null
}));
const chartExists = must(await db.from("tracks").select("id").eq("in_chart", true).limit(1)).length > 0;
if (force) must(await db.from("tracks").delete().eq("in_chart", true).eq("source", "manual"));
if (force || !chartExists) must(await db.from("tracks").insert(chartRows));
report.push(`чарт: ${force || !chartExists ? `+${chartRows.length}` : "уже есть, не трогаем"}`);

/* ---------- Мерч: примеры, заливаются неопубликованными; существующие (по артисту и названию) не трогаем ---------- */
const existingMerch = must(await db.from("merch").select("artist_slug, title"));
const merchKey = (m) => `${m.artist_slug ?? ""}|${titleKey(m.title)}`;
const knownMerch = new Set(existingMerch.map(merchKey));
const merchRows = MERCH.map((m, i) => ({ artist_slug: m.artist, title: m.title, type: m.type, price: m.price ?? null, sort: i, published: false }))
  .filter((m) => !knownMerch.has(merchKey(m)));
if (merchRows.length) must(await db.from("merch").insert(merchRows));
report.push(`merch: +${merchRows.length}`);

/* ---------- Соцсети лейбла: начальный список; правки из админки не перезаписываются ---------- */
must(await db.from("settings").upsert({ key: "label_socials", value: LABEL.socials }, { onConflict: "key", ignoreDuplicates: true }));

/* ---------- Документы: создаются, если их нет; отредактированные в админке не перезаписываются ---------- */
must(await db.from("pages").upsert([
  ...LEGAL_PAGES.map((p) => ({ ...p, kind: "text" })),
  ...DOCUMENTS.map((d, i) => ({ slug: d.slug, title: d.title, body: "", kind: "file", file_url: d.url, sort: 10 + i }))
], { onConflict: "slug", ignoreDuplicates: true }));

/* ---------- Вакансии и люди: примеры, заливаются неопубликованными и не перезаписываются ---------- */
must(await db.from("jobs").upsert(
  JOBS.map(({ niceToHave, ...j }, i) => ({ ...j, nice_to_have: niceToHave, sort: i, published: false })),
  { onConflict: "slug", ignoreDuplicates: true }
));
must(await db.from("team_members").upsert(
  TEAM_PEOPLE.map((p, i) => ({ ...p, sort: i, published: false })),
  { onConflict: "id", ignoreDuplicates: true }
));

console.log(`Готово (${force ? "--force" : "бережный режим"}):\n  ${report.join("\n  ")}`);
