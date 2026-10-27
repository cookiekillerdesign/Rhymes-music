import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAdminData } from "./AdminData";
import PageHeader from "./PageHeader";
import SyncAll from "./SyncAll";
import Icon from "./Icons";
import ArtistOrder from "./ArtistOrder";

/** Ростер: фото, имя, адрес, статус. Подробности — в карточке артиста */
export default function ArtistList() {
  const { artists, reloadArtists } = useAdminData();
  const [query, setQuery] = useState("");
  const [ordering, setOrdering] = useState(false);
  const [flash, setFlash] = useState("");
  const navigate = useNavigate();

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return artists.filter((a) => !q || a.name.toLowerCase().includes(q) || a.slug.includes(q));
  }, [artists, query]);
  const noPhoto = artists.filter((a) => !a.photo).length;

  return (
    <section>
      <PageHeader title="Артисты" count={artists.length}
        subtitle={noPhoto ? `Без фото: ${noPhoto}` : null}
        primary={ordering ? null : { label: "Добавить артиста", onClick: () => navigate("/admin/artists/new") }}>
        {!ordering && (
          <button type="button" className="a-btn" onClick={() => { setFlash(""); setOrdering(true); }} disabled={artists.length < 2}>
            <Icon name="sort" size={18} /> Порядок
          </button>
        )}
        {!ordering && <SyncAll artists={artists} onDone={reloadArtists} compact />}
      </PageHeader>

      {flash && <p className="adm-note adm-note--ok" role="status">{flash}</p>}
      {ordering ? (
        <ArtistOrder artists={artists} onCancel={() => setOrdering(false)}
          onSaved={async () => { await reloadArtists(); setOrdering(false); setFlash("Порядок сохранён — на сайте артисты идут так же"); }} />
      ) : (
        <>

      <label className="a-search a-search--wide">
        <Icon name="search" size={18} />
        <input type="search" placeholder="Поиск по имени или адресу" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Поиск артиста" />
      </label>

      <ul className="a-roster">
        {shown.map((a) => (
          <li key={a.slug}>
            <Link to={`/admin/artists/${a.slug}`} className="a-roster__row">
              <span className="a-roster__photo" style={{ "--c1": a.palette?.[0], "--c2": a.palette?.[1] }}>
                {a.photo ? <img src={a.photo} alt="" loading="lazy" style={{ objectPosition: a.photo_position ?? "50% 25%" }} /> : <Icon name="image" size={18} />}
              </span>
              <span className="a-roster__text">
                <b>{a.name}</b>
                <span>/artist/{a.slug}</span>
              </span>
              <span className={`a-status ${a.hidden ? "a-status--draft" : "a-status--live"}`}>{a.hidden ? "Черновик" : "На сайте"}</span>
              <Icon name="chevron" size={18} className="a-roster__chevron" />
            </Link>
          </li>
        ))}
      </ul>
      {!shown.length && <p className="a-muted a-empty">{artists.length ? "Никого не нашли." : "Загружаем…"}</p>}
        </>
      )}
    </section>
  );
}
