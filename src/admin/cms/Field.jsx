import { useId } from "react";
import ImageUpload from "./ImageUpload";
import FileUpload from "./FileUpload";
import GalleryField from "./GalleryField";
import Markdown from "../../components/Markdown";

/** Одно поле формы по описанию из resources.js */
export default function Field({ field, value, error, onChange, artists, folderParam, onUploaded, disabled }) {
  const id = useId();
  const common = { id, disabled: disabled || field.readOnly, "aria-invalid": Boolean(error), "aria-describedby": error || field.hint ? `${id}-help` : undefined };
  let control;
  switch (field.type) {
    case "textarea":
      control = <textarea {...common} rows={field.rows ?? 4} maxLength={field.max} value={value} onChange={(e) => onChange(e.target.value)} />;
      break;
    case "list":
      control = <textarea {...common} rows={5} value={value} onChange={(e) => onChange(e.target.value)} />;
      break;
    case "markdown":
      control = (
        <div className="cms-markdown">
          <textarea {...common} rows={18} maxLength={field.max} value={value} onChange={(e) => onChange(e.target.value)} />
          <div className="cms-markdown__preview" aria-label="Предпросмотр">
            <Markdown source={value} className="legal__text" />
          </div>
        </div>
      );
      break;
    case "number":
      control = <input {...common} type="number" inputMode="numeric" step="1" value={value} onChange={(e) => onChange(e.target.value)} />;
      break;
    case "date":
      control = <input {...common} type="date" value={value} onChange={(e) => onChange(e.target.value)} />;
      break;
    case "select":
      control = (
        <select {...common} value={value} onChange={(e) => onChange(e.target.value)}>
          {field.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      );
      break;
    case "artist":
      control = (
        <select {...common} value={value} onChange={(e) => onChange(e.target.value)}>
          <option value="">{field.nullLabel ?? "Выберите артиста…"}</option>
          {artists.map((a) => <option key={a.slug} value={a.slug}>{a.name}</option>)}
        </select>
      );
      break;
    case "checkbox":
      return (
        <label className="adm-check cms-field--wide">
          <input type="checkbox" checked={value} disabled={disabled} onChange={(e) => onChange(e.target.checked)} /> {field.label}
        </label>
      );
    case "file":
      return (
        <div className={`adm-field cms-field--wide ${error ? "has-error" : ""}`}>
          <span>{field.label}{field.required ? <span aria-hidden="true"> *</span> : null}</span>
          <FileUpload value={value} onChange={onChange} onUploaded={onUploaded} config={field.file} />
          {(error || field.hint) && <small className={error ? "adm-error" : "adm-muted"}>{error || field.hint}</small>}
        </div>
      );
    case "gallery":
      return (
        <div className="adm-field cms-field--wide">
          <span>{field.label}</span>
          <GalleryField value={value} onChange={onChange} onUploaded={onUploaded} config={field.image} folderParam={folderParam} />
          {field.hint && <small className="adm-muted">{field.hint}</small>}
        </div>
      );
    case "image":
      return (
        <div className={`adm-field ${field.wide !== false ? "cms-field--wide" : ""}`}>
          <span>{field.label}</span>
          <ImageUpload value={value} onChange={onChange} onUploaded={onUploaded} config={field.image} folderParam={folderParam} label={field.label} />
        </div>
      );
    default: {
      const listId = field.suggestions ? `${id}-list` : undefined;
      control = (
        <>
          <input {...common} type={field.type === "url" ? "url" : "text"} list={listId} maxLength={field.max} value={value}
            placeholder={field.type === "url" || field.type === "youtube" || field.type === "spotify" ? "https://" : undefined}
            onChange={(e) => onChange(e.target.value)} />
          {listId && <datalist id={listId}>{field.suggestions.map((s) => <option key={s} value={s} />)}</datalist>}
        </>
      );
    }
  }
  return (
    <div className={`adm-field ${field.wide || field.type === "markdown" ? "cms-field--wide" : ""} ${error ? "has-error" : ""}`}>
      <label htmlFor={id}>{field.label}{field.required && !field.readOnly ? <span aria-hidden="true"> *</span> : null}</label>
      {control}
      {(error || field.hint) && <small id={`${id}-help`} className={error ? "adm-error" : "adm-muted"}>{error || field.hint}</small>}
    </div>
  );
}
