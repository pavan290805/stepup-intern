import type { AIMessage } from "@/ai/ai.types";

const SYSTEM_PROMPT = `You are an expert technical recruiter who writes clear, inclusive, and compelling internship/job descriptions.

You must respond with ONLY a JSON object matching exactly this shape, with no extra commentary:
{
  "title": <string>,
  "summary": <string, 2-3 sentences>,
  "responsibilities": [<string>, ...],
  "requirements": [<string>, ...],
  "niceToHave": [<string>, ...]
}

Rules:
- Provide 3-6 items in "responsibilities" and "requirements", and 2-4 in "niceToHave".
- Write in an inclusive, bias-free tone (avoid gendered language, unnecessary degree requirements, or exclusionary jargon).
- Do not include markdown formatting, code fences, or any text outside the JSON object.`;

export interface JdGeneratorInput {
  roleTitle: string;
  companyName: string;
  companyDescription?: string;
  skillsRequired: string[];
  location: string;
  type: string;
}

export function buildJdGeneratorPrompt(input: JdGeneratorInput): AIMessage[] {
  const context = [
    `Role title: ${input.roleTitle}`,
    `Company: ${input.companyName}`,
    input.companyDescription ? `Company description: ${input.companyDescription}` : null,
    `Location: ${input.location}`,
    `Employment type: ${input.type}`,
    input.skillsRequired.length > 0 ? `Key skills: ${input.skillsRequired.join(", ")}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  return [
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: `Generate a job description for the following role:\n\n${context}` },
  ];
}
