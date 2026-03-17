import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Barbearia Pro",
  description: "Sistema completo de gestão e agendamento para barbearia"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
