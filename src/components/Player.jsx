import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { trackKey } from "../lib/format";
import { prefersReducedMotion } from "../lib/scroll";
import { Icon } from "./Icons";
import { useRootClass } from "../lib/useRootClass";

/*
 * Глобальный плеер. Живёт над роутером, поэтому музыка не прерывается при переходах.
 * 1. Есть превью (mp3) → играем сами и анализируем звук через Web Audio:
 *    уровень баса качает свет на сцене, частоты рисуют визуализатор.
 * 2. Превью не грузится с CORS → играем «чистым» элементом, бит симулируем.
 * 3. Превью нет → компактный плеер Spotify прямо в панели.
 */
const PlayerCtx = createContext(null);
export const usePlayer = () => useContext(PlayerCtx);

const BINS = 48;

export function PlayerProvider({ children }) {
  const analysedRef = useRef(null);
  const plainRef = useRef(null);
  const graphRef = useRef(null);
  const level = useRef(0);
  const bands = useRef(new Float32Array(BINS));
  const [queue, setQueue] = useState([]);
  const [index, setIndex] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const [mode, setMode] = useState("idle"); // idle | analysed | plain | spotify | unavailable
  const [time, setTime] = useState({ current: 0, duration: 30 });

  const track = queue[index] || null;
  const activeEl = () => (mode === "plain" ? plainRef.current : analysedRef.current);

  const ensureGraph = () => {
    if (graphRef.current) return graphRef.current;
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return null;
    const ctx = new Ctx();
    const source = ctx.createMediaElementSource(analysedRef.current);
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 512;
    analyser.smoothingTimeConstant = 0.78;
    source.connect(analyser).connect(ctx.destination);
    graphRef.current = { ctx, analyser, data: new Uint8Array(analyser.frequencyBinCount) };
    return graphRef.current;
  };

  // Браузер может отклонить play() (автовоспроизведение, сеть): показываем паузу, а не «играет»
  const onPlayRejected = (error) => {
    setPlaying(false);
    if (error?.name !== "AbortError") console.warn("[player] воспроизведение не началось:", error?.message ?? error);
  };

  const stopAll = () => {
    [analysedRef.current, plainRef.current].forEach((el) => el && el.pause());
  };

  // Загрузка нового трека
  useEffect(() => {
    if (!track) return;
    stopAll();
    setTime({ current: 0, duration: 30 });
    if (!track.preview) {
      setMode(track.spotify ? "spotify" : "unavailable");
      setPlaying(Boolean(track.spotify));
      return;
    }
    const el = analysedRef.current;
    const graph = ensureGraph();
    graph?.ctx.resume();
    setMode("analysed");
    el.src = track.preview;
    el.play().then(() => setPlaying(true)).catch(onPlayRejected);
  }, [track]);

  // Ошибка загрузки с CORS: переключаемся на «чистый» элемент, затем на Spotify
  const onAnalysedError = () => {
    if (!track?.preview) return;
    const el = plainRef.current;
    setMode("plain");
    el.src = track.preview;
    el.play().then(() => setPlaying(true)).catch(onPlayRejected);
  };
  const onPlainError = () => {
    setMode(track?.spotify ? "spotify" : "unavailable");
    setPlaying(Boolean(track?.spotify));
  };

  const play = useCallback((t, list) => {
    // Трека нет в очереди (например, у релиза нет превью) — играем только его, а не первый в списке
    const inList = list?.length ? list.findIndex((x) => trackKey(x) === trackKey(t)) : -1;
    const q = inList >= 0 ? list : [t];
    const i = Math.max(0, inList);
    if (track && trackKey(track) === trackKey(t)) { toggle(); return; }
    setQueue(q);
    setIndex(i);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [track, mode, playing]);

  const toggle = useCallback(() => {
    if (mode === "spotify" || mode === "unavailable" || !track) return;
    const el = activeEl();
    if (el.paused) { graphRef.current?.ctx.resume(); el.play().then(() => setPlaying(true)).catch(onPlayRejected); }
    else { el.pause(); setPlaying(false); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, track]);

  /**
   * Пауза извне (запуск клипа). Spotify-embed управлять снаружи нельзя,
   * поэтому его закрываем, чтобы музыка не играла поверх клипа.
   */
  const pause = useCallback(() => {
    if (mode === "spotify") { stopAll(); setPlaying(false); setQueue([]); setIndex(-1); setMode("idle"); return; }
    const el = activeEl();
    if (el && !el.paused) el.pause();
    setPlaying(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  const step = useCallback((d) => {
    if (!queue.length) return;
    setIndex((i) => (i + d + queue.length) % queue.length);
  }, [queue.length]);

  const seek = useCallback((ratio) => {
    const el = activeEl();
    if (el && el.duration) el.currentTime = ratio * el.duration;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  const close = useCallback(() => {
    stopAll(); setPlaying(false); setQueue([]); setIndex(-1); setMode("idle");
  }, []);

  // Аналитика звука → level (0..1) и bands для визуализатора
  useEffect(() => {
    const reduce = prefersReducedMotion();
    let raf;
    const t0 = performance.now();
    const loop = (now) => {
      raf = requestAnimationFrame(loop);
      const b = bands.current;
      const g = graphRef.current;
      let target = 0;
      if (playing && mode === "analysed" && g) {
        g.analyser.getByteFrequencyData(g.data);
        const usable = Math.floor(g.data.length * 0.7);
        for (let i = 0; i < BINS; i++) {
          // логарифмическая раскладка: больше полос на низы
          const from = Math.floor(Math.pow(i / BINS, 1.8) * usable);
          const to = Math.max(from + 1, Math.floor(Math.pow((i + 1) / BINS, 1.8) * usable));
          let s = 0;
          for (let k = from; k < to; k++) s += g.data[k];
          b[i] = s / (to - from) / 255;
        }
        target = (b[0] + b[1] + b[2] + b[3]) / 4;
        target = Math.max(0, (target - 0.35) / 0.65);
      } else if (playing) {
        // симуляция: 120 BPM
        const t = (now - t0) / 1000;
        const kick = Math.exp(-((t % 0.5) / 0.5) * 6);
        for (let i = 0; i < BINS; i++) {
          const v = Math.abs(Math.sin(t * 2.3 + i * 0.6) * Math.sin(t * 1.1 + i * 1.7));
          b[i] = Math.min(1, v * 0.55 + kick * (i < 8 ? 0.8 : 0.25) * (1 - i / BINS));
        }
        target = mode === "spotify" ? kick * 0.5 : kick;
      } else {
        for (let i = 0; i < BINS; i++) b[i] *= 0.9;
      }
      if (reduce) target *= 0.2;
      level.current += (target - level.current) * (target > level.current ? 0.5 : 0.12);
      // Пауза и всё затухло — цикл не нужен, перезапустится при следующем play
      if (!playing && level.current < 0.001 && b.every((v) => v < 0.01)) {
        cancelAnimationFrame(raf);
        level.current = 0;
      }
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [playing, mode]);

  // iOS приостанавливает AudioContext при блокировке экрана и уходе со вкладки:
  // возобновляем при возвращении и на любом жесте пользователя
  useEffect(() => {
    const resume = () => {
      const ctx = graphRef.current?.ctx;
      if (ctx && ctx.state !== "running") ctx.resume().catch(() => {});
    };
    const onVisible = () => document.visibilityState === "visible" && resume();
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("pointerdown", resume, { passive: true });
    window.addEventListener("keydown", resume);
    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("pointerdown", resume);
      window.removeEventListener("keydown", resume);
    };
  }, []);

  const audioEvents = {
    onTimeUpdate: (e) => setTime({ current: e.currentTarget.currentTime, duration: e.currentTarget.duration || 30 }),
    onEnded: () => step(1),
    onPause: () => setPlaying(false),
    onPlay: () => setPlaying(true)
  };

  const value = useMemo(() => ({
    track, queue, playing, mode, time, level, bands,
    play, toggle, pause, step, seek, close,
    isCurrent: (t) => Boolean(track) && trackKey(track) === trackKey(t)
  }), [track, queue, playing, mode, time, play, toggle, pause, step, seek, close]);

  return (
    <PlayerCtx.Provider value={value}>
      {children}
      <audio ref={analysedRef} crossOrigin="anonymous" preload="none" onError={onAnalysedError} {...audioEvents} />
      <audio ref={plainRef} preload="none" onError={onPlainError} {...audioEvents} />
    </PlayerCtx.Provider>
  );
}

/* ---------- Визуализатор ---------- */
function Visualizer({ className = "", color = "currentColor" }) {
  const { bands, playing } = usePlayer();
  const ref = useRef(null);
  useEffect(() => {
    const cv = ref.current;
    const cx = cv.getContext("2d");
    // Цвет читаем один раз, а не в каждом кадре: getComputedStyle форсирует пересчёт стилей
    const fill = color === "currentColor" ? getComputedStyle(cv).color : color;
    let raf;
    const draw = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      const w = cv.clientWidth * dpr, h = cv.clientHeight * dpr;
      if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h; }
      cx.clearRect(0, 0, w, h);
      cx.fillStyle = fill;
      const b = bands.current, n = b.length, gap = 2 * dpr, bw = (w - gap * (n - 1)) / n;
      for (let i = 0; i < n; i++) {
        const v = Math.max(0.04, b[i]);
        const bh = v * h;
        cx.fillRect(i * (bw + gap), (h - bh) / 2, bw, bh);
      }
      // На паузе рисуем, пока полосы не опадут, и останавливаемся
      if (playing || b.some((v) => v > 0.04)) raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [bands, color, playing]);
  return <canvas ref={ref} className={className} aria-hidden="true" />;
}

/* ---------- Нижняя панель ---------- */
const fmt = (s) => (Number.isFinite(s) ? `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}` : "0:30");

export function PlayerBar() {
  const p = usePlayer();
  const { track, mode, playing, time } = p;
  const open = Boolean(track);
  useRootClass("has-player", open); // футер и плашка лайнапа освобождают место под плеер
  const ratio = time.duration ? time.current / time.duration : 0;

  return (
    <div className={`player ${open ? "is-open" : ""} ${mode === "spotify" ? "is-embed" : ""}`} role="region" aria-label="Плеер" aria-hidden={!open}>
      {track && (
        <>
          <img className="player__cover" src={track.cover} alt="" width="56" height="56" />
          {mode === "spotify" ? (
            <iframe
              key={track.spotify}
              className="player__embed"
              title={`${track.title} в Spotify`}
              src={`https://open.spotify.com/embed/${track.spotify}?utm_source=generator&theme=0`}
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
            />
          ) : (
            <>
              <div className="player__meta">
                <b>{track.title}</b>
                <span>{mode === "unavailable" ? "Превью недоступно, слушайте на площадках" : track.artists}</span>
                <div
                  className="player__progress"
                  role="slider"
                  tabIndex={0}
                  aria-label="Перемотка"
                  aria-valuemin={0}
                  aria-valuemax={Math.round(time.duration)}
                  aria-valuenow={Math.round(time.current)}
                  onClick={(e) => { const r = e.currentTarget.getBoundingClientRect(); p.seek((e.clientX - r.left) / r.width); }}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowRight") p.seek(Math.min(1, ratio + 0.05));
                    if (e.key === "ArrowLeft") p.seek(Math.max(0, ratio - 0.05));
                  }}
                >
                  <i style={{ transform: `scaleX(${ratio})` }} />
                </div>
              </div>
              <Visualizer className="player__viz" />
              <span className="player__time">{fmt(time.current)}</span>
              <div className="player__ctrl">
                <button className="icon-btn" onClick={() => p.step(-1)} aria-label="Предыдущий трек"><Icon name="prev" /></button>
                <button className="icon-btn icon-btn--main" onClick={p.toggle} aria-label={playing ? "Пауза" : "Играть"} disabled={mode === "unavailable"}>
                  <Icon name={playing ? "pause" : "play"} />
                </button>
                <button className="icon-btn" onClick={() => p.step(1)} aria-label="Следующий трек"><Icon name="next" /></button>
              </div>
            </>
          )}
          <button className="icon-btn player__close" onClick={p.close} aria-label="Закрыть плеер"><Icon name="close" /></button>
        </>
      )}
    </div>
  );
}
