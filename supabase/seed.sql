-- Сгенерировано scripts/seed-sql.mjs 2026-10-27. Можно запускать повторно.
begin;

insert into artists (slug, name, tagline, bio, photo, palette, socials, sort) values
  ('dora', 'Дора', 'Кьют-рок принцесса', 'Главное лицо русского кьют-рока: Дарья Шиханова сделала жанр массовым. В её музыке встречаются поп-рок, мягкий панк и поп, ностальгия по нулевым и много аниме-эстетики.', 'https://rhymesmusic.ru/photos/1/section-2/-%D0%BA-%D0%B4%D0%BE%D1%80%D0%B04.jpg', array['#ff7eb6', '#b69cff', '#ffd6ec']::text[], '[{"name":"TikTok","url":"https://www.tiktok.com/@mentaldora"},{"name":"Instagram","url":"https://www.instagram.com/mentaldora"},{"name":"VK","url":"https://vk.com/babydori"},{"name":"YouTube","url":"https://www.youtube.com/channel/UCae-zZkho0dkoQ5Z_NJhpeg"}]'::jsonb, 0),
  ('deti-rave', 'Дети Rave', 'Качает', 'Танцевальный проект Ильи Буркова: рейв, который работает и в наушниках, и на большой сцене.', 'https://rhymesmusic.ru/photos/1/%D0%BA%D0%B0%D1%82%D0%B0%D0%BB%D0%BE%D0%B3%20%D0%B0%D1%80%D1%82%D0%B8%D1%81%D1%82%D0%BE%D0%B2/%D0%B4%D0%B5%D1%82%D0%B8%20%D1%80%D0%B5%D0%B9%D0%B2/-deti-c44.png', array['#39ff88', '#4d6bff', '#ff2e88']::text[], '[{"name":"TikTok","url":"https://www.tiktok.com/@deti.rave"},{"name":"Instagram","url":"https://www.instagram.com/deti.rave/"},{"name":"VK","url":"https://vk.com/detirave"},{"name":"YouTube","url":"https://www.youtube.com/user/molodoyboy"}]'::jsonb, 1),
  ('maybe-baby', 'Мэйби Бэйби', null, 'Начинала в трио «Френдзона», которое в 2018 году стало одним из главных явлений для молодой аудитории. Сольно продолжает ту же линию: яркий визуал, мультяшная эстетика и собственная мифология.', 'https://rhymesmusic.ru/photos/1/%D0%BA%D0%B0%D1%82%D0%B0%D0%BB%D0%BE%D0%B3%20%D0%B0%D1%80%D1%82%D0%B8%D1%81%D1%82%D0%BE%D0%B2/%D0%BC%D1%8D%D0%B9%D0%B1%D0%B8/-mb-b2.png', array['#c56bff', '#ff8ad8', '#5cc8ff']::text[], '[{"name":"TikTok","url":"https://www.tiktok.com/@frendtok"},{"name":"Instagram","url":"https://www.instagram.com/frend_baby/"},{"name":"VK","url":"https://vk.com/maybebaby"},{"name":"YouTube","url":"https://www.youtube.com/channel/UCBhNW531Uyx1ooaWlcepyvg"}]'::jsonb, 2),
  ('mukka', 'МУККА', null, null, 'https://rhymesmusic.ru/photos/1/%D0%BA%D0%B0%D1%82%D0%B0%D0%BB%D0%BE%D0%B3%20%D0%B0%D1%80%D1%82%D0%B8%D1%81%D1%82%D0%BE%D0%B2/%D0%BC%D1%83%D0%BA%D0%BA%D0%B0/-mukka-b.png', array['#7fd1ff', '#3d5bff', '#e8f6ff']::text[], '[{"name":"VK","url":"https://vk.com/smukka"},{"name":"YouTube","url":"https://www.youtube.com/channel/UCd6y_bszkqUMoYBCtZt5w1Q"},{"name":"TikTok","url":"https://www.tiktok.com/@fakemukka"}]'::jsonb, 3),
  ('betsi', 'Betsy', 'Sigma Boy', null, 'https://rhymesmusic.ru/photos/5/1440.jpg', array['#ff8ad8', '#f5e52a', '#5cc8ff']::text[], '[{"name":"Likee","url":"https://likee.video/@604162807"},{"name":"Instagram","url":"https://www.instagram.com/badsee_official/"},{"name":"VK","url":"https://vk.com/badsee_official"},{"name":"YouTube","url":"https://www.youtube.com/channel/UC_rA7LUE1g4YVPW97JBrRMw"}]'::jsonb, 4),
  ('by-indiya', 'By Индия', 'RnB в твоей комнате', null, 'https://rhymesmusic.ru/photos/1/%D0%BA%D0%B0%D1%82%D0%B0%D0%BB%D0%BE%D0%B3%20%D0%B0%D1%80%D1%82%D0%B8%D1%81%D1%82%D0%BE%D0%B2/%D0%B1%D0%B0%D0%B9%20%D0%B8%D0%BD%D0%B4%D0%B8%D1%8F/thumb/1441_-%D0%BA-%D0%B8%D0%BD%D0%B4%D0%B8%D1%8F.jpg', array['#ff6a00', '#ffd23f', '#ff2e88']::text[], '[{"name":"TikTok","url":"https://www.tiktok.com/@byindiabyindiabyindia"},{"name":"Instagram","url":"https://www.instagram.com/byindiabyindiabyindia/"},{"name":"VK","url":"https://vk.com/byindia7"},{"name":"YouTube","url":"https://www.youtube.com/channel/UC0gKrme3OQmuVrvD-YCVE5w"}]'::jsonb, 5),
  ('finik', 'FINIK', null, 'Молодой артист из Ульяновска. Известность ему принесли треки «Не гоняйте, пацаны», «Наушники» и «Диалоги тет-а-тет», разлетевшиеся по TikTok. Часто выпускает совместные песни с ALEKS ATAMAN.', 'https://rhymesmusic.ru/photos/1/%D0%BA%D0%B0%D1%82%D0%B0%D0%BB%D0%BE%D0%B3%20%D0%B0%D1%80%D1%82%D0%B8%D1%81%D1%82%D0%BE%D0%B2/%D0%B0%D0%BB%D0%B5%D0%BA%D1%81%20%D0%B0%D1%82%D0%B0%D0%BC%D0%B0%D0%BD%20%D0%B8%20%D1%84%D0%B8%D0%BD%D0%B8%D0%BA/thumb/1441_-%D0%BA%D0%BE-%D1%84%D0%B8%D0%BD%D0%B8%D0%BA2%20%D0%BA%D0%BE%D0%BF%D0%B8%D1%8F.jpg', array['#5cc8ff', '#39ff88', '#ffffff']::text[], '[{"name":"TikTok","url":"https://www.tiktok.com/@finik.finya"},{"name":"VK","url":"https://vk.com/finikmusic"},{"name":"Instagram","url":"https://www.instagram.com/finik.finya/"},{"name":"YouTube","url":"https://www.youtube.com/channel/UCAzPctYf1PCyP67BgR4kL8A"}]'::jsonb, 6),
  ('gunwest', 'Ганвест', null, null, 'https://rhymesmusic.ru/photos/1/%D0%B3%D0%BB%D0%B0%D0%B2%D0%BD%D0%B0%D1%8F/person7.jpg', array['#f5e52a', '#ff6a00', '#ffffff']::text[], '[{"name":"TikTok","url":"https://www.tiktok.com/@real.gunwest"},{"name":"Instagram","url":"https://www.instagram.com/biggunwest/"},{"name":"VK","url":"https://vk.com/gunwestofficial"},{"name":"YouTube","url":"https://www.youtube.com/channel/UCpxacO9dujoE95ef7xNmbJQ"}]'::jsonb, 7),
  ('xassa', 'XASSA', null, null, 'https://rhymesmusic.ru/photos/1/%D0%B3%D0%BB%D0%B0%D0%B2%D0%BD%D0%B0%D1%8F/-%D0%B3%D0%BB-%D1%85%D0%B0%D1%81%D1%81%D0%B0.jpg', array['#5cc8ff', '#ffffff', '#8a5cff']::text[], '[{"name":"TikTok","url":"https://www.tiktok.com/@xassa_offical"},{"name":"Instagram","url":"https://www.instagram.com/xassa_offical/"},{"name":"VK","url":"https://vk.com/xassa_official_group"},{"name":"YouTube","url":"https://www.youtube.com/channel/UCQv3_6Ts6naKoEctIE5pdpg"}]'::jsonb, 8),
  ('bodiev', 'BODIEV', null, null, 'https://rhymesmusic.ru/photos/1/%D0%B3%D0%BB%D0%B0%D0%B2%D0%BD%D0%B0%D1%8F/-%D0%B3%D0%BB-%D0%B1%D0%BE%D0%B4%D0%B8%D0%B5%D0%B2.jpg', array['#ffb347', '#ff2e2e', '#ffffff']::text[], '[{"name":"TikTok","url":"https://www.tiktok.com/@bodiev1"},{"name":"Instagram","url":"https://www.instagram.com/bodiev_/"},{"name":"VK","url":"https://vk.com/bodievmuz"},{"name":"YouTube","url":"https://www.youtube.com/channel/UC5HilN83EUYqCXi5LE0ZDDw"}]'::jsonb, 9),
  ('aleks-ataman', 'Aleks Ataman', null, 'Артист из Ульяновска, которого TikTok узнал по трекам «Диалоги тет-а-тет», «Чёрный Алексей» и «Скатертью дорожка». Большую часть хитов записал вместе с FINIK.', 'https://rhymesmusic.ru/photos/1/%D0%BA%D0%B0%D1%82%D0%B0%D0%BB%D0%BE%D0%B3%20%D0%B0%D1%80%D1%82%D0%B8%D1%81%D1%82%D0%BE%D0%B2/%D0%B0%D0%BB%D0%B5%D0%BA%D1%81%20%D0%B0%D1%82%D0%B0%D0%BC%D0%B0%D0%BD%20%D0%B8%20%D1%84%D0%B8%D0%BD%D0%B8%D0%BA/thumb/1441_-%D0%BA-%D0%B0%D1%82%D0%B0%D0%BC%D0%B0%D0%BD01.jpg', array['#ffb347', '#ffffff', '#5cc8ff']::text[], '[{"name":"TikTok","url":"https://www.tiktok.com/@aleks_ataman"},{"name":"Instagram","url":"https://www.instagram.com/aleks_ataman/"},{"name":"VK","url":"https://vk.com/aleks_ataman"},{"name":"YouTube","url":"https://www.youtube.com/channel/UCuDJkO-EIUIUldlX-iSEF2A"}]'::jsonb, 10),
  ('dlb', 'DLB', 'Bassline из России', 'DLB — коллектив, который работает в жанре bassline: на российской сцене у него в этом почти нет конкурентов.', 'https://rhymesmusic.ru/photos/1/%D0%BA%D0%B0%D1%82%D0%B0%D0%BB%D0%BE%D0%B3%20%D0%B0%D1%80%D1%82%D0%B8%D1%81%D1%82%D0%BE%D0%B2/%D0%B4%D0%BB%D0%B1/thumb/1441_-%D0%BA-%D0%B4%D0%BB%D0%B1.jpg', array['#ff2e2e', '#ffffff', '#ffb347']::text[], '[{"name":"TikTok","url":"https://www.tiktok.com/@dlb.official"},{"name":"Instagram","url":"https://www.instagram.com/dlb.official/"},{"name":"VK","url":"https://vk.com/officialdlb"},{"name":"YouTube","url":"https://www.youtube.com/channel/UCwtQ9WInVN2INeGfj_9Rsbw"}]'::jsonb, 11),
  ('polmateri', 'Полматери', 'Молодёжная образовательная рок-группировка', null, 'https://rhymesmusic.ru/photos/1/%D0%BA%D0%B0%D1%82%D0%B0%D0%BB%D0%BE%D0%B3%20%D0%B0%D1%80%D1%82%D0%B8%D1%81%D1%82%D0%BE%D0%B2/%D0%BF%D0%BE%D0%BB%D0%BC%D0%B0%D1%82%D0%B5%D1%80%D0%B8/thumb/1441_-%D0%BA-%D0%BF%D0%BE%D0%BB%D0%BC%D0%B0%D1%82%D0%B5%D1%80%D0%B8.jpg', array['#b69cff', '#5cc8ff', '#ffffff']::text[], '[{"name":"TikTok","url":"https://www.tiktok.com/@margoldin"},{"name":"VK","url":"https://vk.com/polmateri"},{"name":"Instagram","url":"https://www.instagram.com/polmamkiband/"}]'::jsonb, 12),
  ('lxner', 'LXNER', null, null, 'https://rhymesmusic.ru/photos/1/%D0%BA%D0%B0%D1%82%D0%B0%D0%BB%D0%BE%D0%B3%20%D0%B0%D1%80%D1%82%D0%B8%D1%81%D1%82%D0%BE%D0%B2/%D0%BB%D0%BE%D0%BD%D0%B5%D1%80/thumb/1441_-%D0%BA-%D0%BB%D0%BE%D0%BD%D0%B5%D1%802.jpg', array['#8a5cff', '#ff2e88', '#5cc8ff']::text[], '[{"name":"TikTok","url":"https://www.tiktok.com/@xolxner"},{"name":"Instagram","url":"https://www.instagram.com/xolxner/"},{"name":"VK","url":"https://vk.com/xolxnerxo"}]'::jsonb, 13),
  ('ivan-valeev', 'Ivan Valeev', null, 'Музыкант из Республики Марий Эл. Широкую известность получил с треками «Novella», «Aromat», «Пьяная», «Заберу» и «Парадокс».', 'https://rhymesmusic.ru/photos/1/%D0%BA%D0%B0%D1%82%D0%B0%D0%BB%D0%BE%D0%B3%20%D0%B0%D1%80%D1%82%D0%B8%D1%81%D1%82%D0%BE%D0%B2/%D0%B8%D0%B2%D0%B0%D0%BD%20%D0%B2%D0%B0%D0%BB%D0%B5%D0%B5%D0%B2/thumb/1441_-%D0%BA-%D0%B2%D0%B0%D0%BB%D0%B5%D0%B5%D0%B2.jpg', array['#ffd23f', '#ff8ad8', '#ffffff']::text[], '[{"name":"Instagram","url":"https://www.instagram.com/ivan_valeev/"},{"name":"VK","url":"https://vk.com/valeevmusic"},{"name":"TikTok","url":"https://www.tiktok.com/@ivan__valeev"},{"name":"YouTube","url":"https://www.youtube.com/channel/UCEIREjJtvDAfN-CfGgbcG2w"}]'::jsonb, 14),
  ('quiizzzmeow', 'quiizzzmeow', null, null, 'https://rhymesmusic.ru/photos/1/%D0%BA%D0%B0%D1%82%D0%B0%D0%BB%D0%BE%D0%B3%20%D0%B0%D1%80%D1%82%D0%B8%D1%81%D1%82%D0%BE%D0%B2/%D0%BA%D0%B8%D0%B7%D0%BC%D1%8F%D1%83/thumb/1441_-%D0%BA-%D0%BA%D0%B8%D0%B7%D0%BC%D1%8F%D1%83.jpg', array['#39ff88', '#c56bff', '#5cc8ff']::text[], '[{"name":"TikTok","url":"https://www.tiktok.com/@quiizzzmeow"},{"name":"Instagram","url":"https://www.instagram.com/quiizzzmeow/"},{"name":"VK","url":"https://vk.com/quiizzzmeow"},{"name":"YouTube","url":"https://www.youtube.com/c/quiizzzmeow"}]'::jsonb, 15),
  ('pyrokinesis', 'pyrokinesis', null, 'Андрей Федорович родом из Крыма, начинал с текстов для онлайн-баттлов. Его рэп мрачный и концептуальный: альбомы перекликаются друг с другом, а в песнях много отсылок к мифологии, религии и литературе. Псевдоним взят из романа Стивена Кинга «Воспламеняющая взглядом».', 'https://rhymesmusic.ru/photos/1/%D0%BA%D0%B0%D1%82%D0%B0%D0%BB%D0%BE%D0%B3%20%D0%B0%D1%80%D1%82%D0%B8%D1%81%D1%82%D0%BE%D0%B2/%D0%BF%D0%B8%D1%80%D0%BE%D0%BA%D0%B8%D0%BD%D0%B5%D0%B7%D0%B8%D1%81/thumb/1441_-%D0%BA-%D0%BF%D0%B8%D1%80%D0%BE.jpg', array['#ff5a1f', '#c4120f', '#ffb347']::text[], '[{"name":"TikTok","url":"https://www.tiktok.com/@pyrokinesis_official"},{"name":"Instagram","url":"https://www.instagram.com/andrushapyro/"},{"name":"VK","url":"https://vk.com/pyrokinesis"},{"name":"YouTube","url":"https://www.youtube.com/channel/UCThXFki2OJqG8379Rn_sIAw"}]'::jsonb, 16),
  ('kis-kis', 'кис-кис', null, null, 'https://rhymesmusic.ru/photos/1/%D0%B3%D0%BB%D0%B0%D0%B2%D0%BD%D0%B0%D1%8F/person4.png', array['#ff3d9a', '#f5e52a', '#ffffff']::text[], '[{"name":"Instagram","url":"https://www.instagram.com/kiskisnotdead/"},{"name":"VK","url":"https://vk.com/kiskisnotdead"},{"name":"YouTube","url":"https://www.youtube.com/kiskisnotdead"}]'::jsonb, 17),
  ('sqwoz-bab', 'SQWOZ BAB', null, null, 'https://rhymesmusic.ru/photos/1/%D0%B3%D0%BB%D0%B0%D0%B2%D0%BD%D0%B0%D1%8F/person6.png', array['#39ff88', '#f5e52a', '#ffffff']::text[], '[{"name":"TikTok","url":"https://www.tiktok.com/@sqwoz.bab"},{"name":"Instagram","url":"https://www.instagram.com/sqwozbabs/"},{"name":"VK","url":"https://vk.com/sqwozbab"},{"name":"YouTube","url":"https://www.youtube.com/channel/UCalNLCCxYgGPRqq8WIH2L5A"}]'::jsonb, 18),
  ('loren', 'Лорэн', null, null, null, array['#9fe7ff', '#c56bff', '#ffffff']::text[], '[]'::jsonb, 19),
  ('xmax', 'XMAX', null, null, 'https://rhymesmusic.ru/photos/1/%D0%BA%D0%B0%D1%82%D0%B0%D0%BB%D0%BE%D0%B3%20%D0%B0%D1%80%D1%82%D0%B8%D1%81%D1%82%D0%BE%D0%B2/%D1%85%D0%BC%D0%B0%D0%BA%D1%81/thumb/1441_-%D0%BA-%D1%85%D0%BC%D0%B0%D0%BA%D1%811.jpg', array['#8fd16a', '#ffd23f', '#ffffff']::text[], '[{"name":"TikTok","url":"https://www.tiktok.com/@xmax_one"},{"name":"VK","url":"https://vk.com/xmax_one"},{"name":"Instagram","url":"https://www.instagram.com/xmaxlive/"}]'::jsonb, 20),
  ('aikko', 'AIKKO', null, 'Владислав Кособуцкий родом из Бобруйска, сейчас живёт в Санкт-Петербурге. Музыкой занимается больше десяти лет, начинал в коллективе «КаждаяБарбиСтерва». Сам не привязывает себя к одному жанру: в его треках встречаются рэп, альтернатива и рок.', null, array['#00e0c6', '#ff6a00', '#ffffff']::text[], '[]'::jsonb, 21),
  ('playingtheangel', 'playingtheangel', null, 'Молодой артист из Красноярска со своей узнаваемой манерой исполнения. В 2026 году объездил страну с туром «Любовь побеждает смерть» в поддержку нового альбома.', null, array['#ffffff', '#ff2e2e', '#b69cff']::text[], '[]'::jsonb, 22),
  ('kvestar', 'KVESTAR', null, null, null, array['#f5e52a', '#8a5cff', '#ffffff']::text[], '[]'::jsonb, 23),
  ('4etvergov', '4etvergov', null, null, null, array['#ffffff', '#5cc8ff', '#ffb347']::text[], '[{"name":"Instagram","url":"https://www.instagram.com/4etvergov_official/"},{"name":"VK","url":"https://vk.com/4etvergov_official"},{"name":"YouTube","url":"https://www.youtube.com/channel/UCcTuwEVE2P3q0TsRrdGJs4Q"}]'::jsonb, 24),
  ('smysla-net', 'Смысла.net', null, null, null, array['#ff6a00', '#c4120f', '#ffb347']::text[], '[]'::jsonb, 25),
  ('ruslan-utyug', 'Руслан Утюг', null, null, null, array['#9fb7ff', '#ffffff', '#c56bff']::text[], '[]'::jsonb, 26),
  ('navernoe-radost', 'Наверное Радость', null, null, null, array['#5cc8ff', '#3d5bff', '#ffffff']::text[], '[]'::jsonb, 27),
  ('pokrapiva', 'Pokrapiva', null, null, null, array['#ff2e2e', '#ffb347', '#ff2e88']::text[], '[]'::jsonb, 28),
  ('voobrazhaemaya-lyubov', 'Воображаемая любовь', null, null, null, array['#ffd23f', '#5cc8ff', '#ffffff']::text[], '[]'::jsonb, 29),
  ('the-meto', 'The Meto', null, null, null, array['#5cc8ff', '#ff2e2e', '#ffffff']::text[], '[]'::jsonb, 30)
