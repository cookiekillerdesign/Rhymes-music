import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Icon } from "./Icons";
import BookingForm from "./BookingForm";
import { useRootClass } from "../lib/useRootClass";

/*
 * «Собрать лайнап»: организатор складывает артистов в панель, которая следует
 * за ним по сайту, и отправляет одну заявку на всех. Состав переживает перезагрузку.
 */
const LineupCtx = createContext(null);
export const useLineup = () => useContext(LineupCtx);
const KEY = "rm-lineup";

const load = () => {
  // В хранилище мог оказаться мусор (ручная правка, старая версия формата): берём только массив строк
  try {
    const saved = JSON.parse(localStorage.getItem(KEY));
    return Array.isArray(saved) ? saved.filter((s) => typeof s === "string") : [];
  } catch {
    return [];
  }
};

export function LineupProvider({ artists, children }) {
  const [slugs, setSlugs] = useState(load);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(slugs)); } catch { /* приватный режим */ }
  }, [slugs]);

  const value = useMemo(() => ({
    slugs,
    items: slugs.map((s) => artists.find((a) => a.slug === s)).filter(Boolean),
    has: (slug) => slugs.includes(slug),
    toggle: (slug) => setSlugs((cur) => (cur.includes(slug) ? cur.filter((s) => s !== slug) : [...cur, slug])),
    clear: () => setSlugs([]),
    open, setOpen
  }), [slugs, artists, open]);

  return <LineupCtx.Provider value={value}>{children}</LineupCtx.Provider>;
}

export function LineupButton({ artist, className = "" }) {
  const l = useLineup();
  const on = l.has(artist.slug);
  return (
    <button
      type="button"
      className={`btn btn--ghost lineup-btn ${on ? "is-on" : ""} ${className}`}
      aria-pressed={on}
      onClick={() => l.toggle(artist.slug)}
    >
      <span className="lineup-btn__sign" aria-hidden="true">{on ? "✓" : "+"}</span>
      {on ? "В лайнапе" : "В лайнап"}
    </button>
  );
}

export function LineupTray() {
  const l = useLineup();
  const count = l.items.length;
  const visible = count > 0 || l.open;
  useRootClass("has-tray", visible);
  if (!visible) return null;

  return (
    <aside className={`tray ${l.open ? "is-open" : ""}`} aria-label="Лайнап">
      <button className="tray__pill" onClick={() => l.setOpen(!l.open)} aria-expanded={l.open}>
        <span className="tray__count">{count}</span>
        Лайнап
        <span className="tray__hint">{l.open ? "Свернуть" : "Отправить заявку"}</span>
      </button>
      {l.open && (
        <div className="tray__panel">
          <div className="tray__head">
            <h2>Заявка на лайнап</h2>
            <button className="icon-btn" onClick={() => l.setOpen(false)} aria-label="Закрыть"><Icon name="close" /></button>
          </div>
          {count ? (
            <ul className="tray__list">
              {l.items.map((a) => (
                <li key={a.slug}>
                  <span>{a.name}</span>
                  <button className="link-btn" onClick={() => l.toggle(a.slug)}>Убрать</button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="muted">Добавьте артистов кнопкой «В лайнап» на их страницах или в списке артистов.</p>
          )}
          {count > 0 && <BookingForm artists={l.items} onSent={l.clear} compact />}
        </div>
      )}
    </aside>
  );
}
