-- ============================================================================
-- Rhymes Music: схема базы Supabase.
--
-- Файл идемпотентный: его можно выполнять целиком сколько угодно раз —
-- и на пустой базе, и поверх любой предыдущей версии. Таблицы создаются
-- с итоговым набором колонок, на старых базах недостающие колонки добавляются,
-- ограничения и политики пересоздаются.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. Вспомогательные функции
-- ---------------------------------------------------------------------------

-- Админ — пользователь Supabase Auth с app_metadata.role = 'admin'. Выдать роль:
--   update auth.users set raw_app_meta_data = raw_app_meta_data || '{"role":"admin"}'
--   where email = 'name@rhymesmusic.com';
create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin';
$$;

-- Только абсолютные http(s)-ссылки: защищает от javascript:, data: и относительных путей
create or replace function public.is_http_url(u text)
returns boolean
language sql
immutable
as $$
  select u is null or u ~* '^https?://[^\s/?#]+\.[^\s]*$';
$$;

-- Соцсети: массив объектов { name, url } с http(s)-ссылками
create or replace function public.socials_valid(s jsonb)
returns boolean
language sql
immutable
as $$
  select jsonb_typeof(s) = 'array'
     and not exists (
       select 1 from jsonb_array_elements(s) e
       where jsonb_typeof(e) <> 'object' or not public.is_http_url(e ->> 'url') or coalesce(e ->> 'url', '') = ''
     );
$$;

-- Добавляет ограничение, только если его ещё нет. NOT VALID: старые строки
-- не блокируют миграцию, а новые и изменённые проверяются.
create or replace function public.ensure_constraint(tbl regclass, name text, definition text)
returns void
language plpgsql
as $$
begin
  if not exists (select 1 from pg_constraint where conrelid = tbl and conname = name) then
    execute format('alter table %s add constraint %I %s not valid', tbl, name, definition);
  end if;
end;
$$;

-- ---------------------------------------------------------------------------
-- 2. Каталог
-- ---------------------------------------------------------------------------

create table if not exists artists (
  slug text primary key,
  name text not null,
  tagline text,
  bio text,
  bio_source text,                                   -- ссылка на источник био (атрибуция Википедии)
  photo text,
  photo_position text not null default '50% 25%',    -- точка фокуса фото
  palette text[] not null default array['#f5e52a', '#ff2e88', '#5cc8ff'],
  socials jsonb not null default '[]',
  sort int not null default 0,
  hidden boolean not null default false,             -- черновик: не виден на сайте
  auto_sync boolean not null default true,
  spotify_id text unique,                            -- open.spotify.com/artist/<id>
  deezer_id text unique,                             -- deezer.com/artist/<id>: обложки, даты, популярность
  youtube_channel_id text,                           -- UC…
  wikipedia_title text,
  bandsintown_name text,
  tour_sources text[] not null default '{}',         -- страницы афиш артиста
  resolved jsonb not null default '{}',              -- что синхронизация нашла сама
  synced_at timestamptz,                             -- последняя синхронизация (очередь пачек)
  updated_at timestamptz not null default now()
);
alter table artists add column if not exists bio_source text;
alter table artists add column if not exists photo_position text not null default '50% 25%';
alter table artists add column if not exists hidden boolean not null default false;
alter table artists add column if not exists auto_sync boolean not null default true;
alter table artists add column if not exists spotify_id text unique;
alter table artists add column if not exists deezer_id text unique;
alter table artists add column if not exists youtube_channel_id text;
alter table artists add column if not exists wikipedia_title text;
alter table artists add column if not exists bandsintown_name text;
alter table artists add column if not exists tour_sources text[] not null default '{}';
alter table artists add column if not exists resolved jsonb not null default '{}';
alter table artists add column if not exists synced_at timestamptz;
alter table artists add column if not exists updated_at timestamptz not null default now();

