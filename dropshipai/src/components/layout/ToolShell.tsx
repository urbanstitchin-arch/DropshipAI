import React, { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Check, Copy, RotateCcw, AlertCircle } from "lucide-react";

interface ToolShellProps {
  title: string;
  description: string;
  form: React.ReactNode;
  onRun: () => Promise<void>;
  result: string | null;
  loading: boolean;
  error: string | null;
  onReset: () => void;
  runLabel?: string;
}

export function ToolShell({
  title,
  description,
  form,
  onRun,
  result,
  loading,
  error,
  onReset,
  runLabel = "Generate",
}: ToolShellProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">{title}</h1>
        <p className="text-gray-400 mt-2 max-w-2xl">{description}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <GlassCard className="space-y-5">
          {form}
          <Button
            className="w-full"
            size="lg"
            onClick={onRun}
            isLoading={loading}
            disabled={loading}
          >
            {loading ? "Generating..." : runLabel}
          </Button>
        </GlassCard>

        {/* Output Panel */}
        <GlassCard className="flex flex-col min-h-[300px]">
          {error && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-4">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          {loading && (
            <div className="flex-1 flex flex-col items-center justify-center gap-4">
              <div className="w-10 h-10 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
              <p className="text-gray-400 text-sm animate-pulse">AI is generating your content...</p>
            </div>
          )}

          {!loading && !result && !error && (
            <div className="flex-1 flex flex-col items-center justify-center text-center gap-3 opacity-50">
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                <span className="text-2xl">✨</span>
              </div>
              <p className="text-gray-400 text-sm">Your result will appear here</p>
            </div>
          )}

          {result && !loading && (
            <div className="flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Result</span>
                <div className="flex gap-2">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors px-2 py-1 rounded-lg hover:bg-white/5 border border-transparent hover:border-white/10"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? "Copied!" : "Copy"}
                  </button>
                  <button
                    onClick={onReset}
                    className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors px-2 py-1 rounded-lg hover:bg-white/5 border border-transparent hover:border-white/10"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Reset
                  </button>
                </div>
              </div>
              <div className="flex-1 bg-white/3 border border-white/10 rounded-xl p-4 text-sm text-gray-200 whitespace-pre-wrap leading-relaxed overflow-y-auto max-h-[500px]">
                {result}
              </div>
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
}

export function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="block text-sm font-medium text-gray-300 mb-1.5">{children}</label>;
}

export function TextInput({ ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all text-sm"
    />
  );
}

export function TextareaInput({ ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all text-sm resize-none"
    />
  );
}

export function SelectInput({ children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement> & { children: React.ReactNode }) {
  return (
    <select
      {...props}
      className="w-full bg-[#0f0f1a] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all text-sm"
    >
      {children}
    </select>
  );
}
