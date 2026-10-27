// Чистые функции синхронизации: без сети и базы, покрыты тестами (lib.test.ts).

export type ReleaseRow = {
  artist_slug: string;
  external_id: string;
  source: "spotify";
  title: string;
  artists: string;
  type: string;
  cover: string | null;
  spotify: string;
  released_on: string | null;
};

export type ConcertCandidate = {
  artist_slug: string;
  external_id: string;
  source: string;
  date: string;
  city: string;
  venue: string | null;
  ticket_url: string | null;
};

type SpotifyAlbum = {
  id: string;
  name: string;
  album_type: "album" | "single" | "compilation";
  total_tracks?: number;
  release_date?: string;
  release_date_precision?: "year" | "month" | "day";
  images?: { url: string; width?: number }[];
  artists?: { name: string }[];
};

/**
 * Ключ для сравнения строк: только буквы и цифры любых алфавитов (украинские, с диакритикой и т. д.),
 * без регистра, ё = е. Строка из одних знаков или эмодзи даёт пустой ключ.
 */
export const textKey = (text: string) =>
  text.normalize("NFKD").replace(/\p{M}/gu, "").toLowerCase().replace(/ё/g, "е").replace(/[^\p{L}\p{N}]+/gu, "");

/** Совпадение ключей; пустой ключ не совпадает ни с чем, иначе «🔥» и «!!!» считались бы одним релизом */
export const sameKey = (a: string, b: string) => a !== "" && a === b;

/** Ключ названия релиза: скобки значимы, чтобы «(Remix)» не склеился с оригиналом */
export const titleKey = (title: string) => {
  const [main, ...brackets] = title.split("(");
  return [textKey(main), ...brackets.map((b) => textKey(b))].filter(Boolean).join("(");
};

export function normalizeReleaseDate(date?: string, precision?: string): string | null {
  if (!date) return null;
  if (precision === "year" || /^\d{4}$/.test(date)) return `${date.slice(0, 4)}-01-01`;
  if (precision === "month" || /^\d{4}-\d{2}$/.test(date)) return `${date.slice(0, 7)}-01`;
  return /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : null;
}

const RELEASE_TYPE: Record<string, string> = { album: "Альбом", single: "Сингл", compilation: "Сборник" };

export function releaseType(album: SpotifyAlbum): string {
  // Spotify называет EP «синглом»; 4–6 треков — это EP
  if (album.album_type === "single" && (album.total_tracks ?? 1) >= 4) return "EP";
  return RELEASE_TYPE[album.album_type] ?? "Сингл";
}

/**
 * Spotify отдаёт один релиз несколькими альбомами (разные регионы, explicit/clean).
 * Оставляем первый из группы с одинаковыми названием, типом и датой.
 */
