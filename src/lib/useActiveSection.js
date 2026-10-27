import { useEffect, useState } from "react";

/**
 * Активный раздел: последний, чей верх прошёл линию срабатывания.
 * В отличие от IntersectionObserver с порогом по центру экрана не пропускает
 * короткие секции; в самом низу страницы активен последний раздел.
 *
 * @param {string[]} ids id секций в порядке на странице (мемоизированный массив)
 * @param {() => number} getLine y линии срабатывания от верха вьюпорта (стабильная функция)
 */
export function useActiveSection(ids, getLine) {
  const [active, setActive] = useState(ids[0]);

  useEffect(() => {
    if (!ids.length) return undefined;
    let frame = 0;

    const update = () => {
      frame = 0;
      const line = getLine();
      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) current = id;
      }
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      setActive(atBottom ? ids.at(-1) : current);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [ids, getLine]);

  return active;
}
