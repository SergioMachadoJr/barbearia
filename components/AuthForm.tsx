"use client";

import { FormEvent, useState } from "react";
import { createBrowserClient } from "@/lib/supabase-browser";

export function AuthForm() {
  const supabase = createBrowserClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleEmailLogin = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return setMessage(error.message);
    window.location.href = "/dashboard";
  };

  const handleEmailRegister = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (error) return setMessage(error.message);
    setMessage("Conta criada. Confira seu email para confirmar.");
  };

  const handleGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/dashboard` }
    });
    if (error) setMessage(error.message);
  };

  return (
    <div className="card" style={{ maxWidth: 420, margin: "0 auto" }}>
      <h2>Entrar na Barbearia Pro</h2>
      <form onSubmit={handleEmailLogin} className="grid">
        <input type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button className="primary" type="submit" disabled={loading}>Entrar com e-mail</button>
      </form>
      <div style={{ display: "grid", marginTop: 10, gap: 8 }}>
        <button onClick={handleEmailRegister} disabled={loading}>Criar conta</button>
        <button onClick={handleGoogle} disabled={loading}>Entrar com Google</button>
      </div>
      {message && <p style={{ marginTop: 10 }}>{message}</p>}
    </div>
  );
}
