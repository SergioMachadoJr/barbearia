import { FuncionamentoManager } from "@/components/FuncionamentoManager";
import { createServerClient } from "@/lib/supabase-server";

export default async function CalendarioPage() {
  const supabase = createServerClient();
  const { data } = await supabase.from("funcionamento").select("id,dia_semana,abre,fecha,ativo").order("dia_semana");
  return <FuncionamentoManager initial={data ?? []} />;
}
