import { NextResponse } from "next/server";

export async function GET() {
  const geminiApiKey =
    process.env.GEMINI_API_KEY ||
    process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
    process.env.GOOGLE_API_KEY ||
    process.env.GEMINI_KEY;

  return NextResponse.json({
    status: "ok",
    openaiEnabled: Boolean(process.env.OPENAI_API_KEY),
    geminiEnabled: Boolean(geminiApiKey),
    timestamp: new Date().toISOString()
  });
}