on conflict (slug) do nothing;

create temp table _rel (artist_slug text, title text, artists text, type text, cover text, preview text, spotify text, released_on date, sort int) on commit drop;
insert into _rel values
  ('dora', 'Верю', 'Дора', 'Сингл', 'https://cdn-images.dzcdn.net/images/cover/401674d6069e46d40c3547ba9187b964/1000x1000-000000-80-0-0.jpg', null, null, '2026-08-21'::date, 0),
  ('dora', 'ЗНАК', 'Toxi$, Дора', 'Сингл', 'https://cdn-images.dzcdn.net/images/cover/4cd95a65c2525bd01c905199bbef851a/1000x1000-000000-80-0-0.jpg', null, null, '2026-07-24'::date, 1),
  ('dora', 'Million Dollar Baby', 'Дора', 'Сингл', 'https://cdn-images.dzcdn.net/images/cover/6a251dd3f52e2bf494b89b48e343bbde/1000x1000-000000-80-0-0.jpg', null, null, '2026-06-05'::date, 2),
  ('dora', 'лонли лав', 'Дора', 'Сингл', 'https://cdn-images.dzcdn.net/images/cover/dc82b3f0c9d6e68dba269bdee14eac3e/1000x1000-000000-80-0-0.jpg', null, null, '2026-03-20'::date, 3),
  ('dora', 'Понарошку', 'Дора', 'Сингл', 'https://cdn-images.dzcdn.net/images/cover/f3c8ca3fab7bbe6f9195e1ed4198c57a/1000x1000-000000-80-0-0.jpg', null, null, '2025-11-21'::date, 4),
  ('dora', 'Кабы не было зимы', 'Дора', 'Сингл', 'https://cdn-images.dzcdn.net/images/cover/c6d70bdb4305cfaae677696678f19737/1000x1000-000000-80-0-0.jpg', null, null, '2025-11-20'::date, 5),
  ('dora', 'Дурочка', 'Дора', 'Сингл', 'https://cdn-images.dzcdn.net/images/cover/89fcac44d2f0ddcd1ea3c9a2f24ba3e7/1000x1000-000000-80-0-0.jpg', null, null, '2025-10-17'::date, 6),
  ('dora', 'ЁК', 'Дора', 'Сингл', 'https://cdn-images.dzcdn.net/images/cover/0b3c66fc0ef6f8bf405c05a14ecf8125/1000x1000-000000-80-0-0.jpg', null, null, '2025-01-31'::date, 7),
  ('dora', 'LOVESONGS', 'Дора', 'Альбом', 'https://cdn-images.dzcdn.net/images/cover/16b2600d2fd21e35192ac97ca0fd61dd/1000x1000-000000-80-0-0.jpg', null, null, '2024-10-18'::date, 8),
  ('dora', 'Лучше тебя', 'Дора', 'Сингл', 'https://cdn-images.dzcdn.net/images/cover/6947ec96f54a174093d700ed04071784/1000x1000-000000-80-0-0.jpg', null, null, '2024-10-11'::date, 9),
  ('dora', 'Папик', 'Дора', 'Сингл', 'https://i.scdn.co/image/ab67616d0000b273d76137707e516ab4db1aa712', 'https://p.scdn.co/mp3-preview/c3b258851a18fdd3c0cbadf582b37ab23a2ef8ec?cid=9f8dbb1747904fbca4eb9c7989c4339d', 'track/6g20mMUFO4sQ3RqPS3Ovgw', '2023-06-09'::date, 10),
  ('dora', 'MISS', 'Дора', 'Альбом', 'https://rhymesmusic.ru/photos/1/%D0%BA%D0%B0%D1%82%D0%B0%D0%BB%D0%BE%D0%B3%20%D0%B0%D1%80%D1%82%D0%B8%D1%81%D1%82%D0%BE%D0%B2/%D0%B4%D0%BE%D1%80%D0%B0/-%D0%B4%D0%BE%D1%80%D0%B0-%D0%BC%D0%B8%D1%81%D1%81.jpg', 'https://p.scdn.co/mp3-preview/ccab75b4b36e770acff7aa2ab8176eb58f4d7558?cid=63c2afc662c3448eb988db2083a8365b', 'album/2umHPKn2Mggn9RUqT8beQy', '2022-06-03'::date, 11),
  ('dora', 'Капли', 'Дора, OG Buda', 'Сингл', 'https://rhymesmusic.ru/photos/1/%D0%BA%D0%B0%D1%82%D0%B0%D0%BB%D0%BE%D0%B3%20%D0%B0%D1%80%D1%82%D0%B8%D1%81%D1%82%D0%BE%D0%B2/%D0%B4%D0%BE%D1%80%D0%B0/-%D0%B4%D0%BE%D1%80%D0%B0-%D0%BA%D0%B0%D0%BF%D0%BB%D0%B8.jpg', 'https://p.scdn.co/mp3-preview/d209b3fc57f18a8d3618f71fa2c80d131ad085e8?cid=63c2afc662c3448eb988db2083a8365b', 'track/0LwPFTgtNaQrfyWHM42Z83', '2022-01-01'::date, 12),
  ('dora', 'Барбисайз', 'Дора, Мэйби Бэйби', 'Сингл', 'https://rhymesmusic.ru/photos/1/%D0%BA%D0%B0%D1%82%D0%B0%D0%BB%D0%BE%D0%B3%20%D0%B0%D1%80%D1%82%D0%B8%D1%81%D1%82%D0%BE%D0%B2/%D0%B4%D0%BE%D1%80%D0%B0/-%D0%B4%D0%BE%D1%80%D0%B0-%D0%B1%D0%B0%D1%80%D0%B1%D0%B8%D1%81%D0%B0%D0%B9%D0%B7.jpg', 'https://p.scdn.co/mp3-preview/835aa32108cf6be99fb5fd9de71ae30084fb34d8?cid=63c2afc662c3448eb988db2083a8365b', 'album/3ONBhOKlsQ6MTyaWlM7EJE', '2021-01-01'::date, 13),
  ('dora', 'Сан Ларан', 'Платина, Дора', 'Сингл', 'https://rhymesmusic.ru/photos/1/%D0%BA%D0%B0%D1%82%D0%B0%D0%BB%D0%BE%D0%B3%20%D0%B0%D1%80%D1%82%D0%B8%D1%81%D1%82%D0%BE%D0%B2/%D0%B4%D0%BE%D1%80%D0%B0/-%D0%B4%D0%BE%D1%80%D0%B0-%D1%81%D0%B0%D0%BD.jpg', 'https://p.scdn.co/mp3-preview/387098b216e543eb169e692382e20b26f78c5c09?cid=63c2afc662c3448eb988db2083a8365b', 'album/1y2MhUt42DWBSvILa23KV6', '2021-01-01'::date, 14),
  ('dora', 'Боже, храни кьют-рок', 'Дора', 'Альбом', 'https://rhymesmusic.ru/photos/1/%D0%BA%D0%B0%D1%82%D0%B0%D0%BB%D0%BE%D0%B3%20%D0%B0%D1%80%D1%82%D0%B8%D1%81%D1%82%D0%BE%D0%B2/%D0%B4%D0%BE%D1%80%D0%B0/-%D0%B4%D0%BE%D1%80%D0%B0-%D0%B1%D0%BE%D0%B6%D0%B5.jpg', 'https://p.scdn.co/mp3-preview/e166caa84fa5e1e8128e013480db9f2c71ac0b38?cid=63c2afc662c3448eb988db2083a8365b', 'album/7hDvB29vtfPYypzxaxnMpT', '2020-12-18'::date, 15),
  ('dora', 'Младшая сестра', 'Дора', 'Альбом', 'https://rhymesmusic.ru/photos/1/%D0%BA%D0%B0%D1%82%D0%B0%D0%BB%D0%BE%D0%B3%20%D0%B0%D1%80%D1%82%D0%B8%D1%81%D1%82%D0%BE%D0%B2/%D0%B4%D0%BE%D1%80%D0%B0/-%D0%B4%D0%BE%D1%80%D0%B0-%D1%81%D0%B5%D1%81%D1%82%D1%80%D0%B0.jpg', 'https://p.scdn.co/mp3-preview/0103cdece3391025a69802e5bd22094bb20ea170?cid=63c2afc662c3448eb988db2083a8365b', 'album/6VGOayoZVPmoySlmKiybdP', '2019-11-08'::date, 16),
  ('deti-rave', 'DAWAI', 'Дети Rave', 'Сингл', 'https://i.scdn.co/image/ab67616d0000b27304d223022853add17a5fb1bf', null, 'track/2MDj0dSs1EpeOywVL5e6Oz', null::date, 0),
  ('deti-rave', 'THERAPIA', 'Дети Rave', 'Альбом', 'https://rhymesmusic.ru/photos/1/%D0%BA%D0%B0%D1%82%D0%B0%D0%BB%D0%BE%D0%B3%20%D0%B0%D1%80%D1%82%D0%B8%D1%81%D1%82%D0%BE%D0%B2/%D0%B4%D0%B5%D1%82%D0%B8%20%D1%80%D0%B5%D0%B9%D0%B2/-%D1%82%D0%B5%D1%80%D0%B0%D0%BF%D0%B8%D1%8F.jpg', null, 'album/4FTgl6DiDr7eZ7QKT5q6V5', null::date, 1),
  ('deti-rave', 'Качает', 'Дети Rave', 'Сингл', 'https://rhymesmusic.ru/photos/1/%D0%BA%D0%B0%D1%82%D0%B0%D0%BB%D0%BE%D0%B3%20%D0%B0%D1%80%D1%82%D0%B8%D1%81%D1%82%D0%BE%D0%B2/%D0%B4%D0%B5%D1%82%D0%B8%20%D1%80%D0%B5%D0%B9%D0%B2/-%D0%B4%D0%B5%D1%82%D0%B8-%D0%BA%D0%B0%D1%87%D0%B0%D0%B5%D1%82.jpg', null, 'album/11b4XIQqkXeOhqGaZ4GOfr', null::date, 2),
  ('deti-rave', 'FANAT', 'Дети Rave', 'Сингл', 'https://rhymesmusic.ru/photos/1/%D0%BA%D0%B0%D1%82%D0%B0%D0%BB%D0%BE%D0%B3%20%D0%B0%D1%80%D1%82%D0%B8%D1%81%D1%82%D0%BE%D0%B2/%D0%B4%D0%B5%D1%82%D0%B8%20%D1%80%D0%B5%D0%B9%D0%B2/-%D0%B4%D0%B5%D1%82%D0%B8-%D1%84%D0%B0%D0%BD%D0%B0%D1%82.jpg', null, 'album/0aFIu4jlmKD98bkuRBde6w', null::date, 3),
  ('deti-rave', 'Фая', 'Дети Rave', 'Сингл', 'https://rhymesmusic.ru/photos/1/%D0%BA%D0%B0%D1%82%D0%B0%D0%BB%D0%BE%D0%B3%20%D0%B0%D1%80%D1%82%D0%B8%D1%81%D1%82%D0%BE%D0%B2/%D0%B4%D0%B5%D1%82%D0%B8%20%D1%80%D0%B5%D0%B9%D0%B2/-%D0%B4%D0%B5%D1%82%D0%B8-%D1%84%D0%B0%D1%8F.jpg', null, 'album/6KNReuWyWXfDshdv0pwuY1', null::date, 4),
  ('deti-rave', '13 способов как начать', 'Дети Rave', 'Альбом', 'https://rhymesmusic.ru/photos/1/%D0%BA%D0%B0%D1%82%D0%B0%D0%BB%D0%BE%D0%B3%20%D0%B0%D1%80%D1%82%D0%B8%D1%81%D1%82%D0%BE%D0%B2/%D0%B4%D0%B5%D1%82%D0%B8%20%D1%80%D0%B5%D0%B9%D0%B2/-%D0%B4%D0%B5%D1%82%D0%B8-13.jpg', null, 'album/7aj1A7ItFH28MbHPlJ0p9K', null::date, 5),
  ('deti-rave', 'Турбо пушка', 'Дети Rave', 'Сингл', 'https://rhymesmusic.ru/photos/1/%D0%BA%D0%B0%D1%82%D0%B0%D0%BB%D0%BE%D0%B3%20%D0%B0%D1%80%D1%82%D0%B8%D1%81%D1%82%D0%BE%D0%B2/%D0%B4%D0%B5%D1%82%D0%B8%20%D1%80%D0%B5%D0%B9%D0%B2/-%D0%B4%D0%B5%D1%82%D0%B8-%D1%82%D1%83%D1%80%D0%B1%D0%BE.jpg', null, 'album/5yGC3jz5v0KUVlZYo6VoEI', null::date, 6),
  ('maybe-baby', 'SHIMMY SHIMMY YA!', 'Мэйби Бэйби', 'Сингл', 'https://rhymesmusic.ru/photos/1/%D0%BA%D0%B0%D1%82%D0%B0%D0%BB%D0%BE%D0%B3%20%D0%B0%D1%80%D1%82%D0%B8%D1%81%D1%82%D0%BE%D0%B2/%D0%BC%D1%8D%D0%B9%D0%B1%D0%B8/-%D0%BC%D1%8D%D0%B8%CC%86%D0%B1%D0%B8-%D1%88%D0%B8%D0%BC%D0%BC%D0%B8.jpg', null, 'track/12VZnNohS3m6Wi0NQhN5JS', null::date, 0),
  ('maybe-baby', 'ЗАЙКА', 'Мэйби Бэйби', 'Сингл', 'https://rhymesmusic.ru/photos/1/%D0%BA%D0%B0%D1%82%D0%B0%D0%BB%D0%BE%D0%B3%20%D0%B0%D1%80%D1%82%D0%B8%D1%81%D1%82%D0%BE%D0%B2/%D0%BC%D1%8D%D0%B9%D0%B1%D0%B8/-%D0%BC%D1%8D%D0%B8%CC%86%D0%B1%D0%B8-%D0%B7%D0%B0%D0%B8%CC%86%D0%BA%D0%B0.jpg', null, 'track/2nPRsTta1FT5Rr1frgym3q', null::date, 1),
  ('maybe-baby', 'МЭЙБИЛЭНД', 'Мэйби Бэйби', 'Альбом', 'https://rhymesmusic.ru/photos/3/%D0%BA%D0%B0%D1%82%D0%B0%D0%BB%D0%BE%D0%B3/%D0%BC%D1%8D%D0%B9%D0%B1%D0%B8/-%D0%BC%D1%8D%D0%B8%CC%86%D0%B1%D0%B8-%D0%BC%D1%8D%D0%B8%CC%86%D0%B1%D0%B8%D0%BB%D1%8D%D0%BD%D0%B4.jpg', null, 'album/5lMs819OYwbJH5WpffMST0', null::date, 2),
  ('maybe-baby', 'БОЛЬ', 'quiizzzmeow, Мэйби Бэйби', 'Сингл', 'https://rhymesmusic.ru/photos/1/%D0%BA%D0%B0%D1%82%D0%B0%D0%BB%D0%BE%D0%B3%20%D0%B0%D1%80%D1%82%D0%B8%D1%81%D1%82%D0%BE%D0%B2/%D0%BA%D0%B8%D0%B7%D0%BC%D1%8F%D1%83/-%D0%B1%D0%BE%D0%BB%D1%8C.jpg', null, 'album/3YXGPmL4F6RuPKCLAmIiCL', null::date, 3),
  ('maybe-baby', 'sH1pu4Ka!', 'Мэйби Бэйби', 'Сингл', 'https://rhymesmusic.ru/photos/1/%D0%BA%D0%B0%D1%82%D0%B0%D0%BB%D0%BE%D0%B3%20%D0%B0%D1%80%D1%82%D0%B8%D1%81%D1%82%D0%BE%D0%B2/%D0%BC%D1%8D%D0%B9%D0%B1%D0%B8/%E2%80%94%20sH1pu4Ka%21%20%D0%BA%D0%BE%D0%BF%D0%B8%D1%8F.jpg', null, 'album/2hLRWCM0HqQXly8JLjVAby', null::date, 4),
  ('maybe-baby', 'Не исправлюсь', 'Дора, Мэйби Бэйби', 'Сингл', 'https://rhymesmusic.ru/photos/1/%D0%BA%D0%B0%D1%82%D0%B0%D0%BB%D0%BE%D0%B3%20%D0%B0%D1%80%D1%82%D0%B8%D1%81%D1%82%D0%BE%D0%B2/%D0%BC%D1%8D%D0%B9%D0%B1%D0%B8/-%D0%BC%D1%8D%D0%B8%CC%86%D0%B1%D0%B8-%D0%BD%D0%B5-%D0%B8%D1%81%D0%BF%D1%80%D0%B0%D0%B2%D0%BB%D1%8E%D1%81%D1%8C.jpg', null, 'album/1crUm6IgsdBMs1bUzc0VXu', '2020-07-14'::date, 5),
  ('maybe-baby', 'Аскорбинка', 'Мэйби Бэйби', 'Сингл', 'https://rhymesmusic.ru/photos/1/%D0%BA%D0%B0%D1%82%D0%B0%D0%BB%D0%BE%D0%B3%20%D0%B0%D1%80%D1%82%D0%B8%D1%81%D1%82%D0%BE%D0%B2/%D0%BC%D1%8D%D0%B9%D0%B1%D0%B8/-%D0%BC%D1%8D%D0%B8%CC%86%D0%B1%D0%B8-%D0%B0%D1%81%D0%BA%D0%BE%D1%80%D0%B1%D0%B8%D0%BD%D0%BA%D0%B0.jpg', null, 'album/6BeTwg5qWyL4W8dfs9NbW8', null::date, 6),
  ('mukka', 'Малолетки', 'МУККА', 'EP', 'https://i.scdn.co/image/ab67616d0000b27302cad37bb1e3e2ae68fae02a', 'https://p.scdn.co/mp3-preview/380b3d3b5b775cf608e2215420587939b6c531fb?cid=23917817e5d04cfa84952e02200ec7df', 'album/41n0ze0qQ6qP1AqFnGhFhb', null::date, 0),
  ('mukka', 'Днями-ночами', 'МУККА', 'Сингл', 'https://i.scdn.co/image/ab67616d0000b273e41b1431cf63aa22f8198bbf', 'https://p.scdn.co/mp3-preview/af7f25e25fe3b6997159dada69e37ac8bca2d5c8?cid=23917817e5d04cfa84952e02200ec7df', 'album/4R3TyCTmtEN1nIo1EhOPgT', null::date, 1),
  ('betsi', 'Pump It Up', 'Betsy', 'Сингл', 'https://rhymesmusic.ru/photos/1/%D0%BA%D0%B0%D1%82%D0%B0%D0%BB%D0%BE%D0%B3%20%D0%B0%D1%80%D1%82%D0%B8%D1%81%D1%82%D0%BE%D0%B2/%D0%B1%D1%8D%D1%82%D1%81%D0%B8/_%D0%B1%D1%8D%D1%82%D1%81%D0%B8_%D0%BF%D0%B0%D0%BC.jpg', null, null, null::date, 0),
  ('betsi', 'Фрэнк', 'Betsy', 'Сингл', 'https://rhymesmusic.ru/photos/3/%D0%BA%D0%B0%D1%82%D0%B0%D0%BB%D0%BE%D0%B3/%D0%B1%D1%8D%D1%82%D1%81%D0%B8/-%D0%B1%D1%8D%D1%82%D1%81%D0%B8-%D1%84%D1%80%D1%8D%D0%BD%D0%BA.jpg', null, null, null::date, 1),
  ('betsi', 'GOLD APPLE', 'M&A, Betsy', 'Сингл', 'https://rhymesmusic.ru/photos/3/%D0%BA%D0%B0%D1%82%D0%B0%D0%BB%D0%BE%D0%B3/%D0%B1%D1%8D%D1%82%D1%81%D0%B8/-%D0%B1%D0%B5%D1%82%D1%81%D0%B8-%D1%8D%D0%BF%D0%BE%D0%BB.jpg', null, null, null::date, 2),
  ('by-indiya', 'NIGHTS', 'By Индия', 'EP', 'https://i.scdn.co/image/ab67616d0000b273246e656271190b7536f6129a', null, 'album/5d4kWqNPt2uaD0E7ABXRU3', null::date, 0),
  ('by-indiya', 'Кислород', 'By Индия', 'Сингл', 'https://i.scdn.co/image/ab67616d0000b273b9d00c7ca1499acb91573a15', null, 'album/5gFt0MftsTryYQZFSyJONm', null::date, 1),
  ('by-indiya', 'Целуйся правильно', 'By Индия', 'Сингл', 'https://rhymesmusic.ru/photos/1/%D0%BA%D0%B0%D1%82%D0%B0%D0%BB%D0%BE%D0%B3%20%D0%B0%D1%80%D1%82%D0%B8%D1%81%D1%82%D0%BE%D0%B2/%D0%B1%D0%B0%D0%B9%20%D0%B8%D0%BD%D0%B4%D0%B8%D1%8F/-%D0%B8%D0%BD%D0%B4%D0%B8%D1%8F-%D1%86%D0%B5%D0%BB%D1%83%D0%B8%CC%86%D1%81%D1%8F.JPG', null, 'album/2ujqgy1A79CVbO8LmNO7n1', null::date, 2),
  ('by-indiya', 'RnB в твоей комнате', 'By Индия', 'Альбом', 'https://rhymesmusic.ru/photos/1/%D0%BA%D0%B0%D1%82%D0%B0%D0%BB%D0%BE%D0%B3%20%D0%B0%D1%80%D1%82%D0%B8%D1%81%D1%82%D0%BE%D0%B2/%D0%B1%D0%B0%D0%B9%20%D0%B8%D0%BD%D0%B4%D0%B8%D1%8F/-%D0%B8%D0%BD%D0%B4%D0%B8%D1%8F-%D1%80%D0%BD%D0%B1.jpg', null, 'album/4TDWGtYsSga2kdpodYWCOD', null::date, 3),
  ('by-indiya', 'SALUTE', 'By Индия', 'EP', 'https://rhymesmusic.ru/photos/1/%D0%BA%D0%B0%D1%82%D0%B0%D0%BB%D0%BE%D0%B3%20%D0%B0%D1%80%D1%82%D0%B8%D1%81%D1%82%D0%BE%D0%B2/%D0%B1%D0%B0%D0%B9%20%D0%B8%D0%BD%D0%B4%D0%B8%D1%8F/-%D0%B8%D0%BD%D0%B4%D0%B8%D1%8F-%D1%81%D0%B0%D0%BB%D1%8E%D1%82.jpg', null, 'album/2yred19bVTTgLcE6R6kRlE', null::date, 4),
  ('finik', 'Ой, подзабыли', 'ALEKS ATAMAN, FINIK', 'Сингл', 'https://i.scdn.co/image/ab67616d0000b273f92e477dd0e57f79b8b725d2', null, 'track/6dkfI7A6hS2ZOaDl829Avv', null::date, 0),
  ('finik', 'На блатных аккордах', 'ALEKS ATAMAN, FINIK', 'Сингл', 'https://i.scdn.co/image/ab67616d0000b273b81ef96a889c9a99aae2360d', null, 'track/55QwAXoKoDUM6LXJpLjE0n', null::date, 1),
  ('finik', 'Юра Шатунов', 'ALEKS ATAMAN, FINIK', 'Сингл', 'https://i.scdn.co/image/ab67616d0000b2738f74fa38039c9696ac5c0a5d', null, 'track/3JDONsm8rJn1lPO7e7blB4', null::date, 2),
  ('finik', 'Девочка бандитка', 'ALEKS ATAMAN, FINIK', 'Сингл', 'https://i.scdn.co/image/ab67616d0000b273a5ac524d2ebdfd9735d47391', null, 'track/4Yak0Dy4DBikh7pp0nUDVX', null::date, 3),
  ('finik', 'Снежинки', 'ALEKS ATAMAN, FINIK', 'Сингл', 'https://i.scdn.co/image/ab67616d0000b273042a3d1afefe70dd50f8a103', null, 'track/7ic6T1EVcH6HwmR2k75FzP', null::date, 4),
  ('finik', 'Диалоги тет-а-тет', 'ALEKS ATAMAN, FINIK', 'Сингл', 'https://i.scdn.co/image/ab67616d0000b273b778d5b71e0636644b378b44', null, 'track/7qEZALeVloIwiz6tvX8ZUL', null::date, 5),
  ('finik', 'Ой, молодой', 'FINIK', 'Сингл', 'https://i.scdn.co/image/ab67616d0000b273497a11a1833e7ed83e84b411', null, 'track/0M7eGgFXFVJ2PSI63d8b6i', null::date, 6),
  ('gunwest', 'На рахате', 'Ганвест', 'Сингл', 'https://i.scdn.co/image/ab67616d0000b27394364b426e1aafe0ea2f71fe', 'https://p.scdn.co/mp3-preview/312a1912405c21bd1e5541a6f17c065006bac533?cid=0c89bf1fdc5b4ae1b5bca805fe46e532', 'track/709iFp6p5UGnX6iHwCupKD', null::date, 0),
  ('gunwest', 'Ночная река', 'Ганвест', 'Сингл', 'https://i.scdn.co/image/ab67616d0000b273976e09913d5e6dcd6d8d7223', 'https://p.scdn.co/mp3-preview/4e86d337b6f9198389b868b5bccc0b40b3aad962?cid=0c89bf1fdc5b4ae1b5bca805fe46e532', 'track/7dUeccIUAJ4iJeY8AIXhdU', null::date, 1),
  ('gunwest', 'Ты такая GLE', 'Ганвест', 'Сингл', 'https://i.scdn.co/image/ab67616d0000b273ec905044a7ec14f61a0694c5', 'https://p.scdn.co/mp3-preview/53f690f53b7df769d26978696a70222d3927aaa4?cid=0c89bf1fdc5b4ae1b5bca805fe46e532', 'track/31cgAV9P44uzsMasE1rgyk', null::date, 2),
  ('gunwest', 'Кайфули', 'Ганвест', 'Сингл', 'https://rhymesmusic.ru/photos/1/%D0%BA%D0%B0%D1%82%D0%B0%D0%BB%D0%BE%D0%B3%20%D0%B0%D1%80%D1%82%D0%B8%D1%81%D1%82%D0%BE%D0%B2/%D0%B3%D0%B0%D0%BD%D0%B2%D0%B5%D1%81%D1%82/-%D0%B3%D0%B0%D0%BD%D0%B2%D0%B5%D1%81%D1%82-%D0%BA%D0%B0%D0%B9%D1%84%D1%83%D0%BB%D0%B8.jpg', 'https://p.scdn.co/mp3-preview/e576c00a5d80afe45deadae09da1ecc03dd171ec?cid=0c89bf1fdc5b4ae1b5bca805fe46e532', 'track/09qYn7573SirEAdyohz50z', null::date, 3),
  ('gunwest', 'Никотин', 'Ганвест', 'Сингл', 'https://i.scdn.co/image/ab67616d0000b273cbd3cfe8896a92b75e60190f', 'https://p.scdn.co/mp3-preview/b778b398268d772baa2b6792614d2a94b3782a92?cid=0c89bf1fdc5b4ae1b5bca805fe46e532', 'track/4mJ2nynF92oq5DYEFCfpqQ', null::date, 4),
  ('xassa', 'Самолёт', 'Xassa, BODIEV', 'Сингл', 'https://i.scdn.co/image/ab67616d0000b2731f78594fa712582040158b19', null, null, null::date, 0),
  ('xassa', 'All Night', 'Xassa', 'Сингл', 'https://i.scdn.co/image/ab67616d0000b273bb57fa5add87be6494a82099', null, null, null::date, 1),
  ('xassa', 'Beautiful Life', 'Xassa', 'Сингл', 'https://i.scdn.co/image/ab67616d0000b2733dfe0dc18d2aae431acea52c', null, null, null::date, 2),
  ('xassa', 'Романтик', 'Xassa', 'Сингл', 'https://i.scdn.co/image/ab67616d0000b273bbd1cb7b2de296cc68e53e14', null, null, null::date, 3),
  ('xassa', 'Грехи', 'Xassa, BODIEV', 'Сингл', 'https://i.scdn.co/image/ab67616d0000b273bcf176927485a2f4ef3f140e', null, null, null::date, 4),
  ('xassa', 'Дикари', 'Xassa', 'Сингл', 'https://i.scdn.co/image/ab67616d0000b27386298ec8535c7d024e37bef1', null, null, null::date, 5),
  ('xassa', 'Белая майка', 'Xassa', 'Сингл', 'https://rhymesmusic.ru/photos/1/%D0%BA%D0%B0%D1%82%D0%B0%D0%BB%D0%BE%D0%B3%20%D0%B0%D1%80%D1%82%D0%B8%D1%81%D1%82%D0%BE%D0%B2/%D1%85%D0%B0%D1%81%D1%81%D0%B0/-%D1%85%D0%B0%D1%81%D1%81%D0%B0-%D0%B1%D0%B5%D0%BB%D0%B0%D1%8F-%D0%BC%D0%B0%D0%B9%D0%BA%D0%B0.jpg', null, null, null::date, 6),
  ('bodiev', 'Самолёт', 'Xassa, BODIEV', 'Сингл', 'https://i.scdn.co/image/ab67616d0000b2731f78594fa712582040158b19', null, null, null::date, 0),
  ('bodiev', 'Миллион', 'BODIEV', 'Сингл', 'https://rhymesmusic.ru/photos/1/%D0%BA%D0%B0%D1%82%D0%B0%D0%BB%D0%BE%D0%B3%20%D0%B0%D1%80%D1%82%D0%B8%D1%81%D1%82%D0%BE%D0%B2/%D0%B1%D0%BE%D0%B4%D0%B8%D0%B5%D0%B2/-%D0%BC%D0%B8%D0%BB%D0%BB%D0%B8%D0%BE%D0%BD.jpg', null, null, null::date, 1),
  ('bodiev', 'Караван', 'BODIEV', 'Сингл', 'https://i.scdn.co/image/ab67616d0000b27359dba8ccc528c25dbe0cad92', null, null, null::date, 2),
  ('bodiev', 'Бэнгер', 'BODIEV, Ulukmanapo', 'Сингл', 'https://rhymesmusic.ru/photos/1/%D0%BA%D0%B0%D1%82%D0%B0%D0%BB%D0%BE%D0%B3%20%D0%B0%D1%80%D1%82%D0%B8%D1%81%D1%82%D0%BE%D0%B2/%D0%B1%D0%BE%D0%B4%D0%B8%D0%B5%D0%B2/-%D0%B1%D0%BE%D0%B4%D0%B8%D0%B5%D0%B2-%D0%B1%D1%8D%D0%BD%D0%B3%D0%B5%D1%80.jpg', null, null, null::date, 3),
  ('bodiev', 'Грехи', 'Xassa, BODIEV', 'Сингл', 'https://i.scdn.co/image/ab67616d0000b273bcf176927485a2f4ef3f140e', null, null, null::date, 4),
  ('bodiev', 'На связи', 'BODIEV, Ганвест', 'Сингл', 'https://rhymesmusic.ru/photos/1/%D0%BA%D0%B0%D1%82%D0%B0%D0%BB%D0%BE%D0%B3%20%D0%B0%D1%80%D1%82%D0%B8%D1%81%D1%82%D0%BE%D0%B2/%D0%B1%D0%BE%D0%B4%D0%B8%D0%B5%D0%B2/-%D0%B1%D0%BE%D0%B4%D0%B8%D0%B5%D0%B2-%D0%BD%D0%B0%D1%81%D0%B2%D1%8F%D0%B7%D0%B8.jpg', null, null, null::date, 5),
  ('aleks-ataman', 'Ой, подзабыли', 'ALEKS ATAMAN, FINIK', 'Сингл', 'https://i.scdn.co/image/ab67616d0000b273f92e477dd0e57f79b8b725d2', null, 'track/6dkfI7A6hS2ZOaDl829Avv', null::date, 0),
  ('aleks-ataman', 'На блатных аккордах', 'ALEKS ATAMAN, FINIK', 'Сингл', 'https://i.scdn.co/image/ab67616d0000b273b81ef96a889c9a99aae2360d', null, 'track/55QwAXoKoDUM6LXJpLjE0n', null::date, 1),
  ('aleks-ataman', 'Юра Шатунов', 'ALEKS ATAMAN, FINIK', 'Сингл', 'https://i.scdn.co/image/ab67616d0000b2738f74fa38039c9696ac5c0a5d', null, 'track/3JDONsm8rJn1lPO7e7blB4', null::date, 2),
  ('aleks-ataman', 'Девочка бандитка', 'ALEKS ATAMAN, FINIK', 'Сингл', 'https://i.scdn.co/image/ab67616d0000b273a5ac524d2ebdfd9735d47391', null, 'track/4Yak0Dy4DBikh7pp0nUDVX', null::date, 3),
  ('aleks-ataman', 'Снежинки', 'ALEKS ATAMAN, FINIK', 'Сингл', 'https://i.scdn.co/image/ab67616d0000b273042a3d1afefe70dd50f8a103', null, 'track/7ic6T1EVcH6HwmR2k75FzP', null::date, 4),
  ('aleks-ataman', 'Диалоги тет-а-тет', 'ALEKS ATAMAN, FINIK', 'Сингл', 'https://i.scdn.co/image/ab67616d0000b273b778d5b71e0636644b378b44', null, 'track/7qEZALeVloIwiz6tvX8ZUL', null::date, 5),
  ('aleks-ataman', 'Лето, лето', 'ALEKS ATAMAN', 'Сингл', 'https://i.scdn.co/image/ab67616d0000b2738afcb968ff14f1d017fe7f86', null, null, null::date, 6),
  ('dlb', 'Late Night Show', 'DLB', 'Альбом', 'https://rhymesmusic.ru/photos/1/%D0%BA%D0%B0%D1%82%D0%B0%D0%BB%D0%BE%D0%B3%20%D0%B0%D1%80%D1%82%D0%B8%D1%81%D1%82%D0%BE%D0%B2/%D0%B4%D0%BB%D0%B1/-%D0%B4%D0%BB%D0%B1-%D0%B0%D0%BB%D1%8C%D0%B1%D0%BE%D0%BC.jpeg', null, null, null::date, 0),
  ('dlb', 'Беспредел', 'DLB', 'Сингл', 'https://rhymesmusic.ru/photos/1/%D0%BA%D0%B0%D1%82%D0%B0%D0%BB%D0%BE%D0%B3%20%D0%B0%D1%80%D1%82%D0%B8%D1%81%D1%82%D0%BE%D0%B2/%D0%B4%D0%BB%D0%B1/-%D0%B4%D0%BB%D0%B1-%D0%B1%D0%B5%D1%81%D0%BF%D1%80%D0%B5%D0%B4%D0%B5%D0%BB.jpg', null, null, null::date, 1),
  ('dlb', 'На повтор', 'DLB, Джеди', 'Сингл', 'https://rhymesmusic.ru/photos/1/%D0%BA%D0%B0%D1%82%D0%B0%D0%BB%D0%BE%D0%B3%20%D0%B0%D1%80%D1%82%D0%B8%D1%81%D1%82%D0%BE%D0%B2/%D0%B4%D0%BB%D0%B1/-%D0%B4%D0%BB%D0%B1-%D0%BD%D0%B0%D0%BF%D0%BE%D0%B2%D1%82%D0%BE%D1%80.jpg', null, null, null::date, 2),
  ('dlb', '100%', 'DLB, Хрися', 'Сингл', 'https://rhymesmusic.ru/photos/1/%D0%BA%D0%B0%D1%82%D0%B0%D0%BB%D0%BE%D0%B3%20%D0%B0%D1%80%D1%82%D0%B8%D1%81%D1%82%D0%BE%D0%B2/%D0%B4%D0%BB%D0%B1/-%D0%B4%D0%BB%D0%B1-1000.jpg', null, null, null::date, 3),
  ('dlb', '11 литров воды', 'DLB', 'Сингл', 'https://rhymesmusic.ru/photos/1/%D0%BA%D0%B0%D1%82%D0%B0%D0%BB%D0%BE%D0%B3%20%D0%B0%D1%80%D1%82%D0%B8%D1%81%D1%82%D0%BE%D0%B2/%D0%B4%D0%BB%D0%B1/-%D0%B4%D0%BB%D0%B1-11k.jpg', null, null, null::date, 4),
  ('polmateri', 'Маша', 'Полматери', 'Сингл', 'https://i.scdn.co/image/ab67616d0000b2737ea1a25b117a54d88a6a1b45', 'https://p.scdn.co/mp3-preview/4f8e010b22be9268abe1e32d196dadab4568478a?cid=0a456d853fde4ddc9d353d6349a1de8e', 'track/64epifHS5CvRUVgKEDbRJm', null::date, 0),
  ('polmateri', 'Псы попадут в рай', 'Полматери', 'Сингл', 'https://i.scdn.co/image/ab67616d0000b273f2bc3b8efeadfe9a8280b10c', 'https://p.scdn.co/mp3-preview/548b2fa3a5ac7803a1f9f77f2c61df5ea056b5a7?cid=0a456d853fde4ddc9d353d6349a1de8e', 'track/3yDdBYJc55fW1l56EsOgeC', null::date, 1),
  ('polmateri', 'Песни для девственников, ч. 2', 'Полматери', 'Альбом', 'https://rhymesmusic.ru/photos/3/%D0%BA%D0%B0%D1%82%D0%B0%D0%BB%D0%BE%D0%B3/%D0%BF%D0%BE%D0%BB%D0%BC%D0%B0%D1%82%D0%B5%D1%80%D0%B8/-%D0%BF%D0%BE%D0%BB%D0%BC%D0%B0%D1%82%D0%B5%D1%80%D0%B8-%D0%BF%D0%B5%D1%81%D0%BD%D0%B82.jpeg', 'https://p.scdn.co/mp3-preview/b88444d49987795eed506ca4a1d8f2f6f808097c?cid=0a456d853fde4ddc9d353d6349a1de8e', null, null::date, 2),
  ('lxner', 'n1ght visi0n', 'LXNER', 'Сингл', 'https://i.scdn.co/image/ab67616d0000b273c5de19e16d9918a9a52f7ffd', null, null, null::date, 0),
  ('lxner', 'Adaptive Strike', 'shadowraze, LXNER, quiizzzmeow', 'Сингл', 'https://i.scdn.co/image/ab67616d0000b273aafe4598bce4d31fca0a51b2', null, null, null::date, 1),
  ('lxner', 'Elysium', 'LXNER', 'Сингл', 'https://rhymesmusic.ru/photos/1/%D0%BA%D0%B0%D1%82%D0%B0%D0%BB%D0%BE%D0%B3%20%D0%B0%D1%80%D1%82%D0%B8%D1%81%D1%82%D0%BE%D0%B2/%D0%BB%D0%BE%D0%BD%D0%B5%D1%80/-lxner-elysium.jpg', null, null, null::date, 2),
  ('lxner', 'Лёд', 'WENARO, LXNER', 'Сингл', 'https://i.scdn.co/image/ab67616d0000b273761776ec62c9f8a6be00a244', null, null, null::date, 3),
  ('ivan-valeev', 'Memories', 'IVAN VALEEV', 'Сингл', 'https://i.scdn.co/image/ab67616d0000b273bdf70b253c970b5b6de2655d', 'https://p.scdn.co/mp3-preview/61df39551a3305d5bc50cdc2510852a7853a6c59?cid=6bc01e97e5904e1a9c49e8bcd515309c', null, null::date, 0),
  ('ivan-valeev', 'Химия', 'IVAN VALEEV', 'Сингл', 'https://i.scdn.co/image/ab67616d0000b27319c5c8ef37f78a0d19d21abf', 'https://p.scdn.co/mp3-preview/5a85e2eeb7904ef0544c45e1204c79b6cd52ffd1?cid=6bc01e97e5904e1a9c49e8bcd515309c', null, null::date, 1),
  ('ivan-valeev', 'WELOVE', 'IVAN VALEEV', 'Альбом', 'https://rhymesmusic.ru/photos/1/%D0%BA%D0%B0%D1%82%D0%B0%D0%BB%D0%BE%D0%B3%20%D0%B0%D1%80%D1%82%D0%B8%D1%81%D1%82%D0%BE%D0%B2/%D0%B8%D0%B2%D0%B0%D0%BD%20%D0%B2%D0%B0%D0%BB%D0%B5%D0%B5%D0%B2/-%D0%B2%D0%B0%D0%BB%D0%B5%D0%B5%D0%B2-%D0%BB%D0%BE%D0%B2.jpg', 'https://p.scdn.co/mp3-preview/f484c5af97c2c0a861e7922e2ee1e5ce80a0ff6d?cid=6bc01e97e5904e1a9c49e8bcd515309c', null, null::date, 2),
  ('quiizzzmeow', 'Альбом, который вы не ждали', 'quiizzzmeow', 'Альбом', 'https://i.scdn.co/image/ab67616d0000b2739b07288494e5851e53621717', null, null, null::date, 0),
  ('quiizzzmeow', 'Боль', 'quiizzzmeow, Мэйби Бэйби', 'Сингл', 'https://i.scdn.co/image/ab67616d0000b273edcb5029ede47a0b7b2f7b89', null, 'album/3YXGPmL4F6RuPKCLAmIiCL', null::date, 1),
  ('quiizzzmeow', 'Adaptive Strike', 'shadowraze, LXNER, quiizzzmeow', 'Сингл', 'https://i.scdn.co/image/ab67616d0000b273aafe4598bce4d31fca0a51b2', null, null, null::date, 2),
  ('quiizzzmeow', 'Крышу сносит', 'LXNER, quiizzzmeow', 'Сингл', 'https://i.scdn.co/image/ab67616d0000b27374d7b1d033e1640897a9c556', null, null, null::date, 3),
  ('quiizzzmeow', 'Сети', 'quiizzzmeow', 'Сингл', 'https://i.scdn.co/image/ab67616d0000b273c0009ad7c2bb2707dc369765', null, null, null::date, 4),
  ('quiizzzmeow', 'Aomine Daiki', 'quiizzzmeow', 'Сингл', 'https://i.scdn.co/image/ab67616d0000b2735858c3d5d5c9e5caac22563e', null, null, null::date, 5),
  ('quiizzzmeow', 'Звонки', 'quiizzzmeow', 'Сингл', 'https://rhymesmusic.ru/photos/1/%D0%BA%D0%B0%D1%82%D0%B0%D0%BB%D0%BE%D0%B3%20%D0%B0%D1%80%D1%82%D0%B8%D1%81%D1%82%D0%BE%D0%B2/%D0%BA%D0%B8%D0%B7%D0%BC%D1%8F%D1%83/-%D0%BA%D0%B8%D0%B7%D0%BC%D1%8F%D1%83-%D0%B7%D0%B2%D0%BE%D0%BD%D0%BA%D0%B8.jpg', null, null, null::date, 6),
  ('pyrokinesis', 'Я краснею при тебе как...', 'pyrokinesis', 'Сингл', 'https://i.scdn.co/image/ab67616d0000b2735c98f44f9160f43b46c1c676', null, null, null::date, 0),
  ('pyrokinesis', 'Легенда о Богине Мечей', 'pyrokinesis', 'Альбом', 'https://i.scdn.co/image/ab67616d0000b273ad1fa46fee9ed9ab36b218d9', null, null, null::date, 1),
  ('pyrokinesis', 'Геометрия тьмы', 'pyrokinesis', 'Альбом', 'https://rhymesmusic.ru/photos/3/%D0%BA%D0%B0%D1%82%D0%B0%D0%BB%D0%BE%D0%B3/%D0%BF%D0%B8%D1%80%D0%BE%D0%BA%D0%B8%D0%BD%D0%B5%D0%B7%D0%B8%D1%81/-%D0%BF%D0%B8%D1%80%D0%BE-%D0%B3%D0%B5%D0%BE%D0%BC%D0%B5%D1%82%D1%80%D0%B8%D1%8F.jpg', null, null, null::date, 2),
  ('pyrokinesis', 'ОКО', 'pyrokinesis', 'Сингл', 'https://i.scdn.co/image/ab67616d0000b27380a27427714daa9da9b6d23d', null, null, null::date, 3),
  ('pyrokinesis', 'Питер, чай, не Франция', 'pyrokinesis', 'Альбом', 'https://rhymesmusic.ru/photos/1/%D0%BA%D0%B0%D1%82%D0%B0%D0%BB%D0%BE%D0%B3%20%D0%B0%D1%80%D1%82%D0%B8%D1%81%D1%82%D0%BE%D0%B2/%D0%BF%D0%B8%D1%80%D0%BE%D0%BA%D0%B8%D0%BD%D0%B5%D0%B7%D0%B8%D1%81/-%D0%BF%D0%B8%D1%80%D0%BE-%D0%BF%D0%B8%D1%82%D0%B5%D1%80.jpg', null, null, null::date, 4),
  ('pyrokinesis', 'Моя милая пустота', 'pyrokinesis', 'Альбом', 'https://rhymesmusic.ru/photos/1/%D0%BA%D0%B0%D1%82%D0%B0%D0%BB%D0%BE%D0%B3%20%D0%B0%D1%80%D1%82%D0%B8%D1%81%D1%82%D0%BE%D0%B2/%D0%BF%D0%B8%D1%80%D0%BE%D0%BA%D0%B8%D0%BD%D0%B5%D0%B7%D0%B8%D1%81/-%D0%BF%D0%B8%D1%80%D0%BE-%D0%BF%D1%83%D1%81%D1%82%D0%BE%D1%82%D0%B0.jpg', null, null, null::date, 5),
  ('kis-kis', 'Отчим', 'кис-кис', 'Альбом', 'https://rhymesmusic.ru/photos/1/%D0%BA%D0%B0%D1%82%D0%B0%D0%BB%D0%BE%D0%B3%20%D0%B0%D1%80%D1%82%D0%B8%D1%81%D1%82%D0%BE%D0%B2/%D0%BA%D0%B8%D1%81%D0%BA%D0%B8%D1%81/-%D0%BA%D0%B8%D1%81-%D0%BA%D0%B8%D1%81-%D0%BE%D1%82%D1%87%D0%B8%D0%BC.jpeg', null, null, null::date, 0),
  ('kis-kis', 'Клетка', 'кис-кис', 'Сингл', 'https://rhymesmusic.ru/photos/1/%D0%BA%D0%B0%D1%82%D0%B0%D0%BB%D0%BE%D0%B3%20%D0%B0%D1%80%D1%82%D0%B8%D1%81%D1%82%D0%BE%D0%B2/%D0%BA%D0%B8%D1%81%D0%BA%D0%B8%D1%81/-%D0%BA%D0%B8%D1%81-%D0%BA%D0%BB%D0%B5%D1%82%D0%BA%D0%B0.jpg', null, null, null::date, 1),
  ('kis-kis', 'Пир во время чумы', 'кис-кис', 'Альбом', 'https://rhymesmusic.ru/photos/1/%D0%BA%D0%B0%D1%82%D0%B0%D0%BB%D0%BE%D0%B3%20%D0%B0%D1%80%D1%82%D0%B8%D1%81%D1%82%D0%BE%D0%B2/%D0%BA%D0%B8%D1%81%D0%BA%D0%B8%D1%81/-%D0%BA%D0%B8%D1%81-%D0%BF%D0%B8%D1%80.jpg', null, null, null::date, 2),
  ('sqwoz-bab', 'АУФ', 'SQWOZ BAB, The First Station', 'Сингл', 'https://i.scdn.co/image/ab67616d0000b2732135cf3c617ad707790a6e27', null, null, null::date, 0),
  ('sqwoz-bab', 'Body Language', 'SQWOZ BAB', 'Сингл', 'https://rhymesmusic.ru/photos/1/%D0%BA%D0%B0%D1%82%D0%B0%D0%BB%D0%BE%D0%B3%20%D0%B0%D1%80%D1%82%D0%B8%D1%81%D1%82%D0%BE%D0%B2/%D1%81%D0%BA%D0%B2%D0%BE%D0%B7%D1%8C%20%D0%B1%D0%B0%D0%B1/-%D1%81%D0%BA%D0%B2%D0%BE%D0%B7%D1%8C-%D0%B1%D0%B0%D0%B4%D0%B8.jpg', null, null, null::date, 1),
  ('sqwoz-bab', 'Бывший', 'SQWOZ BAB, Хлеб', 'Сингл', 'https://rhymesmusic.ru/photos/1/%D0%BA%D0%B0%D1%82%D0%B0%D0%BB%D0%BE%D0%B3%20%D0%B0%D1%80%D1%82%D0%B8%D1%81%D1%82%D0%BE%D0%B2/%D1%81%D0%BA%D0%B2%D0%BE%D0%B7%D1%8C%20%D0%B1%D0%B0%D0%B1/-%D1%81%D0%BA%D0%B2%D0%BE%D0%B7%D1%8C-%D0%B1%D1%8B%D0%B2%D1%88%D0%B8%D0%B8%CC%86.jpg', null, null, null::date, 2),
  ('sqwoz-bab', 'RINGTONE DEMO FINAL MIX 123 dfghfw', 'SQWOZ BAB', 'Альбом', 'https://rhymesmusic.ru/photos/1/%D0%BA%D0%B0%D1%82%D0%B0%D0%BB%D0%BE%D0%B3%20%D0%B0%D1%80%D1%82%D0%B8%D1%81%D1%82%D0%BE%D0%B2/%D1%81%D0%BA%D0%B2%D0%BE%D0%B7%D1%8C%20%D0%B1%D0%B0%D0%B1/-%D1%81%D0%BA%D0%B2%D0%BE%D0%B7%D1%8C-%D1%80%D0%B8%D0%BD%D0%B3%D1%82%D0%BE%D0%BD.jpg', null, null, null::date, 3),
  ('sqwoz-bab', 'Братва на связи', 'SQWOZ BAB, GONE.Fludd, blago white', 'Сингл', 'https://rhymesmusic.ru/photos/1/%D0%BA%D0%B0%D1%82%D0%B0%D0%BB%D0%BE%D0%B3%20%D0%B0%D1%80%D1%82%D0%B8%D1%81%D1%82%D0%BE%D0%B2/%D1%81%D0%BA%D0%B2%D0%BE%D0%B7%D1%8C%20%D0%B1%D0%B0%D0%B1/-%D1%81%D0%BA%D0%B2%D0%BE%D0%B7%D1%8C-%D0%B1%D1%80%D0%B0%D1%82%D0%B2%D0%B0.jpg', null, null, null::date, 4),
  ('xmax', 'Просто люби', 'xMax', 'Сингл', 'https://i.scdn.co/image/ab67616d0000b273455e693b46e66ae9232f4373', null, null, null::date, 0),
  ('xmax', 'Ошибаюсь', 'xMax', 'Сингл', 'https://i.scdn.co/image/ab67616d0000b27319964bc51fbd5b1d36ec34b9', null, null, null::date, 1),
  ('xmax', 'Следующая станция', 'xMax, suramura', 'Сингл', 'https://i.scdn.co/image/ab67616d0000b273ae1a053a0365bf23bbf56aca', null, null, null::date, 2),
  ('4etvergov', 'Про неё', '4ETVERGOV', 'Сингл', null, null, null, '2026-04-17'::date, 0),
  ('4etvergov', 'Красивая', '4ETVERGOV', 'Сингл', null, null, null, '2025-10-23'::date, 1),
  ('4etvergov', 'Доча', '4ETVERGOV', 'Сингл', null, null, null, '2025-06-20'::date, 2),
  ('4etvergov', 'Красивая пара', '4ETVERGOV', 'Сингл', null, null, null, '2025-05-16'::date, 3),
  ('4etvergov', 'Соблазн', '4ETVERGOV', 'Сингл', null, null, null, '2025-01-17'::date, 4),
  ('4etvergov', 'Криминал', '4ETVERGOV, BartiZ', 'Сингл', null, null, null, '2023-11-30'::date, 5),
  ('4etvergov', 'Лова', '4ETVERGOV', 'Сингл', null, null, null, '2023-10-11'::date, 6);
