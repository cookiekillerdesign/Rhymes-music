import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { LogoMark } from "./Logo";
import LangMenu from "./LangMenu";
import { useQuery } from "../lib/useQuery";
import { getLabelSocials } from "../lib/api";
import { LABEL } from "../data/content";
import { getLenis } from "../lib/scroll";
import { useRootClass } from "../lib/useRootClass";
import { SocialLinks } from "./Social";

const NAV = [
  { to: "/artists", label: "Артисты" },
  { to: "/releases", label: "Релизы" },
  { to: "/concerts", label: "Концерты" },
  { to: "/merch", label: "Мерч" },
  { to: "/booking", label: "Организаторам" },
  { to: "/for-artists", label: "Артистам" }
];
const NAV_SECONDARY = [
  { to: "/team", label: "Команда" },
  { to: "/jobs", label: "Вакансии" },
  { to: "/contacts", label: "Контакты" },
  { to: "/legal", label: "Документы" }
];

export default function Nav() {
  const { data: socials } = useQuery(getLabelSocials, [], { throwOnError: false });
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => setOpen(false), [pathname]);
  // Табы артиста встают под шапку, а когда она уезжает — поднимаются к краю экрана
  useRootClass("nav-hidden", hidden && !open);

  // Шапка прячется при скролле вниз и возвращается при скролле вверх. Решение принимаем
  // по накопленному смещению в одну сторону: Lenis даёт много шагов по 1–2 px,
  // и сравнение соседних позиций заставляло шапку мигать.
  useEffect(() => {
    const THRESHOLD = 24;
    let last = window.scrollY;
    let travel = 0; // >0 — едем вниз, <0 — вверх
    const on = () => {
      const y = window.scrollY;
      const delta = y - last;
      last = y;
      if (delta !== 0) travel = Math.sign(delta) === Math.sign(travel) ? travel + delta : delta;
      if (y <= 200) setHidden(false);
      else if (travel > THRESHOLD) setHidden(true);
      else if (travel < -THRESHOLD) setHidden(false);
      setSolid(y > 40);
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  const mounted = useRef(false);
  useEffect(() => {
    // Первый запуск пропускаем: в этот момент скролл держит прелоадер
    if (!mounted.current) { mounted.current = true; return undefined; }
    document.documentElement.classList.toggle("is-locked", open);
    if (open) getLenis()?.stop(); else getLenis()?.start();
    const esc = (e) => e.key === "Escape" && setOpen(false);
    if (open) window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [open]);

  return (
    <header className={`nav ${hidden && !open ? "is-hidden" : ""} ${solid ? "is-solid" : ""} ${open ? "is-open" : ""}`}>
      <Link to="/" className="nav__logo" aria-label="Rhymes Music, на главную">
        <LogoMark />
        <span>Rhymes Music</span>
      </Link>
      <nav aria-label="Основная навигация" className="nav__links">
        {NAV.map((n) => <NavLink key={n.to} to={n.to}>{n.label}</NavLink>)}
      </nav>
      <div className="nav__lang"><LangMenu /></div>
      <button className="nav__burger" aria-expanded={open} aria-controls="menu" onClick={() => setOpen(!open)}>
        <span className="sr-only">{open ? "Закрыть меню" : "Открыть меню"}</span>
        <i /><i />
      </button>

      <div className="menu" id="menu" hidden={!open}>
        <nav aria-label="Меню" className="menu__main">
          {NAV.map((n, i) => (
            <NavLink key={n.to} to={n.to} style={{ animationDelay: `${60 + i * 40}ms` }}>
              {n.label}
              <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </NavLink>
          ))}
        </nav>
        <div className="menu__foot">
          <nav aria-label="Дополнительно" className="menu__sub">
            {NAV_SECONDARY.map((n) => <NavLink key={n.to} to={n.to}>{n.label}</NavLink>)}
          </nav>
          <div className="menu__row">
            <SocialLinks items={socials ?? LABEL.socials} className="menu__social" />
            <LangMenu inline />
          </div>
        </div>
      </div>
    </header>
  );
}
