// @ts-nocheck

// supabase/functions/sync-catalog/index.ts
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

// supabase/functions/sync-catalog/lib.ts
var textKey = (text) => text.normalize("NFKD").replace(/\p{M}/gu, "").toLowerCase().replace(/ё/g, "\u0435").replace(/[^\p{L}\p{N}]+/gu, "");
var sameKey = (a, b) => a !== "" && a === b;
var titleKey = (title) => {
  const [main, ...brackets] = title.split("(");
  return [textKey(main), ...brackets.map((b) => textKey(b))].filter(Boolean).join("(");
};
function normalizeReleaseDate(date, precision) {
  if (!date) return null;
  if (precision === "year" || /^\d{4}$/.test(date)) return `${date.slice(0, 4)}-01-01`;
  if (precision === "month" || /^\d{4}-\d{2}$/.test(date)) return `${date.slice(0, 7)}-01`;
  return /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : null;
}
var RELEASE_TYPE = { album: "\u0410\u043B\u044C\u0431\u043E\u043C", single: "\u0421\u0438\u043D\u0433\u043B", compilation: "\u0421\u0431\u043E\u0440\u043D\u0438\u043A" };
function releaseType(album) {
  if (album.album_type === "single" && (album.total_tracks ?? 1) >= 4) return "EP";
  return RELEASE_TYPE[album.album_type] ?? "\u0421\u0438\u043D\u0433\u043B";
}
function dedupeReleases(rows) {
  const seen = /* @__PURE__ */ new Set();
  return rows.filter((r) => {
    const key2 = `${titleKey(r.title)}|${r.type}|${r.released_on ?? ""}`;
    if (seen.has(key2)) return false;
    seen.add(key2);
    return true;
  });
}
function mapSpotifyAlbum(album, artistSlug) {
  return {
    artist_slug: artistSlug,
    external_id: `spotify:${album.id}`,
    source: "spotify",
    title: album.name,
    artists: (album.artists ?? []).map((a) => a.name).join(", "),
    type: releaseType(album),
    cover: largestImage(album.images),
    spotify: `album/${album.id}`,
    released_on: normalizeReleaseDate(album.release_date, album.release_date_precision)
  };
}
function safeHttpUrl(value, base) {
  if (typeof value !== "string" || !value.trim()) return null;
  try {
    const url = new URL(value.trim(), base);
    return url.protocol === "https:" || url.protocol === "http:" ? url.href : null;
  } catch {
    return null;
  }
}
var EVENT_TYPES = /* @__PURE__ */ new Set(["Event", "MusicEvent", "ComedyEvent", "Festival", "TheaterEvent"]);
function extractJsonLd(html) {
  const out = [];
  const re = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  for (const m of html.matchAll(re)) {
    try {
      out.push(JSON.parse(m[1].trim()));
    } catch {
    }
  }
  return out;
}
function* walk(node) {
  if (Array.isArray(node)) {
    for (const n of node) yield* walk(n);
    return;
  }
  if (!node || typeof node !== "object") return;
  const obj = node;
  yield obj;
  for (const key2 of ["@graph", "itemListElement", "item", "subEvent", "event", "events"]) {
    if (key2 in obj) yield* walk(obj[key2]);
  }
}
var isEvent = (o) => [o["@type"]].flat().some((t) => typeof t === "string" && EVENT_TYPES.has(t));
var str = (v) => typeof v === "string" && v.trim() ? v.trim() : null;
function firstOfferUrl(offers) {
  for (const o of [offers].flat()) {
    if (o && typeof o === "object") {
      const url = str(o.url);
      if (url) return url;
    }
  }
  return null;
}
function cityOf(location) {
  const address = location.address;
  if (typeof address === "string") return address.split(",")[0].trim() || null;
  if (address && typeof address === "object") {
    const a = address;
    return str(a.addressLocality) ?? str(a.addressRegion);
  }
  return null;
}
var cityKey = (city) => textKey(city.trim().replace(/^(г|город)\.?\s+/i, ""));
var concertKey = (artistSlug, date, city) => `${artistSlug}:${date}:${cityKey(city)}`;
function eventsFromJsonLd(blocks, artist, sourceUrl, today) {
  const seen = /* @__PURE__ */ new Set();
  const result = [];
  for (const node of walk(blocks)) {
    if (!isEvent(node)) continue;
    const date = str(node.startDate)?.slice(0, 10);
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date) || date < today) continue;
    const performers = [node.performer].flat().map((p) => p && typeof p === "object" ? str(p.name) : str(p));
    const mentions = [str(node.name), ...performers].some((t) => t != null && mentionsArtist(t, artist.name));
    if (!mentions) continue;
    const location = Array.isArray(node.location) ? node.location[0] : node.location;
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
      ticket_url: safeHttpUrl(firstOfferUrl(node.offers), sourceUrl) ?? safeHttpUrl(node.url, sourceUrl) ?? safeHttpUrl(sourceUrl)
    });
  }
  return result;
}
function eventsFromBandsintown(events, artistSlug, today) {
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
      ticket_url: safeHttpUrl(e.offers?.find((o) => o.url)?.url) ?? safeHttpUrl(e.url)
    }];
  });
}
var nameKey = textKey;
function pickSpotifyArtist(hits, name) {
  const key2 = nameKey(name);
  const exact = hits.filter((h) => sameKey(nameKey(h.name), key2));
  const unique = [...new Map(exact.map((h) => [h.id, h])).values()];
  if (unique.length === 1) return { status: "found", id: unique[0].id };
  if (unique.length > 1) return { status: "ambiguous", candidates: unique.map((h) => ({ id: h.id, name: h.name })) };
  return { status: "not_found" };
}
var largestImage = (images) => [...images ?? []].sort((a, b) => (b.width ?? 0) - (a.width ?? 0))[0]?.url ?? null;
var GENRE_WORDS = [
  [/hyperpop/, "\u0433\u0438\u043F\u0435\u0440\u043F\u043E\u043F"],
  [/phonk/, "\u0444\u043E\u043D\u043A"],
  [/trap/, "\u0442\u0440\u044D\u043F"],
  [/hip hop|rap/, "\u0440\u044D\u043F"],
  [/r&b|rnb/, "R&B"],
  [/punk/, "\u043F\u0430\u043D\u043A"],
  [/rock/, "\u0440\u043E\u043A"],
  [/indie/, "\u0438\u043D\u0434\u0438"],
  [/edm|electro|rave|techno|house|dance/, "\u044D\u043B\u0435\u043A\u0442\u0440\u043E\u043D\u0438\u043A\u0430"],
  [/pop/, "\u043F\u043E\u043F"]
];
function taglineFromGenres(genres = []) {
  const words = [];
  for (const genre of genres) {
    const hit = GENRE_WORDS.find(([re]) => re.test(genre.toLowerCase()));
    if (hit && !words.includes(hit[1])) words.push(hit[1]);
    if (words.length === 2) break;
  }
  if (!words.length) return null;
  const text = words.join(" \xB7 ");
  return text[0].toUpperCase() + text.slice(1);
}
var mapSpotifyTrack = (t, artistSlug) => ({
  artist_slug: artistSlug,
  external_id: `spotify:track:${t.id}`,
  source: "spotify",
  title: t.name,
  artists: (t.artists ?? []).map((a) => a.name).join(", "),
  cover: largestImage(t.album?.images),
  spotify: `track/${t.id}`,
  popularity: t.popularity ?? 0
});
var CLIP_RE = /клип|official\s*(music\s*)?video|music\s*video|mood\s*video|\bmv\b/i;
var NOT_CLIP_RE = /тизер|teaser|trailer|трейлер|backstage|бэкстейдж|behind the scenes|#shorts|lyric|караоке|live|лайв/i;
var isClipTitle = (title) => CLIP_RE.test(title) && !NOT_CLIP_RE.test(title);
function mentionsArtist(title, artistName) {
  const normalize = (s) => s.toLowerCase().replace(/ё/g, "\u0435");
  const name = normalize(artistName.trim()).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  if (!name) return false;
  return new RegExp(`(^|[^\\p{L}\\p{N}])${name}([^\\p{L}\\p{N}]|$)`, "iu").test(normalize(title));
}
function cleanVideoTitle(title, artistName) {
  const name = artistName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const cleaned = title.replace(new RegExp(`^\\s*${name}(\\s*(,|&|feat\\.?|ft\\.?|x)\\s*[^-\u2013\u2014]+)?\\s*[-\u2013\u2014]\\s*`, "i"), "").replace(/\s*[([](official\s*(music\s*)?video|music\s*video|mood\s*video|премьера клипа|клип|mv)[)\]]\s*/gi, " ").replace(/\s{2,}/g, " ").trim();
  return cleaned || title.trim();
}
function clipsFromUploads(items, artist, requireMention) {
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
      published_at: item.snippet?.publishedAt ?? null
    }];
  });
}
function pickYoutubeChannel(hits, name) {
  const key2 = nameKey(name);
  for (const h of hits) {
    const title = nameKey((h.snippet?.channelTitle ?? h.snippet?.title ?? "").replace(/official|music|tv|vevo|channel/gi, ""));
    if (sameKey(title, key2) && h.id?.channelId) return h.id.channelId;
  }
  return null;
}
var MUSICIAN_RE = /певиц|певец|рэпер|репер|исполнител|музыкант|групп|коллектив|диджей|битмейкер|автор песен|поп-|рок-|хип-хоп/i;
function isMusicianPage(summary, name) {
  if (summary.type === "disambiguation" || !summary.extract) return false;
  const title = nameKey((summary.title ?? "").replace(/\s*\(.*\)\s*$/, ""));
  return sameKey(title, nameKey(name)) && MUSICIAN_RE.test(`${summary.description ?? ""} ${summary.extract.slice(0, 300)}`);
}
function bioFromExtract(extract, maxLength = 600) {
  const text = extract.replace(/\[\d+\]/g, "").replace(/\u0301/g, "").replace(/\s+/g, " ").trim();
  const sentences = text.match(/[^.!?]+[.!?]+(\s|$)/g) ?? [text];
  let bio = "";
  for (const s of sentences) {
    if ((bio + s).length > maxLength && bio) break;
    bio += s;
  }
  return bio.trim();
}
function mergeSocials(socials = [], additions) {
  const names = new Set(socials.map((s) => s.name.toLowerCase()));
  return [...socials, ...additions.filter((a) => !names.has(a.name.toLowerCase()))];
}
function pickDeezerArtist(hits, name) {
  const key2 = nameKey(name);
  const exact = [...new Map(hits.filter((h) => sameKey(nameKey(h.name), key2)).map((h) => [h.id, h])).values()].sort((a, b) => (b.nb_fan ?? 0) - (a.nb_fan ?? 0));
  if (exact.length === 1) return { status: "found", id: String(exact[0].id) };
  if (exact.length > 1) {
    const [first, second] = exact;
    if ((first.nb_fan ?? 0) >= 10 * Math.max(1, second.nb_fan ?? 0)) return { status: "found", id: String(first.id) };
    return { status: "ambiguous", candidates: exact.map((h) => ({ id: String(h.id), name: h.name })) };
  }
  return { status: "not_found" };
}
var DEEZER_TYPE = { album: "\u0410\u043B\u044C\u0431\u043E\u043C", ep: "EP", single: "\u0421\u0438\u043D\u0433\u043B", compile: "\u0421\u0431\u043E\u0440\u043D\u0438\u043A" };
function mapDeezerAlbum(album, artistSlug, artistName) {
  return {
    artist_slug: artistSlug,
    external_id: `deezer:${album.id}`,
    source: "deezer",
    title: album.title,
    artists: album.artist?.name && sameKey(nameKey(album.artist.name), nameKey(artistName)) ? artistName : album.artist?.name ?? artistName,
    type: DEEZER_TYPE[album.record_type ?? ""] ?? "\u0421\u0438\u043D\u0433\u043B",
    cover: safeHttpUrl(album.cover_xl ?? album.cover_big),
    spotify: null,
    released_on: normalizeReleaseDate(album.release_date)
  };
}
function mapDeezerTrack(t, artistSlug) {
  const names = (t.contributors?.length ? t.contributors : t.artist ? [t.artist] : []).map((c) => c.name);
  return {
    artist_slug: artistSlug,
    external_id: `deezer:track:${t.id}`,
    source: "deezer",
    title: t.title,
    artists: [...new Set(names)].join(", "),
    cover: safeHttpUrl(t.album?.cover_xl ?? t.album?.cover_big),
    spotify: null,
    popularity: t.rank ?? 0
  };
}

