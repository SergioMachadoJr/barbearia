import { ServicosManager } from "@/components/ServicosManager";
import { createServerClient } from "@/lib/supabase-server";

export default async function ServicosPage() {
  const supabase = createServerClient();
  const { data } = await supabase.from("servicos").select("id,nome,duracao_min,preco").order("created_at");
  return <ServicosManager initial={data ?? []} />;
}
