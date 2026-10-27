/*
 * Локальные данные сайта (seed). При подключённом Supabase всё читается из базы
 * (src/lib/api.js), а этот файл заливается туда скриптом scripts/seed.mjs.
 * Тексты переписаны своими словами; медиа — официальные материалы лейбла,
 * в продакшене переезжают в Supabase Storage.
 */
import { OFFICIAL } from "./official.js";

const RM = "https://rhymesmusic.ru/photos/1/";
const img = (path) => encodeURI(RM + path);
const cover = (id) => `https://i.scdn.co/image/ab67616d0000b273${id}`;
/** Обложка из каталога Deezer, 1000×1000 */
const dz = (hash) => `https://cdn-images.dzcdn.net/images/cover/${hash}/1000x1000-000000-80-0-0.jpg`;
const CID_POP = "778671c82f044a72a2ca0db89b48f6e6";
const CID_REL = "63c2afc662c3448eb988db2083a8365b";
const preview = (id, cid = CID_POP) => `https://p.scdn.co/mp3-preview/${id}?cid=${cid}`;

export const LABEL = {
  name: "Rhymes Music",
  since: 2011,
  palette: ["#f5e52a", "#ff2e88", "#5cc8ff"],
  intro:
    "Международный лейбл из пятёрки крупнейших музыкальных издателей России. С 2011 года находим артистов, выпускаем их музыку и выводим её на главные сцены и площадки.",
  stats: [
    { value: 500, suffix: "+", label: "подписанных артистов" },
    { value: 20000, suffix: "+", label: "опубликованных треков" },
    { value: 1, suffix: " млрд+", label: "прослушиваний каждый месяц" },
    { value: 150, suffix: "+", label: "платиновых сертификаций" },
    { value: 400, suffix: "+", label: "золотых сертификаций" },
    { value: 1000, suffix: "+", label: "треков в топ-чартах" }
  ],
  services: [
    {
      title: "Маркетинг релизов",
      text: "Продвигаем премьеры на стримингах, в медиа, на радио и ТВ, работаем с блогерами, ведём таргет, посевы и соцсети артиста до, во время и после выхода релиза.",
      facts: ["Spotify, Apple Music, VK Музыка, Яндекс Музыка, YouTube"]
    },
    {
      title: "Видеопродакшн",
      text: "Полный цикл упаковки релиза: идея и сценарий, съёмка фото и видео, монтаж и постпродакшн.",
      facts: ["Клипы, тизеры, фотосессии"]
    },
    {
      title: "Концертные туры",
      text: "Продаём туры, клубные шоу и частные выступления артистов лейбла по Европе и СНГ.",
      facts: ["800+ организаторов в базе", "150 туров с 2011 года", "100+ млн рублей выступлений в год"]
    },
    {
      title: "Интеграции с брендами",
      text: "Ведём переговоры с брендами и сопровождаем рекламные контракты: продакт-плейсмент в клипах, на концертах и в соцсетях.",
      facts: ["Клипы, концерты, соцсети"]
    },
    {
      title: "Мерч",
      text: "Делаем мерч под ключ: дизайн, производство у проверенных подрядчиков и доставка покупателям.",
      facts: ["От эскиза до отгрузки"]
    }
  ],
  contacts: [
    { email: "office@rhymesmusic.com", label: "Общие вопросы" },
    { email: "sales@rhymesmusic.com", label: "Выступления, реклама, интеграции, лицензирование" },
    { email: "demo@rhymesmusic.com", label: "Демозаписи" },
    { email: "hr@rhymesmusic.com", label: "Работа в Rhymes Music" }
  ],
  socials: [
    { name: "YouTube", url: "https://www.youtube.com/channel/UCFhgVi8XKK8yZ1kEJa4vrhw" },
    { name: "SoundCloud", url: "https://soundcloud.com/rhymes_music" },
    { name: "VK", url: "https://vk.com/rhymesmusic" }
  ],
  // Этот сайт — на русском; другие языки ведут на официальные сайты лейбла
  locales: [
    { code: "ru", name: "Русский", url: "https://rhymesmusic.ru" },
    { code: "en", name: "English", url: "https://rhymesmusic.com" },
    { code: "pt", name: "Português", url: "https://rhymeslatin.com" },
    { code: "es", name: "Español", url: "https://rhymesmusica.com" }
  ]
};

