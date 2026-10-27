// Тесты чистой логики синхронизации: deno test supabase/functions/sync-catalog
import { strict as assert } from "node:assert";
import { test } from "node:test";
import {
  bioFromExtract,
  cityKey,
  cleanVideoTitle,
  clipsFromUploads,
  concertKey,
  dedupeReleases,
  eventsFromBandsintown,
  eventsFromJsonLd,
  extractJsonLd,
  isClipTitle,
  isMusicianPage,
  mapDeezerAlbum,
  mapDeezerTrack,
  mapSpotifyAlbum,
  mapSpotifyTrack,
  mentionsArtist,
  mergeSocials,
  normalizeReleaseDate,
  pickDeezerArtist,
  pickSpotifyArtist,
  pickYoutubeChannel,
  safeHttpUrl,
  sameKey,
  taglineFromGenres,
  textKey,
  titleKey,
} from "./lib.ts";

const TODAY = "2026-10-22";
const dora = { slug: "dora", name: "Дора" };

test("даты релизов Spotify разной точности", () => {
  assert.equal(normalizeReleaseDate("2024", "year"), "2024-01-01");
  assert.equal(normalizeReleaseDate("2024-05", "month"), "2024-05-01");
  assert.equal(normalizeReleaseDate("2024-05-17", "day"), "2024-05-17");
  assert.equal(normalizeReleaseDate(undefined), null);
});

test("альбом Spotify → строка релиза; EP распознаётся по числу треков", () => {
  const row = mapSpotifyAlbum({
    id: "abc",
    name: "Папик",
    album_type: "single",
    total_tracks: 1,
    release_date: "2026-09-12",
    images: [{ url: "small", width: 64 }, { url: "big", width: 640 }],
    artists: [{ name: "Дора" }, { name: "OG Buda" }],
  }, "dora");
  assert.deepEqual(row, {
    artist_slug: "dora",
    external_id: "spotify:abc",
    source: "spotify",
    title: "Папик",
    artists: "Дора, OG Buda",
    type: "Сингл",
    cover: "big",
    spotify: "album/abc",
    released_on: "2026-09-12",
  });
  assert.equal(mapSpotifyAlbum({ id: "e", name: "x", album_type: "single", total_tracks: 5 }, "dora").type, "EP");
  assert.equal(mapSpotifyAlbum({ id: "a", name: "x", album_type: "album" }, "dora").type, "Альбом");
});

test("ключи дедупликации", () => {
  assert.equal(concertKey("dora", "2026-11-13", "г. Москва"), concertKey("dora", "2026-11-13", "москва"));
  assert.equal(titleKey("Боже, храни кьют-рок!"), titleKey("боже храни кьютрок"));
  assert.notEqual(titleKey("Капли"), titleKey("Капли (Remix)"));
});

const page = `
<html><head>
<script type="application/ld+json">{ broken json </script>
<script type="application/ld+json">
{"@context":"https://schema.org","@graph":[
  {"@type":"MusicEvent","name":"Дора. Большой тур","startDate":"2026-11-13T20:00:00+03:00",
   "location":{"@type":"Place","name":"Duplex","address":{"@type":"PostalAddress","addressLocality":"Москва"}},
   "offers":[{"@type":"Offer","url":"https://tickets.example/msk"}]},
  {"@type":"MusicEvent","name":"Другой артист","startDate":"2026-11-14","location":{"name":"Клуб","address":"Москва, ул. Пушкина"}},
  {"@type":"Event","name":"Концерт","performer":{"@type":"Person","name":"Дора"},"startDate":"2026-12-01",
   "location":{"name":"Огни Уфы","address":"Уфа, проспект Октября 1"},"url":"https://tickets.example/ufa"},
  {"@type":"MusicEvent","name":"Дора","startDate":"2026-01-01","location":{"name":"Прошедший","address":"Казань"}},
  {"@type":"MusicEvent","name":"Дора","startDate":"2026-11-13","location":{"name":"Duplex","address":{"addressLocality":"г. Москва"}}}
]}
</script></head></html>`;

test("JSON-LD: только события артиста, будущие, без дублей; битый блок не ломает разбор", () => {
  const events = eventsFromJsonLd(extractJsonLd(page), dora, "https://afisha.example/dora", TODAY);
  assert.deepEqual(events.map((e) => [e.date, e.city, e.venue, e.ticket_url]), [
    ["2026-11-13", "Москва", "Duplex", "https://tickets.example/msk"],
    ["2026-12-01", "Уфа", "Огни Уфы", "https://tickets.example/ufa"],
  ]);
  assert.equal(events[0].source, "afisha.example");
});

test("Bandsintown → концерты, прошедшие и без города отбрасываются", () => {
  const events = eventsFromBandsintown(
    [
      { datetime: "2026-11-15T19:00:00", venue: { name: "Onyx", city: "Saratov" }, offers: [{ url: "https://bit.example/1" }] },
      { datetime: "2025-01-01T19:00:00", venue: { name: "Old", city: "Moscow" } },
      { datetime: "2026-12-01T19:00:00", venue: { name: "No city" } },
    ],
    "dora",
    TODAY,
  );
  assert.equal(events.length, 1);
  assert.equal(events[0].ticket_url, "https://bit.example/1");
  assert.equal(events[0].source, "bandsintown");
});

