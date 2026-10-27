import ImageUpload from "./ImageUpload";

/** Дополнительные фото: список с удалением и перестановкой, новое — через обычную загрузку */
export default function GalleryField({ value, onChange, onUploaded, config, folderParam }) {
  const move = (i, d) => {
    const next = [...value];
    [next[i], next[i + d]] = [next[i + d], next[i]];
    onChange(next);
  };
  return (
    <div className="cms-gallery">
      {value.length > 0 && (
        <ul className="cms-gallery__list">
          {value.map((url, i) => (
            <li key={url}>
              <img src={url} alt={`Фото ${i + 2}`} />
              <span className="cms-gallery__actions">
                <button type="button" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Левее">←</button>
                <button type="button" onClick={() => move(i, 1)} disabled={i === value.length - 1} aria-label="Правее">→</button>
                <button type="button" onClick={() => onChange(value.filter((_, k) => k !== i))} aria-label="Убрать фото">×</button>
              </span>
            </li>
          ))}
        </ul>
      )}
      <ImageUpload key={value.length} value="" config={config} folderParam={folderParam} label="Добавить фото"
        onUploaded={onUploaded} onChange={(url) => url && onChange([...value, url])} />
    </div>
  );
}
