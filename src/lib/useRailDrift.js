import { useEffect } from "react";
import { prefersReducedMotion } from "./scroll";

/**
 * Горизонтальная лента понемногу сдвигается вбок, пока страницу листают вниз.
 * Как только человек сам трогает ленту, эффект выключается насовсем:
 * управление пользователя важнее декоративного движения.
 *
 * @param {React.RefObject<HTMLElement>} ref контейнер с overflow-x
 * @param {{ enabled?: boolean, maxShare?: number }} options maxShare — максимальный сдвиг в долях ширины ленты
 */
export function useRailDrift(ref, { enabled = true, maxShare = 0.75 } = {}) {
  useEffect(() => {
    const rail = ref.current;
    if (!enabled || !rail || prefersReducedMotion()) return undefined;

    let frame = 0;

    const update = () => {
      frame = 0;
      const { top, height } = rail.getBoundingClientRect();
      const vh = window.innerHeight;
      const progress = Math.min(1, Math.max(0, (vh - top) / (vh + height)));
      const maxScroll = rail.scrollWidth - rail.clientWidth;
      if (maxScroll > 0) rail.scrollLeft = progress * Math.min(maxScroll, rail.clientWidth * maxShare);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const onWheel = (e) => { if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) release(); };

    function detach() {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      rail.removeEventListener("pointerdown", release);
      rail.removeEventListener("wheel", onWheel);
      if (frame) cancelAnimationFrame(frame);
    }
    function release() {
      rail.dataset.touched = "true";
      detach();
    }

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    rail.addEventListener("pointerdown", release, { passive: true });
    rail.addEventListener("wheel", onWheel, { passive: true });
    update();
    return detach;
  }, [ref, enabled, maxShare]);
}
