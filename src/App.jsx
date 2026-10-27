import { lazy, Suspense, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import SmoothScroll from "./components/SmoothScroll";
import Cursor from "./components/Cursor";
import PageTransition from "./components/PageTransition";
import ErrorBoundary from "./components/ErrorBoundary";
import { PlayerBar } from "./components/Player";
import { LineupProvider, LineupTray } from "./components/Lineup";
import { useQuery } from "./lib/useQuery";
import { getArtists, trackView } from "./lib/api";
import Home from "./pages/Home";

const Artists = lazy(() => import("./pages/Artists"));
const Artist = lazy(() => import("./pages/Artist"));
const Releases = lazy(() => import("./pages/Releases"));
const Concerts = lazy(() => import("./pages/Concerts"));
const Booking = lazy(() => import("./pages/Booking"));
const Contacts = lazy(() => import("./pages/Contacts"));
const NotFound = lazy(() => import("./pages/NotFound"));
const ForArtists = lazy(() => import("./pages/ForArtists"));
const Merch = lazy(() => import("./pages/Merch"));
const MerchItem = lazy(() => import("./pages/MerchItem"));
const Team = lazy(() => import("./pages/Team"));
const Jobs = lazy(() => import("./pages/Jobs"));
const Job = lazy(() => import("./pages/Job"));
const Legal = lazy(() => import("./pages/Legal"));
const Admin = lazy(() => import("./admin/Admin"));

/* Админка живёт отдельно от витрины: без шапки, плеера, курсора и плавного скролла */
export default function App() {
  const { pathname } = useLocation();
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    return (
      <ErrorBoundary>
        <Suspense fallback={<div className="page-loading" />}>
          <Routes>
            <Route path="/admin/*" element={<Admin />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    );
  }
  return <Site />;
}

function Site() {
  // Лайнап живёт вне ErrorBoundary страниц: ошибку загрузки здесь не пробрасываем,
  // её и так покажет страница, которой нужны артисты
  const { data: artists } = useQuery(getArtists, [], { throwOnError: false });
  // Посещаемость для «Обзора» в админке: каждая открытая страница сайта
  const { pathname } = useLocation();
  useEffect(() => trackView(pathname), [pathname]);
  return (
    <LineupProvider artists={artists || []}>
      <a className="skip" href="#content">К содержанию</a>
      <SmoothScroll />
      <Cursor />
      <Nav />
      <div id="content" tabIndex={-1}>
        <PageTransition>
          {(location) => (
            <ErrorBoundary resetKey={location.pathname}>
              <Suspense fallback={<div className="page-loading" />}>
                <Routes location={location}>
                  <Route path="/" element={<Home />} />
                  <Route path="/artists" element={<Artists />} />
                  <Route path="/artist/:slug" element={<Artist />} />
                  <Route path="/releases" element={<Releases />} />
                  <Route path="/concerts" element={<Concerts />} />
                  <Route path="/booking" element={<Booking />} />
                  <Route path="/contacts" element={<Contacts />} />
                  <Route path="/for-artists" element={<ForArtists />} />
                  <Route path="/merch" element={<Merch />} />
                  <Route path="/merch/:id" element={<MerchItem />} />
                  <Route path="/team" element={<Team />} />
                  <Route path="/jobs" element={<Jobs />} />
                  <Route path="/jobs/:slug" element={<Job />} />
                  <Route path="/legal" element={<Legal />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </ErrorBoundary>
          )}
        </PageTransition>
      </div>
      <Footer />
      <LineupTray />
      <PlayerBar />
    </LineupProvider>
  );
}