select public.ensure_constraint('artists', 'artists_slug_format', $c$check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$')$c$);
select public.ensure_constraint('artists', 'artists_photo_position_format', $c$check (photo_position ~ '^\d{1,3}% \d{1,3}%$')$c$);
select public.ensure_constraint('artists', 'artists_urls', 'check (public.is_http_url(photo) and public.is_http_url(bio_source))');
select public.ensure_constraint('artists', 'artists_socials', 'check (public.socials_valid(socials))');
select public.ensure_constraint('artists', 'artists_text_lengths',
  'check (char_length(name) between 1 and 120 and char_length(coalesce(tagline, '''')) <= 200 and char_length(coalesce(bio, '''')) <= 5000)');

-- Виден ли артист на сайте. Используется в политиках связанных таблиц,
-- чтобы релизы, клипы и концерты черновиков не читались через REST.
create or replace function public.artist_visible(s text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.artists where slug = s and not hidden);
$$;

create table if not exists releases (
  id bigint generated always as identity primary key,
  artist_slug text not null references artists(slug) on delete cascade,
  title text not null,
  artists text not null,
  type text not null default 'Сингл',
  cover text,
  preview text,
  spotify text,                                       -- album/<id> или track/<id>
  released_on date,
  sort int not null default 0,
  source text not null default 'manual',
  external_id text,                                   -- spotify:<id>; уникален в пределах артиста
  hidden boolean not null default false
);
alter table releases add column if not exists source text not null default 'manual';
alter table releases add column if not exists external_id text;
alter table releases add column if not exists hidden boolean not null default false;

create table if not exists tracks (
  id bigint generated always as identity primary key,
  artist_slug text references artists(slug) on delete cascade,
  title text not null,
  artists text not null,
  streams bigint not null default 0,
  popularity int,                                     -- только при расширенной квоте Spotify
  cover text,
  preview text,
  spotify text,
  in_chart boolean not null default false,
  source text not null default 'manual',
  external_id text,
  hidden boolean not null default false
);
alter table tracks add column if not exists popularity int;
alter table tracks add column if not exists source text not null default 'manual';
alter table tracks add column if not exists external_id text;
alter table tracks add column if not exists hidden boolean not null default false;

create table if not exists videos (
  id bigint generated always as identity primary key,
  artist_slug text not null references artists(slug) on delete cascade,
  youtube_id text not null,
  title text not null,
  sort int not null default 0,
  source text not null default 'manual',
  external_id text,
  published_at timestamptz,
  hidden boolean not null default false
);
alter table videos add column if not exists source text not null default 'manual';
alter table videos add column if not exists external_id text;
alter table videos add column if not exists published_at timestamptz;
alter table videos add column if not exists hidden boolean not null default false;

create table if not exists events (
  id bigint generated always as identity primary key,
  artist_slug text not null references artists(slug) on delete cascade,
  date date not null,
  title text not null,
  text text,
  image text
);

create table if not exists concerts (
  id bigint generated always as identity primary key,
  artist_slug text not null references artists(slug) on delete cascade,
  date date not null,
  city text not null,
  venue text,
  ticket_url text,
  source text not null default 'manual',
  external_id text,
  status text not null default 'published',
  updated_at timestamptz not null default now()
);
alter table concerts add column if not exists source text not null default 'manual';
alter table concerts add column if not exists external_id text;
alter table concerts add column if not exists status text not null default 'published';
alter table concerts add column if not exists updated_at timestamptz not null default now();

select public.ensure_constraint('concerts', 'concerts_status', $c$check (status in ('published', 'pending', 'hidden'))$c$);
select public.ensure_constraint('concerts', 'concerts_ticket_url', 'check (public.is_http_url(ticket_url))');
-- Ссылки, сохранённые до появления проверки (javascript:, относительные), обнуляем
update concerts set ticket_url = null where not public.is_http_url(ticket_url);
select public.ensure_constraint('releases', 'releases_cover_url', 'check (public.is_http_url(cover) and public.is_http_url(preview))');
select public.ensure_constraint('tracks', 'tracks_cover_url', 'check (public.is_http_url(cover) and public.is_http_url(preview))');
select public.ensure_constraint('events', 'events_image_url', 'check (public.is_http_url(image))');

-- Треки удаляются вместе с артистом: раньше было on delete set null, и треки-сироты
-- с уникальным external_id не давали синхронизировать пересозданного артиста
do $$
declare fk text;
begin
  select conname into fk from pg_constraint
  where conrelid = 'tracks'::regclass and contype = 'f' and confdeltype <> 'c'
    and conkey = array[(select attnum from pg_attribute where attrelid = 'tracks'::regclass and attname = 'artist_slug')];
  if fk is not null then
    execute format('alter table tracks drop constraint %I', fk);
    alter table tracks add constraint tracks_artist_slug_fkey foreign key (artist_slug) references artists(slug) on delete cascade;
  end if;
end $$;
delete from tracks where artist_slug is null and not in_chart; -- сироты прошлых удалений

-- Внешний id уникален в пределах артиста, а не всей таблицы: общий релиз или клип
-- двух артистов лейбла — это две строки, по одной на каждого
alter table releases drop constraint if exists releases_external_id_key;
alter table tracks drop constraint if exists tracks_external_id_key;
alter table videos drop constraint if exists videos_external_id_key;
alter table concerts drop constraint if exists concerts_external_id_key;
create unique index if not exists releases_artist_external_uq on releases (artist_slug, external_id);
create unique index if not exists tracks_artist_external_uq on tracks (artist_slug, external_id);
create unique index if not exists videos_artist_external_uq on videos (artist_slug, external_id);
create unique index if not exists concerts_artist_external_uq on concerts (artist_slug, external_id);

create index if not exists releases_artist_date_idx on releases (artist_slug, released_on desc);
create index if not exists concerts_upcoming_idx on concerts (date) where status = 'published';
create index if not exists artists_sync_queue_idx on artists (synced_at nulls first) where auto_sync;

-- ---------------------------------------------------------------------------
-- 3. Вакансии и команда
-- ---------------------------------------------------------------------------

create table if not exists jobs (
  slug text primary key check (slug ~ '^[a-z0-9-]+$'),
  title text not null,
  dept text not null,
  place text not null,
  employment text not null,
  salary text not null default 'По итогам собеседования',
  summary text not null,
  tasks text[] not null default '{}',
  requirements text[] not null default '{}',
  nice_to_have text[] not null default '{}',
  offer text[] not null default '{}',
  sort int not null default 0,
  published boolean not null default false
);

create table if not exists team_members (
  id text primary key,
  name text not null,
  role text not null,
  dept text not null,
  photo_url text,
  sort int not null default 0,
  published boolean not null default false
);
select public.ensure_constraint('team_members', 'team_members_photo_url', 'check (public.is_http_url(photo_url))');

-- ---------------------------------------------------------------------------
-- 4. Заявки: букинг и демо. Длина всех полей ограничена, частота — по IP.
-- ---------------------------------------------------------------------------

create table if not exists booking_requests (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  artists text,
  format text,
  city text not null,
  date text,
  capacity text,
  contact_name text not null,
  contact text not null,
  comment text,
  website text,                                       -- honeypot: люди его не видят и не заполняют
  status text not null default 'new'
);
alter table booking_requests add column if not exists website text;

create table if not exists demo_submissions (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  artist_name text not null,
  city text,
  track_url text not null,
  socials text,
  about text,
  contact text not null,
  website text,
  status text not null default 'new'
);
alter table demo_submissions add column if not exists website text;

select public.ensure_constraint('booking_requests', 'booking_lengths', $c$check (
  char_length(coalesce(artists, '')) <= 1000 and char_length(coalesce(format, '')) <= 60
  and char_length(city) between 1 and 120 and char_length(coalesce(date, '')) <= 40
  and char_length(coalesce(capacity, '')) <= 40 and char_length(contact_name) between 1 and 200
  and char_length(contact) between 3 and 200 and char_length(coalesce(comment, '')) <= 2000
  and coalesce(website, '') = ''
)$c$);
select public.ensure_constraint('demo_submissions', 'demo_lengths', $c$check (
  char_length(artist_name) between 1 and 120 and char_length(coalesce(city, '')) <= 120
  and char_length(track_url) between 8 and 500 and public.is_http_url(track_url)
  and char_length(coalesce(socials, '')) <= 500 and char_length(coalesce(about, '')) <= 2000
  and char_length(contact) between 3 and 200 and coalesce(website, '') = ''
)$c$);

-- Частота заявок: не больше 5 за 10 минут с одного IP (IP хранится только как хеш)
create table if not exists request_log (
  id bigint generated always as identity primary key,
  kind text not null,
  ip_hash text not null,
  created_at timestamptz not null default now()
);
create index if not exists request_log_lookup_idx on request_log (kind, ip_hash, created_at desc);

create or replace function public.client_ip_hash()
returns text
language sql
stable
as $$
  select md5(coalesce(
    split_part(nullif(current_setting('request.headers', true), '')::json ->> 'x-forwarded-for', ',', 1),
    'unknown'
  ) || current_database());
$$;

create or replace function public.enforce_rate_limit()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  ip text := public.client_ip_hash();
  recent int;
begin
  if public.is_admin() then return new; end if;
  delete from request_log where created_at < now() - interval '1 day';
  select count(*) into recent from request_log
  where kind = tg_table_name and ip_hash = ip and created_at > now() - interval '10 minutes';
  if recent >= 5 then
    raise exception 'rate_limited' using errcode = 'P0001', hint = 'Слишком много заявок подряд. Попробуйте через 10 минут.';
  end if;
  insert into request_log (kind, ip_hash) values (tg_table_name, ip);
  return new;
end;
$$;

drop trigger if exists booking_rate_limit on booking_requests;
create trigger booking_rate_limit before insert on booking_requests for each row execute function public.enforce_rate_limit();
drop trigger if exists demo_rate_limit on demo_submissions;
create trigger demo_rate_limit before insert on demo_submissions for each row execute function public.enforce_rate_limit();

-- ---------------------------------------------------------------------------
-- 5. Пресс-кит и служебные таблицы
-- ---------------------------------------------------------------------------

-- Пресс-кит: список файлов в приватном бакете backstage/<slug>/...
create table if not exists backstage_files (
  id bigint generated always as identity primary key,
  artist_slug text not null references artists(slug) on delete cascade,
  path text not null,
  name text not null,
  kind text not null default 'rider',  -- rider | photo | bio
  meta text
);

-- Неудачные попытки пароля пресс-кита: функция backstage блокирует перебор по IP
create table if not exists backstage_attempts (
  id bigint generated always as identity primary key,
  ip_hash text not null,
  created_at timestamptz not null default now()
);
create index if not exists backstage_attempts_idx on backstage_attempts (ip_hash, created_at desc);

-- Журнал запусков синхронизации
create table if not exists sync_runs (
  id bigint generated always as identity primary key,
  started_at timestamptz not null,
  finished_at timestamptz not null,
  summary jsonb not null,
  reports jsonb not null
);

-- ---------------------------------------------------------------------------
-- 5б. Мерч
-- ---------------------------------------------------------------------------

create table if not exists merch (
  id bigint generated always as identity primary key,
  artist_slug text references artists(slug) on delete set null, -- null — вещь самого лейбла
  title text not null,
  type text not null default 'Футболка',
  price int,                                            -- в рублях; null — цена не указана
  image text,                                           -- фото товара, квадрат
  buy_url text,                                         -- ссылка на покупку
  status text not null default 'soon',                  -- soon | available | sold_out
  sort int not null default 0,
  published boolean not null default false,
  created_at timestamptz not null default now()
);
select public.ensure_constraint('merch', 'merch_status', $c$check (status in ('soon', 'available', 'sold_out'))$c$);
select public.ensure_constraint('merch', 'merch_urls', 'check (public.is_http_url(image) and public.is_http_url(buy_url))');
select public.ensure_constraint('merch', 'merch_fields',
  'check (char_length(title) between 1 and 160 and char_length(type) between 1 and 60 and (price is null or price between 0 and 10000000))');

-- ---------------------------------------------------------------------------
-- 5в. Страницы с текстами из админки (политика, соглашение и т. п.)
-- ---------------------------------------------------------------------------

create table if not exists pages (
  slug text primary key,                    -- privacy, terms, …
  title text not null,
  body text not null default '',            -- Markdown: ## заголовки, абзацы, списки, **жирный**, [ссылки](https://…)
  sort int not null default 0,
  published boolean not null default true,
  updated_at timestamptz not null default now()
);
select public.ensure_constraint('pages', 'pages_slug_format', $c$check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$')$c$);
select public.ensure_constraint('pages', 'pages_lengths', 'check (char_length(title) between 1 and 200 and char_length(body) <= 100000)');

-- Документ — либо текст на странице /legal (kind = text), либо файл, например PDF (kind = file)
alter table pages add column if not exists kind text not null default 'text';
alter table pages add column if not exists file_url text;
alter table pages add column if not exists show_in_footer boolean not null default true;
select public.ensure_constraint('pages', 'pages_kind', $c$check (kind in ('text', 'file'))$c$);
select public.ensure_constraint('pages', 'pages_file_url', 'check (public.is_http_url(file_url))');
select public.ensure_constraint('pages', 'pages_content', $c$check ((kind = 'text' and char_length(body) > 0) or (kind = 'file' and file_url is not null))$c$);

-- Заявки: статус обработки и заметка менеджера
alter table booking_requests add column if not exists admin_note text;
alter table demo_submissions add column if not exists admin_note text;
select public.ensure_constraint('booking_requests', 'booking_status', $c$check (status in ('new', 'in_progress', 'done', 'archived'))$c$);
select public.ensure_constraint('demo_submissions', 'demo_status', $c$check (status in ('new', 'in_progress', 'done', 'archived'))$c$);

-- ---------------------------------------------------------------------------
-- 5г. Пароли пресс-кита: общий (scope = 'global') и свой у отдельного артиста (scope = slug).
--     Хранится только bcrypt-хеш; задаёт админ через set_backstage_password(),
--     проверяет Edge Function backstage через check_backstage_password().
-- ---------------------------------------------------------------------------
create schema if not exists extensions;
create extension if not exists pgcrypto with schema extensions;

create table if not exists backstage_access (
  scope text primary key,                 -- 'global' или slug артиста
  password_hash text not null,
  updated_at timestamptz not null default now()
);

create or replace function public.set_backstage_password(p_scope text, p_password text)
returns void
language plpgsql
security definer
set search_path = public, extensions
as $$
begin
  if not public.is_admin() then raise exception 'forbidden' using errcode = '42501'; end if;
  if p_scope <> 'global' and not exists (select 1 from artists where slug = p_scope) then
    raise exception 'unknown artist %', p_scope using errcode = '22023';
  end if;
  if p_password is null or p_password = '' then
    delete from backstage_access where scope = p_scope;   -- артист вернётся к общему паролю
    return;
  end if;
  if char_length(p_password) < 6 or char_length(p_password) > 200 then
    raise exception 'password length' using errcode = '22023', hint = 'Пароль — от 6 до 200 символов';
  end if;
  insert into backstage_access (scope, password_hash) values (p_scope, extensions.crypt(p_password, extensions.gen_salt('bf', 10)))
  on conflict (scope) do update set password_hash = excluded.password_hash, updated_at = now();
end;
$$;

-- true/false — пароль верный или нет; null — пароли ещё не заданы вовсе
create or replace function public.check_backstage_password(p_slug text, p_password text)
returns boolean
language plpgsql
stable
security definer
set search_path = public, extensions
as $$
declare
  hash text;
begin
  select password_hash into hash from backstage_access where scope = p_slug;
  if hash is null then select password_hash into hash from backstage_access where scope = 'global'; end if;
  if hash is null then return null; end if;
  return extensions.crypt(coalesce(p_password, ''), hash) = hash;
end;
$$;

-- Какие пароли заданы (без хешей) — для админки
create or replace function public.backstage_password_scopes()
returns table (scope text, updated_at timestamptz)
language sql
stable
security definer
set search_path = public
as $$
  select scope, updated_at from backstage_access where public.is_admin();
$$;

revoke all on function public.set_backstage_password(text, text) from public, anon;
grant execute on function public.set_backstage_password(text, text) to authenticated;
revoke all on function public.backstage_password_scopes() from public, anon;
grant execute on function public.backstage_password_scopes() to authenticated;
revoke all on function public.check_backstage_password(text, text) from public, anon, authenticated;
do $$ begin
  grant execute on function public.check_backstage_password(text, text) to service_role;
exception when undefined_object then null;
end $$;

-- Файлы пресс-кита: размер и тип для подписи на сайте
alter table backstage_files add column if not exists size_bytes bigint;
alter table backstage_files add column if not exists sort int not null default 0;
alter table backstage_files add column if not exists created_at timestamptz not null default now();
select public.ensure_constraint('backstage_files', 'backstage_files_kind', $c$check (kind in ('rider', 'photo', 'bio', 'other'))$c$);

-- ---------------------------------------------------------------------------
-- 5д. Настройки лейбла (ключ → значение): соцсети и другое, что правится в админке
-- ---------------------------------------------------------------------------
create table if not exists settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);
select public.ensure_constraint('settings', 'settings_label_socials', $c$check (key <> 'label_socials' or public.socials_valid(value))$c$);

-- Мерч: страница товара — описание, размеры, дополнительные фото
alter table merch add column if not exists description text;
alter table merch add column if not exists sizes text[] not null default '{}';
alter table merch add column if not exists gallery text[] not null default '{}';
select public.ensure_constraint('merch', 'merch_description', $c$check (char_length(coalesce(description, '')) <= 3000)$c$);

-- ---------------------------------------------------------------------------
-- 6. Права (RLS). Витрина читает только опубликованное у видимых артистов;
--    админ видит и меняет всё. Политики пересоздаются при каждом запуске.
-- ---------------------------------------------------------------------------

do $$
declare t text;
begin
  foreach t in array array['artists', 'releases', 'tracks', 'videos', 'events', 'concerts', 'jobs', 'team_members', 'merch', 'pages', 'settings',
                           'booking_requests', 'demo_submissions', 'backstage_files', 'backstage_attempts', 'backstage_access',
                           'request_log', 'sync_runs']
  loop
    execute format('alter table %I enable row level security', t);
    execute format('drop policy if exists "public read" on %I', t);
    execute format('drop policy if exists "public insert" on %I', t);
    execute format('drop policy if exists "admin all" on %I', t);
    execute format('create policy "admin all" on %I for all using (public.is_admin()) with check (public.is_admin())', t);
  end loop;
end $$;

create policy "public read" on artists for select using (not hidden);
create policy "public read" on releases for select using (not hidden and public.artist_visible(artist_slug));
create policy "public read" on tracks for select using (not hidden and (artist_slug is null or public.artist_visible(artist_slug)));
create policy "public read" on videos for select using (not hidden and public.artist_visible(artist_slug));
create policy "public read" on events for select using (public.artist_visible(artist_slug));
create policy "public read" on concerts for select using (status = 'published' and public.artist_visible(artist_slug));
create policy "public read" on jobs for select using (published);
create policy "public read" on team_members for select using (published);
create policy "public read" on pages for select using (published);
create policy "public read" on settings for select using (true);
create policy "public read" on merch for select using (published and (artist_slug is null or public.artist_visible(artist_slug)));
create policy "public insert" on booking_requests for insert with check (true); -- поля проверяют ограничения booking_lengths
create policy "public insert" on demo_submissions for insert with check (true);  -- и demo_lengths
-- backstage_files, backstage_attempts, request_log, sync_runs: только админ и service role

-- ---------------------------------------------------------------------------
-- 7. Хранилище файлов
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public) values ('backstage', 'backstage', false)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('artists', 'artists', true, 5242880, array['image/webp', 'image/jpeg'])
on conflict (id) do update set public = true, file_size_limit = 5242880, allowed_mime_types = array['image/webp', 'image/jpeg'];

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('merch', 'merch', true, 5242880, array['image/webp', 'image/jpeg'])
on conflict (id) do update set public = true, file_size_limit = 5242880, allowed_mime_types = array['image/webp', 'image/jpeg'];

