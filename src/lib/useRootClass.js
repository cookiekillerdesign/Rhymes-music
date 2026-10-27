import { useEffect } from "react";

/**
 * Держит класс на <html>, пока условие истинно. Так соседние слои узнают о состоянии
 * друг друга (шапка ↔ табы артиста, плеер ↔ футер) без `:has()` и без общего контекста.
 */
export function useRootClass(className, active) {
  useEffect(() => {
    if (!active) return undefined;
    const root = document.documentElement;
    root.classList.add(className);
    return () => root.classList.remove(className);
  }, [className, active]);
}
