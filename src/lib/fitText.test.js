// node --test src/lib/fitText.test.js
import { test } from "node:test";
import { strict as assert } from "node:assert";
import { fitScale } from "./fitText.js";

// Модель текста: ширина строки 100, текст длиной textWidth при scale=1, переносы по словам
const model = (textWidth, longestWord = 0) => (scale) => ({
  lines: Math.ceil((textWidth * scale) / 100),
  overflowsX: longestWord * scale > 100,
});

test("короткий текст остаётся в полном размере", () => {
  assert.deepEqual(fitScale(model(80), { maxLines: 2, minScale: 0.4 }), { scale: 1, fits: true });
});

test("длинный текст уменьшается до двух строк, но не сильнее нужного", () => {
  const { scale, fits } = fitScale(model(300), { maxLines: 2, minScale: 0.4 });
  assert.ok(fits);
  assert.ok(scale <= 200 / 300 && scale > 200 / 300 - 0.02, `scale=${scale}`);
});

test("длинное слово уменьшает шрифт, пока не перестанет вылезать по ширине", () => {
  const { scale } = fitScale(model(150, 160), { maxLines: 2, minScale: 0.4 });
  assert.ok(scale <= 100 / 160 && scale > 100 / 160 - 0.02, `scale=${scale}`);
});

test("не влезает даже на минимуме — сообщаем, чтобы включилась обрезка", () => {
  assert.deepEqual(fitScale(model(1000), { maxLines: 2, minScale: 0.4 }), { scale: 0.4, fits: false });
});
