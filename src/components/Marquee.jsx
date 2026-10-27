import { useEffect, useRef } from "react";
import { logoMaskUrl } from "./Logo";
import { getLenis, prefersReducedMotion } from "../lib/scroll";

/*
 * Бегущая строка, которая разгоняется от скорости скролла и меняет направление
 * вместе с ним. Две строки едут навстречу друг другу.
 */
const MASK = logoMaskUrl();

function Row({ text, dir = 1, outline = false }) {
  const track = useRef(null);
  useEffect(() => {
    if (prefersReducedMotion()) return undefined;
    const el = track.current;
    let x = 0, raf, sign = dir, half = el.scrollWidth / 2;
    const ro = new ResizeObserver(() => { half = el.scrollWidth / 2; });
    ro.observe(el);
    const loop = () => {
      const v = getLenis()?.velocity || 0;
      if (Math.abs(v) > 0.5) sign = Math.sign(v) * dir;
      x -= (0.6 + Math.min(Math.abs(v) * 0.6, 14)) * sign;
      if (x <= -half) x += half;
      if (x > 0) x -= half;
      el.style.transform = `translate3d(${x}px, 0, 0)`;
      raf = requestAnimationFrame(loop);
    };
    // Крутим строку, только пока она на экране
    const io = new IntersectionObserver(([entry]) => {
      cancelAnimationFrame(raf);
      raf = entry.isIntersecting ? requestAnimationFrame(loop) : 0;
    });
    io.observe(el);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); };
  }, [dir]);

  // Знак — блок с CSS-маской, а не inline SVG: у SVG во flex-строке Safari неверно
  // считает ширину, и знак наезжал на текст.
  const chunk = Array.from({ length: 4 }, (_, i) => (
    <span key={i} className="marquee__chunk">
      <span>{text}</span>
      <i className="marquee__mark" style={{ "--mask": MASK }} aria-hidden="true" />
    </span>
  ));
  return (
    <div className={`marquee__row ${outline ? "is-outline" : ""}`}>
      <div className="marquee__track" ref={track}>{chunk}{chunk}</div>
    </div>
  );
}

export default function Marquee() {
  return (
    <section className="marquee" aria-label="Rhymes Music, лейбл фрешменов с 2011 года">
      <Row text="Лейбл фрешменов" />
      <Row text="Rhymes Music с 2011 года" dir={-1} outline />
    </section>
  );
}
