import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://nttrpmomodfooqhogusn.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseAnonKey) {
  console.warn(
    "Warning: NEXT_PUBLIC_SUPABASE_ANON_KEY is not set in environment variables"
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey || "");

export async function getLatestLiveStatus() {
  try {
    const { data, error } = await supabase
      .from("live_status")
      .select("id, temperature, humidity, updated_at")
      .order("updated_at", { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error("Error fetching live status:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Unexpected error fetching live status:", error);
    return null;
  }
}

export async function subscribeToLiveStatus(callback: (data: any) => void) {
  return supabase
    .from("live_status")
    .on("*", (payload) => {
      callback(payload.new);
    })
    .subscribe();
}
