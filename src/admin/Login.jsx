import { useState } from "react";
import { signIn } from "./api";
import { LogoMark } from "../components/Logo";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await signIn(email.trim(), password);
    } catch {
      setError("Неверная почта или пароль");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="adm-login" onSubmit={submit}>
      <LogoMark className="adm-login__mark" />
      <div>
        <h1>Вход</h1>
        <p className="a-muted">Админка сайта Rhymes Music</p>
      </div>
      <label className="adm-field">
        <span>Почта</span>
        <input type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>
      <label className="adm-field">
        <span>Пароль</span>
        <input type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
      </label>
      {error && <p className="adm-error" role="alert">{error}</p>}
      <button className="adm-btn adm-btn--primary" disabled={busy}>{busy ? "Входим…" : "Войти"}</button>
    </form>
  );
}
