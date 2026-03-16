"use client";

import { addMinutes, format, isBefore, parseISO } from "date-fns";
import { useMemo, useState } from "react";
import { createBrowserClient } from "@/lib/supabase-browser";

type Funcionario = { id: string; nome: string; dias_trabalho: number[] };
type Servico = { id: string; nome: string; duracao_min: number };
type Funcionamento = { dia_semana: number; abre: string; fecha: string };
type Agenda = { funcionario_id: string; inicio: string; fim: string; status: string };

export function BookingFlow({
  funcionarios,
  servicos,
  funcionamento,
  agendas
}: {
  funcionarios: Funcionario[];
  servicos: Servico[];
  funcionamento: Funcionamento[];
  agendas: Agenda[];
}) {
  const supabase = createBrowserClient();
  const [data, setData] = useState(format(new Date(), "yyyy-MM-dd"));
  const [servicoId, setServicoId] = useState(servicos[0]?.id ?? "");
  const [funcionarioId, setFuncionarioId] = useState(funcionarios[0]?.id ?? "");

  const slots = useMemo(() => {
    const servico = servicos.find((s) => s.id === servicoId);
    const funcionario = funcionarios.find((f) => f.id === funcionarioId);
    if (!servico || !funcionario) return [];

    const diaSemana = new Date(`${data}T00:00:00`).getDay();
    const regra = funcionamento.find((f) => f.dia_semana === diaSemana);
    if (!regra || !funcionario.dias_trabalho.includes(diaSemana)) return [];

    const start = parseISO(`${data}T${regra.abre}:00`);
    const end = parseISO(`${data}T${regra.fecha}:00`);
    const ocupados = agendas
      .filter((a) => a.funcionario_id === funcionario.id && a.status === "agendado" && a.inicio.startsWith(data))
      .map((a) => ({ inicio: parseISO(a.inicio), fim: parseISO(a.fim) }));

    const lista: string[] = [];
    let ponteiro = start;
    while (isBefore(addMinutes(ponteiro, servico.duracao_min), end) || +addMinutes(ponteiro, servico.duracao_min) === +end) {
      const fim = addMinutes(ponteiro, servico.duracao_min);
      const conflita = ocupados.some((o) => ponteiro < o.fim && fim > o.inicio);
      if (!conflita && !isBefore(ponteiro, new Date())) {
        lista.push(ponteiro.toISOString());
      }
      ponteiro = addMinutes(ponteiro, 30);
    }

    return lista;
  }, [agendas, data, funcionarioId, funcionarios, funcionamento, servicoId, servicos]);

  const reservar = async (inicioIso: string) => {
    const servico = servicos.find((s) => s.id === servicoId);
    if (!servico) return;

    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Faça login para reservar.");
      window.location.href = "/login";
      return;
    }

    const fim = addMinutes(parseISO(inicioIso), servico.duracao_min).toISOString();
    const { error } = await supabase.from("agendamentos").insert({
      cliente_id: user.id,
      funcionario_id: funcionarioId,
      servico_id: servicoId,
      inicio: inicioIso,
      fim,
      status: "agendado"
    });

    if (error) {
      alert(error.message);
      return;
    }

    alert("Agendamento realizado com sucesso!");
    window.location.reload();
  };

  return (
    <div className="grid">
      <div className="card grid grid-2">
        <div className="grid">
          <label>Data</label>
          <input type="date" value={data} onChange={(e) => setData(e.target.value)} />
        </div>
        <div className="grid">
          <label>Serviço</label>
          <select value={servicoId} onChange={(e) => setServicoId(e.target.value)}>
            {servicos.map((s) => (
              <option key={s.id} value={s.id}>{s.nome}</option>
            ))}
          </select>
        </div>
        <div className="grid">
          <label>Funcionário</label>
          <select value={funcionarioId} onChange={(e) => setFuncionarioId(e.target.value)}>
            {funcionarios.map((f) => (
              <option key={f.id} value={f.id}>{f.nome}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="card">
        <h3>Horários disponíveis</h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {slots.length === 0 && <p>Sem horários disponíveis nessa seleção.</p>}
          {slots.map((slot) => (
            <button key={slot} onClick={() => reservar(slot)}>
              {new Date(slot).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
