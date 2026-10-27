/* Единый экземпляр Lenis: им пользуются роутер, якоря и эффекты скорости скролла */
let lenis = null;
export const setLenis = (l) => { lenis = l; };
export const getLenis = () => lenis;

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Элемент по якорю «#id». getElementById, а не querySelector: id вроде «1-tour»
 * или с кириллицей — невалидный CSS-селектор, и querySelector бросает SyntaxError.
 */
function elementForHash(hash) {
  if (!hash || hash === "#") return null;
  let id = hash.replace(/^#/, "");
  try { id = decodeURIComponent(id); } catch { /* битая %-последовательность — ищем как есть */ }
  return document.getElementById(id);
}

/** Ждёт появления элемента по якорю: страница может ещё грузить lazy-чанк или данные */
export function waitForHash(hash, timeoutMs = 2000) {
  return new Promise((resolve) => {
    const started = performance.now();
    const check = () => {
      const el = elementForHash(hash);
      if (el || performance.now() - started > timeoutMs) resolve(el);
      else requestAnimationFrame(check);
    };
    check();
  });
}

export function scrollToTarget(target, { immediate = false, offset = -80 } = {}) {
  const el = typeof target === "string" ? (target.startsWith("#") ? elementForHash(target) : document.querySelector(target)) : target;
  if (lenis) { lenis.scrollTo(typeof target === "number" ? target : el, { immediate, offset, duration: 1.3 }); return; }
  const behavior = immediate || prefersReducedMotion() ? "auto" : "smooth";
  if (typeof target === "number") { window.scrollTo({ top: target, behavior }); return; }
  if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + offset, behavior });
}