// supabase/functions/sync-catalog/http.ts
var FETCH_TIMEOUT_MS = 1e4;
var USER_AGENT = "RhymesMusicSiteBot/1.0 (+https://rhymesmusic.ru)";
async function request(url, init = {}) {
  const res = await fetch(url, {
    ...init,
    headers: { "user-agent": USER_AGENT, ...init.headers ?? {} },
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS)
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}: ${url.replace(/key=[^&]+/, "key=***")}`);
  return res;
}
var getJson = async (url, init) => (await request(url, init)).json();
var env = (key2) => Deno.env.get(key2) ?? "";
var errorText = (e) => e instanceof Error ? e.message : String(e);

// supabase/functions/sync-catalog/sources/spotify.ts
var API = "https://api.spotify.com/v1";
var MAX_ALBUM_PAGES = 4;
var market = () => env("SPOTIFY_MARKET") || "KZ";
var token = null;
async function auth() {
  if (!token || token.expires < Date.now() + 6e4) {
    const credentials = btoa(`${env("SPOTIFY_CLIENT_ID")}:${env("SPOTIFY_CLIENT_SECRET")}`);
    const res = await request("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: { authorization: `Basic ${credentials}`, "content-type": "application/x-www-form-urlencoded" },
      body: "grant_type=client_credentials"
    });
    const json2 = await res.json();
    token = { value: json2.access_token, expires: Date.now() + json2.expires_in * 1e3 };
  }
  return { authorization: `Bearer ${token.value}` };
}
var isConfigured = () => Boolean(env("SPOTIFY_CLIENT_ID") && env("SPOTIFY_CLIENT_SECRET"));
var hasExtendedQuota = () => env("SPOTIFY_EXTENDED_QUOTA") === "true";
async function searchArtists(name) {
  const url = `${API}/search?type=artist&limit=10&q=${encodeURIComponent(name)}`;
  return (await getJson(url, { headers: await auth() })).artists?.items ?? [];
}
async function getArtist(id) {
  return getJson(`${API}/artists/${encodeURIComponent(id)}`, { headers: await auth() });
}
async function getAlbums(id) {
  const albums = [];
  let url = `${API}/artists/${encodeURIComponent(id)}/albums?include_groups=album,single&limit=50`;
  for (let page = 0; url && page < MAX_ALBUM_PAGES; page++) {
    const json2 = await getJson(url, { headers: await auth() });
    albums.push(...json2.items);
    url = json2.next;
  }
  return albums;
}
async function getTopTracks(id) {
  const url = `${API}/artists/${encodeURIComponent(id)}/top-tracks?market=${market()}`;
  return (await getJson(url, { headers: await auth() })).tracks ?? [];
}

// supabase/functions/sync-catalog/sources/deezer.ts
var API2 = "https://api.deezer.com";
async function call(path) {
  const json2 = await getJson(`${API2}${path}`);
  if (json2?.error) throw new Error(`Deezer: ${json2.error.message ?? json2.error.type}`);
  return json2;
}
async function searchArtists2(name) {
  return (await call(`/search/artist?limit=10&q=${encodeURIComponent(name)}`)).data ?? [];
}
async function getAlbums2(id) {
  return (await call(`/artist/${encodeURIComponent(id)}/albums?limit=100`)).data ?? [];
}
async function getTopTracks2(id) {
  return (await call(`/artist/${encodeURIComponent(id)}/top?limit=10`)).data ?? [];
}
function getArtist2(id) {
  return call(`/artist/${encodeURIComponent(id)}`);
}

// supabase/functions/sync-catalog/sources/youtube.ts
var API3 = "https://www.googleapis.com/youtube/v3";
var MAX_UPLOAD_PAGES = 4;
var isConfigured2 = () => Boolean(env("YOUTUBE_API_KEY"));
var key = () => `key=${encodeURIComponent(env("YOUTUBE_API_KEY"))}`;
async function searchChannels(name) {
  const url = `${API3}/search?part=snippet&type=channel&maxResults=5&q=${encodeURIComponent(name)}&${key()}`;
  return (await getJson(url)).items ?? [];
}
async function getUploads(channelId) {
  const playlistId = `UU${channelId.slice(2)}`;
  const items = [];
  let pageToken = "";
  for (let page = 0; page < MAX_UPLOAD_PAGES; page++) {
    const url = `${API3}/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}${pageToken ? `&pageToken=${pageToken}` : ""}&${key()}`;
    const json2 = await getJson(url);
    items.push(...json2.items ?? []);
    if (!json2.nextPageToken) break;
    pageToken = json2.nextPageToken;
  }
  return items;
}

// supabase/functions/sync-catalog/sources/wikipedia.ts
var API4 = "https://ru.wikipedia.org";
async function searchTitles(name) {
  const url = `${API4}/w/api.php?action=query&list=search&srlimit=5&format=json&origin=*&srsearch=${encodeURIComponent(`${name} \u043C\u0443\u0437\u044B\u043A\u0430`)}`;
  return ((await getJson(url)).query?.search ?? []).map((r) => r.title);
}
function getSummary(title) {
  return getJson(`${API4}/api/rest_v1/page/summary/${encodeURIComponent(title.replace(/ /g, "_"))}`);
}

// supabase/functions/sync-catalog/sources/tours.ts
async function collectConcerts(artist, today, errors) {
  const found = [];
  for (const url of artist.tour_sources ?? []) {
    try {
      const html = await (await request(url)).text();
      found.push(...eventsFromJsonLd(extractJsonLd(html), artist, url, today));
    } catch (e) {
      errors.push(`\u0430\u0444\u0438\u0448\u0430 ${url}: ${errorText(e)}`);
    }
  }
  const appId = env("BANDSINTOWN_APP_ID");
  if (appId && artist.bandsintown_name) {
    try {
      const url = `https://rest.bandsintown.com/artists/${encodeURIComponent(artist.bandsintown_name)}/events?app_id=${encodeURIComponent(appId)}`;
      found.push(...eventsFromBandsintown(await getJson(url), artist.slug, today));
    } catch (e) {
      errors.push(`bandsintown: ${errorText(e)}`);
    }
  }
  return [...new Map(found.map((c) => [c.external_id, c])).values()];
}

