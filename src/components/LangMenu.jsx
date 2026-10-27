import { useEffect, useId, useRef, useState } from "react";
import { LABEL } from "../data/content";
import Flag from "./Flag";

const CURRENT = "ru";
const Check = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" className="lang__check">
    <path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

function LangList({ onPick }) {
  return (
    <ul className="lang__list">
      {LABEL.locales.map((l) => (
        <li key={l.code}>
          {l.code === CURRENT ? (
            <span className="lang__item is-current" aria-current="true" lang={l.code}><Flag code={l.code} /><span>{l.name}</span><Check /></span>
          ) : (
            <a className="lang__item" href={l.url} lang={l.code} hrefLang={l.code} onClick={onPick}><Flag code={l.code} /><span>{l.name}</span></a>
          )}
        </li>
      ))}
    </ul>
  );
}

/** Выбор языка: в шапке — флаг и код с выпадающим списком, в мобильном меню — список сразу */
export default function LangMenu({ inline = false }) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const root = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => { if (!root.current?.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === "Escape") { setOpen(false); root.current?.querySelector("button")?.focus(); } };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("pointerdown", onDown); document.removeEventListener("keydown", onKey); };
  }, [open]);

  if (inline) return <div className="lang lang--inline" role="group" aria-label="Язык"><LangList /></div>;
  return (
    <div ref={root} className={`lang ${open ? "is-open" : ""}`}>
      <button type="button" className="lang__button" aria-expanded={open} aria-controls={id} onClick={() => setOpen((v) => !v)}>
        <Flag code={CURRENT} /><span>{CURRENT.toUpperCase()}</span><span className="sr-only">— выбрать язык</span>
        <svg className="lang__chevron" width="14" height="14" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
      {open && <div id={id} className="lang__pop"><LangList onPick={() => setOpen(false)} /></div>}
    </div>
  );
}
