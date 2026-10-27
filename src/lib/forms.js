/*
 * Ограничения полей заявок. Те же цифры проверяет база (ограничения booking_lengths и demo_lengths
 * в schema.sql) — здесь они нужны, чтобы человек упёрся в лимит в форме, а не получил ошибку сервера.
 */
export const BOOKING_LIMITS = { artists: 1000, format: 60, city: 120, date: 40, capacity: 40, contact_name: 200, contact: 200, comment: 2000 };
export const DEMO_LIMITS = { artist_name: 120, city: 120, track_url: 500, socials: 500, about: 2000, contact: 200 };

/** Обрезает пробелы и длину по лимитам; лишние поля отбрасывает */
export function cleanPayload(data, limits) {
  return Object.fromEntries(
    Object.entries(limits).map(([key, max]) => [key, String(data[key] ?? "").trim().slice(0, max) || null])
  );
}

/** Скрытое поле-ловушка: человек его не видит, бот заполняет. Имя совпадает с колонкой website в базе */
export const HONEYPOT = "website";
export const isBot = (data) => Boolean(String(data[HONEYPOT] ?? "").trim());

/** Понятный текст ошибки отправки: лимит частоты из базы или общий */
export function submitErrorMessage(error, fallback) {
  if (error?.message?.includes("rate_limited") || error?.code === "P0001") return "Слишком много заявок подряд. Попробуйте через 10 минут.";
  return fallback;
}