insert into releases (artist_slug, title, artists, type, cover, preview, spotify, released_on, sort)
select n.* from _rel n
where exists (select 1 from artists a where a.slug = n.artist_slug)
  and not exists (select 1 from releases e where e.artist_slug = n.artist_slug and regexp_replace(translate(lower(e.title), 'ё', 'е'), '[^[:alnum:]()]+', '', 'g') = regexp_replace(translate(lower(n.title), 'ё', 'е'), '[^[:alnum:]()]+', '', 'g'));
update releases e set released_on = coalesce(e.released_on, n.released_on), cover = coalesce(e.cover, n.cover)
from _rel n
where e.artist_slug = n.artist_slug and regexp_replace(translate(lower(e.title), 'ё', 'е'), '[^[:alnum:]()]+', '', 'g') = regexp_replace(translate(lower(n.title), 'ё', 'е'), '[^[:alnum:]()]+', '', 'g')
  and ((e.released_on is null and n.released_on is not null) or (e.cover is null and n.cover is not null));

create temp table _trk (artist_slug text, title text, artists text, streams bigint, cover text, preview text, spotify text) on commit drop;
insert into _trk values
  ('dora', 'Дорадура', 'Дора', 28256972, 'https://i.scdn.co/image/ab67616d0000b2738d6cfb51c637bcde3009326b', 'https://p.scdn.co/mp3-preview/f6fb99e5759ffb1bdd9238fd4cf9e383e7676f74?cid=778671c82f044a72a2ca0db89b48f6e6', null),
  ('dora', 'Втюрилась', 'Дора', 26282019, 'https://i.scdn.co/image/ab67616d0000b273c9c6ffa3829ecebc9a0cd7d0', 'https://p.scdn.co/mp3-preview/3600939d7ca0c78e2d01fab0412f94f2674cd0ed?cid=778671c82f044a72a2ca0db89b48f6e6', null),
  ('dora', 'Барбисайз', 'Дора, Мэйби Бэйби', 15585776, 'https://i.scdn.co/image/ab67616d0000b27353d8140de43903c9248ceb6d', 'https://p.scdn.co/mp3-preview/91e797c50169b3e627e14f108a6715087a41672c?cid=778671c82f044a72a2ca0db89b48f6e6', null),
  ('dora', 'Сан Ларан', 'Платина, Дора', 15560153, 'https://i.scdn.co/image/ab67616d0000b273ae085ccbb23ac58787e6967b', 'https://p.scdn.co/mp3-preview/4438b596b7511e2cc1801b7b0d69b489a7151687?cid=778671c82f044a72a2ca0db89b48f6e6', null),
  ('dora', 'Младшая сестра', 'Дора', 13136190, 'https://i.scdn.co/image/ab67616d0000b2738d6cfb51c637bcde3009326b', 'https://p.scdn.co/mp3-preview/f08315fbe968d910cd99850d758a3802362f73?cid=778671c82f044a72a2ca0db89b48f6e6', null),
  ('dora', 'Осень пьяная', 'Дора', 6235045, 'https://i.scdn.co/image/ab67616d0000b273c9c6ffa3829ecebc9a0cd7d0', 'https://p.scdn.co/mp3-preview/030fd749f7fa78831f492a1f0081d6469390fcd7?cid=778671c82f044a72a2ca0db89b48f6e6', null),
  ('dora', 'Капли', 'OG Buda, Дора', 4292693, 'https://i.scdn.co/image/ab67616d0000b27374dd7c29ffd01a609af4ca1c', 'https://p.scdn.co/mp3-preview/a21cba70820a524100d389c1fe7e12d13acc9c7e?cid=778671c82f044a72a2ca0db89b48f6e6', null),
  ('dora', 'Нет тебя', 'Дора, ЛСП', 1835766, 'https://i.scdn.co/image/ab67616d0000b27353d8140de43903c9248ceb6d', 'https://p.scdn.co/mp3-preview/b96735314e6c4748736a281888e65dd9ed36775f?cid=778671c82f044a72a2ca0db89b48f6e6', null),
  ('dora', 'Я боюсь людей', 'Дора', 1423151, 'https://i.scdn.co/image/ab67616d0000b27353d8140de43903c9248ceb6d', 'https://p.scdn.co/mp3-preview/9ac5a4fa039202cdd195aeb290ad07bb552ae52b?cid=778671c82f044a72a2ca0db89b48f6e6', null),
  ('dora', 'Папик', 'Дора, Yanix', 649389, 'https://i.scdn.co/image/ab67616d0000b273d76137707e516ab4db1aa712', 'https://p.scdn.co/mp3-preview/c3b258851a18fdd3c0cbadf582b37ab23a2ef8ec?cid=778671c82f044a72a2ca0db89b48f6e6', null),
  ('deti-rave', 'Турбо пушка', 'Дети Rave', 21711406, 'https://i.scdn.co/image/ab67616d0000b2733a2a28eadcf8cb132c4c3ec1', null, 'album/5yGC3jz5v0KUVlZYo6VoEI'),
  ('deti-rave', 'Икры и Сала', 'Дети Rave', 16466627, 'https://i.scdn.co/image/ab67616d0000b27396918f74070cc6337e9e8304', null, null),
  ('deti-rave', 'LOVE ON RAVE', 'Дети Rave', 8146082, 'https://i.scdn.co/image/ab67616d0000b273c8337cc228d811158898313f', null, null),
  ('maybe-baby', 'Аскорбинка', 'Мэйби Бэйби', 6513965, 'https://i.scdn.co/image/ab67616d0000b273ace86bd81826295f5fddd97f', null, null),
  ('maybe-baby', 'Тамагочи', 'Мэйби Бэйби, алёна швец.', 6376662, 'https://i.scdn.co/image/ab67616d0000b273393d330bd16ed2fd5bd6b333', null, null),
  ('maybe-baby', 'Боль', 'quiizzzmeow, Мэйби Бэйби', 1548022, 'https://i.scdn.co/image/ab67616d0000b273edcb5029ede47a0b7b2f7b89', null, null),
  ('maybe-baby', 'ЗАЙКА', 'Мэйби Бэйби', 687528, 'https://i.scdn.co/image/ab67616d0000b27361deb3bd43c7c789cca24587', null, null),
  ('maybe-baby', 'Барби из трущоб', 'Мэйби Бэйби', 136661, 'https://i.scdn.co/image/ab67616d0000b2736631186e052e7266434719a4', null, null),
  ('mukka', 'Днями-ночами', 'pyrokinesis, МУККА', 26708681, 'https://i.scdn.co/image/ab67616d0000b273e41b1431cf63aa22f8198bbf', 'https://p.scdn.co/mp3-preview/af7f25e25fe3b6997159dada69e37ac8bca2d5c8?cid=23917817e5d04cfa84952e02200ec7df', null),
  ('mukka', 'Не выводи меня', 'МУККА, Три дня дождя', 4456878, 'https://i.scdn.co/image/ab67616d0000b27302cad37bb1e3e2ae68fae02a', 'https://p.scdn.co/mp3-preview/cc15cb2823343dcb0818ab31b73751d3067389d6?cid=23917817e5d04cfa84952e02200ec7df', null),
  ('mukka', 'Весна', 'МУККА, Три дня дождя', 2830861, 'https://i.scdn.co/image/ab67616d0000b27302cad37bb1e3e2ae68fae02a', 'https://p.scdn.co/mp3-preview/380b3d3b5b775cf608e2215420587939b6c531fb?cid=23917817e5d04cfa84952e02200ec7df', null),
  ('mukka', 'чёрное сердце', 'МУККА, pyrokinesis', 1167068, 'https://i.scdn.co/image/ab67616d0000b273ec173b5637632d439093365a', 'https://p.scdn.co/mp3-preview/929b51b1652444e2539fdefddee8f6853d010caa?cid=6bc01e97e5904e1a9c49e8bcd515309c', null),
  ('betsi', 'Simple dimpl pop it squish', 'M&A, Betsy', 12605403, 'https://i.scdn.co/image/ab67616d0000b27306ecedd7e1b733d7db2bcfad', null, null),
  ('betsi', 'Capybara', 'Сто-Личный Она-Нас, Betsy', 8887545, 'https://i.scdn.co/image/ab67616d0000b27378bb123297049060d11b95a2', null, null),
  ('betsi', 'Pump It Up', 'Betsy', 379207, null, null, null),
  ('betsi', 'GOLD APPLE', 'M&A, Betsy', 157642, null, null, null),
  ('betsi', 'Электрощиток', 'Betsy', 12225, 'https://i.scdn.co/image/ab67616d0000b273171a80f4ae1c62cb6a0f5671', null, null),
  ('betsi', 'Фрэнк', 'Betsy', 11664, 'https://i.scdn.co/image/ab67616d0000b27399bf2dc33e284af7ec36b264', null, null),
  ('by-indiya', 'люби меня так', 'By Индия', 5366980, 'https://i.scdn.co/image/ab67616d0000b273493bd9c8842441053f60c136', null, null),
  ('by-indiya', 'я не помню', 'By Индия', 5327616, 'https://i.scdn.co/image/ab67616d0000b273bccfb3f4312a526488474a87', null, null),
  ('by-indiya', 'Полет - Sowyol Remix', 'By Индия, SOWYOL', 5009525, 'https://i.scdn.co/image/ab67616d0000b2738db82401d170de8dee835d23', null, null),
  ('by-indiya', 'Вселенная', 'By Индия', 4504198, 'https://i.scdn.co/image/ab67616d0000b273dc1a3ef96b37712eac728155', null, null),
  ('by-indiya', 'вечеринка', 'By Индия', 3570549, 'https://i.scdn.co/image/ab67616d0000b273493bd9c8842441053f60c136', null, null),
  ('by-indiya', 'думать о тебе', 'By Индия', 3142259, 'https://i.scdn.co/image/ab67616d0000b273493bd9c8842441053f60c136', null, null),
  ('by-indiya', 'целуйся правильно', 'By Индия', 1007569, 'https://i.scdn.co/image/ab67616d0000b27397d2f1c875e99d709262e0d0', null, null),
  ('by-indiya', 'Кислород', 'By Индия', 804640, 'https://i.scdn.co/image/ab67616d0000b273b9d00c7ca1499acb91573a15', null, null),
  ('finik', 'Диалоги тет-а-тет', 'ALEKS ATAMAN, FINIK', 11682031, 'https://i.scdn.co/image/ab67616d0000b273b778d5b71e0636644b378b44', null, null),
  ('finik', 'Снежинки', 'ALEKS ATAMAN, FINIK', 7567794, 'https://i.scdn.co/image/ab67616d0000b273042a3d1afefe70dd50f8a103', null, null),
  ('finik', 'Девочка бандитка', 'ALEKS ATAMAN, FINIK', 5427613, 'https://i.scdn.co/image/ab67616d0000b273a5ac524d2ebdfd9735d47391', null, null),
  ('finik', 'Юра Шатунов', 'ALEKS ATAMAN, FINIK', 3864760, 'https://i.scdn.co/image/ab67616d0000b2738f74fa38039c9696ac5c0a5d', null, null),
  ('finik', 'Ой, подзабыли', 'ALEKS ATAMAN, FINIK', 3587505, 'https://i.scdn.co/image/ab67616d0000b273f92e477dd0e57f79b8b725d2', null, null),
  ('finik', 'Диалоги тет-а-тет (Karmv, 4ETVERGOV Remix)', 'ALEKS ATAMAN, FINIK, karmv, 4ETVERGOV', 2272280, 'https://i.scdn.co/image/ab67616d0000b27357a25128c0bd4bdf16038dd9', null, null),
  ('finik', 'Ой, молодой', 'FINIK', 1461522, 'https://i.scdn.co/image/ab67616d0000b273497a11a1833e7ed83e84b411', null, null),
  ('finik', 'На блатных аккордах', 'ALEKS ATAMAN, FINIK', 1274357, 'https://i.scdn.co/image/ab67616d0000b273b81ef96a889c9a99aae2360d', null, null),
  ('gunwest', 'Никотин', 'Ганвест', 31552351, 'https://i.scdn.co/image/ab67616d0000b273cbd3cfe8896a92b75e60190f', 'https://p.scdn.co/mp3-preview/d2b94acbafb8ec5698a6af92ce92c42ca9f4c5ce?cid=6bc01e97e5904e1a9c49e8bcd515309c', null),
  ('gunwest', 'Нирвана', 'Ганвест', 5978105, null, null, null),
  ('gunwest', 'FENDI2', 'Ганвест', 3828363, null, null, null),
  ('gunwest', 'Ты такая GLE', 'Ганвест', 2023358, null, null, null),
  ('gunwest', 'На рахате', 'Ганвест', 1836705, null, null, null),
  ('gunwest', 'Ночная река', 'Ганвест', 958800, null, null, null),
  ('gunwest', 'Моя белорусочка', 'Ганвест', 42193, 'https://i.scdn.co/image/ab67616d0000b27317a2c7df424d2e1b29cbc0ca', 'https://p.scdn.co/mp3-preview/093ccdc761fe030f61e5103a9ebe73c1928942b7?cid=6bc01e97e5904e1a9c49e8bcd515309c', null),
  ('xassa', 'Дикари', 'Xassa', 6204926, 'https://i.scdn.co/image/ab67616d0000b27386298ec8535c7d024e37bef1', null, null),
  ('xassa', 'Капитан', 'Xassa', 2392414, 'https://i.scdn.co/image/ab67616d0000b27373660cc10ef4fc9fa9578a41', null, null),
  ('xassa', 'Романтик', 'Xassa', 2010215, 'https://i.scdn.co/image/ab67616d0000b273bbd1cb7b2de296cc68e53e14', null, null),
  ('xassa', 'Beautiful Life', 'Xassa', 1267654, 'https://i.scdn.co/image/ab67616d0000b2733dfe0dc18d2aae431acea52c', null, null),
  ('xassa', 'Грехи', 'Xassa, BODIEV', 1145391, 'https://i.scdn.co/image/ab67616d0000b273bcf176927485a2f4ef3f140e', null, null),
  ('xassa', 'All Night', 'Xassa', 680197, 'https://i.scdn.co/image/ab67616d0000b273bb57fa5add87be6494a82099', null, null),
  ('xassa', 'Самолёт', 'Xassa, BODIEV', 619184, 'https://i.scdn.co/image/ab67616d0000b2731f78594fa712582040158b19', null, null),
  ('xassa', 'Потом', 'BODIEV, Xassa', 558152, 'https://i.scdn.co/image/ab67616d0000b273c22fe833a18f0aa9cab036c2', null, null),
  ('xassa', 'Не кусай', 'Xassa', 475543, 'https://i.scdn.co/image/ab67616d0000b273d2af989306795ae5e81f195d', null, null),
  ('xassa', 'Девочкам курить некрасиво', 'Xassa', 245260, 'https://i.scdn.co/image/ab67616d0000b273a15c9d30bd303348445aa706', null, null),
  ('bodiev', 'Крузак 200', 'BODIEV', 9726980, 'https://i.scdn.co/image/ab67616d0000b2739f8414317ee1ffa081c58207', null, null),
  ('bodiev', 'Караван', 'BODIEV', 6471351, 'https://i.scdn.co/image/ab67616d0000b27359dba8ccc528c25dbe0cad92', null, null),
  ('bodiev', 'Самурай', 'BODIEV', 4097405, 'https://i.scdn.co/image/ab67616d0000b2735c9d7d87b41069aa1b3fb56d', null, null),
  ('bodiev', 'Карусели', 'BODIEV', 3294265, 'https://i.scdn.co/image/ab67616d0000b27308922424c1bdcd8eb53ccc4a', null, null),
  ('bodiev', 'Чёрный мерин', 'BODIEV', 2632655, 'https://i.scdn.co/image/ab67616d0000b27375a2c355832cb3724b83c1f7', null, null),
  ('bodiev', 'No pasaran', 'BODIEV', 2539808, 'https://i.scdn.co/image/ab67616d0000b2739bbac567a5542fe0fcc5c51b', null, null),
  ('bodiev', 'Её зелёные глаза', 'BODIEV', 649955, 'https://i.scdn.co/image/ab67616d0000b27376200be5511f05c365a44e1b', null, null),
  ('bodiev', 'Самолёт', 'Xassa, BODIEV', 619184, 'https://i.scdn.co/image/ab67616d0000b2731f78594fa712582040158b19', null, null),
  ('bodiev', 'Потом', 'BODIEV, Xassa', 558152, 'https://i.scdn.co/image/ab67616d0000b273c22fe833a18f0aa9cab036c2', null, null),
  ('bodiev', 'Фиеста', 'BODIEV', 159515, 'https://i.scdn.co/image/ab67616d0000b273b8dbbccb4b5aa69a04979b78', null, null),
  ('aleks-ataman', 'Диалоги тет-а-тет', 'ALEKS ATAMAN, FINIK', 11682031, 'https://i.scdn.co/image/ab67616d0000b273b778d5b71e0636644b378b44', null, null),
  ('aleks-ataman', 'Снежинки', 'ALEKS ATAMAN, FINIK', 7567794, 'https://i.scdn.co/image/ab67616d0000b273042a3d1afefe70dd50f8a103', null, null),
  ('aleks-ataman', 'Девочка бандитка', 'ALEKS ATAMAN, FINIK', 5427613, 'https://i.scdn.co/image/ab67616d0000b273a5ac524d2ebdfd9735d47391', null, null),
  ('aleks-ataman', 'Юра Шатунов', 'ALEKS ATAMAN, FINIK', 3864760, 'https://i.scdn.co/image/ab67616d0000b2738f74fa38039c9696ac5c0a5d', null, null),
  ('aleks-ataman', 'Ой, подзабыли', 'ALEKS ATAMAN, FINIK', 3587505, 'https://i.scdn.co/image/ab67616d0000b273f92e477dd0e57f79b8b725d2', null, null),
  ('aleks-ataman', 'Диалоги тет-а-тет (Karmv, 4ETVERGOV Remix)', 'ALEKS ATAMAN, FINIK, karmv, 4ETVERGOV', 2272280, 'https://i.scdn.co/image/ab67616d0000b27357a25128c0bd4bdf16038dd9', null, null),
  ('aleks-ataman', 'Белыми ночами', 'ALEKS ATAMAN, FINIK', 1289624, 'https://i.scdn.co/image/ab67616d0000b273567e9d451e95383d1d10d473', null, null),
  ('aleks-ataman', 'На блатных аккордах', 'ALEKS ATAMAN, FINIK', 1274357, 'https://i.scdn.co/image/ab67616d0000b273b81ef96a889c9a99aae2360d', null, null),
  ('aleks-ataman', 'Лето, лето', 'ALEKS ATAMAN', 1100835, 'https://i.scdn.co/image/ab67616d0000b2738afcb968ff14f1d017fe7f86', null, null),
  ('dlb', 'welcome to russia', 'dlb', 5423277, 'https://i.scdn.co/image/ab67616d0000b273db6561441d5cfb10703014d4', null, null),
  ('dlb', 'ультрашоколад', 'dlb', 2822369, 'https://i.scdn.co/image/ab67616d0000b273e903ac27d19f7653f7e738ba', null, null),
  ('dlb', 'катка', 'dlb', 2652342, 'https://i.scdn.co/image/ab67616d0000b273649586caca3c30100c891ab9', null, null),
  ('dlb', 'МОЛОДЫ', 'dlb, COLDCLOUD', 2567679, 'https://i.scdn.co/image/ab67616d0000b2730e0a505f4243cd8f6de8c522', null, null),
  ('dlb', 'зайчик и барбосик', 'dlb', 1874903, 'https://i.scdn.co/image/ab67616d0000b2738af560305fdece5ae1b4e791', null, null),
  ('dlb', 'мне не нравится', 'dlb', 1828338, 'https://i.scdn.co/image/ab67616d0000b273a719f3a75b2de405680b1894', null, null),
  ('dlb', 'село', 'dlb', 1018174, 'https://i.scdn.co/image/ab67616d0000b2738af560305fdece5ae1b4e791', null, null),
  ('dlb', 'телега', 'dlb', 844383, 'https://i.scdn.co/image/ab67616d0000b273e903ac27d19f7653f7e738ba', null, null),
  ('dlb', 'late night', 'dlb', 670715, 'https://i.scdn.co/image/ab67616d0000b273071f051e2bac7c1bb93f4a2d', null, null),
  ('polmateri', 'ярче звёзд', 'Полматери', 11323636, 'https://i.scdn.co/image/ab67616d0000b2732f093ad573ee3d6ea2b6ff69', 'https://p.scdn.co/mp3-preview/96efdef41b37b531926f49207985f0345c6b027b?cid=9f8dbb1747904fbca4eb9c7989c4339d', null),
  ('polmateri', 'маша', 'Полматери', 6167720, null, null, null),
  ('polmateri', 'мне похуй я панк', 'Полматери', 5182409, null, null, null),
  ('polmateri', 'нам канец!', 'Полматери', 5060317, null, null, null),
  ('polmateri', 'я неудачник', 'Полматери', 4320770, null, null, null),
  ('polmateri', 'хочу сдохнуть', 'Полматери', 4214944, null, null, null),
  ('polmateri', 'типичная реперская песня', 'Полматери', 4194424, 'https://i.scdn.co/image/ab67616d0000b273969be2e64f39175ef7d40f6c', 'https://p.scdn.co/mp3-preview/2d922aff5e5cfec5abc7fdb81b3459e50ef5461c?cid=9f8dbb1747904fbca4eb9c7989c4339d', null),
  ('polmateri', 'псы попадут в рай', 'Полматери', 3907154, 'https://i.scdn.co/image/ab67616d0000b273f2bc3b8efeadfe9a8280b10c', 'https://p.scdn.co/mp3-preview/1f0e8dbbbdcfd90f5d50e782778f6f88da6677d2?cid=9f8dbb1747904fbca4eb9c7989c4339d', null),
  ('polmateri', 'ненавижу свою жизнь!!!', 'Полматери', 3491824, 'https://i.scdn.co/image/ab67616d0000b273a910a2871fb899bda5079217', 'https://p.scdn.co/mp3-preview/d2ec9d7d72eca997aa9197b789c20b44c90602a3?cid=9f8dbb1747904fbca4eb9c7989c4339d', null),
  ('polmateri', 'тачки четыре', 'Полматери', 3106181, 'https://i.scdn.co/image/ab67616d0000b2733fda0d8d2b020f234e1b93fd', 'https://p.scdn.co/mp3-preview/773cfb1381fa413fb94dddd55b403a501dafde6f?cid=9f8dbb1747904fbca4eb9c7989c4339d', null),
  ('lxner', 'Лёд', 'WENARO, LXNER', 32342467, 'https://i.scdn.co/image/ab67616d0000b273761776ec62c9f8a6be00a244', null, null),
  ('lxner', 'adaptive strike', 'shadowraze, LXNER, quiizzzmeow', 18447406, 'https://i.scdn.co/image/ab67616d0000b273aafe4598bce4d31fca0a51b2', null, null),
  ('lxner', 'Крышу сносит', 'LXNER, quiizzzmeow', 5392152, 'https://i.scdn.co/image/ab67616d0000b27374d7b1d033e1640897a9c556', null, null),
  ('lxner', 'Crowbars', 'LXNER, takeluf', 4864387, 'https://i.scdn.co/image/ab67616d0000b273545afb8046499746fb093bcb', null, null),
  ('lxner', 'связь', 'LXNER, rizza', 3785106, 'https://i.scdn.co/image/ab67616d0000b2734ac6ec4a11a062f4f97ba003', null, null),
  ('lxner', 'Девочка-аниме', 'Horoshiyagni, ТРАВМА, Клим, retroyse, LXNER', 3557666, 'https://i.scdn.co/image/ab67616d0000b27341caf3dcf53ac61de890b6bf', null, null),
  ('lxner', 'Забываю', 'LXNER, lazyy', 1767953, 'https://i.scdn.co/image/ab67616d0000b27386a4a9e8bfef3c2af193d137', null, null),
  ('lxner', 'Звёзды', 'LXNER, WENARO', 1368839, 'https://i.scdn.co/image/ab67616d0000b273f6ab83b0d4341fc554060ed5', null, null),
  ('lxner', 'Неверно', 'Midix, LXNER', 868948, 'https://i.scdn.co/image/ab67616d0000b273dcd045bf81a98fee54e4240f', null, null),
  ('lxner', 'n1ght visi0n', 'LXNER', 208471, 'https://i.scdn.co/image/ab67616d0000b273c5de19e16d9918a9a52f7ffd', null, null),
  ('ivan-valeev', 'Novella', 'IVAN VALEEV', 18446982, 'https://i.scdn.co/image/ab67616d0000b27367ced6ad46e68128380bdd49', 'https://p.scdn.co/mp3-preview/f484c5af97c2c0a861e7922e2ee1e5ce80a0ff6d?cid=9f8dbb1747904fbca4eb9c7989c4339d', null),
  ('ivan-valeev', 'Заберу (Frost & Robby Mond & Wonder''s Radio Remix)', 'IVAN VALEEV', 11563653, 'https://i.scdn.co/image/ab67616d0000b2734419aa3ce9aa18861d41eebc', 'https://p.scdn.co/mp3-preview/b356093b33ef8520a2de74fc8a1d2c4fd6089c1f?cid=9f8dbb1747904fbca4eb9c7989c4339d', null),
  ('ivan-valeev', 'Парадокс (Frost & Robby Mond & Wonder''s Radio Remix)', 'IVAN VALEEV', 3052742, 'https://i.scdn.co/image/ab67616d0000b2737fddbe2b58740440ae54a55f', 'https://p.scdn.co/mp3-preview/10f7c570602fdd7a833bbecaba0e8c7981ca755c?cid=9f8dbb1747904fbca4eb9c7989c4339d', null),
  ('ivan-valeev', 'Пьяная', 'IVAN VALEEV, Andery Toronto', 3036347, 'https://i.scdn.co/image/ab67616d0000b27367ced6ad46e68128380bdd49', 'https://p.scdn.co/mp3-preview/557e8879c0b2b99374fa0b98366319b790939808?cid=9f8dbb1747904fbca4eb9c7989c4339d', null),
  ('ivan-valeev', 'Парадокс', 'IVAN VALEEV', 2521992, 'https://i.scdn.co/image/ab67616d0000b273756da62d6ba04a87b5a0c11a', 'https://p.scdn.co/mp3-preview/85a9c3c9c9635fdab2619278db3a1c430d039a50?cid=9f8dbb1747904fbca4eb9c7989c4339d', null),
  ('ivan-valeev', 'Bye Bye', 'IVAN VALEEV', 593887, 'https://i.scdn.co/image/ab67616d0000b2734d9aba444455550851e476f9', 'https://p.scdn.co/mp3-preview/53053270b8fe4b9a5f5dda56aae1a44cafc0e515?cid=9f8dbb1747904fbca4eb9c7989c4339d', null),
  ('ivan-valeev', 'Не чувствую', 'IVAN VALEEV', 271730, 'https://i.scdn.co/image/ab67616d0000b273f79484d06067280d5667cfa6', 'https://p.scdn.co/mp3-preview/531781b0a5962d10fe058cbc6f3618015248f81c?cid=9f8dbb1747904fbca4eb9c7989c4339d', null),
  ('ivan-valeev', 'Memories', 'IVAN VALEEV', 188347, 'https://i.scdn.co/image/ab67616d0000b273bdf70b253c970b5b6de2655d', 'https://p.scdn.co/mp3-preview/61df39551a3305d5bc50cdc2510852a7853a6c59?cid=9f8dbb1747904fbca4eb9c7989c4339d', null),
  ('quiizzzmeow', 'Aomine Daiki', 'quiizzzmeow', 23901389, 'https://i.scdn.co/image/ab67616d0000b2735858c3d5d5c9e5caac22563e', null, null),
  ('quiizzzmeow', 'adaptive strike', 'shadowraze, LXNER, quiizzzmeow', 18447406, 'https://i.scdn.co/image/ab67616d0000b273aafe4598bce4d31fca0a51b2', null, null),
  ('quiizzzmeow', 'сети', 'quiizzzmeow', 10880298, 'https://i.scdn.co/image/ab67616d0000b273c0009ad7c2bb2707dc369765', null, null),
  ('quiizzzmeow', 'Крышу сносит', 'LXNER, quiizzzmeow', 5392152, null, null, null),
  ('quiizzzmeow', 'Alohadance (Remix)', 'quiizzzmeow', 4958917, null, null, null),
  ('quiizzzmeow', 'Слышу как ты дышишь', 'Midix, quiizzzmeow', 4237022, null, null, null),
  ('quiizzzmeow', 'JDM NFS', 'shadowraze, quiizzzmeow, Midix, jzxdx', 1949449, null, null, null),
  ('quiizzzmeow', 'Боль', 'quiizzzmeow, Мэйби Бэйби', 1548022, 'https://i.scdn.co/image/ab67616d0000b273edcb5029ede47a0b7b2f7b89', null, null),
  ('quiizzzmeow', 'Танто', 'quiizzzmeow, Midix', 430048, 'https://i.scdn.co/image/ab67616d0000b2739b07288494e5851e53621717', null, null),
  ('quiizzzmeow', 'Chainsawman', 'quiizzzmeow', 260219, 'https://i.scdn.co/image/ab67616d0000b2739b07288494e5851e53621717', null, null),
  ('pyrokinesis', 'Днями-ночами', 'pyrokinesis, МУККА', 26708681, 'https://i.scdn.co/image/ab67616d0000b273e41b1431cf63aa22f8198bbf', 'https://p.scdn.co/mp3-preview/af7f25e25fe3b6997159dada69e37ac8bca2d5c8?cid=23917817e5d04cfa84952e02200ec7df', null),
  ('pyrokinesis', 'Цветами радуги', 'pyrokinesis', 15879526, 'https://i.scdn.co/image/ab67616d0000b2733c6bd98427dc611da7eff0a9', null, null),
  ('pyrokinesis', 'Сигаретка без кнопки', 'pyrokinesis', 10146617, 'https://i.scdn.co/image/ab67616d0000b2733c6bd98427dc611da7eff0a9', null, null),
  ('pyrokinesis', 'Зависимость', 'pyrokinesis', 8106676, 'https://i.scdn.co/image/ab67616d0000b273828b000a23d11c3015e8dbe3', null, null),
  ('pyrokinesis', 'Да что романтичного в птичках?', 'pyrokinesis', 7765787, 'https://i.scdn.co/image/ab67616d0000b273828b000a23d11c3015e8dbe3', null, null),
  ('pyrokinesis', 'Чёрное солнышко', 'pyrokinesis', 3738158, null, null, null),
  ('pyrokinesis', 'ОКО', 'pyrokinesis', 2257021, null, null, null),
  ('pyrokinesis', 'отказываю небу', 'pyrokinesis', 1911797, null, null, null),
  ('pyrokinesis', 'я краснею при тебе как...', 'pyrokinesis', 808691, 'https://i.scdn.co/image/ab67616d0000b2735c98f44f9160f43b46c1c676', null, null),
  ('pyrokinesis', 'брошен', 'pyrokinesis', 234489, 'https://i.scdn.co/image/ab67616d0000b273701df87aa1660b31e3e94fa8', null, null),
  ('kis-kis', 'молчи', 'кис-кис', 19939080, 'https://i.scdn.co/image/ab67616d0000b2734f3f5d5f45efd63d003ffbc2', null, null),
  ('kis-kis', 'мальчик', 'кис-кис', 11526829, 'https://i.scdn.co/image/ab67616d0000b2734f3f5d5f45efd63d003ffbc2', null, null),
  ('kis-kis', 'лбтд', 'кис-кис', 9912439, 'https://i.scdn.co/image/ab67616d0000b273a85a94ada4d2fea23e1b84e4', null, null),
  ('kis-kis', 'мелочь', 'кис-кис', 6480965, 'https://i.scdn.co/image/ab67616d0000b2735210406ca151afa4af807a95', null, null),
  ('kis-kis', 'подруга', 'кис-кис', 4818479, 'https://i.scdn.co/image/ab67616d0000b2739deb595b0df56197d87e0f70', null, null),
  ('kis-kis', 'трахаюсь', 'кис-кис', 3562310, 'https://i.scdn.co/image/ab67616d0000b273ea2328cdb0fcc0119fba4c9d', null, null),
  ('kis-kis', 'не надо', 'кис-кис', 3347921, 'https://i.scdn.co/image/ab67616d0000b27363c3fe9084541441429af560', null, null),
  ('kis-kis', 'когда я умру', 'кис-кис', 701743, 'https://i.scdn.co/image/ab67616d0000b2738de1dacae6936aa73bb50826', null, null),
  ('kis-kis', 'ты уже не ребёнок', 'кис-кис', 637348, 'https://i.scdn.co/image/ab67616d0000b2738de1dacae6936aa73bb50826', null, null),
  ('kis-kis', 'лифт (acoustic)', 'кис-кис', 297656, 'https://i.scdn.co/image/ab67616d0000b27363d3d0d352ed28d55dc2bfeb', null, null),
  ('sqwoz-bab', 'АУФ', 'SQWOZ BAB, The First Station', 36607797, 'https://i.scdn.co/image/ab67616d0000b2732135cf3c617ad707790a6e27', null, null),
  ('sqwoz-bab', 'ПЁТР 1', 'SQWOZ BAB', 339855, 'https://i.scdn.co/image/ab67616d0000b273287026966bdc3f8e7bc0e8de', null, null),
  ('sqwoz-bab', 'TITTY MILK', 'SQWOZ BAB', 135965, 'https://i.scdn.co/image/ab67616d0000b27388b9f51fc59dcea31d11ad64', null, null),
  ('xmax', 'Просто люби', 'xMax', 1724521, 'https://i.scdn.co/image/ab67616d0000b273455e693b46e66ae9232f4373', null, null),
  ('xmax', 'Следующая станция', 'xMax, suramura', 1057614, 'https://i.scdn.co/image/ab67616d0000b273ae1a053a0365bf23bbf56aca', null, null),
  ('xmax', 'Просто люби (Sped up)', 'xMax', 956341, 'https://i.scdn.co/image/ab67616d0000b273bc3a9103fb9a64418a6d9646', null, null),
  ('xmax', 'Целый мир', 'xMax', 753198, 'https://i.scdn.co/image/ab67616d0000b2733f470a18e7966d5540f02880', null, null),
  ('xmax', 'Ошибаюсь', 'xMax', 279944, 'https://i.scdn.co/image/ab67616d0000b27319964bc51fbd5b1d36ec34b9', null, null),
  ('xmax', 'Держись', 'xMax', 169408, 'https://i.scdn.co/image/ab67616d0000b2733cc8d783fc0c7f7f06b35574', null, null),
  ('xmax', 'Не отдам', 'xMax', 148517, 'https://i.scdn.co/image/ab67616d0000b273e2d8a8aedae690faf1ba7771', null, null),
  ('xmax', 'Лето 22', 'xMax', 95713, 'https://i.scdn.co/image/ab67616d0000b273c2cdd8174a3e43dd2871fa72', null, null),
  ('xmax', 'Вместе', 'xMax', 73934, 'https://i.scdn.co/image/ab67616d0000b273833a91346d078f88941bee28', null, null);
