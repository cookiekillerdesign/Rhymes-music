import { useId, useRef, useState } from "react";
import { PHOTO_CROPS, PHOTO_SPEC, checkPhotoSize, isSpotifyImage } from "./photoSpec";
import { compressPhoto, readImage } from "./image";
import { getUsage, uploadArtistPhoto } from "./api";
import { formatBytes, getLimits } from "./usage";

const MB = 1024 * 1024;

/**
 * Фото артиста: загрузка с проверкой размера, сжатие в WebP, точка фокуса
 * (клик по фото) и предпросмотр всех кадрировок сайта.
 * @param {{ slug: string, canUpload: boolean, photo: string, position: string, palette: string[],
 *           onChange: (patch: { photo?: string, photoPosition?: string }) => void }} props
 */
export default function PhotoField({ slug, canUpload, photo, position, palette, onChange, onUploaded }) {
  const inputId = useId();
  const inputRef = useRef(null);
  const [status, setStatus] = useState(null); // { level, text }
  const [busy, setBusy] = useState(false);
  const [dragging, setDragging] = useState(false);

  const handleFile = async (file) => {
    if (!file) return;
    if (!PHOTO_SPEC.formats.includes(file.type)) {
      setStatus({ level: "error", text: "Нужен JPG, PNG или WebP" });
      return;
    }
    if (file.size > PHOTO_SPEC.maxInputMB * MB) {
      setStatus({ level: "error", text: `Файл больше ${PHOTO_SPEC.maxInputMB} МБ` });
      return;
    }
    setBusy(true);
    let bitmap = null;
    try {
      const image = await readImage(file);
      bitmap = image.bitmap;
      const { width, height } = image;
      const check = checkPhotoSize(width, height);
      if (check.level === "error") {
        setStatus(check);
        return;
      }
      setStatus({ level: "info", text: "Сжимаем и загружаем…" });
      const { blob } = await compressPhoto(bitmap);
      const usage = await getUsage().catch(() => null); // без замера не блокируем: лимит проверит и сам Supabase
      const free = usage ? getLimits().storageBytes - usage.storage_bytes : Infinity;
      if (blob.size > free) {
        setStatus({ level: "error", text: `Не хватает места: фото ${formatBytes(blob.size)}, свободно ${formatBytes(Math.max(0, free))}. Удалите старые фото или перейдите на тариф выше.` });
        return;
      }
      const url = await uploadArtistPhoto(slug, blob);
      onUploaded?.(url);
      onChange({ photo: url });
      setStatus({ ...check, text: `${check.text} Сохранено как ${Math.round(blob.size / 1024)} КБ. Не забудьте нажать «Сохранить».` });
    } catch (e) {
      setStatus({ level: "error", text: `Не удалось загрузить: ${e.message}` });
    } finally {
      bitmap?.close(); // декодированное фото 6000×4000 — это ~96 МБ памяти, освобождаем сразу
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const setFocus = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - r.left) / r.width) * 100);
    const y = Math.round(((e.clientY - r.top) / r.height) * 100);
    onChange({ photoPosition: `${x}% ${y}%` });
  };

  const [fx, fy] = position.split(" ");

  return (
    <div className="adm-photo">
      <div className="adm-photo__spec">
        <b>Какое фото подходит</b>
        <ul>
          <li>Горизонтальное, {PHOTO_SPEC.ratio.split(",")[0]}: <b>{PHOTO_SPEC.recommended.width}×{PHOTO_SPEC.recommended.height} px</b>, минимум {PHOTO_SPEC.min.width}×{PHOTO_SPEC.min.height}.</li>
          <li>Артист по центру, лицо в верхней трети кадра, вокруг запас фона: на телефоне остаётся узкая полоса по центру.</li>
          <li>JPG, PNG или WebP до {PHOTO_SPEC.maxInputMB} МБ. Сайт сам уменьшит до {PHOTO_SPEC.output.maxSide} px и сожмёт.</li>
          <li>Без текста и логотипов на фото: поверх кладётся имя артиста.</li>
        </ul>
      </div>

      <label
        htmlFor={inputId}
        className={`adm-drop ${dragging ? "is-over" : ""} ${!canUpload ? "is-disabled" : ""}`}
        onDragOver={(e) => { e.preventDefault(); if (canUpload) setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); if (canUpload) handleFile(e.dataTransfer.files[0]); }}
      >
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept={PHOTO_SPEC.formats.join(",")}
          disabled={!canUpload || busy}
          onChange={(e) => handleFile(e.target.files[0])}
        />
        {busy ? "Обрабатываем…" : canUpload ? (photo ? "Заменить фото: перетащите файл или нажмите" : "Перетащите фото или нажмите, чтобы выбрать") : "Сначала укажите имя и адрес страницы"}
      </label>
      {!status && isSpotifyImage(photo) && (
        <p className="adm-note adm-note--warning">
          Это фото взято из профиля Spotify: оно всего 640 px и на больших экранах будет мыльным.
          Загрузите своё — {PHOTO_SPEC.recommended.width}×{PHOTO_SPEC.recommended.height} px.
        </p>
      )}
      {status && <p className={`adm-note adm-note--${status.level}`} role={status.level === "error" ? "alert" : "status"}>{status.text}</p>}

      {photo && (
        <>
          <p className="adm-muted">Нажмите на фото, чтобы выбрать главное место кадра: при обрезке оно останется на виду.</p>
          <div className="adm-photo__focus" onClick={setFocus} role="presentation">
            <img src={photo} alt="Фото артиста" />
            <span className="adm-photo__dot" style={{ left: fx, top: fy }} aria-hidden="true" />
          </div>
          <div className="adm-photo__ranges">
            <label>По горизонтали <input type="range" min="0" max="100" value={parseInt(fx, 10)} onChange={(e) => onChange({ photoPosition: `${e.target.value}% ${fy}` })} /></label>
            <label>По вертикали <input type="range" min="0" max="100" value={parseInt(fy, 10)} onChange={(e) => onChange({ photoPosition: `${fx} ${e.target.value}%` })} /></label>
          </div>
          <div className="adm-crops">
            {PHOTO_CROPS.map((c) => (
              <figure key={c.key} className={`adm-crop adm-crop--${c.key}`}>
                <div className="adm-crop__frame" style={{ aspectRatio: c.ratio, "--c1": palette[0], "--c2": palette[1] }}>
                  <img src={photo} alt="" style={{ objectPosition: position }} />
                </div>
                <figcaption>{c.label}</figcaption>
              </figure>
            ))}
          </div>
          <button type="button" className="adm-link" onClick={() => onChange({ photo: "" })}>Убрать фото</button>
        </>
      )}
    </div>
  );
}
