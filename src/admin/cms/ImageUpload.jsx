import { useId, useState } from "react";
import { compressPhoto, readImage } from "../image";
import { uploadImage } from "../api";

const FORMATS = ["image/jpeg", "image/png", "image/webp"];
const MAX_MB = 20;

/**
 * Загрузка картинки: проверка размера, сжатие в WebP до recommended px по длинной стороне,
 * загрузка в Storage. config: { bucket, folder, aspect, min, recommended }
 */
export default function ImageUpload({ value, onChange, onUploaded, config, folderParam, label }) {
  const id = useId();
  const [status, setStatus] = useState(null);
  const [busy, setBusy] = useState(false);

  const handle = async (file) => {
    if (!file) return;
    if (!FORMATS.includes(file.type)) return setStatus({ level: "error", text: "Нужен JPG, PNG или WebP" });
    if (file.size > MAX_MB * 1024 * 1024) return setStatus({ level: "error", text: `Файл больше ${MAX_MB} МБ` });
    setBusy(true);
    let bitmap = null;
    try {
      const img = await readImage(file);
      bitmap = img.bitmap;
      if (Math.min(img.width, img.height) < config.min) {
        return setStatus({ level: "error", text: `Картинка ${img.width}×${img.height} — слишком маленькая: нужна сторона от ${config.min} px.` });
      }
      const output = { maxSide: config.recommended, type: "image/webp", quality: 0.86, fallbackType: "image/jpeg", fallbackQuality: 0.88 };
      const { blob } = await compressPhoto(bitmap, output);
      const url = await uploadImage(config.bucket, config.folder(folderParam), blob);
      onUploaded?.(url);
      onChange(url);
      setStatus({ level: "ok", text: `Загружено: ${Math.round(blob.size / 1024)} КБ. Не забудьте сохранить.` });
    } catch (e) {
      setStatus({ level: "error", text: `Не удалось загрузить: ${e.message}` });
    } finally {
      bitmap?.close();
      setBusy(false);
    }
  };

  return (
    <div className="cms-image">
      <div className="cms-image__preview" style={{ aspectRatio: config.aspect }}>
        {value ? <img src={value} alt="" /> : <span className="adm-muted">Нет картинки</span>}
      </div>
      <div className="cms-image__side">
        <label htmlFor={id} className="adm-btn">{busy ? "Загружаем…" : value ? "Заменить" : "Загрузить"}</label>
        <input id={id} className="cms-visually-hidden" type="file" accept={FORMATS.join(",")} disabled={busy}
          aria-label={label} onChange={(e) => { handle(e.target.files[0]); e.target.value = ""; }} />
        {value && <button type="button" className="adm-link" onClick={() => onChange("")}>Убрать</button>}
        <small className="adm-muted">Рекомендуем {config.recommended}px по длинной стороне, минимум {config.min}px. Пропорции {config.aspect.replace(/\s/g, "")}.</small>
        {status && <small className={`cms-status cms-status--${status.level}`}>{status.text}</small>}
      </div>
    </div>
  );
}
