"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export const createBrowserClient = () => createClientComponentClient();
import { Database } from "@/types/database";

export const createBrowserClient = () => createClientComponentClient<Database>();
