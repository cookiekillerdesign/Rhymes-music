/*
 * Ядро универсального редактора: описание полей → форма → строка базы и обратно.
 * Чистые функции без React и сети — покрыты тестами (core.test.js).
 *
 * Поле с showIf(form) показывается и проверяется, только когда условие выполнено; иначе в базу
 * уходит hiddenValue (например, пустой текст у документа-файла).
 *
 * Типы полей: text, textarea, markdown, file (ссылка на загруженный файл или внешний адрес), gallery (массив ссылок на фото), number, date, url, select, checkbox, list (строки по одной
 * на строку), image (ссылка на загруженное фото), artist (slug артиста или null), youtube (id ролика
 * из ссылки или id), spotify (album/<id> или track/<id> из ссылки).
 */
import { slugify } from "../fields.js";

const isHttpUrl = (value) => {
  try {
    const u = new URL(value);
    return u.protocol === "https:" || u.protocol === "http:";
  } catch {
    return false;
  }
};

/** Ссылка YouTube в любом виде (watch, youtu.be, shorts, embed) или сам id → id ролика */
export function parseYoutubeId(input) {
  const v = String(input ?? "").trim();
  if (!v) return "";
  if (/^[A-Za-z0-9_-]{11}$/.test(v)) return v;
  const m = v.match(/(?:youtu\.be\/|[?&]v=|\/shorts\/|\/embed\/|\/live\/)([A-Za-z0-9_-]{11})/);
  return m ? m[1] : null;
}

/** Ссылка open.spotify.com/album|track/<id> или «album/<id>» → «album/<id>» */
export function parseSpotifyPath(input) {
  const v = String(input ?? "").trim();
  if (!v) return "";
  const m = v.match(/(album|track)[/:]([A-Za-z0-9]{22})/);
  return m ? `${m[1]}/${m[2]}` : null;
}

const toFormValue = (field, value) => {
  switch (field.type) {
    case "checkbox": return Boolean(value ?? field.default ?? false);
    case "list": return (value ?? []).join("\n");
    case "gallery": return [...(value ?? [])];
    case "number": return value == null ? "" : String(value);
    case "date": return value ? String(value).slice(0, 10) : "";
    case "artist": return value ?? "";
    default: return value ?? field.default ?? "";
  }
};

/** Строка базы (или null для новой записи) → состояние формы */
export function rowToForm(resource, row, defaults = {}) {
  const form = {};
  for (const f of resource.fields) form[f.name] = toFormValue(f, row ? row[f.name] : defaults[f.name] ?? f.default);
  return form;
}

/** Проверка формы: { поле: текст ошибки } */
/** Поля, которые сейчас видны в форме (с учётом showIf) */
export const visibleFields = (fields, form) => fields.filter((f) => !f.showIf || f.showIf(form));

export function validateForm(resource, form) {
  const errors = {};
  for (const f of visibleFields(resource.fields, form)) {
    const raw = form[f.name];
    const value = typeof raw === "string" ? raw.trim() : raw;
    const empty = value === "" || value == null;
    if (f.required && empty && f.type !== "checkbox") { errors[f.name] = "Заполните поле"; continue; }
    if (empty) continue;
    if (f.max && typeof value === "string" && value.length > f.max) errors[f.name] = `Не длиннее ${f.max} знаков`;
    else if ((f.type === "url" || f.type === "file") && !isHttpUrl(value)) errors[f.name] = "Нужна ссылка, начинающаяся с https://";
    else if (f.type === "number" && !(Number.isInteger(Number(value)) && Number(value) >= (f.min ?? 0))) errors[f.name] = "Целое число";
    else if (f.type === "date" && !/^\d{4}-\d{2}-\d{2}$/.test(value)) errors[f.name] = "Дата в формате ГГГГ-ММ-ДД";
    else if (f.type === "youtube" && parseYoutubeId(value) === null) errors[f.name] = "Не похоже на ссылку на ролик YouTube";
    else if (f.type === "spotify" && parseSpotifyPath(value) === null) errors[f.name] = "Нужна ссылка на альбом или трек в Spotify";
    else if (f.type === "slug" && !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(value)) errors[f.name] = "Только латиница, цифры и дефис";
  }
  for (const rule of resource.validate ?? []) Object.assign(errors, rule(form, errors) ?? {});
  return errors;
}

const fromFormValue = (field, value) => {
  const v = typeof value === "string" ? value.trim() : value;
  switch (field.type) {
    case "checkbox": return Boolean(v);
    case "number": return v === "" ? null : Number(v);
    case "list": return String(value ?? "").split("\n").map((s) => s.trim()).filter(Boolean);
    case "gallery": return (value ?? []).filter(Boolean);
    case "youtube": return parseYoutubeId(v) || null;
    case "spotify": return parseSpotifyPath(v) || null;
    case "artist": return v || null;
    default: return v === "" ? (field.required ? "" : null) : v;
  }
};

/** Форма → строка для базы. Поля только для чтения не отправляются */
export function formToRow(resource, form) {
  const row = {};
  for (const f of resource.fields) {
    if (f.readOnly) continue;
    const hidden = f.showIf && !f.showIf(form);
    row[f.name] = hidden ? f.hiddenValue ?? null : fromFormValue(f, form[f.name]);
  }
  return row;
}

/** Для ресурсов с текстовым ключом (вакансии, команда, документы): ключ из названия */
export const keyFromTitle = (title) => slugify(title ?? "");
