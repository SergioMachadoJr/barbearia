"use client";
import { FormEvent, useState } from "react";
import { createBrowserClient } from "@/lib/supabase-browser";

export function ServicosManager({ initial }: { initial: { id: string; nome: string; duracao_min: number; preco: number }[] }) {
  const supabase = createBrowserClient();
  const [rows, setRows] = useState(initial);
  const [nome, setNome] = useState("");
  const [duracao, setDuracao] = useState(30);
  const [preco, setPreco] = useState(40);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const { data } = await supabase.from("servicos").insert({ nome, duracao_min: duracao, preco }).select("id,nome,duracao_min,preco").single();
    if (data) setRows((prev) => [...prev, data]);
    setNome("");
  };

  return (
    <div className="grid grid-2">
      <form className="card grid" onSubmit={handleSubmit}>
        <h3>Cadastrar serviço</h3>
        <input placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} required />
        <input type="number" value={duracao} onChange={(e) => setDuracao(Number(e.target.value))} min={10} step={5} />
        <input type="number" value={preco} onChange={(e) => setPreco(Number(e.target.value))} min={1} step={1} />
        <button className="primary" type="submit">Salvar</button>
      </form>
      <div className="card">
        <h3>Serviços</h3>
        <ul>
          {rows.map((s) => (
            <li key={s.id}>{s.nome} - {s.duracao_min}min - R$ {s.preco.toFixed(2)}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
