import { useId, useState } from "react";
import { uploadFile } from "../api";

/**
 * Файл документа: загрузить (PDF в публичный бакет) или вставить ссылку на уже лежащий где-то файл.
 * config: { bucket, folder, accept, maxMB }
 */
export default function FileUpload({ value, onChange, onUploaded, config }) {
  const id = useId();
  const [state, setState] = useState(null);

  const handle = async (file) => {
    if (!file) return;
    if (!config.accept.split(",").some((type) => file.type === type.trim())) return setState({ level: "error", text: "Нужен файл PDF" });
    if (file.size > config.maxMB * 1024 * 1024) return setState({ level: "error", text: `Файл больше ${config.maxMB} МБ` });
    setState({ level: "info", text: "Загружаем…" });
    try {
      const url = await uploadFile(config.bucket, config.folder, file);
      onUploaded?.(url);
      onChange(url);
      setState({ level: "ok", text: `Загружено: ${file.name}. Не забудьте сохранить.` });
    } catch (e) {
      setState({ level: "error", text: `Не удалось загрузить: ${e.message}` });
    }
  };

  return (
    <div className="cms-file">
      <div className="cms-file__row">
        <label htmlFor={id} className="adm-btn">Загрузить PDF</label>
        <input id={id} className="cms-visually-hidden" type="file" accept={config.accept} onChange={(e) => { handle(e.target.files[0]); e.target.value = ""; }} />
        {value && <a className="a-link" href={value} target="_blank" rel="noopener noreferrer">Открыть текущий файл</a>}
      </div>
      <input type="url" placeholder="или ссылка на файл: https://…" value={value} onChange={(e) => onChange(e.target.value)} aria-label="Ссылка на файл" />
      {state && <small className={`cms-status cms-status--${state.level}`}>{state.text}</small>}
    </div>
  );
}
