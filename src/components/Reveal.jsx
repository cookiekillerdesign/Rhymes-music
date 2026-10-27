import { useEffect, useRef } from "react";

/*
 * Заголовок секции: строки выезжают из-под маски, когда блок входит в экран.
 * Это единственный повторяющийся эффект появления на сайте.
 */
export function RevealTitle({ as: Tag = "h2", className = "", children }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.classList.add("is-in"); io.disconnect(); }
    }, { rootMargin: "0px 0px -12% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const lines = Array.isArray(children) ? children : [children];
  return (
    <Tag ref={ref} className={`reveal ${className}`}>
      {lines.map((l, i) => (
        <span className="reveal__line" key={i}><span style={{ transitionDelay: `${i * 80}ms` }}>{l}</span></span>
      ))}
    </Tag>
  );
}

/* Счётчик, который досчитывает до значения при появлении */
export function CountUp({ value, suffix = "" }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    const fmt = new Intl.NumberFormat("ru-RU");
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) { el.textContent = fmt.format(value) + suffix; return undefined; }
    let raf;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now(), d = 1600;
      const step = (now) => {
        const p = Math.min(1, (now - t0) / d), k = 1 - Math.pow(1 - p, 4);
        el.textContent = fmt.format(Math.round(value * k)) + suffix;
        if (p < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [value, suffix]);
  return <span ref={ref}>0{suffix}</span>;
}
