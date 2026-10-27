import { Link } from "react-router-dom";
import { LogoMark } from "./Logo";
import { SocialLinks } from "./Social";
import { LABEL } from "../data/content";
import { useQuery } from "../lib/useQuery";
import { documentHref, getLabelSocials, getPages } from "../lib/api";
import { safeUrl } from "../lib/format";

const NAV_LABEL = [
  { to: "/artists", label: "Артисты" },
  { to: "/releases", label: "Релизы" },
  { to: "/concerts", label: "Концерты" },
  { to: "/merch", label: "Мерч" }
];
const NAV_WORK = [
  { to: "/booking", label: "Организаторам" },
  { to: "/for-artists", label: "Артистам" },
  { to: "/team", label: "Команда" },
  { to: "/jobs", label: "Вакансии" },
  { to: "/contacts", label: "Контакты" }
];
/** В футере — три главные почты; все остальные на странице «Контакты» */
const FOOTER_EMAILS = ["office@rhymesmusic.com", "sales@rhymesmusic.com", "demo@rhymesmusic.com"];

export default function Footer() {
  // Ссылки на документы — из админки («Документы», галочка «Ссылка в футере сайта»).
  // Ошибку загрузки не пробрасываем: футер есть на каждой странице
  const { data: pages } = useQuery(getPages, [], { throwOnError: false });
  const docs = (pages ?? []).filter((p) => p.show_in_footer && (p.kind !== "file" || safeUrl(p.file_url)));
  const emails = LABEL.contacts.filter((c) => FOOTER_EMAILS.includes(c.email));
  const { data: socials } = useQuery(getLabelSocials, [], { throwOnError: false });

  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer__head">
          <Link to="/" className="footer__brand" aria-label="Rhymes Music, на главную"><LogoMark /><span>Rhymes Music</span></Link>
          <div className="footer__cta">
            <Link to="/booking" className="btn btn--accent">Пригласить артиста</Link>
            <Link to="/for-artists" className="btn btn--ghost">Отправить демо</Link>
          </div>
        </div>

        <div className="footer__grid">
          <nav className="footer__col" aria-labelledby="f-label">
            <h3 id="f-label">Лейбл</h3>
            {NAV_LABEL.map((n) => <Link key={n.to} to={n.to}>{n.label}</Link>)}
          </nav>
          <nav className="footer__col" aria-labelledby="f-work">
            <h3 id="f-work">Работа с нами</h3>
            {NAV_WORK.map((n) => <Link key={n.to} to={n.to}>{n.label}</Link>)}
          </nav>
          <div className="footer__col">
            <h3>Связаться</h3>
            {emails.map((c) => (
              <a key={c.email} href={`mailto:${c.email}`} className="footer__mail"><span>{c.email}</span><small>{c.label}</small></a>
            ))}
          </div>
          {docs.length > 0 && (
            <nav className="footer__col" aria-labelledby="f-docs">
              <h3 id="f-docs">Документы</h3>
              {docs.map((d) =>
                d.kind === "file"
                  ? <a key={d.slug} href={safeUrl(d.file_url)} target="_blank" rel="noopener noreferrer">{d.title}<span className="footer__ext" aria-hidden="true">PDF</span><span className="sr-only"> (PDF, откроется в новой вкладке)</span></a>
                  : <Link key={d.slug} to={documentHref(d)}>{d.title}</Link>
              )}
            </nav>
          )}
        </div>

        {socials?.length > 0 && (
          <nav className="footer__socials" aria-label="Rhymes Music в соцсетях">
            <SocialLinks items={socials} className="socials--xl" />
          </nav>
        )}

        <div className="footer__bottom">
          <span>© 2011–{new Date().getFullYear()} Rhymes Music. Музыка и фото принадлежат лейблу и артистам</span>
          <span className="footer__gift">
            <b>Неофициальный сайт</b> — концепт в подарок лейблу от <a href="https://cookiekiller.online" target="_blank" rel="noopener noreferrer">cookiekiller.online</a>.
            {" "}Официальный сайт: <a href="https://rhymesmusic.ru" target="_blank" rel="noopener noreferrer">rhymesmusic.ru</a>
          </span>
        </div>
      </div>
    </footer>
  );
}
