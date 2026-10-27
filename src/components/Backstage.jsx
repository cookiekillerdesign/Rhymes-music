import { useEffect, useId, useState } from "react";
import { unlockBackstage, isLive } from "../lib/api";
import { Icon } from "./Icons";

/*
 * Пресс-кит для организаторов. Один общий пароль на всех, выдаёт букер.
 * Ссылки на файлы временные: когда они истекают, форма снова просит пароль.
 * На странице артиста компонент рендерится с key={slug}, поэтому при переходе
 * к другому артисту файлы предыдущего не остаются на экране.
 */
export default function Backstage({ artist }) {
  const id = useId();
  const [kit, setKit] = useState(null); // { files, expiresAt }
  const [state, setState] = useState({ busy: false, error: "" });

  useEffect(() => {
    if (!kit?.expiresAt) return undefined;
    const ms = Date.parse(kit.expiresAt) - Date.now() - 30_000; // с запасом, чтобы не кликнуть по уже мёртвой ссылке
    const t = setTimeout(() => {
      setKit(null);
      setState({ busy: false, error: "Ссылки устарели — введите пароль ещё раз." });
    }, Math.max(0, ms));
    return () => clearTimeout(t);
  }, [kit]);

  const submit = async (e) => {
    e.preventDefault();
    const pw = String(new FormData(e.currentTarget).get("password") ?? "");
    setState({ busy: true, error: "" });
    try { setKit(await unlockBackstage(artist.slug, pw)); setState({ busy: false, error: "" }); }
    catch (err) { setState({ busy: false, error: err.message }); }
  };

  const files = kit?.files;
  if (files) {
    const docs = files.filter((f) => f.kind !== "photo");
    const photos = files.filter((f) => f.kind === "photo");
    return (
      <div className="kit">
        <ul className="kit__docs">
          {docs.map((f) => (
            <li key={f.name}>
              <div><b>{f.name}</b><span>{f.meta}</span></div>
              <a className="btn btn--ghost" href={f.url || undefined} download aria-disabled={!f.url}>
                <Icon name="download" size={18} /> Скачать
              </a>
            </li>
          ))}
        </ul>
        <ul className="kit__photos">
          {photos.map((f, i) => (
            <li key={f.name} style={{ "--c1": artist.palette[i % 3], "--c2": artist.palette[(i + 1) % 3] }}>
              {f.url ? <img src={f.url} alt={`${artist.name}, ${f.name}`} loading="lazy" /> : <span />}
              <small>{f.name}</small>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <form className="gate" onSubmit={submit}>
      <Icon name="lock" size={28} />
      <p>Био, промо-фото, технический и бытовой райдер, stage plot. Пароль для организаторов выдаёт букер лейбла.</p>
      <div className="gate__row">
        <label className="sr-only" htmlFor={`${id}-pw`}>Пароль</label>
        <input id={`${id}-pw`} name="password" type="password" autoComplete="current-password" placeholder="Пароль организатора" />
        <button className="btn btn--accent" disabled={state.busy}>{state.busy ? "Проверяем…" : "Открыть пресс-кит"}</button>
      </div>
      <p className="form-status is-error" role="alert">{state.error}</p>
      {!isLive && <p className="muted small">Демо-режим: пароль demo</p>}
    </form>
  );
}
