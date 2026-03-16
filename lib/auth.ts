import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase-server";

export async function requireUser() {
  const supabase = createServerClient();
  const {
    data: { session }
  } = await supabase.auth.getSession();

  if (!session?.user) {
    redirect("/login");
  }

  return session.user;
}
