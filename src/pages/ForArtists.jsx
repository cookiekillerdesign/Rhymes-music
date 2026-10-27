import { useId, useState } from "react";
import { RevealTitle, CountUp } from "../components/Reveal";
import { submitDemo, isLive } from "../lib/api";
import { DEMO_LIMITS, submitErrorMessage } from "../lib/forms";
import Honeypot from "../components/Honeypot";
import { LABEL } from "../data/content";

const PATH = [
  { title: "Демо", text: "Присылаете трек. A&R слушает каждую заявку и отвечает, если видит потенциал." },
  { title: "Подписание", text: "Обсуждаем условия, планы на релизы и то, каким артист хочет быть через год." },
  { title: "Упаковка", text: "Видеопродакшн: обложка, фотосессия, клип и тизеры под релиз." },
  { title: "Релиз и маркетинг", text: "Промо на Яндекс Музыке, VK, Spotify, Apple Music и YouTube, медиа, радио, блогеры, таргет и посевы." },
  { title: "Сцена", text: "Туры, фестивали и клубные шоу: в базе лейбла больше 800 организаторов по Европе и СНГ." },
  { title: "Рост", text: "Интеграции с брендами и собственный мерч от дизайна до отгрузки." }
];

function DemoForm() {
  const id = useId();
  const [status, setStatus] = useState({ state: "idle", msg: "" });
  const submit = async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    if (!data.artist_name.trim() || !/^https?:\/\//.test(data.track_url.trim()) || !data.contact.trim()) {
      setStatus({ state: "error", msg: "Укажите имя артиста, ссылку на трек (начинается с https://) и контакт." });
      return;
    }
    setStatus({ state: "sending", msg: "" });
    try {
      const res = await submitDemo(data);
      setStatus({ state: "sent", msg: res.via === "db" ? "Демо отправлено. Если трек зацепит, A&R напишет вам сам." : "Открыли письмо с демо в вашей почте: осталось нажать «Отправить»." });
      if (res.via === "db") e.target.reset();
    } catch (error) {
      setStatus({ state: "error", msg: submitErrorMessage(error, "Не получилось отправить. Пришлите ссылку на demo@rhymesmusic.com.") });
    }
  };
  const f = (name, label, props = {}) => (
    <div className="field"><label htmlFor={`${id}-${name}`}>{label}</label><input id={`${id}-${name}`} name={name} maxLength={DEMO_LIMITS[name]} {...props} /></div>
  );
  return (
    <form className="booking" onSubmit={submit} noValidate>
      <div className="booking__grid">
        {f("artist_name", "Имя или псевдоним", { required: true })}
        {f("city", "Город")}
        {f("track_url", "Ссылка на трек", { type: "url", required: true, placeholder: "Яндекс Диск, SoundCloud, Google Drive" })}
        {f("socials", "Соцсети", { placeholder: "Ссылки через запятую" })}
      </div>
      <div className="field"><label htmlFor={`${id}-about`}>Пара слов о себе</label><textarea id={`${id}-about`} name="about" maxLength={DEMO_LIMITS.about} rows="3" /></div>
      {f("contact", "Почта или Telegram", { required: true })}
      <div className="booking__foot">
        <Honeypot />
        <button className="btn btn--accent" disabled={status.state === "sending"}>{status.state === "sending" ? "Отправляем…" : "Отправить демо"}</button>
        {!isLive && <span className="muted small">Демо-режим: заявка откроется письмом на demo@rhymesmusic.com</span>}
      </div>
      <p className={`form-status is-${status.state}`} role="status">{status.msg}</p>
    </form>
  );
}

export default function ForArtists() {
  return (
    <main className="page wrap">
      <header className="page__head">
        <RevealTitle as="h1" className="h-xxl">Артистам</RevealTitle>
        <p className="section__lead">Мы лейбл фрешменов: находим сильных молодых артистов и даём им всё, чтобы вырасти до больших сцен.</p>
      </header>

      <section aria-labelledby="h-path">
        <h2 className="h-lg" id="h-path">Путь релиза</h2>
        <ol className="path">
          {PATH.map((p, i) => (
            <li key={p.title}>
              <span className="path__n">{String(i + 1).padStart(2, "0")}</span>
              <b>{p.title}</b>
              <p>{p.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="section" aria-label="Лейбл в цифрах">
        <ul className="facts">
          {LABEL.stats.map((s) => <li key={s.label}><b><CountUp value={s.value} suffix={s.suffix} /></b><span>{s.label}</span></li>)}
        </ul>
      </section>

      <section className="section split" aria-labelledby="h-demo">
        <div>
          <h2 className="h-lg" id="h-demo">Отправить демо</h2>
          <p className="muted">Лучше всего работает один самый сильный трек, а не альбом. Ссылка должна открываться без регистрации.</p>
        </div>
        <DemoForm />
      </section>
    </main>
  );
}
