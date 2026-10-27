// Edge Function: проверяет пароль организаторов и выдаёт временные ссылки на файлы пресс-кита.
// Пароли задаются в админке: общий для всех артистов и, при желании, свой у артиста
// (таблица backstage_access, проверка — check_backstage_password, bcrypt).
// Запасной вариант, пока пароли в админке не заданы: секрет BACKSTAGE_PASSWORD_HASH (sha-256 hex).
// Деплой: supabase functions deploy backstage
import { createClient, type SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};
const json = (body: unknown, status = 200) => Response.json(body, { status, headers: cors });

const LINK_TTL_S = 30 * 60;
/** Не больше 5 неудачных попыток за 15 минут с одного IP: задержка ответа не мешает параллельному перебору */
const MAX_FAILURES = 5;
const WINDOW_MS = 15 * 60_000;

const sha256 = async (s: string) =>
  Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s))))
    .map((b) => b.toString(16).padStart(2, "0")).join("");

// Сравнение за постоянное время, чтобы не подсказывать пароль по таймингу
const safeEqual = (a: string, b: string) => {
  if (!a || a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
};

const clientIp = (req: Request) => req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";

async function recentFailures(db: SupabaseClient, ipHash: string): Promise<number> {
  const since = new Date(Date.now() - WINDOW_MS).toISOString();
  const { count, error } = await db.from("backstage_attempts").select("id", { count: "exact", head: true })
    .eq("ip_hash", ipHash).gte("created_at", since);
  if (error) throw error;
  return count ?? 0;
}

/** Пароль из админки (свой у артиста или общий); если там пусто — секрет функции */
async function passwordMatches(db: SupabaseClient, slug: string, password: string): Promise<boolean> {
  const { data, error } = await db.rpc("check_backstage_password", { p_slug: slug, p_password: password });
  if (error) throw error;
  if (data !== null) return data === true;
  const expected = Deno.env.get("BACKSTAGE_PASSWORD_HASH") ?? "";
  return safeEqual(await sha256(password), expected);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "method not allowed" }, 405);

  const body: unknown = await req.json().catch(() => null);
  const { slug, password } = (body && typeof body === "object" ? body : {}) as { slug?: unknown; password?: unknown };
  if (typeof slug !== "string" || !/^[a-z0-9-]{1,60}$/.test(slug) || typeof password !== "string" || password.length > 200) {
    return json({ error: "bad request" }, 400);
  }

  try {
    const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const ipHash = await sha256(`${clientIp(req)}:backstage`);

    if ((await recentFailures(db, ipHash)) >= MAX_FAILURES) {
      return json({ error: "too many attempts" }, 429);
    }

    if (!(await passwordMatches(db, slug, password))) {
      await db.from("backstage_attempts").insert({ ip_hash: ipHash });
      await db.from("backstage_attempts").delete().lt("created_at", new Date(Date.now() - 24 * 3600_000).toISOString());
      return json({ error: "wrong password" }, 401);
    }

    // Пресс-кит черновика (скрытого артиста) не выдаём даже с верным паролем
    const { data: artist, error: artistError } = await db.from("artists").select("hidden").eq("slug", slug).maybeSingle();
    if (artistError) throw artistError;
    if (!artist || artist.hidden) return json({ error: "not found" }, 404);

    const { data: rows, error } = await db.from("backstage_files").select("name, kind, meta, path")
      .eq("artist_slug", slug).order("sort").order("created_at");
    if (error) throw error;
    const expiresAt = new Date(Date.now() + LINK_TTL_S * 1000).toISOString();
    const files = await Promise.all(rows.map(async (f) => {
      const { data } = await db.storage.from("backstage").createSignedUrl(f.path, LINK_TTL_S, { download: f.kind !== "photo" });
      return { name: f.name, kind: f.kind, meta: f.meta, url: data?.signedUrl ?? null };
    }));
    return json({ files, expiresAt });
  } catch (e) {
    // Подробности — в логи функции, клиенту — общий текст
    console.error("backstage:", e);
    return json({ error: "internal error" }, 500);
  }
});
