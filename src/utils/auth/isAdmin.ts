import { createClient } from "../supabase/client";

export async function isAdminUser() {
  const supabase = createClient();

  const { data } = await supabase.auth.getSession();
  const user = data.session?.user;

  if (!user) return false;

  // OPTION A: metadata
  if (user.user_metadata?.role === "admin") return true;

  // OPTION B: profiles table
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  return profile?.role === "admin";
}
