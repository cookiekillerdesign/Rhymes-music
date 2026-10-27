
/** 28 256 972 → «28,3 млн» */
export function formatStreams(n) {
  if (n >= 1e9) return `${(n / 1e9).toFixed(1).replace(".", ",")} млрд`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(1).replace(".", ",")} млн`;
  if (n >= 1e3) return `${Math.round(n / 1e3)} тыс.`;
  return String(n);
}

const df = new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long", year: "numeric" });
export const formatDate = (iso) => df.format(new Date(iso));

const norm = (s) => s.toLowerCase().replace(/ё/g, "е");
/** Есть ли артист в строке исполнителей «Дора, Мэйби Бэйби» */
export const hasArtist = (artists, name) =>
  artists.split(",").some((a) => norm(a.trim()) === norm(name));

export const trackKey = (t) => `${norm(t.title)}|${norm(t.artists)}`;

/**
 * Русская плюрализация: plural(5, ["концерт", "концерта", "концертов"]) → «концертов».
 * @param {number} n
 * @param {[string, string, string]} forms для 1, 2–4 и 5+
 */
export function plural(n, [one, few, many]) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
  return many;
}

/** «4 концерта» */
export const pluralize = (n, forms) => `${n} ${plural(n, forms)}`;

/* ---------- Даты концертов ---------- */
const MONTHS_SHORT = ["янв", "фев", "мар", "апр", "мая", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"];
const MONTHS = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
const WEEKDAYS_SHORT = ["вс", "пн", "вт", "ср", "чт", "пт", "сб"];

/** ISO-дату YYYY-MM-DD разбираем в полдень: день не «уедет» ни в одном часовом поясе. */
const parseISODate = (iso) => new Date(`${iso}T12:00:00`);

export function dateParts(iso) {
  const d = parseISODate(iso);
  return { day: d.getDate(), month: MONTHS_SHORT[d.getMonth()], weekday: WEEKDAYS_SHORT[d.getDay()] };
}

/** «Ноябрь» по ключу «2026-11» */
export const monthName = (monthKey) => MONTHS[Number(monthKey.slice(5, 7)) - 1];

/** Сегодня в формате YYYY-MM-DD по локальному времени, а не UTC */
export function todayISO() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export const byDateAsc = (a, b) => a.date.localeCompare(b.date);

/** Группирует отсортированные по дате события по месяцам: [{ key: "2026-11", items }] */
export function groupByMonth(items) {
  const groups = [];
  for (const item of items) {
    const key = item.date.slice(0, 7);
    const last = groups.at(-1);
    if (last?.key === key) last.items.push(item);
    else groups.push({ key, items: [item] });
  }
  return groups;
}

/**
 * Ссылка для href: только абсолютные http(s). Защищает от javascript:/data: в данных
 * из базы и синхронизации (вторая линия обороны после CHECK в схеме).
 */
export function safeUrl(value) {
  if (typeof value !== "string") return null;
  try {
    const url = new URL(value.trim());
    return url.protocol === "https:" || url.protocol === "http:" ? url.href : null;
  } catch {
    return null;
  }
}

/** Мерч: статусы и цена — общие для каталога и страницы товара */
export const MERCH_STATUS = { soon: "Скоро в продаже", available: "В продаже", sold_out: "Распродано" };
export const formatPrice = (p) => (p == null ? null : `${p.toLocaleString("ru-RU")} ₽`);

/**
 * Стабильный ключ релиза или трека для React. Артист в ключе обязателен: общий релиз двух
 * артистов лейбла приходит дважды с одной ссылкой Spotify.
 */
export const itemKey = (x) => `${x.slug ?? ""}|${x.id ?? x.spotify ?? `${x.title}|${x.artists}|${x.released_on ?? ""}`}`;

/**
 * Общий релиз (фит двух артистов лейбла) в общей ленте показываем один раз:
 * совпадает ссылка Spotify или название вместе с датой выхода. Остаётся первый по порядку.
 */
export function uniqueReleases(releases) {
  const seen = new Set();
  return releases.filter((r) => {
    const keys = [r.spotify, r.released_on ? `${r.title.toLowerCase().replace(/ё/g, "е").replace(/[^\p{L}\p{N}]+/gu, "")}|${r.released_on}` : null].filter(Boolean);
    if (keys.some((k) => seen.has(k))) return false;
    keys.forEach((k) => seen.add(k));
    return true;
  });
}

/** Город для сравнения и фильтров: «г. Москва» и «Москва» — один город */
export const cityKey = (city) => city.trim().replace(/^(г|город)\.?\s+/i, "").toLowerCase().replace(/ё/g, "е");

/** Уникальные значения поля в порядке первого появления */
export const uniqueBy = (items, pick) => [...new Set(items.map(pick))];

/**
 * Релизы от новых к старым. Релизы с датой выхода — по дате (при равенстве — ручной порядок),
 * без даты — после них, по очереди от каждого артиста, чтобы список не шёл блоками по артистам.
 * @template {{ slug: string, released_on?: string | null }} R
 * @param {R[]} releases
 * @returns {R[]}
 */
export function sortReleasesNewestFirst(releases) {
  const dated = releases.filter((r) => r.released_on).sort((a, b) => b.released_on.localeCompare(a.released_on));

  const queues = new Map();
  for (const r of releases) {
    if (r.released_on) continue;
    if (!queues.has(r.slug)) queues.set(r.slug, []);
    queues.get(r.slug).push(r);
  }
  const undated = [];
  const lists = [...queues.values()];
  for (let i = 0; lists.some((l) => i < l.length); i++) {
    for (const l of lists) if (i < l.length) undated.push(l[i]);
  }
  return [...dated, ...undated];
}
