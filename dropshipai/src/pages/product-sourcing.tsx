import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { FieldLabel, TextInput, SelectInput } from "@/components/layout/ToolShell";
import { generateAI } from "@/lib/groq";
import { ExternalLink, RotateCcw, AlertCircle } from "lucide-react";

interface Supplier {
  name: string;
  platform: string;
  priceRange: string;
  moq: string;
  location: string;
  searchLink: string;
  reason: string;
}

function parseSuppliers(raw: string): Supplier[] {
  const blocks = raw.split(/\n(?=Supplier Name:)/i).filter(b => b.trim());
  return blocks.map(block => {
    const get = (key: string) => {
      const match = block.match(new RegExp(`${key}:\\s*(.+?)(?=\\n[A-Za-z]|$)`, "is"));
      return match ? match[1].trim() : "";
    };
    return {
      name: get("Supplier Name"),
      platform: get("Platform"),
      priceRange: get("Price Range"),
      moq: get("MOQ"),
      location: get("Location"),
      searchLink: get("Search Link"),
      reason: get("Why it's good") || get("Why its good"),
    };
  }).filter(s => s.name);
}

export default function ProductSourcingPage() {
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("Any");
  const [budget, setBudget] = useState("");
  const [suppliers, setSuppliers] = useState<Supplier[] | null>(null);
  const [rawResult, setRawResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRun = async () => {
    if (!keyword.trim()) return;
    setLoading(true);
    setError(null);
    setSuppliers(null);
    setRawResult(null);
    try {
      const prompt = `List 5 real Indian suppliers for: ${keyword}
${category !== "Any" ? `Category: ${category}` : ""}
${budget ? `Max budget per unit: Rs.${budget}` : ""}

Return EXACTLY in this format, repeating for each supplier:

Supplier Name: [name]
Platform: [IndiaMart / Roposo / Meesho / GlowRoad / Alibaba / AliExpress / Direct]
Price Range: [e.g. Rs.80-150 per unit]
MOQ: [minimum order quantity]
Location: [city, state]
Search Link: [direct search URL or platform homepage]
Why it's good: [one sentence]

No extra text. No paragraphs. Just the 5 supplier blocks.`;

      const raw = await generateAI(prompt);
      const parsed = parseSuppliers(raw);
      if (parsed.length > 0) {
        setSuppliers(parsed);
      } else {
        setRawResult(raw);
      }
    } catch (e: any) {
      setError(e.message || "Failed to find suppliers. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSuppliers(null);
    setRawResult(null);
    setError(null);
    setKeyword("");
    setBudget("");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Product Sourcing</h1>
          <p className="text-gray-400 mt-2">Find verified Indian suppliers with pricing, MOQ, and direct links.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Input */}
          <GlassCard className="space-y-4">
            <div>
              <FieldLabel>Product *</FieldLabel>
              <TextInput
                placeholder="e.g. Bluetooth earbuds, LED strip lights"
                value={keyword}
                onChange={e => setKeyword(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <FieldLabel>Category</FieldLabel>
                <SelectInput value={category} onChange={e => setCategory(e.target.value)}>
                  <option>Any</option>
                  <option>Electronics</option>
                  <option>Fashion</option>
                  <option>Home & Kitchen</option>
                  <option>Health & Beauty</option>
                  <option>Sports</option>
                  <option>Toys & Games</option>
                </SelectInput>
              </div>
              <div>
                <FieldLabel>Max Budget (₹/unit)</FieldLabel>
                <TextInput
                  type="number"
                  placeholder="e.g. 300"
                  value={budget}
                  onChange={e => setBudget(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-3">
              <Button className="flex-1" size="lg" onClick={handleRun} isLoading={loading} disabled={loading}>
                {loading ? "Searching..." : "Find Suppliers"}
              </Button>
              {(suppliers || rawResult) && (
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
                <p className="text-gray-400 text-sm animate-pulse">Finding suppliers...</p>
              </GlassCard>
            )}

            {!loading && !suppliers && !rawResult && !error && (
              <GlassCard className="flex flex-col items-center justify-center min-h-[200px] opacity-50 gap-3">
                <p className="text-gray-400 text-sm">Supplier cards will appear here</p>
              </GlassCard>
            )}

            {/* Structured supplier cards */}
            {suppliers && suppliers.map((s, i) => (
              <GlassCard key={i} className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-white font-semibold">{s.name}</p>
                    <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/20 mt-1">
                      {s.platform}
                    </span>
                  </div>
                  {s.searchLink && (
                    <a
                      href={s.searchLink.startsWith("http") ? s.searchLink : `https://${s.searchLink}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs text-purple-400 hover:text-purple-300 px-3 py-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20 hover:bg-purple-500/20 transition-all flex-shrink-0"
                    >
                      Open Supplier <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-3 text-sm">
                  <div>
                    <p className="text-gray-500 text-xs">Price Range</p>
                    <p className="text-gray-200">{s.priceRange || "—"}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">MOQ</p>
                    <p className="text-gray-200">{s.moq || "—"}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Location</p>
                    <p className="text-gray-200">{s.location || "—"}</p>
                  </div>
                </div>
                {s.reason && (
                  <p className="text-gray-400 text-sm border-t border-white/5 pt-2">{s.reason}</p>
                )}
              </GlassCard>
            ))}

            {/* Fallback plain text if parsing failed */}
            {rawResult && !suppliers && (
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
