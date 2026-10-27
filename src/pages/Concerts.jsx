import { useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "../lib/useQuery";
import { getArtists, getConcerts } from "../lib/api";
import { cityKey, plural, uniqueBy } from "../lib/format";
import { useFilters } from "../lib/useFilters";
import { RevealTitle } from "../components/Reveal";
import { ArtistPhoto } from "../components/Media";
import { FilterBar } from "../components/Filters";
import { GigList, NextGig } from "../components/Gigs";

const FIELDS = { artist: (c) => c.artist_slug, city: (c) => cityKey(c.city) };
const COLLAGE_SIZE = 4;
const EMPTY = []; // стабильная ссылка, чтобы мемоизация не сбрасывалась на каждом рендере

export default function Concerts() {
  const concerts = useQuery(getConcerts, [], { throwOnError: false }); // ошибку показываем в блоке расписания
  const artists = useQuery(getArtists, []);
  const gigs = concerts.data ?? EMPTY;
  const artistList = artists.data ?? EMPTY;

  const bySlug = useMemo(() => new Map(artistList.map((a) => [a.slug, a])), [artistList]);
  const getArtist = useCallback((slug) => bySlug.get(slug), [bySlug]);
  const { values, set, reset, filtered } = useFilters(gigs, FIELDS);

  const filters = useMemo(() => [
    {
      key: "artist", label: "Артист", allLabel: "Все артисты", value: values.artist, onChange: set("artist"),
      options: uniqueBy(gigs, FIELDS.artist).map((slug) => ({ value: slug, label: getArtist(slug)?.name ?? slug }))
    },
    {
      key: "city", label: "Город", allLabel: "Все города", value: values.city, onChange: set("city"),
      // Значение — нормализованный ключ, подпись — первое написание без «г.»
      options: [...new Map(gigs.map((g) => [cityKey(g.city), g.city.replace(/^(г|город)\.?\s+/i, "")])).entries()]
        .sort(([, a], [, b]) => a.localeCompare(b, "ru"))
        .map(([value, label]) => ({ value, label }))
    }
  ], [gigs, values, set, getArtist]);

  const next = gigs[0];
  const collage = artistList.filter((a) => a.photo).slice(0, COLLAGE_SIZE);

  return (
    <main>
      <header className="stage-head">
        <div className="stage-head__photos" aria-hidden="true">
          {collage.map((a) => <div key={a.slug} className="stage-head__photo"><ArtistPhoto artist={a} eager /></div>)}
        </div>
        <div className="wrap stage-head__inner">
          <div className="stage-head__copy">
            <RevealTitle as="h1" className="h-xxl">Концерты</RevealTitle>
            <p className="section__lead">Туры, фестивали и клубные шоу артистов Rhymes Music.</p>
            {gigs.length > 0 && <ConcertStats gigs={gigs} />}
          </div>
          {next && <NextGig gig={next} artistName={getArtist(next.artist_slug)?.name} />}
        </div>
      </header>

      <section className="section section--last wrap concerts-list" aria-label="Расписание">
        {concerts.loading && <div className="page-loading" />}
        {concerts.error && <p className="muted">Не удалось загрузить концерты. Обновите страницу.</p>}
        {gigs.length > 0 && (
          <>
            <FilterBar filters={filters} count={filtered.length} onReset={reset} />
            {filtered.length ? <GigList gigs={filtered} getArtist={getArtist} /> : <p className="muted">По этим фильтрам концертов нет.</p>}
            <p className="muted small concerts__note">Даты собраны из открытых билетных сервисов. Перед покупкой проверьте их у организатора.</p>
          </>
        )}
        {concerts.data && gigs.length === 0 && (
          <div className="empty empty--big">
            <p>Ближайшие даты появятся здесь сразу после анонса. Пока можно привезти артистов в свой город.</p>
            <Link className="btn btn--accent" to="/booking">Собрать лайнап</Link>
          </div>
        )}
      </section>
    </main>
  );
}

function ConcertStats({ gigs }) {
  const stats = [
    [gigs.length, ["концерт", "концерта", "концертов"]],
    [new Set(gigs.map((g) => g.city)).size, ["город", "города", "городов"]],
    [new Set(gigs.map((g) => g.artist_slug)).size, ["артист", "артиста", "артистов"]]
  ];
  return (
    <dl className="stage-stats">
      {stats.map(([n, forms]) => (
        <div key={forms[0]}>
          <dt>{plural(n, forms)}</dt>
          <dd>{n}</dd>
        </div>
      ))}
    </dl>
  );
}
