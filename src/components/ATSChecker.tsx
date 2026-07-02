import React, { useState } from "react";
import { 
  FileText, Upload, AlignLeft, BarChart3, AlertCircle, CheckCircle2, 
  XOctagon, RefreshCw, Star, Info, HelpCircle, ArrowRight, Download
} from "lucide-react";
import { motion } from "motion/react";
import { StudentProfile, ATSAnalysis } from "../types";

interface ATSCheckerProps {
  profile: StudentProfile;
  onUpdateResumeText: (text: string) => void;
}

export default function ATSChecker({ profile, onUpdateResumeText }: ATSCheckerProps) {
  const [resumeInput, setResumeInput] = useState<string>(profile.resumeText || "");
  const [roleRequirements, setRoleRequirements] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<ATSAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  
  // Custom checker state engines
  const [checkerMode, setCheckerMode] = useState<"general" | "comparative">("comparative");
  const [isDecoding, setIsDecoding] = useState<boolean>(false);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setResumeInput(e.target.value);
    onUpdateResumeText(e.target.value);
  };

  // Unified robust file parser delegator
  const processDocumentFile = async (file: File) => {
    if (!file) return;
    setError(null);
    setIsDecoding(true);

    const isPdfOrDocx = 
      file.name.endsWith(".pdf") || 
      file.name.endsWith(".docx") || 
      file.type.includes("pdf") || 
      file.type.includes("officedocument") || 
      file.type.includes("word");

    if (isPdfOrDocx) {
      try {
        const reader = new FileReader();
        const base64Promise = new Promise<string>((resolve, reject) => {
          reader.onload = () => {
            if (typeof reader.result === "string") {
              const base64String = reader.result.split(",")[1];
              resolve(base64String);
            } else {
              reject(new Error("Failed to prepare document binary buffer."));
            }
          };
          reader.onerror = () => reject(reader.error || new Error("Failed to read file."));
          reader.readAsDataURL(file);
        });

        const base64 = await base64Promise;

        const response = await fetch("/api/ats/parse-file", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            base64,
            fileType: file.type,
            fileName: file.name
          })
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.error || "Failed to analyze document format structure.");
        }

        const data = await response.json();
        setResumeInput(data.text);
        onUpdateResumeText(data.text);
      } catch (err: any) {
        setError(err.message || "We encountered an issue extracting text from this document. Please try copy-pasting the text instead.");
        console.error("Document upload parse error:", err);
      } finally {
        setIsDecoding(false);
      }
    } else {
      // Decode directly as standard plain text
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setResumeInput(text);
        onUpdateResumeText(text);
        setIsDecoding(false);
      };
      reader.onerror = () => {
        setError("Could not read plain text content from this file.");
        setIsDecoding(false);
      };
      reader.readAsText(file);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processDocumentFile(file);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const onDragLeave = () => {
    setIsDragOver(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processDocumentFile(file);
    }
  };

  const handleAnalyze = async () => {
    if (!resumeInput.trim()) {
      setError("Please paste your resume text background or upload a supporting document (PDF, DOCX, or TXT).");
      return;
    }

    if (checkerMode === "comparative" && !roleRequirements.trim()) {
      setError("Please paste the target job requirements to compare alignment, or select 'General Resume Score' mode above.");
      return;
    }
    
    setIsAnalyzing(true);
    setError(null);

    try {
      const response = await fetch("/api/ats/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeText: resumeInput,
          roleRequirements: checkerMode === "general" ? "" : roleRequirements
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Analysis failed. Server responded with an error.");
      }

      const data = await response.json();
      setAnalysisResult(data);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during analysis.");
      console.error("ATS analysis fail:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-100 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800 flex items-center gap-2">
            <FileText className="w-6 h-6 text-brand-550" /> ATS Resume Checker
          </h1>
          <p className="text-xs text-slate-500">Scan layout compliance, extract keywords from documents, and align your resume against top-tier tech screening metrics.</p>
        </div>
        <div className="flex items-center gap-1.5 self-start">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded">Resume Parser Online</span>
        </div>
      </div>

      {/* Dual Checker Tab Selector */}
      <div className="bg-slate-100 p-1.5 rounded-xl max-w-md border border-slate-200/40">
        <div className="grid grid-cols-2 gap-1.5">
          <button 
            type="button"
            onClick={() => {
              setCheckerMode("general");
              setError(null);
            }}
            id="tab-checker-general"
            className={`py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 focus:outline-none cursor-pointer ${
              checkerMode === "general" 
                ? "bg-white text-slate-800 shadow-sm font-semibold" 
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            General Resume Score
          </button>
          <button 
            type="button"
            onClick={() => {
              setCheckerMode("comparative");
              setError(null);
            }}
            id="tab-checker-comparison"
            className={`py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 focus:outline-none cursor-pointer ${
              checkerMode === "comparative" 
                ? "bg-white text-slate-800 shadow-sm font-semibold" 
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Star className="w-3.5 h-3.5" />
            Target Job Match
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side Inputs Pane */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Card 1: Resume Text Input Area */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3.5">
              <label htmlFor="ats-resume-textarea" className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <AlignLeft className="w-4 h-4 text-brand-550" /> 1. Paste or Upload Resume
              </label>
              <div className="relative">
                <input 
                  type="file" 
                  id="resume-file-picker" 
                  accept=".txt,.md,.pdf,.docx" 
                  className="hidden" 
                  onChange={handleFileUpload}
                  disabled={isDecoding}
                />
                <label 
                  htmlFor="resume-file-picker" 
                  className={`text-xs text-brand-550 border border-brand-200 hover:border-brand-550 bg-brand-50/55 hover:bg-brand-50 px-2.5 py-1.5 rounded-lg font-semibold cursor-pointer transition focus-within:ring-2 ${
                    isDecoding ? "opacity-50 pointer-events-none" : ""
                  }`}
                >
                  {isDecoding ? "Extracting..." : "Upload File"}
                </label>
              </div>
            </div>

            {/* Drag Drop Area */}
            <div 
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              className={`border-2 border-dashed rounded-xl p-3 transition ${
                isDragOver ? "border-brand-550 bg-blue-50/20" : "border-slate-200 bg-slate-50/30"
              }`}
            >
              <textarea
                value={resumeInput}
                onChange={handleTextChange}
                disabled={isDecoding}
                placeholder={
                  isDecoding 
                    ? "Converting and extracting text from standard format file... Please wait a brief moment."
                    : "Paste the raw text of your resume here, or drag & drop a PDF, Word (.docx), or text file..."
                }
                rows={9}
                id="ats-resume-textarea"
                className="w-full text-xs font-mono bg-transparent border-0 focus:ring-0 resize-none text-slate-700 outline-none placeholder:text-slate-400 disabled:opacity-50"
              />
              <div className="text-[10px] text-slate-400 text-center border-t border-slate-100/70 pt-2 flex items-center justify-center gap-1.5">
                <Upload className="w-3 h-3 text-slate-300" />
                <span>Supports direct drag-and-drop of standard PDF, Word (.docx), or plain Text resumes</span>
              </div>
            </div>
          </div>

          {/* Card 2: Job Description Box */}
          {checkerMode === "comparative" ? (
            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm text-left">
              <label htmlFor="ats-role-requirements" className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-3.5">
                <Star className="w-4 h-4 text-brand-550" /> 2. Paste Target Job Description
              </label>
              <textarea
                value={roleRequirements}
                onChange={(e) => setRoleRequirements(e.target.value)}
                placeholder="Copy paste the target responsibilities, required technologies, or complete job list requirements here..."
                rows={6}
                id="ats-role-requirements"
                className="w-full text-xs bg-slate-50 text-slate-700 p-3 rounded-xl border border-slate-200 focus:bg-white focus:ring-2 focus:ring-brand-550 focus:border-brand-550 transition outline-none resize-none placeholder:text-slate-400"
              />
            </div>
          ) : (
            <div className="bg-gradient-to-r from-slate-50 to-indigo-50/20 rounded-2xl border border-slate-200/50 p-4 shadow-sm text-xs text-slate-500 leading-relaxed flex items-start gap-2.5">
              <Info className="w-4.5 h-4.5 text-slate-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-700 block mb-0.5">General Score Mode Active</strong>
                Our General Resume Score engine bypasses specific description constraints to critique visual organization, high-frequency engineering patterns, spelling structures, and core metrics density.
              </div>
            </div>
          )}

          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || isDecoding}
            id="btn-trigger-ats-analysis"
            className="w-full bg-brand-550 hover:bg-blue-600 active:translate-y-px text-white font-bold p-3.5 rounded-xl text-xs transition flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
                <span>Running Gemini ATS Analyzer...</span>
              </>
            ) : checkerMode === "general" ? (
              <>
                <BarChart3 className="w-4 h-4 text-white" />
                <span>Get General Resume Score</span>
              </>
            ) : (
              <>
                <BarChart3 className="w-4 h-4 text-white" />
                <span>Compare & Evaluate Scoring</span>
              </>
            )}
          </button>

          {error && (
            <div className="bg-red-50 text-red-600 rounded-xl p-3 text-xs border border-red-100 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Right Side Results Grid */}
        <div className="lg:col-span-7">
          {isAnalyzing ? (
            <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm flex flex-col items-center justify-center min-h-[450px]">
              <div className="relative flex items-center justify-center mb-6">
                <span className="absolute inline-flex h-12 w-12 rounded-full bg-brand-200 opacity-75 animate-ping"></span>
                <div className="relative w-16 h-16 rounded-full bg-brand-550 flex items-center justify-center text-white text-xl font-bold shadow-md">
                  AI
                </div>
              </div>
              <h3 className="font-extrabold text-slate-800 text-base mb-2 animate-pulse">Scanning Resume Compatibility</h3>
              <p className="text-xs text-slate-400 text-center max-w-sm leading-relaxed">
                AI models are cross-referencing your student profile with requirements, extracting essential keywords, and preparing industry benchmarks...
              </p>
            </div>
          ) : analysisResult ? (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Score summary header widget */}
              <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  
                  {/* Radial circle exact visual replica */}
                  <div className="md:col-span-4 flex justify-center">
                    <div className="relative w-36 h-36 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        <circle 
                          cx="50" 
                          cy="50" 
                          r="42" 
                          stroke="#eff6ff" 
                          strokeWidth="8" 
                          fill="transparent" 
                        />
                        <circle 
                          cx="50" 
                          cy="50" 
                          r="42" 
                          stroke={analysisResult.overallScore >= 80 ? "#10b981" : analysisResult.overallScore >= 60 ? "#0263e6" : "#f59e0b"}
                          strokeWidth="8" 
                          fill="transparent" 
                          strokeDasharray={2 * Math.PI * 42}
                          strokeDashoffset={(2 * Math.PI * 42) * (1 - analysisResult.overallScore / 100)}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute text-center">
                        <p className="text-3xl font-black text-slate-800 leading-none">
                          {analysisResult.overallScore}%
                        </p>
                        <p className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400 mt-1">
                          ATS Score
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-8 space-y-3.5">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase bg-brand-50 text-brand-550 px-2.5 py-1 rounded-md">
                        {checkerMode === "general" ? "General Parse Diagnosis" : "Job Alignment Verdict"}
                      </span>
                    </div>
                    <p className="text-sm font-bold text-slate-800 leading-snug">
                      {analysisResult.compatibilityCheck}
                    </p>
                    <div className="flex flex-wrap gap-4 text-xs font-mono text-slate-500">
                      <div>
                        Benchmarking Index: <span className="font-bold text-slate-800 uppercase">{analysisResult.industryBenchmarking.matchingIndex}</span>
                      </div>
                      <div>
                        Percentile: <span className="font-bold text-slate-800 font-mono">{analysisResult.industryBenchmarking.percentile}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Keyword Analysis compare tags block */}
              <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4">
                <div className="space-y-1">
                  <h3 className="font-bold text-slate-800 text-sm">Keyword Gap Analysis</h3>
                  <p className="text-xs text-slate-400">
                    {checkerMode === "general" 
                      ? "Industry-standard technology keywords present vs missing components relative to current benchmarks"
                      : "Comparing essential tech skills inside job requirements against your portfolio words"
                    }
                  </p>
                </div>

                <div className="space-y-3.5">
                  <div>
                    <h4 className="text-xs font-bold text-emerald-600 mb-1.5 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Matched Keywords ({analysisResult.keywordAnalysis.matchedKeywords.length})
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {analysisResult.keywordAnalysis.matchedKeywords.length > 0 ? (
                        analysisResult.keywordAnalysis.matchedKeywords.map((kw, i) => (
                          <span key={i} className="text-xs bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-lg font-semibold font-mono border border-emerald-100">
                            {kw}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-slate-450 italic">None detected yet.</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-amber-500 mb-1.5 flex items-center gap-1">
                      <XOctagon className="w-3.5 h-3.5" /> Recommended & Missing Keywords ({analysisResult.keywordAnalysis.missingKeywords.length})
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {analysisResult.keywordAnalysis.missingKeywords.length > 0 ? (
                        analysisResult.keywordAnalysis.missingKeywords.map((kw, i) => (
                          <span key={i} className="text-xs bg-amber-50 text-amber-700 px-2.5 py-1 rounded-lg font-semibold font-mono border border-amber-100">
                            {kw}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-slate-400 italic font-medium">No missing keywords! Ideal match.</span>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 border-t border-slate-100/80 pt-3 leading-relaxed">
                    <strong>Coaching Advice:</strong> {analysisResult.keywordAnalysis.comparisonText}
                  </p>
                </div>
              </div>

              {/* Practical suggestions block */}
              <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4">
                <div className="space-y-0.5">
                  <h3 className="font-bold text-slate-800 text-sm">Actionable Resume Suggestions</h3>
                  <p className="text-xs text-slate-400">Structure adjustments and phrasing/words to be added to maximize compatibility ratings</p>
                </div>

                <ul className="space-y-3">
                  {analysisResult.suggestions.map((sug, i) => (
                    <li key={i} className="flex gap-2 text-xs leading-relaxed text-slate-700">
                      <div className="w-5 h-5 rounded bg-brand-50 text-brand-550 flex items-center justify-center shrink-0 font-bold font-mono">
                        {i + 1}
                      </div>
                      <span className="font-medium">{sug}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Industry Benchmarking comparisons block */}
              <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-3">
                <h3 className="font-bold text-slate-800 text-sm">Industry Benchmarking</h3>
                <div className="p-3.5 bg-slate-50 rounded-xl space-y-2">
                  <p className="text-xs text-slate-700 font-medium">
                    {analysisResult.industryBenchmarking.benchmarkingText}
                  </p>
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span 
                        key={i} 
                        className={`w-4 h-1.5 rounded-full ${
                          i < (analysisResult.overallScore / 20) 
                            ? "bg-brand-550" 
                            : "bg-slate-200"
                        }`}
                      ></span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            // Default placeholder state matches reference visuals
            <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm flex flex-col items-center justify-center min-h-[450px] text-center">
              <div className="w-16 h-16 rounded-2xl bg-brand-50 text-brand-550 flex items-center justify-center mb-4">
                <BarChart3 className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-slate-800 text-base mb-1">
                {checkerMode === "general" ? "Request General Score" : "Begin ATS Job Match"}
              </h3>
              <p className="text-xs text-slate-400 max-w-sm leading-relaxed mb-6">
                {checkerMode === "general" 
                  ? "Paste or upload your technical resume (.pdf, .docx, .txt), and hit the trigger button. Our AI auditor will scan standard layout compliance and density metrics."
                  : "Upload or paste your resume and supply a specific target job/role description to identify essential skill gaps, missing keywords, and custom tips to improve your profile."
                }
              </p>
              
              <div className="inline-flex items-center gap-2 text-[11px] font-bold bg-slate-50 text-slate-500 border border-slate-150 px-3.5 py-2.5 rounded-xl">
                <Info className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Supports direct PDF, Word, markdown or plain text with automatic server parsing</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
