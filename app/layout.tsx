import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FLANTO AI — A AI de jogos para comunidades",
  description: "Jogos, ranking, moderação e automações para manter sua comunidade ativa 24 horas dentro do WhatsApp.",
  icons: { icon: "/favicon.png", shortcut: "/favicon.png" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body>{children}</body></html>;
}
