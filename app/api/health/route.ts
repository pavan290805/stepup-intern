import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    openaiEnabled: Boolean(process.env.OPENAI_API_KEY),
    geminiEnabled: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString()
  });
}
