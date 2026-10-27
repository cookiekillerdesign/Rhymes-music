import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { BIO_RECOMMENDED, artistToForm, formToArtist, slugify, validateArtist } from "./fields";
import { createArtist, deleteArtist, deleteArtistFolder, deletePhotos, getArtist, listArtists, syncArtist, updateArtist } from "./api";
import PhotoField from "./PhotoField";
import { useUnsavedChanges } from "./useUnsavedChanges";
import SocialsField from "./SocialsField";

const SOURCE_LABELS = { spotify: "Spotify", deezer: "Deezer", youtube: "YouTube", wikipedia: "Википедия" };

const syncSummary = (r) =>
  `Синхронизация: релизов +${r.releases}, треков +${r.tracks}, клипов +${r.videos}, концертов на модерацию +${r.concertsForReview}` +
  (r.errors?.length ? `. Замечания: ${r.errors.join("; ")}` : "");

/** Создание (/admin/artists/new) и редактирование (/admin/artists/:slug) профиля артиста */
export default function ArtistEditor({ embedded = false, onSaved: notifySaved }) {
  const { slug } = useParams();
  const isNew = !slug;
  const navigate = useNavigate();
  const location = useLocation();

  const [original, setOriginal] = useState(null);
  const [form, setForm] = useState(() => artistToForm(null));
  const [takenSlugs, setTakenSlugs] = useState(new Set());
  const [slugTouched, setSlugTouched] = useState(false);
  const [errors, setErrors] = useState({});
  const [state, setState] = useState({ loading: !isNew, saving: false, message: location.state?.flash ?? null });
  // Фото, загруженные в этой сессии редактирования: несохранённые удаляем, чтобы не копились в Storage
  const uploads = useRef(new Set());

  const reload = useCallback(async () => {
    const row = await getArtist(slug);
    setOriginal(row);
    if (row) setForm(artistToForm(row));
    return row;
  }, [slug]);

  useEffect(() => {
    listArtists().then((rows) => setTakenSlugs(new Set(rows.map((r) => r.slug))), () => {});
    if (isNew) return;
    reload().then(
      () => setState((s) => ({ ...s, loading: false })),
      (e) => setState({ loading: false, saving: false, message: { level: "error", text: e.message } })
    );
  }, [isNew, reload]);

  // Удаляем загруженные, но так и не сохранённые фото, когда уходим со страницы
  useEffect(() => () => { deletePhotos([...uploads.current]); }, []);

  const runSync = useCallback(async (prefix) => {
    setState((s) => ({ ...s, saving: true, message: { level: "info", text: `${prefix} Запускаем синхронизацию…` } }));
    try {
      const result = await syncArtist(slug);
      await reload(); // синхронизация могла найти Spotify, фото, био — показываем их сразу
      setState({ loading: false, saving: false, message: { level: "ok", text: `${prefix} ${syncSummary(result)}` } });
    } catch (e) {
      // Артист уже сохранён: ошибка синхронизации не должна выглядеть как ошибка сохранения
      setState({ loading: false, saving: false, message: { level: "warning", text: `${prefix} Синхронизация не прошла: ${e.message}. Можно запустить ещё раз.` } });
    }
  }, [slug, reload]);

  // Создали с «заполнить автоматически»: синхронизация запускается уже на странице артиста
  useEffect(() => {
    if (!isNew && !state.loading && location.state?.syncAfterCreate) {
      navigate(location.pathname, { replace: true, state: null });
      runSync("Артист создан.");
    }
  }, [isNew, state.loading, location, navigate, runSync]);

  const set = (patch) => setForm((f) => ({ ...f, ...patch }));
  const onName = (name) => set(isNew && !slugTouched ? { name, slug: slugify(name) } : { name });

  const dirty = useMemo(() => JSON.stringify(form) !== JSON.stringify(artistToForm(original)), [form, original]);
  useUnsavedChanges(dirty && !state.saving);

  const save = async ({ thenSync = false } = {}) => {
    const found = validateArtist(form, { isNew, takenSlugs });
    setErrors(found);
    if (Object.keys(found).length) {
      setState((s) => ({ ...s, message: { level: "error", text: "Проверьте поля, отмеченные красным" } }));
      return;
    }
    setState((s) => ({ ...s, saving: true, message: null }));
    let saved;
    try {
      const row = formToArtist(form, original);
      saved = isNew ? await createArtist(row) : await updateArtist(slug, row);
    } catch (e) {
      setState({ loading: false, saving: false, message: { level: "error", text: e.message } });
      return;
    }

    // Старое фото и загруженные, но не выбранные — из Storage удаляем
    const stale = [...uploads.current, original?.photo].filter((u) => u && u !== saved.photo);
    uploads.current.clear();
    deletePhotos(stale);

    if (isNew) {
      // Сразу уходим на адрес артиста: повторное нажатие «Создать» больше невозможно
      navigate(`/admin/artists/${saved.slug}`, {
        replace: true,
        state: thenSync ? { syncAfterCreate: true } : { flash: { level: "ok", text: "Артист создан" } }
      });
      return;
    }
    setOriginal(saved);
    setForm(artistToForm(saved));
    notifySaved?.();
    if (thenSync) await runSync("Сохранено.");
    else setState({ loading: false, saving: false, message: { level: "ok", text: "Сохранено" } });
  };

  const remove = async () => {
    const answer = window.prompt(`Удалить артиста вместе с релизами, треками, клипами и фото? Это нельзя отменить.\nВведите адрес страницы «${slug}», чтобы подтвердить.`);
    if (answer !== slug) return;
    try {
      await deleteArtist(slug);
      await deleteArtistFolder(slug);
      navigate("/admin/artists", { replace: true });
    } catch (e) {
      setState((s) => ({ ...s, message: { level: "error", text: e.message } }));
    }
  };

  if (state.loading) return <p className="adm-muted">Загружаем…</p>;
  if (!isNew && !original) return <p className="adm-error">Артист не найден. <Link to="/admin">К списку</Link></p>;

  const autoFound = Object.entries(original?.resolved ?? {}).filter(([, r]) => r.status === "auto");
  const twinsOf = (source, input) => {
    const r = original?.resolved?.[source];
    return !input && r?.status === "ambiguous" ? r.candidates ?? [] : [];
  };
  const spotifyTwins = twinsOf("spotify", form.spotifyInput);
  const deezerTwins = twinsOf("deezer", form.deezerInput);
  const slugValid = !validateArtist({ ...form, name: form.name || "x" }, { isNew, takenSlugs }).slug;

  return (
    <form className="adm-editor" onSubmit={(e) => { e.preventDefault(); save(); }} noValidate>
      {!embedded && (
        <div className="adm-head">
          <div>
            <Link to="/admin/artists" className="adm-link">← Все артисты</Link>
            <h1>{isNew ? "Новый артист" : form.name || slug}</h1>
          </div>
          {!isNew && !original.hidden && <a className="adm-link" href={`/artist/${slug}`} target="_blank" rel="noopener noreferrer">Страница на сайте ↗</a>}
        </div>
      )}

      <Section title="Основное">
        <Field label="Имя артиста" error={errors.name}>
          <input required value={form.name} onChange={(e) => onName(e.target.value)} />
        </Field>
        <Field label="Адрес страницы" hint={`rhymesmusic…/artist/${form.slug || "…"}${isNew ? "" : " — после создания не меняется"}`} error={errors.slug}>
          <input value={form.slug} disabled={!isNew} onChange={(e) => { setSlugTouched(true); set({ slug: e.target.value.toLowerCase() }); }} />
        </Field>
        <Field label="Подпись под именем" hint="Коротко: жанр или образ, например «Кьют-рок принцесса»">
          <input value={form.tagline} maxLength={80} onChange={(e) => set({ tagline: e.target.value })} />
        </Field>
        <Field label="Об артисте" hint={`${form.bio.length} / ~${BIO_RECOMMENDED} знаков. Пусто — подтянется из Википедии, если там есть статья`}>
          <textarea rows={6} value={form.bio} onChange={(e) => set({ bio: e.target.value })} />
        </Field>
      </Section>

      <Section title="Фото">
        <PhotoField
          slug={form.slug}
          canUpload={slugValid && Boolean(form.name.trim())}
          photo={form.photo}
          position={form.photoPosition}
          palette={form.palette}
          onChange={(patch) => set(patch)}
          onUploaded={(url) => uploads.current.add(url)}
        />
      </Section>

      <Section title="Цвета страницы" hint="Свечение и заглушки в цветах артиста">
        <div className="adm-palette">
          {form.palette.map((c, i) => (
            <label key={i} className="adm-palette__item">
              <input type="color" value={c} onChange={(e) => set({ palette: form.palette.map((x, k) => (k === i ? e.target.value : x)) })} />
              <span>{c}</span>
            </label>
          ))}
          <span className="adm-palette__preview" style={{ "--c1": form.palette[0], "--c2": form.palette[1], "--c3": form.palette[2] }} aria-hidden="true" />
        </div>
        {errors.palette && <p className="adm-error">{errors.palette}</p>}
      </Section>

      <Section title="Соцсети">
        <SocialsField value={form.socials} onChange={(socials) => set({ socials })} error={errors.socials} />
      </Section>

      <Section title="Автообновление" hint="Релизы, популярное, клипы и концерты подтягиваются сами каждые 6 часов">
        <label className="adm-check">
          <input type="checkbox" checked={form.autoSync} onChange={(e) => set({ autoSync: e.target.checked })} />
          Обновлять страницу автоматически
        </label>
        <Field label="Spotify" hint="Ссылка на артиста: open.spotify.com/artist/… Пусто — найдём по имени" error={errors.spotifyInput}>
          <input value={form.spotifyInput} onChange={(e) => set({ spotifyInput: e.target.value })} placeholder="https://open.spotify.com/artist/…" />
        </Field>
        <Field label="Deezer" hint="Ссылка deezer.com/artist/… Отсюда берутся обложки, точные даты и популярность треков. Пусто — найдём по имени" error={errors.deezerInput}>
          <input value={form.deezerInput} onChange={(e) => set({ deezerInput: e.target.value })} placeholder="https://www.deezer.com/artist/…" />
        </Field>
        <Field label="YouTube-канал" hint="Ссылка вида youtube.com/channel/UC… Пусто — найдём по имени" error={errors.youtubeInput}>
          <input value={form.youtubeInput} onChange={(e) => set({ youtubeInput: e.target.value })} placeholder="https://www.youtube.com/channel/UC…" />
        </Field>
        <Field label="Страницы с концертами" hint="По одной ссылке на строку: сайт артиста, страница на билетном сервисе" error={errors.tourSources}>
          <textarea rows={3} value={form.tourSources} onChange={(e) => set({ tourSources: e.target.value })} placeholder="https://…" />
        </Field>
        <Field label="Имя на Bandsintown" hint="Необязательно">
          <input value={form.bandsintownName} onChange={(e) => set({ bandsintownName: e.target.value })} />
        </Field>
        {spotifyTwins.length > 0 && (
          <div className="adm-note adm-note--warning">
            <p>В Spotify несколько артистов с именем «{form.name}». Откройте ссылки и выберите нужного:</p>
            <ul className="adm-twins">
              {spotifyTwins.map((c) => (
                <li key={c.id}>
                  <a href={`https://open.spotify.com/artist/${c.id}`} target="_blank" rel="noopener noreferrer">{c.name} · {c.id}</a>
                  <button type="button" className="adm-btn" onClick={() => set({ spotifyInput: c.id })}>Это он</button>
                </li>
              ))}
            </ul>
          </div>
        )}
        {deezerTwins.length > 0 && (
          <div className="adm-note adm-note--warning">
            <p>В Deezer несколько артистов с именем «{form.name}». Откройте ссылки и выберите нужного:</p>
            <ul className="adm-twins">
              {deezerTwins.map((c) => (
                <li key={c.id}>
                  <a href={`https://www.deezer.com/artist/${c.id}`} target="_blank" rel="noopener noreferrer">{c.name} · {c.id}</a>
                  <button type="button" className="adm-btn" onClick={() => set({ deezerInput: c.id })}>Это он</button>
                </li>
              ))}
            </ul>
          </div>
        )}
        {autoFound.length > 0 && (
          <p className="adm-note adm-note--info">
            Найдено автоматически: {autoFound.map(([k]) => SOURCE_LABELS[k] ?? k).join(", ")}. Проверьте, что это нужный артист; если нет — вставьте правильную ссылку.
          </p>
        )}
      </Section>

      <Section title="Публикация">
        <label className="adm-check">
          <input type="checkbox" checked={form.published} onChange={(e) => set({ published: e.target.checked })} />
          Показывать на сайте
        </label>
        <Field label="Порядок в списке" hint="Меньше — выше">
          <input type="number" value={form.sort} onChange={(e) => set({ sort: e.target.value })} className="adm-input--short" />
        </Field>
      </Section>

      <div className="adm-actions">
        {state.message && <p className={`adm-note adm-note--${state.message.level}`} role={state.message.level === "error" ? "alert" : "status"}>{state.message.text}</p>}
        <div className="adm-actions__row">
          <button type="submit" className="adm-btn adm-btn--primary" disabled={state.saving}>{state.saving ? "Сохраняем…" : isNew ? "Создать" : "Сохранить"}</button>
          <button type="button" className="adm-btn" disabled={state.saving} onClick={() => save({ thenSync: true })}>
            {isNew ? "Создать и заполнить автоматически" : "Сохранить и обновить данные"}
          </button>
          {!isNew && <button type="button" className="adm-btn adm-btn--danger" onClick={remove}>Удалить</button>}
          {dirty && !state.saving && <span className="adm-muted">Есть несохранённые изменения</span>}
        </div>
      </div>
    </form>
  );
}

function Section({ title, hint, children }) {
  return (
    <fieldset className="adm-section">
      <legend>{title}</legend>
      {hint && <p className="adm-muted adm-section__hint">{hint}</p>}
      {children}
    </fieldset>
  );
}

function Field({ label, hint, error, children }) {
  return (
    <label className={`adm-field ${error ? "has-error" : ""}`}>
      <span>{label}</span>
      {children}
      {hint && <small className="adm-muted">{hint}</small>}
      {error && <small className="adm-error">{error}</small>}
    </label>
  );
}