-- Документы компании (PDF): публичные ссылки из футера и со страницы /legal
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('docs', 'docs', true, 20971520, array['application/pdf'])
on conflict (id) do update set public = true, file_size_limit = 20971520, allowed_mime_types = array['application/pdf'];

drop policy if exists "backstage: admin all" on storage.objects;
create policy "backstage: admin all" on storage.objects for all
  using (bucket_id = 'backstage' and public.is_admin()) with check (bucket_id = 'backstage' and public.is_admin());

drop policy if exists "artists photos: admin write" on storage.objects;
create policy "artists photos: admin write" on storage.objects for insert
  with check (bucket_id in ('artists', 'merch', 'docs') and public.is_admin());
drop policy if exists "artists photos: admin update" on storage.objects;
create policy "artists photos: admin update" on storage.objects for update
  using (bucket_id in ('artists', 'merch', 'docs') and public.is_admin());
drop policy if exists "artists photos: admin delete" on storage.objects;
create policy "artists photos: admin delete" on storage.objects for delete
  using (bucket_id in ('artists', 'merch', 'docs') and public.is_admin());

-- ---------------------------------------------------------------------------
-- 8. Представления для модерации
-- ---------------------------------------------------------------------------

-- drop + create, а не create or replace: replace не умеет менять состав и порядок колонок
drop view if exists concerts_pending;
create view concerts_pending with (security_invoker = true) as
  select c.id, a.name as artist, c.date, c.city, c.venue, c.ticket_url, c.source
  from concerts c join artists a on a.slug = c.artist_slug
  where c.status = 'pending' and c.date >= current_date
  order by c.date;

