// node --test src/admin/usage.test.js
import { test } from "node:test";
import { strict as assert } from "node:assert";
import { formatBytes, getLimits, meter } from "./usage.js";

test("единицы измерения", () => {
  assert.equal(formatBytes(0), "0 Б");
  assert.equal(formatBytes(512), "512 Б");
  assert.equal(formatBytes(1536), "1,5 КБ");
  assert.equal(formatBytes(500 * 1024 ** 2), "500 МБ");
  assert.equal(formatBytes(1024 ** 3), "1 ГБ");
  assert.equal(formatBytes(12.345 * 1024 ** 2), "12,3 МБ");
});

test("шкала: свободно, процент, уровни", () => {
  const GB = 1024 ** 3;
  assert.deepEqual(meter(0.25 * GB, GB), { used: 0.25 * GB, free: 0.75 * GB, limit: GB, percent: 25, level: "ok" });
  assert.equal(meter(0.85 * GB, GB).level, "warning");
  assert.equal(meter(0.97 * GB, GB).level, "error");
  const over = meter(1.2 * GB, GB);
  assert.equal(over.free, 0);
  assert.equal(over.percent, 100);
});

test("лимиты: тариф по умолчанию Free, переопределение в МБ", () => {
  assert.equal(getLimits({}).plan, "Free");
  assert.equal(getLimits({}).storageBytes, 1024 ** 3);
  assert.equal(getLimits({ VITE_SUPABASE_PLAN: "pro" }).databaseBytes, 8 * 1024 ** 3);
  assert.equal(getLimits({ VITE_STORAGE_LIMIT_MB: "2048" }).storageBytes, 2 * 1024 ** 3);
});
