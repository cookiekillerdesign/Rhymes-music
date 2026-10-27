/* Место в Supabase: замер из базы (admin_usage) + лимиты тарифа. Чистые функции покрыты тестами. */

const MB = 1024 ** 2;
const GB = 1024 ** 3;

/**
 * Лимиты тарифов Supabase (октябрь 2026). SQL их не отдаёт, поэтому они здесь.
 * Тариф выбирается переменной VITE_SUPABASE_PLAN; точные цифры можно переопределить
 * VITE_DB_LIMIT_MB и VITE_STORAGE_LIMIT_MB, если лимиты изменились.
 */
const PLANS = {
  free: { label: "Free", databaseBytes: 500 * MB, storageBytes: 1 * GB },
  pro: { label: "Pro", databaseBytes: 8 * GB, storageBytes: 100 * GB },
};

export function getLimits(env = import.meta.env) {
  const plan = PLANS[env.VITE_SUPABASE_PLAN] ?? PLANS.free;
  const mb = (value) => (Number(value) > 0 ? Number(value) * MB : null);
  return {
    plan: plan.label,
    databaseBytes: mb(env.VITE_DB_LIMIT_MB) ?? plan.databaseBytes,
    storageBytes: mb(env.VITE_STORAGE_LIMIT_MB) ?? plan.storageBytes,
  };
}

const UNITS = ["Б", "КБ", "МБ", "ГБ", "ТБ"];

/** 1536 → «1,5 КБ»; двоичные единицы, как в панели Supabase */
export function formatBytes(bytes) {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 Б";
  const i = Math.min(UNITS.length - 1, Math.floor(Math.log(bytes) / Math.log(1024)));
  const value = bytes / 1024 ** i;
  const digits = i === 0 || value >= 100 ? 0 : value >= 10 ? 1 : 2;
  return `${value.toLocaleString("ru-RU", { maximumFractionDigits: digits })} ${UNITS[i]}`;
}

/** Занято, свободно, процент и уровень тревоги для шкалы */
export function meter(usedBytes, limitBytes) {
  const used = Math.max(0, usedBytes);
  const free = Math.max(0, limitBytes - used);
  const percent = limitBytes > 0 ? Math.min(100, (used / limitBytes) * 100) : 0;
  const level = percent >= 95 ? "error" : percent >= 80 ? "warning" : "ok";
  return { used, free, limit: limitBytes, percent, level };
}
