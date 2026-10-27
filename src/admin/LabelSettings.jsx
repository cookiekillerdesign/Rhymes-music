import { useEffect, useState } from "react";
import { getSetting, saveSetting } from "./api";
import { LABEL } from "../data/content";
import SocialsField from "./SocialsField";
import PageHeader from "./PageHeader";
import { useUnsavedChanges } from "./useUnsavedChanges";

const isHttps = (u) => { try { return ["https:", "http:"].includes(new URL(u).protocol); } catch { return false; } };

/** Сайт → Лейбл: соцсети лейбла (футер, меню, «Контакты») */
export default function LabelSettings() {
  const [saved, setSaved] = useState(null);
  const [socials, setSocials] = useState([]);
  const [state, setState] = useState({ busy: false, note: null });
  const dirty = saved !== null && JSON.stringify(saved) !== JSON.stringify(socials);
  useUnsavedChanges(dirty);

  useEffect(() => {
    getSetting("label_socials").then(
      (v) => { const list = v ?? LABEL.socials; setSaved(list); setSocials(list); },
      (e) => setState({ busy: false, note: { level: "error", text: e.message } })
    );
  }, []);

  const save = async () => {
    const clean = socials.map((s) => ({ name: s.name.trim(), url: s.url.trim() })).filter((s) => s.name || s.url);
    const bad = clean.find((s) => !s.name || !isHttps(s.url));
    if (bad) return setState({ busy: false, note: { level: "error", text: `Проверьте «${bad.name || "без названия"}»: нужны название и ссылка https://` } });
    setState({ busy: true, note: null });
    try {
      await saveSetting("label_socials", clean);
      setSaved(clean);
      setSocials(clean);
      setState({ busy: false, note: { level: "ok", text: "Сохранено — соцсети обновятся в футере, меню и на странице «Контакты»" } });
    } catch (e) {
      setState({ busy: false, note: { level: "error", text: e.message } });
    }
  };

  return (
    <section className="a-stack">
      <PageHeader title="Лейбл" subtitle="Общие данные лейбла на сайте" />
      <section className="adm-section">
        <h2>Соцсети лейбла</h2>
        <p className="a-muted">Показываются крупными кнопками в футере, в мобильном меню и на странице «Контакты». Иконка подбирается по названию площадки.</p>
        {saved === null ? <p className="a-muted">Загружаем…</p> : <SocialsField value={socials} onChange={setSocials} />}
        {state.note && <p className={`adm-note adm-note--${state.note.level}`} role="status">{state.note.text}</p>}
        <div className="adm-actions__row">
          <button type="button" className="a-btn a-btn--primary" onClick={save} disabled={!dirty || state.busy}>{state.busy ? "Сохраняем…" : "Сохранить"}</button>
          {dirty && <span className="a-muted">Есть несохранённые изменения</span>}
        </div>
      </section>
    </section>
  );
}
