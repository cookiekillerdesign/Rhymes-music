import { NavLink, Navigate, Route, Routes } from "react-router-dom";
import { useAdminData, useBadges } from "./AdminData";
import { RESOURCES } from "./cms/resources";
import ResourceSection from "./cms/ResourceSection";
import PageHeader from "./PageHeader";

/** Заявки: букинг и демо в одном разделе, переключатель сверху */
export default function Requests() {
  const { artists } = useAdminData();
  const badges = useBadges();
  return (
    <section>
      <PageHeader title="Заявки" />
      <nav className="a-segmented" aria-label="Тип заявок">
        <NavLink to="/admin/requests/booking">Букинг{badges.bookings > 0 && <b className="a-badge">{badges.bookings}</b>}</NavLink>
        <NavLink to="/admin/requests/demo">Демо{badges.demos > 0 && <b className="a-badge">{badges.demos}</b>}</NavLink>
      </nav>
      <Routes>
        <Route path="booking" element={<ResourceSection key="bookings" resource={RESOURCES.bookings} artists={artists} headless />} />
        <Route path="demo" element={<ResourceSection key="demos" resource={RESOURCES.demos} artists={artists} headless />} />
        <Route path="*" element={<Navigate to="/admin/requests/booking" replace />} />
      </Routes>
    </section>
  );
}
