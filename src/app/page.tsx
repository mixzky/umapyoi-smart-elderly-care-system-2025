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
        <div className="backdrop-blur-md bg-zinc-900/75 shadow-[0_8px_32px_rgba(0,0,0,0.5)] border border-zinc-700/40 rounded-3xl p-8 sm:p-10 lg:p-12 w-full max-w-2xl text-white text-center animate-fadeIn">
          <div className="mb-6 animate-slideDown">
            <p className="text-xs sm:text-base tracking-[0.3em] text-amber-100 font-medium">
              スマートケア・ダッシュボード
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mt-3">
              Smart Elderly · Live Status
            </h1>
          </div>

          {/* Loading spinner */}
          <div className="flex justify-center items-center gap-4 my-10">
            <div className="w-3 h-3 bg-amber-400 rounded-full animate-pulse"></div>
            <div
              className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"
              style={{ animationDelay: "0.2s" }}
            ></div>
            <div
              className="w-3 h-3 bg-rose-400 rounded-full animate-pulse"
              style={{ animationDelay: "0.4s" }}
            ></div>
          </div>

          <p className="text-base sm:text-lg text-zinc-300 animate-slideUp">
            Loading live status from sensors...
          </p>
          <p className="text-xs sm:text-sm text-zinc-500 mt-3">
            Please wait while we connect to your devices
          </p>
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
