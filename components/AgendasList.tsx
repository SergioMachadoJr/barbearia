export function AgendasList({ items }: { items: { id: string; inicio: string; status: string; cliente_nome: string | null; funcionario_nome: string | null; servico_nome: string | null }[] }) {
  return (
    <div className="card">
      <h3>Agenda</h3>
      <ul>
        {items.map((a) => (
          <li key={a.id}>
            {new Date(a.inicio).toLocaleString("pt-BR")} - {a.servico_nome} com {a.funcionario_nome} ({a.cliente_nome ?? "Cliente"}) - {a.status}
          </li>
        ))}
      </ul>
    </div>
  );
}
