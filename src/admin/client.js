import { createClient } from "@supabase/supabase-js";
import { supabaseConfig } from "../lib/supabase";

/** Клиент админки: с сессией пользователя. Витрина пользуется своим анонимным клиентом. */
export const adminClient = supabaseConfig.url && supabaseConfig.key
  ? createClient(supabaseConfig.url, supabaseConfig.key, { auth: { persistSession: true, storageKey: "rm-admin" } })
  : null;
