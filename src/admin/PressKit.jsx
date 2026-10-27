import { useCallback, useEffect, useId, useState } from "react";
import {
  deletePressFile, listBackstagePasswordScopes, listPressFiles, pressFileUrl, setBackstagePassword, updatePressFile, uploadPressFile
} from "./api";

const PRESS_KINDS = [
  { value: "rider", label: "Райдер" },
  { value: "photo", label: "Промо-фото" },
  { value: "bio", label: "Био / пресс-релиз" },
  { value: "other", label: "Другое" }
];
const ACCEPT = ".pdf,.jpg,.jpeg,.png,.webp,.zip,.doc,.docx";
const MAX_MB = 50;
const guessKind = (file) => (file.type.startsWith("image/") ? "photo" : /rider|райдер/i.test(file.name) ? "rider" : "other");
const baseName = (name) => name.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " ").trim();
const fmtDate = (iso) => new Date(iso).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });

/**
 * Пароль доступа к пресс-киту. scope = 'global' — общий для всех артистов;
 * scope = slug — свой у артиста (пустой — вернуть общий).
 */
export function PasswordForm({ scope, current, onChanged, artistName }) {
  const id = useId();
  const [value, setValue] = useState("");
  const [show, setShow] = useState(false);
  const [state, setState] = useState({ busy: false, note: null });
  const isGlobal = scope === "global";

  const save = async (password) => {
    setState({ busy: true, note: null });
    try {
      await setBackstagePassword(scope, password);
      setValue("");
      setState({ busy: false, note: { level: "ok", text: password ? "Пароль сохранён. Сообщите его организаторам." : "Теперь действует общий пароль." } });
      onChanged?.();
    } catch (e) {
      setState({ busy: false, note: { level: "error", text: e.hint || e.message } });
    }
  };

  return (
    <div className="press-pass">
      <p className="adm-muted">
        {isGlobal
          ? current ? `Общий пароль задан ${fmtDate(current.updated_at)} и открывает пресс-кит любого артиста без своего пароля.` : "Общий пароль ещё не задан — пресс-киты закрыты для всех, кроме артистов со своим паролем."
          : current ? `Для артиста «${artistName ?? "—"}» задан свой пароль (${fmtDate(current.updated_at)}), общий к этому пресс-киту не подходит.` : "Действует общий пароль. Можно задать отдельный — тогда общий к этому пресс-киту подходить перестанет."}
      </p>
      <form className="press-pass__row" onSubmit={(e) => { e.preventDefault(); if (value.trim().length >= 6) save(value.trim()); }}>
        <label htmlFor={id} className="cms-visually-hidden">Новый пароль</label>
        <input id={id} className="adm-search" type={show ? "text" : "password"} autoComplete="new-password" minLength={6} maxLength={200}
          placeholder={current ? "Новый пароль" : "Пароль, от 6 символов"} value={value} onChange={(e) => setValue(e.target.value)} />
        <button type="button" className="adm-btn adm-btn--small" onClick={() => setShow((v) => !v)} aria-pressed={show}>{show ? "Скрыть" : "Показать"}</button>
        <button type="submit" className="adm-btn adm-btn--primary" disabled={state.busy || value.trim().length < 6}>{current ? "Сменить" : "Задать"}</button>
        {!isGlobal && current && <button type="button" className="adm-btn" disabled={state.busy} onClick={() => save("")}>Вернуть общий</button>}
      </form>
      {state.note && <p className={`adm-note adm-note--${state.note.level}`} role="status">{state.note.text}</p>}
    </div>
  );
}

