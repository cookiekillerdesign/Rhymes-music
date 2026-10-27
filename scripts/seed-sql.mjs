/*
 * Собирает supabase/seed.sql из локального каталога — для заливки данных без Node и ключей:
 * открыть Supabase → SQL Editor, вставить файл, Run. Работает так же бережно, как npm run seed:
 * добавляет только отсутствующее (артисты — по slug, релизы и треки — по названию, клипы — по id,
 * концерты — по дате и городу), у существующих релизов дописывает пустые дату и обложку.
 * Запуск: npm run seed:sql
 */
import { writeFileSync } from "node:fs";
import { ARTISTS, CHART, CONCERTS, DOCUMENTS, JOBS, LABEL, LEGAL_PAGES, MERCH, TEAM_PEOPLE } from "../src/data/content.js";

const q = (v) => (v === null || v === undefined ? "null" : `'${String(v).replace(/'/g, "''")}'`);
const arr = (a) => `array[${(a ?? []).map(q).join(", ")}]::text[]`;
const json = (v) => `${q(JSON.stringify(v ?? []))}::jsonb`;
const values = (rows) => rows.map((r) => `  (${r.join(", ")})`).join(",\n");

// Те же ключи, что в seed.mjs: регистр, ё/е и пунктуация не важны, скобки значимы
const TITLE_KEY = (col) => `regexp_replace(translate(lower(${col}), 'ё', 'е'), '[^[:alnum:]()]+', '', 'g')`;
const CITY_KEY = (col) => `translate(lower(regexp_replace(trim(${col}), '^(г|город)\\.?\\s+', '', 'i')), 'ё', 'е')`;

const parts = [`-- Сгенерировано scripts/seed-sql.mjs ${new Date().toISOString().slice(0, 10)}. Можно запускать повторно.
begin;
`];

parts.push(`insert into artists (slug, name, tagline, bio, photo, palette, socials, sort) values
${values(ARTISTS.map((a, i) => [q(a.slug), q(a.name), q(a.tagline), q(a.bio), q(a.photo), arr(a.palette), json(a.socials), i]))}
on conflict (slug) do nothing;
`);

const releases = ARTISTS.flatMap((a) => (a.releases ?? []).map((r, i) => [
  q(a.slug), q(r.title), q(r.artists), q(r.type), q(r.cover), q(r.preview), q(r.spotify), r.released_on ? `${q(r.released_on)}::date` : "null::date", i
]));
parts.push(`create temp table _rel (artist_slug text, title text, artists text, type text, cover text, preview text, spotify text, released_on date, sort int) on commit drop;
insert into _rel values
${values(releases)};
insert into releases (artist_slug, title, artists, type, cover, preview, spotify, released_on, sort)
select n.* from _rel n
where exists (select 1 from artists a where a.slug = n.artist_slug)
  and not exists (select 1 from releases e where e.artist_slug = n.artist_slug and ${TITLE_KEY("e.title")} = ${TITLE_KEY("n.title")});
update releases e set released_on = coalesce(e.released_on, n.released_on), cover = coalesce(e.cover, n.cover)
from _rel n
where e.artist_slug = n.artist_slug and ${TITLE_KEY("e.title")} = ${TITLE_KEY("n.title")}
  and ((e.released_on is null and n.released_on is not null) or (e.cover is null and n.cover is not null));
`);

const tracks = ARTISTS.flatMap((a) => (a.popular ?? []).map((t) => [q(a.slug), q(t.title), q(t.artists), t.streams ?? 0, q(t.cover), q(t.preview), q(t.spotify)]));
parts.push(`create temp table _trk (artist_slug text, title text, artists text, streams bigint, cover text, preview text, spotify text) on commit drop;
insert into _trk values
${values(tracks)};
insert into tracks (artist_slug, title, artists, streams, cover, preview, spotify, in_chart)
select n.*, false from _trk n
where exists (select 1 from artists a where a.slug = n.artist_slug)
  and not exists (select 1 from tracks e where e.artist_slug = n.artist_slug and not e.in_chart and ${TITLE_KEY("e.title")} = ${TITLE_KEY("n.title")});
`);

const bySlug = (name) => ARTISTS.find((a) => a.name.toLowerCase() === name.toLowerCase())?.slug ?? null;
const chart = CHART.map((t) => [q(bySlug(t.artists.split(",")[0].trim())), q(t.title), q(t.artists), t.streams ?? 0, q(t.cover), q(t.preview), q(t.spotify)]);
parts.push(`-- Чарт лейбла: только если его ещё нет
insert into tracks (artist_slug, title, artists, streams, cover, preview, spotify, in_chart)
select v.*, true from (values
${values(chart)}
) as v(artist_slug, title, artists, streams, cover, preview, spotify)
where not exists (select 1 from tracks where in_chart);
`);

