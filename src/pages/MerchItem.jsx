import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "../lib/useQuery";
import { getArtists, getMerch } from "../lib/api";
import { formatPrice, MERCH_STATUS, safeUrl } from "../lib/format";
import NotFound from "./NotFound";

/** Карточка в списках «ещё от артиста» */
function MiniCard({ item }) {
  const image = safeUrl(item.image);
  return (
    <li className="merch__item">
      <Link to={`/merch/${item.id}`} className="merch__link">
        <div className={`merch__img ${image ? "merch__img--photo" : ""}`}>
          {image ? <img src={image} alt="" loading="lazy" /> : <span aria-hidden="true">{item.type}</span>}
        </div>
        <div className="merch__meta"><b>{item.title}</b>{formatPrice(item.price) && <span className="merch__price">{formatPrice(item.price)}</span>}</div>
      </Link>
    </li>
  );
}

/** Страница вещи: фото с галереей, описание, размеры, покупка и другие вещи того же артиста */
export default function MerchItem() {
  const { id } = useParams();
  const merch = useQuery(getMerch, []);
  const artists = useQuery(getArtists, []);
  const item = merch.data?.find((m) => m.id === id);
  const artist = artists.data?.find((a) => a.slug === item?.artist);
  const photos = useMemo(() => [item?.image, ...(item?.gallery ?? [])].map(safeUrl).filter(Boolean), [item]);
  const [shown, setShown] = useState(0);

  useEffect(() => setShown(0), [id]);
  useEffect(() => {
    if (item) document.title = `${item.title} — мерч Rhymes Music`;
  }, [item]);

  if (merch.loading || artists.loading) return <main className="page wrap"><div className="page-loading" /></main>;
  if (!item) return <NotFound />;

  const buy = item.status === "available" ? safeUrl(item.buyUrl) : null;
  const more = (merch.data ?? []).filter((m) => m.id !== item.id && m.artist === item.artist).slice(0, 4);

  return (
    <main className="page wrap section--last product">
      <Link to="/merch" className="product__back">← Весь мерч</Link>
      <div className="product__grid">
        <div className="product__media">
          <div className={`product__photo ${photos.length ? "product__photo--image" : ""}`}>
            {photos.length ? <img src={photos[shown]} alt={item.title} /> : <span aria-hidden="true">{item.type}</span>}
          </div>
          {photos.length > 1 && (
            <div className="product__thumbs" role="group" aria-label="Фото вещи">
              {photos.map((src, i) => (
                <button key={src} type="button" aria-pressed={i === shown} aria-label={`Фото ${i + 1} из ${photos.length}`} onClick={() => setShown(i)}>
                  <img src={src} alt="" loading="lazy" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="product__info">
          <p className="product__kicker">{item.type} · {artist ? <Link to={`/artist/${artist.slug}`}>{artist.name}</Link> : "Rhymes Music"}</p>
          <h1 className="product__title">{item.title}</h1>
          <div className="product__price">
            {formatPrice(item.price) && <b>{formatPrice(item.price)}</b>}
            <span className={`merch__status merch__status--${item.status}`}>{MERCH_STATUS[item.status] ?? MERCH_STATUS.soon}</span>
          </div>
          {item.sizes.length > 0 && (
            <div className="product__sizes">
              <span className="muted small">Размеры</span>
              <ul>{item.sizes.map((s) => <li key={s}>{s}</li>)}</ul>
            </div>
          )}
          {item.description && <p className="product__text">{item.description}</p>}
          {buy ? (
            <a className="btn btn--accent product__buy" href={buy} target="_blank" rel="noopener noreferrer">Купить в магазине ↗</a>
          ) : (
            <p className="muted">{item.status === "sold_out" ? "Эта вещь распродана." : "Продажи скоро откроются — следите за анонсами артиста."}</p>
          )}
        </div>
      </div>

      {more.length > 0 && (
        <section className="section" aria-labelledby="h-more">
          <h2 className="h-lg" id="h-more">Ещё {artist ? `от ${artist.name}` : "от лейбла"}</h2>
          <ul className="merch">{more.map((m) => <MiniCard key={m.id} item={m} />)}</ul>
        </section>
      )}
    </main>
  );
}
