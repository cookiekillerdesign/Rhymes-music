/* Данные админки. Права проверяет база: писать может только пользователь с app_metadata.role = "admin". */
import { adminClient as supabase } from "./client";

const BUCKET = "artists";

const must = ({ data, error }) => {
  if (error) throw error;
  return data;
};

export const getSession = async () => must(await supabase.auth.getSession()).session;
export const onAuthChange = (cb) => supabase.auth.onAuthStateChange((_event, session) => cb(session)).data.subscription;
export const signIn = async (email, password) => must(await supabase.auth.signInWithPassword({ email, password }));
export const signOut = () => supabase.auth.signOut();

export const isAdmin = (session) => session?.user?.app_metadata?.role === "admin";

const ARTIST_COLUMNS =
  "slug, name, tagline, bio, bio_source, photo, photo_position, palette, socials, sort, hidden, auto_sync, spotify_id, deezer_id, youtube_channel_id, bandsintown_name, tour_sources, resolved";

export const listArtists = async () => must(await supabase.from("artists").select(ARTIST_COLUMNS).order("sort").order("name"));

export const getArtist = async (slug) => must(await supabase.from("artists").select(ARTIST_COLUMNS).eq("slug", slug).maybeSingle());

export async function createArtist(row) {
  return must(await supabase.from("artists").insert(row).select(ARTIST_COLUMNS).single());
}

export async function updateArtist(slug, row) {
  // slug — первичный ключ и адрес страницы: после создания не меняется
  const { slug: _slug, ...rest } = row;
  return must(await supabase.from("artists").update(rest).eq("slug", slug).select(ARTIST_COLUMNS).single());
}

export const deleteArtist = async (slug) => must(await supabase.from("artists").delete().eq("slug", slug));

/** Путь файла в бакете по его публичной ссылке; null — фото не наше (Spotify, сайт лейбла) */
function storagePathFromUrl(url, bucket = BUCKET) {
  const marker = `/storage/v1/object/public/${bucket}/`;
  const i = url?.indexOf(marker) ?? -1;
  return i === -1 ? null : decodeURIComponent(url.slice(i + marker.length).split("?")[0]);
}

/** Удаляет наши файлы по ссылкам; чужие ссылки пропускает. Ошибки не критичны — файл останется сиротой */
export async function deletePhotos(urls, bucket = BUCKET) {
  const paths = urls.map((u) => storagePathFromUrl(u, bucket)).filter(Boolean);
  if (!paths.length) return;
  const { error } = await supabase.storage.from(bucket).remove(paths);
  if (error) console.warn("[admin] не удалось удалить фото:", error.message);
}

/** Все фото артиста (папка <slug>/) — при удалении артиста */
export async function deleteArtistFolder(slug) {
  const { data, error } = await supabase.storage.from(BUCKET).list(slug, { limit: 1000 });
  if (error || !data?.length) return;
  await supabase.storage.from(BUCKET).remove(data.map((f) => `${slug}/${f.name}`));
}

/** Загружает уже сжатое изображение в бакет Storage и возвращает публичную ссылку */
export async function uploadImage(bucket, folder, blob) {
  const ext = blob.type === "image/webp" ? "webp" : "jpg";
  const path = `${folder}/${Date.now()}.${ext}`;
  must(await supabase.storage.from(bucket).upload(path, blob, { contentType: blob.type, cacheControl: "31536000", upsert: false }));
  return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}

export const uploadArtistPhoto = (slug, blob) => uploadImage(BUCKET, slug, blob);

/** Запуск синхронизации одного артиста: функция проверяет, что вызывает админ */
export const syncArtist = async (slug) => must(await supabase.functions.invoke("sync-catalog", { body: { artist: slug } }));

/** Реально занятое место: размер базы и файлов в Storage (функция admin_usage, только для админа) */
export const getUsage = async () => must(await supabase.rpc("admin_usage"));

/* ---------- Пресс-кит ---------- */

const PRESS_BUCKET = "backstage";

/** Задать пароль: scope = 'global' (общий) или slug артиста. Пустой пароль у артиста — вернуть общий */
export const setBackstagePassword = async (scope, password) =>
  must(await supabase.rpc("set_backstage_password", { p_scope: scope, p_password: password }));

/** Где пароли заданы (без самих паролей): [{ scope, updated_at }] */
export const listBackstagePasswordScopes = async () => must(await supabase.rpc("backstage_password_scopes"));

