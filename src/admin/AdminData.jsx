import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { listArtists } from "./api";
import { RESOURCES } from "./cms/resources";
import { countByStatus } from "./cms/api";

/**
 * Общие данные админки: список артистов (нужен почти каждому разделу) и счётчики того,
 * что ждёт действий — их видно в меню и на «Обзоре». Обновляются после любых правок.
 */
const Ctx = createContext({ artists: [], counts: null, reloadArtists: () => {}, refreshCounts: () => {} });

export function AdminDataProvider({ children }) {
  const [artists, setArtists] = useState([]);
  const [counts, setCounts] = useState(null);

  const reloadArtists = useCallback(() => listArtists().then(setArtists, () => {}), []);
  const refreshCounts = useCallback(() => {
    Promise.all([
      countByStatus(RESOURCES.concerts, { upcoming: true }),
      countByStatus(RESOURCES.bookings),
      countByStatus(RESOURCES.demos)
    ]).then(([concerts, bookings, demos]) => setCounts({ concerts, bookings, demos }), () => setCounts({}));
  }, []);

  useEffect(() => { reloadArtists(); refreshCounts(); }, [reloadArtists, refreshCounts]);

  return <Ctx.Provider value={{ artists, counts, reloadArtists, refreshCounts }}>{children}</Ctx.Provider>;
}

export const useAdminData = () => useContext(Ctx);

/** Счётчики для меню: сколько концертов на модерации, сколько новых заявок */
export function useBadges() {
  const { counts } = useAdminData();
  return {
    concerts: counts?.concerts?.pending ?? 0,
    requests: (counts?.bookings?.new ?? 0) + (counts?.demos?.new ?? 0),
    bookings: counts?.bookings?.new ?? 0,
    demos: counts?.demos?.new ?? 0
  };
}
