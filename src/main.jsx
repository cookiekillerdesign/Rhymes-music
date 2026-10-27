import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, MemoryRouter } from "react-router-dom";
import { PlayerProvider } from "./components/Player";
import App from "./App";
import { markReady } from "./components/Ready";
// Шрифт из пакета, а не с Google Fonts: не блокирует отрисовку чужим доменом и работает без него
import "@fontsource-variable/onest/wght.css";
import "./styles/global.css";

if ("scrollRestoration" in history) history.scrollRestoration = "manual";

// После деплоя у открытых вкладок старые lazy-чанки исчезают с сервера. Перезагружаем
// страницу один раз; если не помогло, ошибку покажет ErrorBoundary, а не белый экран.
const RELOAD_KEY = "rm-reloaded-after-deploy";
window.addEventListener("vite:preloadError", (event) => {
  if (sessionStorage.getItem(RELOAD_KEY)) return;
  event.preventDefault();
  sessionStorage.setItem(RELOAD_KEY, "1");
  location.reload();
});
window.addEventListener("load", () => setTimeout(() => sessionStorage.removeItem(RELOAD_KEY), 10_000));

// В превью-артефакте адресная строка недоступна, поэтому роутер живёт в памяти.
// Ссылка вида …#dora открывает сразу страницу артиста.
const isArtifact = import.meta.env.MODE === "artifact";
const token = location.hash.slice(1);
const Router = isArtifact ? MemoryRouter : BrowserRouter;
const routerProps = isArtifact ? { initialEntries: [token ? `/artist/${token}` : "/"] } : {};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router {...routerProps}>
      <PlayerProvider>
        <App />
      </PlayerProvider>
    </Router>
  </React.StrictMode>
);

// Интро-анимации первого экрана стартуют после первого кадра — без отдельного экрана загрузки
requestAnimationFrame(markReady);
