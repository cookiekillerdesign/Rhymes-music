// node --test src/lib/markdown.test.js
import { test } from "node:test";
import { strict as assert } from "node:assert";
import { parseInline, parseMarkdown } from "./markdown.js";

test("блоки: заголовки, абзацы, списки", () => {
  const blocks = parseMarkdown("## Политика\nПервая строка\nвторая строка\n\n### Данные\n- имя\n- почта\n\nКонец");
  assert.deepEqual(blocks.map((b) => b.type), ["h2", "p", "h3", "ul", "p"]);
  assert.equal(blocks[1].inline[0].text, "Первая строка вторая строка");
  assert.equal(blocks[3].items.length, 2);
});

test("инлайн: жирный и ссылки только http(s)/mailto", () => {
  assert.deepEqual(parseInline("Пишите на [почту](mailto:office@rhymesmusic.com) **сразу**"), [
    { text: "Пишите на " }, { link: "почту", href: "mailto:office@rhymesmusic.com" }, { text: " " }, { bold: "сразу" },
  ]);
  // javascript: не распознаётся как ссылка — остаётся текстом
  assert.deepEqual(parseInline("[x](javascript:alert(1))"), [{ text: "[x](javascript:alert(1))" }]);
});

test("HTML в тексте остаётся текстом", () => {
  assert.equal(parseMarkdown("<script>alert(1)</script>")[0].inline[0].text, "<script>alert(1)</script>");
});
