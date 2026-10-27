import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { setLenis, prefersReducedMotion } from "../lib/scroll";

gsap.registerPlugin(ScrollTrigger);

/*
 * Плавный скролл колесом и тачпадом. На тач-экранах остаётся нативная инерция:
 * она лучше чувствуется пальцем и не ломается в iOS.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return undefined;
    const lenis = new Lenis({ lerp: 0.085, smoothWheel: true, syncTouch: false });
    setLenis(lenis);
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (t) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => { gsap.ticker.remove(tick); lenis.destroy(); setLenis(null); };
  }, []);
  return null;
}
