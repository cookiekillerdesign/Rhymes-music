import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Marquee from "../components/Marquee";
import { useQuery } from "../lib/useQuery";
import { getArtists, getChart, getLabel, getReleases } from "../lib/api";
import { usePlayer } from "../components/Player";
import ArtistIndex from "../components/ArtistIndex";
import TrackList from "../components/TrackList";
import ReleaseGrid from "../components/ReleaseGrid";
import Platforms from "../components/Platforms";
import { Cover } from "../components/Media";
import { Icon } from "../components/Icons";
import { RevealTitle, CountUp } from "../components/Reveal";
import { useReady } from "../components/Ready";
import { prefersReducedMotion } from "../lib/scroll";
import FitTitle from "../components/FitTitle";
import { LABEL } from "../data/content";
import { itemKey } from "../lib/format";

/* Чередуем релизы разных артистов, чтобы на сцене не стоял один артист подряд */
/** Сколько свежих релизов показывать на первом экране и в ленте (остальные — на /releases) */
const HERO_RELEASES = 5;
/** Минимальная длина горизонтального свайпа по первому экрану, px */
const SWIPE_PX = 48;
const RAIL_RELEASES = 24;

const SLIDE_MS = 7000;

const pad2 = (n) => String(n).padStart(2, "0");

function Chevron({ back = false }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      <path d={back ? "m15 5-7 7 7 7" : "m9 5 7 7-7 7"} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* Навигация карусели: счётчик, полосы автопрокрутки (на десктопе с названиями), стрелки */
function HeroNav({ releases, index, onSelect, paused, stopped, onToggleStop }) {
  const total = releases.length;
  const go = (k) => onSelect((k + total) % total);
  return (
    <div className="hero-nav wrap">
      <span className="hero-nav__count" aria-hidden="true"><b>{pad2(index + 1)}</b> / {pad2(total)}</span>
      <ol className="hero-nav__list">
        {releases.map((x, k) => (
          <li key={itemKey(x)}>
            <button type="button" onClick={() => onSelect(k)} aria-current={k === index} aria-label={`${x.title}, ${x.artists}`}>
              <span className="hero-nav__title">{x.title}</span>
              <i className={k === index && !paused ? "is-running" : ""} style={{ animationDuration: `${SLIDE_MS}ms` }} />
            </button>
          </li>
        ))}
      </ol>
      <div className="hero-nav__arrows">
        {/* WCAG 2.2.2: автопрокрутку должно быть можно остановить */}
        <button type="button" onClick={onToggleStop} aria-pressed={stopped} aria-label={stopped ? "Продолжить автопрокрутку" : "Остановить автопрокрутку"}>
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
            {stopped ? <path d="M8 5v14l11-7z" fill="currentColor" /> : <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" fill="currentColor" />}
          </svg>
        </button>
        <button type="button" onClick={() => go(index - 1)} aria-label="Предыдущий релиз"><Chevron back /></button>
        <button type="button" onClick={() => go(index + 1)} aria-label="Следующий релиз"><Chevron /></button>
      </div>
    </div>
  );
}

function HeroReleases({ releases, artists }) {
  const [rawIndex, setI] = useState(0);
  const [hoverPaused, setPaused] = useState(false);
  const [stopped, setStopped] = useState(false); // остановлено кнопкой — до следующего нажатия
  const paused = hoverPaused || stopped;
  // Список мог сократиться после фонового обновления: индекс не должен выйти за границу
  const i = releases.length ? rawIndex % releases.length : 0;
  const player = usePlayer();
  const ready = useReady();
  const root = useRef(null);
  const r = releases[i];
  const artist = artists.find((a) => a.slug === r.slug);

  useEffect(() => {
    if (paused || prefersReducedMotion()) return undefined;
    const t = setTimeout(() => setI((x) => (x + 1) % releases.length), SLIDE_MS);
    return () => clearTimeout(t);
  }, [i, paused, releases.length]);

  // Свайп по первому экрану на телефоне: влево — следующий релиз, вправо — предыдущий.
  // Срабатывает только на явно горизонтальный жест, вертикальный скролл не мешает (touch-action: pan-y).
  const swipe = useRef(null);
  const onPointerDown = (e) => {
    if (e.pointerType === "touch") swipe.current = { x: e.clientX, y: e.clientY };
  };
  const onPointerUp = (e) => {
    const start = swipe.current;
    swipe.current = null;
    if (!start || e.pointerType !== "touch") return;
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    if (Math.abs(dx) < SWIPE_PX || Math.abs(dx) < Math.abs(dy) * 1.5) return;
    setI((x) => (x + (dx < 0 ? 1 : -1) + releases.length) % releases.length);
  };

  // Смена слайда: обложка раскрывается, строки названия выезжают
  useEffect(() => {
    if (!ready || prefersReducedMotion()) return undefined;
    const ctx = gsap.context(() => {
      gsap.fromTo(".hero__cover", { clipPath: "inset(0 0 100% 0)", scale: 1.08 }, { clipPath: "inset(0 0 0% 0)", scale: 1, duration: 1.2, ease: "expo.out" });
      gsap.fromTo(".hero__title > span", { yPercent: 110 }, { yPercent: 0, duration: 1.1, ease: "expo.out", stagger: 0.06, delay: 0.1 });
      gsap.fromTo(".hero__fade", { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.8, delay: 0.35, stagger: 0.06 });
    }, root);
    return () => ctx.revert();
  }, [i, ready]);

  // Главный вау-момент: при скролле обложка вырастает из квадрата на весь экран,
  // а название уезжает на её место. Только десктоп: на телефоне пин мешает скроллу.
  const pausedByScroll = useRef(false);
  useEffect(() => {
    if (!ready || prefersReducedMotion()) return undefined;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 901px)", () => {
      const hero = root.current;
      const art = hero.querySelector(".hero__art");
      const zoom = hero.querySelector(".hero__zoom");
      const copy = hero.querySelector(".hero__copy");
      const box = () => {
        const h = hero.getBoundingClientRect(), c = art.getBoundingClientRect();
        return { left: c.left - h.left, top: c.top - h.top, width: c.width, height: c.height };
      };
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: hero, start: "top top", end: "+=110%", pin: true, scrub: 0.8, invalidateOnRefresh: true,
          onUpdate: (st) => {
            const p = st.progress > 0.02;
            if (p !== pausedByScroll.current) { pausedByScroll.current = p; setPaused(p); }
          }
        }
      });
      tl.set(zoom, { autoAlpha: 1 }, 0.001)
        .set(art, { autoAlpha: 0 }, 0.001)
        .fromTo(zoom,
          { left: () => box().left, top: () => box().top, width: () => box().width, height: () => box().height, borderRadius: 4 },
          { left: 0, top: 0, width: "100%", height: "100%", borderRadius: 0, ease: "power2.inOut", duration: 1 }, 0)
        .fromTo(".hero__zoom-shade", { opacity: 0 }, { opacity: 1, duration: 1 }, 0)
        .to(copy, { x: () => art.getBoundingClientRect().left - copy.getBoundingClientRect().left, ease: "power2.inOut", duration: 1 }, 0)
        .to(".hero-nav", { autoAlpha: 0, duration: 0.3 }, 0);
      ScrollTrigger.refresh();
    });
    return () => mm.revert();
  }, [ready]);

  // Наклон обложки за курсором
  const tilt = (e) => {
    if (!matchMedia("(hover: hover)").matches) return;
    const b = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - b.left) / b.width - 0.5, y = (e.clientY - b.top) / b.height - 0.5;
    e.currentTarget.style.setProperty("--rx", `${-y * 10}deg`);
    e.currentTarget.style.setProperty("--ry", `${x * 12}deg`);
  };

  const playable = releases.filter((x) => x.preview || x.spotify);
  const current = player.isCurrent(r);
  const spinning = current && player.playing;
  // Свечение, пластинка и заглушка обложки окрашиваются в палитру артиста текущего релиза
  const [c1, c2] = artist?.palette ?? LABEL.palette;

  return (
    <section className="hero" ref={root} style={{ "--c1": c1, "--c2": c2 }} onPointerEnter={() => setPaused(true)} onPointerLeave={() => setPaused(pausedByScroll.current)} onPointerDown={onPointerDown} onPointerUp={onPointerUp} onPointerCancel={() => { swipe.current = null; }} aria-roledescription="карусель" aria-label="Релизы Rhymes Music">
      {/* Фон: видео артиста, если оно есть в админке, иначе фото; всегда затемнено */}
      <div className="hero__bg" aria-hidden="true">
        {releases.map((x, k) => {
          const a = artists.find((y) => y.slug === x.slug);
          const on = k === i ? "is-on" : "";
          if (a?.video) return <video key={itemKey(x)} className={on} src={a.video} poster={a.photo} autoPlay muted loop playsInline preload={k === i ? "auto" : "none"} />;
          return <img key={itemKey(x)} className={on} src={a?.photo || x.cover} alt="" loading={k === 0 ? "eager" : "lazy"} />;
        })}
      </div>
      <div className="hero__shade" aria-hidden="true" />
      <div className="hero__glow" aria-hidden="true" />

      <div className="hero__zoom" aria-hidden="true">
        <Cover src={r.cover} alt="" />
        <i className="hero__zoom-shade" />
      </div>

      <div className="hero__inner wrap">
        <div className="hero__art" data-cursor="Слушать" onClick={() => player.play(r, playable)} onPointerMove={tilt} onPointerLeave={(e) => { e.currentTarget.style.setProperty("--rx", "0deg"); e.currentTarget.style.setProperty("--ry", "0deg"); }}>
          <span className={`hero__disc ${spinning ? "is-spinning" : ""}`} aria-hidden="true" />
          <Cover src={r.cover} alt={`Обложка: ${r.title}`} className="hero__cover" />
        </div>
        <div className="hero__copy">
          <p className="hero__fade hero__kicker"><span className="hero__badge">Новый релиз</span><span>{r.type}</span></p>
          {/* Объявляем смену слайда, только когда автопрокрутка стоит, иначе скринридер говорит каждые 7 с */}
          <FitTitle className="hero__title" text={r.title} maxLines={2} aria-live={paused ? "polite" : "off"} />
          <p className="hero__fade hero__artists">{artist ? <Link to={`/artist/${artist.slug}`}>{r.artists}</Link> : r.artists}</p>
          <div className="hero__fade hero__actions">
            <button className="btn btn--accent btn--lg" onClick={() => player.play(r, playable)}>
              <Icon name={spinning ? "pause" : "play"} size={18} />
              {spinning ? "Пауза" : "Слушать"}
            </button>
            <Platforms track={r} compact className="hero__platforms" />
          </div>
        </div>
      </div>

      <HeroNav releases={releases} index={i} onSelect={setI} paused={paused} stopped={stopped} onToggleStop={() => setStopped((v) => !v)} />
    </section>
  );
}

