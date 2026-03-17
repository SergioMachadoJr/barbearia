import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

export const createServerClient = () => createServerComponentClient({ cookies });
import { Database } from "@/types/database";

export const createServerClient = () => createServerComponentClient<Database>({ cookies });
