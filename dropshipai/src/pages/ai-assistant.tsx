import React, { useState, useRef, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Bot, User, Send, RotateCcw } from "lucide-react";
import { generateAI } from "@/lib/groq";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const STARTERS = [
  "How do I reduce my RTO rate below 15%?",
  "What products are trending in India right now?",
  "How to scale from 10 to 100 orders per day?",
  "How do I price a product for COD profitably?",
];

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text?: string) => {
    const content = text || input.trim();
    if (!content) return;

    const userMsg: Message = { id: Date.now().toString(), role: "user", content };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const prompt = `Act as an expert ecommerce consultant specializing in Indian Shopify dropshipping.

Give direct, actionable advice for: ${content}

Keep it concise and practical. Use rupees (Rs.) for any monetary figures. Structure with short paragraphs or numbered steps where appropriate. No emojis.`;

      const reply = await generateAI(prompt);
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: "assistant", content: reply }]);
    } catch {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I encountered an error. Please check your API key and try again.",
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">AI Assistant</h1>
            <p className="text-gray-400 mt-2">Direct, practical advice for your Indian dropshipping store.</p>
          </div>
          {messages.length > 0 && (
            <Button variant="ghost" size="sm" onClick={() => setMessages([])}>
              <RotateCcw className="w-4 h-4 mr-2" /> New Chat
            </Button>
          )}
        </div>

        <GlassCard className="flex flex-col" style={{ height: "calc(100vh - 280px)", minHeight: "500px" }}>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600/30 to-pink-600/30 border border-white/10 flex items-center justify-center">
                  <Bot className="w-8 h-8 text-purple-400" />
                </div>
                <div className="text-center">
                  <p className="text-white font-medium mb-1">Ecommerce Consultant</p>
                  <p className="text-gray-400 text-sm">Ask anything. Get direct, actionable answers.</p>
                </div>
                <div className="grid grid-cols-2 gap-3 w-full max-w-lg">
                  {STARTERS.map(s => (
                    <button
                      key={s}
                      onClick={() => sendMessage(s)}
                      className="text-left text-sm text-gray-300 bg-white/5 border border-white/10 rounded-xl px-4 py-3 hover:bg-white/10 hover:border-white/20 transition-all"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map(msg => (
              <div key={msg.id} className={cn("flex gap-3", msg.role === "user" ? "flex-row-reverse" : "flex-row")}>
                <div className={cn(
                  "w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center",
                  msg.role === "user"
                    ? "bg-gradient-to-br from-purple-600 to-pink-500"
                    : "bg-gradient-to-br from-indigo-600 to-purple-600"
                )}>
                  {msg.role === "user" ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
                </div>
                <div className={cn(
                  "max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap",
                  msg.role === "user"
                    ? "bg-gradient-to-br from-purple-600/30 to-pink-600/20 border border-purple-500/20 text-white"
                    : "bg-white/5 border border-white/10 text-gray-200"
                )}>
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full flex-shrink-0 bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="border-t border-white/10 p-4">
            <div className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage()}
                placeholder="Ask about RTO, scaling, pricing, ads..."
                disabled={loading}
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all text-sm disabled:opacity-50"
              />
              <Button onClick={() => sendMessage()} disabled={loading || !input.trim()} className="px-4">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </GlassCard>
      </div>
    </DashboardLayout>
  );
}