const BASE_ARTISTS = [
  {
    slug: "dora",
    name: "Дора",
    tagline: "Кьют-рок принцесса",
    bio: "Главное лицо русского кьют-рока: Дарья Шиханова сделала жанр массовым. В её музыке встречаются поп-рок, мягкий панк и поп, ностальгия по нулевым и много аниме-эстетики.",
    photo: img("section-2/-к-дора4.jpg"),
    palette: ["#ff7eb6", "#b69cff", "#ffd6ec"],
    socials: [
      { name: "TikTok", url: "https://www.tiktok.com/@mentaldora" },
      { name: "Instagram", url: "https://www.instagram.com/mentaldora" },
      { name: "VK", url: "https://vk.com/babydori" },
      { name: "YouTube", url: "https://www.youtube.com/channel/UCae-zZkho0dkoQ5Z_NJhpeg" }
    ],
    // released_on и обложки новых релизов — из публичного каталога Deezer (лейбл: Streaming Club / Rhymes Music)
    releases: [
      { title: "Верю", artists: "Дора", type: "Сингл", cover: dz("401674d6069e46d40c3547ba9187b964"), released_on: "2026-08-21" },
      { title: "ЗНАК", artists: "Toxi$, Дора", type: "Сингл", cover: dz("4cd95a65c2525bd01c905199bbef851a"), released_on: "2026-07-24" },
      { title: "Million Dollar Baby", artists: "Дора", type: "Сингл", cover: dz("6a251dd3f52e2bf494b89b48e343bbde"), released_on: "2026-06-05" },
      { title: "лонли лав", artists: "Дора", type: "Сингл", cover: dz("dc82b3f0c9d6e68dba269bdee14eac3e"), released_on: "2026-03-20" },
      { title: "Понарошку", artists: "Дора", type: "Сингл", cover: dz("f3c8ca3fab7bbe6f9195e1ed4198c57a"), released_on: "2025-11-21" },
      { title: "Кабы не было зимы", artists: "Дора", type: "Сингл", cover: dz("c6d70bdb4305cfaae677696678f19737"), released_on: "2025-11-20" },
      { title: "Дурочка", artists: "Дора", type: "Сингл", cover: dz("89fcac44d2f0ddcd1ea3c9a2f24ba3e7"), released_on: "2025-10-17" },
      { title: "ЁК", artists: "Дора", type: "Сингл", cover: dz("0b3c66fc0ef6f8bf405c05a14ecf8125"), released_on: "2025-01-31" },
      { title: "LOVESONGS", artists: "Дора", type: "Альбом", cover: dz("16b2600d2fd21e35192ac97ca0fd61dd"), released_on: "2024-10-18" },
      { title: "Лучше тебя", artists: "Дора", type: "Сингл", cover: dz("6947ec96f54a174093d700ed04071784"), released_on: "2024-10-11" },
      { title: "Папик", artists: "Дора", type: "Сингл", cover: cover("d76137707e516ab4db1aa712"), preview: preview("c3b258851a18fdd3c0cbadf582b37ab23a2ef8ec", "9f8dbb1747904fbca4eb9c7989c4339d"), spotify: "track/6g20mMUFO4sQ3RqPS3Ovgw", released_on: "2023-06-09" },
      { title: "MISS", artists: "Дора", type: "Альбом", cover: img("каталог артистов/дора/-дора-мисс.jpg"), preview: preview("ccab75b4b36e770acff7aa2ab8176eb58f4d7558", CID_REL), spotify: "album/2umHPKn2Mggn9RUqT8beQy", released_on: "2022-06-03" },
      { title: "Капли", artists: "Дора, OG Buda", type: "Сингл", cover: img("каталог артистов/дора/-дора-капли.jpg"), preview: preview("d209b3fc57f18a8d3618f71fa2c80d131ad085e8", CID_REL), spotify: "track/0LwPFTgtNaQrfyWHM42Z83", released_on: "2022-01-01" },
      { title: "Барбисайз", artists: "Дора, Мэйби Бэйби", type: "Сингл", cover: img("каталог артистов/дора/-дора-барбисайз.jpg"), preview: preview("835aa32108cf6be99fb5fd9de71ae30084fb34d8", CID_REL), spotify: "album/3ONBhOKlsQ6MTyaWlM7EJE", released_on: "2021-01-01" },
      { title: "Сан Ларан", artists: "Платина, Дора", type: "Сингл", cover: img("каталог артистов/дора/-дора-сан.jpg"), preview: preview("387098b216e543eb169e692382e20b26f78c5c09", CID_REL), spotify: "album/1y2MhUt42DWBSvILa23KV6", released_on: "2021-01-01" },
      { title: "Боже, храни кьют-рок", artists: "Дора", type: "Альбом", cover: img("каталог артистов/дора/-дора-боже.jpg"), preview: preview("e166caa84fa5e1e8128e013480db9f2c71ac0b38", CID_REL), spotify: "album/7hDvB29vtfPYypzxaxnMpT", released_on: "2020-12-18" },
      { title: "Младшая сестра", artists: "Дора", type: "Альбом", cover: img("каталог артистов/дора/-дора-сестра.jpg"), preview: preview("0103cdece3391025a69802e5bd22094bb20ea170", CID_REL), spotify: "album/6VGOayoZVPmoySlmKiybdP", released_on: "2019-11-08" }
    ],
    popular: [
      { title: "Дорадура", artists: "Дора", streams: 28256972, cover: cover("8d6cfb51c637bcde3009326b"), preview: preview("f6fb99e5759ffb1bdd9238fd4cf9e383e7676f74") },
      { title: "Втюрилась", artists: "Дора", streams: 26282019, cover: cover("c9c6ffa3829ecebc9a0cd7d0"), preview: preview("3600939d7ca0c78e2d01fab0412f94f2674cd0ed") },
      { title: "Барбисайз", artists: "Дора, Мэйби Бэйби", streams: 15585776, cover: cover("53d8140de43903c9248ceb6d"), preview: preview("91e797c50169b3e627e14f108a6715087a41672c") },
      { title: "Сан Ларан", artists: "Платина, Дора", streams: 15560153, cover: cover("ae085ccbb23ac58787e6967b"), preview: preview("4438b596b7511e2cc1801b7b0d69b489a7151687") },
      { title: "Младшая сестра", artists: "Дора", streams: 13136190, cover: cover("8d6cfb51c637bcde3009326b"), preview: preview("f08315fbe968d910cd99850d758a3802362f73") },
      { title: "Осень пьяная", artists: "Дора", streams: 6235045, cover: cover("c9c6ffa3829ecebc9a0cd7d0"), preview: preview("030fd749f7fa78831f492a1f0081d6469390fcd7") },
      { title: "Капли", artists: "OG Buda, Дора", streams: 4292693, cover: cover("74dd7c29ffd01a609af4ca1c"), preview: preview("a21cba70820a524100d389c1fe7e12d13acc9c7e") },
      { title: "Нет тебя", artists: "Дора, ЛСП", streams: 1835766, cover: cover("53d8140de43903c9248ceb6d"), preview: preview("b96735314e6c4748736a281888e65dd9ed36775f") },
      { title: "Я боюсь людей", artists: "Дора", streams: 1423151, cover: cover("53d8140de43903c9248ceb6d"), preview: preview("9ac5a4fa039202cdd195aeb290ad07bb552ae52b") },
      { title: "Папик", artists: "Дора, Yanix", streams: 649389, cover: cover("d76137707e516ab4db1aa712"), preview: preview("c3b258851a18fdd3c0cbadf582b37ab23a2ef8ec") }
    ],
    videos: [
      { id: "54lMZDH5kHQ", title: "Я боюсь людей" },
      { id: "8Zn89VJ01jQ", title: "Loverboy" },
      { id: "aCtUc6t1w_A", title: "Барбисайз" },
      { id: "FAAM7wdtXmg", title: "Втюрилась" },
      { id: "WNadEfGnV04", title: "Дорадура" },
      { id: "zVZr6h_2q1o", title: "Осень пьяная" },
      { id: "G49ti_aljdk", title: "Не игра" }
    ],
    events: [
      { date: "2022-06-03", title: "MISS на первом месте", text: "Меньше чем за сутки альбом возглавил топ Apple Music среди русскоязычных альбомов, набрал больше миллиона прослушиваний в VK и завёл в чарт VK Музыки восемь треков.", image: img("релизы/-дора-мисс-эпол.jpg") },
      { date: "2022-05-24", title: "«Я боюсь людей» в чартах", text: "Новый трек попал на обложку плейлиста «Уже в чарте» на Яндекс Музыке.", image: img("релизы/-дора-яндекс01.jpg") },
      { date: "2022-02-18", title: "Лицо Spotify EQUAL", text: "Дора стала лицом кампании Spotify EQUAL в Нью-Йорке, которая поддерживает женщин в музыкальной индустрии.", image: img("релизы/-дора-ник.jpg") },
      { date: "2021-11-08", title: "«Младшей сестре» два года", text: "Официальный плейлист альбома в VK приближается к семи миллионам прослушиваний, а пластинка не раз входила в списки лучших альбомов года.", image: img("релизы/-8-11-21-дора.jpg") },
      { date: "2021-11-02", title: "Анонс нового альбома", text: "Дора рассказала, что новый альбом будет жанрово разным: она больше не хочет держаться рамок одного звучания.", image: img("релизы/-2-11-21-дора.jpeg") }
    ]
  },
  {
    slug: "deti-rave",
    name: "Дети Rave",
    tagline: "Качает",
    bio: "Танцевальный проект Ильи Буркова: рейв, который работает и в наушниках, и на большой сцене.",
    photo: img("каталог артистов/дети рейв/-deti-c44.png"),
    palette: ["#39ff88", "#4d6bff", "#ff2e88"],
    socials: [
      { name: "TikTok", url: "https://www.tiktok.com/@deti.rave" },
      { name: "Instagram", url: "https://www.instagram.com/deti.rave/" },
      { name: "VK", url: "https://vk.com/detirave" },
      { name: "YouTube", url: "https://www.youtube.com/user/molodoyboy" }
    ],
    releases: [
      { title: "DAWAI", artists: "Дети Rave", type: "Сингл", cover: cover("04d223022853add17a5fb1bf"), spotify: "track/2MDj0dSs1EpeOywVL5e6Oz" },
      { title: "THERAPIA", artists: "Дети Rave", type: "Альбом", cover: img("каталог артистов/дети рейв/-терапия.jpg"), spotify: "album/4FTgl6DiDr7eZ7QKT5q6V5" },
      { title: "Качает", artists: "Дети Rave", type: "Сингл", cover: img("каталог артистов/дети рейв/-дети-качает.jpg"), spotify: "album/11b4XIQqkXeOhqGaZ4GOfr" },
      { title: "FANAT", artists: "Дети Rave", type: "Сингл", cover: img("каталог артистов/дети рейв/-дети-фанат.jpg"), spotify: "album/0aFIu4jlmKD98bkuRBde6w" },
      { title: "Фая", artists: "Дети Rave", type: "Сингл", cover: img("каталог артистов/дети рейв/-дети-фая.jpg"), spotify: "album/6KNReuWyWXfDshdv0pwuY1" },
      { title: "13 способов как начать", artists: "Дети Rave", type: "Альбом", cover: img("каталог артистов/дети рейв/-дети-13.jpg"), spotify: "album/7aj1A7ItFH28MbHPlJ0p9K" },
      { title: "Турбо пушка", artists: "Дети Rave", type: "Сингл", cover: img("каталог артистов/дети рейв/-дети-турбо.jpg"), spotify: "album/5yGC3jz5v0KUVlZYo6VoEI" }
    ],
    popular: [
      { title: "Турбо пушка", artists: "Дети Rave", streams: 21711406, cover: cover("3a2a28eadcf8cb132c4c3ec1"), spotify: "album/5yGC3jz5v0KUVlZYo6VoEI" },
      { title: "Икры и Сала", artists: "Дети Rave", streams: 16466627, cover: cover("96918f74070cc6337e9e8304") },
      { title: "LOVE ON RAVE", artists: "Дети Rave", streams: 8146082, cover: cover("c8337cc228d811158898313f") }
    ]
  },
  {
    slug: "maybe-baby", name: "Мэйби Бэйби",
    bio: "Начинала в трио «Френдзона», которое в 2018 году стало одним из главных явлений для молодой аудитории. Сольно продолжает ту же линию: яркий визуал, мультяшная эстетика и собственная мифология.",
    palette: ["#c56bff", "#ff8ad8", "#5cc8ff"]
  },
  { slug: "mukka", name: "МУККА", palette: ["#7fd1ff", "#3d5bff", "#e8f6ff"] },
  {
    slug: "betsi", name: "Betsy", tagline: "Sigma Boy", palette: ["#ff8ad8", "#f5e52a", "#5cc8ff"],
    popular: [
      { title: "Simple dimpl pop it squish", artists: "M&A, Betsy", streams: 12605403, cover: cover("06ecedd7e1b733d7db2bcfad") },
      { title: "Capybara", artists: "Сто-Личный Она-Нас, Betsy", streams: 8887545, cover: cover("78bb123297049060d11b95a2") },
      { title: "Pump It Up", artists: "Betsy", streams: 379207 },
      { title: "GOLD APPLE", artists: "M&A, Betsy", streams: 157642 }
    ]
  },
  { slug: "by-indiya", name: "By Индия", palette: ["#ff6a00", "#ffd23f", "#ff2e88"] },
  { slug: "finik", name: "FINIK", palette: ["#5cc8ff", "#39ff88", "#ffffff"] },
  {
    slug: "gunwest", name: "Ганвест", photo: img("главная/person7.jpg"), palette: ["#f5e52a", "#ff6a00", "#ffffff"],
    popular: [
      { title: "Нирвана", artists: "Ганвест", streams: 5978105 },
      { title: "FENDI2", artists: "Ганвест", streams: 3828363 },
      { title: "Ты такая GLE", artists: "Ганвест", streams: 2023358 },
      { title: "На рахате", artists: "Ганвест", streams: 1836705 },
      { title: "Ночная река", artists: "Ганвест", streams: 958800 }
    ]
  },
  { slug: "xassa", name: "XASSA", photo: img("главная/-гл-хасса.jpg"), palette: ["#5cc8ff", "#ffffff", "#8a5cff"] },
  { slug: "bodiev", name: "BODIEV", photo: img("главная/-гл-бодиев.jpg"), palette: ["#ffb347", "#ff2e2e", "#ffffff"] },
  { slug: "aleks-ataman", name: "Aleks Ataman", palette: ["#ffb347", "#ffffff", "#5cc8ff"] },
  { slug: "dlb", name: "DLB", palette: ["#ff2e2e", "#ffffff", "#ffb347"] },
  {
    slug: "polmateri", name: "Полматери", tagline: "Молодёжная образовательная рок-группировка", palette: ["#b69cff", "#5cc8ff", "#ffffff"],
    popular: [
      { title: "маша", artists: "Полматери", streams: 6167720 },
      { title: "мне похуй я панк", artists: "Полматери", streams: 5182409 },
      { title: "нам канец!", artists: "Полматери", streams: 5060317 },
      { title: "я неудачник", artists: "Полматери", streams: 4320770 },
      { title: "хочу сдохнуть", artists: "Полматери", streams: 4214944 }
    ]
  },
  { slug: "lxner", name: "LXNER", palette: ["#8a5cff", "#ff2e88", "#5cc8ff"] },
  { slug: "ivan-valeev", name: "Ivan Valeev", palette: ["#ffd23f", "#ff8ad8", "#ffffff"] },
  {
    slug: "quiizzzmeow", name: "quiizzzmeow", palette: ["#39ff88", "#c56bff", "#5cc8ff"],
    popular: [
      { title: "Крышу сносит", artists: "LXNER, quiizzzmeow", streams: 5392152 },
      { title: "Alohadance (Remix)", artists: "quiizzzmeow", streams: 4958917 },
      { title: "Слышу как ты дышишь", artists: "Midix, quiizzzmeow", streams: 4237022 },
      { title: "JDM NFS", artists: "shadowraze, quiizzzmeow, Midix, jzxdx", streams: 1949449 }
    ]
  },
  {
    slug: "pyrokinesis", name: "pyrokinesis", palette: ["#ff5a1f", "#c4120f", "#ffb347"],
    popular: [
      { title: "Чёрное солнышко", artists: "pyrokinesis", streams: 3738158 },
      { title: "ОКО", artists: "pyrokinesis", streams: 2257021 },
      { title: "отказываю небу", artists: "pyrokinesis", streams: 1911797 }
    ]
  },
  { slug: "kis-kis", name: "кис-кис", photo: img("главная/person4.png"), palette: ["#ff3d9a", "#f5e52a", "#ffffff"] },
  { slug: "sqwoz-bab", name: "SQWOZ BAB", photo: img("главная/person6.png"), palette: ["#39ff88", "#f5e52a", "#ffffff"] },
  { slug: "loren", name: "Лорэн", palette: ["#9fe7ff", "#c56bff", "#ffffff"] },
  { slug: "xmax", name: "XMAX", palette: ["#8fd16a", "#ffd23f", "#ffffff"] },
  {
    slug: "aikko", name: "AIKKO", palette: ["#00e0c6", "#ff6a00", "#ffffff"],
    bio: "Владислав Кособуцкий родом из Бобруйска, сейчас живёт в Санкт-Петербурге. Музыкой занимается больше десяти лет, начинал в коллективе «КаждаяБарбиСтерва». Сам не привязывает себя к одному жанру: в его треках встречаются рэп, альтернатива и рок."
  },
  {
    slug: "playingtheangel", name: "playingtheangel", palette: ["#ffffff", "#ff2e2e", "#b69cff"],
    bio: "Молодой артист из Красноярска со своей узнаваемой манерой исполнения. В 2026 году объездил страну с туром «Любовь побеждает смерть» в поддержку нового альбома."
  },
  { slug: "kvestar", name: "KVESTAR", palette: ["#f5e52a", "#8a5cff", "#ffffff"] },
  { slug: "4etvergov", name: "4etvergov", palette: ["#ffffff", "#5cc8ff", "#ffb347"] },
  { slug: "smysla-net", name: "Смысла.net", palette: ["#ff6a00", "#c4120f", "#ffb347"] },
  { slug: "ruslan-utyug", name: "Руслан Утюг", palette: ["#9fb7ff", "#ffffff", "#c56bff"] },
  { slug: "navernoe-radost", name: "Наверное Радость", palette: ["#5cc8ff", "#3d5bff", "#ffffff"] },
  { slug: "pokrapiva", name: "Pokrapiva", palette: ["#ff2e2e", "#ffb347", "#ff2e88"] },
  { slug: "voobrazhaemaya-lyubov", name: "Воображаемая любовь", palette: ["#ffd23f", "#5cc8ff", "#ffffff"] },
  { slug: "the-meto", name: "The Meto", palette: ["#5cc8ff", "#ff2e2e", "#ffffff"] }
];

