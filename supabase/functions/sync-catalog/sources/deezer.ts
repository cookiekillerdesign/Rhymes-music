// Публичный API Deezer: без ключа, лимит 50 запросов за 5 секунд.
// Даёт то, чего Spotify больше не отдаёт в Development Mode: обложки 1000 px,
// точные даты выхода и популярность треков (rank). Для российского каталога
// покрытие у Deezer часто лучше, чем у Spotify.
import { getJson } from "../http.ts";

const API = "https://api.deezer.com";

// deno-lint-ignore no-explicit-any -- ответы разбираются чистыми функциями из lib.ts
type Json = any;

/** Deezer возвращает ошибки со статусом 200 в теле { error } */
async function call(path: string): Promise<Json> {
  const json: Json = await getJson(`${API}${path}`);
  if (json?.error) throw new Error(`Deezer: ${json.error.message ?? json.error.type}`);
  return json;
}

export async function searchArtists(name: string): Promise<Json[]> {
  return (await call(`/search/artist?limit=10&q=${encodeURIComponent(name)}`)).data ?? [];
}

export async function getAlbums(id: string): Promise<Json[]> {
  return (await call(`/artist/${encodeURIComponent(id)}/albums?limit=100`)).data ?? [];
}

export async function getTopTracks(id: string): Promise<Json[]> {
  return (await call(`/artist/${encodeURIComponent(id)}/top?limit=10`)).data ?? [];
}

/** Профиль артиста: фото 1000×1000 (picture_xl) */
export function getArtist(id: string): Promise<Json> {
  return call(`/artist/${encodeURIComponent(id)}`);
}
