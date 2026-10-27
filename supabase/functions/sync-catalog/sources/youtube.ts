// YouTube Data API v3. Квота: поиск канала — 100 единиц (один раз на артиста),
// страница загрузок — 1 единица. Дневной лимит по умолчанию 10 000.
import { env, getJson } from "../http.ts";

const API = "https://www.googleapis.com/youtube/v3";
const MAX_UPLOAD_PAGES = 4; // последние 200 видео канала

export const isConfigured = () => Boolean(env("YOUTUBE_API_KEY"));
const key = () => `key=${encodeURIComponent(env("YOUTUBE_API_KEY"))}`;

// deno-lint-ignore no-explicit-any -- ответы разбираются чистыми функциями из lib.ts
type Json = any;

export async function searchChannels(name: string): Promise<Json[]> {
  const url = `${API}/search?part=snippet&type=channel&maxResults=5&q=${encodeURIComponent(name)}&${key()}`;
  return (await getJson<Json>(url)).items ?? [];
}

/** Лента загрузок канала: у каждого канала это плейлист UU + id канала без «UC» */
export async function getUploads(channelId: string): Promise<Json[]> {
  const playlistId = `UU${channelId.slice(2)}`;
  const items: Json[] = [];
  let pageToken = "";
  for (let page = 0; page < MAX_UPLOAD_PAGES; page++) {
    const url = `${API}/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}${
      pageToken ? `&pageToken=${pageToken}` : ""
    }&${key()}`;
    const json: Json = await getJson(url);
    items.push(...(json.items ?? []));
    if (!json.nextPageToken) break;
    pageToken = json.nextPageToken;
  }
  return items;
}