insert into tracks (artist_slug, title, artists, streams, cover, preview, spotify, in_chart)
select n.*, false from _trk n
where exists (select 1 from artists a where a.slug = n.artist_slug)
  and not exists (select 1 from tracks e where e.artist_slug = n.artist_slug and not e.in_chart and regexp_replace(translate(lower(e.title), 'ё', 'е'), '[^[:alnum:]()]+', '', 'g') = regexp_replace(translate(lower(n.title), 'ё', 'е'), '[^[:alnum:]()]+', '', 'g'));

-- Чарт лейбла: только если его ещё нет
insert into tracks (artist_slug, title, artists, streams, cover, preview, spotify, in_chart)
select v.*, true from (values
  ('sqwoz-bab', 'АУФ', 'SQWOZ BAB, The First Station', 36607797, 'https://i.scdn.co/image/ab67616d0000b2732135cf3c617ad707790a6e27', null, null),
  (null, 'Лёд', 'WENARO, LXNER', 32342467, 'https://i.scdn.co/image/ab67616d0000b273761776ec62c9f8a6be00a244', null, null),
  ('gunwest', 'Никотин', 'Ганвест', 31552351, 'https://i.scdn.co/image/ab67616d0000b273cbd3cfe8896a92b75e60190f', null, null),
  ('dora', 'Дорадура', 'Дора', 28256972, 'https://i.scdn.co/image/ab67616d0000b2738d6cfb51c637bcde3009326b', 'https://p.scdn.co/mp3-preview/f6fb99e5759ffb1bdd9238fd4cf9e383e7676f74?cid=778671c82f044a72a2ca0db89b48f6e6', null),
  ('dora', 'Втюрилась', 'Дора', 26282019, 'https://i.scdn.co/image/ab67616d0000b273c9c6ffa3829ecebc9a0cd7d0', 'https://p.scdn.co/mp3-preview/3600939d7ca0c78e2d01fab0412f94f2674cd0ed?cid=778671c82f044a72a2ca0db89b48f6e6', null),
  ('quiizzzmeow', 'Aomine Daiki', 'quiizzzmeow', 23901389, 'https://i.scdn.co/image/ab67616d0000b2735858c3d5d5c9e5caac22563e', null, null),
  ('deti-rave', 'Турбо пушка', 'Дети Rave', 21711406, 'https://i.scdn.co/image/ab67616d0000b2733a2a28eadcf8cb132c4c3ec1', null, 'album/5yGC3jz5v0KUVlZYo6VoEI'),
  ('kis-kis', 'молчи', 'кис-кис', 19939080, 'https://i.scdn.co/image/ab67616d0000b2734f3f5d5f45efd63d003ffbc2', null, null),
  (null, 'adaptive strike', 'shadowraze, LXNER, quiizzzmeow', 18447406, 'https://i.scdn.co/image/ab67616d0000b273aafe4598bce4d31fca0a51b2', null, null),
  ('ivan-valeev', 'Novella', 'Ivan Valeev', 18446982, 'https://i.scdn.co/image/ab67616d0000b27367ced6ad46e68128380bdd49', null, null),
  ('deti-rave', 'Икры и Сала', 'Дети Rave', 16466627, 'https://i.scdn.co/image/ab67616d0000b27396918f74070cc6337e9e8304', null, null),
  ('dora', 'Барбисайз', 'Дора, Мэйби Бэйби', 15585776, 'https://i.scdn.co/image/ab67616d0000b27353d8140de43903c9248ceb6d', 'https://p.scdn.co/mp3-preview/91e797c50169b3e627e14f108a6715087a41672c?cid=778671c82f044a72a2ca0db89b48f6e6', null),
  (null, 'Сан Ларан', 'Платина, Дора', 15560153, 'https://i.scdn.co/image/ab67616d0000b273ae085ccbb23ac58787e6967b', 'https://p.scdn.co/mp3-preview/4438b596b7511e2cc1801b7b0d69b489a7151687?cid=778671c82f044a72a2ca0db89b48f6e6', null),
  (null, 'Ананасовый сироп', 'Natan, Ганвест', 14840097, 'https://i.scdn.co/image/ab67616d0000b27302cad37bb1e3e2ae68fae02a', null, null),
  ('gunwest', 'Кайфули', 'Ганвест', 14255981, 'https://i.scdn.co/image/ab67616d0000b27302cad37bb1e3e2ae68fae02a', null, null),
  ('sqwoz-bab', 'ОЙ', 'SQWOZ BAB', 13154746, 'https://i.scdn.co/image/ab67616d0000b27374bb88b30dda820a91ede446', null, null),
  ('dora', 'Младшая сестра', 'Дора', 13136190, 'https://i.scdn.co/image/ab67616d0000b2738d6cfb51c637bcde3009326b', 'https://p.scdn.co/mp3-preview/f08315fbe968d910cd99850d758a3802362f73?cid=778671c82f044a72a2ca0db89b48f6e6', null),
  ('aleks-ataman', 'Диалоги тет-а-тет', 'Aleks Ataman, FINIK', 11682031, 'https://i.scdn.co/image/ab67616d0000b273b778d5b71e0636644b378b44', null, null),
  ('kis-kis', 'мальчик', 'кис-кис', 11526829, 'https://i.scdn.co/image/ab67616d0000b2734f3f5d5f45efd63d003ffbc2', null, null),
  ('polmateri', 'ярче звёзд', 'Полматери', 11323636, 'https://i.scdn.co/image/ab67616d0000b2732f093ad573ee3d6ea2b6ff69', null, null),
  ('quiizzzmeow', 'сети', 'quiizzzmeow', 10880298, 'https://i.scdn.co/image/ab67616d0000b273c0009ad7c2bb2707dc369765', null, null),
  ('bodiev', 'Крузак 200', 'BODIEV', 9726980, 'https://i.scdn.co/image/ab67616d0000b2739f8414317ee1ffa081c58207', null, null),
  ('deti-rave', 'LOVE ON RAVE', 'Дети Rave', 8146082, 'https://i.scdn.co/image/ab67616d0000b273c8337cc228d811158898313f', null, null)
) as v(artist_slug, title, artists, streams, cover, preview, spotify)
where not exists (select 1 from tracks where in_chart);

