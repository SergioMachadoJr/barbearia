"use client";

import { createBrowserClient } from "@/lib/supabase-browser";

export function SignOutButton() {
  const supabase = createBrowserClient();
  return (
    <button
      onClick={async () => {
        await supabase.auth.signOut();
        window.location.href = "/login";
      }}
    >
      Sair
    </button>
  );
}
