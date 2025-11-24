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

interface LiveStatusRecord {
  id: string;
  temperature: number;
  humidity: number;
  updated_at: string;
}

interface LiveStatusPayload {
  new: LiveStatusRecord;
}

export function subscribeToLiveStatus(
  callback: (data: LiveStatusRecord) => void
): ReturnType<typeof supabase.channel> {
  return supabase
    .channel("live_status")
    .on(
      "postgres_changes" as any,
      { event: "*", schema: "public", table: "live_status" },
      (payload: LiveStatusPayload) => {
        if (payload.new) {
          callback(payload.new);
        }
      }
    )
    .subscribe();
}
