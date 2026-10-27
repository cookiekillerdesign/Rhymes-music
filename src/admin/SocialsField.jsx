import { SOCIAL_NAMES } from "./fields";

/** Список соцсетей: название из подсказок или своё + ссылка */
export default function SocialsField({ value, onChange, error }) {
  const update = (i, patch) => onChange(value.map((s, k) => (k === i ? { ...s, ...patch } : s)));
  const remove = (i) => onChange(value.filter((_, k) => k !== i));
  const add = () => onChange([...value, { name: SOCIAL_NAMES.find((n) => !value.some((s) => s.name === n)) ?? "", url: "" }]);

  return (
    <div className="adm-socials">
      <datalist id="adm-social-names">
        {SOCIAL_NAMES.map((n) => <option key={n} value={n} />)}
      </datalist>
      {value.map((s, i) => (
        <div key={i} className="adm-socials__row">
          <input list="adm-social-names" placeholder="Площадка" value={s.name} onChange={(e) => update(i, { name: e.target.value })} aria-label="Площадка" />
          <input type="url" placeholder="https://" value={s.url} onChange={(e) => update(i, { url: e.target.value })} aria-label={`Ссылка ${s.name}`} />
          <button type="button" className="adm-icon-btn" onClick={() => remove(i)} aria-label={`Удалить ${s.name || "ссылку"}`}>×</button>
        </div>
      ))}
      <button type="button" className="adm-link" onClick={add}>+ Добавить ссылку</button>
      {error && <p className="adm-error">{error}</p>}
    </div>
  );
}