const has = (list) => Array.isArray(list) && list.length > 0;
const titleKey = (t) => t.title.toLowerCase().replace(/ё/g, "е").replace(/[^a-zа-я0-9()]+/g, "");
const byStreams = (a, b) => (b.streams || 0) - (a.streams || 0);

/**
 * Дополняет артиста данными с официального сайта лейбла (official.js):
 * заполняет только пустые поля, популярные треки объединяет без дублей по названию.
 */
function withOfficial(artist) {
  const o = OFFICIAL[artist.slug];
  if (!o) return artist;
  const seen = new Set((artist.popular ?? []).map(titleKey));
  return {
    ...artist,
    tagline: artist.tagline ?? o.tagline,
    bio: artist.bio ?? o.bio,
    photo: artist.photo ?? o.photo,
    socials: has(artist.socials) ? artist.socials : o.socials,
    releases: has(artist.releases) ? artist.releases : o.releases,
    popular: [...(artist.popular ?? []), ...(o.popular ?? []).filter((t) => !seen.has(titleKey(t)))].sort(byStreams),
    videos: has(artist.videos) ? artist.videos : o.videos,
    events: has(artist.events) ? artist.events : o.events
  };
}

export const ARTISTS = BASE_ARTISTS.map(withOfficial);


/* Чарт лейбла, Spotify streams */
export const CHART = [
  { title: "АУФ", artists: "SQWOZ BAB, The First Station", streams: 36607797, cover: cover("2135cf3c617ad707790a6e27") },
  { title: "Лёд", artists: "WENARO, LXNER", streams: 32342467, cover: cover("761776ec62c9f8a6be00a244") },
  { title: "Никотин", artists: "Ганвест", streams: 31552351, cover: cover("cbd3cfe8896a92b75e60190f") },
  { title: "Дорадура", artists: "Дора", streams: 28256972, cover: cover("8d6cfb51c637bcde3009326b"), preview: preview("f6fb99e5759ffb1bdd9238fd4cf9e383e7676f74") },
  { title: "Втюрилась", artists: "Дора", streams: 26282019, cover: cover("c9c6ffa3829ecebc9a0cd7d0"), preview: preview("3600939d7ca0c78e2d01fab0412f94f2674cd0ed") },
  { title: "Aomine Daiki", artists: "quiizzzmeow", streams: 23901389, cover: cover("5858c3d5d5c9e5caac22563e") },
  { title: "Турбо пушка", artists: "Дети Rave", streams: 21711406, cover: cover("3a2a28eadcf8cb132c4c3ec1"), spotify: "album/5yGC3jz5v0KUVlZYo6VoEI" },
  { title: "молчи", artists: "кис-кис", streams: 19939080, cover: cover("4f3f5d5f45efd63d003ffbc2") },
  { title: "adaptive strike", artists: "shadowraze, LXNER, quiizzzmeow", streams: 18447406, cover: cover("aafe4598bce4d31fca0a51b2") },
  { title: "Novella", artists: "Ivan Valeev", streams: 18446982, cover: cover("67ced6ad46e68128380bdd49") },
  { title: "Икры и Сала", artists: "Дети Rave", streams: 16466627, cover: cover("96918f74070cc6337e9e8304") },
  { title: "Барбисайз", artists: "Дора, Мэйби Бэйби", streams: 15585776, cover: cover("53d8140de43903c9248ceb6d"), preview: preview("91e797c50169b3e627e14f108a6715087a41672c") },
  { title: "Сан Ларан", artists: "Платина, Дора", streams: 15560153, cover: cover("ae085ccbb23ac58787e6967b"), preview: preview("4438b596b7511e2cc1801b7b0d69b489a7151687") },
  { title: "Ананасовый сироп", artists: "Natan, Ганвест", streams: 14840097, cover: cover("02cad37bb1e3e2ae68fae02a") },
  { title: "Кайфули", artists: "Ганвест", streams: 14255981, cover: cover("02cad37bb1e3e2ae68fae02a") },
  { title: "ОЙ", artists: "SQWOZ BAB", streams: 13154746, cover: cover("74bb88b30dda820a91ede446") },
  { title: "Младшая сестра", artists: "Дора", streams: 13136190, cover: cover("8d6cfb51c637bcde3009326b"), preview: preview("f08315fbe968d910cd99850d758a3802362f73") },
  { title: "Диалоги тет-а-тет", artists: "Aleks Ataman, FINIK", streams: 11682031, cover: cover("b778d5b71e0636644b378b44") },
  { title: "мальчик", artists: "кис-кис", streams: 11526829, cover: cover("4f3f5d5f45efd63d003ffbc2") },
  { title: "ярче звёзд", artists: "Полматери", streams: 11323636, cover: cover("2f093ad573ee3d6ea2b6ff69") },
  { title: "сети", artists: "quiizzzmeow", streams: 10880298, cover: cover("c0009ad7c2bb2707dc369765") },
  { title: "Крузак 200", artists: "BODIEV", streams: 9726980, cover: cover("9f8414317ee1ffa081c58207") },
  { title: "LOVE ON RAVE", artists: "Дети Rave", streams: 8146082, cover: cover("c8337cc228d811158898313f") }
];

