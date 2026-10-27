import { useQuery } from "../lib/useQuery";
import { getArtists } from "../lib/api";
import ArtistIndex from "../components/ArtistIndex";
import BookingForm from "../components/BookingForm";
import { useLineup } from "../components/Lineup";
import { RevealTitle } from "../components/Reveal";
import { LABEL } from "../data/content";

const STEPS = [
  { title: "Соберите лайнап", text: "Нажмите «+» у артистов, которых хотите видеть на событии. Лайнап сохраняется, пока вы ходите по сайту." },
  { title: "Опишите событие", text: "Город, дата, формат и вместимость площадки: этого достаточно, чтобы букер назвал условия." },
  { title: "Получите ответ", text: "Букер свяжется с вами в течение двух рабочих дней и пришлёт пароль к пресс-китам." }
];

export default function Booking() {
  const { data } = useQuery(getArtists, []);
  const lineup = useLineup();
  const tour = LABEL.services.find((s) => s.title === "Концертные туры");

  return (
    <main className="page wrap">
      <header className="page__head">
        <RevealTitle as="h1" className="h-xxl">{["Организаторам", "и брендам"]}</RevealTitle>
        <p className="section__lead">Концерты, фестивали, клубные шоу, частные события и интеграции. {tour?.facts.join(". ")}.</p>
      </header>

      <ol className="steps">
        {STEPS.map((s, i) => (
          <li key={s.title}><span>{i + 1}</span><b>{s.title}</b><p>{s.text}</p></li>
        ))}
      </ol>

      <section className="section" aria-labelledby="h-pick">
        <h2 className="h-lg" id="h-pick">Выберите артистов</h2>
        {data && <ArtistIndex artists={data} showToggle={false} withLineup />}
      </section>

      <section className="section booking-page" aria-labelledby="h-req">
        <h2 className="h-lg" id="h-req">Заявка</h2>
        <p className="muted">{lineup.items.length ? `В лайнапе: ${lineup.items.map((a) => a.name).join(", ")}` : "Лайнап пока пуст. Можно отправить общую заявку, букер подберёт артистов под ваше событие."}</p>
        <BookingForm artists={lineup.items} onSent={lineup.clear} />
      </section>
    </main>
  );
}
