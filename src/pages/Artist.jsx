import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import gsap from "gsap";
import { useQuery } from "../lib/useQuery";
import { getArtist, getConcerts } from "../lib/api";
import { usePlayer } from "../components/Player";
import StageLights from "../components/StageLights";
import { ArtistPhoto } from "../components/Media";
import ReleaseGrid from "../components/ReleaseGrid";
import TrackList from "../components/TrackList";
import VideoGrid from "../components/VideoGrid";
import Backstage from "../components/Backstage";
import BookingForm from "../components/BookingForm";
import { LineupButton } from "../components/Lineup";
import { artistPlatformLinks, PlatformList } from "../components/Platforms";
import { Icon } from "../components/Icons";
import { useReady } from "../components/Ready";
import { formatDate } from "../lib/format";
import { useActiveSection } from "../lib/useActiveSection";
import { GigList } from "../components/Gigs";
import { SocialLinks } from "../components/Social";
import { prefersReducedMotion, scrollToTarget } from "../lib/scroll";
import NotFound from "./NotFound";

const TAB_LINE_GAP = 48;   // раздел активируется, когда его верх подошёл к табам на это расстояние
const TAB_SCROLL_GAP = 20; // зазор между табами и заголовком раздела после перехода

/**
 * Отступ для прокрутки к разделу: высота табов, а если цель выше — ещё и шапки,
 * которая выедет при скролле вверх.
 */
function sectionOffset(target, tabsEl) {
  const goingUp = target.getBoundingClientRect().top < 0;
  const navHeight = goingUp ? Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--nav-h")) || 0 : 0;
  return -((tabsEl?.offsetHeight ?? 0) + navHeight + TAB_SCROLL_GAP);
}

