import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main className="notfound wrap">
      <h1 className="h-xl">404</h1>
      <p>Такой страницы нет. Возможно, артист сменил адрес или ссылка устарела.</p>
      <Link className="btn btn--accent" to="/artists">Все артисты</Link>
    </main>
  );
}
