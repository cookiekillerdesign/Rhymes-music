/* Площадки: Яндекс Музыка, VK Музыка, Spotify. Без ID трека ведём на поиск по площадке */
const q = (t) => encodeURIComponent(`${t.artists} ${t.title}`);

function PlatformIcon({ id, size = 22 }) {
  const common = { width: size, height: size, viewBox: "0 0 24 24", "aria-hidden": true, focusable: "false" };
  if (id === "spotify") {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="11" fill="currentColor" />
        <g fill="none" stroke="var(--icon-cut, #000)" strokeLinecap="round">
          <path d="M6.2 9.3c4-1.2 8.3-.9 11.7 1" strokeWidth="2" />
          <path d="M6.9 12.6c3.3-.9 6.6-.6 9.5.9" strokeWidth="1.7" />
          <path d="M7.5 15.6c2.6-.6 5.1-.4 7.3.7" strokeWidth="1.4" />
        </g>
      </svg>
    );
  }
  if (id === "vk") {
    return (
      <svg {...common}>
        <rect x="1" y="1" width="22" height="22" rx="7" fill="currentColor" />
        <path d="M5.6 8.4h1.9c.2 2.9 1.3 4.6 2.6 4.9V8.4h1.8v2.8c1.2-.1 2.3-1.4 2.7-2.8h1.8c-.3 1.6-1.4 2.9-2.3 3.4 .9.4 2.3 1.6 2.8 3.6h-2c-.4-1.3-1.5-2.4-3-2.5v2.5h-.2c-3.8 0-6-2.6-6.1-7Z" fill="var(--icon-cut, #000)" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <circle cx="12" cy="12" r="11" fill="currentColor" />
      <path d="M13.6 6.2v7.6a2.6 2.6 0 1 1-1.6-2.4V6.2l4.6 1.4v1.9l-3-.9Z" fill="var(--icon-cut, #000)" />
    </svg>
  );
}

const platformLinks = (t) => [
  { id: "yandex", name: "Яндекс Музыка", url: `https://music.yandex.ru/search?text=${q(t)}` },
  { id: "vk", name: "VK Музыка", url: `https://vk.com/audio?q=${q(t)}` },
  { id: "spotify", name: "Spotify", url: t.spotify ? `https://open.spotify.com/${t.spotify}` : `https://open.spotify.com/search/${q(t)}` }
];

export const artistPlatformLinks = (name) => {
  const n = encodeURIComponent(name);
  return [
    { id: "yandex", name: "Яндекс Музыка", url: `https://music.yandex.ru/search?text=${n}&type=artists` },
    { id: "vk", name: "VK Музыка", url: `https://vk.com/audio?q=${n}` },
    { id: "spotify", name: "Spotify", url: `https://open.spotify.com/search/${n}/artists` }
  ];
};

/* compact — только иконки (в трек-листах), иначе иконка + название */
export function PlatformList({ links, compact = false, className = "", label }) {
  return (
    <ul className={`platforms ${compact ? "platforms--compact" : ""} ${className}`}>
      {links.map((p) => (
        <li key={p.id}>
          <a className={`platform platform--${p.id}`} href={p.url} target="_blank" rel="noopener noreferrer" aria-label={label ? `${label} в ${p.name}` : p.name} title={p.name}>
            <PlatformIcon id={p.id} size={compact ? 20 : 22} />
            {!compact && <span>{p.name}</span>}
          </a>
        </li>
      ))}
    </ul>
  );
}

export default function Platforms({ track, compact = false, className = "" }) {
  return <PlatformList links={platformLinks(track)} compact={compact} className={className} label={track.title} />;
}
