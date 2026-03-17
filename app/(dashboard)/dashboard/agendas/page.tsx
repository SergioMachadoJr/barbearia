import { AgendasList } from "@/components/AgendasList";
import { createServerClient } from "@/lib/supabase-server";
import { Database } from "@/types/database";

type AgendamentoResumo = Pick<
  Database["public"]["Tables"]["agendamentos"]["Row"],
  "id" | "inicio" | "status" | "cliente_id" | "funcionario_id" | "servico_id"
>;

export default async function AgendasPage() {
  const supabase = createServerClient();
  const { data } = await supabase
    .from("agendamentos")
    .select("id,inicio,status,cliente_id,funcionario_id,servico_id")
    .order("inicio", { ascending: true })
    .limit(100);

  const agendamentos: AgendamentoResumo[] = (data ?? []) as AgendamentoResumo[];

  const idsCliente = [...new Set(agendamentos.map((x) => x.cliente_id))];
  const idsFuncionario = [...new Set(agendamentos.map((x) => x.funcionario_id))];
  const idsServico = [...new Set(agendamentos.map((x) => x.servico_id))];

  const [{ data: clientes }, { data: funcionarios }, { data: servicos }] = await Promise.all([
    supabase.from("profiles").select("id,full_name").in("id", idsCliente.length ? idsCliente : [""]),
    supabase.from("funcionarios").select("id,nome").in("id", idsFuncionario.length ? idsFuncionario : [""]),
    supabase.from("servicos").select("id,nome").in("id", idsServico.length ? idsServico : [""])
  ]);

  const mapCliente = new Map((clientes ?? []).map((c) => [c.id, c.full_name]));
  const mapFunc = new Map((funcionarios ?? []).map((f) => [f.id, f.nome]));
  const mapServ = new Map((servicos ?? []).map((s) => [s.id, s.nome]));

  const items = agendamentos.map((a) => ({
    id: a.id,
    inicio: a.inicio,
    status: a.status,
    cliente_nome: mapCliente.get(a.cliente_id) ?? null,
    funcionario_nome: mapFunc.get(a.funcionario_id) ?? null,
    servico_nome: mapServ.get(a.servico_id) ?? null
  }));

  return <AgendasList items={items} />;
}
