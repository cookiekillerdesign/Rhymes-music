import { useMemo } from "react";
import { Link } from "react-router-dom";
import { RevealTitle } from "../components/Reveal";
import { FilterBar } from "../components/Filters";
import { useQuery } from "../lib/useQuery";
import { getArtists, getMerch, isLive } from "../lib/api";
import { formatPrice, MERCH_STATUS as STATUS, safeUrl, uniqueBy } from "../lib/format";
import { useFilters } from "../lib/useFilters";

const LABEL_MERCH = "label"; // значение фильтра для вещей самого лейбла (artist: null)
const ownerOf = (m) => m.artist ?? LABEL_MERCH;
const FIELDS = { artist: ownerOf, type: (m) => m.type };


export default function Merch() {
  const { data: artists } = useQuery(getArtists, []);
  const { data: merch } = useQuery(getMerch, []);
  const items = useMemo(() => merch ?? [], [merch]);
  const byArtist = (slug) => artists?.find((a) => a.slug === slug);
  const { values, set, reset, filtered } = useFilters(items, FIELDS);

  const filters = [
    {
      key: "artist", label: "Артист", allLabel: "Все артисты", value: values.artist, onChange: set("artist"),
      options: uniqueBy(items, ownerOf).map((o) => ({ value: o, label: o === LABEL_MERCH ? "Rhymes Music" : byArtist(o)?.name ?? o }))
    },
    {
      key: "type", label: "Вещь", allLabel: "Все вещи", value: values.type, onChange: set("type"),
      options: uniqueBy(items, FIELDS.type).map((t) => ({ value: t, label: t }))
    }
  ];

  return (
    <main className="page wrap">
      <header className="page__head">
        <RevealTitle as="h1" className="h-xxl">Мерч</RevealTitle>
        <p className="section__lead">Официальный мерч артистов Rhymes Music. Делаем полный цикл: дизайн, производство у проверенных подрядчиков и доставка.</p>
      </header>

      <FilterBar filters={filters} count={filtered.length} onReset={reset} />

      {merch && !items.length ? (
        <p className="section__lead merch__empty">Коллекции готовятся. Загляните позже или напишите нам — сделаем мерч для вашего события.</p>
      ) : (
        <ul className="merch">
          {filtered.map((m) => {
            const a = byArtist(m.artist);
            const image = safeUrl(m.image);
            return (
              <li key={m.id} className="merch__item">
                <Link to={`/merch/${m.id}`} className="merch__link">
                  <div className={`merch__img ${image ? "merch__img--photo" : ""}`}>
                    {image ? <img src={image} alt="" loading="lazy" /> : <span aria-hidden="true">{m.type}</span>}
                  </div>
                  <div className="merch__meta">
                    <b>{m.title}</b>
                    <span>{a ? a.name : "Rhymes Music"}</span>
                    <span className="merch__row">
                      {formatPrice(m.price) && <span className="merch__price">{formatPrice(m.price)}</span>}
                      <span className={`merch__status merch__status--${m.status}`}>{STATUS[m.status] ?? STATUS.soon}</span>
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
      {!isLive && <p className="muted small merch__note">Позиции показаны для примера: каталог, цены и фото товаров ведутся в админке лейбла.</p>}

      <section className="section split section--last" aria-labelledby="h-merch-b2b">
        <h2 className="h-lg" id="h-merch-b2b">Мерч для артиста</h2>
        <div>
          <p className="about__bio">Разработаем коллекцию под артиста или тур: от идеи и дизайна до производства и продаж на концертах.</p>
          <a className="btn btn--accent" href="mailto:sales@rhymesmusic.com?subject=Мерч">Обсудить мерч</a>
        </div>
      </section>
    </main>
  );
}
