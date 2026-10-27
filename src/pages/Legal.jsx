import { RevealTitle } from "../components/Reveal";
import Markdown from "../components/Markdown";
import { useQuery } from "../lib/useQuery";
import { getPages } from "../lib/api";
import { safeUrl } from "../lib/format";

/** Документы: файлы компании ссылками, тексты (политика, соглашение…) — разделами страницы */
export default function Legal() {
  const { data } = useQuery(getPages, []);
  const pages = data ?? [];
  const files = pages.filter((p) => p.kind === "file" && safeUrl(p.file_url));
  const texts = pages.filter((p) => p.kind !== "file");

  return (
    <main className="page wrap legal">
      <header className="page__head">
        <RevealTitle as="h1" className="h-xxl">Документы</RevealTitle>
      </header>

      {files.length > 0 && (
        <section id="documents" aria-labelledby="h-docs">
          <h2 className="h-lg" id="h-docs">Документы компании</h2>
          <ul className="contacts">
            {files.map((d) => (
              <li key={d.slug}><span>{/\.pdf($|\?)/i.test(d.file_url) ? "PDF" : "Файл"}</span><a href={safeUrl(d.file_url)} target="_blank" rel="noopener noreferrer">{d.title}</a></li>
            ))}
          </ul>
        </section>
      )}

      {texts.map((page, n) => (
        <section key={page.slug} id={page.slug} className={`section legal__text ${n === texts.length - 1 ? "section--last" : ""}`} aria-labelledby={`h-${page.slug}`}>
          <h2 className="h-lg" id={`h-${page.slug}`}>{page.title}</h2>
          <Markdown source={page.body} />
        </section>
      ))}
    </main>
  );
}
