import { parseMarkdown } from "../lib/markdown";

const Inline = ({ parts }) =>
  parts.map((p, i) =>
    p.bold !== undefined ? <b key={i}>{p.bold}</b>
      : p.link !== undefined ? <a key={i} href={p.href} {...(p.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>{p.link}</a>
        : <span key={i}>{p.text}</span>
  );

/** Текст из админки → React-элементы. HTML из базы не вставляется никогда */
export default function Markdown({ source, className = "" }) {
  return (
    <div className={className}>
      {parseMarkdown(source).map((b, i) => {
        if (b.type === "ul") return <ul key={i}>{b.items.map((item, k) => <li key={k}><Inline parts={item} /></li>)}</ul>;
        const Tag = b.type;
        return <Tag key={i}><Inline parts={b.inline} /></Tag>;
      })}
    </div>
  );
}
