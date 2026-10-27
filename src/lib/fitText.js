/**
 * Подбор масштаба шрифта, при котором текст укладывается в maxLines строк и не вылезает по ширине.
 * Чистая функция: замер делегирован measure(scale), поэтому алгоритм тестируется без браузера.
 *
 * @param {(scale: number) => { lines: number, overflowsX: boolean }} measure
 * @param {{ maxLines: number, minScale: number, steps?: number }} options
 * @returns {{ scale: number, fits: boolean }} fits=false — даже на minScale не влезло
 */
export function fitScale(measure, { maxLines, minScale, steps = 7 }) {
  const ok = (scale) => {
    const { lines, overflowsX } = measure(scale);
    return lines <= maxLines && !overflowsX;
  };
  if (ok(1)) return { scale: 1, fits: true };
  if (!ok(minScale)) return { scale: minScale, fits: false };

  // Бинарный поиск наибольшего масштаба, который ещё помещается
  let lo = minScale;
  let hi = 1;
  for (let i = 0; i < steps; i++) {
    const mid = (lo + hi) / 2;
    if (ok(mid)) lo = mid;
    else hi = mid;
  }
  return { scale: Math.floor(lo * 100) / 100, fits: true };
}
