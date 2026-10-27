import { LABEL } from "../data/content";
import { RevealTitle } from "../components/Reveal";
import { useQuery } from "../lib/useQuery";
import { getLabelSocials } from "../lib/api";
import { SocialLinks } from "../components/Social";

export default function Contacts() {
  const { data: socials } = useQuery(getLabelSocials, [], { throwOnError: false });
  return (
    <main className="page wrap">
      <header className="page__head">
        <RevealTitle as="h1" className="h-xxl">Контакты</RevealTitle>
      </header>
      <ul className="contacts">
        {LABEL.contacts.map((c) => (
          <li key={c.email}>
            <span>{c.label}</span>
            <a href={`mailto:${c.email}`}>{c.email}</a>
          </li>
        ))}
      </ul>
      <SocialLinks items={socials ?? LABEL.socials} className="contacts-social" />
    </main>
  );
}