/*
 * Ближайшие концерты, осень 2026. Даты собраны из открытых билетных сервисов
 * (Яндекс Афиша, агрегаторы): перед публикацией их нужно сверить с лейблом.
 * Если прямой ссылки на продажу нет, «Билеты» ведут на поиск в Яндекс Афише.
 */
const ticketSearch = (artist, city) => `https://afisha.yandex.ru/search?text=${encodeURIComponent(`${artist} ${city}`)}`;

const TOURS = [
  {
    slug: "dora",
    name: "Дора",
    dates: [
      ["2026-11-13", "Москва", "Duplex"],
      ["2026-11-15", "Саратов", "Onyx"],
      ["2026-11-26", "Тюмень", "Глав клуб"],
      ["2026-11-27", "Челябинск", "Максимилианс"],
      ["2026-12-01", "Уфа", "Огни Уфы"],
      ["2026-12-04", "Нижний Новгород", "Milo Concert Hall"],
      ["2026-12-05", "Тула", "Mini by Concert Hall"],
      ["2026-12-06", "Рязань", "Руки Вверх! Бар"],
      ["2026-12-17", "Киров", "Gaudi"],
      ["2026-12-19", "Ижевск", "Nobel Concert Hall"],
      ["2026-12-20", "Пермь", "Свобода"]
    ]
  },
  {
    slug: "pyrokinesis",
    name: "Pyrokinesis",
    dates: [
      ["2026-11-03", "Москва", "ЦСКА Арена"],
      ["2026-11-22", "Санкт-Петербург", "Юбилейный"]
    ]
  },
  {
    slug: "aikko",
    name: "Aikko",
    dates: [
      ["2026-10-24", "Санкт-Петербург", "Factory 3", "https://afisha.yandex.ru/saint-petersburg/concert/aikko-2026-10"],
      ["2026-11-01", "Москва", "Свобода", "https://afisha.yandex.ru/moscow/concert/aikko-2026-11"]
    ]
  }
];

