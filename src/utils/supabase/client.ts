import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { projectId, publicAnonKey } from "./info";

export const createClient = () =>
  createSupabaseClient(
    `https://${projectId}.supabase.co`,
    publicAnonKey
  );
