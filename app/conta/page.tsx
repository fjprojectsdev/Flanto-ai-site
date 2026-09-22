"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import "./account.css";

type Account = { displayName: string };

export default function AccountPage() {
  const [account, setAccount] = useState<Account | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const load = () => fetch("/api/me", { cache: "no-store" }).then(r => r.ok ? r.json() : null).then(data => setAccount(data?.account || null)).catch(() => setAccount(null));
  useEffect(() => { load(); }, []);
  async function login(event: FormEvent) {
    event.preventDefault(); setMessage("Entrando…");
    const response = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
    if (response.ok) { await load(); setMessage(""); } else setMessage("E-mail ou senha inválidos.");
  }
  async function logout() { await fetch("/api/auth/logout", { method: "POST" }); setAccount(null); }
  if (!account) return <main className="account-page"><div className="account-shell"><nav><Link href="/">← FLANTO</Link></nav><header><span>MINHA CONTA</span><h1>Entre no FLANTO.</h1><p>Use o e-mail e a senha vinculados à sua conta de jogador.</p></header><form className="account-connect" onSubmit={login}><div><span>ACESSO SEGURO</span><h2>Continuar minha jornada</h2><p>Ranking, pontos e benefícios usam a mesma conta do WhatsApp.</p></div><label>E-mail<input type="email" value={email} onChange={e => setEmail(e.target.value)} required /></label><label>Senha<input type="password" minLength={8} value={password} onChange={e => setPassword(e.target.value)} required /></label><button type="submit">Entrar</button>{message && <p>{message}</p>}</form></div></main>;
  return <main className="account-page"><div className="account-shell"><nav><Link href="/">← FLANTO</Link><button onClick={logout}>Sair</button></nav><header><span>MINHA CONTA</span><h1>Olá, {account.displayName}.</h1><p>Seu perfil está conectado ao FLANTO.</p></header><section className="account-grid"><article><small>POSIÇÃO NO RANKING</small><strong>Em integração</strong><p>Seu histórico será exibido aqui.</p></article><article><small>BOOST ATIVO</small><strong>Consulte no FLANTO</strong><p>Benefícios ativos da conta.</p></article></section><section className="account-connect"><div><span>ADMINISTRAÇÃO</span><h2>Conteúdo do site</h2><p>O painel é liberado apenas para contas autorizadas.</p></div><Link href="/admin">Abrir painel</Link></section></div></main>;
}
