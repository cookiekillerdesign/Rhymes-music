// node --test src/admin/metrics.test.js
import { test } from "node:test";
import { strict as assert } from "node:assert";
import { compactNumber, deltaPercent, pageLabel } from "./metrics.js";

test("изменение к прошлому периоду", () => {
  assert.equal(deltaPercent(150, 100), 50);
  assert.equal(deltaPercent(50, 100), -50);
  assert.equal(deltaPercent(10, 0), null);
  assert.equal(deltaPercent(0, 0), 0);
});

test("подписи страниц", () => {
  const artists = [{ slug: "dora", name: "Дора" }];
  assert.equal(pageLabel("/", artists), "Главная");
  assert.equal(pageLabel("/artist/dora", artists), "Дора");
  assert.equal(pageLabel("/artist/unknown", artists), "unknown");
  assert.equal(pageLabel("/jobs/smm", artists), "Вакансия: smm");
});

test("компактные числа", () => {
  assert.equal(compactNumber(1234), "1 234".replace(" ", "\u00a0"));
  assert.equal(compactNumber(12_400), "12,4 тыс.");
  assert.equal(compactNumber(null), "—");
});
