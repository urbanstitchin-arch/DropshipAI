import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { FieldLabel, TextInput, TextareaInput } from "@/components/layout/ToolShell";
import { generateAI, generateImage } from "@/lib/groq";
import { Copy, Check, Download, RotateCcw, AlertCircle, Image } from "lucide-react";

interface AdResult {
  headline: string;
  primaryText: string;
  cta: string;
  imagePrompt: string;
  imageUrl: string | null;
  imageError: string | null;
}

function parseAdOutput(raw: string): Omit<AdResult, "imageUrl" | "imageError"> {
  const get = (key: string) => {
    const match = raw.match(new RegExp(`${key}:\\s*(.+?)(?=\\n[A-Z]|$)`, "is"));
    return match ? match[1].trim() : "";
  };
  return {
    headline: get("Headline"),
    primaryText: get("Primary Text"),
    cta: get("Call To Action"),
    imagePrompt: get("Image Prompt"),
  };
}

export default function AdGeneratorPage() {
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [result, setResult] = useState<AdResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleRun = async () => {
    if (!productName.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const prompt = `Create a high-converting ecommerce ad for the Indian market.

Product: ${productName}
${description ? `Description: ${description}` : ""}

Return in EXACT format with these labels on separate lines:

Headline: [compelling headline under 10 words]
Primary Text: [2-3 sentence ad body targeting Indian buyers]
Call To Action: [action phrase, e.g. Shop Now, Order Today]
Image Prompt: realistic product photo, studio lighting, clean white background, professional ecommerce, ${productName}`;

      const raw = await generateAI(prompt);
      const parsed = parseAdOutput(raw);
      const adResult: AdResult = { ...parsed, imageUrl: null, imageError: null };
      setResult(adResult);
      setLoading(false);

      // Step 2: Generate image
      if (parsed.imagePrompt) {
        setImageLoading(true);
        try {
          const url = await generateImage(parsed.imagePrompt);
          setResult(prev => prev ? { ...prev, imageUrl: url } : null);
        } catch (imgErr: any) {
          setResult(prev => prev ? { ...prev, imageError: imgErr.message } : null);
        } finally {
          setImageLoading(false);
        }
      }
    } catch (e: any) {
      setError(e.message || "Failed to generate ad. Please try again.");
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
    setProductName("");
    setDescription("");
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(
      `Headline: ${result.headline}\n\nPrimary Text: ${result.primaryText}\n\nCTA: ${result.cta}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!result?.imageUrl) return;
    const a = document.createElement("a");
    a.href = result.imageUrl;
    a.download = `ad-${productName.replace(/\s+/g, "-").toLowerCase()}.png`;
    a.click();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">AI Ad Generator</h1>
          <p className="text-gray-400 mt-2">Generate structured ad copy and a product image in one click.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input */}
          <GlassCard className="space-y-4">
            <div>
              <FieldLabel>Product Name *</FieldLabel>
              <TextInput
                placeholder="e.g. Wireless Bluetooth Earbuds"
                value={productName}
                onChange={e => setProductName(e.target.value)}
              />
            </div>
            <div>
              <FieldLabel>Product Description</FieldLabel>
              <TextareaInput
                rows={4}
                placeholder="Key features, target audience, unique selling points..."
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </div>
            <Button className="w-full" size="lg" onClick={handleRun} isLoading={loading} disabled={loading || imageLoading}>
              {loading ? "Generating Ad Copy..." : imageLoading ? "Generating Image..." : "Generate Ad"}
            </Button>
          </GlassCard>

          {/* Output */}
          <div className="space-y-4">
            {error && (
              <GlassCard className="flex items-start gap-2 text-red-400 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                {error}
              </GlassCard>
            )}

            {!result && !error && !loading && (
              <GlassCard className="flex flex-col items-center justify-center min-h-[300px] opacity-50 gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <span className="text-2xl">✨</span>
                </div>
                <p className="text-gray-400 text-sm">Your ad will appear here</p>
              </GlassCard>
            )}

            {loading && (
              <GlassCard className="flex flex-col items-center justify-center min-h-[300px] gap-4">
                <div className="w-10 h-10 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
                <p className="text-gray-400 text-sm animate-pulse">Writing your ad copy...</p>
              </GlassCard>
            )}

            {result && !loading && (
              <>
                {/* Copy Controls */}
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? "Copied!" : "Copy Text"}
                  </button>
                  <button
                    onClick={handleReset}
                    className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Reset
                  </button>
                </div>

                {/* Headline */}
                <GlassCard className="space-y-1">
                  <p className="text-xs font-semibold text-purple-400 uppercase tracking-wider">Headline</p>
                  <p className="text-white font-semibold text-lg leading-snug">{result.headline}</p>
                </GlassCard>

                {/* Primary Text */}
                <GlassCard className="space-y-1">
                  <p className="text-xs font-semibold text-purple-400 uppercase tracking-wider">Primary Text</p>
                  <p className="text-gray-200 text-sm leading-relaxed">{result.primaryText}</p>
                </GlassCard>

                {/* CTA */}
                <GlassCard className="space-y-1">
                  <p className="text-xs font-semibold text-purple-400 uppercase tracking-wider">Call To Action</p>
                  <p className="text-white font-medium">{result.cta}</p>
                </GlassCard>

                {/* Image */}
                <GlassCard className="space-y-3">
                  <p className="text-xs font-semibold text-purple-400 uppercase tracking-wider">Generated Image</p>
                  {imageLoading && (
                    <div className="flex items-center justify-center gap-3 h-32 text-gray-400 text-sm">
                      <div className="w-6 h-6 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
                      Generating product image...
                    </div>
                  )}
                  {result.imageError && (
                    <div className="flex items-center gap-2 text-yellow-400 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      {result.imageError}
                    </div>
                  )}
                  {result.imageUrl && (
                    <div className="space-y-3">
                      <img src={result.imageUrl} alt="Generated product ad" className="w-full rounded-xl border border-white/10" />
                      <button
                        onClick={handleDownload}
                        className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                      >
                        <Download className="w-3.5 h-3.5" /> Download Image
                      </button>
                    </div>
                  )}
                  {!imageLoading && !result.imageUrl && !result.imageError && (
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <Image className="w-4 h-4" />
                      Image generation not started
                    </div>
                  )}
                </GlassCard>
              </>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