export const listPressFiles = async (slug) =>
  must(await supabase.from("backstage_files").select("*").eq("artist_slug", slug).order("sort").order("created_at"));

export const countPressFiles = async () => must(await supabase.from("backstage_files").select("artist_slug"));

/** Загружает файл в приватный бакет и создаёт запись пресс-кита */
export async function uploadPressFile(slug, file, kind, name) {
  const safe = file.name.normalize("NFKD").replace(/[^\w.-]+/g, "_").slice(-80);
  const path = `${slug}/${Date.now()}-${safe}`;
  must(await supabase.storage.from(PRESS_BUCKET).upload(path, file, { contentType: file.type || "application/octet-stream", upsert: false }));
  try {
    return must(await supabase.from("backstage_files").insert({ artist_slug: slug, path, name, kind, meta: pressMeta(file), size_bytes: file.size }).select("*").single());
  } catch (e) {
    await supabase.storage.from(PRESS_BUCKET).remove([path]); // запись не создалась — файл не оставляем сиротой
    throw e;
  }
}

export const updatePressFile = async (id, patch) => must(await supabase.from("backstage_files").update(patch).eq("id", id).select("*").single());

export async function deletePressFile(row) {
  must(await supabase.from("backstage_files").delete().eq("id", row.id));
  await supabase.storage.from(PRESS_BUCKET).remove([row.path]);
}

/** Временная ссылка, чтобы админ мог открыть файл из приватного бакета */
export const pressFileUrl = async (path) => must(await supabase.storage.from(PRESS_BUCKET).createSignedUrl(path, 300)).signedUrl;

const EXT = { "application/pdf": "PDF", "image/jpeg": "JPG", "image/png": "PNG", "image/webp": "WebP", "application/zip": "ZIP" };
function pressMeta(file) {
  const type = EXT[file.type] ?? (file.name.split(".").pop() || "файл").toUpperCase();
  const mb = file.size / 1024 / 1024;
  return `${type}, ${mb >= 1 ? `${mb.toLocaleString("ru-RU", { maximumFractionDigits: 1 })} МБ` : `${Math.max(1, Math.round(file.size / 1024))} КБ`}`;
}

/**
 * Сохраняет порядок артистов одним вызовом (функция reorder_artists). Если база ещё
 * не обновлена и функции нет — сохраняет по одному, только изменившиеся позиции.
 */
export async function saveArtistOrder(slugs, previous) {
  const { error } = await supabase.rpc("reorder_artists", { p_slugs: slugs });
  if (!error) return;
  if (error.code !== "PGRST202") throw error;
  const before = new Map(previous.map((a, i) => [a.slug, i]));
  for (const [i, slug] of slugs.entries()) {
    if (before.get(slug) === i) continue;
    must(await supabase.from("artists").update({ sort: i }).eq("slug", slug));
  }
}

/* ---------- Метрики ---------- */

/** Посещаемость за период: { days: [{day, views}], total, previous, top: [{path, views}] } */
export const getSiteStats = async (days) => must(await supabase.rpc("site_stats", { p_days: days }));

const countRows = async (table, build = (q) => q) => {
  const { count, error } = await build(supabase.from(table).select("*", { count: "exact", head: true }));
  if (error) throw error;
  return count ?? 0;
};

/** Каталог в цифрах; sinceISO — начало периода для «новых релизов» */
export async function getCatalogStats(sinceISO) {
  const [releases, fresh, videos, merch] = await Promise.all([
    countRows("releases", (q) => q.eq("hidden", false)),
    countRows("releases", (q) => q.eq("hidden", false).gte("released_on", sinceISO)),
    countRows("videos", (q) => q.eq("hidden", false)),
    countRows("merch", (q) => q.eq("published", true))
  ]);
  return { releases, fresh, videos, merch };
}

/** Загружает файл как есть (без сжатия) в публичный бакет и возвращает ссылку */
export async function uploadFile(bucket, folder, file) {
  const safe = file.name.normalize("NFKD").replace(/[^\w.-]+/g, "_").slice(-80);
  const path = `${folder}/${Date.now()}-${safe}`;
  must(await supabase.storage.from(bucket).upload(path, file, { contentType: file.type, cacheControl: "31536000", upsert: false }));
  return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}

/* ---------- Настройки лейбла ---------- */

export async function getSetting(key) {
  const rows = must(await supabase.from("settings").select("value").eq("key", key));
  return rows[0]?.value ?? null;
}

export const saveSetting = async (key, value) =>
  must(await supabase.from("settings").upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: "key" }));
