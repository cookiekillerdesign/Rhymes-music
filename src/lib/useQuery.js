import { useEffect, useState } from "react";

const REFRESH_AFTER_MS = 5 * 60_000;

/**
 * Минимальный загрузчик данных: { data, loading, error }.
 * refreshOnFocus — тихо перезапрашивает данные, когда вкладку открыли снова спустя 5+ минут:
 * так долго открытая главная показывает релизы, найденные синхронизацией.
 * throwOnError — ошибка загрузки пробрасывается в ближайший ErrorBoundary, а не превращается
 * в вечный лоадер или «Не найдено». Страницы, которые показывают ошибку сами, передают false.
 */
export function useQuery(fn, deps, { refreshOnFocus = false, throwOnError = true } = {}) {
  const [state, setState] = useState({ data: null, loading: true, error: null });

  useEffect(() => {
    let alive = true;
    let loadedAt = 0;

    const load = (silent) => {
      if (!silent) setState((s) => ({ ...s, loading: true, error: null }));
      fn()
        .then((data) => {
          loadedAt = Date.now();
          if (alive) setState({ data, loading: false, error: null });
        })
        .catch((error) => {
          // при тихом обновлении ошибка не стирает уже показанные данные
          if (alive && !silent) setState({ data: null, loading: false, error });
        });
    };
    const onVisible = () => {
      if (document.visibilityState === "visible" && Date.now() - loadedAt > REFRESH_AFTER_MS) load(true);
    };

    load(false);
    if (refreshOnFocus) document.addEventListener("visibilitychange", onVisible);
    return () => {
      alive = false;
      document.removeEventListener("visibilitychange", onVisible);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- зависимости задаёт вызывающий код
  }, deps);

  if (throwOnError && state.error) throw state.error;
  return state;
}
