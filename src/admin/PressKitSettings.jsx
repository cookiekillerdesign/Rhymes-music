import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAdminData } from "./AdminData";
import { countPressFiles, listBackstagePasswordScopes } from "./api";
import { PasswordForm } from "./PressKit";
import PageHeader from "./PageHeader";

/** Сайт → Пресс-кит: общий пароль и сводка по артистам (свой пароль, сколько файлов) */
export default function PressKitSettings() {
  const { artists } = useAdminData();
  const [scopes, setScopes] = useState([]);
  const [files, setFiles] = useState([]);
  const load = useCallback(() => {
    Promise.all([listBackstagePasswordScopes(), countPressFiles()]).then(([s, f]) => { setScopes(s); setFiles(f); }, () => {});
  }, []);
  useEffect(() => { load(); }, [load]);

  const fileCount = useMemo(() => {
    const m = new Map();
    for (const f of files) m.set(f.artist_slug, (m.get(f.artist_slug) ?? 0) + 1);
    return m;
  }, [files]);
  const own = new Set(scopes.map((s) => s.scope));

  return (
    <section className="a-stack">
      <PageHeader title="Пресс-кит" subtitle="Пароль для организаторов и файлы артистов" />
      <section className="adm-section">
        <h2>Общий пароль</h2>
        <PasswordForm scope="global" current={scopes.find((s) => s.scope === "global")} onChanged={load} />
      </section>
      <section className="a-stack__block">
      <h2 className="a-block-title">По артистам</h2>
      <ul className="adm-list">
        {artists.map((a) => (
          <li key={a.slug}>
            <Link to={`/admin/artists/${a.slug}/press`} className="adm-row press-summary__row">
              <span className="adm-row__main"><b>{a.name}</b><span className="adm-muted">{fileCount.get(a.slug) ?? 0} файлов</span></span>
              <span className="adm-row__tags">{own.has(a.slug) ? <span className="adm-tag adm-tag--ok">Свой пароль</span> : <span className="adm-tag adm-tag--muted">Общий пароль</span>}
                {!fileCount.get(a.slug) && <span className="adm-tag adm-tag--warn">Нет файлов</span>}</span>
            </Link>
          </li>
        ))}
      </ul>
      </section>
    </section>
  );
}
