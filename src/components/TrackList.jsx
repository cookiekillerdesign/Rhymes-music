import { usePlayer } from "./Player";
import { Icon } from "./Icons";
import { Cover } from "./Media";
import Platforms from "./Platforms";
import { formatStreams, itemKey } from "../lib/format";

/* Трек-лист: клик по строке играет трек и ставит весь список в очередь */
export default function TrackList({ tracks, ranked = false, limit }) {
  const player = usePlayer();
  const list = limit ? tracks.slice(0, limit) : tracks;
  const max = Math.max(...tracks.map((t) => t.streams || 0), 1);

  return (
    <ol className={`tracks ${ranked ? "tracks--ranked" : ""}`}>
      {list.map((t, i) => {
        const current = player.isCurrent(t);
        const playable = Boolean(t.preview || t.spotify);
        return (
          <li key={itemKey(t)} className={`track ${current ? "is-current" : ""}`}>
            {ranked && <span className="track__rank">{i + 1}</span>}
            <button
              className="track__play"
              onClick={() => player.play(t, tracks.filter((x) => x.preview || x.spotify))}
              disabled={!playable}
              aria-label={playable ? `${current && player.playing ? "Пауза" : "Слушать"}: ${t.title}` : `${t.title}: превью нет`}
            >
              <Cover src={t.cover} />
              {playable && <span className="track__icon">{current && player.playing ? <span className="eq" aria-hidden="true"><i /><i /><i /></span> : <Icon name="play" size={18} />}</span>}
            </button>
            <div className="track__meta">
              <b>{t.title}</b>
              <span>{t.artists}</span>
            </div>
            {t.streams ? (
              <div className="track__streams" title={`${t.streams.toLocaleString("ru-RU")} прослушиваний в Spotify`}>
                <span>{formatStreams(t.streams)}</span>
                <i style={{ transform: `scaleX(${t.streams / max})` }} />
              </div>
            ) : <span className="track__streams" />}
            <Platforms track={t} compact className="track__platforms" />
          </li>
        );
      })}
    </ol>
  );
}