/** Вкладка «Пресс-кит» в карточке артиста: пароль и файлы */
export default function PressKit({ slug, artistName }) {
  const [files, setFiles] = useState(null);
  const [scopes, setScopes] = useState([]);
  const [busy, setBusy] = useState("");
  const [note, setNote] = useState(null);
  const inputId = useId();

  const load = useCallback(async () => {
    try {
      const [f, s] = await Promise.all([listPressFiles(slug), listBackstagePasswordScopes()]);
      setFiles(f);
      setScopes(s);
    } catch (e) {
      setNote({ level: "error", text: e.message });
    }
  }, [slug]);
  useEffect(() => { load(); }, [load]);

  const upload = async (list) => {
    const picked = [...list];
    const tooBig = picked.filter((f) => f.size > MAX_MB * 1024 * 1024);
    if (tooBig.length) return setNote({ level: "error", text: `Больше ${MAX_MB} МБ: ${tooBig.map((f) => f.name).join(", ")}` });
    try {
      for (const [i, file] of picked.entries()) {
        setBusy(`Загружаем ${i + 1} из ${picked.length}: ${file.name}`);
        await uploadPressFile(slug, file, guessKind(file), baseName(file.name));
      }
      setNote({ level: "ok", text: `Загружено файлов: ${picked.length}` });
    } catch (e) {
      setNote({ level: "error", text: `Не удалось загрузить: ${e.message}` });
    } finally {
      setBusy("");
      load();
    }
  };

  const patch = async (row, change) => {
    try {
      await updatePressFile(row.id, change);
      setFiles((list) => list.map((f) => (f.id === row.id ? { ...f, ...change } : f)));
    } catch (e) {
      setNote({ level: "error", text: e.message });
    }
  };

  const remove = async (row) => {
    if (!window.confirm(`Удалить «${row.name}» из пресс-кита?`)) return;
    try {
      await deletePressFile(row);
      load();
    } catch (e) {
      setNote({ level: "error", text: e.message });
    }
  };

  const open = async (row) => {
    try {
      window.open(await pressFileUrl(row.path), "_blank", "noopener");
    } catch (e) {
      setNote({ level: "error", text: e.message });
    }
  };

  const own = scopes.find((s) => s.scope === slug);
  const global = scopes.find((s) => s.scope === "global");

  return (
    <div className="press">
      <section className="adm-section">
        <h2>Пароль для организаторов</h2>
        <PasswordForm scope={slug} current={own} artistName={artistName} onChanged={load} />
        {!own && !global && <p className="adm-note adm-note--warning">Ни общего, ни своего пароля нет: задайте общий в разделе «Сайт → Пресс-кит» или свой здесь.</p>}
      </section>

      <section className="adm-section">
        <div className="press__head">
          <h2>Файлы <span className="adm-muted">{files?.length ?? ""}</span></h2>
          <label htmlFor={inputId} className={`adm-btn adm-btn--primary ${busy ? "is-busy" : ""}`}>+ Загрузить файлы</label>
          <input id={inputId} className="cms-visually-hidden" type="file" multiple accept={ACCEPT} disabled={Boolean(busy)}
            onChange={(e) => { upload(e.target.files); e.target.value = ""; }} />
        </div>
        <p className="adm-muted">Райдеры, stage plot, промо-фото, био. PDF, JPG, PNG, WebP, ZIP, DOC до {MAX_MB} МБ. Организаторы получают ссылки после ввода пароля, ссылки действуют 30 минут.</p>
        {busy && <p className="adm-note adm-note--info" role="status">{busy}</p>}
        {note && <p className={`adm-note adm-note--${note.level}`} role="status">{note.text}</p>}
        {!files ? <p className="adm-muted">Загружаем…</p> : !files.length ? <p className="adm-muted">Файлов пока нет.</p> : (
          <ul className="cms-list">
            {files.map((f) => (
              <li key={f.id} className="press-file">
                <input className="press-file__name" value={f.name} maxLength={160} aria-label="Название файла"
                  onChange={(e) => setFiles((list) => list.map((x) => (x.id === f.id ? { ...x, name: e.target.value } : x)))}
                  onBlur={(e) => e.target.value.trim() && patch(f, { name: e.target.value.trim() })} />
                <select className="cms-select" value={f.kind} aria-label="Тип файла" onChange={(e) => patch(f, { kind: e.target.value })}>
                  {PRESS_KINDS.map((k) => <option key={k.value} value={k.value}>{k.label}</option>)}
                </select>
                <span className="adm-muted press-file__meta">{f.meta}</span>
                <span className="press-file__actions">
                  <button type="button" className="adm-btn adm-btn--small" onClick={() => open(f)}>Открыть</button>
                  <button type="button" className="adm-icon-btn" onClick={() => remove(f)} aria-label={`Удалить ${f.name}`}>×</button>
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
