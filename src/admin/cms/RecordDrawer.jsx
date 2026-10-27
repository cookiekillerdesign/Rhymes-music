import { useEffect, useMemo, useRef, useState } from "react";
import Field from "./Field";
import { formToRow, keyFromTitle, rowToForm, validateForm, visibleFields as shownFields } from "./core";
import { createRow, deleteRow, updateRow } from "./api";
import { deletePhotos } from "../api";

/**
 * Боковая панель создания и редактирования записи. Esc и клик по фону закрывают её
 * (с вопросом, если есть несохранённые изменения), фокус переносится внутрь.
 * fixed — значения, заданные контекстом (например, artist_slug в карточке артиста).
 */
export default function RecordDrawer({ resource, row, fixed = {}, artists, artistName, onClose, onSaved }) {
  const isNew = !row;
  const contextFields = resource.fields.filter((f) => !(f.onlyGlobal && f.name in fixed));
  const defaults = useMemo(() => {
    const d = {};
    for (const f of resource.fields) if (f.defaultFromArtist && artistName) d[f.name] = artistName;
    return { ...d, ...fixed };
  }, [resource, fixed, artistName]);

  const initial = useMemo(() => rowToForm(resource, row, defaults), [resource, row, defaults]);
  const [form, setForm] = useState(initial);
  const visibleFields = shownFields(contextFields, form);
  const [errors, setErrors] = useState({});
  const [state, setState] = useState({ saving: false, error: "" });
  const [keyTouched, setKeyTouched] = useState(false);
  const uploads = useRef(new Set());
  const panel = useRef(null);
  const dirty = JSON.stringify(form) !== JSON.stringify(initial);

  const keyField = resource.fields.find((f) => f.keyField);
  const set = (name, value) => {
    if (keyField && name === keyField.name) setKeyTouched(true);
    setForm((f) => {
      const next = { ...f, [name]: value };
      // Новый документ, вакансия, человек: ключ из названия, пока его не правили руками
      if (isNew && keyField && !keyTouched && name === resource.textKey?.from) next[keyField.name] = keyFromTitle(value);
      return next;
    });
  };
  const imageBuckets = [...new Set(resource.fields.filter((f) => f.type === "image").map((f) => f.image.bucket))];

  const close = () => {
    if (dirty && !window.confirm("Закрыть без сохранения?")) return;
    for (const bucket of imageBuckets) deletePhotos([...uploads.current], bucket);
    onClose();
  };

  useEffect(() => {
    panel.current?.querySelector("input, textarea, select")?.focus();
    const onKey = (e) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- close читает актуальное состояние через замыкание каждого рендера
  }, [dirty]);

  const save = async (e) => {
    e.preventDefault();
    const found = validateForm({ ...resource, fields: contextFields }, form);
    setErrors(found);
    if (Object.keys(found).length) return setState({ saving: false, error: "Проверьте поля, отмеченные красным" });
    setState({ saving: true, error: "" });
    try {
      const data = { ...formToRow({ ...resource, fields: contextFields }, form), ...fixed };
      if (isNew && keyField) data[keyField.name] = form[keyField.name];
      const saved = isNew ? await createRow(resource, data) : await updateRow(resource, row[resource.idKey], data);
      // Заменённые и неиспользованные картинки удаляем из хранилища
      const imageFields = resource.fields.filter((f) => f.type === "image");
      const kept = new Set(imageFields.map((f) => saved[f.name]));
      const stale = [...uploads.current, ...imageFields.map((f) => row?.[f.name])].filter((u) => u && !kept.has(u));
      for (const bucket of imageBuckets) deletePhotos(stale, bucket);
      uploads.current.clear();
      onSaved(saved, isNew);
    } catch (err) {
      setState({ saving: false, error: err.code === "23505" ? "Такая запись уже есть (совпадает адрес или идентификатор)" : err.message });
    }
  };

  const remove = async () => {
    if (!window.confirm(`Удалить ${resource.one}? Это нельзя отменить.`)) return;
    try {
      await deleteRow(resource, row[resource.idKey]);
      const images = resource.fields.filter((f) => f.type === "image");
      for (const f of images) deletePhotos([row[f.name]].filter(Boolean), f.image.bucket);
      onSaved(null, false);
    } catch (err) {
      setState({ saving: false, error: err.message });
    }
  };

  return (
    <div className="cms-drawer" role="presentation" onMouseDown={(e) => e.target === e.currentTarget && close()}>
      <form ref={panel} className="cms-drawer__panel" role="dialog" aria-modal="true" aria-labelledby="cms-drawer-title" onSubmit={save} noValidate>
        <header className="cms-drawer__head">
          <h2 id="cms-drawer-title">{isNew ? resource.add : resource.summary(row).title}</h2>
          <button type="button" className="adm-icon-btn" onClick={close} aria-label="Закрыть">×</button>
        </header>
        <div className="cms-drawer__body cms-grid">
          {visibleFields.map((f) => (
            <Field key={f.name} field={{ ...f, readOnly: f.readOnly || (f.keyField && !isNew) }} value={form[f.name]} error={errors[f.name]}
              onChange={(v) => set(f.name, v)} artists={artists} folderParam={fixed.artist_slug ?? form.artist_slug ?? "label"}
              onUploaded={(url) => uploads.current.add(url)} />
          ))}
        </div>
        <footer className="cms-drawer__foot">
          {state.error && <p className="adm-note adm-note--error" role="alert">{state.error}</p>}
          <div className="adm-actions__row">
            {!resource.readOnly && <button type="submit" className="adm-btn adm-btn--primary" disabled={state.saving}>{state.saving ? "Сохраняем…" : isNew ? "Создать" : "Сохранить"}</button>}
            <button type="button" className="adm-btn" onClick={close}>Отмена</button>
            {!isNew && !resource.noDelete && <button type="button" className="adm-btn adm-btn--danger cms-drawer__delete" onClick={remove}>Удалить</button>}
          </div>
        </footer>
      </form>
    </div>
  );
}
