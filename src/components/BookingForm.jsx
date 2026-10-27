import { useId, useState } from "react";
import { submitBooking, isLive } from "../lib/api";
import { BOOKING_LIMITS, submitErrorMessage } from "../lib/forms";
import Honeypot from "./Honeypot";

const FORMATS = ["Концерт", "Фестиваль", "Клубное шоу", "Частное мероприятие", "Корпоратив", "Интеграция с брендом"];

/* Заявка на выступление. Поля — то, без чего букер не сможет ответить с ценой */
export default function BookingForm({ artists = [], onSent, compact = false }) {
  const id = useId();
  const [status, setStatus] = useState({ state: "idle", msg: "" });

  const submit = async (e) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const data = Object.fromEntries(f.entries());
    if (!data.contact_name?.trim() || !data.contact?.trim() || !data.city?.trim()) {
      setStatus({ state: "error", msg: "Заполните город, имя и контакт, чтобы букер смог ответить." });
      return;
    }
    setStatus({ state: "sending", msg: "" });
    try {
      const res = await submitBooking({ ...data, artists: artists.map((a) => a.name).join(", ") });
      setStatus({
        state: "sent",
        msg: res.via === "db" ? "Заявка отправлена. Букер ответит в течение двух рабочих дней." : "Открыли письмо с заявкой в вашей почте: осталось нажать «Отправить»."
      });
      if (res.via === "db") { e.target.reset(); onSent?.(); }
    } catch (error) {
      setStatus({ state: "error", msg: submitErrorMessage(error, "Не получилось отправить заявку. Напишите на sales@rhymesmusic.com.") });
    }
  };

  const field = (name, label, props = {}) => (
    <div className="field">
      <label htmlFor={`${id}-${name}`}>{label}</label>
      <input id={`${id}-${name}`} name={name} maxLength={BOOKING_LIMITS[name]} {...props} />
    </div>
  );

  return (
    <form className={`booking ${compact ? "booking--compact" : ""}`} onSubmit={submit} noValidate>
      <div className="booking__grid">
        <div className="field">
          <label htmlFor={`${id}-format`}>Формат</label>
          <select id={`${id}-format`} name="format" defaultValue={FORMATS[0]}>
            {FORMATS.map((x) => <option key={x}>{x}</option>)}
          </select>
        </div>
        {field("city", "Город", { autoComplete: "address-level2", required: true })}
        {field("date", "Дата", { type: "date" })}
        {field("capacity", "Вместимость площадки", { inputMode: "numeric", placeholder: "Например, 1500" })}
        {field("contact_name", "Имя и компания", { autoComplete: "organization", required: true })}
        {field("contact", "Почта или телефон", { autoComplete: "email", required: true })}
      </div>
      <div className="field">
        <label htmlFor={`${id}-comment`}>Комментарий</label>
        <textarea id={`${id}-comment`} name="comment" maxLength={BOOKING_LIMITS.comment} rows={compact ? 2 : 3} placeholder="Площадка, бюджет, тайминг" />
      </div>
      <div className="booking__foot">
        <Honeypot />
        <button className="btn btn--accent" type="submit" disabled={status.state === "sending"}>
          {status.state === "sending" ? "Отправляем…" : artists.length > 1 ? `Отправить заявку на ${artists.length} артистов` : "Отправить заявку"}
        </button>
        {!isLive && <span className="muted small">Демо-режим: заявка откроется письмом на sales@rhymesmusic.com</span>}
      </div>
      <p className={`form-status is-${status.state}`} role="status">{status.msg}</p>
    </form>
  );
}
