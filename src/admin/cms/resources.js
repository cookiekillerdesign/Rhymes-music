/*
 * Все сущности сайта, которые редактируются в админке. Новая сущность = новая запись здесь:
 * список, форма, проверка и сохранение берутся из общих компонентов.
 */
const RELEASE_TYPES = ["Сингл", "EP", "Альбом", "Сборник"].map((v) => ({ value: v, label: v }));
const CONCERT_STATUSES = [
  { value: "published", label: "На сайте" },
  { value: "pending", label: "На модерации" },
  { value: "hidden", label: "Скрыт" }
];
const MERCH_STATUSES = [
  { value: "soon", label: "Скоро в продаже" },
  { value: "available", label: "В продаже" },
  { value: "sold_out", label: "Распродано" }
];
const REQUEST_STATUSES = [
  { value: "new", label: "Новая" },
  { value: "in_progress", label: "В работе" },
  { value: "done", label: "Обработана" },
  { value: "archived", label: "В архиве" }
];
const DOC_KINDS = [
  { value: "text", label: "Текст на странице «Документы»" },
  { value: "file", label: "Файл (PDF)" }
];
const MERCH_TYPES = ["Футболка", "Худи", "Лонгслив", "Свитшот", "Кепка", "Аксессуар", "Винил", "Постер"];

