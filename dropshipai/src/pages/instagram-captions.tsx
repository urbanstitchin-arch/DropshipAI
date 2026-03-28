import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { FieldLabel, TextInput, TextareaInput, SelectInput } from "@/components/layout/ToolShell";
import { generateAI } from "@/lib/groq";
import { Copy, Check, RotateCcw, AlertCircle } from "lucide-react";

interface Caption {
  number: string;
  text: string;
}

function parseCaptions(raw: string): Caption[] {
  const blocks = raw.split(/\n(?=Caption\s*\d)/i).filter(b => b.trim());
  if (blocks.length > 1) {
    return blocks.map((block, i) => {
      const lines = block.replace(/^Caption\s*\d[\s:.]*\n?/i, "").trim();
      return { number: `Caption ${i + 1}`, text: lines };
    });
  }
  // Fallback: split by double newlines
  const parts = raw.split(/\n\n+/).filter(p => p.trim().length > 20);
  return parts.slice(0, 3).map((p, i) => ({ number: `Caption ${i + 1}`, text: p.trim() }));
}

export default function InstagramCaptionsPage() {
  const [productName, setProductName] = useState("");
  const [productDetails, setProductDetails] = useState("");
  const [contentType, setContentType] = useState("Reel");
  const [mood, setMood] = useState("Conversion-focused");
  const [captions, setCaptions] = useState<Caption[] | null>(null);
  const [rawResult, setRawResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleRun = async () => {
    if (!productName.trim()) return;
    setLoading(true);
    setError(null);
    setCaptions(null);
    setRawResult(null);
    try {
      const prompt = `Write 3 Instagram ${contentType} captions for: ${productName}
${productDetails ? `Details: ${productDetails}` : ""}
Mood: ${mood}

Format EXACTLY as:

Caption 1:
[caption text, 2-4 sentences, conversion-focused for Indian buyers]

Caption 2:
[caption text, different angle]

Caption 3:
[caption text, different angle]

No emojis. No hashtags. Clean, professional copy only.`;
      const raw = await generateAI(prompt);
      const parsed = parseCaptions(raw);
      if (parsed.length > 0) {
        setCaptions(parsed);
      } else {
        setRawResult(raw);
      }
    } catch (e: any) {
      setError(e.message || "Failed to generate captions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleReset = () => {
    setCaptions(null);
    setRawResult(null);
    setError(null);
    setProductName("");
    setProductDetails("");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Instagram Captions</h1>
          <p className="text-gray-400 mt-2">Generate 3 clean, conversion-focused captions ready to post.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Input */}
          <GlassCard className="space-y-4">
            <div>
              <FieldLabel>Product Name *</FieldLabel>
              <TextInput
                placeholder="e.g. Posture Corrector Belt"
                value={productName}
                onChange={e => setProductName(e.target.value)}
              />
            </div>
            <div>
              <FieldLabel>Key Selling Points</FieldLabel>
              <TextareaInput
                rows={3}
                placeholder="What makes it special? Who is it for?"
                value={productDetails}
                onChange={e => setProductDetails(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <FieldLabel>Content Type</FieldLabel>
                <SelectInput value={contentType} onChange={e => setContentType(e.target.value)}>
                  <option>Reel</option>
                  <option>Post</option>
                  <option>Story</option>
                </SelectInput>
              </div>
              <div>
                <FieldLabel>Tone</FieldLabel>
                <SelectInput value={mood} onChange={e => setMood(e.target.value)}>
                  <option>Conversion-focused</option>
                  <option>Storytelling</option>
                  <option>Problem-solution</option>
                  <option>Urgency / Sale</option>
                  <option>Luxury</option>
                </SelectInput>
              </div>
            </div>
            <div className="flex gap-3">
              <Button className="flex-1" size="lg" onClick={handleRun} isLoading={loading} disabled={loading}>
                {loading ? "Generating..." : "Generate Captions"}
              </Button>
              {(captions || rawResult) && (
                <button
                  onClick={handleReset}
                  className="flex items-center gap-1.5 px-4 text-sm text-gray-400 hover:text-white rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}
            </div>
          </GlassCard>

          {/* Output */}
          <div className="space-y-4">
            {error && (
              <GlassCard className="flex items-start gap-2 text-red-400 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" /> {error}
              </GlassCard>
            )}

            {loading && (
              <GlassCard className="flex flex-col items-center justify-center min-h-[200px] gap-4">
                <div className="w-10 h-10 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
                <p className="text-gray-400 text-sm animate-pulse">Writing captions...</p>
              </GlassCard>
            )}

            {!loading && !captions && !rawResult && !error && (
              <GlassCard className="flex flex-col items-center justify-center min-h-[200px] opacity-50 gap-3">
                <p className="text-gray-400 text-sm">3 captions will appear here</p>
              </GlassCard>
            )}

            {captions && captions.map((c, i) => (
              <GlassCard key={i} className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-purple-400 uppercase tracking-wider">{c.number}</p>
                  <button
                    onClick={() => handleCopy(c.text, i)}
                    className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white px-2 py-1 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                  >
                    {copiedIndex === i ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedIndex === i ? "Copied!" : "Copy"}
                  </button>
                </div>
                <p className="text-gray-200 text-sm leading-relaxed whitespace-pre-wrap">{c.text}</p>
              </GlassCard>
            ))}

            {rawResult && !captions && (
              <GlassCard className="text-sm text-gray-200 whitespace-pre-wrap leading-relaxed">
                {rawResult}
              </GlassCard>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
