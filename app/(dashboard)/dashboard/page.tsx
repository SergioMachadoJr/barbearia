import { createServerClient } from "@/lib/supabase-server";

export default async function DashboardHome() {
  const supabase = createServerClient();
  const [{ count: funcionarios }, { count: servicos }, { count: agendadosHoje }] = await Promise.all([
    supabase.from("funcionarios").select("id", { head: true, count: "exact" }).eq("ativo", true),
    supabase.from("servicos").select("id", { head: true, count: "exact" }).eq("ativo", true),
    supabase
      .from("agendamentos")
      .select("id", { head: true, count: "exact" })
      .gte("inicio", new Date().toISOString().split("T")[0])
      .lt("inicio", new Date(Date.now() + 86400000).toISOString().split("T")[0])
      .eq("status", "agendado")
  ]);

  return (
    <section className="grid grid-2">
      <article className="card"><h3>Funcionários ativos</h3><p>{funcionarios ?? 0}</p></article>
      <article className="card"><h3>Serviços ativos</h3><p>{servicos ?? 0}</p></article>
      <article className="card"><h3>Agendamentos (hoje)</h3><p>{agendadosHoje ?? 0}</p></article>
    </section>
  );
}
