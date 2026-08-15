"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import AIAssistant from "./AIAssistant";
import { INITIAL_PROFILE, INITIAL_CHAT } from "@/utils/mockData";
import { ChatMessage } from "@/types";
import { Bot, X } from "lucide-react";

export default function FloatingAIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(INITIAL_CHAT);

  // Safely grab auth context
  const authContext = useAuth();

  // Only render for authenticated students
  const isStudent = authContext?.isAuthenticated && authContext?.user?.role === "student";

  // Hide the AI assistant on specific pages where it might be intrusive, or if they are not logged in.
  // For now, only show it if they are logged in as a student.
  if (!isStudent) {
    return null;
  }

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-[100] flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-xl hover:bg-blue-700 hover:scale-105 transition-all duration-200"
        aria-label="Toggle AI Assistant"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Bot className="h-6 w-6" />}
      </button>

      {/* Floating Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-[100] w-[90vw] sm:w-[500px] lg:w-[800px] max-w-5xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden flex flex-col transition-all">
          <div className="flex items-center justify-between bg-blue-600 px-4 py-3 text-white">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              <h2 className="text-sm font-bold">StepUp AI Career Buddy</h2>
            </div>
            <button onClick={() => setIsOpen(false)} className="rounded-md hover:bg-blue-700 p-1 transition">
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="p-4 bg-[#F8FAFC] max-h-[80vh] overflow-y-auto">
            <AIAssistant
              profile={INITIAL_PROFILE}
              initialChatMessages={chatMessages}
              onSendMessage={setChatMessages}
              onClearChatHistory={() => setChatMessages([])}
            />
          </div>
        </div>
      )}
    </>
  );
}
