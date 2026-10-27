import { useState } from "react";

/*
 * Фото артиста с честным запасным вариантом: если фото нет или оно не загрузилось,
 * показываем градиент из палитры артиста и инициалы, а не битую картинку.
 */
export function ArtistPhoto({ artist, className = "", eager = false, sizes }) {
  const [failed, setFailed] = useState(false);
  const [c1, c2] = artist.palette;
  if (!artist.photo || failed) {
    const initials = artist.name.replace(/[^\p{L}\p{N} ]/gu, "").split(" ").map((w) => w[0]).join("").slice(0, 2);
    return (
      <div className={`photo photo--fallback ${className}`} style={{ "--c1": c1, "--c2": c2 }} aria-hidden="true">
        <span>{initials}</span>
      </div>
    );
  }
  return (
    <img
      className={`photo ${className}`}
      src={artist.photo}
      style={artist.photoPosition ? { objectPosition: artist.photoPosition } : undefined}
      alt={artist.name}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      sizes={sizes}
      onError={() => setFailed(true)}
    />
  );
}

export function Cover({ src, alt = "", className = "" }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) return <div className={`cover cover--empty ${className}`} aria-hidden="true" />;
  return <img className={`cover ${className}`} src={src} alt={alt} loading="lazy" decoding="async" onError={() => setFailed(true)} />;
}
