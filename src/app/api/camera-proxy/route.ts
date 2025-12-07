import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const streamUrl = "http://172.20.10.9/stream";
  
  try {
    const response = await fetch(streamUrl);
    
    if (!response.ok) {
      return new Response("Stream not available", { status: 502 });
    }

    // Forward the stream with proper headers
    return new Response(response.body, {
      headers: {
        "Content-Type": "multipart/x-mixed-replace; boundary=frame",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
      },
    });
  } catch (error) {
    console.error("Proxy error:", error);
    return new Response("Stream error", { status: 500 });
  }
}