export const CONCERTS = TOURS.flatMap(({ slug, name, dates }) =>
  dates.map(([date, city, venue, url]) => ({
    id: `${slug}-${date}`,
    artist_slug: slug,
    date,
    city,
    venue,
    ticket_url: url ?? ticketSearch(name, city)
  }))
).sort((a, b) => a.date.localeCompare(b.date));

/* ---------- Мерч (демо-позиции: реальный каталог ведётся в админке) ---------- */
export const MERCH = [
  { id: "dora-hoodie", artist: "dora", title: "Худи «Кьют-рок»", type: "Худи", price: 6900 },
  { id: "dora-tee", artist: "dora", title: "Футболка MISS", type: "Футболка", price: 3500 },
  { id: "deti-tee", artist: "deti-rave", title: "Футболка «Качает»", type: "Футболка", price: 3500 },
  { id: "deti-cap", artist: "deti-rave", title: "Кепка THERAPIA", type: "Аксессуар", price: 2900 },
  { id: "rm-longsleeve", artist: null, title: "Лонгслив Rhymes Music", type: "Лонгслив", price: 4500 },
  { id: "rm-tote", artist: null, title: "Шопер Rhymes Music", type: "Аксессуар", price: 1900 },
  { id: "kiskis-tee", artist: "kis-kis", title: "Футболка кис-кис", type: "Футболка", price: 3500 },
  { id: "polmateri-hoodie", artist: "polmateri", title: "Худи Полматери", type: "Худи", price: 6900 }
];

