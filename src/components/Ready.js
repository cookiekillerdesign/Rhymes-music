import { useEffect, useState } from "react";

/*
 * Сигнал «страница готова к интро-анимациям». Прелоадера больше нет: сигнал подаётся сразу
 * после первого рендера (main.jsx), но хук оставлен — анимации не должны стартовать до монтирования.
 */
export const markReady = () => {
  document.documentElement.dataset.ready = "1";
  window.dispatchEvent(new Event("rm:ready"));
};
export function useReady() {
  const [ready, setReady] = useState(() => document.documentElement.dataset.ready === "1");
  useEffect(() => {
    if (ready) return undefined;
    const on = () => setReady(true);
    window.addEventListener("rm:ready", on);
    return () => window.removeEventListener("rm:ready", on);
  }, [ready]);
  return ready;
}
