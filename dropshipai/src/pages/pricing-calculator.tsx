import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { FieldLabel, TextInput } from "@/components/layout/ToolShell";
import { RotateCcw, TrendingUp, TrendingDown, IndianRupee, Target } from "lucide-react";

interface CalcResult {
  totalCost: number;
  deliveredProfit: number;
  rtoLoss: number;
  netProfit: number;
  margin: number;
  breakEvenROAS: number;
}

function calculate(
  productCost: number,
  shippingCost: number,
  adCost: number,
  sellingPrice: number,
  rtoRate: number
): CalcResult {
  const totalCost = productCost + shippingCost + adCost;
  const deliveredProfit = sellingPrice - productCost - shippingCost - adCost;
  const rtoLoss = (productCost + shippingCost) * (rtoRate / 100);
  const netProfit = deliveredProfit - rtoLoss;
  const margin = sellingPrice > 0 ? (netProfit / sellingPrice) * 100 : 0;
  const breakEvenROAS = adCost > 0 ? sellingPrice / adCost : 0;
  return { totalCost, deliveredProfit, rtoLoss, netProfit, margin, breakEvenROAS };
}

function MetricCard({
  label,
  value,
  sub,
  positive,
  neutral,
  icon: Icon,
}: {
  label: string;
  value: string;
  sub?: string;
  positive?: boolean;
  neutral?: boolean;
  icon?: React.ElementType;
}) {
  const color = neutral
    ? "text-white"
    : positive === true
    ? "text-green-400"
    : "text-red-400";

  return (
    <GlassCard className="space-y-1">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">{label}</p>
        {Icon && <Icon className="w-4 h-4 text-gray-500" />}
      </div>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      {sub && <p className="text-xs text-gray-500">{sub}</p>}
    </GlassCard>
  );
}

