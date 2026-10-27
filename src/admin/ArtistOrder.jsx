import { useCallback, useEffect, useRef, useState } from "react";
import { moveItem } from "./fields";
import { saveArtistOrder } from "./api";
import Icon from "./Icons";

const EDGE_PX = 90;     // у края экрана список прокручивается сам
const SCROLL_STEP = 12; // px за кадр

/**
 * Режим «Порядок»: артистов можно перетаскивать за ручку (мышью и пальцем)
 * или двигать стрелками клавиатуры, сфокусировав ручку. Порядок = порядок на сайте.
 */
export default function ArtistOrder({ artists, onCancel, onSaved }) {
  const [list, setList] = useState(artists);
  const [dragging, setDragging] = useState(null); // slug
  const [state, setState] = useState({ saving: false, error: "" });
  const [announce, setAnnounce] = useState("");
  const rows = useRef(new Map());
  const pointerY = useRef(0);
  const scrollRaf = useRef(0);
  const changed = list.some((a, i) => a.slug !== artists[i]?.slug);

  // Актуальный список для обработчиков жестов, без пересоздания подписок на каждое перемещение
  const listRef = useRef(list);
  listRef.current = list;

  const moveTo = useCallback((slug, to) => {
    const l = listRef.current;
    const from = l.findIndex((a) => a.slug === slug);
    const next = moveItem(l, from, to);
    if (next === l) return;
    setList(next);
    setAnnounce(`${l[from].name}: место ${Math.min(to, l.length - 1) + 1} из ${l.length}`);
  }, []);

  // Куда встаёт перетаскиваемый: первая строка, чья середина ниже пальца
  const targetIndex = useCallback((y) => {
    const ordered = listRef.current.map((a) => rows.current.get(a.slug)).filter(Boolean);
    const idx = ordered.findIndex((el) => {
      const r = el.getBoundingClientRect();
      return y < r.top + r.height / 2;
    });
    return idx === -1 ? ordered.length - 1 : idx;
  }, []);

  useEffect(() => {
    if (!dragging) return undefined;
    const onMove = (e) => {
      pointerY.current = e.clientY;
      moveTo(dragging, targetIndex(e.clientY));
    };
    const onUp = () => setDragging(null);
    // Автопрокрутка у краёв: длинный список на телефоне не помещается в экран
    const tick = () => {
      const y = pointerY.current;
      if (y < EDGE_PX) window.scrollBy(0, -SCROLL_STEP);
      else if (y > window.innerHeight - EDGE_PX - 70) window.scrollBy(0, SCROLL_STEP);
      scrollRaf.current = requestAnimationFrame(tick);
    };
    scrollRaf.current = requestAnimationFrame(tick);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      cancelAnimationFrame(scrollRaf.current);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [dragging, moveTo, targetIndex]);

  const onKey = (e, slug, index) => {
    if (e.key === "ArrowUp" && index > 0) { e.preventDefault(); moveTo(slug, index - 1); }
    if (e.key === "ArrowDown" && index < list.length - 1) { e.preventDefault(); moveTo(slug, index + 1); }
  };

  // Ручка остаётся в фокусе после перестановки — можно жать стрелки дальше
  useEffect(() => {
    const el = document.activeElement;
    if (el?.dataset?.handle) el.scrollIntoView({ block: "nearest" });
  }, [list]);

  const save = async () => {
    setState({ saving: true, error: "" });
    try {
      await saveArtistOrder(list.map((a) => a.slug), artists);
      onSaved();
    } catch (e) {
      setState({ saving: false, error: e.message });
    }
  };

  return (
    <div className="a-order">
      <div className="a-order__bar">
        <p className="a-muted">
          <span>Перетащите артиста за ручку <Icon name="grip" size={16} /></span>
          <span className="a-order__keys">или выберите её и двигайте стрелками ↑ ↓</span>
          <span>— в таком порядке артисты будут на сайте.</span>
        </p>
        <div className="a-order__actions">
          <button type="button" className="a-btn" onClick={onCancel} disabled={state.saving}>Отмена</button>
          <button type="button" className="a-btn a-btn--primary" onClick={save} disabled={!changed || state.saving}>{state.saving ? "Сохраняем…" : "Сохранить порядок"}</button>
        </div>
      </div>
      {state.error && <p className="adm-note adm-note--error" role="alert">{state.error}</p>}
      <p className="cms-visually-hidden" aria-live="polite">{announce}</p>
      <ol className="a-roster a-roster--order">
        {list.map((a, i) => (
          <li key={a.slug} ref={(el) => (el ? rows.current.set(a.slug, el) : rows.current.delete(a.slug))}
            className={`a-roster__row a-order__row ${dragging === a.slug ? "is-dragging" : ""}`}>
            <span className="a-order__pos">{i + 1}</span>
            <span className="a-roster__photo" style={{ "--c1": a.palette?.[0], "--c2": a.palette?.[1] }}>
              {a.photo ? <img src={a.photo} alt="" loading="lazy" draggable="false" style={{ objectPosition: a.photo_position ?? "50% 25%" }} /> : <Icon name="image" size={18} />}
            </span>
            <span className="a-roster__text"><b>{a.name}</b><span>/artist/{a.slug}</span></span>
            <button type="button" className="a-order__handle" data-handle="true" aria-label={`Переместить ${a.name}, место ${i + 1} из ${list.length}`}
              onPointerDown={(e) => { e.preventDefault(); pointerY.current = e.clientY; setDragging(a.slug); }}
              onKeyDown={(e) => onKey(e, a.slug, i)}>
              <Icon name="grip" size={22} />
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
