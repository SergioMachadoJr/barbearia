import { FuncionariosManager } from "@/components/FuncionariosManager";
import { createServerClient } from "@/lib/supabase-server";

export default async function FuncionariosPage() {
  const supabase = createServerClient();
  const { data } = await supabase.from("funcionarios").select("id,nome,dias_trabalho,ativo").order("created_at");
  return <FuncionariosManager initial={data ?? []} />;
}
