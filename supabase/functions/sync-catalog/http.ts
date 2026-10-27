// Сетевые помощники: таймаут, свой User-Agent, понятные ошибки.
const FETCH_TIMEOUT_MS = 10_000;
const USER_AGENT = "RhymesMusicSiteBot/1.0 (+https://rhymesmusic.ru)";

export async function request(url: string, init: RequestInit = {}): Promise<Response> {
  const res = await fetch(url, {
    ...init,
    headers: { "user-agent": USER_AGENT, ...(init.headers ?? {}) },
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}: ${url.replace(/key=[^&]+/, "key=***")}`);
  return res;
}

export const getJson = async <T>(url: string, init?: RequestInit): Promise<T> => (await request(url, init)).json();

export const env = (key: string) => Deno.env.get(key) ?? "";

export const errorText = (e: unknown) => (e instanceof Error ? e.message : String(e));