test("поиск Spotify: только единственное точное совпадение, тёзки — на ручную проверку", () => {
  const hits = [
    { id: "fake", name: "Дора Explorer" },
    { id: "real", name: "Дора" },
  ];
  assert.deepEqual(pickSpotifyArtist(hits, "Дора"), { status: "found", id: "real" });
  assert.deepEqual(pickSpotifyArtist(hits, "Мукка"), { status: "not_found" });
  assert.deepEqual(pickSpotifyArtist([{ id: "k", name: "кис-кис" }], "Кис Кис"), { status: "found", id: "k" });
  const twins = pickSpotifyArtist([{ id: "a", name: "Дора" }, { id: "b", name: "ДОРА" }], "Дора");
  assert.equal(twins.status, "ambiguous");
  assert.deepEqual(twins.status === "ambiguous" && twins.candidates.map((c) => c.id), ["a", "b"]);
});

test("жанры Spotify → подпись по-русски", () => {
  assert.equal(taglineFromGenres(["russian hip hop", "russian trap", "russian pop"]), "Рэп · трэп");
  assert.equal(taglineFromGenres(["russian pop punk", "russian rock"]), "Панк · рок");
  assert.equal(taglineFromGenres(["obscure-genre"]), null);
  assert.equal(taglineFromGenres([]), null);
});

test("топ-трек Spotify → строка трека", () => {
  const row = mapSpotifyTrack({
    id: "t1",
    name: "Втюрилась",
    popularity: 71,
    artists: [{ name: "Дора" }],
    album: { images: [{ url: "c", width: 640 }] },
  }, "dora");
  assert.deepEqual(row, {
    artist_slug: "dora",
    external_id: "spotify:track:t1",
    source: "spotify",
    title: "Втюрилась",
    artists: "Дора",
    cover: "c",
    spotify: "track/t1",
    popularity: 71,
  });
});

test("клипы: по названию, без тизеров и лайвов; имя артиста — целым словом", () => {
  assert.ok(isClipTitle("Дора - Втюрилась (Official Video)"));
  assert.ok(isClipTitle("Дети Rave — Качает | Премьера клипа"));
  assert.ok(!isClipTitle("Дора - тизер нового клипа"));
  assert.ok(!isClipTitle("Дора - Втюрилась (Live)"));
  assert.ok(!isClipTitle("Дора — интервью"));
  assert.ok(mentionsArtist("ДОРА - Папик (Official Video)", "Дора"));
  assert.ok(!mentionsArtist("Пандора - Песня (Official Video)", "Дора"));
  assert.equal(cleanVideoTitle("Дора - Втюрилась (Official Video)", "Дора"), "Втюрилась");
  assert.equal(cleanVideoTitle("Дора feat. Мэйби Бэйби - Барбисайз [Official Music Video]", "Дора"), "Барбисайз");
});

test("клипы с канала лейбла раскладываются по артисту из названия", () => {
  const uploads = [
    { snippet: { title: "Дора - Папик (Official Video)", publishedAt: "2026-09-12T10:00:00Z", resourceId: { videoId: "v1" } } },
    { snippet: { title: "Мукка - Дом (Official Video)", resourceId: { videoId: "v2" } } },
    { snippet: { title: "Дора - тизер", resourceId: { videoId: "v3" } } },
  ];
  const clips = clipsFromUploads(uploads, dora, true);
  assert.deepEqual(clips.map((c) => [c.youtube_id, c.title, c.published_at]), [["v1", "Папик", "2026-09-12T10:00:00Z"]]);
  assert.equal(clipsFromUploads(uploads, dora, false).length, 2); // свой канал: имя в названии не требуется
});

test("канал YouTube: имя совпадает, приписки Official/Music допускаются", () => {
  const hits = [
    { id: { channelId: "UCfan" }, snippet: { channelTitle: "Дора фанклуб" } },
    { id: { channelId: "UCreal" }, snippet: { channelTitle: "ДОРА Official" } },
  ];
  assert.equal(pickYoutubeChannel(hits, "Дора"), "UCreal");
  assert.equal(pickYoutubeChannel(hits, "Мукка"), null);
});

test("Википедия: только статья о музыканте с тем же именем; био обрезается по предложениям", () => {
  const summary = {
    type: "standard",
    title: "Дора (певица)",
    description: "российская певица",
    extract: "Да́рья Шихано́ва[1], известная как Дора, — российская певица. Родилась в 1999 году. Третье предложение.",
  };
  assert.ok(isMusicianPage(summary, "Дора"));
  assert.ok(
    !isMusicianPage({ ...summary, description: "персонаж мультсериала", extract: "Дора — героиня мультфильма." }, "Дора"),
  );
  assert.ok(!isMusicianPage({ ...summary, type: "disambiguation" }, "Дора"));
  assert.equal(bioFromExtract(summary.extract, 70), "Дарья Шиханова, известная как Дора, — российская певица.");
});