/* ---------- Команда: отделы и их зоны ответственности ---------- */
export const TEAM = [
  { dept: "A&R", text: "Ищем и подписываем артистов, слушаем демо, ведём артиста от первого релиза.", email: "demo@rhymesmusic.com" },
  { dept: "Маркетинг", text: "Стратегия релиза, промо на площадках, таргет, посевы и работа с блогерами.", email: "office@rhymesmusic.com" },
  { dept: "Букинг и туры", text: "Туры, фестивали, клубные шоу и частные выступления по Европе и СНГ.", email: "sales@rhymesmusic.com" },
  { dept: "Видеопродакшн", text: "Клипы, тизеры, фотосессии и упаковка релизов.", email: "office@rhymesmusic.com" },
  { dept: "Партнёрства", text: "Интеграции с брендами, продакт-плейсмент и лицензирование.", email: "sales@rhymesmusic.com" },
  { dept: "Мерч", text: "Дизайн, производство и продажа мерча артистов.", email: "office@rhymesmusic.com" }
];

/* ---------- Команда: люди (условные, показывают, как выглядит блок) ---------- */
export const TEAM_PEOPLE = [
  { id: "a-sokolova", name: "Анна Соколова", role: "Руководитель A&R", dept: "A&R" },
  { id: "m-orlov", name: "Максим Орлов", role: "Head of Marketing", dept: "Маркетинг" },
  { id: "k-lebedeva", name: "Кира Лебедева", role: "Букинг-менеджер", dept: "Букинг и туры" },
  { id: "t-galiev", name: "Тимур Галиев", role: "Продюсер видео", dept: "Видеопродакшн" },
  { id: "p-voronina", name: "Полина Воронина", role: "SMM-лид", dept: "Маркетинг" },
  { id: "a-belov", name: "Артём Белов", role: "Тур-менеджер", dept: "Букинг и туры" },
  { id: "e-mironova", name: "Ева Миронова", role: "Менеджер партнёрств", dept: "Партнёрства" },
  { id: "g-zakharov", name: "Глеб Захаров", role: "Дизайнер мерча", dept: "Мерч" }
];

