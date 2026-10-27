/*
 * Требования к фото артиста. Одно и то же фото показывается в трёх кадрировках:
 * шапка артиста на десктопе (16:9), шапка на телефоне (узкая вертикаль ~9:19)
 * и карточка в списке артистов (4:5). Поэтому нужен горизонтальный снимок
 * с запасом по краям, а не вертикальный портрет.
 */
export const PHOTO_SPEC = {
  ratio: "3:2, горизонтальное",
  recommended: { width: 2400, height: 1600 },
  min: { width: 1600, height: 1067 },
  maxInputMB: 20,
  formats: ["image/jpeg", "image/png", "image/webp"],
  /** Сохраняем в WebP по длинной стороне не больше 2400 px: ~300–600 КБ без видимых потерь */
  output: { maxSide: 2400, type: "image/webp", quality: 0.86, fallbackType: "image/jpeg", fallbackQuality: 0.88 }
};

/** Кадрировки для предпросмотра в админке — те же пропорции, что на сайте */
export const PHOTO_CROPS = [
  { key: "desktop", label: "Шапка, компьютер", ratio: "16 / 9" },
  { key: "mobile", label: "Шапка, телефон", ratio: "9 / 19" },
  { key: "card", label: "Карточка в списке", ratio: "4 / 5" }
];


/** Проверка размеров: ошибка — нельзя загрузить, предупреждение — можно, но будет мыльно */
export function checkPhotoSize(width, height) {
  const { min, recommended } = PHOTO_SPEC;
  if (width < min.width || height < min.height) {
    return { level: "error", text: `Фото ${width}×${height} — слишком маленькое. Нужно не меньше ${min.width}×${min.height}, лучше ${recommended.width}×${recommended.height}.` };
  }
  if (height > width) {
    return { level: "warning", text: "Фото вертикальное: на компьютере шапка обрежет его сверху и снизу. Лучше горизонтальный кадр 3:2." };
  }
  if (width < recommended.width) {
    return { level: "warning", text: `Подойдёт, но на больших экранах будет мягче. Идеально — ${recommended.width}×${recommended.height}.` };
  }
  return { level: "ok", text: `${width}×${height} — отлично.` };
}

/** Фото из профиля Spotify (синхронизация берёт его, если своего нет): максимум 640 px */
export function isSpotifyImage(url) {
  try {
    return new URL(url).hostname.endsWith("scdn.co");
  } catch {
    return false;
  }
}
