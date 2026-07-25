import { NextResponse } from "next/server";

const COMMON_TECH_KEYWORDS = [
  "javascript", "typescript", "react", "next.js", "nextjs", "vue", "angular", "node.js", "nodejs",
  "express", "python", "django", "flask", "java", "spring", "c++", "c#", ".net", "sql", "mysql",
  "postgresql", "mongodb", "redis", "docker", "kubernetes", "aws", "azure", "gcp", "git", "github",
  "rest api", "graphql", "tailwind", "html", "css", "sass", "redux", "system design",
  "data structures", "algorithms", "unit testing", "jest", "cypress", "ci/cd", "agile", "scrum",
  "linux", "microservices", "web sockets", "jwt", "oauth", "orm", "prisma", "mongoose"
];

function extractKeywords(text: string): string[] {
  const lower = text.toLowerCase();
  const found = new Set<string>();
  
  for (const kw of COMMON_TECH_KEYWORDS) {
    // Regex for word boundary matching
    const escaped = kw.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    const regex = new RegExp(`\\b${escaped}\\b`, "i");
    if (regex.test(lower)) {
      found.add(kw);
    }
  }

  // Fallback for custom words (uppercase acronyms or tech words like Kafka, WebRTC, etc.)
  const words = text.match(/\b[A-Z][a-zA-Z0-9+#.]{2,}\b/g) || [];
  for (const w of words) {
    if (w.length > 2 && !["The", "And", "For", "With", "This", "From", "Your", "Have"].includes(w)) {
      found.add(w.toLowerCase());
    }
  }

  return Array.from(found);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { resumeText = "", roleRequirements = "" } = body;

    if (!resumeText.trim()) {
      return NextResponse.json(
        { error: "Resume text content is required for ATS analysis." },
        { status: 400 }
      );
    }

    const isComparative = Boolean(roleRequirements && roleRequirements.trim().length > 0);
    const resumeKeywords = extractKeywords(resumeText);

    let matchedKeywords: string[] = [];
    let missingKeywords: string[] = [];
    let overallScore = 70;
    let compatibilityCheck = "";
    let comparisonText = "";
    let suggestions: string[] = [];
    let matchingIndex = "TIER 2 - STRONG MATCH";

    if (isComparative) {
      const jobKeywords = extractKeywords(roleRequirements);
      
      matchedKeywords = jobKeywords.filter((kw) => resumeKeywords.includes(kw));
      missingKeywords = jobKeywords.filter((kw) => !resumeKeywords.includes(kw));

      // Extra keywords in resume that match tech stack
      const bonusMatched = resumeKeywords.filter((kw) => !jobKeywords.includes(kw)).slice(0, 5);
      
      const matchRatio = jobKeywords.length > 0 ? matchedKeywords.length / jobKeywords.length : 0.75;
      
      // Calculate score based on keyword match ratio + structural quality
      const lengthBonus = resumeText.length > 300 ? 10 : 0;
      const metricsBonus = /\b(\d+%|\$\d+|\d+\+|\d+k)\b/i.test(resumeText) ? 10 : 0;
      
      overallScore = Math.min(98, Math.max(35, Math.round(matchRatio * 75 + lengthBonus + metricsBonus)));

      if (overallScore >= 85) {
        compatibilityCheck = "Excellent Alignment: Your resume heavily matches the required technology stack and domain keywords for this position.";
        matchingIndex = "TIER 1 - ELITE MATCH";
      } else if (overallScore >= 65) {
        compatibilityCheck = "Moderate Alignment: Core skills match the job description, but adding missing key frameworks will boost ATS ranking.";
        matchingIndex = "TIER 2 - STRONG MATCH";
      } else {
        compatibilityCheck = "Low Match Score: Critical required skills from the job description are currently missing in your resume.";
        matchingIndex = "TIER 3 - NEEDS REVISION";
      }

      comparisonText = missingKeywords.length > 0
        ? `To improve ATS parsing for this specific role, incorporate missing target keywords such as "${missingKeywords.slice(0, 4).join(", ")}" into your work experience or skills section.`
        : "Your resume covers all required keywords specified in the target job description.";

      if (missingKeywords.length > 0) {
        suggestions.push(`Include specific instances of key tools: ${missingKeywords.slice(0, 3).map(k => `"${k}"`).join(", ")}.`);
      }
    } else {
      // General Mode
      matchedKeywords = resumeKeywords;
      const recommendedGeneral = ["TypeScript", "Docker", "REST API", "System Design", "CI/CD", "Unit Testing", "Git"];
      missingKeywords = recommendedGeneral.filter(
        (kw) => !resumeKeywords.includes(kw.toLowerCase())
      );

      const hasMetrics = /\b(\d+%|\$\d+|\d+\+|\d+k)\b/i.test(resumeText);
      const hasSections = /\b(experience|education|projects|skills|summary)\b/i.test(resumeText);

      overallScore = 65 + (hasMetrics ? 15 : 0) + (hasSections ? 10 : 0) + Math.min(10, resumeKeywords.length);
      overallScore = Math.min(95, Math.max(50, overallScore));

      if (overallScore >= 80) {
        compatibilityCheck = "High Quality Structure: Resume features strong tech keywords, clear sections, and measurable impact metrics.";
        matchingIndex = "TIER 1 - ELITE PROFILE";
      } else {
        compatibilityCheck = "Standard Resume Structure: Solid foundation, but adding quantified achievement metrics and modern frameworks will elevate your ATS score.";
        matchingIndex = "TIER 2 - COMPETITIVE";
      }

      comparisonText = "General ATS audit looks for clean section headers, quantified achievements (e.g. percentages, user counts), and modern tech stacks.";

      if (!hasMetrics) {
        suggestions.push("Add quantifiable metrics to your bullet points (e.g., 'Improved performance by 30%', 'Served 5,000+ active users').");
      }
    }

    // Standard structural suggestions
    suggestions.push("Ensure bullet points begin with strong action verbs (e.g., Architected, Developed, Optimized, Implemented).");
    suggestions.push("Keep section headers standard (e.g., 'Work Experience', 'Skills', 'Projects', 'Education') so ATS scanners categorize data accurately.");
    if (suggestions.length < 3) {
      suggestions.push("Format dates consistently across all experience entries (e.g., 'MMM YYYY - Present').");
    }

    const percentile = Math.min(99, Math.max(50, Math.round(overallScore * 0.95)));

    const result = {
      overallScore,
      compatibilityCheck,
      keywordAnalysis: {
        matchedKeywords: matchedKeywords.map(k => k.charAt(0).toUpperCase() + k.slice(1)),
        missingKeywords: missingKeywords.map(k => k.charAt(0).toUpperCase() + k.slice(1)),
        comparisonText
      },
      suggestions,
      industryBenchmarking: {
        percentile,
        benchmarkingText: `Your resume score ranks in the top ${100 - percentile}% of student tech profiles scanned on StepUp.`,
        matchingIndex
      }
    };

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("ATS Analyzer Route Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to execute ATS analysis." },
      { status: 500 }
    );
  }
}
