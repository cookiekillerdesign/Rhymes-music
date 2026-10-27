import Icon from "./Icons";

/**
 * Шапка раздела: заголовок, счётчик, действия. Главное действие на телефоне
 * превращается в круглую кнопку «+» над нижней панелью — до неё дотягивается большой палец.
 */
export default function PageHeader({ title, count, subtitle, primary, children }) {
  return (
    <header className="a-page-head">
      <div className="a-page-head__text">
        <h1>{title}{count != null && <span className="a-page-head__count">{count}</span>}</h1>
        {subtitle && <p className="a-muted">{subtitle}</p>}
      </div>
      <div className="a-page-head__actions">
        {children}
        {primary && (
          <>
            <button type="button" className="a-btn a-btn--primary a-page-head__primary" onClick={primary.onClick}>
              <Icon name="plus" size={18} /> {primary.label}
            </button>
            <button type="button" className="a-fab" onClick={primary.onClick} aria-label={primary.label}>
              <Icon name="plus" size={26} />
            </button>
          </>
        )}
      </div>
    </header>
  );
}
