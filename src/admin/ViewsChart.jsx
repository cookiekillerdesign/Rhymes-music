import { useMemo, useState } from "react";

const fmtDay = (iso) => new Date(`${iso}T12:00:00`).toLocaleDateString("ru-RU", { day: "numeric", month: "short" });

/**
 * Столбики просмотров по дням. Наведение или касание показывает день и число.
 * Для скринридера — подпись с итогом и максимумом.
 */
export default function ViewsChart({ days }) {
  const [hover, setHover] = useState(null);
  const max = useMemo(() => Math.max(1, ...days.map((d) => d.views)), [days]);
  const best = days.reduce((a, d) => (d.views > (a?.views ?? -1) ? d : a), null);
  const W = 100;
  const gap = days.length > 60 ? 0.2 : 0.6;
  const bw = W / days.length - gap;
  const active = hover != null ? days[hover] : null;
  // Пока данных за пару дней, масштаб по максимуму делает один столбик на всю высоту —
  // держим минимальную шкалу, чтобы первые просмотры выглядели как начало графика
  const scale = Math.max(max, 20);
  const daysWithViews = days.filter((d) => d.views > 0).length;

  return (
    <figure className="a-chart">
      <div className="a-chart__tip" aria-hidden="true">
        {active ? <><b>{active.views.toLocaleString("ru-RU")}</b> {fmtDay(active.day)}</> : <span className="a-muted">Наведите на столбик</span>}
      </div>
      <svg viewBox={`0 0 ${W} 40`} preserveAspectRatio="none" className="a-chart__svg" role="img"
        aria-label={`Просмотры по дням за ${days.length} дн.${best ? `, больше всего ${best.views} — ${fmtDay(best.day)}` : ""}`}
        onPointerLeave={() => setHover(null)}>
        {days.map((d, i) => {
          const h = Math.max(d.views ? 1.2 : 0.4, (d.views / scale) * 38);
          return (
            <rect key={d.day} x={i * (bw + gap)} y={40 - h} width={bw} height={h} rx={Math.min(0.8, bw / 3)}
              className={`a-chart__bar ${hover === i ? "is-hover" : ""} ${d.views ? "" : "is-zero"}`}
              onPointerEnter={() => setHover(i)} onPointerDown={() => setHover(i)} />
          );
        })}
      </svg>
      {daysWithViews < 3 && <p className="a-chart__note a-muted">Данные только начали собираться — через несколько дней здесь будет видна динамика.</p>}
      <figcaption className="a-chart__axis a-muted">
        <span>{days[0] && fmtDay(days[0].day)}</span>
        <span>{days.at(-1) && fmtDay(days.at(-1).day)}</span>
      </figcaption>
    </figure>
  );
}
