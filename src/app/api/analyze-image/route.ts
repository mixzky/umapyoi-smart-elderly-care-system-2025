import { VertexAI } from "@google-cloud/vertexai";
import { NextResponse } from "next/server";

const projectId = process.env.GCP_PROJECT_ID;

export async function POST(req: Request) {
  try {
    const body = await req.json();
 
    if (!body.image) {
      return NextResponse.json({ error: "No image" }, { status: 400 });
    }
    
    // ตัดหัว data:image ออก
    const base64Image = body.image.replace(/^data:image\/\w+;base64,/, "");

    // เรียก Vertex AI
    const vertexAI = new VertexAI({ project: projectId, location: "us-central1" });
    const model = vertexAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      Analyze this image for safety monitoring.
      Check if there is a person who has FALLEN on the floor.
      Return a JSON object: { "isFallen": boolean, "confidence": number, "description": "string" }
    `;

    const result = await model.generateContent({
      contents: [{
        role: "user",
        parts: [{ text: prompt }, { inlineData: { mimeType: "image/jpeg", data: base64Image } }],
      }],
    });

    
    const response = await result.response;
    console.log("Vertex AI response:", response);
    let text = response.candidates?.[0].content?.parts?.[0].text || "{}";
    // ล้าง format ที่เกินมา
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    return NextResponse.json(JSON.parse(text));

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}