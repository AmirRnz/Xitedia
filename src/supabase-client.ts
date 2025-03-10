import { createClient } from "@supabase/supabase-js";

const supabaseURL = "https://ppcikmsssrfmwqriixfm.supabase.co";
const supabaseAnonKEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
if (!supabaseAnonKEY) {
  console.log("supabaseanonkey missing");
}
export const supabase = createClient(supabaseURL, supabaseAnonKEY);