/* ---------- Вакансии (примеры для показа страницы) ---------- */
export const JOBS = [
  {
    slug: "smm-manager",
    title: "SMM-менеджер",
    dept: "Маркетинг",
    place: "Москва, гибрид",
    employment: "Полная занятость",
    salary: "По итогам собеседования",
    summary: "Ведём соцсети лейбла и помогаем артистам запускать релизы так, чтобы о них говорили.",
    tasks: [
      "Вести аккаунты лейбла в VK, Telegram и TikTok: контент-план, публикации, отчёты",
      "Готовить промо-кампании релизов вместе с артистами и продюсерами",
      "Искать тренды и форматы, которые подходят конкретному артисту",
      "Работать с подрядчиками: дизайнерами, монтажёрами, блогерами"
    ],
    requirements: [
      "Опыт SMM от 2 лет, желательно в музыке или медиа",
      "Понимание алгоритмов VK Клипов, TikTok и Reels",
      "Насмотренность и вкус",
      "Умение считать результат, а не только охваты"
    ],
    niceToHave: ["Своё медиа или паблик с живой аудиторией", "Опыт запуска релизов"],
    offer: ["Работа с артистами из верхних строчек чартов", "Гибрид: офис в Москве и удалёнка", "Бюджет на обучение и конференции", "Проходки на концерты лейбла"]
  },
  {
    slug: "booking-manager",
    title: "Букинг-менеджер",
    dept: "Букинг и туры",
    place: "Москва",
    employment: "Полная занятость",
    salary: "Оклад + процент",
    summary: "Продаём выступления артистов лейбла: клубы, фестивали, частные события и бренды.",
    tasks: [
      "Обрабатывать входящие заявки и готовить предложения",
      "Вести переговоры с организаторами и согласовывать райдеры",
      "Собирать туры вместе с тур-менеджерами",
      "Вести сделки в CRM и отчитываться по выручке"
    ],
    requirements: [
      "Опыт в букинге, ивентах или B2B-продажах от 1 года",
      "Уверенные переговоры и деловая переписка",
      "Внимательность к деталям договоров и райдеров",
      "Готовность к нерегулярному графику в дни концертов"
    ],
    niceToHave: ["Своя база организаторов", "Английский для зарубежных площадок"],
    offer: ["Прозрачный процент с каждой сделки", "ДМС после испытательного срока", "Поездки на фестивали", "Команда, которая быстро принимает решения"]
  },
  {
    slug: "motion-designer",
    title: "Моушн-дизайнер",
    dept: "Видеопродакшн",
    place: "Удалённо",
    employment: "Полная или проектная",
    salary: "По портфолио",
    summary: "Делаем визуал релизов: тизеры, канвасы, анимированные обложки и рекламные ролики.",
    tasks: [
      "Создавать Spotify Canvas, анимированные обложки и тизеры релизов",
      "Монтировать короткие вертикальные ролики под соцсети",
      "Собирать визуальные пакеты релизов вместе с арт-директором",
      "Адаптировать материалы под площадки и форматы"
    ],
    requirements: [
      "Уверенный After Effects и монтаж в Premiere или DaVinci",
      "Портфолио с музыкальными или fashion-проектами",
      "Умение работать быстро под дедлайн релиза",
      "Анимация, которая попадает в ритм музыки"
    ],
    niceToHave: ["Cinema 4D или Blender", "Опыт съёмок"],
    offer: ["Проекты для артистов с миллионной аудиторией", "Удалённая работа из любого города", "Софт за счёт компании", "Свобода в визуальных решениях"]
  },
  {
    slug: "ar-scout",
    title: "A&R-скаут",
    dept: "A&R",
    place: "Удалённо",
    employment: "Частичная занятость",
    salary: "Фикс + бонус за подписание",
    summary: "Ищем новых артистов раньше всех: слушаем демо, мониторим площадки, приносим находки.",
    tasks: [
      "Слушать демо, которые приходят в лейбл, и давать по ним фидбек",
      "Мониторить TikTok, VK Музыку и SoundCloud в поиске новых имён",
      "Готовить короткие профили артистов для A&R-команды",
      "Ходить на локальные концерты и шоукейсы"
    ],
    requirements: [
      "Слушаете много новой музыки и можете объяснить, почему трек цепляет",
      "Знаете сцену фрешменов",
      "Коротко и по делу формулируете мысли",
      "Можете уделять работе 15–20 часов в неделю"
    ],
    niceToHave: ["Опыт в музыкальном медиа", "Знакомства в региональных сценах"],
    offer: ["Бонус за каждого подписанного артиста", "Гибкий график", "Прямой контакт с A&R-командой", "Рост до A&R-менеджера"]
  }
];

