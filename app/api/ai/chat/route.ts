import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import OpenAI from "openai";

function generateFallbackResponse(userPrompt: string, context: any): string {
  const promptLower = userPrompt.toLowerCase();
  const userName = context?.name || "Student";
  const skills = Array.isArray(context?.skills)
    ? context.skills.map((s: any) => (typeof s === "string" ? s : s.name)).join(", ")
    : "JavaScript, React, Node.js";

  if (promptLower.includes("resume") || promptLower.includes("bullet point")) {
    return `Hello ${userName}! Here are 3 targeted suggestions to optimize your resume bullet points based on your profile (${skills}):

1. **Highlight Core Impact**: Instead of "Worked on project", rephrase as "Architected and deployed full-stack features using ${skills.split(", ")[0] || "React"} serving active users."
2. **Quantify Metrics**: Add performance data (e.g. "Reduced page load time by 35% through lazy loading and API caching").
3. **Action Verbs**: Begin every experience entry with strong verbs like *Implemented*, *Engineered*, *Optimized*, or *Designed*.`;
  }

  if (promptLower.includes("interview") || promptLower.includes("mock")) {
    return `Great to prepare with you, ${userName}! Here is a technical interview question customized for your skills (${skills}):

**Question**: *Explain how state management works in React and how you prevent unnecessary re-renders when managing complex object states.*

**Key points to hit in your response**:
- Explain the immutability principle when updating state objects.
- Discuss \`useMemo\` and \`useCallback\` for memoizing expensive calculations and function references.
- Compare local component state vs. global state tools (like Context API or Redux).

Would you like to try answering this question now?`;
  }

  if (promptLower.includes("learning") || promptLower.includes("recommend")) {
    return `Based on your technical background (${skills}), here is a recommended 2026/2027 learning roadmap:

1. **Advanced System Design**: Study microservices architecture, message queues (Kafka/RabbitMQ), and distributed caching (Redis).
2. **Cloud & DevOps**: Gain hands-on practice with Docker containers, Kubernetes orchestration, and AWS/GCP CI/CD deployment pipelines.
3. **Type-Safe Fullstack**: Deepen your mastery of Next.js App Router, Server Actions, and Prisma ORM for production-level software engineering.`;
  }

  if (promptLower.includes("role") || promptLower.includes("job")) {
    return `Based on your profile as a ${context?.title || "Computer Science Engineering Student"} with skills in ${skills}, here are top matched roles for you:

1. **Full-Stack Software Engineer Intern**: Highly aligned with your React and Node.js foundation.
2. **Frontend Engineer**: Perfect fit for creating responsive, user-facing modern web applications.
3. **Backend Developer**: Strong candidate for building robust REST/GraphQL APIs and managing database schemas.`;
  }

  return `Hello ${userName}! As your AI Career Buddy on StepUp, I've loaded your profile (${skills}). 

How can I help you today? I can assist you with:
- **Resume Optimization**: Tailoring your experience and bullet points for ATS scanners.
- **Mock Technical Interviews**: Practicing core CS and framework interview questions.
- **Skill Gap Roadmap**: Identifying advanced technologies to learn for high-paying roles.
- **Career Growth Advice**: Guidance on navigating internships and software engineering career paths.`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { messages = [], model = "chatgpt", context = {} } = body;

    const lastUserMsg = [...messages].reverse().find((m: any) => m.role === "user");
    const userPrompt = lastUserMsg ? lastUserMsg.content : "";

    // 1. Try Gemini if key is available
    if ((model === "gemini" || !process.env.OPENAI_API_KEY) && process.env.GEMINI_API_KEY) {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const systemInstruction = `You are an elite career coach and software engineering mentor on the StepUp student platform. The student's name is ${context.name || "Student"}, pursuing ${context.title || "Computer Science"}. Their skills are: ${JSON.stringify(context.skills || [])}. Keep responses encouraging, highly actionable, well-formatted, and concise.`;
        
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: [
            { role: "user", parts: [{ text: `${systemInstruction}\n\nStudent message: ${userPrompt}` }] }
          ]
        });

        if (response?.text) {
          return NextResponse.json({ text: response.text });
        }
      } catch (geminiErr) {
        console.warn("Gemini API call failed, using fallback coach:", geminiErr);
      }
    }

    // 2. Try OpenAI if key is available
    if (process.env.OPENAI_API_KEY) {
      try {
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        const completion = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: `You are an elite career coach and tech mentor on StepUp. Student: ${context.name || "Student"}, Skills: ${JSON.stringify(context.skills || [])}.`
            },
            ...messages.map((m: any) => ({ role: m.role, content: m.content }))
          ]
        });

        const reply = completion.choices[0]?.message?.content;
        if (reply) {
          return NextResponse.json({ text: reply });
        }
      } catch (openaiErr) {
        console.warn("OpenAI API call failed, using fallback coach:", openaiErr);
      }
    }

    // 3. Robust fallback response
    const fallbackText = generateFallbackResponse(userPrompt, context);
    return NextResponse.json({ text: fallbackText });
  } catch (error: any) {
    console.error("AI Chat Route Error:", error);
    return NextResponse.json({
      text: "I experienced a temporary network issue, but I am ready to help you! Please try asking your question again."
    });
  }
}
