// Концерты: страницы афиш (schema.org Event) и Bandsintown.
import { type ConcertCandidate, eventsFromBandsintown, eventsFromJsonLd, extractJsonLd } from "../lib.ts";
import { env, errorText, getJson, request } from "../http.ts";

type TourArtist = { slug: string; name: string; tour_sources: string[] | null; bandsintown_name: string | null };

export async function collectConcerts(artist: TourArtist, today: string, errors: string[]): Promise<ConcertCandidate[]> {
  const found: ConcertCandidate[] = [];

  for (const url of artist.tour_sources ?? []) {
    try {
      const html = await (await request(url)).text();
      found.push(...eventsFromJsonLd(extractJsonLd(html), artist, url, today));
    } catch (e) {
      errors.push(`афиша ${url}: ${errorText(e)}`);
    }
  }

  const appId = env("BANDSINTOWN_APP_ID");
  if (appId && artist.bandsintown_name) {
    try {
      const url = `https://rest.bandsintown.com/artists/${encodeURIComponent(artist.bandsintown_name)}/events?app_id=${
        encodeURIComponent(appId)
      }`;
      found.push(...eventsFromBandsintown(await getJson(url), artist.slug, today));
    } catch (e) {
      errors.push(`bandsintown: ${errorText(e)}`);
    }
  }

  // Один концерт может прийти из нескольких источников — оставляем первый
  return [...new Map(found.map((c) => [c.external_id, c])).values()];
}
