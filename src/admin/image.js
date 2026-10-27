import { PHOTO_SPEC } from "./photoSpec";

/** Размеры картинки без загрузки в DOM; учитывает поворот из EXIF */
export async function readImage(file) {
  const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  return { bitmap, width: bitmap.width, height: bitmap.height };
}

const toBlob = (canvas, type, quality) => new Promise((resolve) => canvas.toBlob(resolve, type, quality));

/**
 * Уменьшает фото до PHOTO_SPEC.output.maxSide по длинной стороне и кодирует в WebP.
 * Браузеры без WebP-кодировщика (старый Safari) молча отдают PNG — тогда сохраняем JPEG.
 */
export async function compressPhoto(bitmap, output = PHOTO_SPEC.output) {
  const { maxSide, type, quality, fallbackType, fallbackQuality } = output;
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

  let blob = await toBlob(canvas, type, quality);
  if (!blob || blob.type !== type) blob = await toBlob(canvas, fallbackType, fallbackQuality);
  return { blob, width: canvas.width, height: canvas.height };
}
