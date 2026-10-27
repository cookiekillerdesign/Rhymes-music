import { useQuery } from "../lib/useQuery";
import { getArtists } from "../lib/api";
import ArtistIndex from "../components/ArtistIndex";
import { RevealTitle } from "../components/Reveal";

export default function Artists() {
  const { data } = useQuery(getArtists, []);
  return (
    <main className="page wrap">
      <header className="page__head">
        <RevealTitle as="h1" className="h-xxl">Артисты</RevealTitle>
        <p className="section__lead">Ростер Rhymes Music: от кьют-рока и поп-панка до рейва и хип-хопа.</p>
      </header>
      {data ? <ArtistIndex artists={data} defaultView="grid" /> : <div className="page-loading" />}
    </main>
  );
}
