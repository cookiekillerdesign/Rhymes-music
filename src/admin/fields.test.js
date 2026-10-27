// Тесты чистой логики админки: node --test src/admin
import { test } from "node:test";
import { strict as assert } from "node:assert";
import { artistToForm, formToArtist, parseSpotifyArtistId, parseYoutubeChannelId, slugify, validateArtist } from "./fields.js";
import { checkPhotoSize } from "./photoSpec.js";

test("адрес страницы из имени", () => {
  assert.equal(slugify("Наверное Радость"), "navernoe-radost");
  assert.equal(slugify("Смысла.net"), "smysla-net");
  assert.equal(slugify("Дети Rave"), "deti-rave");
  assert.equal(slugify("  кис-кис!  "), "kis-kis");
  assert.equal(slugify("Щёкотка Шрёдингера"), "schekotka-shredingera");
});

test("Spotify: ссылка, URI или id; чужое — null", () => {
  const id = "4Z8W4fKeB5YxbusRsdQVPb";
  assert.equal(parseSpotifyArtistId(`https://open.spotify.com/artist/${id}?si=abc`), id);
  assert.equal(parseSpotifyArtistId(`spotify:artist:${id}`), id);
  assert.equal(parseSpotifyArtistId(id), id);
  assert.equal(parseSpotifyArtistId("https://open.spotify.com/album/41n0ze0qQ6qP1AqFnGhFhb"), null);
  assert.equal(parseSpotifyArtistId(""), "");
});

test("YouTube: только id канала UC…", () => {
  const id = "UCd6y_bszkqUMoYBCtZt5w1Q";
  assert.equal(parseYoutubeChannelId(`https://www.youtube.com/channel/${id}/videos`), id);
  assert.equal(parseYoutubeChannelId(id), id);
  assert.equal(parseYoutubeChannelId("https://www.youtube.com/@kiskisnotdead"), null);
});

test("проверка размера фото", () => {
  assert.equal(checkPhotoSize(1200, 800).level, "error");
  assert.equal(checkPhotoSize(1800, 1200).level, "warning");
  assert.equal(checkPhotoSize(2000, 3000).level, "warning"); // вертикальное
  assert.equal(checkPhotoSize(3000, 2000).level, "ok");
});

test("форма: ошибки и сохранение без лишних полей", () => {
  const form = { ...artistToForm(null), name: "Лорэн", slug: "loren" };
  assert.deepEqual(validateArtist(form, { isNew: true, takenSlugs: new Set() }), {});
  assert.equal(validateArtist(form, { isNew: true, takenSlugs: new Set(["loren"]) }).slug, "Такой адрес уже занят другим артистом");
  assert.ok(validateArtist({ ...form, slug: "Лорэн" }, { isNew: true, takenSlugs: new Set() }).slug);
  assert.ok(validateArtist({ ...form, tourSources: "http://insecure.example" }, { isNew: true, takenSlugs: new Set() }).tourSources);

  const row = formToArtist({
    ...form,
    spotifyInput: "https://open.spotify.com/artist/4Z8W4fKeB5YxbusRsdQVPb",
    socials: [{ name: "VK", url: "https://vk.com/x" }, { name: "", url: "" }],
    tourSources: "https://a.example/tour\n\n https://b.example \n"
  });
  assert.equal(row.spotify_id, "4Z8W4fKeB5YxbusRsdQVPb");
  assert.deepEqual(row.socials, [{ name: "VK", url: "https://vk.com/x" }]);
  assert.deepEqual(row.tour_sources, ["https://a.example/tour", "https://b.example"]);
  assert.equal(row.hidden, true); // новый артист — черновик, пока не включат «Показывать на сайте»
});

import { toSort } from "./fields.js";

test("адрес страницы не кончается дефисом после обрезки до 60 символов", () => {
  const slug = slugify(`${"а".repeat(59)} б`);
  assert.ok(!slug.endsWith("-"), slug);
  assert.ok(slug.length <= 60);
});

test("порядок: целое число в пределах int", () => {
  assert.equal(toSort("1.7"), 1);
  assert.equal(toSort("-2.9"), -2);
  assert.equal(toSort("1e12"), 1_000_000);
  assert.equal(toSort("abc"), 0);
});

test("переписанное био сбрасывает ссылку на Википедию, нетронутое — нет", () => {
  const original = { name: "Лорэн", slug: "loren", bio: "Из Википедии", bio_source: "https://ru.wikipedia.org/wiki/x" };
  const form = artistToForm(original);
  assert.equal("bio_source" in formToArtist(form, original), false);
  assert.equal(formToArtist({ ...form, bio: "Своими словами" }, original).bio_source, null);
});

import { parseDeezerArtistId } from "./fields.js";

test("Deezer: ссылка с языком и без, id; чужое — null", () => {
  assert.equal(parseDeezerArtistId("https://www.deezer.com/ru/artist/57812002"), "57812002");
  assert.equal(parseDeezerArtistId("https://deezer.com/artist/57812002?app_id=1"), "57812002");
  assert.equal(parseDeezerArtistId("57812002"), "57812002");
  assert.equal(parseDeezerArtistId("https://www.deezer.com/album/1058935332"), null);
  assert.equal(parseDeezerArtistId(""), "");
});

import { moveItem } from "./fields.js";

test("перестановка: вверх, вниз, за границы, на месте", () => {
  const l = ["a", "b", "c", "d"];
  assert.deepEqual(moveItem(l, 3, 0), ["d", "a", "b", "c"]);
  assert.deepEqual(moveItem(l, 0, 2), ["b", "c", "a", "d"]);
  assert.deepEqual(moveItem(l, 1, 99), ["a", "c", "d", "b"]);
  assert.equal(moveItem(l, 2, 2), l);
  assert.deepEqual(l, ["a", "b", "c", "d"]); // исходный массив не меняется
});
