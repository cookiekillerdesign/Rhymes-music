// @ts-nocheck

// supabase/functions/backstage/index.ts
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";
var cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type"
};
var json = (body, status = 200) => Response.json(body, { status, headers: cors });
var LINK_TTL_S = 30 * 60;
var MAX_FAILURES = 5;
var WINDOW_MS = 15 * 6e4;
var sha256 = async (s) => Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s)))).map((b) => b.toString(16).padStart(2, "0")).join("");
var safeEqual = (a, b) => {
  if (!a || a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
};
var clientIp = (req) => req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
async function recentFailures(db, ipHash) {
  const since = new Date(Date.now() - WINDOW_MS).toISOString();
  const { count, error } = await db.from("backstage_attempts").select("id", { count: "exact", head: true }).eq("ip_hash", ipHash).gte("created_at", since);
  if (error) throw error;
  return count ?? 0;
}
async function passwordMatches(db, slug, password) {
  const { data, error } = await db.rpc("check_backstage_password", { p_slug: slug, p_password: password });
  if (error) throw error;
  if (data !== null) return data === true;
  const expected = Deno.env.get("BACKSTAGE_PASSWORD_HASH") ?? "";
  return safeEqual(await sha256(password), expected);
}
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "method not allowed" }, 405);
  const body = await req.json().catch(() => null);
  const { slug, password } = body && typeof body === "object" ? body : {};
  if (typeof slug !== "string" || !/^[a-z0-9-]{1,60}$/.test(slug) || typeof password !== "string" || password.length > 200) {
    return json({ error: "bad request" }, 400);
  }
  try {
    const db = createClient(Deno.env.get("SUPABASE_URL"), Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"));
    const ipHash = await sha256(`${clientIp(req)}:backstage`);
    if (await recentFailures(db, ipHash) >= MAX_FAILURES) {
      return json({ error: "too many attempts" }, 429);
    }
    if (!await passwordMatches(db, slug, password)) {
      await db.from("backstage_attempts").insert({ ip_hash: ipHash });
      await db.from("backstage_attempts").delete().lt("created_at", new Date(Date.now() - 24 * 36e5).toISOString());
      return json({ error: "wrong password" }, 401);
    }
    const { data: artist, error: artistError } = await db.from("artists").select("hidden").eq("slug", slug).maybeSingle();
    if (artistError) throw artistError;
    if (!artist || artist.hidden) return json({ error: "not found" }, 404);
    const { data: rows, error } = await db.from("backstage_files").select("name, kind, meta, path").eq("artist_slug", slug).order("sort").order("created_at");
    if (error) throw error;
    const expiresAt = new Date(Date.now() + LINK_TTL_S * 1e3).toISOString();
    const files = await Promise.all(rows.map(async (f) => {
      const { data } = await db.storage.from("backstage").createSignedUrl(f.path, LINK_TTL_S, { download: f.kind !== "photo" });
      return { name: f.name, kind: f.kind, meta: f.meta, url: data?.signedUrl ?? null };
    }));
    return json({ files, expiresAt });
  } catch (e) {
    console.error("backstage:", e);
    return json({ error: "internal error" }, 500);
  }
});
