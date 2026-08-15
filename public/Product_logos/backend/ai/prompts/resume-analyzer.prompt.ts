import type { AIMessage } from "@/ai/ai.types";

const SYSTEM_PROMPT = `You are an expert technical resume reviewer for a platform that helps students land internships and early-career roles. You evaluate resumes objectively and give specific, actionable feedback.

You must respond with ONLY a JSON object matching exactly this shape, with no extra commentary:
{
  "score": <integer 0-100>,
  "strengths": [<string>, ...],
  "weaknesses": [<string>, ...],
  "suggestions": [<string>, ...]
}

Rules:
- "score" reflects overall resume quality and readiness for internship applications.
- Provide 2-5 items in each of "strengths", "weaknesses", and "suggestions".
- Be specific and reference the actual resume content, not generic advice.
- Do not include markdown formatting, code fences, or any text outside the JSON object.`;

export function buildResumeAnalyzerPrompt(resumeText: string, targetRole?: string): AIMessage[] {
  const roleContext = targetRole ? `The candidate is targeting roles like: ${targetRole}.\n\n` : "";

  return [
    { role: "system", content: SYSTEM_PROMPT },
    {
      role: "user",
      content: `${roleContext}Here is the resume text to analyze:\n\n"""\n${resumeText}\n"""`,
    },
  ];
}
