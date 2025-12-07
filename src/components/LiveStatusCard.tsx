import React, { useState } from "react";
import ThermostatIcon from "@mui/icons-material/Thermostat";
import OpacityIcon from "@mui/icons-material/Opacity";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import FallIcon from "@mui/icons-material/PersonOff";
import LightModeIcon from "@mui/icons-material/LightMode";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import CameraStream from "./CameraStream";

type Props = {
  temperature: number;
  humidity: number;
  flame: number;
  vibration: boolean;
  light: number; 
  sound: number;
  updatedAt: string;
};

export default function LiveStatusCard({
  temperature,
  humidity,
  flame,
  vibration,
  light,
  sound,
  updatedAt,
}: Props) {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const getLightLevel = (value: number): string => {
    if (value < 1024) return "Dark";
    if (value < 2048) return "Dim";
    if (value < 3072) return "Bright";
    return "Very Bright";
  };

  const getSoundLevel = (value: number): string => {
    if (value < 512) return "Silent";
    if (value < 1024) return "Quiet";
    if (value < 2048) return "Moderate";
    if (value < 3072) return "Loud";
    return "Very Loud";
  };

  const getFlameLevel = (value: number): string => {
    if (value > 100) return "Normal";
    return "Detected";
  };

  const getLEDstatus = (value: number): string => {
    if(value < 2000)return "ON";
    return "OFF";
  }

  const getBuzzerStatus = (value: number): string => {
    if(value < 100)return "ON";
    return "OFF";
  }

  const TooltipContent = ({ label }: { label: string }) => {
    const tooltips: { [key: string]: string } = {
      temperature:
        "Current room temperature in Celsius | Optimal range: 20-26°C",
      humidity: "Air moisture level | Comfortable humidity: 40-70%",
      flame:
        "Flame detection sensor (KY-026) | Alerts if fire/flame detected in area",
      vibration:
        "Vibration detection sensor (KY-002) | Detects falls or unusual movements",
      light:
        "Photo resistor (KY-018) | Monitors room brightness levels",
      sound:
        "Microphone sensor (KY-038) | Monitors ambient noise levels",
    };
    return <span className="text-xs">{tooltips[label] || ""}</span>;
  };

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat flex items-center justify-center px-3 sm:px-4 py-6 sm:py-10 animate-fadeIn"
      style={{
        backgroundImage: "url('/bg2.jpg')",
      }}
    >
      {/* Glass panel */}
      <div
        className="
        backdrop-blur-md bg-zinc-900/75 shadow-[0_8px_32px_rgba(0,0,0,0.5)]
        border border-zinc-700/40 rounded-3xl
        p-8 sm:p-10 lg:p-12 w-full max-w-7xl
        text-white animate-slideUp transition-all duration-500
      "
      >
        {/* Header */}
        <div className="mb-6 sm:mb-8 animate-slideDown">
          <p className="text-xs sm:text-base tracking-[0.3em] text-amber-100 font-medium">
            スマートケア・ダッシュボード
          </p>
          <div className="mt-2 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 sm:gap-4">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
              Smart Elderly · Live Status
            </h1>
            <div className="flex items-center gap-2 bg-emerald-950/30 border border-emerald-700/50 rounded-full px-3 sm:px-4 py-2 w-fit hover:bg-emerald-950/50 transition-all duration-300 animate-slideUp">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <p className="text-xs sm:text-sm font-medium text-zinc-300 whitespace-nowrap">
                Last Updated:{" "}
                <span className="text-emerald-100 font-semibold">
                  {updatedAt}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* GRID: Webcam Left, Sensors Right */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* LEFT: ESP32-CAM Stream takes 2 columns on desktop */}
          <CameraStream streamUrl="http://172.20.10.9/stream" />

          {/* RIGHT: Sensor cards */}
          <div className="flex flex-col gap-3 sm:gap-3 md:col-span-1">
            {/* Temperature */}
            <div
              className="bg-rose-950/40 rounded-2xl border border-rose-700/40 p-3 sm:p-4 flex justify-between items-center animate-scaleIn transition-all duration-300 hover:bg-rose-950/60 hover:border-rose-700/60 hover:shadow-md hover:shadow-rose-500/10 cursor-help group relative"
              onMouseEnter={() => setHoveredCard("temperature")}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div>
                <p className="text-xs font-semibold text-rose-200">
                  Temperature
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-rose-100 mt-1">
                  {temperature.toFixed(1)}°C
                </p>
              </div>
              <ThermostatIcon
                sx={{
                  fontSize: { xs: "1.75rem", sm: "2rem" },
                  color: "#f43f5e",
                  animation: "pulseGentle 3s ease-in-out infinite",
                }}
              />

              {/* Tooltip */}
              {hoveredCard === "temperature" && (
                <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-black/90 text-white px-3 py-2 rounded-lg whitespace-nowrap z-10 animate-fadeIn">
                  <TooltipContent label="temperature" />
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black/90"></div>
                </div>
              )}
            </div>

            {/* Humidity */}
            <div
              className="bg-emerald-950/40 rounded-2xl border border-emerald-700/40 p-3 sm:p-4 flex justify-between items-center animate-scaleIn transition-all duration-300 hover:bg-emerald-950/60 hover:border-emerald-700/60 hover:shadow-md hover:shadow-emerald-500/10 cursor-help group relative"
              style={{ animationDelay: "100ms" }}
              onMouseEnter={() => setHoveredCard("humidity")}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div>
                <p className="text-xs font-semibold text-emerald-200">
                  Humidity
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-emerald-100 mt-1">
                  {humidity.toFixed(1)}%
                </p>
              </div>
              <OpacityIcon
                sx={{
                  fontSize: { xs: "1.75rem", sm: "2rem" },
                  color: "#10b981",
                  animation: "pulseGentle 3s ease-in-out infinite",
                }}
              />

              {/* Tooltip */}
              {hoveredCard === "humidity" && (
                <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-black/90 text-white px-3 py-2 rounded-lg whitespace-nowrap z-10 animate-fadeIn">
                  <TooltipContent label="humidity" />
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black/90"></div>
                </div>
              )}
            </div>

            {/* Flame */}
            <div
              className="bg-red-950/40 rounded-2xl border border-red-700/40 p-3 sm:p-4 flex justify-between items-center animate-scaleIn transition-all duration-300 hover:bg-red-950/60 hover:border-red-700/60 hover:shadow-md hover:shadow-red-500/10 cursor-help group relative"
              style={{ animationDelay: "200ms" }}
              onMouseEnter={() => setHoveredCard("flame")}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div>
                <p className="text-xs font-semibold text-red-200">
                  Flame (KY-026)
                </p>
                <p className="text-xl sm:text-2xl font-bold text-red-100 mt-1">
                  {getFlameLevel(flame)}
                </p>
                <p className="text-xs text-yellow-300/70 mt-0.5">
                  Raw: {flame}
                </p>
              </div>
              <LocalFireDepartmentIcon
                sx={{
                  fontSize: { xs: "1.75rem", sm: "2rem" },
                  color: flame ? "#dc2626" : "#71717a",
                  animation: flame
                    ? "pulseWarning 1.5s ease-in-out infinite"
                    : "pulseGentle 3s ease-in-out infinite",
                }}
              />

              {/* Tooltip */}
              {hoveredCard === "flame" && (
                <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-black/90 text-white px-3 py-2 rounded-lg whitespace-nowrap z-10 animate-fadeIn">
                  <TooltipContent label="flame" />
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black/90"></div>
                </div>
              )}
            </div>

            {/* Vibration */}
            <div
              className="bg-amber-950/40 rounded-2xl border border-amber-700/40 p-3 sm:p-4 flex justify-between items-center animate-scaleIn transition-all duration-300 hover:bg-amber-950/60 hover:border-amber-700/60 hover:shadow-md hover:shadow-amber-500/10 cursor-help group relative"
              style={{ animationDelay: "300ms" }}
              onMouseEnter={() => setHoveredCard("vibration")}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div>
                <p className="text-xs font-semibold text-amber-200">
                  Vibration (KY-002)
                </p>
                <p className="text-xl sm:text-2xl font-bold text-amber-100 mt-1">
                  {vibration ? "Detected" : "None"}
                </p>
              </div>
              <WarningAmberIcon
                sx={{
                  fontSize: { xs: "1.75rem", sm: "2rem" },
                  color: vibration ? "#f59e0b" : "#71717a",
                  animation: vibration
                    ? "pulseWarning 1.5s ease-in-out infinite"
                    : "pulseGentle 3s ease-in-out infinite",
                }}
              />

              {/* Tooltip */}
              {hoveredCard === "vibration" && (
                <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-black/90 text-white px-3 py-2 rounded-lg whitespace-nowrap z-10 animate-fadeIn">
                  <TooltipContent label="vibration" />
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black/90"></div>
                </div>
              )}
            </div>

            {/* Light Sensor */}
            <div
              className="bg-yellow-950/40 rounded-2xl border border-yellow-700/40 p-3 sm:p-4 flex justify-between items-center animate-scaleIn transition-all duration-300 hover:bg-yellow-950/60 hover:border-yellow-700/60 hover:shadow-md hover:shadow-yellow-500/10 cursor-help group relative"
              style={{ animationDelay: "400ms" }}
              onMouseEnter={() => setHoveredCard("light")}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div>
                <p className="text-xs font-semibold text-yellow-200">
                  Light Level
                </p>
                <p className="text-xl sm:text-2xl font-bold text-yellow-100 mt-1">
                  {getLightLevel(light)}
                </p>
                <p className="text-xs text-yellow-300/70 mt-0.5">
                  Raw: {light}
                </p>
              </div>
              <LightModeIcon
                sx={{
                  fontSize: { xs: "1.75rem", sm: "2rem" },
                  color: "#eab308",
                  animation: "pulseGentle 3s ease-in-out infinite",
                }}
              />

              {/* Tooltip */}
              {hoveredCard === "light" && (
                <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-black/90 text-white px-3 py-2 rounded-lg whitespace-nowrap z-10 animate-fadeIn">
                  <TooltipContent label="light" />
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black/90"></div>
                </div>
              )}
            </div>

            {/* Sound Sensor */}
            <div
              className="bg-blue-950/40 rounded-2xl border border-blue-700/40 p-3 sm:p-4 flex justify-between items-center animate-scaleIn transition-all duration-300 hover:bg-blue-950/60 hover:border-blue-700/60 hover:shadow-md hover:shadow-blue-500/10 cursor-help group relative"
              style={{ animationDelay: "500ms" }}
              onMouseEnter={() => setHoveredCard("sound")}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div>
                <p className="text-xs font-semibold text-blue-200">
                  Sound Level
                </p>
                <p className="text-xl sm:text-2xl font-bold text-blue-100 mt-1">
                  {getSoundLevel(sound)}
                </p>
                <p className="text-xs text-blue-300/70 mt-0.5">
                  Raw: {sound}
                </p>
              </div>
              <VolumeUpIcon
                sx={{
                  fontSize: { xs: "1.75rem", sm: "2rem" },
                  color: "#3b82f6",
                  animation: "pulseGentle 3s ease-in-out infinite",
                }}
              />

              {/* Tooltip */}
              {hoveredCard === "sound" && (
                <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-black/90 text-white px-3 py-2 rounded-lg whitespace-nowrap z-10 animate-fadeIn">
                  <TooltipContent label="sound" />
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black/90"></div>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {/* LED Status */}
              <div className="bg-indigo-950/40 rounded-2xl border border-indigo-700/40 p-3 sm:p-4 flex justify-between items-center animate-scaleIn transition-all duration-300 hover:bg-indigo-950/60 hover:border-indigo-700/60 hover:shadow-md hover:shadow-indigo-500/10 cursor-help group relative"
              style={{ animationDelay: "600ms" }}>
              <div>
                <p className="text-xs font-semibold text-indigo-200">
                LED Status
                </p>
                <p className="text-xl sm:text-2xl font-bold text-indigo-100 mt-1">
                {getLEDstatus(light)}
                </p>
              </div>
              <LightModeIcon
                sx={{
                fontSize: { xs: "1.75rem", sm: "2rem" },
                color: "#6366f1",
                animation: getLEDstatus(light) === "ON" 
                  ? "pulseGentle 1.5s ease-in-out infinite" 
                  : "pulseGentle 3s ease-in-out infinite",
                }}
              />
              </div>

              {/* Buzzer Status */}
              <div className="bg-fuchsia-950/40 rounded-2xl border border-fuchsia-700/40 p-3 sm:p-4 flex justify-between items-center animate-scaleIn transition-all duration-300 hover:bg-fuchsia-950/60 hover:border-fuchsia-700/60 hover:shadow-md hover:shadow-fuchsia-500/10 cursor-help group relative"
              style={{ animationDelay: "650ms" }}>
              <div>
              <p className="text-xs font-semibold text-fuchsia-200">
              Buzzer Status
              </p>
              <p className="text-xl sm:text-2xl font-bold text-fuchsia-100 mt-1">
              {getBuzzerStatus(flame)}
              </p>
              </div>
              <VolumeUpIcon
              sx={{
                fontSize: { xs: "1.75rem", sm: "2rem" },
                color: "#d946ef",
                animation: getBuzzerStatus(sound) === "ON" 
                ? "pulseWarning 1.5s ease-in-out infinite" 
                : "pulseGentle 3s ease-in-out infinite",
              }}
              />
              </div>
            </div>

            {/* Fall Count */}
            {/* <div
              className="bg-purple-950/40 rounded-2xl border border-purple-700/40 p-3 sm:p-4 flex flex-col justify-between animate-scaleIn transition-all duration-300 hover:bg-purple-950/60 hover:border-purple-700/60 hover:shadow-md hover:shadow-purple-500/10 cursor-pointer group relative"
              style={{ animationDelay: "600ms" }}
              onClick={onViewAllFalls}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="text-xs font-semibold text-purple-200">
                    Fall Detection
                  </p>
                  <div className="flex gap-2 mt-2">
                    <div>
                      <p className="text-xs text-purple-300 font-medium">
                        Today
                      </p>
                      <p className="text-xl sm:text-2xl font-bold text-purple-100">
                        {todayFallCount}
                      </p>
                    </div>
                    <div className="border-l border-purple-700/30"></div>
                    <div className="flex-1">
                      <p className="text-xs text-purple-300 font-medium">
                        All Falls
                      </p>
                      <p className="text-xl sm:text-2xl font-bold text-purple-100">
                        {totalFallCount}
                      </p>
                    </div>
                    <div className="flex flex-col justify-end text-right">
                      <p className="text-xs text-purple-400 font-medium hover:text-purple-200 transition-colors whitespace-nowrap">
                        Click →
                      </p>
                    </div>
                  </div>
                </div>
              </div> 
            </div>*/}
          </div>
        </div>
      </div>
    </div>
  );
}
