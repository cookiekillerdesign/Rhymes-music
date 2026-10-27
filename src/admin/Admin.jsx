import { useEffect, useState } from "react";
import { Link, NavLink, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { isLive } from "../lib/api";
import { getSession, isAdmin, onAuthChange, signOut } from "./api";
import { AdminDataProvider, useAdminData, useBadges } from "./AdminData";
import Icon from "./Icons";
import Requests from "./Requests";
import { LogoMark } from "../components/Logo";
import { RESOURCES } from "./cms/resources";
import ResourceSection from "./cms/ResourceSection";
import Login from "./Login";
import Dashboard from "./Dashboard";
import ArtistList from "./ArtistList";
import ArtistEditor from "./ArtistEditor";
import ArtistHub from "./ArtistHub";
import PressKitSettings from "./PressKitSettings";
import LabelSettings from "./LabelSettings";
import "./admin.css";

/*
 * Админка лейбла: /admin. Вход — почта и пароль пользователя Supabase с ролью admin
 * (см. README, «Админка»). Права проверяет база, интерфейс лишь не показывает лишнего.
 */
export default function Admin() {
  const [session, setSession] = useState(undefined); // undefined — ещё проверяем

  useEffect(() => {
    document.title = "Админка — Rhymes Music";
    const robots = document.createElement("meta");
    robots.name = "robots";
    robots.content = "noindex, nofollow";
    document.head.append(robots);
    return () => robots.remove();
  }, []);

  useEffect(() => {
    if (!isLive) return undefined;
    getSession().then(setSession, () => setSession(null));
    const sub = onAuthChange(setSession);
    return () => sub.unsubscribe();
  }, []);

  if (!isLive) {
    return (
      <Centered>
        <h1>Админка работает с подключённым Supabase</h1>
        <p>Сейчас сайт показывает локальные данные из <code>src/data/content.js</code>. Задайте <code>VITE_SUPABASE_URL</code> и <code>VITE_SUPABASE_ANON_KEY</code> — инструкция в README.</p>
      </Centered>
    );
  }
  if (session === undefined) return <Centered><p className="adm-muted">Проверяем вход…</p></Centered>;
  if (!session) return <Centered><Login /></Centered>;
  if (!isAdmin(session)) {
    return (
      <Centered>
        <h1>Нет доступа</h1>
        <p>Аккаунт {session.user.email} вошёл, но у него нет роли администратора. Её выдаёт владелец проекта в Supabase. Если роль только что выдали — выйдите и войдите снова.</p>
        <button className="adm-btn" onClick={signOut}>Выйти</button>
      </Centered>
    );
  }

  return (
    <AdminDataProvider>
      <Shell email={session.user.email} />
    </AdminDataProvider>
  );
}

/** Разделы: группы бокового меню. tab — попадает в нижнюю панель на телефоне */
const NAV = [
  { group: null, items: [{ to: "/admin", label: "Обзор", icon: "home", end: true, tab: true }] },
  { group: "Каталог", items: [
    { to: "/admin/artists", label: "Артисты", icon: "artists", tab: true },
    { to: "/admin/concerts", label: "Концерты", icon: "concerts", tab: true, badge: "concerts" },
    { to: "/admin/merch", label: "Мерч", icon: "merch" }
  ] },
  { group: "Заявки", items: [{ to: "/admin/requests", label: "Заявки", icon: "inbox", tab: true, badge: "requests" }] },
  { group: "Сайт", items: [
    { to: "/admin/label", label: "Лейбл", icon: "label" },
    { to: "/admin/pages", label: "Документы", icon: "docs" },
    { to: "/admin/press", label: "Пресс-кит", icon: "press" },
    { to: "/admin/jobs", label: "Вакансии", icon: "jobs" },
    { to: "/admin/team", label: "Команда", icon: "team" }
  ] }
];
const ALL_ITEMS = NAV.flatMap((g) => g.items);

const isActive = (item, pathname) => (item.end ? pathname === item.to : pathname.startsWith(item.to));

function NavItem({ item, badges, onClick }) {
  const count = item.badge ? badges[item.badge] : 0;
  return (
    <NavLink to={item.to} end={item.end} onClick={onClick} className={({ isActive: a }) => `a-nav__item ${a ? "is-active" : ""}`}>
      <Icon name={item.icon} />
      <span>{item.label}</span>
      {count > 0 && <b className="a-badge" aria-label={`${count} ждут действий`}>{count}</b>}
    </NavLink>
  );
}

function Shell({ email }) {
  const { artists } = useAdminData();
  const badges = useBadges();
  const { pathname } = useLocation();
  const [moreOpen, setMoreOpen] = useState(false);
  useEffect(() => setMoreOpen(false), [pathname]);

  const tabs = ALL_ITEMS.filter((i) => i.tab);
  const rest = ALL_ITEMS.filter((i) => !i.tab);
  const moreActive = rest.some((i) => isActive(i, pathname));

  return (
    <div className="adm a-app">
      {/* Компьютер: боковое меню */}
      <aside className="a-side">
        <Link to="/admin" className="a-brand"><LogoMark className="a-brand__mark" /><span>Rhymes Music<small>админка</small></span></Link>
        <nav className="a-nav" aria-label="Разделы админки">
          {NAV.map((g) => (
            <div key={g.group ?? "main"} className="a-nav__group">
              {g.group && <span className="a-nav__label">{g.group}</span>}
              {g.items.map((i) => <NavItem key={i.to} item={i} badges={badges} />)}
            </div>
          ))}
        </nav>
        <div className="a-side__foot">
          <a href="/" target="_blank" rel="noopener noreferrer" className="a-nav__item"><Icon name="external" /><span>Открыть сайт</span></a>
          <button type="button" className="a-nav__item" onClick={signOut}><Icon name="logout" /><span>Выйти</span></button>
          <span className="a-side__email" title={email}>{email}</span>
        </div>
      </aside>

      {/* Телефон: верхняя строка со знаком лейбла */}
      <header className="a-topbar">
        <Link to="/admin" className="a-brand"><LogoMark className="a-brand__mark" /><span>Rhymes Music<small>админка</small></span></Link>
        <a href="/" target="_blank" rel="noopener noreferrer" className="a-icon-btn" aria-label="Открыть сайт"><Icon name="external" /></a>
      </header>

      <main className="a-main">
        <Routes>
          <Route index element={<Dashboard />} />
          <Route path="artists" element={<ArtistList />} />
          <Route path="artists/new" element={<ArtistEditor />} />
          <Route path="artists/:slug/*" element={<ArtistHub />} />
          <Route path="concerts" element={<ResourceSection key="concerts" resource={RESOURCES.concerts} artists={artists} groupByArtist upcomingToggle />} />
          <Route path="merch" element={<ResourceSection key="merch" resource={RESOURCES.merch} artists={artists} groupByArtist />} />
          <Route path="requests/*" element={<Requests />} />
          <Route path="pages" element={<ResourceSection key="pages" resource={RESOURCES.pages} artists={artists} />} />
          <Route path="press" element={<PressKitSettings />} />
          <Route path="label" element={<LabelSettings />} />
          <Route path="jobs" element={<ResourceSection key="jobs" resource={RESOURCES.jobs} artists={artists} />} />
          <Route path="team" element={<ResourceSection key="team" resource={RESOURCES.team} artists={artists} />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </main>

      {/* Телефон: нижняя панель — главные разделы под большим пальцем, остальное в «Ещё» */}
      <nav className="a-tabbar" aria-label="Разделы админки">
        {tabs.map((i) => <NavItem key={i.to} item={i} badges={badges} />)}
        <button type="button" className={`a-nav__item ${moreActive || moreOpen ? "is-active" : ""}`} aria-expanded={moreOpen} aria-controls="a-more" onClick={() => setMoreOpen((v) => !v)}>
          <Icon name="more" /><span>Ещё</span>
        </button>
      </nav>
      {moreOpen && (
        <div className="a-sheet" role="presentation" onClick={(e) => e.target === e.currentTarget && setMoreOpen(false)}>
          <div id="a-more" className="a-sheet__panel" role="dialog" aria-modal="true" aria-label="Другие разделы">
            <span className="a-sheet__grip" aria-hidden="true" />
            <nav className="a-sheet__grid">
              {rest.map((i) => <NavItem key={i.to} item={i} badges={badges} />)}
            </nav>
            <div className="a-sheet__foot">
              <span className="a-muted">{email}</span>
              <button type="button" className="a-btn" onClick={signOut}><Icon name="logout" size={18} /> Выйти</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Centered({ children }) {
  return (
    <div className="adm">
      <main className="adm-main"><div className="adm-empty">{children}</div></main>
    </div>
  );
}