insert into videos (artist_slug, youtube_id, title, sort)
select v.* from (values
  ('dora', '54lMZDH5kHQ', 'Я боюсь людей', 0),
  ('dora', '8Zn89VJ01jQ', 'Loverboy', 1),
  ('dora', 'aCtUc6t1w_A', 'Барбисайз', 2),
  ('dora', 'FAAM7wdtXmg', 'Втюрилась', 3),
  ('dora', 'WNadEfGnV04', 'Дорадура', 4),
  ('dora', 'zVZr6h_2q1o', 'Осень пьяная', 5),
  ('dora', 'G49ti_aljdk', 'Не игра', 6),
  ('mukka', '3CRijLQ0acY', 'Live Acoustic — Санкт-Петербург, 26.07.2023', 0),
  ('gunwest', 'kNpXyWQEm6g', 'Никотин', 0),
  ('gunwest', 'Wwn2nXQ6Y4k', 'Кайфули', 1),
  ('gunwest', 'DznmAEEXL-M', 'Ночная река', 2),
  ('gunwest', 'qy9ClrkgGT4', 'Королева бара', 3),
  ('gunwest', 'FRvO7zi0SZc', 'Бардак', 4),
  ('gunwest', '8tiO4Fyn88Y', 'Ты такая GLE', 5),
  ('gunwest', 'M8XxytSYBfM', 'Дурман', 6),
  ('gunwest', 'Yf0oMj7sq6g', 'Биркин', 7),
  ('ivan-valeev', '-62_AMtHWco', 'Novella', 0),
  ('ivan-valeev', 'Dox7i-8X11k', 'Февраль', 1),
  ('ivan-valeev', 'r7p2kWh65RA', 'Зачем ты мне врёшь', 2),
  ('4etvergov', 'wwobJDYgrB4', 'Красивая пара', 0)
) as v(artist_slug, youtube_id, title, sort)
where exists (select 1 from artists a where a.slug = v.artist_slug)
  and not exists (select 1 from videos e where e.artist_slug = v.artist_slug and e.youtube_id = v.youtube_id);

