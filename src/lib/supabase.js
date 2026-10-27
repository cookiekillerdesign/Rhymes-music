import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

/**
 * Клиент витрины — всегда анонимный. Сессию не хранит и не подхватывает: иначе вошедший
 * в админку получал бы на сайте права админа и видел черновики и скрытое как опубликованное
 * (политики «public read» и «admin all» складываются через OR).
 * null, если переменные окружения не заданы: тогда сайт работает на локальных данных.
 */
export const supabase = url && key
  ? createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false, storageKey: "rm-public" }
    })
  : null;

/** Клиент админки создаётся отдельно (src/admin/client.js) со своей сессией и ключом хранилища */
export const supabaseConfig = { url, key };