/** Откуда пришла запись — человеческим названием */
const SOURCE_LABEL = { deezer: "из Deezer", spotify: "из Spotify", youtube: "из YouTube", bandsintown: "из Bandsintown" };
const labelOf = (options, value) => options.find((o) => o.value === value)?.label ?? value;
const fmtDate = (iso) => (iso ? new Date(`${String(iso).slice(0, 10)}T12:00:00`).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" }) : "");
const fmtRub = (n) => (n == null ? "" : `${Number(n).toLocaleString("ru-RU")} ₽`);
const hiddenTag = (hidden) => (hidden ? [{ text: "Скрыт", tone: "muted" }] : []);
const draftTag = (published) => (published ? [{ text: "На сайте", tone: "ok" }] : [{ text: "Черновик", tone: "muted" }]);

export const RESOURCES = {
  releases: {
    key: "releases", table: "releases", idKey: "id", parent: "artist_slug",
    title: "Релизы", one: "релиз", add: "Добавить релиз",
    order: [["released_on", { ascending: false, nullsFirst: false }], ["sort"]],
    fields: [
      { name: "title", label: "Название", type: "text", required: true, max: 200, wide: true },
      { name: "artists", label: "Исполнители", type: "text", required: true, max: 300, hint: "Как на обложке: «Дора, OG Buda»", defaultFromArtist: true },
      { name: "type", label: "Тип", type: "select", options: RELEASE_TYPES, default: "Сингл" },
      { name: "released_on", label: "Дата выхода", type: "date", hint: "От неё зависит порядок: новые — первыми на главной" },
      { name: "cover", label: "Обложка", type: "image", image: { bucket: "artists", folder: (p) => `${p}/covers`, aspect: "1 / 1", min: 640, recommended: 1400 } },
      { name: "spotify", label: "Ссылка Spotify", type: "spotify", hint: "Альбом или трек: open.spotify.com/…" },
      { name: "preview", label: "Превью (mp3)", type: "url", hint: "Необязательно: 30-секундный отрывок для плеера" },
      { name: "hidden", label: "Скрыть с сайта", type: "checkbox" },
      { name: "sort", label: "Порядок при одинаковой дате", type: "number", default: 0 }
    ],
    summary: (r) => ({ title: r.title, meta: [r.type, fmtDate(r.released_on), r.artists].filter(Boolean).join(" · "), image: r.cover, tags: [...hiddenTag(r.hidden), ...(r.source && r.source !== "manual" ? [{ text: SOURCE_LABEL[r.source] ?? r.source }] : [])] }),
    quick: [{ label: (r) => (r.hidden ? "Показать" : "Скрыть"), patch: (r) => ({ hidden: !r.hidden }) }]
  },
  tracks: {
    key: "tracks", table: "tracks", idKey: "id", parent: "artist_slug",
    title: "Популярное", one: "трек", add: "Добавить трек",
    order: [["streams", { ascending: false }], ["popularity", { ascending: false, nullsFirst: false }]],
    filter: (q) => q.eq("in_chart", false),
    fields: [
      { name: "title", label: "Название", type: "text", required: true, max: 200, wide: true },
      { name: "artists", label: "Исполнители", type: "text", required: true, max: 300, defaultFromArtist: true },
      { name: "streams", label: "Прослушиваний", type: "number", default: 0, hint: "Число со Spotify; определяет место в списке" },
      { name: "cover", label: "Обложка", type: "image", image: { bucket: "artists", folder: (p) => `${p}/covers`, aspect: "1 / 1", min: 300, recommended: 640 } },
      { name: "spotify", label: "Ссылка Spotify", type: "spotify" },
      { name: "preview", label: "Превью (mp3)", type: "url" },
      { name: "hidden", label: "Скрыть с сайта", type: "checkbox" }
    ],
    summary: (r) => ({ title: r.title, meta: [r.artists, r.streams ? `${Number(r.streams).toLocaleString("ru-RU")} прослушиваний` : null].filter(Boolean).join(" · "), image: r.cover, tags: hiddenTag(r.hidden) }),
    quick: [{ label: (r) => (r.hidden ? "Показать" : "Скрыть"), patch: (r) => ({ hidden: !r.hidden }) }]
  },
  videos: {
    key: "videos", table: "videos", idKey: "id", parent: "artist_slug",
    title: "Клипы", one: "клип", add: "Добавить клип",
    order: [["published_at", { ascending: false, nullsFirst: false }], ["sort"]],
    fields: [
      { name: "youtube_id", label: "Ссылка на YouTube", type: "youtube", required: true, wide: true, hint: "Любая ссылка на ролик или его id" },
      { name: "title", label: "Название", type: "text", required: true, max: 200, wide: true },
      { name: "published_at", label: "Дата выхода", type: "date" },
      { name: "hidden", label: "Скрыть с сайта", type: "checkbox" },
      { name: "sort", label: "Порядок", type: "number", default: 0 }
    ],
    summary: (r) => ({ title: r.title, meta: fmtDate(r.published_at), image: r.youtube_id ? `https://i.ytimg.com/vi/${r.youtube_id}/mqdefault.jpg` : null, imageAspect: "16 / 9", tags: hiddenTag(r.hidden) }),
    quick: [{ label: (r) => (r.hidden ? "Показать" : "Скрыть"), patch: (r) => ({ hidden: !r.hidden }) }]
  },
  events: {
    key: "events", table: "events", idKey: "id", parent: "artist_slug",
    title: "Новости", one: "новость", add: "Добавить новость",
    order: [["date", { ascending: false }]],
    fields: [
      { name: "date", label: "Дата", type: "date", required: true },
      { name: "title", label: "Заголовок", type: "text", required: true, max: 200, wide: true },
      { name: "text", label: "Текст", type: "textarea", max: 2000, wide: true },
      { name: "image", label: "Картинка", type: "image", image: { bucket: "artists", folder: (p) => `${p}/news`, aspect: "4 / 3", min: 800, recommended: 1600 } }
    ],
    summary: (r) => ({ title: r.title, meta: fmtDate(r.date), image: r.image })
  },
  concerts: {
    key: "concerts", table: "concerts", idKey: "id", parent: "artist_slug",
    title: "Концерты", one: "концерт", add: "Добавить концерт",
    order: [["date"]],
    upcomingField: "date",
    fields: [
      { name: "artist_slug", label: "Артист", type: "artist", required: true, onlyGlobal: true },
      { name: "date", label: "Дата", type: "date", required: true },
      { name: "city", label: "Город", type: "text", required: true, max: 120 },
      { name: "venue", label: "Площадка", type: "text", max: 160 },
      { name: "ticket_url", label: "Ссылка на билеты", type: "url", wide: true },
      { name: "status", label: "Статус", type: "select", options: CONCERT_STATUSES, default: "published" }
    ],
    statusField: "status", statuses: CONCERT_STATUSES,
    summary: (r) => ({
      title: `${fmtDate(r.date)} · ${r.city}`, meta: [r.venue, r.ticket_url ? "есть билеты" : "без ссылки на билеты", r.source && r.source !== "manual" ? `источник: ${r.source}` : null].filter(Boolean).join(" · "),
      tags: [{ text: labelOf(CONCERT_STATUSES, r.status), tone: r.status === "published" ? "ok" : r.status === "pending" ? "warn" : "muted" }]
    }),
    quick: [
      { label: () => "Опубликовать", when: (r) => r.status !== "published", patch: () => ({ status: "published" }) },
      { label: () => "Скрыть", when: (r) => r.status !== "hidden", patch: () => ({ status: "hidden" }) }
    ]
  },
  merch: {
    key: "merch", table: "merch", idKey: "id", parent: "artist_slug", parentNullable: true,
    title: "Мерч", one: "вещь", add: "Добавить вещь",
    order: [["sort"], ["id"]],
    fields: [
      { name: "title", label: "Название", type: "text", required: true, max: 160, wide: true },
      { name: "artist_slug", label: "Чей мерч", type: "artist", nullLabel: "Rhymes Music (лейбл)", onlyGlobal: true },
      { name: "type", label: "Тип вещи", type: "text", required: true, max: 60, suggestions: MERCH_TYPES, default: "Футболка" },
      { name: "price", label: "Цена, ₽", type: "number", hint: "Пусто — цена не показывается" },
      { name: "status", label: "Статус", type: "select", options: MERCH_STATUSES, default: "soon" },
      { name: "buy_url", label: "Ссылка на покупку", type: "url", wide: true, hint: "Кнопка «Купить» появится при статусе «В продаже»" },
      { name: "image", label: "Главное фото", type: "image", image: { bucket: "merch", folder: () => "items", aspect: "4 / 5", min: 800, recommended: 1600 }, hint: "Лучше PNG без фона или на однотонном — на сайте фото стоит прямо на фоне страницы" },
      { name: "gallery", label: "Ещё фото", type: "gallery", image: { bucket: "merch", folder: () => "items", aspect: "4 / 5", min: 800, recommended: 1600 }, hint: "Детали, спина, на модели — листаются на странице вещи" },
      { name: "description", label: "Описание", type: "textarea", max: 3000, wide: true, hint: "Материал, посадка, принт — показывается на странице вещи" },
      { name: "sizes", label: "Размеры", type: "list", hint: "По одному на строку: S, M, L, XL" },
      { name: "published", label: "Показывать на сайте", type: "checkbox" },
      { name: "sort", label: "Порядок", type: "number", default: 0 }
    ],
    validate: [(f) => (f.status === "available" && !String(f.buy_url).trim() ? { buy_url: "Для статуса «В продаже» нужна ссылка на покупку" } : null)],
    summary: (r) => ({ title: r.title, meta: [r.type, fmtRub(r.price), labelOf(MERCH_STATUSES, r.status)].filter(Boolean).join(" · "), image: r.image, tags: draftTag(r.published) }),
    quick: [{ label: (r) => (r.published ? "Снять с сайта" : "Опубликовать"), patch: (r) => ({ published: !r.published }) }]
  },
  jobs: {
    key: "jobs", table: "jobs", idKey: "slug", textKey: { from: "title" },
    title: "Вакансии", one: "вакансию", add: "Добавить вакансию",
    order: [["sort"], ["title"]],
    fields: [
      { name: "title", label: "Должность", type: "text", required: true, max: 160, wide: true },
      { name: "slug", label: "Адрес страницы", type: "slug", required: true, keyField: true, hint: "/jobs/<адрес>; после создания не меняется" },
      { name: "dept", label: "Отдел", type: "text", required: true, max: 80 },
      { name: "place", label: "Где", type: "text", required: true, max: 80, hint: "Москва, удалённо…" },
      { name: "employment", label: "Занятость", type: "text", required: true, max: 80, hint: "Полная, проектная…" },
      { name: "salary", label: "Зарплата", type: "text", max: 120, default: "По итогам собеседования" },
      { name: "summary", label: "Коротко о вакансии", type: "textarea", required: true, max: 1000, wide: true },
      { name: "tasks", label: "Задачи", type: "list", wide: true, hint: "По одной на строку" },
      { name: "requirements", label: "Требования", type: "list", wide: true },
      { name: "nice_to_have", label: "Будет плюсом", type: "list", wide: true },
      { name: "offer", label: "Что предлагаем", type: "list", wide: true },
      { name: "published", label: "Показывать на сайте", type: "checkbox" },
      { name: "sort", label: "Порядок", type: "number", default: 0 }
    ],
    summary: (r) => ({ title: r.title, meta: [r.dept, r.place, r.employment].filter(Boolean).join(" · "), tags: draftTag(r.published) }),
    quick: [{ label: (r) => (r.published ? "Снять с сайта" : "Опубликовать"), patch: (r) => ({ published: !r.published }) }]
  },
  team: {
    key: "team", table: "team_members", idKey: "id", textKey: { from: "name" },
    title: "Команда", one: "человека", add: "Добавить человека",
    order: [["sort"], ["name"]],
    fields: [
      { name: "name", label: "Имя", type: "text", required: true, max: 120, wide: true },
      { name: "id", label: "Идентификатор", type: "slug", required: true, keyField: true, hint: "Латиницей, после создания не меняется" },
      { name: "role", label: "Должность", type: "text", required: true, max: 120 },
      { name: "dept", label: "Отдел", type: "text", required: true, max: 80 },
      { name: "photo_url", label: "Фото", type: "image", image: { bucket: "artists", folder: () => "team", aspect: "1 / 1", min: 600, recommended: 1200 } },
      { name: "published", label: "Показывать на сайте", type: "checkbox" },
      { name: "sort", label: "Порядок", type: "number", default: 0 }
    ],
    summary: (r) => ({ title: r.name, meta: [r.role, r.dept].filter(Boolean).join(" · "), image: r.photo_url, tags: draftTag(r.published) }),
    quick: [{ label: (r) => (r.published ? "Снять с сайта" : "Опубликовать"), patch: (r) => ({ published: !r.published }) }]
  },
  pages: {
    key: "pages", table: "pages", idKey: "slug", textKey: { from: "title" },
    title: "Документы", one: "документ", add: "Добавить документ",
    order: [["sort"], ["title"]],
    stampUpdatedAt: true,
    fields: [
      { name: "title", label: "Название", type: "text", required: true, max: 200, wide: true },
      { name: "kind", label: "Что это", type: "select", options: DOC_KINDS, default: "text" },
      { name: "slug", label: "Адрес", type: "slug", required: true, keyField: true, hint: "Латиницей; после создания не меняется" },
      { name: "body", label: "Текст", type: "markdown", required: true, max: 100000, wide: true,
        showIf: (f) => f.kind === "text", hiddenValue: "", hint: "## заголовок, ### подзаголовок, «- » список, **жирный**, [ссылка](https://…)" },
      { name: "file_url", label: "Файл", type: "file", required: true, showIf: (f) => f.kind === "file", hiddenValue: null,
        file: { bucket: "docs", folder: "files", accept: "application/pdf", maxMB: 20 }, hint: "PDF до 20 МБ" },
      { name: "show_in_footer", label: "Ссылка в футере сайта", type: "checkbox", default: true },
      { name: "published", label: "Показывать на сайте", type: "checkbox", default: true },
      { name: "sort", label: "Порядок", type: "number", default: 0, hint: "Меньше — выше на странице и левее в футере" }
    ],
    summary: (r) => ({
      title: r.title,
      meta: [r.kind === "file" ? "Файл" : `Текст · /legal#${r.slug}`, r.show_in_footer ? "в футере" : null, `изменён ${fmtDate(r.updated_at)}`].filter(Boolean).join(" · "),
      tags: draftTag(r.published)
    }),
    quick: [{ label: (r) => (r.published ? "Скрыть" : "Показать"), patch: (r) => ({ published: !r.published }) }]
  },
  bookings: {
    key: "bookings", table: "booking_requests", idKey: "id", noCreate: true,
    title: "Заявки на букинг", one: "заявку",
    order: [["created_at", { ascending: false }]],
    statusField: "status", statuses: REQUEST_STATUSES,
    fields: [
      { name: "contact_name", label: "Имя", type: "text", readOnly: true },
      { name: "contact", label: "Контакт", type: "text", readOnly: true },
      { name: "artists", label: "Артисты", type: "text", readOnly: true, wide: true },
      { name: "format", label: "Формат", type: "text", readOnly: true },
      { name: "city", label: "Город", type: "text", readOnly: true },
      { name: "date", label: "Дата события", type: "text", readOnly: true },
      { name: "capacity", label: "Вместимость", type: "text", readOnly: true },
      { name: "comment", label: "Комментарий", type: "textarea", readOnly: true, wide: true },
      { name: "status", label: "Статус", type: "select", options: REQUEST_STATUSES, default: "new" },
      { name: "admin_note", label: "Заметка менеджера", type: "textarea", max: 2000, wide: true, hint: "Видна только в админке" }
    ],
    summary: (r) => ({
      title: `${r.contact_name} · ${r.city}`, meta: [fmtDate(r.created_at), r.artists, r.contact].filter(Boolean).join(" · "),
      tags: [{ text: labelOf(REQUEST_STATUSES, r.status), tone: r.status === "new" ? "warn" : r.status === "done" ? "ok" : "muted" }]
    }),
    quick: [{ label: () => "В работу", when: (r) => r.status === "new", patch: () => ({ status: "in_progress" }) }, { label: () => "Обработана", when: (r) => r.status !== "done", patch: () => ({ status: "done" }) }]
  },
  demos: {
    key: "demos", table: "demo_submissions", idKey: "id", noCreate: true,
    title: "Демо", one: "демо",
    order: [["created_at", { ascending: false }]],
    statusField: "status", statuses: REQUEST_STATUSES,
    fields: [
      { name: "artist_name", label: "Артист", type: "text", readOnly: true },
      { name: "city", label: "Город", type: "text", readOnly: true },
      { name: "track_url", label: "Трек", type: "url", readOnly: true, wide: true },
      { name: "socials", label: "Соцсети", type: "text", readOnly: true, wide: true },
      { name: "about", label: "О себе", type: "textarea", readOnly: true, wide: true },
      { name: "contact", label: "Контакт", type: "text", readOnly: true },
      { name: "status", label: "Статус", type: "select", options: REQUEST_STATUSES, default: "new" },
      { name: "admin_note", label: "Заметка менеджера", type: "textarea", max: 2000, wide: true }
    ],
    summary: (r) => ({
      title: `${r.artist_name}${r.city ? ` · ${r.city}` : ""}`, meta: [fmtDate(r.created_at), r.contact].filter(Boolean).join(" · "),
      tags: [{ text: labelOf(REQUEST_STATUSES, r.status), tone: r.status === "new" ? "warn" : r.status === "done" ? "ok" : "muted" }]
    }),
    quick: [{ label: () => "В работу", when: (r) => r.status === "new", patch: () => ({ status: "in_progress" }) }, { label: () => "Обработана", when: (r) => r.status !== "done", patch: () => ({ status: "done" }) }]
  }
};

/** Разделы карточки артиста, которые редактируются через общий список */
export const ARTIST_TABS = ["releases", "tracks", "videos", "events", "concerts", "merch"];
