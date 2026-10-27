import { Link } from "react-router-dom";
import { Icon } from "./Icons";
import { dateParts, groupByMonth, monthName, pluralize, safeUrl } from "../lib/format";

const CONCERT_FORMS = ["концерт", "концерта", "концертов"];

/**
 * Концерты, сгруппированные по месяцам. Один список для страницы «Концерты»
 * и для тура на странице артиста.
 * @param {{ gigs: object[], getArtist?: (slug: string) => object | undefined, ctaVariant?: "accent" | "ghost" }} props
 */
export function GigList({ gigs, getArtist, ctaVariant = "accent" }) {
  return (
    <div className="gl">
      {groupByMonth(gigs).map(({ key, items }) => (
        <section key={key} aria-labelledby={`gl-${key}`}>
          <h3 className="gl__head" id={`gl-${key}`}>
            {monthName(key)} <span className="gl__year">{key.slice(0, 4)}</span>
            <small className="gl__count">{pluralize(items.length, CONCERT_FORMS)}</small>
          </h3>
          <ul className="gl__list">
            {items.map((gig) => <GigRow key={gig.id} gig={gig} artist={getArtist?.(gig.artist_slug)} ctaVariant={ctaVariant} />)}
          </ul>
        </section>
      ))}
    </div>
  );
}

function GigRow({ gig, artist, ctaVariant }) {
  const { day, month, weekday } = dateParts(gig.date);
  const ticketUrl = safeUrl(gig.ticket_url);
  return (
    <li className={`gig ${artist ? "gig--with-artist" : ""}`}>
      <time className="gig__date" dateTime={gig.date}>
        <b className="gig__day">{day}</b>
        <span className="gig__month">{month} <span className="gig__weekday">{weekday}</span></span>
      </time>
      <div className="gig__place">
        <b className="gig__city">{gig.city}</b>
        {gig.venue && <span className="gig__venue">{gig.venue}</span>}
      </div>
      {artist && <Link className="gig__artist" to={`/artist/${artist.slug}`}>{artist.name}</Link>}
      {ticketUrl ? (
        <a className={`btn btn--${ctaVariant} gig__cta`} href={ticketUrl} target="_blank" rel="noopener noreferrer" aria-label={`Билеты: ${gig.city}, ${day} ${month}`}>
          Билеты <Icon name="arrow" size={16} />
        </a>
      ) : (
        <span className="gig__soon">Скоро в продаже</span>
      )}
    </li>
  );
}

/** Карточка ближайшего концерта в шапке страницы «Концерты» */
export function NextGig({ gig, artistName }) {
  const { day, month, weekday } = dateParts(gig.date);
  const ticketUrl = safeUrl(gig.ticket_url);
  return (
    <article className="nextgig" aria-labelledby="nextgig-title">
      <h2 className="nextgig__kicker" id="nextgig-title">Ближайший концерт</h2>
      <div className="nextgig__row">
        <time className="nextgig__date" dateTime={gig.date}>
          <b>{day}</b>
          <span>{month}, {weekday}</span>
        </time>
        <div className="nextgig__place">
          <b>{gig.city}</b>
          <span>{[artistName, gig.venue].filter(Boolean).join(", ")}</span>
        </div>
      </div>
      {ticketUrl && (
        <a className="btn btn--accent nextgig__cta" href={ticketUrl} target="_blank" rel="noopener noreferrer">
          Купить билет <Icon name="arrow" size={16} />
        </a>
      )}
    </article>
  );
}
