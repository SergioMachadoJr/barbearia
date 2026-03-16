import Link from "next/link";

export default function HomePage() {
  return (
    <main className="container">
      <div className="card">
        <h1>Barbearia Pro</h1>
        <p>
          MVP com autenticação por Google/e-mail, gestão da loja e autoagendamento para clientes.
        </p>
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <Link className="primary" href="/login" style={{ padding: ".7rem 1rem", borderRadius: 8, background: "#111", color: "#fff" }}>
            Entrar
          </Link>
          <Link href="/cliente/agendar" style={{ padding: ".7rem 1rem", borderRadius: 8, background: "#fff", border: "1px solid #ddd" }}>
            Área do Cliente
          </Link>
        </div>
      </div>
    </main>
  );
}
