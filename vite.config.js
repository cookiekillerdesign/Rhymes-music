import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { viteSingleFile } from "vite-plugin-singlefile";

/*
 * Адрес и публичный (anon) ключ Supabase. Принимаем имена переменных и наши (VITE_…),
 * и те, что создаёт интеграция Supabase в Vercel (NEXT_PUBLIC_… / SUPABASE_…).
 * В браузер попадают только эти два значения: service role ключ сюда не читается никогда.
 */
function supabasePublicEnv(env) {
  const pick = (...names) => names.map((n) => env[n]).find(Boolean) ?? "";
  return {
    url: pick("VITE_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_URL"),
    anonKey: pick("VITE_SUPABASE_ANON_KEY", "NEXT_PUBLIC_SUPABASE_ANON_KEY", "SUPABASE_ANON_KEY")
  };
}

// mode "artifact": один самодостаточный HTML для превью в Claude
export default defineConfig(({ mode }) => {
  const { url, anonKey } = supabasePublicEnv({ ...loadEnv(mode, process.cwd(), ""), ...process.env });
  return {
    plugins: [react(), ...(mode === "artifact" ? [viteSingleFile()] : [])],
    define: {
      "import.meta.env.VITE_SUPABASE_URL": JSON.stringify(url),
      "import.meta.env.VITE_SUPABASE_ANON_KEY": JSON.stringify(anonKey)
    },
    build: {
      target: "es2019",
      outDir: mode === "artifact" ? "dist-artifact" : "dist"
    }
  };
});
