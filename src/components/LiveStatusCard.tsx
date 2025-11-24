import React, { useState } from "react";
import ThermostatIcon from "@mui/icons-material/Thermostat";
import OpacityIcon from "@mui/icons-material/Opacity";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

type Props = {
  temperature: number;
  humidity: number;
  flame: boolean;
  vibration: boolean;
  updatedAt: string;
};

export default function LiveStatusCard({
  temperature,
  humidity,
  flame,
  vibration,
  updatedAt,
}: Props) {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const TooltipContent = ({ label }: { label: string }) => {
    const tooltips: { [key: string]: string } = {
      temperature:
        "Current room temperature in Celsius | Optimal range: 20-26°C",
      humidity: "Air moisture level | Comfortable humidity: 40-70%",
      flame:
        "Flame detection sensor (KY-026) | Alerts if fire/flame detected in area",
      vibration:
        "Vibration detection sensor (KY-002) | Detects falls or unusual movements",
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
          {/* LEFT: Webcam takes 2 columns on desktop */}
          <div
            className="md:col-span-2
      bg-zinc-800/40 backdrop-blur-md border border-zinc-700/30
      rounded-2xl p-4 flex flex-col animate-fadeIn transition-all duration-300 hover:bg-zinc-800/60 hover:shadow-md"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-base sm:text-lg font-semibold text-amber-50">
                Webcam Monitor
              </p>
              <span className="text-xs sm:text-sm text-zinc-400">
                Preview only
              </span>
            </div>

            {/* TEMP IMAGE */}
            <div className="flex-1 rounded-xl bg-black/40 border border-white/10 overflow-hidden">
              <img
                src="/webcam-placeholder.jpg"
                className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity duration-300"
              />
            </div>
          </div>

          {/* RIGHT: Sensor cards */}
          <div className="flex flex-col gap-3 sm:gap-4 md:col-span-1">
            {/* Temperature */}
            <div
              className="bg-rose-950/40 rounded-2xl border border-rose-700/40 p-4 sm:p-5 flex justify-between items-center animate-scaleIn transition-all duration-300 hover:bg-rose-950/60 hover:border-rose-700/60 hover:shadow-md hover:shadow-rose-500/10 cursor-help group relative"
              onMouseEnter={() => setHoveredCard("temperature")}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div>
                <p className="text-xs sm:text-sm font-semibold text-rose-200">
                  Temperature
                </p>
                <p className="text-3xl sm:text-4xl font-bold text-rose-100 mt-1">
                  {temperature.toFixed(1)}°C
                </p>
              </div>
              <ThermostatIcon
                sx={{
                  fontSize: { xs: "2rem", sm: "2.5rem" },
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
              className="bg-emerald-950/40 rounded-2xl border border-emerald-700/40 p-4 sm:p-5 flex justify-between items-center animate-scaleIn transition-all duration-300 hover:bg-emerald-950/60 hover:border-emerald-700/60 hover:shadow-md hover:shadow-emerald-500/10 cursor-help group relative"
              style={{ animationDelay: "100ms" }}
              onMouseEnter={() => setHoveredCard("humidity")}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div>
                <p className="text-xs sm:text-sm font-semibold text-emerald-200">
                  Humidity
                </p>
                <p className="text-3xl sm:text-4xl font-bold text-emerald-100 mt-1">
                  {humidity.toFixed(1)}%
                </p>
              </div>
              <OpacityIcon
                sx={{
                  fontSize: { xs: "2rem", sm: "2.5rem" },
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
              className="bg-red-950/40 rounded-2xl border border-red-700/40 p-4 sm:p-5 flex justify-between items-center animate-scaleIn transition-all duration-300 hover:bg-red-950/60 hover:border-red-700/60 hover:shadow-md hover:shadow-red-500/10 cursor-help group relative"
              style={{ animationDelay: "200ms" }}
              onMouseEnter={() => setHoveredCard("flame")}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div>
                <p className="text-xs sm:text-sm font-semibold text-red-200">
                  Flame (KY-026)
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-red-100 mt-1">
                  {flame ? "Detected" : "Normal"}
                </p>
              </div>
              <LocalFireDepartmentIcon
                sx={{
                  fontSize: { xs: "2rem", sm: "2.5rem" },
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
              className="bg-amber-950/40 rounded-2xl border border-amber-700/40 p-4 sm:p-5 flex justify-between items-center animate-scaleIn transition-all duration-300 hover:bg-amber-950/60 hover:border-amber-700/60 hover:shadow-md hover:shadow-amber-500/10 cursor-help group relative"
              style={{ animationDelay: "300ms" }}
              onMouseEnter={() => setHoveredCard("vibration")}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div>
                <p className="text-xs sm:text-sm font-semibold text-amber-200">
                  Vibration (KY-002)
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-amber-100 mt-1">
                  {vibration ? "Detected" : "None"}
                </p>
              </div>
              <WarningAmberIcon
                sx={{
                  fontSize: { xs: "2rem", sm: "2.5rem" },
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
          </div>
        </div>
      </div>
    </div>
  );
}
