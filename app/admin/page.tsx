"use client";
import { useEffect, useState } from "react";
import AdminPanel from "./panel";
import "./admin.css";

export const dynamic = "force-dynamic";

export default function AdminPage() {
  const [account, setAccount] = useState<{ displayName: string } | null>(null);
  useEffect(() => { fetch("/api/me", { cache: "no-store" }).then(r => r.ok ? r.json() : null).then(data => setAccount(data?.account || null)).catch(() => setAccount(null)); }, []);
  if (!account) return <main className="admin-denied"><h1>Acesso restrito</h1><p>Entre com sua conta FLANTO para abrir o painel.</p><a href="/conta">Entrar</a></main>;
  return <AdminPanel user={{ name: account.displayName, email: "Conta FLANTO" }} signOutPath="/conta" />;
}
