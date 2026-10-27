import { useCallback, useMemo, useState } from "react";

export const ALL = "all";

/**
 * Состояние набора фильтров и отфильтрованный список.
 * `fields` объявляйте на уровне модуля, чтобы ссылка была стабильной.
 *
 * @template T
 * @param {T[]} items
 * @param {Record<string, (item: T) => string>} fields как достать значение фильтра из элемента
 * @example
 *   const FIELDS = { artist: (c) => c.artist_slug, city: (c) => c.city };
 *   const { values, set, reset, filtered } = useFilters(concerts, FIELDS);
 */
export function useFilters(items, fields) {
  const initial = useMemo(() => Object.fromEntries(Object.keys(fields).map((key) => [key, ALL])), [fields]);
  const [values, setValues] = useState(initial);

  const set = useCallback((key) => (value) => setValues((v) => ({ ...v, [key]: value })), []);
  const reset = useCallback(() => setValues(initial), [initial]);

  const filtered = useMemo(
    () => items.filter((item) => Object.entries(fields).every(([key, pick]) => values[key] === ALL || pick(item) === values[key])),
    [items, fields, values]
  );

  return { values, set, reset, filtered };
}