export default function PricingCalculatorPage() {
  const [productCost, setProductCost] = useState("");
  const [shippingCost, setShippingCost] = useState("60");
  const [adCost, setAdCost] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [rtoRate, setRtoRate] = useState("20");
  const [result, setResult] = useState<CalcResult | null>(null);

  const handleCalculate = () => {
    const p = parseFloat(productCost) || 0;
    const s = parseFloat(shippingCost) || 0;
    const a = parseFloat(adCost) || 0;
    const sp = parseFloat(sellingPrice) || 0;
    const r = parseFloat(rtoRate) || 0;
    if (!sp || !p) return;
    setResult(calculate(p, s, a, sp, r));
  };

  const handleReset = () => {
    setResult(null);
    setProductCost("");
    setShippingCost("60");
    setAdCost("");
    setSellingPrice("");
    setRtoRate("20");
  };

  const fmt = (n: number) => `₹${n.toFixed(0)}`;
  const fmtPct = (n: number) => `${n.toFixed(1)}%`;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Pricing Calculator</h1>
          <p className="text-gray-400 mt-2">Calculate exact profit margins with RTO impact — no guesswork.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Inputs */}
          <GlassCard className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <FieldLabel>Product Cost (₹) *</FieldLabel>
                <TextInput
                  type="number"
                  placeholder="e.g. 250"
                  value={productCost}
                  onChange={e => setProductCost(e.target.value)}
                />
              </div>
              <div>
                <FieldLabel>Selling Price (₹) *</FieldLabel>
                <TextInput
                  type="number"
                  placeholder="e.g. 999"
                  value={sellingPrice}
                  onChange={e => setSellingPrice(e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <FieldLabel>Shipping Cost (₹)</FieldLabel>
                <TextInput
                  type="number"
                  placeholder="e.g. 60"
                  value={shippingCost}
                  onChange={e => setShippingCost(e.target.value)}
                />
              </div>
              <div>
                <FieldLabel>Ad Spend per Order (₹)</FieldLabel>
                <TextInput
                  type="number"
                  placeholder="e.g. 150"
                  value={adCost}
                  onChange={e => setAdCost(e.target.value)}
                />
              </div>
            </div>
            <div>
              <FieldLabel>Expected RTO Rate (%)</FieldLabel>
              <TextInput
                type="number"
                placeholder="e.g. 20"
                value={rtoRate}
                onChange={e => setRtoRate(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">Industry average for COD in India: 20–35%</p>
            </div>
            <div className="flex gap-3">
              <Button className="flex-1" size="lg" onClick={handleCalculate}>
                Calculate
              </Button>
              {result && (
                <button
                  onClick={handleReset}
                  className="flex items-center gap-1.5 px-4 text-sm text-gray-400 hover:text-white rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}
            </div>
          </GlassCard>

          {/* Results */}
          <div className="space-y-4">
            {!result && (
              <GlassCard className="flex flex-col items-center justify-center min-h-[300px] opacity-50 gap-3">
                <IndianRupee className="w-10 h-10 text-gray-500" />
                <p className="text-gray-400 text-sm">Enter your numbers to see the breakdown</p>
              </GlassCard>
            )}

            {result && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <MetricCard
                    label="Total Cost"
                    value={fmt(result.totalCost)}
                    sub="Product + Shipping + Ads"
                    neutral
                    icon={IndianRupee}
                  />
                  <MetricCard
                    label="Net Profit"
                    value={fmt(result.netProfit)}
                    sub="After RTO deduction"
                    positive={result.netProfit >= 0}
                    icon={result.netProfit >= 0 ? TrendingUp : TrendingDown}
                  />
                  <MetricCard
                    label="Profit Margin"
                    value={fmtPct(result.margin)}
                    sub="Net / Selling price"
                    positive={result.margin >= 20}
                    icon={Target}
                  />
                  <MetricCard
                    label="Break-even ROAS"
                    value={result.breakEvenROAS > 0 ? `${result.breakEvenROAS.toFixed(2)}x` : "N/A"}
                    sub="Min return on ad spend"
                    neutral
                    icon={TrendingUp}
                  />
                </div>

                {/* Breakdown Table */}
                <GlassCard className="space-y-3">
                  <p className="text-xs font-semibold text-purple-400 uppercase tracking-wider">Full Breakdown</p>
                  {[
                    { label: "Selling Price", value: fmt(parseFloat(sellingPrice) || 0), highlight: true },
                    { label: "Product Cost", value: `− ${fmt(parseFloat(productCost) || 0)}` },
                    { label: "Shipping Cost", value: `− ${fmt(parseFloat(shippingCost) || 0)}` },
                    { label: "Ad Spend", value: `− ${fmt(parseFloat(adCost) || 0)}` },
                    { label: "Delivered Profit", value: fmt(result.deliveredProfit), border: true },
                    { label: `RTO Loss (${rtoRate}%)`, value: `− ${fmt(result.rtoLoss)}` },
                    { label: "Net Profit", value: fmt(result.netProfit), highlight: true, colored: true, positive: result.netProfit >= 0 },
                  ].map((row, i) => (
                    <div
                      key={i}
                      className={`flex justify-between text-sm py-1 ${row.border ? "border-t border-white/10 pt-2" : ""}`}
                    >
                      <span className={row.highlight && !row.colored ? "text-white font-medium" : "text-gray-400"}>{row.label}</span>
                      <span className={
                        row.colored
                          ? row.positive ? "text-green-400 font-bold" : "text-red-400 font-bold"
                          : row.highlight ? "text-white font-medium" : "text-gray-300"
                      }>
                        {row.value}
                      </span>
                    </div>
                  ))}
                </GlassCard>

                {/* Verdict */}
                <GlassCard className={`border ${result.margin >= 20 ? "border-green-500/30 bg-green-500/5" : result.margin >= 10 ? "border-yellow-500/30 bg-yellow-500/5" : "border-red-500/30 bg-red-500/5"}`}>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-1 ${result.margin >= 20 ? 'text-green-400' : result.margin >= 10 ? 'text-yellow-400' : 'text-red-400'}">
                    {result.margin >= 20 ? "Verdict: Profitable" : result.margin >= 10 ? "Verdict: Borderline" : "Verdict: Not Profitable"}
                  </p>
                  <p className="text-sm text-gray-300">
                    {result.margin >= 20
                      ? `Strong margins. You make ${fmt(result.netProfit)} per delivered order after RTO.`
                      : result.margin >= 10
                      ? "Thin margins. Consider reducing ad cost or increasing selling price."
                      : "Losing money. Raise your selling price or reduce costs before running ads."}
                  </p>
                </GlassCard>
              </>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