export default function Artist() {
  const { slug } = useParams();
  const { data: a, loading } = useQuery(() => getArtist(slug), [slug]);
  const concerts = useQuery(getConcerts, [], { throwOnError: false }); // без концертов страница артиста всё равно нужна
  const player = usePlayer();
  const ready = useReady();
  const hero = useRef(null);
  const tabsBar = useRef(null);
  const tabsRef = useRef(null);
  const [ind, setInd] = useState({ x: 0, w: 0 });

  const tabs = useMemo(() => {
    if (!a) return [];
    return [
      // «Об артисте» — первым: сначала знакомство, потом музыка
      { id: "about", label: "Об артисте" },
      { id: "music", label: "Музыка" },
      a.videos.length && { id: "videos", label: "Клипы" },
      { id: "concerts", label: "Концерты" },
      { id: "booking", label: "Организаторам" }
    ].filter(Boolean);
  }, [a]);
  const tabIds = useMemo(() => tabs.map((t) => t.id), [tabs]);
  const tabsLine = useCallback(() => (tabsBar.current?.getBoundingClientRect().bottom ?? 0) + TAB_LINE_GAP, []);
  const active = useActiveSection(tabIds, tabsLine);

  const goToSection = (e, id) => {
    e.preventDefault();
    const target = document.getElementById(id);
    if (!target) return;
    history.replaceState(history.state, "", `#${id}`); // state роутера сохраняем: иначе «Назад» теряет его
    scrollToTarget(target, { offset: sectionOffset(target, tabsBar.current) });
  };

  // Заголовок вкладки и описание для соцсетей — у каждого артиста свои
  useEffect(() => {
    if (!a) return;
    document.title = `${a.name} — Rhymes Music`;
    document.querySelector('meta[name="description"]')?.setAttribute("content", a.tagline ? `${a.name}: ${a.tagline}. Релизы, клипы и концерты.` : `${a.name}: релизы, клипы и концерты.`);
  }, [a]);

  // Индикатор под активным табом; на телефоне активный таб прокручивается в зону видимости
  useEffect(() => {
    const bar = tabsRef.current;
    const link = bar?.querySelector(`[data-tab="${active}"]`);
    if (!link) return;
    setInd({ x: link.offsetLeft, w: link.offsetWidth });
    const sc = bar.parentElement;
    sc.scrollTo({ left: link.offsetLeft - sc.clientWidth / 2 + link.offsetWidth / 2, behavior: "smooth" });
  }, [active, tabs]);

  useEffect(() => {
    if (!a || !ready || prefersReducedMotion()) return undefined;
    let mm;
    const ctx = gsap.context(() => {
      gsap.fromTo(".ahero__media", { scale: 1.15, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 1.6, ease: "expo.out" });
      gsap.fromTo(".ahero__name > span", { yPercent: 110 }, { yPercent: 0, duration: 1.2, ease: "expo.out", delay: 0.15 });
      gsap.fromTo(".ahero__fade", { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.8, delay: 0.5, stagger: 0.07 });
      // Вау-момент страницы артиста: фото во весь экран при скролле сжимается в карточку,
      // имя растёт и уходит вперёд, будто камера проезжает сквозь него
      mm = gsap.matchMedia();
      mm.add("(min-width: 901px)", () => {
        gsap.timeline({ scrollTrigger: { trigger: hero.current, start: "top top", end: "+=90%", pin: true, scrub: 0.8 } })
          .to(".ahero__frame", { clipPath: "inset(9% 6% 9% 6% round 18px)", ease: "power2.inOut" }, 0)
          .to(".ahero__media", { scale: 1.12, ease: "none" }, 0)
          .to(".ahero__name", { scale: 1.35, yPercent: -30, autoAlpha: 0, transformOrigin: "0% 100%", ease: "power2.in" }, 0)
          .to(".ahero__fade", { autoAlpha: 0, y: -20, ease: "power1.in", duration: 0.5 }, 0)
          .fromTo(".ahero__after", { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, ease: "power2.out", duration: 0.5 }, 0.5);
      });
      mm.add("(max-width: 900px)", () => {
        gsap.to(".ahero__media", { scale: 1.15, transformOrigin: "50% 0%", ease: "none", scrollTrigger: { trigger: hero.current, start: "top top", end: "bottom top", scrub: true } });
      });
    }, hero);
    return () => { mm?.revert(); ctx.revert(); };
  }, [a, ready]);

  if (loading) return <div className="page-loading" />;
  if (!a) return <NotFound />;

  const playable = [...a.popular, ...a.releases].filter((t) => t.preview || t.spotify);
  const first = playable[0];
  const own = (concerts.data || []).filter((c) => c.artist_slug === a.slug);
  const bookingLink = (e) => goToSection(e, "booking");

  return (
    <main className="artist" style={{ "--c1": a.palette[0], "--c2": a.palette[1] }}>
      <section className={`ahero ${a.photo ? "" : "ahero--lights"}`} ref={hero}>
        <div className="ahero__frame" aria-hidden="true">
          <div className="ahero__media">
            {a.photo ? <ArtistPhoto artist={a} eager /> : null}
          </div>
          {!a.photo && <StageLights palette={a.palette} className="ahero__lights" />}
          <div className="ahero__shade" />
        </div>
        <p className="ahero__after" aria-hidden="true"><span>{a.name}</span><span>Rhymes Music</span></p>
        <div className="ahero__inner wrap">
          {a.tagline && <p className="ahero__fade ahero__tagline">{a.tagline}</p>}
          <h1 className="ahero__name"><span>{a.name}</span></h1>
          <div className="ahero__fade ahero__actions">
            {first && (
              <button className="btn btn--accent btn--lg" onClick={() => player.play(first, playable)}>
                <Icon name={player.isCurrent(first) && player.playing ? "pause" : "play"} size={18} /> Слушать
              </button>
            )}
            <LineupButton artist={a} className="btn--lg" />
          </div>
          <SocialLinks items={a.socials} onMedia className="ahero__fade ahero__socials" />
        </div>
      </section>

      <nav className="tabs" ref={tabsBar} aria-label="Разделы артиста">
        <div className="tabs__scroll">
          <div className="tabs__list" ref={tabsRef}>
            <span className="tabs__ind" style={{ transform: `translateX(${ind.x}px)`, width: ind.w }} aria-hidden="true" />
            {tabs.map((t) => (
              <a key={t.id} data-tab={t.id} href={`#${t.id}`} aria-current={active === t.id ? "true" : undefined} onClick={(e) => goToSection(e, t.id)}>
                {t.label}
              </a>
            ))}
          </div>
        </div>
      </nav>

      <section id="about" className="asec wrap about">
        <h2 className="h-lg">Об артисте</h2>
        <div>
          <p className="about__bio">{a.bio || `${a.name} — артист лейбла Rhymes Music. Подробная биография появится здесь в ближайшее время.`}</p>
          {a.bio && a.bioSource && (
            <p className="about__source">
              По материалам <a href={a.bioSource} target="_blank" rel="noopener noreferrer">Википедии</a> (CC BY-SA)
            </p>
          )}
          {a.events.length > 0 && (
            <ul className="news">
              {a.events.map((e) => (
                <li key={e.date + e.title}>
                  {e.image && <img src={e.image} alt="" loading="lazy" />}
                  <div>
                    <time dateTime={e.date}>{formatDate(e.date)}</time>
                    <b>{e.title}</b>
                    <p>{e.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section id="music" className="asec wrap">
        <h2 className="h-lg">Музыка</h2>
        {a.releases.length > 0 && <ReleaseGrid releases={a.releases} />}
        {a.popular.length > 0 && (
          <>
            <h3 className="h-sm asec__sub">Популярное</h3>
            <TrackList tracks={a.popular} />
          </>
        )}
        <div className="asec__platforms">
          <span>Вся дискография на площадках</span>
          <PlatformList links={artistPlatformLinks(a.name)} label={a.name} />
        </div>
      </section>

      {a.videos.length > 0 && (
        <section id="videos" className="asec wrap">
          <h2 className="h-lg">Клипы</h2>
          <VideoGrid videos={a.videos} artist={a.name} />
        </section>
      )}

      <section id="concerts" className="asec wrap">
        <h2 className="h-lg">Концерты</h2>
        {own.length ? (
          <GigList gigs={own} ctaVariant="ghost" />
        ) : (
          <div className="empty">
            <p>Ближайшие даты ещё не объявлены. Хотите привезти артиста в свой город?</p>
            <a className="btn btn--ghost" href="#booking" onClick={bookingLink}>Оставить заявку</a>
          </div>
        )}
      </section>

      <section id="booking" className="asec booking-sec">
        <div className="wrap">
          <h2 className="h-lg">Организаторам</h2>
          <div className="booking-sec__grid">
            <div>
              <h3 className="h-sm">Пресс-кит</h3>
              <Backstage key={a.slug} artist={a} />
            </div>
            <div>
              <h3 className="h-sm">Заявка на выступление</h3>
              <BookingForm artists={[a]} />
              <p className="muted small">Планируете несколько артистов? <LineupButton artist={a} className="btn--sm" /></p>
            </div>
          </div>
        </div>
      </section>

      <Link to={`/artist/${a.next.slug}`} className="next wrap" style={{ "--c1": a.next.palette[0] }}>
        <span>Следующий артист</span>
        <b>{a.next.name}</b>
      </Link>
    </main>
  );
}
