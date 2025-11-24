"use client";

import LiveStatusCard from "@/components/LiveStatusCard";

export default function Home() {
  return (
    <LiveStatusCard
      temperature={26.4}
      humidity={58.2}
      flame={false}
      vibration={false}
      updatedAt="2025-11-24 12:00"
    />
  );
}
