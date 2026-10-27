// node --test src/lib/format.test.js
import { test } from "node:test";
import { strict as assert } from "node:assert";
import { sortReleasesNewestFirst } from "./format.js";

test("релизы: новые с датой впереди, без даты — по очереди от каждого артиста", () => {
  const list = [
    { slug: "a", title: "a1" },
    { slug: "a", title: "a2" },
    { slug: "b", title: "b1" },
    { slug: "a", title: "a3", released_on: "2024-01-01" },
    { slug: "c", title: "c1", released_on: "2026-05-01" },
    { slug: "b", title: "b2" },
  ];
  assert.deepEqual(sortReleasesNewestFirst(list).map((r) => r.title), ["c1", "a3", "a1", "b1", "a2", "b2"]);
});

test("исходный массив не меняется", () => {
  const list = [{ slug: "a", title: "x", released_on: "2020-01-01" }, { slug: "a", title: "y", released_on: "2026-01-01" }];
  sortReleasesNewestFirst(list);
  assert.equal(list[0].title, "x");
});


import { cleanPayload, isBot, submitErrorMessage } from "./forms.js";

test("заявки: обрезка по лимитам, ловушка для ботов, текст ошибки лимита частоты", () => {
  assert.deepEqual(cleanPayload({ city: "  Москва ", contact: "x".repeat(300), extra: "лишнее" }, { city: 120, contact: 200 }), {
    city: "Москва",
    contact: "x".repeat(200),
  });
  assert.equal(cleanPayload({ city: "   " }, { city: 10 }).city, null);
  assert.ok(isBot({ website: "http://spam" }));
  assert.ok(!isBot({ website: "" }));
  assert.match(submitErrorMessage({ message: "rate_limited" }, "общая"), /10 минут/);
  assert.equal(submitErrorMessage(new Error("network"), "общая"), "общая");
});

import { safeUrl } from "./format.js";

test("safeUrl: только абсолютные http(s)", () => {
  assert.equal(safeUrl("javascript:alert(1)"), null);
  assert.equal(safeUrl("/relative"), null);
  assert.equal(safeUrl(" https://afisha.yandex.ru/x "), "https://afisha.yandex.ru/x");
  assert.equal(safeUrl(null), null);
});

import { itemKey, uniqueReleases } from "./format.js";

test("общий релиз двух артистов — один раз в ленте, ключи разные у разных артистов", () => {
  const a = { slug: "finik", title: "Снежинки", spotify: "track/x", released_on: "2023-12-01" };
  const b = { slug: "aleks-ataman", title: "Снежинки", spotify: "track/x", released_on: "2023-12-01" };
  const c = { slug: "dora", title: "Снежинки", released_on: "2020-01-01" };
  assert.deepEqual(uniqueReleases([a, b, c]).map((r) => r.slug), ["finik", "dora"]);
  assert.notEqual(itemKey(a), itemKey(b));
  // без ссылки Spotify — по названию и дате
  const d = { slug: "x", title: "Капли!", released_on: "2022-04-01" }, e = { slug: "y", title: "капли", released_on: "2022-04-01" };
  assert.equal(uniqueReleases([d, e]).length, 1);
});

test("общий релиз без ссылки Spotify узнаётся по названию и дате", () => {
  const d = { slug: "x", title: "Капли!", released_on: "2022-04-01" };
  const e = { slug: "y", title: "капли", released_on: "2022-04-01" };
  assert.equal(uniqueReleases([d, e]).length, 1);
});