export function dedupeReleases<T extends { title: string; type: string; released_on: string | null }>(rows: T[]): T[] {
  const seen = new Set<string>();
  return rows.filter((r) => {
    const key = `${titleKey(r.title)}|${r.type}|${r.released_on ?? ""}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function mapSpotifyAlbum(album: SpotifyAlbum, artistSlug: string): ReleaseRow {
  return {
    artist_slug: artistSlug,
    external_id: `spotify:${album.id}`,
    source: "spotify",
    title: album.name,
    artists: (album.artists ?? []).map((a) => a.name).join(", "),
    type: releaseType(album),
    cover: largestImage(album.images),
    spotify: `album/${album.id}`,
    released_on: normalizeReleaseDate(album.release_date, album.release_date_precision),
  };
}

/* ---------- Ссылки ---------- */

/**
 * Абсолютная http(s)-ссылка или null. Относительные ссылки с чужих страниц разрешаются
 * относительно страницы-источника; javascript:, data: и прочие схемы отбрасываются.
 */
export function safeHttpUrl(value: unknown, base?: string): string | null {
  if (typeof value !== "string" || !value.trim()) return null;
  try {
    const url = new URL(value.trim(), base);
    return url.protocol === "https:" || url.protocol === "http:" ? url.href : null;
  } catch {
    return null;
  }
}

/* ---------- Афиши: schema.org Event в JSON-LD ---------- */

const EVENT_TYPES = new Set(["Event", "MusicEvent", "ComedyEvent", "Festival", "TheaterEvent"]);

/** Все объекты JSON-LD со страницы, включая вложенные @graph, itemListElement, subEvent */
export function extractJsonLd(html: string): unknown[] {
  const out: unknown[] = [];
  const re = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  for (const m of html.matchAll(re)) {
    try {
      out.push(JSON.parse(m[1].trim()));
    } catch {
      // битый JSON-LD на чужой странице — просто пропускаем блок
    }
  }
  return out;
}

function* walk(node: unknown): Generator<Record<string, unknown>> {
  if (Array.isArray(node)) {
    for (const n of node) yield* walk(n);
    return;
  }
  if (!node || typeof node !== "object") return;
  const obj = node as Record<string, unknown>;
  yield obj;
  for (const key of ["@graph", "itemListElement", "item", "subEvent", "event", "events"]) {
    if (key in obj) yield* walk(obj[key]);
  }
}

const isEvent = (o: Record<string, unknown>) => [o["@type"]].flat().some((t) => typeof t === "string" && EVENT_TYPES.has(t));

const str = (v: unknown): string | null => (typeof v === "string" && v.trim() ? v.trim() : null);

function firstOfferUrl(offers: unknown): string | null {
  for (const o of [offers].flat()) {
    if (o && typeof o === "object") {
      const url = str((o as Record<string, unknown>).url);
      if (url) return url;
    }
  }
  return null;
}

function cityOf(location: Record<string, unknown>): string | null {
  const address = location.address;
  if (typeof address === "string") return address.split(",")[0].trim() || null;
  if (address && typeof address === "object") {
    const a = address as Record<string, unknown>;
    return str(a.addressLocality) ?? str(a.addressRegion);
  }
  return null;
}

/** Нормализованный ключ города: «Санкт-Петербург», «г. Санкт-Петербург» → один ключ */
export const cityKey = (city: string) => textKey(city.trim().replace(/^(г|город)\.?\s+/i, ""));

/** Один концерт артиста в одном городе в один день — одна запись, откуда бы она ни пришла */
export const concertKey = (artistSlug: string, date: string, city: string) => `${artistSlug}:${date}:${cityKey(city)}`;

/**
 * События из JSON-LD страницы-источника. Если на странице несколько артистов,
 * берём только те, где упомянуто имя нашего (в названии или performer).
 */
export function eventsFromJsonLd(
  blocks: unknown[],
  artist: { slug: string; name: string },
  sourceUrl: string,
  today: string,
): ConcertCandidate[] {
  const seen = new Set<string>();
  const result: ConcertCandidate[] = [];

  for (const node of walk(blocks)) {
    if (!isEvent(node)) continue;
    const date = str(node.startDate)?.slice(0, 10);
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date) || date < today) continue;

    const performers = [node.performer].flat().map((
      p,
    ) => (p && typeof p === "object" ? str((p as Record<string, unknown>).name) : str(p)));
    const mentions = [str(node.name), ...performers].some((t) => t != null && mentionsArtist(t, artist.name));
    if (!mentions) continue;

    const location = (Array.isArray(node.location) ? node.location[0] : node.location) as Record<string, unknown> | undefined;
    const city = location ? cityOf(location) : null;
    if (!city) continue;

    const external_id = concertKey(artist.slug, date, city);
    if (seen.has(external_id)) continue;
    seen.add(external_id);

    result.push({
      artist_slug: artist.slug,
      external_id,
      source: new URL(sourceUrl).hostname,
      date,
      city,
      venue: location ? str(location.name) : null,
      ticket_url: safeHttpUrl(firstOfferUrl(node.offers), sourceUrl) ?? safeHttpUrl(node.url, sourceUrl) ??
        safeHttpUrl(sourceUrl),
    });
  }
  return result;
}

/* ---------- Bandsintown ---------- */

type BitEvent = {
  datetime?: string;
  url?: string;
  venue?: { name?: string; city?: string };
  offers?: { url?: string }[];
};

export function eventsFromBandsintown(events: BitEvent[], artistSlug: string, today: string): ConcertCandidate[] {
  return events.flatMap((e) => {
    const date = e.datetime?.slice(0, 10);
    const city = e.venue?.city?.trim();
    if (!date || date < today || !city) return [];
    return [{
      artist_slug: artistSlug,
      external_id: concertKey(artistSlug, date, city),
      source: "bandsintown",
      date,
      city,
      venue: e.venue?.name?.trim() || null,
      ticket_url: safeHttpUrl(e.offers?.find((o) => o.url)?.url) ?? safeHttpUrl(e.url),
    }];
  });
}

/* ---------- Автоопределение источников и профиль артиста ---------- */

/** Имя для сравнения: «Дети Rave» = «дети rave», «кис-кис» = «кискис» */
export const nameKey = textKey;

type SpotifyArtistHit = { id: string; name: string; images?: { url: string; width?: number }[]; genres?: string[] };

export type ArtistMatch =
  | { status: "found"; id: string }
  | { status: "ambiguous"; candidates: { id: string; name: string }[] }
  | { status: "not_found" };

/**
 * Артист из поиска Spotify. Берём только единственное точное совпадение имени:
 * с марта 2026 в Development Mode у артистов нет followers и popularity, и выбрать
 * «самого крупного» из тёзок нельзя. Несколько тёзок — на ручную проверку в админке.
 */
export function pickSpotifyArtist(hits: SpotifyArtistHit[], name: string): ArtistMatch {
  const key = nameKey(name);
  const exact = hits.filter((h) => sameKey(nameKey(h.name), key));
  const unique = [...new Map(exact.map((h) => [h.id, h])).values()];
  if (unique.length === 1) return { status: "found", id: unique[0].id };
  if (unique.length > 1) return { status: "ambiguous", candidates: unique.map((h) => ({ id: h.id, name: h.name })) };
  return { status: "not_found" };
}

export const largestImage = (images?: { url: string; width?: number }[]) =>
  [...(images ?? [])].sort((a, b) => (b.width ?? 0) - (a.width ?? 0))[0]?.url ?? null;

const GENRE_WORDS: [RegExp, string][] = [
  [/hyperpop/, "гиперпоп"],
  [/phonk/, "фонк"],
  [/trap/, "трэп"],
  [/hip hop|rap/, "рэп"],
  [/r&b|rnb/, "R&B"],
  [/punk/, "панк"],
  [/rock/, "рок"],
  [/indie/, "инди"],
  [/edm|electro|rave|techno|house|dance/, "электроника"],
  [/pop/, "поп"],
];

/** Жанры Spotify → короткая подпись по-русски: ["russian hip hop", "russian pop"] → «Рэп · поп» */
export function taglineFromGenres(genres: string[] = []): string | null {
  const words: string[] = [];
  for (const genre of genres) {
    const hit = GENRE_WORDS.find(([re]) => re.test(genre.toLowerCase()));
    if (hit && !words.includes(hit[1])) words.push(hit[1]);
    if (words.length === 2) break;
  }
  if (!words.length) return null;
  const text = words.join(" · ");
  return text[0].toUpperCase() + text.slice(1);
}

export type TrackRow = {
  artist_slug: string;
  external_id: string;
  source: "spotify";
  title: string;
  artists: string;
  cover: string | null;
  spotify: string;
  popularity: number;
};

type SpotifyTrack = {
  id: string;
  name: string;
  popularity?: number;
  artists?: { name: string }[];
  album?: { images?: { url: string; width?: number }[] };
};

export const mapSpotifyTrack = (t: SpotifyTrack, artistSlug: string): TrackRow => ({
  artist_slug: artistSlug,
  external_id: `spotify:track:${t.id}`,
  source: "spotify",
  title: t.name,
  artists: (t.artists ?? []).map((a) => a.name).join(", "),
  cover: largestImage(t.album?.images),
  spotify: `track/${t.id}`,
  popularity: t.popularity ?? 0,
});

/* ---------- YouTube ---------- */

const CLIP_RE = /клип|official\s*(music\s*)?video|music\s*video|mood\s*video|\bmv\b/i;
const NOT_CLIP_RE = /тизер|teaser|trailer|трейлер|backstage|бэкстейдж|behind the scenes|#shorts|lyric|караоке|live|лайв/i;

/** Похоже ли видео на клип: по названию, без превью, тизеров, лайвов и шортсов */
export const isClipTitle = (title: string) => CLIP_RE.test(title) && !NOT_CLIP_RE.test(title);

/** Упоминается ли артист в названии видео (для клипов на канале лейбла) */
export function mentionsArtist(title: string, artistName: string): boolean {
  const normalize = (s: string) => s.toLowerCase().replace(/ё/g, "е");
  const name = normalize(artistName.trim()).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  if (!name) return false;
  return new RegExp(`(^|[^\\p{L}\\p{N}])${name}([^\\p{L}\\p{N}]|$)`, "iu").test(normalize(title));
}

/** «Дора - Втюрилась (Official Video)» → «Втюрилась» */
export function cleanVideoTitle(title: string, artistName: string): string {
  const name = artistName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const cleaned = title
    .replace(new RegExp(`^\\s*${name}(\\s*(,|&|feat\\.?|ft\\.?|x)\\s*[^-–—]+)?\\s*[-–—]\\s*`, "i"), "")
    .replace(/\s*[([](official\s*(music\s*)?video|music\s*video|mood\s*video|премьера клипа|клип|mv)[)\]]\s*/gi, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
  return cleaned || title.trim();
}

export type VideoRow = {
  artist_slug: string;
  external_id: string;
  source: "youtube";
  youtube_id: string;
  title: string;
  published_at: string | null;
};

type YoutubePlaylistItem = { snippet?: { title?: string; publishedAt?: string; resourceId?: { videoId?: string } } };

/** Клипы артиста из ленты загрузок; requireMention — для общего канала лейбла */
export function clipsFromUploads(
  items: YoutubePlaylistItem[],
  artist: { slug: string; name: string },
  requireMention: boolean,
): VideoRow[] {
  return items.flatMap((item) => {
    const title = item.snippet?.title ?? "";
    const id = item.snippet?.resourceId?.videoId;
    if (!id || !isClipTitle(title)) return [];
    if (requireMention && !mentionsArtist(title, artist.name)) return [];
    return [{
      artist_slug: artist.slug,
      external_id: `youtube:${id}`,
      source: "youtube",
      youtube_id: id,
      title: cleanVideoTitle(title, artist.name),
      published_at: item.snippet?.publishedAt ?? null,
    }];
  });
}

type YoutubeChannelHit = { id?: { channelId?: string }; snippet?: { channelTitle?: string; title?: string } };

/** Канал артиста из поиска: название совпадает с именем (допускаем приписки «Official», «Music», «TV») */
export function pickYoutubeChannel(hits: YoutubeChannelHit[], name: string): string | null {
  const key = nameKey(name);
  for (const h of hits) {
    const title = nameKey((h.snippet?.channelTitle ?? h.snippet?.title ?? "").replace(/official|music|tv|vevo|channel/gi, ""));
    if (sameKey(title, key) && h.id?.channelId) return h.id.channelId;
  }
  return null;
}

/* ---------- Википедия ---------- */

const MUSICIAN_RE = /певиц|певец|рэпер|репер|исполнител|музыкант|групп|коллектив|диджей|битмейкер|автор песен|поп-|рок-|хип-хоп/i;

type WikiSummary = {
  type?: string;
  title?: string;
  description?: string;
  extract?: string;
  content_urls?: { desktop?: { page?: string } };
};

/** Страница подходит, если это не неоднозначность, имя совпадает и описание — про музыканта */
export function isMusicianPage(summary: WikiSummary, name: string): boolean {
  if (summary.type === "disambiguation" || !summary.extract) return false;
  const title = nameKey((summary.title ?? "").replace(/\s*\(.*\)\s*$/, ""));
  return sameKey(title, nameKey(name)) && MUSICIAN_RE.test(`${summary.description ?? ""} ${summary.extract.slice(0, 300)}`);
}

/** Био: первые предложения статьи, не длиннее ~600 знаков, без сносок и ударений */
export function bioFromExtract(extract: string, maxLength = 600): string {
  const text = extract.replace(/\[\d+\]/g, "").replace(/\u0301/g, "").replace(/\s+/g, " ").trim();
  const sentences = text.match(/[^.!?]+[.!?]+(\s|$)/g) ?? [text];
  let bio = "";
  for (const s of sentences) {
    if ((bio + s).length > maxLength && bio) break;
    bio += s;
  }
  return bio.trim();
}

/** Добавляет ссылки на площадки в соцсети артиста, не трогая уже заполненные */
export function mergeSocials(socials: { name: string; url: string }[] = [], additions: { name: string; url: string }[]) {
  const names = new Set(socials.map((s) => s.name.toLowerCase()));
  return [...socials, ...additions.filter((a) => !names.has(a.name.toLowerCase()))];
}

/* ---------- Deezer ---------- */

type DeezerArtistHit = { id: number; name: string; nb_fan?: number };

/**
 * Артист в Deezer: точное совпадение имени. У Deezer есть число фанатов, поэтому из тёзок
 * берём явного лидера (в 10+ раз больше фанатов, чем у следующего), иначе — на выбор админу.
 */
export function pickDeezerArtist(hits: DeezerArtistHit[], name: string): ArtistMatch {
  const key = nameKey(name);
  const exact = [...new Map(hits.filter((h) => sameKey(nameKey(h.name), key)).map((h) => [h.id, h])).values()]
    .sort((a, b) => (b.nb_fan ?? 0) - (a.nb_fan ?? 0));
  if (exact.length === 1) return { status: "found", id: String(exact[0].id) };
  if (exact.length > 1) {
    const [first, second] = exact;
    if ((first.nb_fan ?? 0) >= 10 * Math.max(1, second.nb_fan ?? 0)) return { status: "found", id: String(first.id) };
    return { status: "ambiguous", candidates: exact.map((h) => ({ id: String(h.id), name: h.name })) };
  }
  return { status: "not_found" };
}

const DEEZER_TYPE: Record<string, string> = { album: "Альбом", ep: "EP", single: "Сингл", compile: "Сборник" };

type DeezerAlbum = {
  id: number;
  title: string;
  record_type?: string;
  release_date?: string;
  cover_xl?: string;
  cover_big?: string;
  artist?: { name: string };
};

export type DeezerReleaseRow = Omit<ReleaseRow, "source" | "spotify"> & { source: "deezer"; spotify: null };

export function mapDeezerAlbum(album: DeezerAlbum, artistSlug: string, artistName: string): DeezerReleaseRow {
  return {
    artist_slug: artistSlug,
    external_id: `deezer:${album.id}`,
    source: "deezer",
    title: album.title,
    artists: album.artist?.name && sameKey(nameKey(album.artist.name), nameKey(artistName))
      ? artistName
      : album.artist?.name ?? artistName,
    type: DEEZER_TYPE[album.record_type ?? ""] ?? "Сингл",
    cover: safeHttpUrl(album.cover_xl ?? album.cover_big),
    spotify: null,
    released_on: normalizeReleaseDate(album.release_date),
  };
}

type DeezerTrack = {
  id: number;
  title: string;
  rank?: number;
  contributors?: { name: string }[];
  artist?: { name: string };
  album?: { cover_xl?: string; cover_big?: string };
};

/** Топ-треки Deezer. rank — внутренний рейтинг популярности Deezer, кладём его в popularity */
export function mapDeezerTrack(t: DeezerTrack, artistSlug: string) {
  const names = (t.contributors?.length ? t.contributors : t.artist ? [t.artist] : []).map((c) => c.name);
  return {
    artist_slug: artistSlug,
    external_id: `deezer:track:${t.id}`,
    source: "deezer" as const,
    title: t.title,
    artists: [...new Set(names)].join(", "),
    cover: safeHttpUrl(t.album?.cover_xl ?? t.album?.cover_big),
    spotify: null,
    popularity: t.rank ?? 0,
  };
}
