import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { RevealTitle } from "../components/Reveal";
import JobList from "../components/JobList";
import { useQuery } from "../lib/useQuery";
import { getJobs } from "../lib/api";
import NotFound from "./NotFound";

const HR_EMAIL = "hr@rhymesmusic.com";

export default function Job() {
  const { slug } = useParams();
  const { data: jobs, loading } = useQuery(getJobs, []);
  const job = jobs?.find((j) => j.slug === slug);

  useEffect(() => {
    if (job) document.title = `${job.title} — Rhymes Music`;
  }, [job]);

  if (loading) return <div className="page-loading" />;
  if (!job) return <NotFound />;

  const sections = [
    ["Чем предстоит заниматься", job.tasks],
    ["Что для нас важно", job.requirements],
    ["Будет плюсом", job.niceToHave],
    ["Что предлагаем", job.offer]
  ].filter(([, items]) => items.length);

  const details = [["Отдел", job.dept], ["Город", job.place], ["Занятость", job.employment], ["Зарплата", job.salary]];
  const applyHref = `mailto:${HR_EMAIL}?subject=${encodeURIComponent(`Отклик: ${job.title}`)}`;
  const others = jobs.filter((j) => j.slug !== job.slug);

  return (
    <main className="page wrap job">
      <Link to="/jobs" className="job__back"><span aria-hidden="true">←</span> Все вакансии</Link>

      <header className="job__head">
        <ul className="job__meta">
          <li>{job.dept}</li>
          <li>{job.place}</li>
          <li>{job.employment}</li>
        </ul>
        <RevealTitle as="h1" className="h-xl">{job.title}</RevealTitle>
        <p className="section__lead">{job.summary}</p>
      </header>

      <div className="job__grid">
        <div className="job__body">
          {sections.map(([title, items]) => (
            <section key={title}>
              <h2>{title}</h2>
              <ul>{items.map((item) => <li key={item}>{item}</li>)}</ul>
            </section>
          ))}
        </div>
        <aside className="job__aside" aria-label="Коротко о вакансии">
          <dl>
            {details.map(([term, value]) => (
              <div key={term}><dt>{term}</dt><dd>{value}</dd></div>
            ))}
          </dl>
          <a className="btn btn--accent btn--lg job__apply" href={applyHref}>Откликнуться</a>
          <p className="muted small">Пришлите резюме или портфолио на {HR_EMAIL}, ответим в течение недели.</p>
        </aside>
      </div>

      {others.length > 0 && (
        <section className="section section--last" aria-labelledby="h-other-jobs">
          <h2 className="h-lg" id="h-other-jobs">Другие вакансии</h2>
          <JobList jobs={others} />
        </section>
      )}
    </main>
  );
}
