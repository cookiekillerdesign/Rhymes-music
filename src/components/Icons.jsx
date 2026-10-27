const PATHS = {
  play: <path d="M7 4.5v15l12.5-7.5z" fill="currentColor" />,
  pause: <path d="M6.5 4.5h4v15h-4zM13.5 4.5h4v15h-4z" fill="currentColor" />,
  prev: <path d="M6 5h2v14H6zM9.5 12 19 5v14z" fill="currentColor" />,
  next: <path d="M16 5h2v14h-2zM14.5 12 5 19V5z" fill="currentColor" />,
  close: <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" />,
  arrow: <path d="M7 17 17 7M9 7h8v8" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />,
  down: <path d="M12 5v14M6 13l6 6 6-6" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />,
  lock: <g stroke="currentColor" strokeWidth="1.8" fill="none"><rect x="5" y="10.5" width="14" height="10" rx="2" /><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" /></g>,
  search: <g stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round"><circle cx="11" cy="11" r="6.5" /><path d="m20 20-4.2-4.2" /></g>,
  download: <path d="M12 4v11M7 10.5l5 5 5-5M5 20h14" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
};

export function Icon({ name, size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      {PATHS[name]}
    </svg>
  );
}
