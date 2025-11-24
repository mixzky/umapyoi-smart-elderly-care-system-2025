"use client";

import { useEffect, useState } from "react";
import LiveStatusCard from "@/components/LiveStatusCard";
import { getLatestLiveStatus } from "@/lib/supabase";

interface LiveStatus {
  id: number;
  temperature: number;
  humidity: number;
  flame?: boolean;
  vibration?: boolean;
  updated_at: string;
}

export default function Home() {
  const [status, setStatus] = useState<LiveStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      setLoading(true);
      const data = await getLatestLiveStatus();
      if (data) {
        setStatus(data);
      }
      setLoading(false);
    };

    fetchStatus();

    // Fetch new data every 5 seconds
    const interval = setInterval(fetchStatus, 5000);

    return () => clearInterval(interval);
  }, []);

  if (loading || !status) {
    return (
      <div
        className="min-h-screen w-full bg-cover bg-center bg-no-repeat flex items-center justify-center px-3 sm:px-4 py-6 sm:py-10"
        style={{ backgroundImage: "url('/bg2.jpg')" }}
      >
        <div className="backdrop-blur-md bg-zinc-900/75 shadow-[0_8px_32px_rgba(0,0,0,0.5)] border border-zinc-700/40 rounded-3xl p-8 sm:p-10 lg:p-12 w-full max-w-7xl text-white text-center">
          <p className="text-lg sm:text-xl">Loading live status...</p>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(status.updated_at).toLocaleString();

  return (
    <LiveStatusCard
      temperature={status.temperature}
      humidity={status.humidity}
      flame={status.flame ?? false}
      vibration={status.vibration ?? false}
      updatedAt={formattedDate}
    />
  );
}
