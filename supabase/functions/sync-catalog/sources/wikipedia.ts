// Русская Википедия: поиск статьи об артисте и краткое описание (лицензия CC BY-SA,
// поэтому на сайте рядом с био стоит ссылка на источник).
import { getJson } from "../http.ts";

const API = "https://ru.wikipedia.org";

// deno-lint-ignore no-explicit-any -- ответы разбираются чистыми функциями из lib.ts
type Json = any;

export async function searchTitles(name: string): Promise<string[]> {
  const url = `${API}/w/api.php?action=query&list=search&srlimit=5&format=json&origin=*&srsearch=${
    encodeURIComponent(`${name} музыка`)
  }`;
  return ((await getJson<Json>(url)).query?.search ?? []).map((r: Json) => r.title);
}

export function getSummary(title: string): Promise<Json> {
  return getJson(`${API}/api/rest_v1/page/summary/${encodeURIComponent(title.replace(/ /g, "_"))}`);
}
