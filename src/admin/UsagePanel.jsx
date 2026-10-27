import { useCallback, useEffect, useState } from "react";
import { getUsage } from "./api";
import { formatBytes, getLimits, meter } from "./usage";
import { pluralize } from "../lib/format";

const BUCKET_LABELS = { artists: "Фото артистов" };

/** Место в Supabase: сколько всего по тарифу, сколько занято и сколько свободно */
export default function UsagePanel() {
  const [usage, setUsage] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const limits = getLimits();

  const load = useCallback(() => {
    setLoading(true);
    getUsage().then(
      (data) => { setUsage(data); setError(""); setLoading(false); },
      (e) => { setError(e.message); setLoading(false); }
    );
  }, []);

  useEffect(load, [load]);

  return (
    <section className="adm-usage" aria-labelledby="adm-usage-title">
      <div className="adm-usage__head">
        <h2 id="adm-usage-title">Место в Supabase <span className="adm-muted">тариф {limits.plan}</span></h2>
        <button type="button" className="adm-link" onClick={load} disabled={loading}>{loading ? "Считаем…" : "Обновить"}</button>
      </div>

      {error && <p className="adm-error" role="alert">Не удалось посчитать место: {error}. Проверьте, что выполнен обновлённый schema.sql.</p>}

      {usage && (
        <>
          <div className="adm-usage__meters">
            <Meter
              title="Файлы (фото)"
              {...meter(usage.storage_bytes, limits.storageBytes)}
              note={pluralize(usage.storage_objects, ["файл", "файла", "файлов"])}
              details={usage.buckets.map((b) => [BUCKET_LABELS[b.name] ?? b.name, b.bytes])}
            />
            <Meter
              title="База данных"
              {...meter(usage.database_bytes, limits.databaseBytes)}
              note="включая служебные таблицы Supabase"
              details={usage.tables.map((t) => [t.name, t.bytes])}
            />
          </div>
          <p className="adm-muted adm-usage__foot">
            Замер: {new Date(usage.measured_at).toLocaleString("ru-RU", { dateStyle: "short", timeStyle: "short" })}.
            Лимиты тарифа заданы в настройках сайта (VITE_SUPABASE_PLAN) — точные цифры для вашего проекта видны в Supabase → Settings → Usage.
          </p>
        </>
      )}
    </section>
  );
}

function Meter({ title, used, free, limit, percent, level, note, details }) {
  return (
    <div className={`adm-meter adm-meter--${level}`}>
      <div className="adm-meter__top">
        <b>{title}</b>
        <span>{Math.round(percent)}%</span>
      </div>
      <div className="adm-meter__bar" role="meter" aria-label={title} aria-valuemin={0} aria-valuemax={limit} aria-valuenow={used} aria-valuetext={`Занято ${formatBytes(used)} из ${formatBytes(limit)}`}>
        <span style={{ width: `${Math.max(percent, used > 0 ? 1 : 0)}%` }} />
      </div>
      <dl className="adm-meter__nums">
        <div><dt>Всего</dt><dd>{formatBytes(limit)}</dd></div>
        <div><dt>Занято</dt><dd>{formatBytes(used)}</dd></div>
        <div><dt>Свободно</dt><dd className="adm-meter__free">{formatBytes(free)}</dd></div>
      </dl>
      {level !== "ok" && (
        <p className={`adm-note adm-note--${level === "error" ? "error" : "warning"}`}>
          {level === "error" ? "Место почти закончилось: новые загрузки могут не пройти." : "Занято больше 80%: стоит почистить старые файлы или перейти на тариф выше."}
        </p>
      )}
      {details.length > 0 && (
        <details className="adm-meter__details">
          <summary>Подробнее <span className="adm-muted">{note}</span></summary>
          <ul>
            {details.map(([name, bytes]) => <li key={name}><span>{name}</span><span>{formatBytes(bytes)}</span></li>)}
          </ul>
        </details>
      )}
    </div>
  );
}
