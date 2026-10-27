/*
 * Флаги языков — SVG, а не эмодзи: эмодзи-флаги на Windows показываются буквами «RU», «GB».
 * Упрощённые, но узнаваемые; 3:2, скруглённые углы.
 */
const FLAGS = {
  ru: (
    <>
      <rect width="30" height="20" fill="#fff" />
      <rect y="6.67" width="30" height="6.67" fill="#0039a6" />
      <rect y="13.33" width="30" height="6.67" fill="#d52b1e" />
    </>
  ),
  en: (
    <>
      <rect width="30" height="20" fill="#012169" />
      <path d="M0 0l30 20M30 0L0 20" stroke="#fff" strokeWidth="4" />
      <path d="M0 0l30 20M30 0L0 20" stroke="#c8102e" strokeWidth="1.6" />
      <path d="M15 0v20M0 10h30" stroke="#fff" strokeWidth="6" />
      <path d="M15 0v20M0 10h30" stroke="#c8102e" strokeWidth="3.4" />
    </>
  ),
  pt: (
    <>
      <rect width="30" height="20" fill="#009c3b" />
      <path d="M15 2.5 27 10 15 17.5 3 10z" fill="#ffdf00" />
      <circle cx="15" cy="10" r="4.4" fill="#002776" />
    </>
  ),
  es: (
    <>
      <rect width="30" height="20" fill="#aa151b" />
      <rect y="5" width="30" height="10" fill="#f1bf00" />
    </>
  )
};

export default function Flag({ code, className = "" }) {
  if (!FLAGS[code]) return null;
  return (
    <svg className={`flag ${className}`} viewBox="0 0 30 20" width="21" height="14" aria-hidden="true">
      <clipPath id={`flag-${code}`}><rect width="30" height="20" rx="3" /></clipPath>
      <g clipPath={`url(#flag-${code})`}>{FLAGS[code]}</g>
    </svg>
  );
}
