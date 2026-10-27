import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAdminData } from "./AdminData";
import { getCatalogStats, getSiteStats } from "./api";
import { compactNumber, deltaPercent, pageLabel } from "./metrics";
import ViewsChart from "./ViewsChart";
import SyncAll from "./SyncAll";
import UsagePanel from "./UsagePanel";
import PageHeader from "./PageHeader";
import Icon from "./Icons";

const PERIODS = [7, 30, 90];

const sinceISO = (days) => {
  const d = new Date();
  d.setDate(d.getDate() - (days - 1));
  return d.toISOString().slice(0, 10);
};

/** Обзор: посещаемость, что ждёт действий, каталог в цифрах */
export default function Dashboard() {
  const { artists, counts, reloadArtists } = useAdminData();
  const [period, setPeriod] = useState(30);
  const [stats, setStats] = useState(null);
  const [catalog, setCatalog] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    setStats(null);
    Promise.all([getSiteStats(period), getCatalogStats(sinceISO(period))]).then(
      ([s, c]) => { if (alive) { setStats(s); setCatalog(c); setError(""); } },
      (e) => alive && setError(e.code === "PGRST202" ? "Чтобы видеть посещаемость, выполните обновлённый supabase/update.sql." : e.message)
    );
    return () => { alive = false; };
  }, [period]);

  const n = (group, status) => (counts ? counts[group]?.[status] ?? 0 : 0);
  const todo = [
    { to: "/admin/concerts", icon: "concerts", value: n("concerts", "pending"), label: "Концерты ждут модерации" },
    { to: "/admin/requests/booking", icon: "inbox", value: n("bookings", "new"), label: "Новые заявки на букинг" },
    { to: "/admin/requests/demo", icon: "inbox", value: n("demos", "new"), label: "Новые демо" },
    { to: "/admin/artists", icon: "image", value: artists.filter((a) => !a.photo).length, label: "Артисты без фото" }
  ].filter((t) => t.value > 0);

  const delta = stats ? deltaPercent(stats.total, stats.previous) : null;
  const topMax = useMemo(() => Math.max(1, ...(stats?.top ?? []).map((t) => t.views)), [stats]);
  const catalogCards = [
    { label: "Артистов на сайте", value: artists.filter((a) => !a.hidden).length },
    { label: "Релизов", value: catalog?.releases },
    { label: `Новых релизов за ${period} дн.`, value: catalog?.fresh, accent: catalog?.fresh > 0 },
    { label: "Клипов", value: catalog?.videos },
    { label: "Концертов впереди", value: counts?.concerts?.published },
    { label: "Вещей в мерче", value: catalog?.merch }
  ];

  return (
    <section className="a-dash">
      <PageHeader title="Обзор">
        <div className="a-segmented a-segmented--inline" role="group" aria-label="Период">
          {PERIODS.map((p) => (
            <button key={p} type="button" aria-pressed={period === p} className={period === p ? "active" : ""} onClick={() => setPeriod(p)}>{p} дней</button>
          ))}
        </div>
      </PageHeader>

      {error && <p className="adm-note adm-note--warning" role="status">{error}</p>}

      <div className="a-dash__grid">
        <article className="a-card a-card--views">
          <header className="a-card__head">
            <h2>Посещаемость</h2>
            <span className="a-muted">просмотры страниц сайта</span>
          </header>
          <div className="a-kpi">
            <b>{stats ? compactNumber(stats.total) : "…"}</b>
            {stats && delta !== null && (
              <span className={`a-delta ${delta > 0 ? "is-up" : delta < 0 ? "is-down" : ""}`}>
                {delta > 0 ? "▲" : delta < 0 ? "▼" : "•"} {Math.abs(delta)}% <span className="a-muted">к прошлым {period} дн.</span>
              </span>
            )}
            {stats && delta === null && <span className="a-delta a-muted">первые данные — сравнивать пока не с чем</span>}
          </div>
          {stats ? <ViewsChart days={stats.days} /> : <div className="a-chart a-chart--loading" />}
        </article>

        <article className="a-card a-card--top">
          <header className="a-card__head"><h2>Популярные страницы</h2></header>
          {!stats ? <p className="a-muted">Загружаем…</p> : !stats.top.length ? (
            <p className="a-muted">Просмотров пока нет. Счётчик начинает работать после обновления сайта.</p>
          ) : (
            <ol className="a-top">
              {stats.top.map((t) => (
                <li key={t.path}>
                  <span className="a-top__bar" style={{ width: `${(t.views / topMax) * 100}%` }} aria-hidden="true" />
                  <span className="a-top__name">{pageLabel(t.path, artists)}</span>
                  <b>{t.views.toLocaleString("ru-RU")}</b>
                </li>
              ))}
            </ol>
          )}
        </article>

        <article className="a-card a-card--todo">
          <header className="a-card__head"><h2>Требует внимания</h2></header>
          {!counts ? <p className="a-muted">Загружаем…</p> : !todo.length ? (
            <p className="a-done"><Icon name="check" size={18} /> Всё разобрано</p>
          ) : (
            <ul className="a-todo">
              {todo.map((t) => (
                <li key={t.label}>
                  <Link to={t.to} className="a-todo__row">
                    <Icon name={t.icon} size={18} />
                    <span>{t.label}</span>
                    <b className="a-badge">{t.value}</b>
                    <Icon name="chevron" size={16} className="a-muted" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </article>

        <article className="a-card a-card--catalog">
          <header className="a-card__head"><h2>Каталог</h2></header>
          <dl className="a-figures">
            {catalogCards.map((c) => (
              <div key={c.label} className={c.accent ? "is-accent" : ""}>
                <dd>{c.value == null ? "…" : compactNumber(c.value)}</dd>
                <dt>{c.label}</dt>
              </div>
            ))}
          </dl>
        </article>
      </div>

      <div className="a-dash__bottom">
        <SyncAll artists={artists} onDone={reloadArtists} />
        <UsagePanel />
      </div>
    </section>
  );
}
