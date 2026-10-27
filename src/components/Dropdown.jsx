import { useEffect, useId, useRef, useState } from "react";

/**
 * Выпадающий список в стиле сайта (вместо системного select, который на компьютере
 * открывается белым окном ОС). Доступность — паттерн WAI-ARIA «select-only combobox»:
 * Enter/Пробел/↓ открывают, ↑↓ Home End двигают, Enter выбирает, Esc закрывает,
 * буквы ищут по началу названия. Клик вне — закрывает.
 *
 * options: [{ value, label, count?, disabled? }]
 */
export default function Dropdown({ label, value, options, onChange, className = "" }) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const root = useRef(null);
  const list = useRef(null);
  const typed = useRef({ text: "", at: 0 });
  const selectedIndex = Math.max(0, options.findIndex((o) => o.value === value));
  const selected = options[selectedIndex];

  const enabledFrom = (start, step) => {
    for (let i = start; i >= 0 && i < options.length; i += step) if (!options[i].disabled) return i;
    return null;
  };

  const openList = () => { setActive(selectedIndex); setOpen(true); };
  const choose = (i) => {
    if (options[i]?.disabled) return;
    onChange(options[i].value);
    setOpen(false);
  };

  // Клик вне — закрыть
  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => { if (!root.current?.contains(e.target)) setOpen(false); };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  // Активный пункт всегда в видимой части списка
  useEffect(() => {
    if (open) list.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [open, active]);

  const onKeyDown = (e) => {
    if (!open) {
      if (["Enter", " ", "ArrowDown", "ArrowUp"].includes(e.key)) { e.preventDefault(); openList(); }
      return;
    }
    const move = (i) => { if (i != null) setActive(i); };
    switch (e.key) {
      case "ArrowDown": e.preventDefault(); move(enabledFrom(active + 1, 1)); break;
      case "ArrowUp": e.preventDefault(); move(enabledFrom(active - 1, -1)); break;
      case "Home": e.preventDefault(); move(enabledFrom(0, 1)); break;
      case "End": e.preventDefault(); move(enabledFrom(options.length - 1, -1)); break;
      case "Enter": case " ": e.preventDefault(); choose(active); break;
      case "Escape": e.preventDefault(); setOpen(false); break;
      case "Tab": setOpen(false); break;
      default:
        if (e.key.length === 1 && /\S/.test(e.key)) {
          const now = Date.now();
          typed.current = { text: (now - typed.current.at < 700 ? typed.current.text : "") + e.key.toLowerCase(), at: now };
          const i = options.findIndex((o) => !o.disabled && o.label.toLowerCase().startsWith(typed.current.text));
          if (i !== -1) setActive(i);
        }
    }
  };

  return (
    <div ref={root} className={`dd ${open ? "is-open" : ""} ${selectedIndex > 0 ? "is-set" : ""} ${className}`}>
      <span className="dd__label" id={`${id}-label`}>{label}</span>
      <button type="button" className="dd__button" role="combobox" aria-haspopup="listbox" aria-expanded={open}
        aria-controls={`${id}-list`} aria-labelledby={`${id}-label ${id}-value`}
        aria-activedescendant={open ? `${id}-opt-${active}` : undefined}
        onClick={() => (open ? setOpen(false) : openList())} onKeyDown={onKeyDown}>
        <span className="dd__value" id={`${id}-value`}>{selected?.label}</span>
        <svg className="dd__chevron" width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
          <path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <ul ref={list} className="dd__list" role="listbox" id={`${id}-list`} aria-labelledby={`${id}-label`}>
          {options.map((o, i) => (
            <li key={o.value} id={`${id}-opt-${i}`} data-index={i} role="option" aria-selected={o.value === value} aria-disabled={o.disabled || undefined}
              className={`dd__option ${i === active ? "is-active" : ""} ${o.value === value ? "is-selected" : ""}`}
              onPointerEnter={() => !o.disabled && setActive(i)} onClick={() => choose(i)}>
              <span>{o.label}</span>
              {o.count != null && <span className="dd__count">{o.count}</span>}
              {o.value === value && (
                <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" className="dd__check">
                  <path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