// supabase/functions/sync-catalog/index.ts
var RETRY_NOT_FOUND_MS = 7 * 24 * 36e5;
var safeEqual = (a, b) => {
  if (!a || a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
};
var todayMoscow = () => new Date(Date.now() + 3 * 36e5).toISOString().slice(0, 10);
var shouldSearch = (artist, source) => {
  const last = artist.resolved?.[source];
  return !last || last.status === "auto" || Date.now() - Date.parse(last.at) > RETRY_NOT_FOUND_MS;
};
async function step(report, name, fn) {
  try {
    await fn();
  } catch (e) {
    report.errors.push(`${name}: ${errorText(e)}`);
  }
}
async function resolveSources(artist, report) {
  const patch = {};
  const resolved = { ...artist.resolved ?? {} };
  const mark = (source, found) => {
    resolved[source] = { status: found ? "auto" : "not_found", at: (/* @__PURE__ */ new Date()).toISOString() };
    if (found) report.found.push(source);
  };
  if (!artist.spotify_id && isConfigured() && shouldSearch(artist, "spotify")) {
    await step(report, "\u043F\u043E\u0438\u0441\u043A Spotify", async () => {
      const match = pickSpotifyArtist(await searchArtists(artist.name), artist.name);
      if (match.status === "found") {
        patch.spotify_id = match.id;
        mark("spotify", true);
      } else if (match.status === "ambiguous") {
        resolved.spotify = { status: "ambiguous", at: (/* @__PURE__ */ new Date()).toISOString(), candidates: match.candidates };
        report.errors.push(`Spotify: \u043D\u0435\u0441\u043A\u043E\u043B\u044C\u043A\u043E \u0430\u0440\u0442\u0438\u0441\u0442\u043E\u0432 \u0441 \u0438\u043C\u0435\u043D\u0435\u043C \xAB${artist.name}\xBB \u2014 \u0432\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u043D\u0443\u0436\u043D\u043E\u0433\u043E \u0432 \u0430\u0434\u043C\u0438\u043D\u043A\u0435`);
      } else {
        mark("spotify", false);
      }
    });
  }
  if (!artist.deezer_id && shouldSearch(artist, "deezer")) {
    await step(report, "\u043F\u043E\u0438\u0441\u043A Deezer", async () => {
      const match = pickDeezerArtist(await searchArtists2(artist.name), artist.name);
      if (match.status === "found") {
        patch.deezer_id = match.id;
        mark("deezer", true);
      } else if (match.status === "ambiguous") {
        resolved.deezer = { status: "ambiguous", at: (/* @__PURE__ */ new Date()).toISOString(), candidates: match.candidates };
        report.errors.push(`Deezer: \u043D\u0435\u0441\u043A\u043E\u043B\u044C\u043A\u043E \u0430\u0440\u0442\u0438\u0441\u0442\u043E\u0432 \u0441 \u0438\u043C\u0435\u043D\u0435\u043C \xAB${artist.name}\xBB \u2014 \u0432\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u043D\u0443\u0436\u043D\u043E\u0433\u043E \u0432 \u0430\u0434\u043C\u0438\u043D\u043A\u0435`);
      } else {
        mark("deezer", false);
      }
    });
  }
  if (!artist.youtube_channel_id && isConfigured2() && shouldSearch(artist, "youtube")) {
    await step(report, "\u043F\u043E\u0438\u0441\u043A YouTube", async () => {
      const channelId = pickYoutubeChannel(await searchChannels(artist.name), artist.name);
      if (channelId) patch.youtube_channel_id = channelId;
      mark("youtube", Boolean(channelId));
    });
  }
  if (!artist.wikipedia_title && !artist.bio && shouldSearch(artist, "wikipedia")) {
    await step(report, "\u043F\u043E\u0438\u0441\u043A \u0412\u0438\u043A\u0438\u043F\u0435\u0434\u0438\u0438", async () => {
      for (const title of await searchTitles(artist.name)) {
        if (isMusicianPage(await getSummary(title), artist.name)) {
          patch.wikipedia_title = title;
          break;
        }
      }
      mark("wikipedia", Boolean(patch.wikipedia_title));
    });
  }
  if (JSON.stringify(resolved) !== JSON.stringify(artist.resolved ?? {})) patch.resolved = resolved;
  return patch;
}
async function fillProfile(artist, report) {
  const patch = {};
  const links = [];
  if (artist.deezer_id && !artist.photo) {
    await step(report, "\u043F\u0440\u043E\u0444\u0438\u043B\u044C Deezer", async () => {
      const profile = await getArtist2(artist.deezer_id);
      const photo = safeHttpUrl(profile.picture_xl);
      if (photo && !photo.includes("/images/artist//")) patch.photo = photo;
    });
  }
  if (artist.spotify_id) {
    await step(report, "\u043F\u0440\u043E\u0444\u0438\u043B\u044C Spotify", async () => {
      const profile = await getArtist(artist.spotify_id);
      const photo = largestImage(profile.images);
      if (!artist.photo && !patch.photo && photo) patch.photo = photo;
      const tagline = taglineFromGenres(profile.genres);
      if (!artist.tagline && tagline) patch.tagline = tagline;
      links.push({ name: "Spotify", url: `https://open.spotify.com/artist/${artist.spotify_id}` });
    });
  }
  if (artist.youtube_channel_id) {
    links.push({ name: "YouTube", url: `https://www.youtube.com/channel/${artist.youtube_channel_id}` });
  }
  if (!artist.bio && artist.wikipedia_title) {
    await step(report, "\u0431\u0438\u043E \u0438\u0437 \u0412\u0438\u043A\u0438\u043F\u0435\u0434\u0438\u0438", async () => {
      const summary = await getSummary(artist.wikipedia_title);
      if (!isMusicianPage(summary, artist.name)) return;
      patch.bio = bioFromExtract(summary.extract);
      patch.bio_source = summary.content_urls?.desktop?.page ?? null;
    });
  }
  const socials = mergeSocials(artist.socials ?? [], links);
  if (socials.length !== (artist.socials ?? []).length) patch.socials = socials;
  report.profile.push(...Object.keys(patch).filter((k) => k !== "bio_source"));
  return patch;
}
async function insertNew(db, table, rows) {
  if (!rows.length) return 0;
  const { data, error } = await db.from(table).upsert(rows, { onConflict: "artist_slug,external_id", ignoreDuplicates: true }).select("id");
  if (error) throw error;
  return data?.length ?? 0;
}
async function mergeReleases(db, artist, candidates) {
  const rows = dedupeReleases(candidates);
  const { data: existing, error } = await db.from("releases").select("id, spotify, external_id, title, released_on, cover").eq("artist_slug", artist.slug);
  if (error) throw error;
  const findExisting = (r) => existing.find(
    (e) => e.external_id === r.external_id || r.spotify !== null && e.spotify === r.spotify || sameKey(titleKey(e.title ?? ""), titleKey(r.title))
  );
  const added = await insertNew(db, "releases", rows.filter((r) => !findExisting(r)));
  for (const r of rows) {
    const known = findExisting(r);
    if (!known) continue;
    const patch = known.external_id === r.external_id ? { title: r.title, artists: r.artists, cover: r.cover, released_on: r.released_on } : { ...known.released_on ? {} : { released_on: r.released_on }, ...known.cover ? {} : { cover: r.cover } };
    if (!Object.keys(patch).length) continue;
    const { error: updateError } = await db.from("releases").update(patch).eq("id", known.id);
    if (updateError) throw updateError;
  }
  return added;
}
var syncSpotifyReleases = async (db, artist) => mergeReleases(db, artist, (await getAlbums(artist.spotify_id)).map((a) => mapSpotifyAlbum(a, artist.slug)));
var syncDeezerReleases = async (db, artist) => mergeReleases(db, artist, (await getAlbums2(artist.deezer_id)).map((a) => mapDeezerAlbum(a, artist.slug, artist.name)));
async function mergeTracks(db, artist, rows, source) {
  const { data: existing, error } = await db.from("tracks").select("id, spotify, external_id, title, source, hidden").eq("artist_slug", artist.slug);
  if (error) throw error;
  const findExisting = (t) => existing.find(
    (e) => e.external_id === t.external_id || t.spotify !== null && e.spotify === t.spotify || sameKey(titleKey(e.title ?? ""), titleKey(t.title))
  );
  const added = await insertNew(db, "tracks", rows.filter((t) => !findExisting(t)));
  for (const t of rows) {
    const known = findExisting(t);
    if (!known || known.external_id !== t.external_id) continue;
    const { error: updateError } = await db.from("tracks").update({ popularity: t.popularity, cover: t.cover }).eq(
      "id",
      known.id
    );
    if (updateError) throw updateError;
  }
  const current = new Set(rows.map((t) => t.external_id));
  const dropped = existing.filter((e) => e.source === source && !e.hidden && e.external_id && !current.has(e.external_id));
  if (dropped.length) {
    const { error: deleteError } = await db.from("tracks").delete().in("id", dropped.map((e) => e.id));
    if (deleteError) throw deleteError;
  }
  return added;
}
async function syncVideos(db, artist, labelUploads) {
  const candidates = [
    ...artist.youtube_channel_id ? clipsFromUploads(await getUploads(artist.youtube_channel_id), artist, false) : [],
    ...clipsFromUploads(labelUploads, artist, true)
  ];
  if (!candidates.length) return 0;
  const { data: existing, error } = await db.from("videos").select("youtube_id").eq("artist_slug", artist.slug);
  if (error) throw error;
  const known = new Set(existing.map((v) => v.youtube_id));
  const fresh = [...new Map(candidates.map((v) => [v.youtube_id, v])).values()].filter((v) => !known.has(v.youtube_id));
  return insertNew(db, "videos", fresh);
}
async function syncConcerts(db, artist, today, errors) {
  const candidates = await collectConcerts(artist, today, errors);
  if (!candidates.length) return 0;
  const { data: existing, error } = await db.from("concerts").select("id, external_id, source, date, city").eq("artist_slug", artist.slug).gte("date", today);
  if (error) throw error;
  const byKey = new Map(existing.map((c) => [c.external_id ?? concertKey(artist.slug, c.date, c.city), c]));
  const trusted = new Set(env("AUTO_PUBLISH_SOURCES").split(",").map((s) => s.trim()).filter(Boolean));
  const added = await insertNew(
    db,
    "concerts",
    candidates.filter((c) => !byKey.has(c.external_id)).map((c) => ({
      ...c,
      status: trusted.has(c.source) ? "published" : "pending"
    }))
  );
  for (const c of candidates) {
    const row = byKey.get(c.external_id);
    if (!row || row.source === "manual") continue;
    const { error: updateError } = await db.from("concerts").update({ venue: c.venue, ticket_url: c.ticket_url, updated_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("id", row.id);
    if (updateError) throw updateError;
  }
  return added;
}
async function syncArtist(db, input, today, labelUploads) {
  const report = { slug: input.slug, found: [], profile: [], releases: 0, tracks: 0, videos: 0, concerts: 0, errors: [] };
  let artist = input;
  const save = async (patch) => {
    if (!Object.keys(patch).length) return;
    const { error } = await db.from("artists").update(patch).eq("slug", artist.slug);
    if (error) throw error;
    artist = { ...artist, ...patch };
  };
  await step(report, "\u0438\u0441\u0442\u043E\u0447\u043D\u0438\u043A\u0438", async () => save(await resolveSources(artist, report)));
  await step(report, "\u043F\u0440\u043E\u0444\u0438\u043B\u044C", async () => save(await fillProfile(artist, report)));
  if (artist.deezer_id) {
    await step(report, "\u0440\u0435\u043B\u0438\u0437\u044B Deezer", async () => void (report.releases += await syncDeezerReleases(db, artist)));
  }
  if (artist.spotify_id) {
    await step(report, "\u0440\u0435\u043B\u0438\u0437\u044B Spotify", async () => void (report.releases += await syncSpotifyReleases(db, artist)));
  }
  if (artist.spotify_id && hasExtendedQuota()) {
    await step(report, "\u0442\u0440\u0435\u043A\u0438 Spotify", async () => {
      const rows = (await getTopTracks(artist.spotify_id)).map((t) => mapSpotifyTrack(t, artist.slug));
      report.tracks = await mergeTracks(db, artist, rows, "spotify");
    });
  } else if (artist.deezer_id) {
    await step(report, "\u0442\u0440\u0435\u043A\u0438 Deezer", async () => {
      const rows = (await getTopTracks2(artist.deezer_id)).map((t) => mapDeezerTrack(t, artist.slug));
      report.tracks = await mergeTracks(db, artist, rows, "deezer");
    });
  }
  if (isConfigured2()) {
    await step(report, "\u043A\u043B\u0438\u043F\u044B", async () => void (report.videos = await syncVideos(db, artist, labelUploads)));
  }
  await step(report, "\u043A\u043E\u043D\u0446\u0435\u0440\u0442\u044B", async () => void (report.concerts = await syncConcerts(db, artist, today, report.errors)));
  await step(report, "\u043E\u0442\u043C\u0435\u0442\u043A\u0430", async () => {
    const { error } = await db.from("artists").update({ synced_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("slug", artist.slug);
    if (error) throw error;
  });
  return report;
}
var ARTIST_COLUMNS = "slug, name, photo, tagline, bio, bio_source, socials, spotify_id, deezer_id, youtube_channel_id, wikipedia_title, bandsintown_name, tour_sources, resolved";
var CORS = {
  "access-control-allow-origin": "*",
  "access-control-allow-headers": "authorization, apikey, content-type, x-client-info, x-sync-secret",
  "access-control-allow-methods": "POST, OPTIONS"
};
var json = (body, status = 200) => Response.json(body, { status, headers: CORS });
async function isAuthorized(req, db) {
  const candidate = req.headers.get("x-sync-secret") ?? "";
  if (candidate) {
    if (env("SYNC_SECRET")) return safeEqual(candidate, env("SYNC_SECRET"));
    const { data: data2, error } = await db.rpc("check_sync_secret", { candidate });
    if (!error && data2 === true) return true;
  }
  const token2 = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token2) return false;
  const { data } = await db.auth.getUser(token2);
  return data.user?.app_metadata?.role === "admin";
}
var BATCH_SIZE = () => Number(env("SYNC_BATCH_SIZE")) || 6;
var TIME_BUDGET_MS = 1e5;
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: CORS });
  if (req.method !== "POST") return json({ error: "method not allowed" }, 405);
  const db = createClient(env("SUPABASE_URL"), env("SUPABASE_SERVICE_ROLE_KEY"));
  if (!await isAuthorized(req, db)) return json({ error: "unauthorized" }, 401);
  const body = await req.json().catch(() => null);
  const onlySlug = body && typeof body === "object" && typeof body.artist === "string" ? body.artist : null;
  const started = Date.now();
  const startedAt = new Date(started).toISOString();
  let query = db.from("artists").select(ARTIST_COLUMNS).eq("auto_sync", true);
  query = onlySlug ? query.eq("slug", onlySlug) : query.order("synced_at", { ascending: true, nullsFirst: true }).limit(BATCH_SIZE());
  const { data: artists, error } = await query;
  if (error) return json({ error: error.message }, 500);
  const runErrors = [];
  let labelUploads = [];
  const labelChannel = env("LABEL_YOUTUBE_CHANNEL_ID");
  if (labelChannel && isConfigured2()) {
    try {
      labelUploads = await getUploads(labelChannel);
    } catch (e) {
      runErrors.push(`\u043A\u0430\u043D\u0430\u043B \u043B\u0435\u0439\u0431\u043B\u0430: ${errorText(e)}`);
    }
  }
  const today = todayMoscow();
  const reports = [];
  const skipped = [];
  for (const artist of artists) {
    if (Date.now() - started > TIME_BUDGET_MS) {
      skipped.push(artist.slug);
      continue;
    }
    reports.push(await syncArtist(db, artist, today, labelUploads));
  }
  const total = (key2) => reports.reduce((n, r) => n + r[key2], 0);
  const summary = {
    artists: reports.length,
    postponed: skipped,
    sourcesFound: reports.flatMap((r) => r.found.map((s) => `${r.slug}: ${s}`)),
    profilesFilled: reports.filter((r) => r.profile.length).map((r) => `${r.slug}: ${r.profile.join(", ")}`),
    releases: total("releases"),
    tracks: total("tracks"),
    videos: total("videos"),
    concertsForReview: total("concerts"),
    errors: [...runErrors, ...reports.flatMap((r) => r.errors.map((e) => `${r.slug}: ${e}`))]
  };
  await db.from("sync_runs").insert({ started_at: startedAt, finished_at: (/* @__PURE__ */ new Date()).toISOString(), summary, reports });
  return json(summary);
});
