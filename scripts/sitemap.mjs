/*
 * Генерирует public/sitemap.xml и public/robots.txt перед сборкой (npm run build → prebuild).
 * Адрес сайта — переменная SITE_URL (например, https://rhymes-music.vercel.app); без неё
 * sitemap не создаётся, а robots.txt разрешает всё, кроме админки.
 * Артисты — из локального каталога; добавленные в админке попадут после следующего деплоя.
 */
import { writeFileSync } from "node:fs";
import { ARTISTS, JOBS } from "../src/data/content.js";

const site = process.env.SITE_URL?.replace(/\/+$/, "");
const STATIC = ["/", "/artists", "/releases", "/concerts", "/booking", "/for-artists", "/merch", "/team", "/jobs", "/contacts"];

const robots = ["User-agent: *", "Disallow: /admin", site ? `Sitemap: ${site}/sitemap.xml` : null].filter(Boolean).join("\n");
writeFileSync("public/robots.txt", `${robots}\n`);

if (site) {
  const paths = [...STATIC, ...ARTISTS.map((a) => `/artist/${a.slug}`), ...JOBS.map((j) => `/jobs/${j.slug}`)];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths.map((p) => `  <url><loc>${site}${p}</loc></url>`).join("\n")}
</urlset>
`;
  writeFileSync("public/sitemap.xml", xml);
  console.log(`sitemap.xml: ${paths.length} адресов`);
} else {
  console.log("SITE_URL не задан — sitemap.xml не создан");
}