insert into events (artist_slug, date, title, text, image)
select v.* from (values
  ('dora', '2022-06-03'::date, 'MISS на первом месте', 'Меньше чем за сутки альбом возглавил топ Apple Music среди русскоязычных альбомов, набрал больше миллиона прослушиваний в VK и завёл в чарт VK Музыки восемь треков.', 'https://rhymesmusic.ru/photos/1/%D1%80%D0%B5%D0%BB%D0%B8%D0%B7%D1%8B/-%D0%B4%D0%BE%D1%80%D0%B0-%D0%BC%D0%B8%D1%81%D1%81-%D1%8D%D0%BF%D0%BE%D0%BB.jpg'),
  ('dora', '2022-05-24'::date, '«Я боюсь людей» в чартах', 'Новый трек попал на обложку плейлиста «Уже в чарте» на Яндекс Музыке.', 'https://rhymesmusic.ru/photos/1/%D1%80%D0%B5%D0%BB%D0%B8%D0%B7%D1%8B/-%D0%B4%D0%BE%D1%80%D0%B0-%D1%8F%D0%BD%D0%B4%D0%B5%D0%BA%D1%8101.jpg'),
  ('dora', '2022-02-18'::date, 'Лицо Spotify EQUAL', 'Дора стала лицом кампании Spotify EQUAL в Нью-Йорке, которая поддерживает женщин в музыкальной индустрии.', 'https://rhymesmusic.ru/photos/1/%D1%80%D0%B5%D0%BB%D0%B8%D0%B7%D1%8B/-%D0%B4%D0%BE%D1%80%D0%B0-%D0%BD%D0%B8%D0%BA.jpg'),
  ('dora', '2021-11-08'::date, '«Младшей сестре» два года', 'Официальный плейлист альбома в VK приближается к семи миллионам прослушиваний, а пластинка не раз входила в списки лучших альбомов года.', 'https://rhymesmusic.ru/photos/1/%D1%80%D0%B5%D0%BB%D0%B8%D0%B7%D1%8B/-8-11-21-%D0%B4%D0%BE%D1%80%D0%B0.jpg'),
  ('dora', '2021-11-02'::date, 'Анонс нового альбома', 'Дора рассказала, что новый альбом будет жанрово разным: она больше не хочет держаться рамок одного звучания.', 'https://rhymesmusic.ru/photos/1/%D1%80%D0%B5%D0%BB%D0%B8%D0%B7%D1%8B/-2-11-21-%D0%B4%D0%BE%D1%80%D0%B0.jpeg'),
  ('maybe-baby', '2022-04-07'::date, 'Мэйби Бэйби записывает первый сольный альбом', 'Пластинка получила название «МЭЙБИЛЭНД».', 'https://rhymesmusic.ru/photos/1/%D1%80%D0%B5%D0%BB%D0%B8%D0%B7%D1%8B/-%D0%BC%D1%8D%D0%B9%D0%B1%D0%B8-%D0%B0%D0%BB%D1%8C%D0%B1%D0%BE%D0%BC.jpg'),
  ('by-indiya', '2022-04-28'::date, '«Целуйся правильно»', 'By Индия анонсировала лиричный сингл, который вышел 12 мая.', 'https://rhymesmusic.ru/photos/1/%D1%80%D0%B5%D0%BB%D0%B8%D0%B7%D1%8B/-%D0%B8%D0%BD%D0%B4%D0%B8%D1%8F-%D1%86%D0%B5%D0%BB%D1%83%D0%B9%D1%81%D1%8F.jpg'),
  ('finik', '2022-03-29'::date, 'ТОП-100 YouTube', 'Клипы ALEKS ATAMAN, FINIK и Ганвеста попали в сотню лучших клипов России на YouTube.', 'https://rhymesmusic.ru/photos/1/%D1%80%D0%B5%D0%BB%D0%B8%D0%B7%D1%8B/-%D1%82%D0%BE%D0%BF-%D1%8E%D1%82%D1%83%D0%B1.jpg'),
  ('gunwest', '2022-03-29'::date, 'ТОП-100 YouTube', 'Клипы ALEKS ATAMAN, FINIK и Ганвеста попали в сотню лучших клипов России на YouTube.', 'https://rhymesmusic.ru/photos/1/%D1%80%D0%B5%D0%BB%D0%B8%D0%B7%D1%8B/-%D1%82%D0%BE%D0%BF-%D1%8E%D1%82%D1%83%D0%B1.jpg'),
  ('bodiev', '2022-06-01'::date, 'Премьера сингла «Между девятин»', 'Отрывок трека ещё до релиза попал в чарт самых шазамируемых песен России.', 'https://rhymesmusic.ru/photos/1/%D1%80%D0%B5%D0%BB%D0%B8%D0%B7%D1%8B/-%D0%B1%D0%BE%D0%B4%D0%B8%D0%B5%D0%B2-%D1%8D%D0%BF%D0%BE%D0%BB.jpg'),
  ('aleks-ataman', '2022-03-29'::date, 'ТОП-100 YouTube', 'Клипы ALEKS ATAMAN, FINIK и Ганвеста попали в сотню лучших клипов России на YouTube.', 'https://rhymesmusic.ru/photos/1/%D1%80%D0%B5%D0%BB%D0%B8%D0%B7%D1%8B/-%D1%82%D0%BE%D0%BF-%D1%8E%D1%82%D1%83%D0%B1.jpg')
) as v(artist_slug, date, title, text, image)
where exists (select 1 from artists a where a.slug = v.artist_slug)
  and not exists (select 1 from events e where e.artist_slug = v.artist_slug and e.date = v.date and regexp_replace(translate(lower(e.title), 'ё', 'е'), '[^[:alnum:]()]+', '', 'g') = regexp_replace(translate(lower(v.title), 'ё', 'е'), '[^[:alnum:]()]+', '', 'g'));

