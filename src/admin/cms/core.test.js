// node --test src/admin/cms/core.test.js
import { test } from "node:test";
import { strict as assert } from "node:assert";
import { formToRow, parseSpotifyPath, parseYoutubeId, rowToForm, validateForm } from "./core.js";

const RES = {
  fields: [
    { name: "title", type: "text", required: true, max: 10 },
    { name: "price", type: "number" },
    { name: "url", type: "url" },
    { name: "tasks", type: "list" },
    { name: "on", type: "checkbox", default: true },
    { name: "clip", type: "youtube" },
    { name: "sp", type: "spotify" },
    { name: "artist_slug", type: "artist" },
    { name: "id", type: "text", readOnly: true },
  ],
};

test("youtube и spotify: ссылки любых видов", () => {
  assert.equal(parseYoutubeId("https://youtu.be/kNpXyWQEm6g?t=3"), "kNpXyWQEm6g");
  assert.equal(parseYoutubeId("https://www.youtube.com/watch?v=kNpXyWQEm6g&list=x"), "kNpXyWQEm6g");
  assert.equal(parseYoutubeId("https://youtube.com/shorts/kNpXyWQEm6g"), "kNpXyWQEm6g");
  assert.equal(parseYoutubeId("kNpXyWQEm6g"), "kNpXyWQEm6g");
  assert.equal(parseYoutubeId("https://vk.com/video1"), null);
  assert.equal(parseSpotifyPath("https://open.spotify.com/album/41n0ze0qQ6qP1AqFnGhFhb?si=1"), "album/41n0ze0qQ6qP1AqFnGhFhb");
  assert.equal(parseSpotifyPath("track/12VZnNohS3m6Wi0NQhN5JS"), "track/12VZnNohS3m6Wi0NQhN5JS");
  assert.equal(parseSpotifyPath("https://open.spotify.com/artist/abc"), null);
});

test("форма ↔ строка: типы, пустые значения, только чтение", () => {
  const form = rowToForm(RES, null);
  assert.equal(form.on, true);
  assert.equal(form.tasks, "");
  const row = formToRow(RES, { ...form, title: " Худи ", price: "6900", tasks: "a\n\n b ", clip: "https://youtu.be/kNpXyWQEm6g", id: "x" });
  assert.deepEqual(row, { title: "Худи", price: 6900, url: null, tasks: ["a", "b"], on: true, clip: "kNpXyWQEm6g", sp: null, artist_slug: null });
  assert.deepEqual(rowToForm(RES, row).tasks, "a\nb");
});

test("проверка: обязательные, длина, ссылки, числа", () => {
  const errors = validateForm(RES, { ...rowToForm(RES, null), title: "", price: "1.5", url: "javascript:alert(1)", clip: "nope", sp: "x" });
  assert.deepEqual(Object.keys(errors).sort(), ["clip", "price", "sp", "title", "url"]);
  assert.ok(validateForm(RES, { ...rowToForm(RES, null), title: "очень длинное название" }).title);
});

import { visibleFields } from "./core.js";

test("условные поля: скрытые не проверяются и уходят в базу как hiddenValue", () => {
  const RES2 = { fields: [
    { name: "kind", type: "select", default: "text" },
    { name: "body", type: "markdown", required: true, showIf: (f) => f.kind === "text", hiddenValue: "" },
    { name: "file_url", type: "file", required: true, showIf: (f) => f.kind === "file", hiddenValue: null },
  ] };
  const asFile = { kind: "file", body: "", file_url: "" };
  assert.deepEqual(visibleFields(RES2.fields, asFile).map((f) => f.name), ["kind", "file_url"]);
  assert.deepEqual(Object.keys(validateForm(RES2, asFile)), ["file_url"]);
  assert.deepEqual(formToRow(RES2, { ...asFile, file_url: "https://x.ru/a.pdf", body: "забытый текст" }), { kind: "file", body: "", file_url: "https://x.ru/a.pdf" });
  assert.deepEqual(formToRow(RES2, { kind: "text", body: "## Текст", file_url: "https://x.ru/a.pdf" }), { kind: "text", body: "## Текст", file_url: null });
});
