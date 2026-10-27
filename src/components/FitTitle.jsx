import { useLayoutEffect, useRef } from "react";
import { fitScale } from "../lib/fitText";

/**
 * Заголовок, который всегда занимает не больше maxLines строк.
 * Длинное название уменьшает шрифт, а не высоту блока: место под maxLines строк
 * максимального размера зарезервировано в CSS (.fit-title), поэтому при смене
 * слайда с коротким названием на длинное соседние блоки не прыгают.
 * Нижняя граница — minFontPx: на десктопе базовый шрифт огромный, на телефоне маленький,
 * поэтому предел задан в пикселях, а не в долях. Не влезло и так — переносим внутри слов
 * и обрезаем с многоточием (полное название — в title).
 */
export default function FitTitle({ as: Tag = "h1", text, maxLines = 2, minFontPx = 24, className = "", ...rest }) {
  const boxRef = useRef(null);
  const textRef = useRef(null);

  useLayoutEffect(() => {
    const box = boxRef.current;
    const span = textRef.current;
    if (!box || !span) return undefined;

    const measure = (scale) => {
      span.style.fontSize = `${scale}em`;
      const lineHeight = parseFloat(getComputedStyle(span).lineHeight);
      return {
        lines: Math.round(span.offsetHeight / lineHeight),
        overflowsX: span.scrollWidth > box.clientWidth + 1,
      };
    };

    const fit = () => {
      box.classList.remove("is-clamped");
      const baseFontPx = parseFloat(getComputedStyle(box).fontSize);
      const minScale = Math.min(1, minFontPx / baseFontPx);
      const { scale, fits } = fitScale(measure, { maxLines, minScale });
      span.style.fontSize = `${scale}em`;
      box.classList.toggle("is-clamped", !fits);
    };

    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(box);
    // Веб-шрифт может догрузиться позже и поменять ширину букв
    document.fonts?.ready.then(fit);
    return () => observer.disconnect();
  }, [text, maxLines, minFontPx]);

  return (
    <Tag ref={boxRef} className={`fit-title ${className}`} style={{ "--fit-lines": maxLines }} title={text} {...rest}>
      <span ref={textRef}>{text}</span>
    </Tag>
  );
}