insert into concerts (artist_slug, date, city, venue, ticket_url)
select v.* from (values
  ('aikko', '2026-10-24'::date, 'Санкт-Петербург', 'Factory 3', 'https://afisha.yandex.ru/saint-petersburg/concert/aikko-2026-10'),
  ('aikko', '2026-11-01'::date, 'Москва', 'Свобода', 'https://afisha.yandex.ru/moscow/concert/aikko-2026-11'),
  ('pyrokinesis', '2026-11-03'::date, 'Москва', 'ЦСКА Арена', 'https://afisha.yandex.ru/search?text=Pyrokinesis%20%D0%9C%D0%BE%D1%81%D0%BA%D0%B2%D0%B0'),
  ('dora', '2026-11-13'::date, 'Москва', 'Duplex', 'https://afisha.yandex.ru/search?text=%D0%94%D0%BE%D1%80%D0%B0%20%D0%9C%D0%BE%D1%81%D0%BA%D0%B2%D0%B0'),
  ('dora', '2026-11-15'::date, 'Саратов', 'Onyx', 'https://afisha.yandex.ru/search?text=%D0%94%D0%BE%D1%80%D0%B0%20%D0%A1%D0%B0%D1%80%D0%B0%D1%82%D0%BE%D0%B2'),
  ('pyrokinesis', '2026-11-22'::date, 'Санкт-Петербург', 'Юбилейный', 'https://afisha.yandex.ru/search?text=Pyrokinesis%20%D0%A1%D0%B0%D0%BD%D0%BA%D1%82-%D0%9F%D0%B5%D1%82%D0%B5%D1%80%D0%B1%D1%83%D1%80%D0%B3'),
  ('dora', '2026-11-26'::date, 'Тюмень', 'Глав клуб', 'https://afisha.yandex.ru/search?text=%D0%94%D0%BE%D1%80%D0%B0%20%D0%A2%D1%8E%D0%BC%D0%B5%D0%BD%D1%8C'),
  ('dora', '2026-11-27'::date, 'Челябинск', 'Максимилианс', 'https://afisha.yandex.ru/search?text=%D0%94%D0%BE%D1%80%D0%B0%20%D0%A7%D0%B5%D0%BB%D1%8F%D0%B1%D0%B8%D0%BD%D1%81%D0%BA'),
  ('dora', '2026-12-01'::date, 'Уфа', 'Огни Уфы', 'https://afisha.yandex.ru/search?text=%D0%94%D0%BE%D1%80%D0%B0%20%D0%A3%D1%84%D0%B0'),
  ('dora', '2026-12-04'::date, 'Нижний Новгород', 'Milo Concert Hall', 'https://afisha.yandex.ru/search?text=%D0%94%D0%BE%D1%80%D0%B0%20%D0%9D%D0%B8%D0%B6%D0%BD%D0%B8%D0%B9%20%D0%9D%D0%BE%D0%B2%D0%B3%D0%BE%D1%80%D0%BE%D0%B4'),
  ('dora', '2026-12-05'::date, 'Тула', 'Mini by Concert Hall', 'https://afisha.yandex.ru/search?text=%D0%94%D0%BE%D1%80%D0%B0%20%D0%A2%D1%83%D0%BB%D0%B0'),
  ('dora', '2026-12-06'::date, 'Рязань', 'Руки Вверх! Бар', 'https://afisha.yandex.ru/search?text=%D0%94%D0%BE%D1%80%D0%B0%20%D0%A0%D1%8F%D0%B7%D0%B0%D0%BD%D1%8C'),
  ('dora', '2026-12-17'::date, 'Киров', 'Gaudi', 'https://afisha.yandex.ru/search?text=%D0%94%D0%BE%D1%80%D0%B0%20%D0%9A%D0%B8%D1%80%D0%BE%D0%B2'),
  ('dora', '2026-12-19'::date, 'Ижевск', 'Nobel Concert Hall', 'https://afisha.yandex.ru/search?text=%D0%94%D0%BE%D1%80%D0%B0%20%D0%98%D0%B6%D0%B5%D0%B2%D1%81%D0%BA'),
  ('dora', '2026-12-20'::date, 'Пермь', 'Свобода', 'https://afisha.yandex.ru/search?text=%D0%94%D0%BE%D1%80%D0%B0%20%D0%9F%D0%B5%D1%80%D0%BC%D1%8C')
) as v(artist_slug, date, city, venue, ticket_url)
where exists (select 1 from artists a where a.slug = v.artist_slug)
  and not exists (select 1 from concerts e where e.artist_slug = v.artist_slug and e.date = v.date and translate(lower(regexp_replace(trim(e.city), '^(г|город)\.?\s+', '', 'i')), 'ё', 'е') = translate(lower(regexp_replace(trim(v.city), '^(г|город)\.?\s+', '', 'i')), 'ё', 'е'));

