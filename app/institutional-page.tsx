import Link from "next/link";
import "./institutional.css";

export function InstitutionalPage({ title, lead, children }: { title: string; lead: string; children: React.ReactNode }) {
  return <main className="institutional-page"><div className="institutional-shell">
    <Link className="institutional-back" href="/">← Voltar ao FLANTO</Link>
    <h1>{title}</h1><p className="institutional-lead">{lead}</p>{children}
    <p className="institutional-date">Última atualização: 21 de setembro de 2026</p>
  </div></main>;
}

export function InfoCard({ title, children, note = false }: { title: string; children: React.ReactNode; note?: boolean }) {
  return <section className={`institutional-card${note ? " institutional-note" : ""}`}><h2>{title}</h2>{children}</section>;
}
