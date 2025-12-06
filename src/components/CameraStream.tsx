"use client";

import React, { useState, useEffect } from "react";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import RefreshIcon from "@mui/icons-material/Refresh";

type Props = {
  streamUrl?: string;
};

export default function CameraStream({
  streamUrl = "http://172.20.10.3/stream",
}: Props) {
  const [isConnected, setIsConnected] = useState(true);
  const [imageKey, setImageKey] = useState(0);

  const handleRefresh = () => {
    setImageKey((prev) => prev + 1);
  };

  const handleImageError = () => {
    setIsConnected(false);
  };

  const handleImageLoad = () => {
    setIsConnected(true);
  };

  return (
    <div className="md:col-span-2 bg-zinc-800/40 backdrop-blur-md border border-zinc-700/30 rounded-2xl p-4 flex flex-col animate-fadeIn transition-all duration-300 hover:bg-zinc-800/60 hover:shadow-md">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {isConnected ? (
            <VideocamIcon
              sx={{
                fontSize: "1.25rem",
                color: "#10b981",
                animation: "pulseGentle 2s ease-in-out infinite",
              }}
            />
          ) : (
            <VideocamOffIcon
              sx={{ fontSize: "1.25rem", color: "#ef4444" }}
            />
          )}
          <p className="text-base sm:text-lg font-semibold text-amber-50">
            ESP32-CAM Live Stream
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
              isConnected
                ? "bg-emerald-950/40 border border-emerald-700/50 text-emerald-200"
                : "bg-red-950/40 border border-red-700/50 text-red-200"
            }`}
          >
            <div
              className={`w-2 h-2 rounded-full ${
                isConnected
                  ? "bg-emerald-500 animate-pulse"
                  : "bg-red-500"
              }`}
            ></div>
            {isConnected ? "Connected" : "Disconnected"}
          </div>

          <button
            onClick={handleRefresh}
            className="bg-zinc-700/50 hover:bg-zinc-600/50 border border-zinc-600/50 text-zinc-200 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 flex items-center gap-1.5 hover:shadow-md"
            title="Refresh stream"
          >
            <RefreshIcon sx={{ fontSize: "1rem" }} />
            Refresh
          </button>
        </div>
      </div>

      {/* Camera Stream */}
      <div className="flex-1 rounded-xl bg-black/40 border border-white/10 overflow-hidden relative min-h-[300px] sm:min-h-[400px] md:min-h-[500px]">
        {isConnected ? (
          <img
            key={imageKey}
            src={`${streamUrl}?t=${imageKey}`}
            alt="ESP32-CAM Live Stream"
            className="w-full h-full object-contain transition-opacity duration-300"
            onError={handleImageError}
            onLoad={handleImageLoad}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-center p-6">
            <VideocamOffIcon
              sx={{
                fontSize: "4rem",
                color: "#ef4444",
                marginBottom: "1rem",
              }}
            />
            <p className="text-red-200 font-semibold text-lg mb-2">
              Camera Disconnected
            </p>
            <p className="text-zinc-400 text-sm mb-4">
              Unable to connect to ESP32-CAM at {streamUrl}
            </p>
            <button
              onClick={handleRefresh}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2"
            >
              <RefreshIcon sx={{ fontSize: "1rem" }} />
              Retry Connection
            </button>
          </div>
        )}
      </div>

      {/* Stream Info */}
      <div className="mt-3 flex items-center justify-between text-xs text-zinc-400">
        <span>Stream URL: {streamUrl}</span>
        <span>MJPEG Stream</span>
      </div>
    </div>
  );
}