/* ---------- Документы ---------- */
/* Документы-файлы с официального сайта. С Supabase они в той же таблице pages, что и тексты (kind = file) */
export const DOCUMENTS = [
  { slug: "perechen-rezultatov-sout", title: "Перечень результатов СОУТ", url: "https://rhymesmusic.ru/files/1/doc1.pdf" },
  { slug: "svodnaya-vedomost-sout", title: "Сводная ведомость СОУТ", url: "https://rhymesmusic.ru/files/1/doc2.pdf" },
  { slug: "sbd", title: "СБД", url: "https://rhymesmusic.ru/files/1/doc3.pdf" }
];

/*
 * Тексты документов. В режиме с Supabase они редактируются в админке (таблица pages),
 * отсюда — только начальное наполнение и запасной вариант без базы.
 * Формат: ## заголовок, ### подзаголовок, абзацы через пустую строку, «- » списки,
 * **жирный**, [ссылка](https://…).
 */
export const LEGAL_PAGES = [
  {
    slug: "privacy",
    title: "Политика конфиденциальности",
    sort: 0,
    body: `### Какие данные мы получаем
Данные, которые вы указываете в формах сайта: имя, название компании, почту или телефон, город и детали события в заявке на выступление; имя, ссылки и контакт в заявке с демо.

### Зачем
Только чтобы ответить на заявку: связаться с вами, подготовить предложение по выступлению или рассмотреть демо. Мы не продаём и не передаём данные третьим лицам для рекламы.

### Хранение и удаление
Данные хранятся у сервиса, на котором работает сайт, столько, сколько нужно для ответа и сопровождения сделки. Чтобы удалить свои данные, напишите на [office@rhymesmusic.com](mailto:office@rhymesmusic.com).

### Хранилище браузера
Сайт сохраняет в вашем браузере только состав лайнапа, чтобы он не пропадал при переходах. Эти данные не отправляются на сервер, пока вы не отправите заявку.

### Сторонние сервисы
Плееры Spotify и YouTube загружаются только после нажатия на кнопку воспроизведения и подчиняются правилам этих сервисов.`
  },
  {
    slug: "terms",
    title: "Пользовательское соглашение",
    sort: 1,
    body: `Музыка, клипы, фото и тексты на сайте принадлежат Rhymes Music и артистам лейбла. Их нельзя копировать и использовать в коммерческих целях без письменного согласия правообладателя.

Материалы пресс-кита предназначены для организаторов и СМИ и используются только для анонса выступлений и публикаций об артисте.

Отправляя заявку или демо, вы подтверждаете, что указали достоверные данные и имеете права на присланную музыку.`
  }
];
