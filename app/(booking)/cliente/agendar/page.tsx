import Link from "next/link";
import { BookingFlow } from "@/components/BookingFlow";
import { createServerClient } from "@/lib/supabase-server";

export default async function ClienteAgendarPage() {
  const supabase = createServerClient();
  const [{ data: funcionarios }, { data: servicos }, { data: funcionamento }, { data: agendas }] = await Promise.all([
    supabase.from("funcionarios").select("id,nome,dias_trabalho").eq("ativo", true),
    supabase.from("servicos").select("id,nome,duracao_min").eq("ativo", true),
    supabase.from("funcionamento").select("dia_semana,abre,fecha").eq("ativo", true),
    supabase.from("agendamentos").select("funcionario_id,inicio,fim,status").eq("status", "agendado")
  ]);

  return (
    <main className="container grid">
      <div className="card">
        <h2>Agendamento do Cliente</h2>
        <p>Escolha serviço, profissional e horário disponível conforme escala do funcionário.</p>
        <Link href="/login">Entrar / cadastrar</Link>
      </div>
      <BookingFlow
        funcionarios={funcionarios ?? []}
        servicos={servicos ?? []}
        funcionamento={funcionamento ?? []}
        agendas={agendas ?? []}
      />
    </main>
  );
}
