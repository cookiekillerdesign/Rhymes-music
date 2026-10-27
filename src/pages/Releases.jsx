import { useMemo } from "react";
import { useQuery } from "../lib/useQuery";
import { getArtists, getReleases } from "../lib/api";
import { ALL, useFilters } from "../lib/useFilters";
import ReleaseGrid from "../components/ReleaseGrid";
import { FilterBar } from "../components/Filters";
import { RevealTitle } from "../components/Reveal";

const FIELDS = { artist: (r) => r.slug, type: (r) => r.type };
/** Все типы релизов в одном порядке; тип без релизов виден, но недоступен — понятно, что фильтр есть */
const TYPES = [
  { value: "Сингл", label: "Синглы" },
  { value: "EP", label: "EP" },
  { value: "Альбом", label: "Альбомы" },
  { value: "Сборник", label: "Сборники" }
];
const EMPTY = [];

export default function Releases() {
  const releases = useQuery(getReleases, []);
  const artists = useQuery(getArtists, []);
  const list = releases.data ?? EMPTY;
  const { values, set, reset, filtered } = useFilters(list, FIELDS);

  const withReleases = useMemo(
    () => (artists.data ?? EMPTY).filter((a) => list.some((r) => r.slug === a.slug)),
    [artists.data, list]
  );

  // Счётчики по типам считаются с учётом выбранного артиста
  const typeOptions = useMemo(() => {
    const scope = values.artist === ALL ? list : list.filter((r) => r.slug === values.artist);
    const known = new Set(TYPES.map((t) => t.value));
    const extra = [...new Set(scope.map((r) => r.type).filter((t) => t && !known.has(t)))].map((t) => ({ value: t, label: t }));
    return [...TYPES, ...extra].map((t) => {
      const count = scope.filter((r) => r.type === t.value).length;
      return { ...t, count, disabled: count === 0 && values.type !== t.value };
    });
  }, [list, values.artist, values.type]);

  const filters = [
    { key: "artist", label: "Артист", allLabel: "Все артисты", value: values.artist, onChange: set("artist"), options: withReleases.map((a) => ({ value: a.slug, label: a.name })) },
    { key: "type", label: "Тип", allLabel: "Все типы", value: values.type, onChange: set("type"), options: typeOptions }
  ];

  return (
    <main className="page wrap section--last">
      <header className="page__head">
        <RevealTitle as="h1" className="h-xxl">Релизы</RevealTitle>
      </header>
      {releases.data && artists.data ? (
        <>
          <FilterBar filters={filters} count={filtered.length} onReset={reset} />
          {filtered.length ? <ReleaseGrid releases={filtered} artists={artists.data} /> : <p className="muted">По этим фильтрам релизов нет.</p>}
        </>
      ) : <div className="page-loading" />}
    </main>
  );
}
