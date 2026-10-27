import { Link, NavLink, Navigate, Route, Routes, useParams } from "react-router-dom";
import Icon from "./Icons";
import { useAdminData } from "./AdminData";
import { RESOURCES, ARTIST_TABS } from "./cms/resources";
import ResourceSection from "./cms/ResourceSection";
import ArtistEditor from "./ArtistEditor";
import PressKit from "./PressKit";

/** Карточка артиста: всё про одного артиста на вкладках — профиль, релизы, клипы, концерты, мерч… */
export default function ArtistHub() {
  const { slug } = useParams();
  const { artists, reloadArtists } = useAdminData();
  const artist = artists.find((a) => a.slug === slug);
  const base = `/admin/artists/${slug}`;

  return (
    <div className="hub">
      <Link to="/admin/artists" className="a-back"><Icon name="back" size={18} /> Все артисты</Link>
      <header className="hub__head">
        <span className="hub__photo" style={{ "--c1": artist?.palette?.[0], "--c2": artist?.palette?.[1] }}>
          {artist?.photo && <img src={artist.photo} alt="" style={{ objectPosition: artist.photo_position }} />}
        </span>
        <div className="hub__title">
          <h1>{artist?.name ?? slug}</h1>
          <span className="hub__meta">
            {artist && <span className={`a-status ${artist.hidden ? "a-status--draft" : "a-status--live"}`}>{artist.hidden ? "Черновик" : "На сайте"}</span>}
            {artist && !artist.hidden && <a href={`/artist/${slug}`} target="_blank" rel="noopener noreferrer" className="a-link">Страница <Icon name="external" size={14} /></a>}
          </span>
        </div>
      </header>
      <nav className="hub__tabs" aria-label="Разделы артиста">
        {/* Абсолютные ссылки: относительные в splat-маршруте (artists/:slug/*) считаются от текущей вкладки */}
        <NavLink to={base} end>Профиль</NavLink>
        {ARTIST_TABS.map((key) => <NavLink key={key} to={`${base}/${key}`}>{RESOURCES[key].title}</NavLink>)}
        <NavLink to={`${base}/press`}>Пресс-кит</NavLink>
      </nav>

      <Routes>
        <Route index element={<ArtistEditor embedded onSaved={reloadArtists} />} />
        {ARTIST_TABS.map((key) => (
          <Route key={key} path={key} element={
            <ResourceSection key={`${slug}-${key}`} resource={RESOURCES[key]} parent={slug} artistName={artist?.name} artists={artists}
              headless upcomingToggle={key === "concerts"} />
          } />
        ))}
        <Route path="press" element={<PressKit key={slug} slug={slug} artistName={artist?.name} />} />
        <Route path="*" element={<Navigate to={base} replace />} />
      </Routes>
    </div>
  );
}
