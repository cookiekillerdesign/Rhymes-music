-- Расписание синхронизации. Выполнить в SQL Editor — подставлять ничего не нужно,
-- кроме адреса проекта в одной строке ниже (если он другой). Файл можно запускать повторно.
-- Секрет для вызова функции генерируется здесь же и хранится в Vault: его никто не вводит
-- и не видит, функция sync-catalog сверяет его через public.check_sync_secret().

create extension if not exists pg_cron;
create extension if not exists pg_net;

-- Секрет: создаём случайный, если его ещё нет
do $$
begin
  if not exists (select 1 from vault.secrets where name = 'sync_secret') then
    perform vault.create_secret(encode(gen_random_bytes(32), 'hex'), 'sync_secret', 'Секрет расписания sync-catalog');
  end if;
end $$;

-- Каждые 30 минут: за вызов функция обрабатывает пачку артистов, давно не обновлявшихся.
-- cron.schedule с тем же именем обновляет задание, а не дублирует его.
select cron.schedule(
  'sync-catalog',
  '*/30 * * * *',
  $$
  select net.http_post(
    url := 'https://cktblywzwngocbtnebam.supabase.co/functions/v1/sync-catalog',
    headers := jsonb_build_object(
      'content-type', 'application/json',
      'x-sync-secret', (select decrypted_secret from vault.decrypted_secrets where name = 'sync_secret')
    ),
    body := '{}'::jsonb,
    timeout_milliseconds := 150000
  );
  $$
);

-- Проверить: select * from cron.job_run_details order by start_time desc limit 5;
-- Результаты синхронизации: select finished_at, summary from sync_runs order by id desc limit 5;