-- Мерч — примеры: неопубликованные, существующие (артист + название) не трогаем
insert into merch (artist_slug, title, type, price, sort, published)
select v.artist_slug, v.title, v.type, v.price, v.sort, false from (values
  ('dora', 'Худи «Кьют-рок»', 'Худи', 6900, 0),
  ('dora', 'Футболка MISS', 'Футболка', 3500, 1),
  ('deti-rave', 'Футболка «Качает»', 'Футболка', 3500, 2),
  ('deti-rave', 'Кепка THERAPIA', 'Аксессуар', 2900, 3),
  (null, 'Лонгслив Rhymes Music', 'Лонгслив', 4500, 4),
  (null, 'Шопер Rhymes Music', 'Аксессуар', 1900, 5),
  ('kis-kis', 'Футболка кис-кис', 'Футболка', 3500, 6),
  ('polmateri', 'Худи Полматери', 'Худи', 6900, 7)
) as v(artist_slug, title, type, price, sort)
where (v.artist_slug is null or exists (select 1 from artists a where a.slug = v.artist_slug))
  and not exists (select 1 from merch e where e.artist_slug is not distinct from v.artist_slug and regexp_replace(translate(lower(e.title), 'ё', 'е'), '[^[:alnum:]()]+', '', 'g') = regexp_replace(translate(lower(v.title), 'ё', 'е'), '[^[:alnum:]()]+', '', 'g'));

-- Соцсети лейбла: начальный список, дальше правятся в админке → «Лейбл»
insert into settings (key, value) values ('label_socials', '[{"name":"YouTube","url":"https://www.youtube.com/channel/UCFhgVi8XKK8yZ1kEJa4vrhw"},{"name":"SoundCloud","url":"https://soundcloud.com/rhymes_music"},{"name":"VK","url":"https://vk.com/rhymesmusic"}]'::jsonb)
on conflict (key) do nothing;

-- Документы: создаются, если их нет; отредактированные в админке не перезаписываются
insert into pages (slug, title, body, sort, kind, file_url) values
  ('privacy', 'Политика конфиденциальности', '### Какие данные мы получаем
Данные, которые вы указываете в формах сайта: имя, название компании, почту или телефон, город и детали события в заявке на выступление; имя, ссылки и контакт в заявке с демо.

### Зачем
Только чтобы ответить на заявку: связаться с вами, подготовить предложение по выступлению или рассмотреть демо. Мы не продаём и не передаём данные третьим лицам для рекламы.

### Хранение и удаление
Данные хранятся у сервиса, на котором работает сайт, столько, сколько нужно для ответа и сопровождения сделки. Чтобы удалить свои данные, напишите на [office@rhymesmusic.com](mailto:office@rhymesmusic.com).

### Хранилище браузера
Сайт сохраняет в вашем браузере только состав лайнапа, чтобы он не пропадал при переходах. Эти данные не отправляются на сервер, пока вы не отправите заявку.

### Сторонние сервисы
Плееры Spotify и YouTube загружаются только после нажатия на кнопку воспроизведения и подчиняются правилам этих сервисов.', 0, 'text', null),
  ('terms', 'Пользовательское соглашение', 'Музыка, клипы, фото и тексты на сайте принадлежат Rhymes Music и артистам лейбла. Их нельзя копировать и использовать в коммерческих целях без письменного согласия правообладателя.

Материалы пресс-кита предназначены для организаторов и СМИ и используются только для анонса выступлений и публикаций об артисте.

Отправляя заявку или демо, вы подтверждаете, что указали достоверные данные и имеете права на присланную музыку.', 1, 'text', null),
  ('perechen-rezultatov-sout', 'Перечень результатов СОУТ', '', 10, 'file', 'https://rhymesmusic.ru/files/1/doc1.pdf'),
  ('svodnaya-vedomost-sout', 'Сводная ведомость СОУТ', '', 11, 'file', 'https://rhymesmusic.ru/files/1/doc2.pdf'),
  ('sbd', 'СБД', '', 12, 'file', 'https://rhymesmusic.ru/files/1/doc3.pdf')
on conflict (slug) do nothing;

-- Вакансии и люди — примеры: заливаются неопубликованными и не перезаписываются
insert into jobs (slug, title, dept, place, employment, salary, summary, tasks, requirements, nice_to_have, offer, sort, published) values
  ('smm-manager', 'SMM-менеджер', 'Маркетинг', 'Москва, гибрид', 'Полная занятость', 'По итогам собеседования', 'Ведём соцсети лейбла и помогаем артистам запускать релизы так, чтобы о них говорили.', array['Вести аккаунты лейбла в VK, Telegram и TikTok: контент-план, публикации, отчёты', 'Готовить промо-кампании релизов вместе с артистами и продюсерами', 'Искать тренды и форматы, которые подходят конкретному артисту', 'Работать с подрядчиками: дизайнерами, монтажёрами, блогерами']::text[], array['Опыт SMM от 2 лет, желательно в музыке или медиа', 'Понимание алгоритмов VK Клипов, TikTok и Reels', 'Насмотренность и вкус', 'Умение считать результат, а не только охваты']::text[], array['Своё медиа или паблик с живой аудиторией', 'Опыт запуска релизов']::text[], array['Работа с артистами из верхних строчек чартов', 'Гибрид: офис в Москве и удалёнка', 'Бюджет на обучение и конференции', 'Проходки на концерты лейбла']::text[], 0, false),
  ('booking-manager', 'Букинг-менеджер', 'Букинг и туры', 'Москва', 'Полная занятость', 'Оклад + процент', 'Продаём выступления артистов лейбла: клубы, фестивали, частные события и бренды.', array['Обрабатывать входящие заявки и готовить предложения', 'Вести переговоры с организаторами и согласовывать райдеры', 'Собирать туры вместе с тур-менеджерами', 'Вести сделки в CRM и отчитываться по выручке']::text[], array['Опыт в букинге, ивентах или B2B-продажах от 1 года', 'Уверенные переговоры и деловая переписка', 'Внимательность к деталям договоров и райдеров', 'Готовность к нерегулярному графику в дни концертов']::text[], array['Своя база организаторов', 'Английский для зарубежных площадок']::text[], array['Прозрачный процент с каждой сделки', 'ДМС после испытательного срока', 'Поездки на фестивали', 'Команда, которая быстро принимает решения']::text[], 1, false),
  ('motion-designer', 'Моушн-дизайнер', 'Видеопродакшн', 'Удалённо', 'Полная или проектная', 'По портфолио', 'Делаем визуал релизов: тизеры, канвасы, анимированные обложки и рекламные ролики.', array['Создавать Spotify Canvas, анимированные обложки и тизеры релизов', 'Монтировать короткие вертикальные ролики под соцсети', 'Собирать визуальные пакеты релизов вместе с арт-директором', 'Адаптировать материалы под площадки и форматы']::text[], array['Уверенный After Effects и монтаж в Premiere или DaVinci', 'Портфолио с музыкальными или fashion-проектами', 'Умение работать быстро под дедлайн релиза', 'Анимация, которая попадает в ритм музыки']::text[], array['Cinema 4D или Blender', 'Опыт съёмок']::text[], array['Проекты для артистов с миллионной аудиторией', 'Удалённая работа из любого города', 'Софт за счёт компании', 'Свобода в визуальных решениях']::text[], 2, false),
  ('ar-scout', 'A&R-скаут', 'A&R', 'Удалённо', 'Частичная занятость', 'Фикс + бонус за подписание', 'Ищем новых артистов раньше всех: слушаем демо, мониторим площадки, приносим находки.', array['Слушать демо, которые приходят в лейбл, и давать по ним фидбек', 'Мониторить TikTok, VK Музыку и SoundCloud в поиске новых имён', 'Готовить короткие профили артистов для A&R-команды', 'Ходить на локальные концерты и шоукейсы']::text[], array['Слушаете много новой музыки и можете объяснить, почему трек цепляет', 'Знаете сцену фрешменов', 'Коротко и по делу формулируете мысли', 'Можете уделять работе 15–20 часов в неделю']::text[], array['Опыт в музыкальном медиа', 'Знакомства в региональных сценах']::text[], array['Бонус за каждого подписанного артиста', 'Гибкий график', 'Прямой контакт с A&R-командой', 'Рост до A&R-менеджера']::text[], 3, false)
on conflict (slug) do nothing;
insert into team_members (id, name, role, dept, sort, published) values
  ('a-sokolova', 'Анна Соколова', 'Руководитель A&R', 'A&R', 0, false),
  ('m-orlov', 'Максим Орлов', 'Head of Marketing', 'Маркетинг', 1, false),
  ('k-lebedeva', 'Кира Лебедева', 'Букинг-менеджер', 'Букинг и туры', 2, false),
  ('t-galiev', 'Тимур Галиев', 'Продюсер видео', 'Видеопродакшн', 3, false),
  ('p-voronina', 'Полина Воронина', 'SMM-лид', 'Маркетинг', 4, false),
  ('a-belov', 'Артём Белов', 'Тур-менеджер', 'Букинг и туры', 5, false),
  ('e-mironova', 'Ева Миронова', 'Менеджер партнёрств', 'Партнёрства', 6, false),
  ('g-zakharov', 'Глеб Захаров', 'Дизайнер мерча', 'Мерч', 7, false)
on conflict (id) do nothing;

commit;
