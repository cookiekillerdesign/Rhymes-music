/* Общий доступ к таблицам для универсального редактора (клиент админки — с сессией админа) */
import { adminClient as db } from "../client";
import { todayISO } from "../../lib/format";

const must = ({ data, error }) => {
  if (error) throw error;
  return data;
};

/**
 * Список записей ресурса. parent — slug артиста (для разделов в карточке артиста);
 * upcoming — только будущие (для концертов); status — фильтр по статусу.
 */
export async function listRows(resource, { parent, upcoming = false, status } = {}) {
  let q = db.from(resource.table).select("*");
  if (resource.filter) q = resource.filter(q);
  if (parent !== undefined && resource.parent) q = parent === null ? q.is(resource.parent, null) : q.eq(resource.parent, parent);
  if (upcoming && resource.upcomingField) q = q.gte(resource.upcomingField, todayISO());
  if (status && resource.statusField) q = q.eq(resource.statusField, status);
  for (const [column, opts] of resource.order ?? []) q = q.order(column, opts ?? { ascending: true });
  return must(await q.limit(1000));
}

const stamp = (resource, row) => (resource.stampUpdatedAt ? { ...row, updated_at: new Date().toISOString() } : row);

export const createRow = async (resource, row) => must(await db.from(resource.table).insert(stamp(resource, row)).select("*").single());

export async function updateRow(resource, id, patch) {
  // Ключевое поле (адрес страницы, идентификатор) после создания не меняется
  const { [resource.idKey]: _key, ...rest } = patch;
  return must(await db.from(resource.table).update(stamp(resource, rest)).eq(resource.idKey, id).select("*").single());
}

export const deleteRow = async (resource, id) => must(await db.from(resource.table).delete().eq(resource.idKey, id));

/** Сколько записей в каждом статусе (для счётчиков на вкладках и в меню) */
export async function countByStatus(resource, { parent, upcoming } = {}) {
  const rows = await listRows({ ...resource, order: [] }, { parent, upcoming });
  const counts = { all: rows.length };
  for (const r of rows) counts[r[resource.statusField]] = (counts[r[resource.statusField]] ?? 0) + 1;
  return counts;
}
