import { RevealTitle } from "../components/Reveal";
import JobList from "../components/JobList";
import { useQuery } from "../lib/useQuery";
import { getJobs, isLive } from "../lib/api";

const VALUES = [
  { title: "Музыка в приоритете", text: "Каждый в команде слушает и понимает музыку, с которой работает." },
  { title: "Скорость", text: "Релизы выходят по расписанию, решения принимаются быстро." },
  { title: "Свобода и ответственность", text: "Даём задачу целиком и доверяем, как её решить." }
];

export default function Jobs() {
  const { data: jobs } = useQuery(getJobs, []);

  return (
    <main className="page wrap">
      <header className="page__head">
        <RevealTitle as="h1" className="h-xxl">Вакансии</RevealTitle>
        <p className="section__lead">Ищем людей, которые хотят строить музыкальную индустрию вместе с артистами нового поколения.</p>
      </header>

      {jobs?.length > 0 && (
        <>
          <JobList jobs={jobs} />
          {!isLive && <p className="muted small jobs__note">Вакансии здесь для примера: реальные лейбл публикует в админке.</p>}
        </>
      )}
      {jobs?.length === 0 && (
        <div className="empty empty--big">
          <p>Сейчас открытых вакансий нет. Пришлите резюме, и мы напишем, когда появится подходящая роль.</p>
          <a className="btn btn--accent" href="mailto:hr@rhymesmusic.com?subject=Резюме">Отправить резюме</a>
        </div>
      )}

      <section className="section section--last" aria-labelledby="h-values">
        <h2 className="h-lg" id="h-values">Как мы работаем</h2>
        <ul className="steps">
          {VALUES.map((v) => <li key={v.title}><b>{v.title}</b><p>{v.text}</p></li>)}
        </ul>
      </section>
    </main>
  );
}
