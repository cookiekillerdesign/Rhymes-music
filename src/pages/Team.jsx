import { RevealTitle } from "../components/Reveal";
import { useQuery } from "../lib/useQuery";
import { getTeamPeople, isLive } from "../lib/api";
import { TEAM } from "../data/content";

/* Подложки под монограммы, пока у сотрудников нет фото */
const PALETTES = [["#ff7eb6", "#b69cff"], ["#f5e52a", "#3ee6a0"], ["#4fc3ff", "#ff7a45"], ["#b69cff", "#f5e52a"]];
const initials = (name) => name.split(/\s+/).map((w) => w[0]).join("").slice(0, 2);

export default function Team() {
  const { data: people } = useQuery(getTeamPeople, []);

  return (
    <main className="page wrap">
      <header className="page__head">
        <RevealTitle as="h1" className="h-xxl">Команда</RevealTitle>
        <p className="section__lead">За каждым релизом стоят отделы, которые ведут артиста от демо до большой сцены.</p>
      </header>

      {people?.length > 0 && (
        <section className="people-sec" aria-labelledby="h-people">
          <h2 className="h-lg" id="h-people">Люди</h2>
          <ul className="people">
            {people.map((p, i) => {
              const [c1, c2] = PALETTES[i % PALETTES.length];
              return (
                <li key={p.id} className="person" style={{ "--c1": c1, "--c2": c2 }}>
                  <div className="person__photo">
                    {p.photo_url ? <img src={p.photo_url} alt="" loading="lazy" /> : <span aria-hidden="true">{initials(p.name)}</span>}
                  </div>
                  <b className="person__name">{p.name}</b>
                  <span className="person__role">{p.role}</span>
                  <span className="person__dept">{p.dept}</span>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <h2 className="h-lg">Отделы</h2>
      <ul className="depts">
        {TEAM.map((t) => (
          <li key={t.dept}>
            <h3>{t.dept}</h3>
            <p>{t.text}</p>
            <a href={`mailto:${t.email}`}>{t.email}</a>
          </li>
        ))}
      </ul>
      {!isLive && <p className="muted small team__note">Имена здесь условные: это пример, как будет выглядеть блок. Реальную команду лейбл добавляет в админке.</p>}
    </main>
  );
}
