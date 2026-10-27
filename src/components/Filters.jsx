import { ALL } from "../lib/useFilters";
import Dropdown from "./Dropdown";

/**
 * Панель фильтров со счётчиком и сбросом.
 * @param {{ filters: { key, label, allLabel, value, onChange, options }[], count: number, onReset: () => void }} props
 */
export function FilterBar({ filters, count, onReset }) {
  const hasActive = filters.some((f) => f.value !== ALL);
  return (
    <div className="fbar">
      <div className="fbar__row">
        {filters.map(({ key, allLabel, options, label, value, onChange }) => (
          <Dropdown key={key} label={label} value={value} onChange={onChange} options={[{ value: ALL, label: allLabel }, ...options]} />
        ))}
      </div>
      <div className="fbar__meta">
        <span aria-live="polite">Найдено: {count}</span>
        {hasActive && <button type="button" className="link-btn" onClick={onReset}>Сбросить</button>}
      </div>
    </div>
  );
}
