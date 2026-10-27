import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { LogoMark } from "./Logo";
import { prefersReducedMotion, scrollToTarget, waitForHash } from "../lib/scroll";

/*
 * Занавес между страницами: чёрная панель со знаком накрывает экран,
 * под ней меняется страница, затем панель уходит вверх.
 */
/** Прокрутка к якорю, когда нужный элемент появится (до 2 с) */
async function scrollToHash(hash) {
  const el = await waitForHash(hash);
  if (el) scrollToTarget(el);
}

/** После смены страницы переносим фокус в начало контента: скринридер и клавиатура начинают с новой страницы */
function focusContent() {
  const main = document.getElementById("content");
  main?.focus({ preventScroll: true });
}

export default function PageTransition({ children }) {
  const location = useLocation();
  const [shown, setShown] = useState(location);
  const curtain = useRef(null);

  useEffect(() => {
    if (location.pathname === shown.pathname) {
      if (location.hash) scrollToHash(location.hash);
      setShown(location);
      return undefined;
    }
    const swap = () => {
      setShown(location);
      requestAnimationFrame(() => {
        scrollToTarget(0, { immediate: true, offset: 0 });
        ScrollTrigger.refresh();
        focusContent();
        if (location.hash) scrollToHash(location.hash);
      });
    };
    if (prefersReducedMotion()) { swap(); return undefined; }
    const el = curtain.current;
    const tl = gsap.timeline();
    tl.set(el, { yPercent: 100, visibility: "visible" })
      .to(el, { yPercent: 0, duration: 0.6, ease: "expo.inOut" })
      .add(swap)
      .to(el, { yPercent: -100, duration: 0.75, ease: "expo.inOut", delay: 0.1 })
      .set(el, { visibility: "hidden" });
    // Переход прервали (например, «Назад» сразу после клика): убираем занавес,
    // иначе убитый таймлайн оставит панель поверх страницы. Новый переход начнётся с нуля.
    return () => {
      tl.kill();
      gsap.set(el, { visibility: "hidden", yPercent: 100 });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  useEffect(() => {
    const titles = { "/": "Rhymes Music", "/artists": "Артисты", "/releases": "Релизы", "/concerts": "Концерты", "/contacts": "Контакты", "/merch": "Мерч", "/for-artists": "Артистам", "/team": "Команда", "/jobs": "Вакансии", "/legal": "Документы", "/booking": "Организаторам" };
    if (titles[shown.pathname]) document.title = shown.pathname === "/" ? "Rhymes Music" : `${titles[shown.pathname]} — Rhymes Music`;
  }, [shown]);

  return (
    <>
      {children(shown)}
      <div className="curtain" ref={curtain} aria-hidden="true"><LogoMark className="curtain__mark" /></div>
    </>
  );
}
