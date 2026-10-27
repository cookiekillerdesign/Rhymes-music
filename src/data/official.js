/*
 * Данные артистов с официального сайта лейбла (rhymesmusic.ru, октябрь 2026):
 * релизы, популярные треки со счётчиками Spotify, клипы, соцсети, фото.
 * content.js дополняет ими только пустые поля артистов. Описания переписаны своими словами.
 * Дальше страницы обновляет синхронизация (supabase/functions/sync-catalog).
 */
export const OFFICIAL = {
  "mukka": {
    photo: "https://rhymesmusic.ru/photos/1/%D0%BA%D0%B0%D1%82%D0%B0%D0%BB%D0%BE%D0%B3%20%D0%B0%D1%80%D1%82%D0%B8%D1%81%D1%82%D0%BE%D0%B2/%D0%BC%D1%83%D0%BA%D0%BA%D0%B0/-mukka-b.png",
    socials: [
      {"name": "VK", "url": "https://vk.com/smukka"},
      {"name": "YouTube", "url": "https://www.youtube.com/channel/UCd6y_bszkqUMoYBCtZt5w1Q"},
      {"name": "TikTok", "url": "https://www.tiktok.com/@fakemukka"}
    ],
    releases: [
      {"title": "Малолетки", "artists": "МУККА", "type": "EP", "cover": "https://i.scdn.co/image/ab67616d0000b27302cad37bb1e3e2ae68fae02a", "preview": "https://p.scdn.co/mp3-preview/380b3d3b5b775cf608e2215420587939b6c531fb?cid=23917817e5d04cfa84952e02200ec7df", "spotify": "album/41n0ze0qQ6qP1AqFnGhFhb"},
      {"title": "Днями-ночами", "artists": "МУККА", "type": "Сингл", "cover": "https://i.scdn.co/image/ab67616d0000b273e41b1431cf63aa22f8198bbf", "preview": "https://p.scdn.co/mp3-preview/af7f25e25fe3b6997159dada69e37ac8bca2d5c8?cid=23917817e5d04cfa84952e02200ec7df", "spotify": "album/4R3TyCTmtEN1nIo1EhOPgT"}
    ],
    popular: [
      {"title": "Днями-ночами", "artists": "pyrokinesis, МУККА", "streams": 26708681, "cover": "https://i.scdn.co/image/ab67616d0000b273e41b1431cf63aa22f8198bbf", "preview": "https://p.scdn.co/mp3-preview/af7f25e25fe3b6997159dada69e37ac8bca2d5c8?cid=23917817e5d04cfa84952e02200ec7df"},
      {"title": "Не выводи меня", "artists": "МУККА, Три дня дождя", "streams": 4456878, "cover": "https://i.scdn.co/image/ab67616d0000b27302cad37bb1e3e2ae68fae02a", "preview": "https://p.scdn.co/mp3-preview/cc15cb2823343dcb0818ab31b73751d3067389d6?cid=23917817e5d04cfa84952e02200ec7df"},
      {"title": "Весна", "artists": "МУККА, Три дня дождя", "streams": 2830861, "cover": "https://i.scdn.co/image/ab67616d0000b27302cad37bb1e3e2ae68fae02a", "preview": "https://p.scdn.co/mp3-preview/380b3d3b5b775cf608e2215420587939b6c531fb?cid=23917817e5d04cfa84952e02200ec7df"},
      {"title": "чёрное сердце", "artists": "МУККА, pyrokinesis", "streams": 1167068, "cover": "https://i.scdn.co/image/ab67616d0000b273ec173b5637632d439093365a", "preview": "https://p.scdn.co/mp3-preview/929b51b1652444e2539fdefddee8f6853d010caa?cid=6bc01e97e5904e1a9c49e8bcd515309c"}
    ],
    videos: [
      {"id": "3CRijLQ0acY", "title": "Live Acoustic — Санкт-Петербург, 26.07.2023"}
    ]
  },
  "maybe-baby": {
    photo: "https://rhymesmusic.ru/photos/1/%D0%BA%D0%B0%D1%82%D0%B0%D0%BB%D0%BE%D0%B3%20%D0%B0%D1%80%D1%82%D0%B8%D1%81%D1%82%D0%BE%D0%B2/%D0%BC%D1%8D%D0%B9%D0%B1%D0%B8/-mb-b2.png",
    socials: [
      {"name": "TikTok", "url": "https://www.tiktok.com/@frendtok"},
      {"name": "Instagram", "url": "https://www.instagram.com/frend_baby/"},
      {"name": "VK", "url": "https://vk.com/maybebaby"},
      {"name": "YouTube", "url": "https://www.youtube.com/channel/UCBhNW531Uyx1ooaWlcepyvg"}
    ],
    releases: [
      {"title": "SHIMMY SHIMMY YA!", "artists": "Мэйби Бэйби", "type": "Сингл", "cover": "https://rhymesmusic.ru/photos/1/%D0%BA%D0%B0%D1%82%D0%B0%D0%BB%D0%BE%D0%B3%20%D0%B0%D1%80%D1%82%D0%B8%D1%81%D1%82%D0%BE%D0%B2/%D0%BC%D1%8D%D0%B9%D0%B1%D0%B8/-%D0%BC%D1%8D%D0%B8%CC%86%D0%B1%D0%B8-%D1%88%D0%B8%D0%BC%D0%BC%D0%B8.jpg", "spotify": "track/12VZnNohS3m6Wi0NQhN5JS"},
      {"title": "ЗАЙКА", "artists": "Мэйби Бэйби", "type": "Сингл", "cover": "https://rhymesmusic.ru/photos/1/%D0%BA%D0%B0%D1%82%D0%B0%D0%BB%D0%BE%D0%B3%20%D0%B0%D1%80%D1%82%D0%B8%D1%81%D1%82%D0%BE%D0%B2/%D0%BC%D1%8D%D0%B9%D0%B1%D0%B8/-%D0%BC%D1%8D%D0%B8%CC%86%D0%B1%D0%B8-%D0%B7%D0%B0%D0%B8%CC%86%D0%BA%D0%B0.jpg", "spotify": "track/2nPRsTta1FT5Rr1frgym3q"},
      {"title": "МЭЙБИЛЭНД", "artists": "Мэйби Бэйби", "type": "Альбом", "cover": "https://rhymesmusic.ru/photos/3/%D0%BA%D0%B0%D1%82%D0%B0%D0%BB%D0%BE%D0%B3/%D0%BC%D1%8D%D0%B9%D0%B1%D0%B8/-%D0%BC%D1%8D%D0%B8%CC%86%D0%B1%D0%B8-%D0%BC%D1%8D%D0%B8%CC%86%D0%B1%D0%B8%D0%BB%D1%8D%D0%BD%D0%B4.jpg", "spotify": "album/5lMs819OYwbJH5WpffMST0"},
      {"title": "БОЛЬ", "artists": "quiizzzmeow, Мэйби Бэйби", "type": "Сингл", "cover": "https://rhymesmusic.ru/photos/1/%D0%BA%D0%B0%D1%82%D0%B0%D0%BB%D0%BE%D0%B3%20%D0%B0%D1%80%D1%82%D0%B8%D1%81%D1%82%D0%BE%D0%B2/%D0%BA%D0%B8%D0%B7%D0%BC%D1%8F%D1%83/-%D0%B1%D0%BE%D0%BB%D1%8C.jpg", "spotify": "album/3YXGPmL4F6RuPKCLAmIiCL"},
      {"title": "sH1pu4Ka!", "artists": "Мэйби Бэйби", "type": "Сингл", "cover": "https://rhymesmusic.ru/photos/1/%D0%BA%D0%B0%D1%82%D0%B0%D0%BB%D0%BE%D0%B3%20%D0%B0%D1%80%D1%82%D0%B8%D1%81%D1%82%D0%BE%D0%B2/%D0%BC%D1%8D%D0%B9%D0%B1%D0%B8/%E2%80%94%20sH1pu4Ka%21%20%D0%BA%D0%BE%D0%BF%D0%B8%D1%8F.jpg", "spotify": "album/2hLRWCM0HqQXly8JLjVAby"},
      {"title": "Не исправлюсь", "artists": "Дора, Мэйби Бэйби", "type": "Сингл", "released_on": "2020-07-14", "cover": "https://rhymesmusic.ru/photos/1/%D0%BA%D0%B0%D1%82%D0%B0%D0%BB%D0%BE%D0%B3%20%D0%B0%D1%80%D1%82%D0%B8%D1%81%D1%82%D0%BE%D0%B2/%D0%BC%D1%8D%D0%B9%D0%B1%D0%B8/-%D0%BC%D1%8D%D0%B8%CC%86%D0%B1%D0%B8-%D0%BD%D0%B5-%D0%B8%D1%81%D0%BF%D1%80%D0%B0%D0%B2%D0%BB%D1%8E%D1%81%D1%8C.jpg", "spotify": "album/1crUm6IgsdBMs1bUzc0VXu"},
      {"title": "Аскорбинка", "artists": "Мэйби Бэйби", "type": "Сингл", "cover": "https://rhymesmusic.ru/photos/1/%D0%BA%D0%B0%D1%82%D0%B0%D0%BB%D0%BE%D0%B3%20%D0%B0%D1%80%D1%82%D0%B8%D1%81%D1%82%D0%BE%D0%B2/%D0%BC%D1%8D%D0%B9%D0%B1%D0%B8/-%D0%BC%D1%8D%D0%B8%CC%86%D0%B1%D0%B8-%D0%B0%D1%81%D0%BA%D0%BE%D1%80%D0%B1%D0%B8%D0%BD%D0%BA%D0%B0.jpg", "spotify": "album/6BeTwg5qWyL4W8dfs9NbW8"}
    ],
    popular: [
      {"title": "Аскорбинка", "artists": "Мэйби Бэйби", "streams": 6513965, "cover": "https://i.scdn.co/image/ab67616d0000b273ace86bd81826295f5fddd97f"},
      {"title": "Тамагочи", "artists": "Мэйби Бэйби, алёна швец.", "streams": 6376662, "cover": "https://i.scdn.co/image/ab67616d0000b273393d330bd16ed2fd5bd6b333"},
      {"title": "Боль", "artists": "quiizzzmeow, Мэйби Бэйби", "streams": 1548022, "cover": "https://i.scdn.co/image/ab67616d0000b273edcb5029ede47a0b7b2f7b89"},
      {"title": "ЗАЙКА", "artists": "Мэйби Бэйби", "streams": 687528, "cover": "https://i.scdn.co/image/ab67616d0000b27361deb3bd43c7c789cca24587"},
      {"title": "Барби из трущоб", "artists": "Мэйби Бэйби", "streams": 136661, "cover": "https://i.scdn.co/image/ab67616d0000b2736631186e052e7266434719a4"}
    ],
    events: [
      {"date": "2022-04-07", "title": "Мэйби Бэйби записывает первый сольный альбом", "text": "Пластинка получила название «МЭЙБИЛЭНД».", "image": "https://rhymesmusic.ru/photos/1/%D1%80%D0%B5%D0%BB%D0%B8%D0%B7%D1%8B/-%D0%BC%D1%8D%D0%B9%D0%B1%D0%B8-%D0%B0%D0%BB%D1%8C%D0%B1%D0%BE%D0%BC.jpg"}
    ]
  },
  "betsi": {
    tagline: "Sigma Boy",
    photo: "https://rhymesmusic.ru/photos/5/1440.jpg",
    socials: [
      {"name": "Likee", "url": "https://likee.video/@604162807"},
      {"name": "Instagram", "url": "https://www.instagram.com/badsee_official/"},
      {"name": "VK", "url": "https://vk.com/badsee_official"},
      {"name": "YouTube", "url": "https://www.youtube.com/channel/UC_rA7LUE1g4YVPW97JBrRMw"}
    ],
    releases: [
      {"title": "Pump It Up", "artists": "Betsy", "type": "Сингл", "cover": "https://rhymesmusic.ru/photos/1/%D0%BA%D0%B0%D1%82%D0%B0%D0%BB%D0%BE%D0%B3%20%D0%B0%D1%80%D1%82%D0%B8%D1%81%D1%82%D0%BE%D0%B2/%D0%B1%D1%8D%D1%82%D1%81%D0%B8/_%D0%B1%D1%8D%D1%82%D1%81%D0%B8_%D0%BF%D0%B0%D0%BC.jpg"},
      {"title": "Фрэнк", "artists": "Betsy", "type": "Сингл", "cover": "https://rhymesmusic.ru/photos/3/%D0%BA%D0%B0%D1%82%D0%B0%D0%BB%D0%BE%D0%B3/%D0%B1%D1%8D%D1%82%D1%81%D0%B8/-%D0%B1%D1%8D%D1%82%D1%81%D0%B8-%D1%84%D1%80%D1%8D%D0%BD%D0%BA.jpg"},
      {"title": "GOLD APPLE", "artists": "M&A, Betsy", "type": "Сингл", "cover": "https://rhymesmusic.ru/photos/3/%D0%BA%D0%B0%D1%82%D0%B0%D0%BB%D0%BE%D0%B3/%D0%B1%D1%8D%D1%82%D1%81%D0%B8/-%D0%B1%D0%B5%D1%82%D1%81%D0%B8-%D1%8D%D0%BF%D0%BE%D0%BB.jpg"}
    ],
    popular: [
      {"title": "Simple dimpl pop it squish", "artists": "M&A, Betsy", "streams": 12605403, "cover": "https://i.scdn.co/image/ab67616d0000b27306ecedd7e1b733d7db2bcfad"},
      {"title": "Capybara", "artists": "Сто-Личный Она-Нас, Betsy", "streams": 8887545, "cover": "https://i.scdn.co/image/ab67616d0000b27378bb123297049060d11b95a2"},
      {"title": "Pump It Up", "artists": "Betsy", "streams": 379207, "cover": "https://i.scdn.co/image/ab67616d0000b273dc42e56f984f13d87c63af2a"},
      {"title": "GOLD APPLE", "artists": "M&A, Betsy", "streams": 157642, "cover": "https://i.scdn.co/image/ab67616d0000b2735890581ce0f5ee74d74e0d16"},
      {"title": "Электрощиток", "artists": "Betsy", "streams": 12225, "cover": "https://i.scdn.co/image/ab67616d0000b273171a80f4ae1c62cb6a0f5671"},
      {"title": "Фрэнк", "artists": "Betsy", "streams": 11664, "cover": "https://i.scdn.co/image/ab67616d0000b27399bf2dc33e284af7ec36b264"}
    ]
  },
  "by-indiya": {
    tagline: "RnB в твоей комнате",
    photo: "https://rhymesmusic.ru/photos/1/%D0%BA%D0%B0%D1%82%D0%B0%D0%BB%D0%BE%D0%B3%20%D0%B0%D1%80%D1%82%D0%B8%D1%81%D1%82%D0%BE%D0%B2/%D0%B1%D0%B0%D0%B9%20%D0%B8%D0%BD%D0%B4%D0%B8%D1%8F/thumb/1441_-%D0%BA-%D0%B8%D0%BD%D0%B4%D0%B8%D1%8F.jpg",
    socials: [
      {"name": "TikTok", "url": "https://www.tiktok.com/@byindiabyindiabyindia"},
      {"name": "Instagram", "url": "https://www.instagram.com/byindiabyindiabyindia/"},
      {"name": "VK", "url": "https://vk.com/byindia7"},
      {"name": "YouTube", "url": "https://www.youtube.com/channel/UC0gKrme3OQmuVrvD-YCVE5w"}
    ],
    releases: [
      {"title": "NIGHTS", "artists": "By Индия", "type": "EP", "cover": "https://i.scdn.co/image/ab67616d0000b273246e656271190b7536f6129a", "spotify": "album/5d4kWqNPt2uaD0E7ABXRU3"},
      {"title": "Кислород", "artists": "By Индия", "type": "Сингл", "cover": "https://i.scdn.co/image/ab67616d0000b273b9d00c7ca1499acb91573a15", "spotify": "album/5gFt0MftsTryYQZFSyJONm"},
      {"title": "Целуйся правильно", "artists": "By Индия", "type": "Сингл", "cover": "https://rhymesmusic.ru/photos/1/%D0%BA%D0%B0%D1%82%D0%B0%D0%BB%D0%BE%D0%B3%20%D0%B0%D1%80%D1%82%D0%B8%D1%81%D1%82%D0%BE%D0%B2/%D0%B1%D0%B0%D0%B9%20%D0%B8%D0%BD%D0%B4%D0%B8%D1%8F/-%D0%B8%D0%BD%D0%B4%D0%B8%D1%8F-%D1%86%D0%B5%D0%BB%D1%83%D0%B8%CC%86%D1%81%D1%8F.JPG", "spotify": "album/2ujqgy1A79CVbO8LmNO7n1"},
      {"title": "RnB в твоей комнате", "artists": "By Индия", "type": "Альбом", "cover": "https://rhymesmusic.ru/photos/1/%D0%BA%D0%B0%D1%82%D0%B0%D0%BB%D0%BE%D0%B3%20%D0%B0%D1%80%D1%82%D0%B8%D1%81%D1%82%D0%BE%D0%B2/%D0%B1%D0%B0%D0%B9%20%D0%B8%D0%BD%D0%B4%D0%B8%D1%8F/-%D0%B8%D0%BD%D0%B4%D0%B8%D1%8F-%D1%80%D0%BD%D0%B1.jpg", "spotify": "album/4TDWGtYsSga2kdpodYWCOD"},
      {"title": "SALUTE", "artists": "By Индия", "type": "EP", "cover": "https://rhymesmusic.ru/photos/1/%D0%BA%D0%B0%D1%82%D0%B0%D0%BB%D0%BE%D0%B3%20%D0%B0%D1%80%D1%82%D0%B8%D1%81%D1%82%D0%BE%D0%B2/%D0%B1%D0%B0%D0%B9%20%D0%B8%D0%BD%D0%B4%D0%B8%D1%8F/-%D0%B8%D0%BD%D0%B4%D0%B8%D1%8F-%D1%81%D0%B0%D0%BB%D1%8E%D1%82.jpg", "spotify": "album/2yred19bVTTgLcE6R6kRlE"}
    ],
    popular: [
      {"title": "люби меня так", "artists": "By Индия", "streams": 5366980, "cover": "https://i.scdn.co/image/ab67616d0000b273493bd9c8842441053f60c136"},
      {"title": "я не помню", "artists": "By Индия", "streams": 5327616, "cover": "https://i.scdn.co/image/ab67616d0000b273bccfb3f4312a526488474a87"},
      {"title": "Полет - Sowyol Remix", "artists": "By Индия, SOWYOL", "streams": 5009525, "cover": "https://i.scdn.co/image/ab67616d0000b2738db82401d170de8dee835d23"},
      {"title": "Вселенная", "artists": "By Индия", "streams": 4504198, "cover": "https://i.scdn.co/image/ab67616d0000b273dc1a3ef96b37712eac728155"},
      {"title": "вечеринка", "artists": "By Индия", "streams": 3570549, "cover": "https://i.scdn.co/image/ab67616d0000b273493bd9c8842441053f60c136"},
      {"title": "думать о тебе", "artists": "By Индия", "streams": 3142259, "cover": "https://i.scdn.co/image/ab67616d0000b273493bd9c8842441053f60c136"},
      {"title": "целуйся правильно", "artists": "By Индия", "streams": 1007569, "cover": "https://i.scdn.co/image/ab67616d0000b27397d2f1c875e99d709262e0d0"},
      {"title": "Кислород", "artists": "By Индия", "streams": 804640, "cover": "https://i.scdn.co/image/ab67616d0000b273b9d00c7ca1499acb91573a15"}
    ],
    events: [
      {"date": "2022-04-28", "title": "«Целуйся правильно»", "text": "By Индия анонсировала лиричный сингл, который вышел 12 мая.", "image": "https://rhymesmusic.ru/photos/1/%D1%80%D0%B5%D0%BB%D0%B8%D0%B7%D1%8B/-%D0%B8%D0%BD%D0%B4%D0%B8%D1%8F-%D1%86%D0%B5%D0%BB%D1%83%D0%B9%D1%81%D1%8F.jpg"}
    ]
  },
  "finik": {
    bio: "Молодой артист из Ульяновска. Известность ему принесли треки «Не гоняйте, пацаны», «Наушники» и «Диалоги тет-а-тет», разлетевшиеся по TikTok. Часто выпускает совместные песни с ALEKS ATAMAN.",
    photo: "https://rhymesmusic.ru/photos/1/%D0%BA%D0%B0%D1%82%D0%B0%D0%BB%D0%BE%D0%B3%20%D0%B0%D1%80%D1%82%D0%B8%D1%81%D1%82%D0%BE%D0%B2/%D0%B0%D0%BB%D0%B5%D0%BA%D1%81%20%D0%B0%D1%82%D0%B0%D0%BC%D0%B0%D0%BD%20%D0%B8%20%D1%84%D0%B8%D0%BD%D0%B8%D0%BA/thumb/1441_-%D0%BA%D0%BE-%D1%84%D0%B8%D0%BD%D0%B8%D0%BA2%20%D0%BA%D0%BE%D0%BF%D0%B8%D1%8F.jpg",
    socials: [
      {"name": "TikTok", "url": "https://www.tiktok.com/@finik.finya"},
      {"name": "VK", "url": "https://vk.com/finikmusic"},
      {"name": "Instagram", "url": "https://www.instagram.com/finik.finya/"},
      {"name": "YouTube", "url": "https://www.youtube.com/channel/UCAzPctYf1PCyP67BgR4kL8A"}
    ],
    releases: [
      {"title": "Ой, подзабыли", "artists": "ALEKS ATAMAN, FINIK", "type": "Сингл", "cover": "https://i.scdn.co/image/ab67616d0000b273f92e477dd0e57f79b8b725d2", "spotify": "track/6dkfI7A6hS2ZOaDl829Avv"},
      {"title": "На блатных аккордах", "artists": "ALEKS ATAMAN, FINIK", "type": "Сингл", "cover": "https://i.scdn.co/image/ab67616d0000b273b81ef96a889c9a99aae2360d", "spotify": "track/55QwAXoKoDUM6LXJpLjE0n"},
      {"title": "Юра Шатунов", "artists": "ALEKS ATAMAN, FINIK", "type": "Сингл", "cover": "https://i.scdn.co/image/ab67616d0000b2738f74fa38039c9696ac5c0a5d", "spotify": "track/3JDONsm8rJn1lPO7e7blB4"},
      {"title": "Девочка бандитка", "artists": "ALEKS ATAMAN, FINIK", "type": "Сингл", "cover": "https://i.scdn.co/image/ab67616d0000b273a5ac524d2ebdfd9735d47391", "spotify": "track/4Yak0Dy4DBikh7pp0nUDVX"},
      {"title": "Снежинки", "artists": "ALEKS ATAMAN, FINIK", "type": "Сингл", "cover": "https://i.scdn.co/image/ab67616d0000b273042a3d1afefe70dd50f8a103", "spotify": "track/7ic6T1EVcH6HwmR2k75FzP"},
      {"title": "Диалоги тет-а-тет", "artists": "ALEKS ATAMAN, FINIK", "type": "Сингл", "cover": "https://i.scdn.co/image/ab67616d0000b273b778d5b71e0636644b378b44", "spotify": "track/7qEZALeVloIwiz6tvX8ZUL"},
      {"title": "Ой, молодой", "artists": "FINIK", "type": "Сингл", "cover": "https://i.scdn.co/image/ab67616d0000b273497a11a1833e7ed83e84b411", "spotify": "track/0M7eGgFXFVJ2PSI63d8b6i"}
    ],
    popular: [
      {"title": "Диалоги тет-а-тет", "artists": "ALEKS ATAMAN, FINIK", "streams": 11682031, "cover": "https://i.scdn.co/image/ab67616d0000b273b778d5b71e0636644b378b44"},
      {"title": "Снежинки", "artists": "ALEKS ATAMAN, FINIK", "streams": 7567794, "cover": "https://i.scdn.co/image/ab67616d0000b273042a3d1afefe70dd50f8a103"},
      {"title": "Девочка бандитка", "artists": "ALEKS ATAMAN, FINIK", "streams": 5427613, "cover": "https://i.scdn.co/image/ab67616d0000b273a5ac524d2ebdfd9735d47391"},
      {"title": "Юра Шатунов", "artists": "ALEKS ATAMAN, FINIK", "streams": 3864760, "cover": "https://i.scdn.co/image/ab67616d0000b2738f74fa38039c9696ac5c0a5d"},
      {"title": "Ой, подзабыли", "artists": "ALEKS ATAMAN, FINIK", "streams": 3587505, "cover": "https://i.scdn.co/image/ab67616d0000b273f92e477dd0e57f79b8b725d2"},
      {"title": "Диалоги тет-а-тет (Karmv, 4ETVERGOV Remix)", "artists": "ALEKS ATAMAN, FINIK, karmv, 4ETVERGOV", "streams": 2272280, "cover": "https://i.scdn.co/image/ab67616d0000b27357a25128c0bd4bdf16038dd9"},
      {"title": "Ой, молодой", "artists": "FINIK", "streams": 1461522, "cover": "https://i.scdn.co/image/ab67616d0000b273497a11a1833e7ed83e84b411"},
      {"title": "На блатных аккордах", "artists": "ALEKS ATAMAN, FINIK", "streams": 1274357, "cover": "https://i.scdn.co/image/ab67616d0000b273b81ef96a889c9a99aae2360d"}
    ],
    events: [
      {"date": "2022-03-29", "title": "ТОП-100 YouTube", "text": "Клипы ALEKS ATAMAN, FINIK и Ганвеста попали в сотню лучших клипов России на YouTube.", "image": "https://rhymesmusic.ru/photos/1/%D1%80%D0%B5%D0%BB%D0%B8%D0%B7%D1%8B/-%D1%82%D0%BE%D0%BF-%D1%8E%D1%82%D1%83%D0%B1.jpg"}
    ]
  },
  "aleks-ataman": {
    bio: "Артист из Ульяновска, которого TikTok узнал по трекам «Диалоги тет-а-тет», «Чёрный Алексей» и «Скатертью дорожка». Большую часть хитов записал вместе с FINIK.",
    photo: "https://rhymesmusic.ru/photos/1/%D0%BA%D0%B0%D1%82%D0%B0%D0%BB%D0%BE%D0%B3%20%D0%B0%D1%80%D1%82%D0%B8%D1%81%D1%82%D0%BE%D0%B2/%D0%B0%D0%BB%D0%B5%D0%BA%D1%81%20%D0%B0%D1%82%D0%B0%D0%BC%D0%B0%D0%BD%20%D0%B8%20%D1%84%D0%B8%D0%BD%D0%B8%D0%BA/thumb/1441_-%D0%BA-%D0%B0%D1%82%D0%B0%D0%BC%D0%B0%D0%BD01.jpg",
    socials: [
      {"name": "TikTok", "url": "https://www.tiktok.com/@aleks_ataman"},
      {"name": "Instagram", "url": "https://www.instagram.com/aleks_ataman/"},
      {"name": "VK", "url": "https://vk.com/aleks_ataman"},
      {"name": "YouTube", "url": "https://www.youtube.com/channel/UCuDJkO-EIUIUldlX-iSEF2A"}
    ],
    releases: [
      {"title": "Ой, подзабыли", "artists": "ALEKS ATAMAN, FINIK", "type": "Сингл", "cover": "https://i.scdn.co/image/ab67616d0000b273f92e477dd0e57f79b8b725d2", "spotify": "track/6dkfI7A6hS2ZOaDl829Avv"},
      {"title": "На блатных аккордах", "artists": "ALEKS ATAMAN, FINIK", "type": "Сингл", "cover": "https://i.scdn.co/image/ab67616d0000b273b81ef96a889c9a99aae2360d", "spotify": "track/55QwAXoKoDUM6LXJpLjE0n"},
      {"title": "Юра Шатунов", "artists": "ALEKS ATAMAN, FINIK", "type": "Сингл", "cover": "https://i.scdn.co/image/ab67616d0000b2738f74fa38039c9696ac5c0a5d", "spotify": "track/3JDONsm8rJn1lPO7e7blB4"},
      {"title": "Девочка бандитка", "artists": "ALEKS ATAMAN, FINIK", "type": "Сингл", "cover": "https://i.scdn.co/image/ab67616d0000b273a5ac524d2ebdfd9735d47391", "spotify": "track/4Yak0Dy4DBikh7pp0nUDVX"},
      {"title": "Снежинки", "artists": "ALEKS ATAMAN, FINIK", "type": "Сингл", "cover": "https://i.scdn.co/image/ab67616d0000b273042a3d1afefe70dd50f8a103", "spotify": "track/7ic6T1EVcH6HwmR2k75FzP"},
      {"title": "Диалоги тет-а-тет", "artists": "ALEKS ATAMAN, FINIK", "type": "Сингл", "cover": "https://i.scdn.co/image/ab67616d0000b273b778d5b71e0636644b378b44", "spotify": "track/7qEZALeVloIwiz6tvX8ZUL"},
      {"title": "Лето, лето", "artists": "ALEKS ATAMAN", "type": "Сингл", "cover": "https://i.scdn.co/image/ab67616d0000b2738afcb968ff14f1d017fe7f86"}
    ],
    popular: [
      {"title": "Диалоги тет-а-тет", "artists": "ALEKS ATAMAN, FINIK", "streams": 11682031, "cover": "https://i.scdn.co/image/ab67616d0000b273b778d5b71e0636644b378b44"},
      {"title": "Снежинки", "artists": "ALEKS ATAMAN, FINIK", "streams": 7567794, "cover": "https://i.scdn.co/image/ab67616d0000b273042a3d1afefe70dd50f8a103"},
      {"title": "Девочка бандитка", "artists": "ALEKS ATAMAN, FINIK", "streams": 5427613, "cover": "https://i.scdn.co/image/ab67616d0000b273a5ac524d2ebdfd9735d47391"},
      {"title": "Юра Шатунов", "artists": "ALEKS ATAMAN, FINIK", "streams": 3864760, "cover": "https://i.scdn.co/image/ab67616d0000b2738f74fa38039c9696ac5c0a5d"},
      {"title": "Ой, подзабыли", "artists": "ALEKS ATAMAN, FINIK", "streams": 3587505, "cover": "https://i.scdn.co/image/ab67616d0000b273f92e477dd0e57f79b8b725d2"},
      {"title": "Диалоги тет-а-тет (Karmv, 4ETVERGOV Remix)", "artists": "ALEKS ATAMAN, FINIK, karmv, 4ETVERGOV", "streams": 2272280, "cover": "https://i.scdn.co/image/ab67616d0000b27357a25128c0bd4bdf16038dd9"},
      {"title": "Белыми ночами", "artists": "ALEKS ATAMAN, FINIK", "streams": 1289624, "cover": "https://i.scdn.co/image/ab67616d0000b273567e9d451e95383d1d10d473"},
      {"title": "На блатных аккордах", "artists": "ALEKS ATAMAN, FINIK", "streams": 1274357, "cover": "https://i.scdn.co/image/ab67616d0000b273b81ef96a889c9a99aae2360d"},
      {"title": "Лето, лето", "artists": "ALEKS ATAMAN", "streams": 1100835, "cover": "https://i.scdn.co/image/ab67616d0000b2738afcb968ff14f1d017fe7f86"}
    ],
    events: [
      {"date": "2022-03-29", "title": "ТОП-100 YouTube", "text": "Клипы ALEKS ATAMAN, FINIK и Ганвеста попали в сотню лучших клипов России на YouTube.", "image": "https://rhymesmusic.ru/photos/1/%D1%80%D0%B5%D0%BB%D0%B8%D0%B7%D1%8B/-%D1%82%D0%BE%D0%BF-%D1%8E%D1%82%D1%83%D0%B1.jpg"}
    ]
  },
  "gunwest": {
    photo: "https://rhymesmusic.ru/photos/1/%D0%BA%D0%B0%D1%82%D0%B0%D0%BB%D0%BE%D0%B3%20%D0%B0%D1%80%D1%82%D0%B8%D1%81%D1%82%D0%BE%D0%B2/%D0%B3%D0%B0%D0%BD%D0%B2%D0%B5%D1%81%D1%82/thumb/1441_-%D0%BA-%D0%B3%D0%B0%D0%BD%D0%B2%D0%B5%D1%81%D1%82.jpg",
    socials: [
      {"name": "TikTok", "url": "https://www.tiktok.com/@real.gunwest"},
      {"name": "Instagram", "url": "https://www.instagram.com/biggunwest/"},
      {"name": "VK", "url": "https://vk.com/gunwestofficial"},
      {"name": "YouTube", "url": "https://www.youtube.com/channel/UCpxacO9dujoE95ef7xNmbJQ"}
    ],
    releases: [
      {"title": "На рахате", "artists": "Ганвест", "type": "Сингл", "cover": "https://i.scdn.co/image/ab67616d0000b27394364b426e1aafe0ea2f71fe", "preview": "https://p.scdn.co/mp3-preview/312a1912405c21bd1e5541a6f17c065006bac533?cid=0c89bf1fdc5b4ae1b5bca805fe46e532", "spotify": "track/709iFp6p5UGnX6iHwCupKD"},
      {"title": "Ночная река", "artists": "Ганвест", "type": "Сингл", "cover": "https://i.scdn.co/image/ab67616d0000b273976e09913d5e6dcd6d8d7223", "preview": "https://p.scdn.co/mp3-preview/4e86d337b6f9198389b868b5bccc0b40b3aad962?cid=0c89bf1fdc5b4ae1b5bca805fe46e532", "spotify": "track/7dUeccIUAJ4iJeY8AIXhdU"},
      {"title": "Ты такая GLE", "artists": "Ганвест", "type": "Сингл", "cover": "https://i.scdn.co/image/ab67616d0000b273ec905044a7ec14f61a0694c5", "preview": "https://p.scdn.co/mp3-preview/53f690f53b7df769d26978696a70222d3927aaa4?cid=0c89bf1fdc5b4ae1b5bca805fe46e532", "spotify": "track/31cgAV9P44uzsMasE1rgyk"},
      {"title": "Кайфули", "artists": "Ганвест", "type": "Сингл", "cover": "https://rhymesmusic.ru/photos/1/%D0%BA%D0%B0%D1%82%D0%B0%D0%BB%D0%BE%D0%B3%20%D0%B0%D1%80%D1%82%D0%B8%D1%81%D1%82%D0%BE%D0%B2/%D0%B3%D0%B0%D0%BD%D0%B2%D0%B5%D1%81%D1%82/-%D0%B3%D0%B0%D0%BD%D0%B2%D0%B5%D1%81%D1%82-%D0%BA%D0%B0%D0%B9%D1%84%D1%83%D0%BB%D0%B8.jpg", "preview": "https://p.scdn.co/mp3-preview/e576c00a5d80afe45deadae09da1ecc03dd171ec?cid=0c89bf1fdc5b4ae1b5bca805fe46e532", "spotify": "track/09qYn7573SirEAdyohz50z"},
      {"title": "Никотин", "artists": "Ганвест", "type": "Сингл", "cover": "https://i.scdn.co/image/ab67616d0000b273cbd3cfe8896a92b75e60190f", "preview": "https://p.scdn.co/mp3-preview/b778b398268d772baa2b6792614d2a94b3782a92?cid=0c89bf1fdc5b4ae1b5bca805fe46e532", "spotify": "track/4mJ2nynF92oq5DYEFCfpqQ"}
    ],
    popular: [
      {"title": "Никотин", "artists": "Ганвест", "streams": 31552351, "cover": "https://i.scdn.co/image/ab67616d0000b273cbd3cfe8896a92b75e60190f", "preview": "https://p.scdn.co/mp3-preview/d2b94acbafb8ec5698a6af92ce92c42ca9f4c5ce?cid=6bc01e97e5904e1a9c49e8bcd515309c"},
      {"title": "Нирвана", "artists": "Ганвест", "streams": 5978105, "cover": "https://i.scdn.co/image/ab67616d0000b273e3e1049122900a0c8877d75f", "preview": "https://p.scdn.co/mp3-preview/9c34f0ce8e14fc239ddbc9fa7fae6319174e2725?cid=6bc01e97e5904e1a9c49e8bcd515309c"},
      {"title": "FENDI2", "artists": "Ганвест", "streams": 3828363, "cover": "https://i.scdn.co/image/ab67616d0000b273c96ad02558f086f6437e6313", "preview": "https://p.scdn.co/mp3-preview/3c3c0712746a781f2ab38ed90eb737e7b047518e?cid=6bc01e97e5904e1a9c49e8bcd515309c"},
      {"title": "Ты такая GLE", "artists": "Ганвест", "streams": 2023358, "cover": "https://i.scdn.co/image/ab67616d0000b273ec905044a7ec14f61a0694c5", "preview": "https://p.scdn.co/mp3-preview/e1cae74b6cdabe002b93adb8682fd7530548428d?cid=6bc01e97e5904e1a9c49e8bcd515309c"},
      {"title": "На рахате", "artists": "Ганвест", "streams": 1836705, "cover": "https://i.scdn.co/image/ab67616d0000b27394364b426e1aafe0ea2f71fe", "preview": "https://p.scdn.co/mp3-preview/05850aa3088fea0a371c586acab0ce67fd815957?cid=6bc01e97e5904e1a9c49e8bcd515309c"},
      {"title": "Ночная река", "artists": "Ганвест", "streams": 958800, "cover": "https://i.scdn.co/image/ab67616d0000b273976e09913d5e6dcd6d8d7223", "preview": "https://p.scdn.co/mp3-preview/b665ee92a224579616cf8814317608a400b2fb44?cid=6bc01e97e5904e1a9c49e8bcd515309c"},
      {"title": "Моя белорусочка", "artists": "Ганвест", "streams": 42193, "cover": "https://i.scdn.co/image/ab67616d0000b27317a2c7df424d2e1b29cbc0ca", "preview": "https://p.scdn.co/mp3-preview/093ccdc761fe030f61e5103a9ebe73c1928942b7?cid=6bc01e97e5904e1a9c49e8bcd515309c"}
    ],
    videos: [
      {"id": "kNpXyWQEm6g", "title": "Никотин"},
      {"id": "Wwn2nXQ6Y4k", "title": "Кайфули"},
      {"id": "DznmAEEXL-M", "title": "Ночная река"},
      {"id": "qy9ClrkgGT4", "title": "Королева бара"},
      {"id": "FRvO7zi0SZc", "title": "Бардак"},
      {"id": "8tiO4Fyn88Y", "title": "Ты такая GLE"},
      {"id": "M8XxytSYBfM", "title": "Дурман"},
      {"id": "Yf0oMj7sq6g", "title": "Биркин"}
    ],
    events: [
      {"date": "2022-03-29", "title": "ТОП-100 YouTube", "text": "Клипы ALEKS ATAMAN, FINIK и Ганвеста попали в сотню лучших клипов России на YouTube.", "image": "https://rhymesmusic.ru/photos/1/%D1%80%D0%B5%D0%BB%D0%B8%D0%B7%D1%8B/-%D1%82%D0%BE%D0%BF-%D1%8E%D1%82%D1%83%D0%B1.jpg"}
    ]
  },
  "xassa": {
    photo: "https://rhymesmusic.ru/photos/1/%D0%BA%D0%B0%D1%82%D0%B0%D0%BB%D0%BE%D0%B3%20%D0%B0%D1%80%D1%82%D0%B8%D1%81%D1%82%D0%BE%D0%B2/%D1%85%D0%B0%D1%81%D1%81%D0%B0/thumb/1441_-%D0%BA-%D1%85%D0%B0%D1%81%D1%81%D0%B0.jpg",
    socials: [
      {"name": "TikTok", "url": "https://www.tiktok.com/@xassa_offical"},
      {"name": "Instagram", "url": "https://www.instagram.com/xassa_offical/"},
      {"name": "VK", "url": "https://vk.com/xassa_official_group"},
      {"name": "YouTube", "url": "https://www.youtube.com/channel/UCQv3_6Ts6naKoEctIE5pdpg"}
    ],
    releases: [
      {"title": "Самолёт", "artists": "Xassa, BODIEV", "type": "Сингл", "cover": "https://i.scdn.co/image/ab67616d0000b2731f78594fa712582040158b19"},
      {"title": "All Night", "artists": "Xassa", "type": "Сингл", "cover": "https://i.scdn.co/image/ab67616d0000b273bb57fa5add87be6494a82099"},
      {"title": "Beautiful Life", "artists": "Xassa", "type": "Сингл", "cover": "https://i.scdn.co/image/ab67616d0000b2733dfe0dc18d2aae431acea52c"},
      {"title": "Романтик", "artists": "Xassa", "type": "Сингл", "cover": "https://i.scdn.co/image/ab67616d0000b273bbd1cb7b2de296cc68e53e14"},
      {"title": "Грехи", "artists": "Xassa, BODIEV", "type": "Сингл", "cover": "https://i.scdn.co/image/ab67616d0000b273bcf176927485a2f4ef3f140e"},
      {"title": "Дикари", "artists": "Xassa", "type": "Сингл", "cover": "https://i.scdn.co/image/ab67616d0000b27386298ec8535c7d024e37bef1"},
      {"title": "Белая майка", "artists": "Xassa", "type": "Сингл", "cover": "https://rhymesmusic.ru/photos/1/%D0%BA%D0%B0%D1%82%D0%B0%D0%BB%D0%BE%D0%B3%20%D0%B0%D1%80%D1%82%D0%B8%D1%81%D1%82%D0%BE%D0%B2/%D1%85%D0%B0%D1%81%D1%81%D0%B0/-%D1%85%D0%B0%D1%81%D1%81%D0%B0-%D0%B1%D0%B5%D0%BB%D0%B0%D1%8F-%D0%BC%D0%B0%D0%B9%D0%BA%D0%B0.jpg"}
    ],
    popular: [
      {"title": "Дикари", "artists": "Xassa", "streams": 6204926, "cover": "https://i.scdn.co/image/ab67616d0000b27386298ec8535c7d024e37bef1"},
      {"title": "Капитан", "artists": "Xassa", "streams": 2392414, "cover": "https://i.scdn.co/image/ab67616d0000b27373660cc10ef4fc9fa9578a41"},
      {"title": "Романтик", "artists": "Xassa", "streams": 2010215, "cover": "https://i.scdn.co/image/ab67616d0000b273bbd1cb7b2de296cc68e53e14"},
      {"title": "Beautiful Life", "artists": "Xassa", "streams": 1267654, "cover": "https://i.scdn.co/image/ab67616d0000b2733dfe0dc18d2aae431acea52c"},
      {"title": "Грехи", "artists": "Xassa, BODIEV", "streams": 1145391, "cover": "https://i.scdn.co/image/ab67616d0000b273bcf176927485a2f4ef3f140e"},
      {"title": "All Night", "artists": "Xassa", "streams": 680197, "cover": "https://i.scdn.co/image/ab67616d0000b273bb57fa5add87be6494a82099"},
      {"title": "Самолёт", "artists": "Xassa, BODIEV", "streams": 619184, "cover": "https://i.scdn.co/image/ab67616d0000b2731f78594fa712582040158b19"},
      {"title": "Потом", "artists": "BODIEV, Xassa", "streams": 558152, "cover": "https://i.scdn.co/image/ab67616d0000b273c22fe833a18f0aa9cab036c2"},
      {"title": "Не кусай", "artists": "Xassa", "streams": 475543, "cover": "https://i.scdn.co/image/ab67616d0000b273d2af989306795ae5e81f195d"},
      {"title": "Девочкам курить некрасиво", "artists": "Xassa", "streams": 245260, "cover": "https://i.scdn.co/image/ab67616d0000b273a15c9d30bd303348445aa706"}
    ]
  },
  "bodiev": {
    photo: "https://rhymesmusic.ru/photos/1/%D0%BA%D0%B0%D1%82%D0%B0%D0%BB%D0%BE%D0%B3%20%D0%B0%D1%80%D1%82%D0%B8%D1%81%D1%82%D0%BE%D0%B2/%D0%B1%D0%BE%D0%B4%D0%B8%D0%B5%D0%B2/thumb/1441_-%D0%BA-%D0%B1%D0%BE%D0%B4%D0%B8%D0%B5%D0%B2.jpg",
    socials: [
      {"name": "TikTok", "url": "https://www.tiktok.com/@bodiev1"},
      {"name": "Instagram", "url": "https://www.instagram.com/bodiev_/"},
      {"name": "VK", "url": "https://vk.com/bodievmuz"},
      {"name": "YouTube", "url": "https://www.youtube.com/channel/UC5HilN83EUYqCXi5LE0ZDDw"}
    ],
    releases: [
      {"title": "Самолёт", "artists": "Xassa, BODIEV", "type": "Сингл", "cover": "https://i.scdn.co/image/ab67616d0000b2731f78594fa712582040158b19"},
      {"title": "Миллион", "artists": "BODIEV", "type": "Сингл", "cover": "https://rhymesmusic.ru/photos/1/%D0%BA%D0%B0%D1%82%D0%B0%D0%BB%D0%BE%D0%B3%20%D0%B0%D1%80%D1%82%D0%B8%D1%81%D1%82%D0%BE%D0%B2/%D0%B1%D0%BE%D0%B4%D0%B8%D0%B5%D0%B2/-%D0%BC%D0%B8%D0%BB%D0%BB%D0%B8%D0%BE%D0%BD.jpg"},
      {"title": "Караван", "artists": "BODIEV", "type": "Сингл", "cover": "https://i.scdn.co/image/ab67616d0000b27359dba8ccc528c25dbe0cad92"},
      {"title": "Бэнгер", "artists": "BODIEV, Ulukmanapo", "type": "Сингл", "cover": "https://rhymesmusic.ru/photos/1/%D0%BA%D0%B0%D1%82%D0%B0%D0%BB%D0%BE%D0%B3%20%D0%B0%D1%80%D1%82%D0%B8%D1%81%D1%82%D0%BE%D0%B2/%D0%B1%D0%BE%D0%B4%D0%B8%D0%B5%D0%B2/-%D0%B1%D0%BE%D0%B4%D0%B8%D0%B5%D0%B2-%D0%B1%D1%8D%D0%BD%D0%B3%D0%B5%D1%80.jpg"},
      {"title": "Грехи", "artists": "Xassa, BODIEV", "type": "Сингл", "cover": "https://i.scdn.co/image/ab67616d0000b273bcf176927485a2f4ef3f140e"},
      {"title": "На связи", "artists": "BODIEV, Ганвест", "type": "Сингл", "cover": "https://rhymesmusic.ru/photos/1/%D0%BA%D0%B0%D1%82%D0%B0%D0%BB%D0%BE%D0%B3%20%D0%B0%D1%80%D1%82%D0%B8%D1%81%D1%82%D0%BE%D0%B2/%D0%B1%D0%BE%D0%B4%D0%B8%D0%B5%D0%B2/-%D0%B1%D0%BE%D0%B4%D0%B8%D0%B5%D0%B2-%D0%BD%D0%B0%D1%81%D0%B2%D1%8F%D0%B7%D0%B8.jpg"}
    ],
    popular: [
      {"title": "Крузак 200", "artists": "BODIEV", "streams": 9726980, "cover": "https://i.scdn.co/image/ab67616d0000b2739f8414317ee1ffa081c58207"},
      {"title": "Караван", "artists": "BODIEV", "streams": 6471351, "cover": "https://i.scdn.co/image/ab67616d0000b27359dba8ccc528c25dbe0cad92"},
      {"title": "Самурай", "artists": "BODIEV", "streams": 4097405, "cover": "https://i.scdn.co/image/ab67616d0000b2735c9d7d87b41069aa1b3fb56d"},
      {"title": "Карусели", "artists": "BODIEV", "streams": 3294265, "cover": "https://i.scdn.co/image/ab67616d0000b27308922424c1bdcd8eb53ccc4a"},
      {"title": "Чёрный мерин", "artists": "BODIEV", "streams": 2632655, "cover": "https://i.scdn.co/image/ab67616d0000b27375a2c355832cb3724b83c1f7"},
      {"title": "No pasaran", "artists": "BODIEV", "streams": 2539808, "cover": "https://i.scdn.co/image/ab67616d0000b2739bbac567a5542fe0fcc5c51b"},
      {"title": "Её зелёные глаза", "artists": "BODIEV", "streams": 649955, "cover": "https://i.scdn.co/image/ab67616d0000b27376200be5511f05c365a44e1b"},
      {"title": "Самолёт", "artists": "Xassa, BODIEV", "streams": 619184, "cover": "https://i.scdn.co/image/ab67616d0000b2731f78594fa712582040158b19"},
      {"title": "Потом", "artists": "BODIEV, Xassa", "streams": 558152, "cover": "https://i.scdn.co/image/ab67616d0000b273c22fe833a18f0aa9cab036c2"},
      {"title": "Фиеста", "artists": "BODIEV", "streams": 159515, "cover": "https://i.scdn.co/image/ab67616d0000b273b8dbbccb4b5aa69a04979b78"}
    ],
    events: [
      {"date": "2022-06-01", "title": "Премьера сингла «Между девятин»", "text": "Отрывок трека ещё до релиза попал в чарт самых шазамируемых песен России.", "image": "https://rhymesmusic.ru/photos/1/%D1%80%D0%B5%D0%BB%D0%B8%D0%B7%D1%8B/-%D0%B1%D0%BE%D0%B4%D0%B8%D0%B5%D0%B2-%D1%8D%D0%BF%D0%BE%D0%BB.jpg"}
    ]
  },
  "dlb": {
    tagline: "Bassline из России",
    bio: "DLB — коллектив, который работает в жанре bassline: на российской сцене у него в этом почти нет конкурентов.",
    photo: "https://rhymesmusic.ru/photos/1/%D0%BA%D0%B0%D1%82%D0%B0%D0%BB%D0%BE%D0%B3%20%D0%B0%D1%80%D1%82%D0%B8%D1%81%D1%82%D0%BE%D0%B2/%D0%B4%D0%BB%D0%B1/thumb/1441_-%D0%BA-%D0%B4%D0%BB%D0%B1.jpg",
    socials: [
      {"name": "TikTok", "url": "https://www.tiktok.com/@dlb.official"},
      {"name": "Instagram", "url": "https://www.instagram.com/dlb.official/"},
      {"name": "VK", "url": "https://vk.com/officialdlb"},
      {"name": "YouTube", "url": "https://www.youtube.com/channel/UCwtQ9WInVN2INeGfj_9Rsbw"}
    ],
    releases: [
      {"title": "Late Night Show", "artists": "DLB", "type": "Альбом", "cover": "https://rhymesmusic.ru/photos/1/%D0%BA%D0%B0%D1%82%D0%B0%D0%BB%D0%BE%D0%B3%20%D0%B0%D1%80%D1%82%D0%B8%D1%81%D1%82%D0%BE%D0%B2/%D0%B4%D0%BB%D0%B1/-%D0%B4%D0%BB%D0%B1-%D0%B0%D0%BB%D1%8C%D0%B1%D0%BE%D0%BC.jpeg"},
      {"title": "Беспредел", "artists": "DLB", "type": "Сингл", "cover": "https://rhymesmusic.ru/photos/1/%D0%BA%D0%B0%D1%82%D0%B0%D0%BB%D0%BE%D0%B3%20%D0%B0%D1%80%D1%82%D0%B8%D1%81%D1%82%D0%BE%D0%B2/%D0%B4%D0%BB%D0%B1/-%D0%B4%D0%BB%D0%B1-%D0%B1%D0%B5%D1%81%D0%BF%D1%80%D0%B5%D0%B4%D0%B5%D0%BB.jpg"},
      {"title": "На повтор", "artists": "DLB, Джеди", "type": "Сингл", "cover": "https://rhymesmusic.ru/photos/1/%D0%BA%D0%B0%D1%82%D0%B0%D0%BB%D0%BE%D0%B3%20%D0%B0%D1%80%D1%82%D0%B8%D1%81%D1%82%D0%BE%D0%B2/%D0%B4%D0%BB%D0%B1/-%D0%B4%D0%BB%D0%B1-%D0%BD%D0%B0%D0%BF%D0%BE%D0%B2%D1%82%D0%BE%D1%80.jpg"},
      {"title": "100%", "artists": "DLB, Хрися", "type": "Сингл", "cover": "https://rhymesmusic.ru/photos/1/%D0%BA%D0%B0%D1%82%D0%B0%D0%BB%D0%BE%D0%B3%20%D0%B0%D1%80%D1%82%D0%B8%D1%81%D1%82%D0%BE%D0%B2/%D0%B4%D0%BB%D0%B1/-%D0%B4%D0%BB%D0%B1-1000.jpg"},
      {"title": "11 литров воды", "artists": "DLB", "type": "Сингл", "cover": "https://rhymesmusic.ru/photos/1/%D0%BA%D0%B0%D1%82%D0%B0%D0%BB%D0%BE%D0%B3%20%D0%B0%D1%80%D1%82%D0%B8%D1%81%D1%82%D0%BE%D0%B2/%D0%B4%D0%BB%D0%B1/-%D0%B4%D0%BB%D0%B1-11k.jpg"}
    ],
    popular: [
      {"title": "welcome to russia", "artists": "dlb", "streams": 5423277, "cover": "https://i.scdn.co/image/ab67616d0000b273db6561441d5cfb10703014d4"},
      {"title": "ультрашоколад", "artists": "dlb", "streams": 2822369, "cover": "https://i.scdn.co/image/ab67616d0000b273e903ac27d19f7653f7e738ba"},
      {"title": "катка", "artists": "dlb", "streams": 2652342, "cover": "https://i.scdn.co/image/ab67616d0000b273649586caca3c30100c891ab9"},
      {"title": "МОЛОДЫ", "artists": "dlb, COLDCLOUD", "streams": 2567679, "cover": "https://i.scdn.co/image/ab67616d0000b2730e0a505f4243cd8f6de8c522"},
      {"title": "зайчик и барбосик", "artists": "dlb", "streams": 1874903, "cover": "https://i.scdn.co/image/ab67616d0000b2738af560305fdece5ae1b4e791"},
      {"title": "мне не нравится", "artists": "dlb", "streams": 1828338, "cover": "https://i.scdn.co/image/ab67616d0000b273a719f3a75b2de405680b1894"},
      {"title": "село", "artists": "dlb", "streams": 1018174, "cover": "https://i.scdn.co/image/ab67616d0000b2738af560305fdece5ae1b4e791"},
      {"title": "телега", "artists": "dlb", "streams": 844383, "cover": "https://i.scdn.co/image/ab67616d0000b273e903ac27d19f7653f7e738ba"},
      {"title": "late night", "artists": "dlb", "streams": 670715, "cover": "https://i.scdn.co/image/ab67616d0000b273071f051e2bac7c1bb93f4a2d"}
    ]
  },
  "polmateri": {
    tagline: "Молодёжная образовательная рок-группировка",
    photo: "https://rhymesmusic.ru/photos/1/%D0%BA%D0%B0%D1%82%D0%B0%D0%BB%D0%BE%D0%B3%20%D0%B0%D1%80%D1%82%D0%B8%D1%81%D1%82%D0%BE%D0%B2/%D0%BF%D0%BE%D0%BB%D0%BC%D0%B0%D1%82%D0%B5%D1%80%D0%B8/thumb/1441_-%D0%BA-%D0%BF%D0%BE%D0%BB%D0%BC%D0%B0%D1%82%D0%B5%D1%80%D0%B8.jpg",
    socials: [
      {"name": "TikTok", "url": "https://www.tiktok.com/@margoldin"},
      {"name": "VK", "url": "https://vk.com/polmateri"},
      {"name": "Instagram", "url": "https://www.instagram.com/polmamkiband/"}
    ],
    releases: [
      {"title": "Маша", "artists": "Полматери", "type": "Сингл", "cover": "https://i.scdn.co/image/ab67616d0000b2737ea1a25b117a54d88a6a1b45", "preview": "https://p.scdn.co/mp3-preview/4f8e010b22be9268abe1e32d196dadab4568478a?cid=0a456d853fde4ddc9d353d6349a1de8e", "spotify": "track/64epifHS5CvRUVgKEDbRJm"},
      {"title": "Псы попадут в рай", "artists": "Полматери", "type": "Сингл", "cover": "https://i.scdn.co/image/ab67616d0000b273f2bc3b8efeadfe9a8280b10c", "preview": "https://p.scdn.co/mp3-preview/548b2fa3a5ac7803a1f9f77f2c61df5ea056b5a7?cid=0a456d853fde4ddc9d353d6349a1de8e", "spotify": "track/3yDdBYJc55fW1l56EsOgeC"},
      {"title": "Песни для девственников, ч. 2", "artists": "Полматери", "type": "Альбом", "cover": "https://rhymesmusic.ru/photos/3/%D0%BA%D0%B0%D1%82%D0%B0%D0%BB%D0%BE%D0%B3/%D0%BF%D0%BE%D0%BB%D0%BC%D0%B0%D1%82%D0%B5%D1%80%D0%B8/-%D0%BF%D0%BE%D0%BB%D0%BC%D0%B0%D1%82%D0%B5%D1%80%D0%B8-%D0%BF%D0%B5%D1%81%D0%BD%D0%B82.jpeg", "preview": "https://p.scdn.co/mp3-preview/b88444d49987795eed506ca4a1d8f2f6f808097c?cid=0a456d853fde4ddc9d353d6349a1de8e"}
    ],
    popular: [
      {"title": "ярче звёзд", "artists": "Полматери", "streams": 11323636, "cover": "https://i.scdn.co/image/ab67616d0000b2732f093ad573ee3d6ea2b6ff69", "preview": "https://p.scdn.co/mp3-preview/96efdef41b37b531926f49207985f0345c6b027b?cid=9f8dbb1747904fbca4eb9c7989c4339d"},
      {"title": "маша", "artists": "Полматери", "streams": 6167720, "cover": "https://i.scdn.co/image/ab67616d0000b2737ea1a25b117a54d88a6a1b45", "preview": "https://p.scdn.co/mp3-preview/5652443fca9f100ab37cd0fc3284bbc766253f69?cid=9f8dbb1747904fbca4eb9c7989c4339d"},
      {"title": "мне похуй я панк", "artists": "Полматери", "streams": 5182409, "cover": "https://i.scdn.co/image/ab67616d0000b273cc5267b4fa1074779b1b6851", "preview": "https://p.scdn.co/mp3-preview/e5a3c4dc44c415ac73e9ad2da98ce60b44e8129f?cid=9f8dbb1747904fbca4eb9c7989c4339d"},
      {"title": "нам канец!", "artists": "Полматери", "streams": 5060317, "cover": "https://i.scdn.co/image/ab67616d0000b273f49628d249fbe69e2c435a2a", "preview": "https://p.scdn.co/mp3-preview/fe04b4498201992c5c8d18b2c5732413a61bb4ca?cid=9f8dbb1747904fbca4eb9c7989c4339d"},
      {"title": "я неудачник", "artists": "Полматери", "streams": 4320770, "cover": "https://i.scdn.co/image/ab67616d0000b273969be2e64f39175ef7d40f6c", "preview": "https://p.scdn.co/mp3-preview/2c9df3d6b16ff652c935a85b4f21d25599323fc0?cid=9f8dbb1747904fbca4eb9c7989c4339d"},
      {"title": "ХОЧУ СДОХНУТЬ", "artists": "Полматери", "streams": 4214944, "cover": "https://i.scdn.co/image/ab67616d0000b2731616c2e098febdedc1f0a011", "preview": "https://p.scdn.co/mp3-preview/227216222bc6b725da2f65692d98e6945fbe731d?cid=9f8dbb1747904fbca4eb9c7989c4339d"},
      {"title": "типичная реперская песня", "artists": "Полматери", "streams": 4194424, "cover": "https://i.scdn.co/image/ab67616d0000b273969be2e64f39175ef7d40f6c", "preview": "https://p.scdn.co/mp3-preview/2d922aff5e5cfec5abc7fdb81b3459e50ef5461c?cid=9f8dbb1747904fbca4eb9c7989c4339d"},
      {"title": "псы попадут в рай", "artists": "Полматери", "streams": 3907154, "cover": "https://i.scdn.co/image/ab67616d0000b273f2bc3b8efeadfe9a8280b10c", "preview": "https://p.scdn.co/mp3-preview/1f0e8dbbbdcfd90f5d50e782778f6f88da6677d2?cid=9f8dbb1747904fbca4eb9c7989c4339d"},
      {"title": "ненавижу свою жизнь!!!", "artists": "Полматери", "streams": 3491824, "cover": "https://i.scdn.co/image/ab67616d0000b273a910a2871fb899bda5079217", "preview": "https://p.scdn.co/mp3-preview/d2ec9d7d72eca997aa9197b789c20b44c90602a3?cid=9f8dbb1747904fbca4eb9c7989c4339d"},
      {"title": "тачки четыре", "artists": "Полматери", "streams": 3106181, "cover": "https://i.scdn.co/image/ab67616d0000b2733fda0d8d2b020f234e1b93fd", "preview": "https://p.scdn.co/mp3-preview/773cfb1381fa413fb94dddd55b403a501dafde6f?cid=9f8dbb1747904fbca4eb9c7989c4339d"}
    ]
  },
  "lxner": {
    photo: "https://rhymesmusic.ru/photos/1/%D0%BA%D0%B0%D1%82%D0%B0%D0%BB%D0%BE%D0%B3%20%D0%B0%D1%80%D1%82%D0%B8%D1%81%D1%82%D0%BE%D0%B2/%D0%BB%D0%BE%D0%BD%D0%B5%D1%80/thumb/1441_-%D0%BA-%D0%BB%D0%BE%D0%BD%D0%B5%D1%802.jpg",
    socials: [
      {"name": "TikTok", "url": "https://www.tiktok.com/@xolxner"},
      {"name": "Instagram", "url": "https://www.instagram.com/xolxner/"},
      {"name": "VK", "url": "https://vk.com/xolxnerxo"}
    ],
    releases: [
      {"title": "n1ght visi0n", "artists": "LXNER", "type": "Сингл", "cover": "https://i.scdn.co/image/ab67616d0000b273c5de19e16d9918a9a52f7ffd"},
      {"title": "Adaptive Strike", "artists": "shadowraze, LXNER, quiizzzmeow", "type": "Сингл", "cover": "https://i.scdn.co/image/ab67616d0000b273aafe4598bce4d31fca0a51b2"},
      {"title": "Elysium", "artists": "LXNER", "type": "Сингл", "cover": "https://rhymesmusic.ru/photos/1/%D0%BA%D0%B0%D1%82%D0%B0%D0%BB%D0%BE%D0%B3%20%D0%B0%D1%80%D1%82%D0%B8%D1%81%D1%82%D0%BE%D0%B2/%D0%BB%D0%BE%D0%BD%D0%B5%D1%80/-lxner-elysium.jpg"},
      {"title": "Лёд", "artists": "WENARO, LXNER", "type": "Сингл", "cover": "https://i.scdn.co/image/ab67616d0000b273761776ec62c9f8a6be00a244"}
    ],
    popular: [
      {"title": "Лёд", "artists": "WENARO, LXNER", "streams": 32342467, "cover": "https://i.scdn.co/image/ab67616d0000b273761776ec62c9f8a6be00a244"},
      {"title": "adaptive strike", "artists": "shadowraze, LXNER, quiizzzmeow", "streams": 18447406, "cover": "https://i.scdn.co/image/ab67616d0000b273aafe4598bce4d31fca0a51b2"},
      {"title": "Крышу сносит", "artists": "LXNER, quiizzzmeow", "streams": 5392152, "cover": "https://i.scdn.co/image/ab67616d0000b27374d7b1d033e1640897a9c556"},
      {"title": "Crowbars", "artists": "LXNER, takeluf", "streams": 4864387, "cover": "https://i.scdn.co/image/ab67616d0000b273545afb8046499746fb093bcb"},
      {"title": "связь", "artists": "LXNER, rizza", "streams": 3785106, "cover": "https://i.scdn.co/image/ab67616d0000b2734ac6ec4a11a062f4f97ba003"},
      {"title": "Девочка-аниме", "artists": "Horoshiyagni, ТРАВМА, Клим, retroyse, LXNER", "streams": 3557666, "cover": "https://i.scdn.co/image/ab67616d0000b27341caf3dcf53ac61de890b6bf"},
      {"title": "Забываю", "artists": "LXNER, lazyy", "streams": 1767953, "cover": "https://i.scdn.co/image/ab67616d0000b27386a4a9e8bfef3c2af193d137"},
      {"title": "Звёзды", "artists": "LXNER, WENARO", "streams": 1368839, "cover": "https://i.scdn.co/image/ab67616d0000b273f6ab83b0d4341fc554060ed5"},
      {"title": "Неверно", "artists": "Midix, LXNER", "streams": 868948, "cover": "https://i.scdn.co/image/ab67616d0000b273dcd045bf81a98fee54e4240f"},
      {"title": "n1ght visi0n", "artists": "LXNER", "streams": 208471, "cover": "https://i.scdn.co/image/ab67616d0000b273c5de19e16d9918a9a52f7ffd"}
    ]
  },
  "ivan-valeev": {
    bio: "Музыкант из Республики Марий Эл. Широкую известность получил с треками «Novella», «Aromat», «Пьяная», «Заберу» и «Парадокс».",
    photo: "https://rhymesmusic.ru/photos/1/%D0%BA%D0%B0%D1%82%D0%B0%D0%BB%D0%BE%D0%B3%20%D0%B0%D1%80%D1%82%D0%B8%D1%81%D1%82%D0%BE%D0%B2/%D0%B8%D0%B2%D0%B0%D0%BD%20%D0%B2%D0%B0%D0%BB%D0%B5%D0%B5%D0%B2/thumb/1441_-%D0%BA-%D0%B2%D0%B0%D0%BB%D0%B5%D0%B5%D0%B2.jpg",
    socials: [
      {"name": "Instagram", "url": "https://www.instagram.com/ivan_valeev/"},
      {"name": "VK", "url": "https://vk.com/valeevmusic"},
      {"name": "TikTok", "url": "https://www.tiktok.com/@ivan__valeev"},
      {"name": "YouTube", "url": "https://www.youtube.com/channel/UCEIREjJtvDAfN-CfGgbcG2w"}
    ],
    releases: [
      {"title": "Memories", "artists": "IVAN VALEEV", "type": "Сингл", "cover": "https://i.scdn.co/image/ab67616d0000b273bdf70b253c970b5b6de2655d", "preview": "https://p.scdn.co/mp3-preview/61df39551a3305d5bc50cdc2510852a7853a6c59?cid=6bc01e97e5904e1a9c49e8bcd515309c"},
      {"title": "Химия", "artists": "IVAN VALEEV", "type": "Сингл", "cover": "https://i.scdn.co/image/ab67616d0000b27319c5c8ef37f78a0d19d21abf", "preview": "https://p.scdn.co/mp3-preview/5a85e2eeb7904ef0544c45e1204c79b6cd52ffd1?cid=6bc01e97e5904e1a9c49e8bcd515309c"},
      {"title": "WELOVE", "artists": "IVAN VALEEV", "type": "Альбом", "cover": "https://rhymesmusic.ru/photos/1/%D0%BA%D0%B0%D1%82%D0%B0%D0%BB%D0%BE%D0%B3%20%D0%B0%D1%80%D1%82%D0%B8%D1%81%D1%82%D0%BE%D0%B2/%D0%B8%D0%B2%D0%B0%D0%BD%20%D0%B2%D0%B0%D0%BB%D0%B5%D0%B5%D0%B2/-%D0%B2%D0%B0%D0%BB%D0%B5%D0%B5%D0%B2-%D0%BB%D0%BE%D0%B2.jpg", "preview": "https://p.scdn.co/mp3-preview/f484c5af97c2c0a861e7922e2ee1e5ce80a0ff6d?cid=6bc01e97e5904e1a9c49e8bcd515309c"}
    ],
    popular: [
      {"title": "Novella", "artists": "IVAN VALEEV", "streams": 18446982, "cover": "https://i.scdn.co/image/ab67616d0000b27367ced6ad46e68128380bdd49", "preview": "https://p.scdn.co/mp3-preview/f484c5af97c2c0a861e7922e2ee1e5ce80a0ff6d?cid=9f8dbb1747904fbca4eb9c7989c4339d"},
      {"title": "Заберу (Frost & Robby Mond & Wonder's Radio Remix)", "artists": "IVAN VALEEV", "streams": 11563653, "cover": "https://i.scdn.co/image/ab67616d0000b2734419aa3ce9aa18861d41eebc", "preview": "https://p.scdn.co/mp3-preview/b356093b33ef8520a2de74fc8a1d2c4fd6089c1f?cid=9f8dbb1747904fbca4eb9c7989c4339d"},
      {"title": "Парадокс (Frost & Robby Mond & Wonder's Radio Remix)", "artists": "IVAN VALEEV", "streams": 3052742, "cover": "https://i.scdn.co/image/ab67616d0000b2737fddbe2b58740440ae54a55f", "preview": "https://p.scdn.co/mp3-preview/10f7c570602fdd7a833bbecaba0e8c7981ca755c?cid=9f8dbb1747904fbca4eb9c7989c4339d"},
      {"title": "Пьяная", "artists": "IVAN VALEEV, Andery Toronto", "streams": 3036347, "cover": "https://i.scdn.co/image/ab67616d0000b27367ced6ad46e68128380bdd49", "preview": "https://p.scdn.co/mp3-preview/557e8879c0b2b99374fa0b98366319b790939808?cid=9f8dbb1747904fbca4eb9c7989c4339d"},
      {"title": "Парадокс", "artists": "IVAN VALEEV", "streams": 2521992, "cover": "https://i.scdn.co/image/ab67616d0000b273756da62d6ba04a87b5a0c11a", "preview": "https://p.scdn.co/mp3-preview/85a9c3c9c9635fdab2619278db3a1c430d039a50?cid=9f8dbb1747904fbca4eb9c7989c4339d"},
      {"title": "Bye Bye", "artists": "IVAN VALEEV", "streams": 593887, "cover": "https://i.scdn.co/image/ab67616d0000b2734d9aba444455550851e476f9", "preview": "https://p.scdn.co/mp3-preview/53053270b8fe4b9a5f5dda56aae1a44cafc0e515?cid=9f8dbb1747904fbca4eb9c7989c4339d"},
      {"title": "Не чувствую", "artists": "IVAN VALEEV", "streams": 271730, "cover": "https://i.scdn.co/image/ab67616d0000b273f79484d06067280d5667cfa6", "preview": "https://p.scdn.co/mp3-preview/531781b0a5962d10fe058cbc6f3618015248f81c?cid=9f8dbb1747904fbca4eb9c7989c4339d"},
      {"title": "Memories", "artists": "IVAN VALEEV", "streams": 188347, "cover": "https://i.scdn.co/image/ab67616d0000b273bdf70b253c970b5b6de2655d", "preview": "https://p.scdn.co/mp3-preview/61df39551a3305d5bc50cdc2510852a7853a6c59?cid=9f8dbb1747904fbca4eb9c7989c4339d"}
    ],
    videos: [
      {"id": "-62_AMtHWco", "title": "Novella"},
      {"id": "Dox7i-8X11k", "title": "Февраль"},
      {"id": "r7p2kWh65RA", "title": "Зачем ты мне врёшь"}
    ]
  },
  "quiizzzmeow": {
    photo: "https://rhymesmusic.ru/photos/1/%D0%BA%D0%B0%D1%82%D0%B0%D0%BB%D0%BE%D0%B3%20%D0%B0%D1%80%D1%82%D0%B8%D1%81%D1%82%D0%BE%D0%B2/%D0%BA%D0%B8%D0%B7%D0%BC%D1%8F%D1%83/thumb/1441_-%D0%BA-%D0%BA%D0%B8%D0%B7%D0%BC%D1%8F%D1%83.jpg",
    socials: [
      {"name": "TikTok", "url": "https://www.tiktok.com/@quiizzzmeow"},
      {"name": "Instagram", "url": "https://www.instagram.com/quiizzzmeow/"},
      {"name": "VK", "url": "https://vk.com/quiizzzmeow"},
      {"name": "YouTube", "url": "https://www.youtube.com/c/quiizzzmeow"}
    ],
    releases: [
      {"title": "Альбом, который вы не ждали", "artists": "quiizzzmeow", "type": "Альбом", "cover": "https://i.scdn.co/image/ab67616d0000b2739b07288494e5851e53621717"},
      {"title": "Боль", "artists": "quiizzzmeow, Мэйби Бэйби", "type": "Сингл", "cover": "https://i.scdn.co/image/ab67616d0000b273edcb5029ede47a0b7b2f7b89", "spotify": "album/3YXGPmL4F6RuPKCLAmIiCL"},
      {"title": "Adaptive Strike", "artists": "shadowraze, LXNER, quiizzzmeow", "type": "Сингл", "cover": "https://i.scdn.co/image/ab67616d0000b273aafe4598bce4d31fca0a51b2"},
      {"title": "Крышу сносит", "artists": "LXNER, quiizzzmeow", "type": "Сингл", "cover": "https://i.scdn.co/image/ab67616d0000b27374d7b1d033e1640897a9c556"},
      {"title": "Сети", "artists": "quiizzzmeow", "type": "Сингл", "cover": "https://i.scdn.co/image/ab67616d0000b273c0009ad7c2bb2707dc369765"},
      {"title": "Aomine Daiki", "artists": "quiizzzmeow", "type": "Сингл", "cover": "https://i.scdn.co/image/ab67616d0000b2735858c3d5d5c9e5caac22563e"},
      {"title": "Звонки", "artists": "quiizzzmeow", "type": "Сингл", "cover": "https://rhymesmusic.ru/photos/1/%D0%BA%D0%B0%D1%82%D0%B0%D0%BB%D0%BE%D0%B3%20%D0%B0%D1%80%D1%82%D0%B8%D1%81%D1%82%D0%BE%D0%B2/%D0%BA%D0%B8%D0%B7%D0%BC%D1%8F%D1%83/-%D0%BA%D0%B8%D0%B7%D0%BC%D1%8F%D1%83-%D0%B7%D0%B2%D0%BE%D0%BD%D0%BA%D0%B8.jpg"}
    ],
    popular: [
      {"title": "Aomine Daiki", "artists": "quiizzzmeow", "streams": 23901389, "cover": "https://i.scdn.co/image/ab67616d0000b2735858c3d5d5c9e5caac22563e"},
      {"title": "adaptive strike", "artists": "shadowraze, LXNER, quiizzzmeow", "streams": 18447406, "cover": "https://i.scdn.co/image/ab67616d0000b273aafe4598bce4d31fca0a51b2"},
      {"title": "сети", "artists": "quiizzzmeow", "streams": 10880298, "cover": "https://i.scdn.co/image/ab67616d0000b273c0009ad7c2bb2707dc369765"},
      {"title": "Крышу сносит", "artists": "LXNER, quiizzzmeow", "streams": 5392152, "cover": "https://i.scdn.co/image/ab67616d0000b27374d7b1d033e1640897a9c556"},
      {"title": "Alohadance (Remix)", "artists": "quiizzzmeow", "streams": 4958917, "cover": "https://i.scdn.co/image/ab67616d0000b273c3292a1642e8e007113ba8dd"},
      {"title": "Слышу как ты дышишь", "artists": "Midix, quiizzzmeow", "streams": 4237022, "cover": "https://i.scdn.co/image/ab67616d0000b273dcd045bf81a98fee54e4240f"},
      {"title": "JDM NFS", "artists": "shadowraze, quiizzzmeow, Midix, jzxdx", "streams": 1949449, "cover": "https://i.scdn.co/image/ab67616d0000b273cfadd6c92ac5f987e18a5cc4"},
      {"title": "Боль", "artists": "quiizzzmeow, Мэйби Бэйби", "streams": 1548022, "cover": "https://i.scdn.co/image/ab67616d0000b273edcb5029ede47a0b7b2f7b89"},
      {"title": "Танто", "artists": "quiizzzmeow, Midix", "streams": 430048, "cover": "https://i.scdn.co/image/ab67616d0000b2739b07288494e5851e53621717"},
      {"title": "Chainsawman", "artists": "quiizzzmeow", "streams": 260219, "cover": "https://i.scdn.co/image/ab67616d0000b2739b07288494e5851e53621717"}
    ]
  },
  "pyrokinesis": {
    bio: "Андрей Федорович родом из Крыма, начинал с текстов для онлайн-баттлов. Его рэп мрачный и концептуальный: альбомы перекликаются друг с другом, а в песнях много отсылок к мифологии, религии и литературе. Псевдоним взят из романа Стивена Кинга «Воспламеняющая взглядом».",
    photo: "https://rhymesmusic.ru/photos/1/%D0%BA%D0%B0%D1%82%D0%B0%D0%BB%D0%BE%D0%B3%20%D0%B0%D1%80%D1%82%D0%B8%D1%81%D1%82%D0%BE%D0%B2/%D0%BF%D0%B8%D1%80%D0%BE%D0%BA%D0%B8%D0%BD%D0%B5%D0%B7%D0%B8%D1%81/thumb/1441_-%D0%BA-%D0%BF%D0%B8%D1%80%D0%BE.jpg",
    socials: [
      {"name": "TikTok", "url": "https://www.tiktok.com/@pyrokinesis_official"},
      {"name": "Instagram", "url": "https://www.instagram.com/andrushapyro/"},
      {"name": "VK", "url": "https://vk.com/pyrokinesis"},
      {"name": "YouTube", "url": "https://www.youtube.com/channel/UCThXFki2OJqG8379Rn_sIAw"}
    ],
    releases: [
      {"title": "Я краснею при тебе как...", "artists": "pyrokinesis", "type": "Сингл", "cover": "https://i.scdn.co/image/ab67616d0000b2735c98f44f9160f43b46c1c676"},
      {"title": "Легенда о Богине Мечей", "artists": "pyrokinesis", "type": "Альбом", "cover": "https://i.scdn.co/image/ab67616d0000b273ad1fa46fee9ed9ab36b218d9"},
      {"title": "Геометрия тьмы", "artists": "pyrokinesis", "type": "Альбом", "cover": "https://rhymesmusic.ru/photos/3/%D0%BA%D0%B0%D1%82%D0%B0%D0%BB%D0%BE%D0%B3/%D0%BF%D0%B8%D1%80%D0%BE%D0%BA%D0%B8%D0%BD%D0%B5%D0%B7%D0%B8%D1%81/-%D0%BF%D0%B8%D1%80%D0%BE-%D0%B3%D0%B5%D0%BE%D0%BC%D0%B5%D1%82%D1%80%D0%B8%D1%8F.jpg"},
      {"title": "ОКО", "artists": "pyrokinesis", "type": "Сингл", "cover": "https://i.scdn.co/image/ab67616d0000b27380a27427714daa9da9b6d23d"},
      {"title": "Питер, чай, не Франция", "artists": "pyrokinesis", "type": "Альбом", "cover": "https://rhymesmusic.ru/photos/1/%D0%BA%D0%B0%D1%82%D0%B0%D0%BB%D0%BE%D0%B3%20%D0%B0%D1%80%D1%82%D0%B8%D1%81%D1%82%D0%BE%D0%B2/%D0%BF%D0%B8%D1%80%D0%BE%D0%BA%D0%B8%D0%BD%D0%B5%D0%B7%D0%B8%D1%81/-%D0%BF%D0%B8%D1%80%D0%BE-%D0%BF%D0%B8%D1%82%D0%B5%D1%80.jpg"},
      {"title": "Моя милая пустота", "artists": "pyrokinesis", "type": "Альбом", "cover": "https://rhymesmusic.ru/photos/1/%D0%BA%D0%B0%D1%82%D0%B0%D0%BB%D0%BE%D0%B3%20%D0%B0%D1%80%D1%82%D0%B8%D1%81%D1%82%D0%BE%D0%B2/%D0%BF%D0%B8%D1%80%D0%BE%D0%BA%D0%B8%D0%BD%D0%B5%D0%B7%D0%B8%D1%81/-%D0%BF%D0%B8%D1%80%D0%BE-%D0%BF%D1%83%D1%81%D1%82%D0%BE%D1%82%D0%B0.jpg"}
    ],
    popular: [
      {"title": "Днями-ночами", "artists": "pyrokinesis, МУККА", "streams": 26708681, "cover": "https://i.scdn.co/image/ab67616d0000b273e41b1431cf63aa22f8198bbf", "preview": "https://p.scdn.co/mp3-preview/af7f25e25fe3b6997159dada69e37ac8bca2d5c8?cid=23917817e5d04cfa84952e02200ec7df"},
      {"title": "Цветами радуги", "artists": "pyrokinesis", "streams": 15879526, "cover": "https://i.scdn.co/image/ab67616d0000b2733c6bd98427dc611da7eff0a9"},
      {"title": "Сигаретка без кнопки", "artists": "pyrokinesis", "streams": 10146617, "cover": "https://i.scdn.co/image/ab67616d0000b2733c6bd98427dc611da7eff0a9"},
      {"title": "Зависимость", "artists": "pyrokinesis", "streams": 8106676, "cover": "https://i.scdn.co/image/ab67616d0000b273828b000a23d11c3015e8dbe3"},
      {"title": "Да что романтичного в птичках?", "artists": "pyrokinesis", "streams": 7765787, "cover": "https://i.scdn.co/image/ab67616d0000b273828b000a23d11c3015e8dbe3"},
      {"title": "Чёрное солнышко", "artists": "pyrokinesis", "streams": 3738158, "cover": "https://i.scdn.co/image/ab67616d0000b2733c6bd98427dc611da7eff0a9"},
      {"title": "ОКО", "artists": "pyrokinesis", "streams": 2257021, "cover": "https://i.scdn.co/image/ab67616d0000b27380a27427714daa9da9b6d23d"},
      {"title": "отказываю небу", "artists": "pyrokinesis", "streams": 1911797, "cover": "https://i.scdn.co/image/ab67616d0000b2736f2e39fee20c4f54518b39e5"},
      {"title": "я краснею при тебе как...", "artists": "pyrokinesis", "streams": 808691, "cover": "https://i.scdn.co/image/ab67616d0000b2735c98f44f9160f43b46c1c676"},
      {"title": "брошен", "artists": "pyrokinesis", "streams": 234489, "cover": "https://i.scdn.co/image/ab67616d0000b273701df87aa1660b31e3e94fa8"}
    ]
  },
  "kis-kis": {
    photo: "https://rhymesmusic.ru/photos/1/%D0%BA%D0%B0%D1%82%D0%B0%D0%BB%D0%BE%D0%B3%20%D0%B0%D1%80%D1%82%D0%B8%D1%81%D1%82%D0%BE%D0%B2/%D0%BA%D0%B8%D1%81%D0%BA%D0%B8%D1%81/thumb/1441_-%D0%BA%D0%BE-%D0%BA%D0%B8%D1%81.jpg",
    socials: [
      {"name": "Instagram", "url": "https://www.instagram.com/kiskisnotdead/"},
      {"name": "VK", "url": "https://vk.com/kiskisnotdead"},
      {"name": "YouTube", "url": "https://www.youtube.com/kiskisnotdead"}
    ],
    releases: [
      {"title": "Отчим", "artists": "кис-кис", "type": "Альбом", "cover": "https://rhymesmusic.ru/photos/1/%D0%BA%D0%B0%D1%82%D0%B0%D0%BB%D0%BE%D0%B3%20%D0%B0%D1%80%D1%82%D0%B8%D1%81%D1%82%D0%BE%D0%B2/%D0%BA%D0%B8%D1%81%D0%BA%D0%B8%D1%81/-%D0%BA%D0%B8%D1%81-%D0%BA%D0%B8%D1%81-%D0%BE%D1%82%D1%87%D0%B8%D0%BC.jpeg"},
      {"title": "Клетка", "artists": "кис-кис", "type": "Сингл", "cover": "https://rhymesmusic.ru/photos/1/%D0%BA%D0%B0%D1%82%D0%B0%D0%BB%D0%BE%D0%B3%20%D0%B0%D1%80%D1%82%D0%B8%D1%81%D1%82%D0%BE%D0%B2/%D0%BA%D0%B8%D1%81%D0%BA%D0%B8%D1%81/-%D0%BA%D0%B8%D1%81-%D0%BA%D0%BB%D0%B5%D1%82%D0%BA%D0%B0.jpg"},
      {"title": "Пир во время чумы", "artists": "кис-кис", "type": "Альбом", "cover": "https://rhymesmusic.ru/photos/1/%D0%BA%D0%B0%D1%82%D0%B0%D0%BB%D0%BE%D0%B3%20%D0%B0%D1%80%D1%82%D0%B8%D1%81%D1%82%D0%BE%D0%B2/%D0%BA%D0%B8%D1%81%D0%BA%D0%B8%D1%81/-%D0%BA%D0%B8%D1%81-%D0%BF%D0%B8%D1%80.jpg"}
    ],
    popular: [
      {"title": "молчи", "artists": "кис-кис", "streams": 19939080, "cover": "https://i.scdn.co/image/ab67616d0000b2734f3f5d5f45efd63d003ffbc2"},
      {"title": "мальчик", "artists": "кис-кис", "streams": 11526829, "cover": "https://i.scdn.co/image/ab67616d0000b2734f3f5d5f45efd63d003ffbc2"},
      {"title": "лбтд", "artists": "кис-кис", "streams": 9912439, "cover": "https://i.scdn.co/image/ab67616d0000b273a85a94ada4d2fea23e1b84e4"},
      {"title": "мелочь", "artists": "кис-кис", "streams": 6480965, "cover": "https://i.scdn.co/image/ab67616d0000b2735210406ca151afa4af807a95"},
      {"title": "подруга", "artists": "кис-кис", "streams": 4818479, "cover": "https://i.scdn.co/image/ab67616d0000b2739deb595b0df56197d87e0f70"},
      {"title": "трахаюсь", "artists": "кис-кис", "streams": 3562310, "cover": "https://i.scdn.co/image/ab67616d0000b273ea2328cdb0fcc0119fba4c9d"},
      {"title": "не надо", "artists": "кис-кис", "streams": 3347921, "cover": "https://i.scdn.co/image/ab67616d0000b27363c3fe9084541441429af560"},
      {"title": "когда я умру", "artists": "кис-кис", "streams": 701743, "cover": "https://i.scdn.co/image/ab67616d0000b2738de1dacae6936aa73bb50826"},
      {"title": "ты уже не ребёнок", "artists": "кис-кис", "streams": 637348, "cover": "https://i.scdn.co/image/ab67616d0000b2738de1dacae6936aa73bb50826"},
      {"title": "лифт (acoustic)", "artists": "кис-кис", "streams": 297656, "cover": "https://i.scdn.co/image/ab67616d0000b27363d3d0d352ed28d55dc2bfeb"}
    ]
  },
  "sqwoz-bab": {
    photo: "https://rhymesmusic.ru/photos/1/%D0%BA%D0%B0%D1%82%D0%B0%D0%BB%D0%BE%D0%B3%20%D0%B0%D1%80%D1%82%D0%B8%D1%81%D1%82%D0%BE%D0%B2/%D1%81%D0%BA%D0%B2%D0%BE%D0%B7%D1%8C%20%D0%B1%D0%B0%D0%B1/thumb/1441_-%D0%BA-%D1%81%D0%BA%D0%B2%D0%BE%D0%B7%D1%8C.jpg",
    socials: [
      {"name": "TikTok", "url": "https://www.tiktok.com/@sqwoz.bab"},
      {"name": "Instagram", "url": "https://www.instagram.com/sqwozbabs/"},
      {"name": "VK", "url": "https://vk.com/sqwozbab"},
      {"name": "YouTube", "url": "https://www.youtube.com/channel/UCalNLCCxYgGPRqq8WIH2L5A"}
    ],
    releases: [
      {"title": "АУФ", "artists": "SQWOZ BAB, The First Station", "type": "Сингл", "cover": "https://i.scdn.co/image/ab67616d0000b2732135cf3c617ad707790a6e27"},
      {"title": "Body Language", "artists": "SQWOZ BAB", "type": "Сингл", "cover": "https://rhymesmusic.ru/photos/1/%D0%BA%D0%B0%D1%82%D0%B0%D0%BB%D0%BE%D0%B3%20%D0%B0%D1%80%D1%82%D0%B8%D1%81%D1%82%D0%BE%D0%B2/%D1%81%D0%BA%D0%B2%D0%BE%D0%B7%D1%8C%20%D0%B1%D0%B0%D0%B1/-%D1%81%D0%BA%D0%B2%D0%BE%D0%B7%D1%8C-%D0%B1%D0%B0%D0%B4%D0%B8.jpg"},
      {"title": "Бывший", "artists": "SQWOZ BAB, Хлеб", "type": "Сингл", "cover": "https://rhymesmusic.ru/photos/1/%D0%BA%D0%B0%D1%82%D0%B0%D0%BB%D0%BE%D0%B3%20%D0%B0%D1%80%D1%82%D0%B8%D1%81%D1%82%D0%BE%D0%B2/%D1%81%D0%BA%D0%B2%D0%BE%D0%B7%D1%8C%20%D0%B1%D0%B0%D0%B1/-%D1%81%D0%BA%D0%B2%D0%BE%D0%B7%D1%8C-%D0%B1%D1%8B%D0%B2%D1%88%D0%B8%D0%B8%CC%86.jpg"},
      {"title": "RINGTONE DEMO FINAL MIX 123 dfghfw", "artists": "SQWOZ BAB", "type": "Альбом", "cover": "https://rhymesmusic.ru/photos/1/%D0%BA%D0%B0%D1%82%D0%B0%D0%BB%D0%BE%D0%B3%20%D0%B0%D1%80%D1%82%D0%B8%D1%81%D1%82%D0%BE%D0%B2/%D1%81%D0%BA%D0%B2%D0%BE%D0%B7%D1%8C%20%D0%B1%D0%B0%D0%B1/-%D1%81%D0%BA%D0%B2%D0%BE%D0%B7%D1%8C-%D1%80%D0%B8%D0%BD%D0%B3%D1%82%D0%BE%D0%BD.jpg"},
      {"title": "Братва на связи", "artists": "SQWOZ BAB, GONE.Fludd, blago white", "type": "Сингл", "cover": "https://rhymesmusic.ru/photos/1/%D0%BA%D0%B0%D1%82%D0%B0%D0%BB%D0%BE%D0%B3%20%D0%B0%D1%80%D1%82%D0%B8%D1%81%D1%82%D0%BE%D0%B2/%D1%81%D0%BA%D0%B2%D0%BE%D0%B7%D1%8C%20%D0%B1%D0%B0%D0%B1/-%D1%81%D0%BA%D0%B2%D0%BE%D0%B7%D1%8C-%D0%B1%D1%80%D0%B0%D1%82%D0%B2%D0%B0.jpg"}
    ],
    popular: [
      {"title": "АУФ", "artists": "SQWOZ BAB, The First Station", "streams": 36607797, "cover": "https://i.scdn.co/image/ab67616d0000b2732135cf3c617ad707790a6e27"},
      {"title": "ПЁТР 1", "artists": "SQWOZ BAB", "streams": 339855, "cover": "https://i.scdn.co/image/ab67616d0000b273287026966bdc3f8e7bc0e8de"},
      {"title": "TITTY MILK", "artists": "SQWOZ BAB", "streams": 135965, "cover": "https://i.scdn.co/image/ab67616d0000b27388b9f51fc59dcea31d11ad64"}
    ]
  },
  "xmax": {
    photo: "https://rhymesmusic.ru/photos/1/%D0%BA%D0%B0%D1%82%D0%B0%D0%BB%D0%BE%D0%B3%20%D0%B0%D1%80%D1%82%D0%B8%D1%81%D1%82%D0%BE%D0%B2/%D1%85%D0%BC%D0%B0%D0%BA%D1%81/thumb/1441_-%D0%BA-%D1%85%D0%BC%D0%B0%D0%BA%D1%811.jpg",
    socials: [
      {"name": "TikTok", "url": "https://www.tiktok.com/@xmax_one"},
      {"name": "VK", "url": "https://vk.com/xmax_one"},
      {"name": "Instagram", "url": "https://www.instagram.com/xmaxlive/"}
    ],
    releases: [
      {"title": "Просто люби", "artists": "xMax", "type": "Сингл", "cover": "https://i.scdn.co/image/ab67616d0000b273455e693b46e66ae9232f4373"},
      {"title": "Ошибаюсь", "artists": "xMax", "type": "Сингл", "cover": "https://i.scdn.co/image/ab67616d0000b27319964bc51fbd5b1d36ec34b9"},
      {"title": "Следующая станция", "artists": "xMax, suramura", "type": "Сингл", "cover": "https://i.scdn.co/image/ab67616d0000b273ae1a053a0365bf23bbf56aca"}
    ],
    popular: [
      {"title": "Просто люби", "artists": "xMax", "streams": 1724521, "cover": "https://i.scdn.co/image/ab67616d0000b273455e693b46e66ae9232f4373"},
      {"title": "Следующая станция", "artists": "xMax, suramura", "streams": 1057614, "cover": "https://i.scdn.co/image/ab67616d0000b273ae1a053a0365bf23bbf56aca"},
      {"title": "Просто люби (Sped up)", "artists": "xMax", "streams": 956341, "cover": "https://i.scdn.co/image/ab67616d0000b273bc3a9103fb9a64418a6d9646"},
      {"title": "Целый мир", "artists": "xMax", "streams": 753198, "cover": "https://i.scdn.co/image/ab67616d0000b2733f470a18e7966d5540f02880"},
      {"title": "Ошибаюсь", "artists": "xMax", "streams": 279944, "cover": "https://i.scdn.co/image/ab67616d0000b27319964bc51fbd5b1d36ec34b9"},
      {"title": "Держись", "artists": "xMax", "streams": 169408, "cover": "https://i.scdn.co/image/ab67616d0000b2733cc8d783fc0c7f7f06b35574"},
      {"title": "Не отдам", "artists": "xMax", "streams": 148517, "cover": "https://i.scdn.co/image/ab67616d0000b273e2d8a8aedae690faf1ba7771"},
      {"title": "Лето 22", "artists": "xMax", "streams": 95713, "cover": "https://i.scdn.co/image/ab67616d0000b273c2cdd8174a3e43dd2871fa72"},
      {"title": "Вместе", "artists": "xMax", "streams": 73934, "cover": "https://i.scdn.co/image/ab67616d0000b273833a91346d078f88941bee28"}
    ]
  },
  "4etvergov": {
    socials: [
      {"name": "Instagram", "url": "https://www.instagram.com/4etvergov_official/"},
      {"name": "VK", "url": "https://vk.com/4etvergov_official"},
      {"name": "YouTube", "url": "https://www.youtube.com/channel/UCcTuwEVE2P3q0TsRrdGJs4Q"}
    ],
    releases: [
      {"title": "Про неё", "artists": "4ETVERGOV", "type": "Сингл", "released_on": "2026-04-17"},
      {"title": "Красивая", "artists": "4ETVERGOV", "type": "Сингл", "released_on": "2025-10-23"},
      {"title": "Доча", "artists": "4ETVERGOV", "type": "Сингл", "released_on": "2025-06-20"},
      {"title": "Красивая пара", "artists": "4ETVERGOV", "type": "Сингл", "released_on": "2025-05-16"},
      {"title": "Соблазн", "artists": "4ETVERGOV", "type": "Сингл", "released_on": "2025-01-17"},
      {"title": "Криминал", "artists": "4ETVERGOV, BartiZ", "type": "Сингл", "released_on": "2023-11-30"},
      {"title": "Лова", "artists": "4ETVERGOV", "type": "Сингл", "released_on": "2023-10-11"}
    ],
    videos: [
      {"id": "wwobJDYgrB4", "title": "Красивая пара"}
    ]
  }
};
