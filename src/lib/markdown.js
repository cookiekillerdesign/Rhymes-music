/*
 * Мини-Markdown для текстов из админки (политики, соглашения): заголовки ##/###, абзацы,
 * списки «- », **жирный**, ссылки [текст](https://…). Возвращает дерево блоков, а не HTML:
 * страница рендерит его React-элементами, поэтому HTML из базы никогда не вставляется как есть.
 */

/** Строка → массив фрагментов: { text } | { bold } | { link, href } */
export function parseInline(text) {
  const out = [];
  const re = /\*\*(.+?)\*\*|\[([^\]]+)\]\((https?:\/\/[^\s)]+|mailto:[^\s)]+)\)/g;
  let last = 0;
  for (const m of text.matchAll(re)) {
    if (m.index > last) out.push({ text: text.slice(last, m.index) });
    if (m[1] !== undefined) out.push({ bold: m[1] });
    else out.push({ link: m[2], href: m[3] });
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push({ text: text.slice(last) });
  return out;
}

/** Текст → блоки: { type: "h2"|"h3"|"p", inline } | { type: "ul", items: inline[] } */
export function parseMarkdown(source = "") {
  const blocks = [];
  let paragraph = [];
  let list = null;
  const flushParagraph = () => {
    if (paragraph.length) blocks.push({ type: "p", inline: parseInline(paragraph.join(" ")) });
    paragraph = [];
  };
  const flushList = () => {
    if (list) blocks.push({ type: "ul", items: list });
    list = null;
  };
  for (const raw of source.replace(/\r\n?/g, "\n").split("\n")) {
    const line = raw.trim();
    if (!line) { flushParagraph(); flushList(); continue; }
    const heading = line.match(/^(#{2,3})\s+(.+)$/);
    if (heading) {
      flushParagraph(); flushList();
      blocks.push({ type: heading[1].length === 2 ? "h2" : "h3", inline: parseInline(heading[2]) });
      continue;
    }
    const item = line.match(/^[-*]\s+(.+)$/);
    if (item) { flushParagraph(); (list ??= []).push(parseInline(item[1])); continue; }
    flushList();
    paragraph.push(line);
  }
  flushParagraph(); flushList();
  return blocks;
}