drop view if exists artists_autodetected;
create view artists_autodetected with (security_invoker = true) as
  select slug, name, spotify_id, deezer_id, youtube_channel_id, wikipedia_title, resolved
  from artists
  where resolved <> '{}'::jsonb
  order by sort;

-- ---------------------------------------------------------------------------
-- 9. Занятое место для админки (лимиты тарифа задаёт сама админка)
-- ---------------------------------------------------------------------------

create or replace function public.admin_usage()
returns jsonb
language plpgsql
stable
security definer
set search_path = public, storage, pg_catalog
as $$
begin
  if not public.is_admin() then
    raise exception 'forbidden' using errcode = '42501';
  end if;

  return jsonb_build_object(
    'database_bytes', pg_database_size(current_database()),
    'storage_bytes', coalesce((select sum((metadata ->> 'size')::bigint) from storage.objects), 0),
    'storage_objects', (select count(*) from storage.objects),
    'buckets', coalesce((
      select jsonb_agg(jsonb_build_object('name', bucket_id, 'bytes', bytes, 'objects', objects) order by bytes desc)
      from (
        select bucket_id, sum((metadata ->> 'size')::bigint) as bytes, count(*) as objects
        from storage.objects group by bucket_id
      ) b
    ), '[]'::jsonb),
    'tables', coalesce((
      select jsonb_agg(jsonb_build_object('name', relname, 'bytes', bytes) order by bytes desc)
      from (
        select c.relname, pg_total_relation_size(c.oid) as bytes
        from pg_class c join pg_namespace n on n.oid = c.relnamespace
        where n.nspname = 'public' and c.relkind = 'r'
        order by bytes desc limit 8
      ) t
    ), '[]'::jsonb),
    'measured_at', now()
  );
