import { Component } from "react";

/**
 * Ловит ошибки рендера и загрузки данных (useQuery пробрасывает их сюда),
 * чтобы падение одного блока не превращалось в белый экран всего сайта.
 * resetKey — при его смене (переход на другую страницу) граница сбрасывается.
 */
export default class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidUpdate(prev) {
    if (prev.resetKey !== this.props.resetKey && this.state.error) this.setState({ error: null });
  }

  componentDidCatch(error, info) {
    console.error("[ErrorBoundary]", error, info?.componentStack);
  }

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;
    if (this.props.fallback) return this.props.fallback({ error, retry: () => this.setState({ error: null }) });
    return (
      <main className="page wrap error-page" role="alert">
        <h1 className="h-lg">Что-то пошло не так</h1>
        <p className="section__lead">
          Не удалось показать страницу. Обычно помогает обновить её; если не поможет — напишите нам на office@rhymesmusic.com.
        </p>
        <button className="btn btn--accent" onClick={() => window.location.reload()}>Обновить страницу</button>
      </main>
    );
  }
}
