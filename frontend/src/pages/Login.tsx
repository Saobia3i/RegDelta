import { FormEvent, useState } from "react";
import { api, setToken } from "../api";
import { Err } from "../ui";

export default function Login({ onIn }: { onIn: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setErr(null);
    setBusy(true);
    try {
      const r = await api.post<{ access_token: string }>("/v1/auth/login", { email, password });
      setToken(r.access_token);
      onIn();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Unable to sign in. Check the API and database connection.");
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="login">
      <img className="login-logo" src="/regdelta-logo.png" alt="RegDelta" />
      <p className="sub">Sign in with your assigned RegDelta account. Your role and permissions come from the account record.</p>
      <Err e={err} />
      <form className="card" onSubmit={submit} style={{ maxWidth: 460, margin: "24px auto" }}>
        <h3>Sign in</h3>
        <label className="f"><span>Email</span><input type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} /></label>
        <label className="f"><span>Password</span><input type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} /></label>
        <button className="btn primary" type="submit" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button>
      </form>
    </div>
  );
}
