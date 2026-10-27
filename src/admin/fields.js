/* Чистые функции админки: разбор ссылок, адрес страницы, проверка формы. Покрыты тестами. */

const TRANSLIT = {
  а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e", ж: "zh", з: "z", и: "i", й: "y", к: "k", л: "l", м: "m",
  н: "n", о: "o", п: "p", р: "r", с: "s", т: "t", у: "u", ф: "f", х: "h", ц: "ts", ч: "ch", ш: "sh", щ: "sch",
  ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya"
};

/** «Наверное Радость» → «navernoe-radost»: адрес страницы /artist/<slug> */
export function slugify(name) {
  return name
    .toLowerCase()
    .split("")
    .map((ch) => TRANSLIT[ch] ?? ch)
    .join("")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60)
    .replace(/-+$/, ""); // обрезка могла оставить дефис на конце — такой адрес не проходит проверку
}

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Принимает ссылку open.spotify.com/artist/<id>, spotify:artist:<id> или сам id */
export function parseSpotifyArtistId(input) {
  const value = input.trim();
  if (!value) return "";
  const match = value.match(/(?:artist[/:])([A-Za-z0-9]{22})/) ?? value.match(/^([A-Za-z0-9]{22})$/);
  return match ? match[1] : null;
}

/** Принимает ссылку deezer.com/(ru/)artist/<id>, сам id или пусто */
export function parseDeezerArtistId(input) {
  const value = input.trim();
  if (!value) return "";
  const match = value.match(/deezer\.com\/(?:[a-z]{2}\/)?artist\/(\d+)/) ?? value.match(/^(\d{1,12})$/);
  return match ? match[1] : null;
}

/** Принимает ссылку youtube.com/channel/UC… или сам id канала; @handle не подходит — у него нет id в ссылке */
export function parseYoutubeChannelId(input) {
  const value = input.trim();
  if (!value) return "";
  const match = value.match(/(UC[A-Za-z0-9_-]{22})/);
  return match ? match[1] : null;
}

const isHttpsUrl = (value) => {
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
};

/** Страницы афиш: по одной на строку, только https */
const parseLines = (text) => text.split("\n").map((s) => s.trim()).filter(Boolean);

export const SOCIAL_NAMES = ["VK", "YouTube", "TikTok", "Instagram", "Telegram", "Spotify", "SoundCloud", "Likee"];

export const BIO_RECOMMENDED = 600;

/**
 * Проверка формы артиста. Возвращает { поле: текст ошибки }; пустой объект — всё в порядке.
 * @param {object} form
 * @param {{ isNew: boolean, takenSlugs: Set<string> }} ctx
 */
export function validateArtist(form, { isNew, takenSlugs }) {
  const errors = {};
  if (!form.name.trim()) errors.name = "Укажите имя артиста";
  if (!SLUG_RE.test(form.slug)) errors.slug = "Только латиница, цифры и дефис, например navernoe-radost";
  else if (isNew && takenSlugs.has(form.slug)) errors.slug = "Такой адрес уже занят другим артистом";
  if (form.spotifyInput && parseSpotifyArtistId(form.spotifyInput) === null) errors.spotifyInput = "Не похоже на ссылку на артиста в Spotify";
  if (form.deezerInput && parseDeezerArtistId(form.deezerInput) === null) errors.deezerInput = "Нужна ссылка вида deezer.com/artist/12345";
  if (form.youtubeInput && parseYoutubeChannelId(form.youtubeInput) === null) {
    errors.youtubeInput = "Нужна ссылка вида youtube.com/channel/UC… — откройте канал → «О канале» → «Поделиться» → «Копировать идентификатор канала»";
  }
  const badSource = parseLines(form.tourSources).find((u) => !isHttpsUrl(u));
  if (badSource) errors.tourSources = `Не https-ссылка: ${badSource}`;
  const badSocial = form.socials.find((s) => s.url && !isHttpsUrl(s.url));
  if (badSocial) errors.socials = `Ссылка ${badSocial.name || "соцсети"} должна начинаться с https://`;
  if (!form.palette.every((c) => /^#[0-9a-f]{6}$/i.test(c))) errors.palette = "Цвета в формате #rrggbb";
  return errors;
}

/** Строка базы → состояние формы */
export function artistToForm(a) {
  return {
    name: a?.name ?? "",
    slug: a?.slug ?? "",
    tagline: a?.tagline ?? "",
    bio: a?.bio ?? "",
    photo: a?.photo ?? "",
    photoPosition: a?.photo_position ?? "50% 25%",
    palette: a?.palette?.length === 3 ? [...a.palette] : ["#f5e52a", "#ff2e88", "#5cc8ff"],
    socials: (a?.socials ?? []).map((s) => ({ ...s })),
    spotifyInput: a?.spotify_id ?? "",
    deezerInput: a?.deezer_id ?? "",
    youtubeInput: a?.youtube_channel_id ?? "",
    bandsintownName: a?.bandsintown_name ?? "",
    tourSources: (a?.tour_sources ?? []).join("\n"),
    autoSync: a?.auto_sync ?? true,
    published: a ? !a.hidden : false,
    sort: a?.sort ?? 0
  };
}

/** Порядок в списке: целое число в пределах int базы (1.5 и 1e12 иначе дают ошибку сервера) */
export const toSort = (value) => {
  const n = Math.trunc(Number(value));
  return Number.isFinite(n) ? Math.max(-1_000_000, Math.min(1_000_000, n)) : 0;
};

/**
 * Состояние формы → строка для базы (после validateArtist).
 * Если био переписали вручную, ссылка «по материалам Википедии» больше не верна — сбрасываем её.
 */
export function formToArtist(f, original = null) {
  return {
    slug: f.slug,
    name: f.name.trim(),
    tagline: f.tagline.trim() || null,
    bio: f.bio.trim() || null,
    photo: f.photo || null,
    photo_position: f.photoPosition,
    palette: f.palette,
    socials: f.socials.filter((s) => s.name && s.url).map((s) => ({ name: s.name.trim(), url: s.url.trim() })),
    spotify_id: parseSpotifyArtistId(f.spotifyInput) || null,
    deezer_id: parseDeezerArtistId(f.deezerInput ?? "") || null,
    youtube_channel_id: parseYoutubeChannelId(f.youtubeInput) || null,
    bandsintown_name: f.bandsintownName.trim() || null,
    tour_sources: parseLines(f.tourSources),
    auto_sync: f.autoSync,
    hidden: !f.published,
    sort: toSort(f.sort),
    ...(original && (f.bio.trim() || null) !== (original.bio ?? null) ? { bio_source: null } : {})
  };
}

/** Переставляет элемент списка с позиции from на позицию to (новый массив) */
export function moveItem(list, from, to) {
  if (from === to || from < 0 || from >= list.length) return list;
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(Math.max(0, Math.min(to, next.length)), 0, item);
  return next;
}