end;
$$;

revoke all on function public.admin_usage() from public, anon;
grant execute on function public.admin_usage() to authenticated;

-- ---------------------------------------------------------------------------
-- 10. Секрет расписания синхронизации. Хранится в Vault (создаёт cron.sql);
--     функция sync-catalog сверяет заголовок вызова через эту функцию.
--     Вызвать её может только service role — то есть только сама Edge Function.
-- ---------------------------------------------------------------------------
create or replace function public.check_sync_secret(candidate text)
returns boolean
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  expected text;
begin
  if candidate is null or length(candidate) < 32 then return false; end if;
  begin
    select decrypted_secret into expected from vault.decrypted_secrets where name = 'sync_secret';
  exception when undefined_table or invalid_schema_name then
    return false; -- Vault недоступен (локальная проверка схемы)
  end;
  return expected is not null and expected = candidate;
end;
$$;

revoke all on function public.check_sync_secret(text) from public, anon, authenticated;
do $$ begin
  grant execute on function public.check_sync_secret(text) to service_role;
exception when undefined_object then null; -- роли service_role нет вне Supabase
end $$;

-- ---------------------------------------------------------------------------
-- 11. Порядок артистов на сайте: одним вызовом из админки (перетаскивание в списке).
--     Позиция в массиве становится sort; не перечисленные артисты уходят в конец.
-- ---------------------------------------------------------------------------
create or replace function public.reorder_artists(p_slugs text[])
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then raise exception 'forbidden' using errcode = '42501'; end if;
  update artists a set sort = o.pos - 1, updated_at = now()
  from unnest(p_slugs) with ordinality as o(slug, pos)
  where a.slug = o.slug and a.sort is distinct from o.pos - 1;
  update artists set sort = coalesce(array_length(p_slugs, 1), 0) + sort
  where not (slug = any(p_slugs));
