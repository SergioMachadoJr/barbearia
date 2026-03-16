import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { SignOutButton } from "@/components/SignOutButton";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();

  return (
    <main className="container">
      <header className="card" style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <div>
            <h2 style={{ margin: 0 }}>Painel da Barbearia</h2>
            <small>{user.email}</small>
          </div>
          <SignOutButton />
        </div>
        <nav style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link href="/dashboard">Visão geral</Link>
          <Link href="/dashboard/funcionarios">Funcionários</Link>
          <Link href="/dashboard/servicos">Serviços</Link>
          <Link href="/dashboard/calendario">Calendário</Link>
          <Link href="/dashboard/agendas">Agendas</Link>
        </nav>
      </header>
      {children}
    </main>
  );
}
