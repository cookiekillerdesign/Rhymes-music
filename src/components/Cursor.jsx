import { useEffect, useRef, useState } from "react";

/* Элементы, к которым кольцо «прилипает» и которые тянутся за курсором */
const MAGNETIC = "a.btn, button.btn, .soc, .hero-nav__arrows button, .job-row__go";
const INTERACTIVE = "a, button, [role=slider], input, select, textarea, label";

const FOLLOW = 0.2;          // скорость, с которой кольцо догоняет точку
const FOLLOW_MAGNET = 0.3;
const LABEL_FOLLOW = 0.16;
const PULL = { x: 0.22, y: 0.28 }; // сила магнита
const RING_GAP = 14;         // зазор кольца вокруг магнитного элемента
const MAX_SPEED = 70;

/*
 * Курсор для мыши: точка и кольцо с инерцией. Кольцо вытягивается по направлению
 * движения, обтягивает кнопки (а они тянутся к курсору) и показывает подписи
 * из data-cursor («Слушать», «Открыть»). На тач-экранах и при reduced motion не создаётся.
 */
const supportsCursor = () =>
  typeof window !== "undefined" &&
  matchMedia("(hover: hover) and (pointer: fine)").matches &&
  !matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function Cursor() {
  const ref = useRef(null);
  // Решаем один раз и просто не рендерим курсор: удалять узел, которым владеет React,
  // нельзя — при размонтировании removeChild падает
  const [enabled] = useState(supportsCursor);

  useEffect(() => {
    if (!enabled) return undefined;
    const root = ref.current;
    const html = document.documentElement;
    const dot = root.querySelector(".cursor__dot");
    const ring = root.querySelector(".cursor__ring");
    const label = root.querySelector(".cursor__label");

    const mouse = { x: -200, y: -200 };
    const prev = { ...mouse };
    const ringPos = { ...mouse };
    const labelPos = { ...mouse };
    let stretch = 1;
    let angle = 0;
    let magnet = null;
    let frame = 0;

    html.classList.add("has-cursor");

    const releaseMagnet = () => {
      if (!magnet) return;
      // Свойство translate, а не transform: не затираем собственные transform кнопки (:active, hover)
      magnet.style.transition = "";
      magnet.style.translate = "";
      magnet = null;
      root.classList.remove("is-magnet");
      ring.style.removeProperty("width");
      ring.style.removeProperty("height");
      ring.style.removeProperty("border-radius");
    };

    const attachMagnet = (el) => {
      magnet = el;
      root.classList.add("is-magnet");
      const { width, height } = el.getBoundingClientRect();
      ring.style.width = `${width + RING_GAP}px`;
      ring.style.height = `${height + RING_GAP}px`;
      ring.style.borderRadius = getComputedStyle(el).borderRadius === "0px" ? "14px" : "999px";
    };

    const onMove = (e) => {
      wake();
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      const target = e.target instanceof Element ? e.target : null;

      const text = target?.closest("[data-cursor]")?.dataset.cursor ?? "";
      root.classList.toggle("is-label", Boolean(text));
      if (label.textContent !== text) label.textContent = text;
      root.classList.toggle("is-link", !text && Boolean(target?.closest(INTERACTIVE)));

      const next = text ? null : target?.closest(MAGNETIC) ?? null;
      if (next !== magnet) {
        releaseMagnet();
        if (next) attachMagnet(next);
      }
      if (magnet) {
        const r = magnet.getBoundingClientRect();
        magnet.style.translate = `${(mouse.x - r.left - r.width / 2) * PULL.x}px ${(mouse.y - r.top - r.height / 2) * PULL.y}px`;
      }
    };

    const tick = () => {
      let tx = mouse.x;
      let ty = mouse.y;
      if (magnet) {
        const r = magnet.getBoundingClientRect();
        tx = r.left + r.width / 2;
        ty = r.top + r.height / 2;
      }
      const vx = mouse.x - prev.x;
      const vy = mouse.y - prev.y;
      prev.x = mouse.x;
      prev.y = mouse.y;
      const speed = Math.min(Math.hypot(vx, vy), MAX_SPEED);
      stretch += (1 + (magnet ? 0 : speed / 120) - stretch) * 0.2;
      if (speed > 2 && !magnet) angle = (Math.atan2(vy, vx) * 180) / Math.PI;

      const k = magnet ? FOLLOW_MAGNET : FOLLOW;
      ringPos.x += (tx - ringPos.x) * k;
      ringPos.y += (ty - ringPos.y) * k;
      labelPos.x += (mouse.x - labelPos.x) * LABEL_FOLLOW;
      labelPos.y += (mouse.y - labelPos.y) * LABEL_FOLLOW;

      dot.style.transform = `translate3d(${mouse.x}px, ${mouse.y}px, 0)`;
      ring.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0) translate(-50%, -50%) rotate(${magnet ? 0 : angle}deg) scale(${stretch}, ${1 / stretch})`;
      label.style.transform = `translate3d(${labelPos.x}px, ${labelPos.y}px, 0) translate(-50%, -50%)`;

      // Всё догнало мышь и кольцо не тянется — засыпаем до следующего движения
      const settled = Math.abs(tx - ringPos.x) < 0.1 && Math.abs(ty - ringPos.y) < 0.1
        && Math.abs(mouse.x - labelPos.x) < 0.1 && Math.abs(mouse.y - labelPos.y) < 0.1 && Math.abs(stretch - 1) < 0.001;
      frame = settled ? 0 : requestAnimationFrame(tick);
    };
    const wake = () => { if (!frame) frame = requestAnimationFrame(tick); };

    const onLeave = () => root.classList.add("is-out");
    const onEnter = () => root.classList.remove("is-out");
    const onDown = () => root.classList.add("is-down");
    const onUp = () => root.classList.remove("is-down");

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("scroll", releaseMagnet, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    document.addEventListener("pointerenter", onEnter);
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      releaseMagnet();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("scroll", releaseMagnet);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("pointerenter", onEnter);
      html.classList.remove("has-cursor");
    };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <div className="cursor" ref={ref} aria-hidden="true">
      <div className="cursor__ring" />
      <div className="cursor__dot" />
      <div className="cursor__label" />
    </div>
  );
}