export default function Home() {
  const artists = useQuery(getArtists, []);
  const releases = useQuery(getReleases, [], { refreshOnFocus: true });
  const chart = useQuery(getChart, []);
  const label = useQuery(getLabel, []);
  const [fullChart, setFullChart] = useState(false);
  // Релизы уже отсортированы от новых к старым (getReleases): первый экран — самые свежие
  const featured = useMemo(() => (releases.data ?? []).slice(0, HERO_RELEASES), [releases.data]);

  if (!artists.data || !releases.data || !chart.data || !label.data) return <div className="page-loading" />;

  return (
    <main>
      {featured.length > 0 && <HeroReleases releases={featured} artists={artists.data} />}
      <Marquee />

      <section className="section wrap" aria-labelledby="h-artists">
        <div className="section__head">
          <RevealTitle className="h-xl" as="h2">Артисты</RevealTitle>
          <p className="section__lead" id="h-artists">Ростер лейбла фрешменов: от кьют-рока и поп-панка до рейва и хип-хопа.</p>
        </div>
        <ArtistIndex artists={artists.data} />
      </section>

      <section className="section wrap" aria-labelledby="h-chart">
        <div className="section__head">
          <RevealTitle className="h-xl" as="h2">Чарт лейбла</RevealTitle>
          <p className="section__lead" id="h-chart">Самые прослушиваемые треки Rhymes Music в Spotify.</p>
        </div>
        <TrackList tracks={chart.data} ranked limit={fullChart ? undefined : 10} />
        {chart.data.length > 10 && (
          <button className="btn btn--ghost section__more" onClick={() => setFullChart(!fullChart)}>
            {fullChart ? "Свернуть чарт" : `Показать все ${chart.data.length}`}
          </button>
        )}
      </section>

      <section className="section" aria-labelledby="h-releases">
        <div className="section__head wrap">
          <RevealTitle className="h-xl" as="h2">Релизы</RevealTitle>
          <Link to="/releases" className="section__link" id="h-releases">Все релизы <Icon name="arrow" size={18} /></Link>
        </div>
        <ReleaseGrid releases={releases.data.slice(0, RAIL_RELEASES)} artists={artists.data} rail more />
      </section>

      <section className="section wrap label-facts" aria-labelledby="h-label">
        <div className="section__head">
          <RevealTitle className="h-xl" as="h2">{["С 2011 года"]}</RevealTitle>
          <p className="section__lead" id="h-label">{label.data.intro}</p>
        </div>
        <ul className="facts">
          {label.data.stats.map((s) => (
            <li key={s.label}><b><CountUp value={s.value} suffix={s.suffix} /></b><span>{s.label}</span></li>
          ))}
        </ul>
      </section>

      <section className="section wrap doors" aria-label="Работа с лейблом">
        <Link to="/booking" className="door" data-cursor="Перейти">
          <span className="door__kicker">Организаторам и брендам</span>
          <b className="door__title"><span>Соберите</span> <span>лайнап</span></b>
          <span className="door__text">Добавьте артистов в лайнап и отправьте одну заявку на всех. Пресс-киты и райдеры лежат на страницах артистов.</span>
          <span className="door__go"><Icon name="arrow" /></span>
        </Link>
        <Link to="/for-artists#h-demo" className="door door--accent" data-cursor="Перейти">
          <span className="door__kicker">Артистам</span>
          <b className="door__title"><span>Отправьте</span> <span>демо</span></b>
          <span className="door__text">Маркетинг релизов, видеопродакшн, туры, интеграции и мерч. Пришлите ссылку на трек и пару слов о себе.</span>
          <span className="door__go"><Icon name="arrow" /></span>
        </Link>
      </section>
    </main>
  );
}
