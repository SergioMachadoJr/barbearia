"use client";
import { FormEvent, useState } from "react";
import { createBrowserClient } from "@/lib/supabase-browser";

type Linha = { id: string; dia_semana: number; abre: string; fecha: string; ativo: boolean };

export function FuncionamentoManager({ initial }: { initial: Linha[] }) {
  const supabase = createBrowserClient();
  const [rows, setRows] = useState(initial);
  const [dia, setDia] = useState(1);
  const [abre, setAbre] = useState("09:00");
  const [fecha, setFecha] = useState("19:00");

  const onSave = async (e: FormEvent) => {
    e.preventDefault();
    const { data } = await supabase.from("funcionamento").upsert({ dia_semana: dia, abre, fecha, ativo: true }, { onConflict: "dia_semana" }).select("id,dia_semana,abre,fecha,ativo");
    if (data?.[0]) {
      setRows((prev) => [...prev.filter((x) => x.dia_semana !== data[0].dia_semana), data[0]].sort((a, b) => a.dia_semana - b.dia_semana));
    }
  };

  return (
    <div className="grid grid-2">
      <form className="card grid" onSubmit={onSave}>
        <h3>Calendário de funcionamento</h3>
        <select value={dia} onChange={(e) => setDia(Number(e.target.value))}>
          {[0,1,2,3,4,5,6].map((d)=><option value={d} key={d}>{['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'][d]}</option>)}
        </select>
        <input type="time" value={abre} onChange={(e)=>setAbre(e.target.value)} required />
        <input type="time" value={fecha} onChange={(e)=>setFecha(e.target.value)} required />
        <button className="primary" type="submit">Salvar dia</button>
      </form>
      <div className="card"><h3>Horários atuais</h3><ul>{rows.map((r)=><li key={r.id}>{['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'][r.dia_semana]}: {r.abre} - {r.fecha}</li>)}</ul></div>
    </div>
  );
}
