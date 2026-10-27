import { HONEYPOT } from "../lib/forms";

/** Ловушка для ботов: поле спрятано от людей и скринридеров, автозаполнение отключено */
export default function Honeypot() {
  return (
    <div className="hp" aria-hidden="true">
      <label>Сайт<input name={HONEYPOT} tabIndex={-1} autoComplete="off" /></label>
    </div>
  );
}
