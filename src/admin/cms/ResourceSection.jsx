import { useCallback, useEffect, useMemo, useState } from "react";
import { listRows, updateRow } from "./api";
import RecordDrawer from "./RecordDrawer";
import PageHeader from "../PageHeader";
import Icon from "../Icons";
import { useAdminData } from "../AdminData";

const TONE = { ok: "adm-tag--ok", warn: "adm-tag--warn", muted: "adm-tag--muted" };

/**
 * Список записей ресурса с поиском, фильтром статуса, группировкой по артистам,
 * быстрыми действиями и панелью редактирования.
 *
 * parent — slug артиста: раздел внутри карточки артиста (записи только этого артиста).
 * groupByArtist — общий раздел (все концерты / весь мерч), сгруппированный по артистам.
 */
export default function ResourceSection({ resource, parent, artistName, artists = [], groupByArtist = false, upcomingToggle = false, headless = false, onChanged }) {
  const [rows, setRows] = useState(null);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [artistFilter, setArtistFilter] = useState("all");
  const [withPast, setWithPast] = useState(false);
  const [editing, setEditing] = useState(null); // строка, "new" или null
  const [flash, setFlash] = useState("");
  const { refreshCounts } = useAdminData();

  const load = useCallback(async () => {
    try {
      setRows(await listRows(resource, { parent, upcoming: upcomingToggle && !withPast }));
      setError("");
    } catch (e) {
      setError(e.message);
    }
  }, [resource, parent, upcomingToggle, withPast]);

  useEffect(() => { load(); }, [load]);

  const nameOf = useMemo(() => {
    const map = new Map(artists.map((a) => [a.slug, a.name]));
    return (slug) => (slug ? map.get(slug) ?? slug : "Rhymes Music");
  }, [artists]);

  const counts = useMemo(() => {
    const c = { all: rows?.length ?? 0 };
    if (resource.statusField) for (const r of rows ?? []) c[r[resource.statusField]] = (c[r[resource.statusField]] ?? 0) + 1;
    return c;
  }, [rows, resource]);

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (rows ?? []).filter((r) => {
      if (status !== "all" && r[resource.statusField] !== status) return false;
      if (artistFilter !== "all" && (r.artist_slug ?? "label") !== artistFilter) return false;
      if (!q) return true;
      const s = resource.summary(r);
      return `${s.title} ${s.meta} ${groupByArtist ? nameOf(r.artist_slug) : ""}`.toLowerCase().includes(q);
    });
  }, [rows, query, status, artistFilter, resource, groupByArtist, nameOf]);

  // Группы по артистам в порядке ростера; мерч лейбла — отдельной группой в конце
  const groups = useMemo(() => {
    if (!groupByArtist) return [{ key: "all", title: null, rows: shown }];
    const order = new Map(artists.map((a, i) => [a.slug, i]));
    const map = new Map();
    for (const r of shown) {
      const key = r.artist_slug ?? "label";
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(r);
    }
    return [...map.entries()]
      .sort(([a], [b]) => (order.get(a) ?? 1e9) - (order.get(b) ?? 1e9))
      .map(([key, list]) => ({ key, title: key === "label" ? "Rhymes Music" : nameOf(key), rows: list }));
  }, [shown, groupByArtist, artists, nameOf]);

  const quick = async (row, action) => {
    try {
      await updateRow(resource, row[resource.idKey], action.patch(row));
      setFlash(`${resource.summary(row).title}: ${action.label(row).toLowerCase()} — готово`);
      await load();
      refreshCounts();
      onChanged?.();
    } catch (e) {
      setFlash(`Ошибка: ${e.message}`);
    }
  };

  const onSaved = async (saved, isNew) => {
    setEditing(null);
    setFlash(saved ? (isNew ? "Создано" : "Сохранено") : "Удалено");
    await load();
    refreshCounts();
    onChanged?.();
  };

  const fixed = parent !== undefined && resource.parent ? { [resource.parent]: parent } : {};
  // В фильтре — только артисты, у которых есть записи
  const presentKeys = useMemo(() => new Set((rows ?? []).map((r) => r.artist_slug ?? "label")), [rows]);

  return (
    <section className="cms-section" aria-label={resource.title}>
      {!headless && (
        <PageHeader title={resource.title} count={rows ? counts.all : null}
          primary={resource.noCreate ? null : { label: resource.add, onClick: () => setEditing("new") }} />
      )}

      <div className="cms-toolbar">
        <label className="a-search">
          <Icon name="search" size={18} />
          <input type="search" placeholder="Поиск" value={query} onChange={(e) => setQuery(e.target.value)} aria-label={`Поиск: ${resource.title}`} />
        </label>
        {groupByArtist && (
          <select className="cms-select" value={artistFilter} onChange={(e) => setArtistFilter(e.target.value)} aria-label="Артист">
            <option value="all">Все артисты</option>
            {[...artists.map((a) => a.slug), "label"].filter((k) => presentKeys.has(k))
              .map((k) => <option key={k} value={k}>{k === "label" ? "Rhymes Music" : nameOf(k)}</option>)}
          </select>
        )}
        {upcomingToggle && (
          <label className="adm-check cms-toolbar__check"><input type="checkbox" checked={withPast} onChange={(e) => setWithPast(e.target.checked)} /> Прошедшие</label>
        )}
        {headless && !resource.noCreate && (
          <>
            <button type="button" className="a-btn a-btn--primary cms-toolbar__add" onClick={() => setEditing("new")}><Icon name="plus" size={18} /> {resource.add}</button>
            <button type="button" className="a-fab" onClick={() => setEditing("new")} aria-label={resource.add}><Icon name="plus" size={26} /></button>
          </>
        )}
      </div>

      {resource.statuses && (
        <div className="adm-filters" role="group" aria-label="Статус">
          {[{ value: "all", label: "Все" }, ...resource.statuses].map((s) => (
            <button key={s.value} type="button" aria-pressed={status === s.value} className={`adm-chip ${status === s.value ? "is-active" : ""}`} onClick={() => setStatus(s.value)}>
              {s.label} <span className="adm-muted">{counts[s.value] ?? 0}</span>
            </button>
          ))}
        </div>
      )}

      {flash && <p className={`adm-note ${flash.startsWith("Ошибка") ? "adm-note--error" : "adm-note--ok"}`} role="status">{flash}</p>}
      {error && <p className="adm-error" role="alert">Не удалось загрузить: {error}</p>}
      {!rows && !error && <p className="adm-muted">Загружаем…</p>}
      {rows && !shown.length && <p className="adm-muted adm-empty-list">{rows.length ? "Ничего не найдено." : `Пока пусто.${resource.noCreate ? "" : ` Нажмите «${resource.add}».`}`}</p>}

      {groups.filter((g) => g.rows.length).map((g) => (
        <div key={g.key} className="cms-group">
          {g.title && <h2 className="cms-group__title">{g.title} <span className="adm-muted">{g.rows.length}</span></h2>}
          <ul className="cms-list">
            {g.rows.map((r) => {
              const s = resource.summary(r);
              return (
                <li key={r[resource.idKey]} className={`cms-row ${"image" in s ? "cms-row--thumb" : ""}`}>
                  <button type="button" className="cms-row__open" onClick={() => setEditing(r)}>
                    {"image" in s && (
                      <span className="cms-row__thumb" style={{ aspectRatio: s.imageAspect ?? "1 / 1" }}>{s.image && <img src={s.image} alt="" loading="lazy" />}</span>
                    )}
                    <span className="cms-row__text">
                      <b>{s.title}</b>
                      {s.meta && <span className="adm-muted">{s.meta}</span>}
                    </span>
                  </button>
                  <span className="cms-row__tags">{(s.tags ?? []).map((t) => <span key={t.text} className={`adm-tag ${TONE[t.tone] ?? ""}`}>{t.text}</span>)}</span>
                  <span className="cms-row__actions">
                    {(resource.quick ?? []).filter((a) => !a.when || a.when(r)).map((a) => (
                      <button key={a.label(r)} type="button" className="adm-btn adm-btn--small" onClick={() => quick(r, a)}>{a.label(r)}</button>
                    ))}
                  </span>
                  <Icon name="chevron" size={18} className="cms-row__chevron" />
                </li>
              );
            })}
          </ul>
        </div>
      ))}

      {editing && (
        <RecordDrawer resource={resource} row={editing === "new" ? null : editing} fixed={fixed} artists={artists} artistName={artistName}
          onClose={() => setEditing(null)} onSaved={onSaved} />
      )}
    </section>
  );
}
