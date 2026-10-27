import { useRef } from "react";
import { Link } from "react-router-dom";
import { usePlayer } from "./Player";
import { Icon } from "./Icons";
import { Cover } from "./Media";
import { useRailDrift } from "../lib/useRailDrift";
import { itemKey } from "../lib/format";

/**
 * Сетка релизов или горизонтальная лента (rail). Лента на главной дрейфует
 * при скролле страницы, а в конце показывает карточку «Все релизы» (more).
 */
export default function ReleaseGrid({ releases, artists, rail = false, more = false }) {
  const player = usePlayer();
  const listRef = useRef(null);
  useRailDrift(listRef, { enabled: rail });
  const playable = releases.filter((r) => r.preview || r.spotify);

  return (
    <ul className={rail ? "rail" : "release-grid"} ref={listRef}>
      {releases.map((r) => {
        const current = player.isCurrent(r);
        const artist = artists?.find((a) => a.slug === r.slug);
        return (
          <li key={itemKey(r)} className={`release ${current ? "is-current" : ""}`}>
            <button className="release__art" data-cursor={current && player.playing ? "Пауза" : "Слушать"} onClick={() => player.play(r, playable)} aria-label={`Слушать ${r.title}`}>
              <Cover src={r.cover} alt="" />
              <span className="release__play"><Icon name={current && player.playing ? "pause" : "play"} size={22} /></span>
            </button>
            <div className="release__meta">
              <b>{r.title}</b>
              {artist ? <Link to={`/artist/${artist.slug}`}>{r.artists}</Link> : <span>{r.artists}</span>}
              <small>{r.type}</small>
            </div>
          </li>
        );
      })}
      {more && (
        <li className="release release--more">
          <Link to="/releases" className="release__more">
            <span>Все релизы</span>
            <i aria-hidden="true"><Icon name="arrow" size={22} /></i>
          </Link>
        </li>
      )}
    </ul>
  );
}