end;
$$;
revoke all on function public.reorder_artists(text[]) from public, anon;
grant execute on function public.reorder_artists(text[]) to authenticated;

-- ---------------------------------------------------------------------------
-- 12. Посещаемость: свои счётчики без cookies и персональных данных.
--     Сайт вызывает track_view(path) при открытии страницы; хранится только
--     «день + адрес + число просмотров». Админка читает сводку через site_stats().
-- ---------------------------------------------------------------------------
create table if not exists page_views (
  day date not null,
  path text not null,
  views int not null default 0,
  primary key (day, path)
);
alter table page_views enable row level security;
drop policy if exists "admin all" on page_views;
create policy "admin all" on page_views for all using (public.is_admin()) with check (public.is_admin());

create or replace function public.track_view(p_path text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Только адреса сайта вида /artist/dora, без параметров и мусора; админку не считаем
  if p_path is null or p_path !~ '^/[a-z0-9/_-]{0,120}$' or p_path like '/admin%' then return; end if;
  insert into page_views (day, path, views) values ((now() at time zone 'Europe/Moscow')::date, p_path, 1)
  on conflict (day, path) do update set views = page_views.views + 1;
end;
$$;
revoke all on function public.track_view(text) from public;
grant execute on function public.track_view(text) to anon, authenticated;

create or replace function public.site_stats(p_days int default 30)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  today date := (now() at time zone 'Europe/Moscow')::date;
  since date := today - (greatest(1, least(p_days, 365)) - 1);
  prev_since date := since - greatest(1, least(p_days, 365));
begin
  if not public.is_admin() then raise exception 'forbidden' using errcode = '42501'; end if;
  return jsonb_build_object(
    'days', coalesce((
      select jsonb_agg(jsonb_build_object('day', d::date, 'views', coalesce(v.views, 0)) order by d)
      from generate_series(since, today, interval '1 day') d
      left join (select day, sum(views)::int views from page_views where day >= since group by day) v on v.day = d::date
    ), '[]'::jsonb),
    'total', coalesce((select sum(views) from page_views where day >= since), 0),
    'previous', coalesce((select sum(views) from page_views where day >= prev_since and day < since), 0),
    'top', coalesce((
      select jsonb_agg(jsonb_build_object('path', path, 'views', views) order by views desc)
      from (select path, sum(views)::int views from page_views where day >= since group by path order by views desc limit 8) t
    ), '[]'::jsonb)
  );
end;
$$;
revoke all on function public.site_stats(int) from public, anon;
grant execute on function public.site_stats(int) to authenticated;
