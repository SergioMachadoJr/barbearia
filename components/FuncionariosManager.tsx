"use client";

import { FormEvent, useState } from "react";
import { createBrowserClient } from "@/lib/supabase-browser";

export function FuncionariosManager({ initial }: { initial: { id: string; nome: string; dias_trabalho: number[]; ativo: boolean }[] }) {
  const supabase = createBrowserClient();
  const [nome, setNome] = useState("");
  const [dias, setDias] = useState<number[]>([]);
  const [rows, setRows] = useState(initial);

  const toggleDia = (dia: number) => {
    setDias((prev) => (prev.includes(dia) ? prev.filter((d) => d !== dia) : [...prev, dia]));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const { data } = await supabase
      .from("funcionarios")
      .insert({ nome, dias_trabalho: dias.sort((a, b) => a - b), ativo: true })
      .select("id,nome,dias_trabalho,ativo")
      .single();

    if (data) setRows((prev) => [...prev, data]);
    setNome("");
    setDias([]);
  };

  return (
    <div className="grid grid-2">
      <form className="card grid" onSubmit={handleSubmit}>
        <h3>Cadastrar funcionário</h3>
        <input placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} required />
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {[1, 2, 3, 4, 5, 6, 0].map((dia) => (
            <button type="button" key={dia} onClick={() => toggleDia(dia)} style={{ background: dias.includes(dia) ? "#111" : "#fff", color: dias.includes(dia) ? "#fff" : "#111" }}>
              {['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'][dia]}
            </button>
          ))}
        </div>
        <button className="primary" type="submit">Salvar</button>
      </form>

      <div className="card">
        <h3>Funcionários</h3>
        <ul>
          {rows.map((f) => (
            <li key={f.id}>{f.nome} - dias: {f.dias_trabalho.join(",")}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
