import { useEffect, useRef, useState } from "react";
import { syncArtist } from "./api";
import Icon from "./Icons";

/**
 * «Обновить всех»: по очереди запускает синхронизацию для каждого артиста с автообновлением.
 * По одному, а не пачкой: так у каждого вызова хватает времени, а прогресс виден сразу.
 */
export default function SyncAll({ artists, onDone, compact = false }) {
  const [run, setRun] = useState(null); // { done, total, current, totals, errors }
  const stopRef = useRef(false);
  const queue = artists.filter((a) => a.auto_sync);

  // Ушли со страницы — не продолжаем гонять синхронизацию в фоне
  useEffect(() => () => { stopRef.current = true; }, []);

  const start = async () => {
    stopRef.current = false;
    const totals = { releases: 0, tracks: 0, videos: 0, concertsForReview: 0 };
    const errors = [];
    setRun({ done: 0, total: queue.length, current: queue[0]?.name, totals, errors, active: true });
    for (let i = 0; i < queue.length; i++) {
      if (stopRef.current) break;
      const a = queue[i];
      setRun((r) => ({ ...r, current: a.name }));
      try {
        const res = await syncArtist(a.slug);
        for (const k of Object.keys(totals)) totals[k] += res[k] ?? 0;
        errors.push(...(res.errors ?? []));
      } catch (e) {
        errors.push(`${a.name}: ${e.message}`);
      }
      setRun({ done: i + 1, total: queue.length, current: a.name, totals: { ...totals }, errors: [...errors], active: true });
    }
    setRun((r) => ({ ...r, active: false, stopped: stopRef.current }));
    onDone?.();
  };

  const summary = run && (
    <p className="a-muted a-sync__status" role="status">
      {run.active ? `${run.done} из ${run.total}: ${run.current}…` : run.stopped ? `Остановлено на ${run.done} из ${run.total}.` : `Готово: ${run.done} из ${run.total}.`}{" "}
      Новых: релизов {run.totals.releases}, треков {run.totals.tracks}, клипов {run.totals.videos}, концертов {run.totals.concertsForReview}.
    </p>
  );

  // Компактный вид — для шапки списка артистов: одна кнопка и строка прогресса
  if (compact) {
    return (
      <div className="a-sync-compact">
        {run?.active ? (
          <button type="button" className="a-btn" onClick={() => { stopRef.current = true; }}>
            <span className="a-spinner" aria-hidden="true" /> {run.done}/{run.total} · Стоп
          </button>
        ) : (
          <button type="button" className="a-btn" onClick={start} disabled={!queue.length} title="Подтянуть релизы, треки, клипы и концерты для всех артистов">
            <Icon name="refresh" size={18} /> Обновить всех
          </button>
        )}
        {run && !run.active && summary}
      </div>
    );
  }

  return (
    <div className="adm-sync">
      <div className="adm-sync__row">
        <div>
          <b>Обновить данные всех артистов</b>
          <p className="adm-muted">Релизы, «Популярное», клипы и концерты из Deezer, Spotify, YouTube и афиш. Автоматически это происходит каждые 30 минут.</p>
        </div>
        {run?.active ? (
          <button type="button" className="adm-btn" onClick={() => { stopRef.current = true; }}>Остановить</button>
        ) : (
          <button type="button" className="adm-btn adm-btn--primary" onClick={start} disabled={!queue.length}>Обновить всех ({queue.length})</button>
        )}
      </div>
      {run && (
        <>
          <div className="adm-meter__bar" role="progressbar" aria-valuemin={0} aria-valuemax={run.total} aria-valuenow={run.done}>
            <span style={{ width: `${run.total ? (run.done / run.total) * 100 : 0}%` }} />
          </div>
          <p className="adm-muted" role="status">
            {run.active ? `${run.done} из ${run.total}: ${run.current}…` : run.stopped ? `Остановлено на ${run.done} из ${run.total}.` : `Готово: ${run.done} из ${run.total}.`}{" "}
            Новых: релизов {run.totals.releases}, треков {run.totals.tracks}, клипов {run.totals.videos}, концертов на модерацию {run.totals.concertsForReview}.
          </p>
          {run.errors.length > 0 && (
            <details className="adm-meter__details">
              <summary>Замечания ({run.errors.length})</summary>
              <ul>{run.errors.map((e, i) => <li key={i}>{e}</li>)}</ul>
            </details>
          )}
        </>
      )}
    </div>
  );
}
