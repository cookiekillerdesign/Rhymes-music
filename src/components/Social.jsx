/*
 * Соцсети круглыми кнопками-иконками. Пиктограммы упрощённые, собственной отрисовки:
 * для продакшена их стоит заменить на SVG из брендбуков площадок.
 */
import { safeUrl } from "../lib/format";

const ICONS = {
  youtube: <path fill="currentColor" fillRule="evenodd" d="M2.5 8.2a3.2 3.2 0 0 1 3.2-3.2h12.6a3.2 3.2 0 0 1 3.2 3.2v7.6a3.2 3.2 0 0 1-3.2 3.2H5.7a3.2 3.2 0 0 1-3.2-3.2zM10 8.7v6.6l5.6-3.3z" />,
  soundcloud: (
    <g fill="currentColor">
      <rect x="1.6" y="12.6" width="1.5" height="5.4" rx=".75" />
      <rect x="4.2" y="10.6" width="1.5" height="7.4" rx=".75" />
      <rect x="6.8" y="9.4" width="1.5" height="8.6" rx=".75" />
      <path d="M9.6 18V8.4a5.4 5.4 0 0 1 9 2.6 3.5 3.5 0 1 1 .6 7z" />
    </g>
  ),
  vk: <path fill="currentColor" transform="translate(-1.875 -2.875) scale(1.25)" d="M5.6 8.4h1.9c.2 2.9 1.3 4.6 2.6 4.9V8.4h1.8v2.8c1.2-.1 2.3-1.4 2.7-2.8h1.8c-.3 1.6-1.4 2.9-2.3 3.4.9.4 2.3 1.6 2.8 3.6h-2c-.4-1.3-1.5-2.4-3-2.5v2.5h-.2c-3.8 0-6-2.6-6.1-7Z" />,
  tiktok: <path fill="currentColor" d="M13.4 2.5h3.1a4.6 4.6 0 0 0 4.4 4.1v3.1a7.6 7.6 0 0 1-4.3-1.4v6.9a6.2 6.2 0 1 1-6.2-6.2h.4v3.2h-.4a3 3 0 1 0 3 3z" />,
  instagram: (
    <g fill="none" stroke="currentColor" strokeWidth="1.9">
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="3.9" />
      <circle cx="17.1" cy="6.9" r="1.1" fill="currentColor" stroke="none" />
    </g>
  ),
  // Обобщённые пиктограммы: звуковые дуги в круге и сердце
  spotify: (
    <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <circle cx="12" cy="12" r="9.2" />
      <path d="M7.5 9.6c3-1 6.4-.7 9.2.8M8.1 12.6c2.4-.7 5-.5 7.3.7M8.7 15.4c1.8-.4 3.7-.3 5.3.5" />
    </g>
  ),
  likee: <path fill="currentColor" d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />,
  telegram: <path fill="currentColor" d="M21.4 3.7 2.9 10.9c-.8.3-.8 1.5.1 1.8l4.5 1.5 1.7 5.3c.2.7 1.1.9 1.6.4l2.5-2.4 4.6 3.4c.6.4 1.4.1 1.6-.6l3.2-15.4c.2-.9-.6-1.6-1.3-1.2ZM17.2 8l-7.6 6.9-.4 3.1-1.2-4z" />
};
const FALLBACK = <path d="M7 17 17 7M9 7h8v8" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />;

const iconKey = (name) => name.toLowerCase().replace(/\s+/g, "");

function SocialIcon({ name, size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      {ICONS[iconKey(name)] ?? FALLBACK}
    </svg>
  );
}

/** onMedia — кнопкам нужна подложка, когда они лежат поверх фото */
export function SocialLinks({ items, onMedia = false, className = "" }) {
  const safe = (items ?? []).map((s) => ({ ...s, url: safeUrl(s.url) })).filter((s) => s.url);
  if (!safe.length) return null;
  return (
    <ul className={`socials ${onMedia ? "socials--on-media" : ""} ${className}`}>
      {safe.map((s) => (
        <li key={s.name}>
          <a className="soc" href={s.url} target="_blank" rel="noopener noreferrer" aria-label={s.name} title={s.name}>
            <SocialIcon name={s.name} />
          </a>
        </li>
      ))}
    </ul>
  );
}
