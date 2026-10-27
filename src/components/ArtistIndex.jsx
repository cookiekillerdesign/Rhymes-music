import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArtistPhoto } from "./Media";
import { useLineup } from "./Lineup";
import { pluralize } from "../lib/format";

/*
 * Индекс артистов. Список: огромная типографика, фото «следует» за курсором.
 * Сетка: карточки с фото. Кнопка «+» лайнапа — только там, где её просят
 * (страница «Организаторам»): в фанатских списках она лишняя.
 */
export default function ArtistIndex({ artists, defaultView = "list", showToggle = true, withLineup = false }) {
  const [view, setView] = useState(defaultView);
  const [hover, setHover] = useState(null);
  // Фото во «floater» монтируем только после первого наведения на артиста:
  // иначе страница сразу грузит фото всего ростера
  const [seen, setSeen] = useState(() => new Set());
  const floater = useRef(null);
  const hovering = Boolean(hover);

  useEffect(() => {
    if (hover && !seen.has(hover.slug)) setSeen((prev) => new Set(prev).add(hover.slug));
  }, [hover, seen]);
  const lineup = useLineup();

  // Фото следует за курсором, только пока курсор над списком; потом цикл засыпает
  useEffect(() => {
    if (view !== "list" || !hovering || !matchMedia("(hover: hover)").matches) return undefined;
    let x = null, y = null, tx = 0, ty = 0, raf = 0;
    const loop = () => {
      x += (tx - x) * 0.14; y += (ty - y) * 0.14;
      const el = floater.current;
      // Фото держится слева от курсора, чтобы не перекрывать кнопку «+» справа
      const side = tx > innerWidth * 0.5 ? "-115%" : "15%";
      if (el) el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(${side}, -50%) rotate(${(tx - x) * 0.04}deg)`;
      raf = Math.abs(tx - x) > 0.1 || Math.abs(ty - y) > 0.1 ? requestAnimationFrame(loop) : 0;
    };
    const move = (e) => {
      tx = e.clientX; ty = e.clientY;
      if (x === null) { x = tx; y = ty; }
      if (!raf) raf = requestAnimationFrame(loop);
    };
    addEventListener("pointermove", move, { passive: true });
    return () => { removeEventListener("pointermove", move); cancelAnimationFrame(raf); };
  }, [view, hovering]);

  return (
    <div className={`aindex aindex--${view}`}>
      {showToggle && (
        <div className="aindex__bar">
          <span className="muted">{pluralize(artists.length, ["артист", "артиста", "артистов"])}</span>
          <div className="seg" role="group" aria-label="Вид">
            <button aria-pressed={view === "list"} onClick={() => setView("list")}>Список</button>
            <button aria-pressed={view === "grid"} onClick={() => setView("grid")}>Сетка</button>
          </div>
        </div>
      )}

      {view === "list" ? (
        <ul className="aindex__list" onPointerLeave={() => setHover(null)}>
          {artists.map((a) => (
            <li key={a.slug} onPointerEnter={() => setHover(a)} style={{ "--c1": a.palette[0] }}>
              <Link to={`/artist/${a.slug}`} className="aindex__name" data-cursor="Открыть">{a.name}</Link>
              <span className="aindex__tag">{a.tagline}</span>
              {withLineup && (
                <button
                  onPointerEnter={() => setHover(null)}
                  onPointerLeave={() => setHover(a)}
                  className={`aindex__add ${lineup.has(a.slug) ? "is-on" : ""}`}
                  onClick={() => lineup.toggle(a.slug)}
                  aria-pressed={lineup.has(a.slug)}
                  aria-label={`${lineup.has(a.slug) ? "Убрать из лайнапа" : "Добавить в лайнап"}: ${a.name}`}
                >
                  {lineup.has(a.slug) ? "✓" : "+"}
                </button>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <ul className="aindex__grid">
          {artists.map((a) => (
            <li key={a.slug}>
              <Link to={`/artist/${a.slug}`} className="acard" data-cursor="Открыть" style={{ "--c1": a.palette[0] }}>
                <ArtistPhoto artist={a} />
                <span className="acard__name">{a.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <div className={`floater ${hover ? "is-on" : ""}`} ref={floater} aria-hidden="true">
        {artists.filter((a) => seen.has(a.slug)).map((a) => (
          <div key={a.slug} className={`floater__item ${hover?.slug === a.slug ? "is-on" : ""}`}>
            <ArtistPhoto artist={a} />
          </div>
        ))}
      </div>
    </div>
  );
}