test("ссылки на площадки добавляются, только если их ещё нет", () => {
  const merged = mergeSocials([{ name: "spotify", url: "old" }], [{ name: "Spotify", url: "new" }, {
    name: "YouTube",
    url: "yt",
  }]);
  assert.deepEqual(merged, [{ name: "spotify", url: "old" }, { name: "YouTube", url: "yt" }]);
});

test("ключи: любые алфавиты, пустой ключ ни с чем не совпадает", () => {
  assert.equal(textKey("Їжак"), "іжак");
  assert.equal(textKey("Café"), "cafe");
  assert.equal(textKey("🔥🔥"), "");
  assert.ok(!sameKey(textKey("🔥"), textKey("!!!")));
  assert.notEqual(titleKey("Капли"), titleKey("Капли (Remix)"));
  assert.equal(cityKey("г. Москва"), cityKey("Москва"));
});

test("имя артиста ищется целым словом", () => {
  assert.ok(!mentionsArtist("Мотив — Песня (Official Video)", "Мот"));
  assert.ok(mentionsArtist("Мот — Песня (Official Video)", "Мот"));
});

test("ссылки: только http(s), относительные — от страницы-источника", () => {
  assert.equal(safeHttpUrl("javascript:alert(1)"), null);
  assert.equal(safeHttpUrl("data:text/html,x"), null);
  assert.equal(safeHttpUrl("/buy/1", "https://afisha.example/dora"), "https://afisha.example/buy/1");
  assert.equal(safeHttpUrl("/buy/1"), null);
  assert.equal(safeHttpUrl(42), null);
});

test("афиша с javascript:-ссылкой: билет ведёт на страницу-источник", () => {
  const html = `<script type="application/ld+json">{"@type":"MusicEvent","name":"Дора","startDate":"2026-12-01",
    "location":{"name":"Клуб","address":"Тула"},"offers":{"url":"javascript:alert(document.cookie)"}}</script>`;
  const [event] = eventsFromJsonLd(extractJsonLd(html), dora, "https://afisha.example/dora", TODAY);
  assert.equal(event.ticket_url, "https://afisha.example/dora");
});

test("региональные дубли альбомов Spotify схлопываются", () => {
  const rows = [
    { title: "MISS", type: "Альбом", released_on: "2022-06-03", id: 1 },
    { title: "MISS", type: "Альбом", released_on: "2022-06-03", id: 2 },
    { title: "MISS", type: "Альбом", released_on: "2023-01-01", id: 3 }, // переиздание — другой релиз
  ];
  assert.deepEqual(dedupeReleases(rows).map((r) => r.id), [1, 3]);
});

test("Deezer: точное имя; из тёзок — явный лидер по фанатам, иначе на выбор", () => {
  assert.deepEqual(pickDeezerArtist([{ id: 57812002, name: "дора", nb_fan: 39977 }], "Дора"), {
    status: "found",
    id: "57812002",
  });
  const leader = pickDeezerArtist([{ id: 1, name: "Дора", nb_fan: 40000 }, { id: 2, name: "ДОРА", nb_fan: 120 }], "Дора");
  assert.deepEqual(leader, { status: "found", id: "1" });
  assert.equal(
    pickDeezerArtist([{ id: 1, name: "Дора", nb_fan: 500 }, { id: 2, name: "Дора", nb_fan: 300 }], "Дора").status,
    "ambiguous",
  );
  assert.equal(pickDeezerArtist([{ id: 3, name: "Дора Explorer" }], "Дора").status, "not_found");
});

test("альбом Deezer → релиз с обложкой 1000 px и датой", () => {
  const row = mapDeezerAlbum(
    {
      id: 1058935332,
      title: "Верю",
      record_type: "single",
      release_date: "2026-08-21",
      cover_xl: "https://cdn-images.dzcdn.net/images/cover/401674d6/1000x1000-000000-80-0-0.jpg",
      artist: { name: "дора" },
    },
    "dora",
    "Дора",
  );
  assert.deepEqual(row, {
    artist_slug: "dora",
    external_id: "deezer:1058935332",
    source: "deezer",
    title: "Верю",
    artists: "Дора",
    type: "Сингл",
    cover: "https://cdn-images.dzcdn.net/images/cover/401674d6/1000x1000-000000-80-0-0.jpg",
    spotify: null,
    released_on: "2026-08-21",
  });
  assert.equal(mapDeezerAlbum({ id: 1, title: "LOVESONGS", record_type: "album" }, "dora", "Дора").type, "Альбом");
  assert.equal(mapDeezerAlbum({ id: 2, title: "X", cover_xl: "javascript:alert(1)" }, "dora", "Дора").cover, null);
});

test("топ-трек Deezer: соавторы и рейтинг", () => {
  const t = mapDeezerTrack({ id: 7, title: "ЗНАК", rank: 612345, contributors: [{ name: "Toxi$" }, { name: "дора" }] }, "dora");
  assert.equal(t.artists, "Toxi$, дора");
  assert.equal(t.popularity, 612345);
  assert.equal(t.external_id, "deezer:track:7");
});
