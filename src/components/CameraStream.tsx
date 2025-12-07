"use client";

import React, { useState, useEffect, useRef } from "react";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import RefreshIcon from "@mui/icons-material/Refresh";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SmartToyIcon from "@mui/icons-material/SmartToy";

type Props = {
  streamUrl?: string;
};

export default function CameraStream({
  streamUrl = "/api/camera-proxy",
}: Props) {
  const [isConnected, setIsConnected] = useState(true);
  const [isAuto, setIsAuto] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleRefresh = () => {
    if (imgRef.current) {
      imgRef.current.src = `${streamUrl}`;
    }
    setResult(null);
    setIsConnected(true);
  };

  const handleImageError = () => {
    setIsConnected(false);
  };

  const handleImageLoad = () => {
    setIsConnected(true);
  };

  const checkSafety = async () => {
    if (!canvasRef.current || !imgRef.current || !isConnected) return;
    
    setAnalyzing(true);

    try {
      // Capture frame directly from the stream img element
      const img = imgRef.current;
      
      const ctx = canvasRef.current.getContext("2d");
      if (!ctx) return;

      const originalWidth = img.naturalWidth || img.width;
      const originalHeight = img.naturalHeight || img.height;

      const targetWidth = originalHeight;  
      const targetHeight = originalWidth; 
      
      canvasRef.current.width = targetWidth;
      canvasRef.current.height = targetHeight;
      
      ctx.save();
      ctx.translate(targetWidth / 2, targetHeight / 2);
      ctx.rotate(90 * Math.PI / 180);
      ctx.drawImage(img, -originalWidth / 2, -originalHeight / 2, originalWidth, originalHeight);
      
      // Restore context
      ctx.restore();
      
      // Convert to base64 with full quality
      const base64 = canvasRef.current.toDataURL("image/jpeg", 1.0);

      // Add timeout to prevent hanging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      const res = await fetch("/api/analyze-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64 }),
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      const data = await res.json();
      setResult(data);
    } catch (error: any) {
      console.error("Error analyzing image:", error);
      if (error.name === 'AbortError') {
        setResult({ 
          isFallen: false, 
          description: "Analysis timeout - please try again" 
        });
      }
    } finally {
      setAnalyzing(false);
    }
  };

  // Auto-check interval
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAuto && isConnected) {
      interval = setInterval(() => {
        if (!analyzing) checkSafety();
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isAuto, analyzing, isConnected]);

  const isDanger = result?.isFallen;

  return (
    <div className={`md:col-span-2 bg-zinc-800/40 backdrop-blur-md border rounded-2xl p-4 flex flex-col animate-fadeIn transition-all duration-300 hover:shadow-md ${
      isDanger ? 'border-red-500/70 bg-red-950/30 hover:bg-red-950/40' : 'border-zinc-700/30 hover:bg-zinc-800/60'
    }`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {isDanger ? (
            <WarningAmberIcon
              sx={{
                fontSize: "1.25rem",
                color: "#ef4444",
                animation: "pulseWarning 1.5s ease-in-out infinite",
              }}
            />
          ) : isConnected ? (
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
          <p className={`text-base sm:text-lg font-semibold ${isDanger ? 'text-red-200' : 'text-amber-50'}`}>
            ESP32-CAM {isDanger && '⚠️ FALL DETECTED'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* AI Auto Toggle */}
          <button
            onClick={() => setIsAuto(!isAuto)}
            disabled={!isConnected}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 flex items-center gap-1.5 ${
              isAuto
                ? "bg-green-600 hover:bg-green-500 text-white"
                : "bg-zinc-700/50 hover:bg-zinc-600/50 text-zinc-200"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
            title={isAuto ? "Disable auto AI check" : "Enable auto AI check (every 5s)"}
          >
            <SmartToyIcon sx={{ fontSize: "0.9rem" }} />
            AI: {isAuto ? "ON" : "OFF"}
          </button>

          {/* Connection Status */}
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
            {isConnected ? "Live" : "Offline"}
          </div>
        </div>
      </div>

      {/* Camera Stream */}
      <div className="flex-1 rounded-xl bg-black/40 border border-white/10 overflow-hidden relative min-h-[300px] sm:min-h-[400px] md:min-h-[500px] flex items-center justify-center">
        {isConnected ? (
          <>
            <img
              ref={imgRef}
              src={streamUrl}
              alt="ESP32-CAM Live Stream"
              crossOrigin="anonymous"
              className="max-w-none transition-opacity duration-300"
              style={{
                transform: 'rotate(90deg)'
              }}
              onError={handleImageError}
              onLoad={handleImageLoad}
            />
            <canvas ref={canvasRef} className="hidden" />
            {analyzing && (
              <div className="absolute top-2 right-2 bg-black/80 text-white px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 animate-pulse">
                <SmartToyIcon sx={{ fontSize: "1rem" }} />
                AI Analyzing...
              </div>
            )}
          </>
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

      {/* AI Analysis Result */}
      {result && (
        <div className={`mt-3 p-3 rounded-lg flex gap-3 text-white transition-all duration-300 ${
          isDanger ? 'bg-red-500/20 border border-red-500/40' : 'bg-green-500/20 border border-green-500/40'
        }`}>
          {isDanger ? (
            <WarningAmberIcon sx={{ color: "#ef4444", fontSize: "1.5rem" }} />
          ) : (
            <CheckCircleIcon sx={{ color: "#10b981", fontSize: "1.5rem" }} />
          )}
          <div className="flex-1">
            <div className={`font-bold text-sm ${isDanger ? 'text-red-200' : 'text-green-200'}`}>
              {isDanger ? "⚠️ FALL DETECTED!" : "✓ Safe - No Fall Detected"}
            </div>
            <div className="text-xs opacity-80 mt-1">{result.description}</div>
            {result.confidence && (
              <div className="text-xs opacity-60 mt-1">
                Confidence: {(result.confidence * 100).toFixed(0)}%
              </div>
            )}
          </div>
        </div>
      )}

      {/* Stream Info */}
      <div className="mt-3 flex items-center justify-between text-xs text-zinc-400">
        <span>Stream URL: {streamUrl}</span>
        <span>MJPEG Stream {isAuto && '• AI Auto-Check: 5s'}</span>
      </div>
    </div>
  );
}