const videos = ARTISTS.flatMap((a) => (a.videos ?? []).map((v, i) => [q(a.slug), q(v.id), q(v.title), i]));
parts.push(`insert into videos (artist_slug, youtube_id, title, sort)
select v.* from (values
${values(videos)}
) as v(artist_slug, youtube_id, title, sort)
where exists (select 1 from artists a where a.slug = v.artist_slug)
  and not exists (select 1 from videos e where e.artist_slug = v.artist_slug and e.youtube_id = v.youtube_id);
`);

const events = ARTISTS.flatMap((a) => (a.events ?? []).map((e) => [q(a.slug), `${q(e.date)}::date`, q(e.title), q(e.text), q(e.image)]));
if (events.length) parts.push(`insert into events (artist_slug, date, title, text, image)
select v.* from (values
${values(events)}
) as v(artist_slug, date, title, text, image)
where exists (select 1 from artists a where a.slug = v.artist_slug)
  and not exists (select 1 from events e where e.artist_slug = v.artist_slug and e.date = v.date and ${TITLE_KEY("e.title")} = ${TITLE_KEY("v.title")});
`);

const concerts = CONCERTS.map((c) => [q(c.artist_slug), `${q(c.date)}::date`, q(c.city), q(c.venue), q(c.ticket_url)]);
parts.push(`insert into concerts (artist_slug, date, city, venue, ticket_url)
select v.* from (values
${values(concerts)}
) as v(artist_slug, date, city, venue, ticket_url)
where exists (select 1 from artists a where a.slug = v.artist_slug)
  and not exists (select 1 from concerts e where e.artist_slug = v.artist_slug and e.date = v.date and ${CITY_KEY("e.city")} = ${CITY_KEY("v.city")});
`);

parts.push(`-- Мерч — примеры: неопубликованные, существующие (артист + название) не трогаем
insert into merch (artist_slug, title, type, price, sort, published)
select v.artist_slug, v.title, v.type, v.price, v.sort, false from (values
${values(MERCH.map((m, i) => [q(m.artist), q(m.title), q(m.type), m.price ?? "null::int", i]))}
) as v(artist_slug, title, type, price, sort)
where (v.artist_slug is null or exists (select 1 from artists a where a.slug = v.artist_slug))
  and not exists (select 1 from merch e where e.artist_slug is not distinct from v.artist_slug and ${TITLE_KEY("e.title")} = ${TITLE_KEY("v.title")});
`);

parts.push(`-- Соцсети лейбла: начальный список, дальше правятся в админке → «Лейбл»
insert into settings (key, value) values ('label_socials', ${json(LABEL.socials)})
on conflict (key) do nothing;
`);

parts.push(`-- Документы: создаются, если их нет; отредактированные в админке не перезаписываются
insert into pages (slug, title, body, sort, kind, file_url) values
${values([
  ...LEGAL_PAGES.map((p) => [q(p.slug), q(p.title), q(p.body), p.sort, q("text"), "null"]),
  ...DOCUMENTS.map((d, i) => [q(d.slug), q(d.title), q(""), 10 + i, q("file"), q(d.url)])
])}
on conflict (slug) do nothing;
`);

parts.push(`-- Вакансии и люди — примеры: заливаются неопубликованными и не перезаписываются
insert into jobs (slug, title, dept, place, employment, salary, summary, tasks, requirements, nice_to_have, offer, sort, published) values
${values(JOBS.map((j, i) => [q(j.slug), q(j.title), q(j.dept), q(j.place), q(j.employment), q(j.salary), q(j.summary), arr(j.tasks), arr(j.requirements), arr(j.niceToHave), arr(j.offer), i, "false"]))}
on conflict (slug) do nothing;
insert into team_members (id, name, role, dept, sort, published) values
${values(TEAM_PEOPLE.map((p, i) => [q(p.id), q(p.name), q(p.role), q(p.dept), i, "false"]))}
on conflict (id) do nothing;

commit;
`);

writeFileSync("supabase/seed.sql", parts.join("\n"));
console.log(`supabase/seed.sql: ${ARTISTS.length} артистов, ${releases.length} релизов, ${tracks.length} треков, ${videos.length} клипов, ${concerts.length} концертов`);
