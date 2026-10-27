import { useState } from "react";
import { usePlayer } from "./Player";
import { Icon } from "./Icons";

/*
 * «Лёгкие» клипы: пока не нажали, это просто превью-картинка.
 * Тяжёлый плеер YouTube грузится только по клику, музыка на сайте при этом встаёт на паузу.
 */
function Video({ v, artist }) {
  const [on, setOn] = useState(false);
  const player = usePlayer();
  const start = () => { player.pause(); setOn(true); };
  return (
    <li className="video">
      <div className="video__frame">
        {on ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${v.id}?autoplay=1&rel=0`}
            title={`${artist} — ${v.title}`}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
          />
        ) : (
          <button onClick={start} data-cursor="Смотреть" aria-label={`Смотреть клип ${v.title}`}>
            <img src={`https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`} alt="" loading="lazy" />
            <span className="video__play"><Icon name="play" size={26} /></span>
          </button>
        )}
      </div>
      <b>{v.title}</b>
    </li>
  );
}

export default function VideoGrid({ videos, artist }) {
  return <ul className="video-grid">{videos.map((v) => <Video key={v.id} v={v} artist={artist} />)}</ul>;
}
