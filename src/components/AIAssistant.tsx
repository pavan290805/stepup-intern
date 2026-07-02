import React, { useState, useRef, useEffect } from "react";
import { 
  Sparkles, Send, HelpCircle, Briefcase, FileSignature, 
  Map, Lightbulb, UserCheck, Trash2, ShieldAlert, Bot, RefreshCw
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { StudentProfile, ChatMessage } from "../types";
import { INITIAL_CHAT } from "../utils/mockData";

interface AIAssistantProps {
  profile: StudentProfile;
  initialChatMessages: ChatMessage[];
  onSendMessage: (messages: ChatMessage[]) => void;
  onClearChatHistory: () => void;
}

export default function AIAssistant({ 
  profile, 
  initialChatMessages, 
  onSendMessage,
  onClearChatHistory
}: AIAssistantProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialChatMessages);
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isOpenAIEnabled, setIsOpenAIEnabled] = useState<boolean>(false);
  const [selectedModel, setSelectedModel] = useState<"gemini" | "chatgpt">("chatgpt");
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetch("/api/health")
      .then(res => res.json())
      .then(data => {
        if (data.openaiEnabled) {
          setIsOpenAIEnabled(true);
        }
      })
      .catch(err => console.error("Error fetching health status:", err));
  }, []);

  // Sync with global custom states if changed
  useEffect(() => {
    setMessages(initialChatMessages);
  }, [initialChatMessages]);

  // Scroll downwards when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const rawContent = textToSend || input;
    if (!rawContent.trim()) return;

    if (!textToSend) setInput("");

    const newMsg: ChatMessage = {
      id: "usr-" + Date.now(),
      role: "user",
      content: rawContent,
      timestamp: new Date().toISOString()
    };

    const updatedMessages = [...messages, newMsg];
    setMessages(updatedMessages);
    setLoading(true);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages,
          model: selectedModel,
          context: {
            name: profile.personalInfo.name,
            title: profile.personalInfo.title,
            skills: profile.skills,
            projects: profile.projects.map(p => ({ title: p.title, tech: p.technologies })),
            experience: profile.experience,
            education: profile.education
          }
        })
      });

      if (!response.ok) {
        throw new Error("Could not fetch chat response.");
      }

      const resData = await response.json();
      
      const assistantMsg: ChatMessage = {
        id: "ai-" + Date.now(),
        role: "assistant",
        content: resData.text || "I was unable to compile a summary, please retry typing.",
        timestamp: new Date().toISOString()
      };

      const finalMessages = [...updatedMessages, assistantMsg];
      setMessages(finalMessages);
      onSendMessage(finalMessages); // Save global state
    } catch (err: any) {
      console.error(err);
      const errMessage: ChatMessage = {
        id: "err-" + Date.now(),
        role: "assistant",
        content: "Oops! I encountered an error connecting to my server. Please verify your internet connection or double-check that your server is active on Port 3000.",
        timestamp: new Date().toISOString()
      };
      setMessages([...updatedMessages, errMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleTopicSelect = (promptText: string) => {
    handleSend(promptText);
  };

  const handleClear = () => {
    onClearChatHistory();
    setMessages([]);
  };

  return (
    <div className="space-y-6">
      {/* Upper header summary */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-100 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-brand-550" /> AI Career Buddy
          </h1>
          <p className="text-xs text-slate-500">
            Your elite automated career mentor, personalized with your academic profile and technical skill specifications.
          </p>
        </div>
        
        <button
          onClick={handleClear}
          id="btn-clear-chat"
          className="text-xs font-semibold text-rose-600 border border-rose-200 hover:bg-rose-50 px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer transition self-start md:self-auto"
        >
          <Trash2 className="w-3.5 h-3.5" /> Clear History
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-stretch">
        
        {/* Left column sidebar for Quick assistance filters */}
        <div className="lg:col-span-1 space-y-4 flex flex-col justify-between">
          <div className="space-y-3.5">
            <h3 className="text-xs font-extrabold uppercase text-slate-400 font-mono tracking-wider">
              Assistance Focus Areas
            </h3>
            
            <div className="space-y-2">
              <button
                onClick={() => handleTopicSelect("Give me career guidance about Frontend vs Backend growth in 2026/2027.")}
                className="w-full text-left bg-white hover:bg-brand-50 border border-slate-100 p-3 rounded-xl transition text-xs font-bold text-slate-700 hover:text-brand-550 flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <Briefcase className="w-4 h-4 text-brand-550 shrink-0" />
                <span>Career Guidance</span>
              </button>

              <button
                onClick={() => handleTopicSelect("Look over my certifications and projects list and suggest resume bullet point optimizations.")}
                className="w-full text-left bg-white hover:bg-brand-50 border border-slate-100 p-3 rounded-xl transition text-xs font-bold text-slate-700 hover:text-brand-550 flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <FileSignature className="w-4 h-4 text-brand-550 shrink-0" />
                <span>Resume Advice</span>
              </button>

              <button
                onClick={() => handleTopicSelect("Act as a Tech Lead on a Senior Developer panel and conduct a mock interview with me about React hooks and type safety.")}
                className="w-full text-left bg-white hover:bg-brand-50 border border-slate-100 p-3 rounded-xl transition text-xs font-bold text-slate-700 hover:text-brand-550 flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <UserCheck className="w-4 h-4 text-brand-550 shrink-0" />
                <span>Interview Preparation</span>
              </button>

              <button
                onClick={() => handleTopicSelect("Recommend specific advanced topics, guides, and courses for learning modern cloud storage or database modeling.")}
                className="w-full text-left bg-white hover:bg-brand-50 border border-slate-100 p-3 rounded-xl transition text-xs font-bold text-slate-700 hover:text-brand-550 flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <Map className="w-4 h-4 text-brand-550 shrink-0" />
                <span>Learning Recommendations</span>
              </button>

              <button
                onClick={() => handleTopicSelect("Based on my skills list, list 3-4 suitable tech roles I am highly qualified for.")}
                className="w-full text-left bg-white hover:bg-brand-50 border border-slate-100 p-3 rounded-xl transition text-xs font-bold text-slate-700 hover:text-brand-550 flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <Lightbulb className="w-4 h-4 text-brand-550 shrink-0" />
                <span>Job Role Suggestions</span>
              </button>
            </div>
          </div>

          {/* Quick Profile Summary Context Card */}
          <div className="bg-gradient-to-br from-brand-50 to-blue-50 border border-brand-100 rounded-2xl p-4 space-y-2.5">
            <h4 className="text-[10px] uppercase font-mono font-bold text-slate-400">Context Loaded</h4>
            <div className="space-y-1 text-xs">
              <p className="font-bold text-slate-800">{profile.personalInfo.name}</p>
              <p className="text-slate-500">{profile.education[0]?.school} &bull; BS CS</p>
              <p className="text-[10px] text-brand-550 font-bold bg-brand-100/50 px-1.5 py-0.5 rounded inline-block">
                {profile.skills.length} Technical Skills Active
              </p>
            </div>
          </div>
        </div>

        {/* Right column Chat Container */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col h-[520px] justify-between overflow-hidden">
          
          {/* Chat upper label */}
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand-550 text-white flex items-center justify-center font-bold">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800">Coaching Terminal</h3>
                <p className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> 
                  {selectedModel === "chatgpt" ? "ChatGPT (GPT-4o-mini) Active" : "Gemini 3.5 Assistant Active"}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Model selection interface */}
              <div className="flex gap-1 bg-slate-100/80 p-0.5 rounded-lg border border-slate-200">
                <button
                  type="button"
                  onClick={() => setSelectedModel("gemini")}
                  className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                    selectedModel === "gemini"
                      ? "bg-white text-slate-800 shadow-sm"
                      : "text-slate-500 hover:text-slate-800 animate-fade-in"
                  }`}
                >
                  Gemini
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedModel("chatgpt")}
                  className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-all flex items-center gap-1 cursor-pointer ${
                    selectedModel === "chatgpt"
                      ? "bg-white text-slate-800 shadow-sm font-bold"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  ChatGPT
                </button>
              </div>

              <span className="text-[10px] font-bold text-slate-400 font-mono hidden sm:inline">
                STD ID: #{profile.personalInfo.name.substring(0, 3).toUpperCase()}-9423
              </span>
            </div>
          </div>

          {/* Messages window */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                <Bot className="w-10 h-10 text-slate-300 mb-3" />
                <p className="text-xs font-bold text-slate-600">Your chat history is empty</p>
                <p className="text-[10px] max-w-xs mt-1">Select one of the assistance boxes in the left panel or type your custom career question below to begin coaching!</p>
              </div>
            ) : (
              messages.map((m) => (
                <div 
                  key={m.id} 
                  className={`flex items-start gap-2.5 ${m.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                >
                  {/* Sender Avatar */}
                  <div className={`w-7 h-7 rounded-lg font-bold flex items-center justify-center text-xs shrink-0 select-none ${
                    m.role === "user" ? "bg-slate-200 text-slate-700" : "bg-blue-100 text-brand-550"
                  }`}>
                    {m.role === "user" ? "JD" : "AI"}
                  </div>

                  {/* Bubble body content */}
                  <div className={`rounded-2xl px-3.5 py-2.5 max-w-[85%] text-xs shadow-sm ${
                    m.role === "user" 
                      ? "bg-brand-550 text-white font-medium rounded-tr-none" 
                      : "bg-slate-50 text-slate-700 border border-slate-100 rounded-tl-none leading-relaxed"
                  }`}>
                    {/* Render newlines beautifully with formatted paragraphs */}
                    <div className="whitespace-pre-line space-y-1 font-sans">
                      {m.content}
                    </div>
                  </div>
                </div>
              ))
            )}
            
            {loading && (
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-blue-100 text-brand-550 font-bold flex items-center justify-center text-xs justify-items-center animate-pulse">
                  AI
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-2xl rounded-tl-none px-4 py-3 text-xs text-slate-400 flex items-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-brand-550" />
                  <span>AI Career Buddy is thinking...</span>
                </div>
              </div>
            )}
            <div ref={scrollRef}></div>
          </div>

          {/* User Text Entry box area */}
          <div className="p-3 border-t border-slate-100 bg-slate-50/20">
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me about interviews, resume metrics, standard learning paths, or career roadmaps..."
                id="message-text-entry"
                className="flex-1 bg-white border border-slate-200 rounded-xl text-xs px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-550 focus:border-brand-550 transition text-slate-700"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="bg-brand-550 hover:bg-blue-600 disabled:opacity-40 text-white font-bold p-2.5 rounded-xl transition shrink-0 cursor-pointer flex items-center justify-center shadow-sm"
              >
                <Send className="w-4 h-4 text-white" />
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
}
