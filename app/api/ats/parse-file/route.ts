import { NextResponse } from "next/server";

// Use require() for CJS modules that don't have proper ESM exports.
// These are excluded from webpack bundling via serverExternalPackages in next.config.ts.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const pdfParse = require("pdf-parse");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const mammoth = require("mammoth");

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { base64, fileType, fileName } = body;

    if (!base64) {
      return NextResponse.json(
        { error: "No file data provided." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(base64, "base64");
    let extractedText = "";

    const lowerName = (fileName || "").toLowerCase();
    const lowerType = (fileType || "").toLowerCase();

    const isPdf =
      lowerName.endsWith(".pdf") || lowerType.includes("pdf");

    const isDocx =
      lowerName.endsWith(".docx") ||
      lowerType.includes("wordprocessingml") ||
      lowerType.includes("officedocument");

    // --- PDF extraction using pdf-parse (v1.1.1 exports a function) ---
    if (isPdf) {
      try {
        const pdfData = await pdfParse(buffer);
        extractedText = (pdfData.text || "").trim();
      } catch (pdfErr: any) {
        console.warn("pdf-parse extraction failed:", pdfErr?.message);
      }
    }

    // --- DOCX extraction using mammoth ---
    if (isDocx && !extractedText) {
      try {
        const result = await mammoth.extractRawText({ buffer });
        extractedText = (result.value || "").trim();
      } catch (docxErr: any) {
        console.warn("mammoth DOCX extraction failed:", docxErr?.message);
      }
    }

    // --- Fallback: read as UTF-8 text (for .txt, .md, etc.) ---
    if (!extractedText || extractedText.length < 10) {
      const rawText = buffer.toString("utf-8");
      extractedText = rawText
        .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
    }

    // Clean up line breaks
    const cleanedText = extractedText
      .replace(/\r\n/g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim();

    return NextResponse.json({ text: cleanedText });
  } catch (error: any) {
    console.error("ATS parse-file error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process uploaded file." },
      { status: 500 }
    );
  }
}
