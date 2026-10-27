/* Чистые функции «Обзора»: изменение за период и подписи страниц. Покрыты тестами */

/** Изменение к прошлому периоду в процентах; null — сравнивать не с чем */
export function deltaPercent(current, previous) {
  if (!previous) return current > 0 ? null : 0;
  return Math.round(((current - previous) / previous) * 100);
}

const PAGE_LABELS = {
  "/": "Главная", "/artists": "Артисты", "/releases": "Релизы", "/concerts": "Концерты", "/merch": "Мерч",
  "/booking": "Организаторам", "/for-artists": "Артистам", "/team": "Команда", "/jobs": "Вакансии",
  "/contacts": "Контакты", "/legal": "Документы"
};

/** Адрес страницы → понятное название: /artist/dora → «Дора» (по ростеру) */
export function pageLabel(path, artists = []) {
  if (PAGE_LABELS[path]) return PAGE_LABELS[path];
  const artist = path.match(/^\/artist\/([a-z0-9-]+)$/);
  if (artist) return artists.find((a) => a.slug === artist[1])?.name ?? artist[1];
  if (path.startsWith("/jobs/")) return `Вакансия: ${path.slice(6)}`;
  return path;
}

/** Компактное число: 1 234 → «1,2 тыс.» */
export function compactNumber(n) {
  if (n == null) return "—";
  if (n < 10_000) return n.toLocaleString("ru-RU");
  if (n < 1_000_000) return `${(n / 1000).toLocaleString("ru-RU", { maximumFractionDigits: 1 })} тыс.`;
  return `${(n / 1_000_000).toLocaleString("ru-RU", { maximumFractionDigits: 1 })} млн`;
}
