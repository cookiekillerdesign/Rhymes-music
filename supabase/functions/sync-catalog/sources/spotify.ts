// Spotify Web API: поиск артиста, профиль, релизы, популярные треки (client credentials).
import { env, getJson, request } from "../http.ts";

const API = "https://api.spotify.com/v1";
const MAX_ALBUM_PAGES = 4; // 4 × 50 релизов на артиста — с запасом
/** Рынок для top-tracks: российского каталога в Spotify нет, Казахстан близок по составу */
const market = () => env("SPOTIFY_MARKET") || "KZ";

let token: { value: string; expires: number } | null = null;

async function auth(): Promise<HeadersInit> {
  if (!token || token.expires < Date.now() + 60_000) {
    const credentials = btoa(`${env("SPOTIFY_CLIENT_ID")}:${env("SPOTIFY_CLIENT_SECRET")}`);
    const res = await request("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: { authorization: `Basic ${credentials}`, "content-type": "application/x-www-form-urlencoded" },
      body: "grant_type=client_credentials",
    });
    const json = await res.json();
    token = { value: json.access_token, expires: Date.now() + json.expires_in * 1000 };
  }
  return { authorization: `Bearer ${token.value}` };
}

export const isConfigured = () => Boolean(env("SPOTIFY_CLIENT_ID") && env("SPOTIFY_CLIENT_SECRET"));

/**
 * С 9 марта 2026 приложения в Development Mode не получают топ-треки артиста,
 * followers и popularity. Топ-треки запрашиваем только при расширенной квоте.
 */
export const hasExtendedQuota = () => env("SPOTIFY_EXTENDED_QUOTA") === "true";

// deno-lint-ignore no-explicit-any -- ответы Spotify разбираются чистыми функциями из lib.ts
type Json = any;

export async function searchArtists(name: string): Promise<Json[]> {
  const url = `${API}/search?type=artist&limit=10&q=${encodeURIComponent(name)}`; // больше 10 в Development Mode не отдаётся
  return (await getJson<Json>(url, { headers: await auth() })).artists?.items ?? [];
}

export async function getArtist(id: string): Promise<Json> {
  return getJson(`${API}/artists/${encodeURIComponent(id)}`, { headers: await auth() });
}

export async function getAlbums(id: string): Promise<Json[]> {
  const albums: Json[] = [];
  let url: string | null = `${API}/artists/${encodeURIComponent(id)}/albums?include_groups=album,single&limit=50`;
  for (let page = 0; url && page < MAX_ALBUM_PAGES; page++) {
    const json: Json = await getJson(url, { headers: await auth() });
    albums.push(...json.items);
    url = json.next;
  }
  return albums;
}

export async function getTopTracks(id: string): Promise<Json[]> {
  const url = `${API}/artists/${encodeURIComponent(id)}/top-tracks?market=${market()}`;
  return (await getJson<Json>(url, { headers: await auth() })).tracks ?? [];
}
