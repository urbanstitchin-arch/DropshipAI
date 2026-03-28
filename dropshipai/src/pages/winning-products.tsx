import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ToolShell, FieldLabel, SelectInput, TextInput } from "@/components/layout/ToolShell";
import { generateAI } from "@/lib/groq";

export default function WinningProductsPage() {
  const [category, setCategory] = useState("Any");
  const [priceRange, setPriceRange] = useState("Any");
  const [niche, setNiche] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRun = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const prompt = `Suggest winning dropshipping products currently trending in the Indian e-commerce market.

Filters:
- Category: ${category}
- Price Range: ${priceRange}
${niche ? `- Niche / Interest: ${niche}` : ""}

For each product provide:
1. Product Name
2. Why it's winning right now in India (trend reason)
3. Estimated sourcing cost (₹)
4. Recommended selling price (₹)
5. Estimated profit margin after RTO
6. Best platform to sell (Shopify, Meesho, etc.)
7. Target audience on Facebook/Instagram
8. Potential monthly revenue estimate
9. Competition level (Low / Medium / High)
10. Quick tip to stand out from competitors

List at least 5 products. Be specific to the current Indian market trends.`;
      const output = await generateAI(prompt);
      setResult(output);
    } catch (e: any) {
      setError(e.message || "Failed to fetch winning products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => { setResult(null); setError(null); setNiche(""); };

  return (
    <DashboardLayout>
      <ToolShell
        title="Winning Products"
        description="Discover products currently trending in the Indian market with low competition, high demand, and strong profit margins."
        runLabel="Find Winning Products"
        result={result}
        loading={loading}
        error={error}
        onRun={handleRun}
        onReset={handleReset}
        form={
          <div className="space-y-4">
            <div>
              <FieldLabel>Your Niche / Interest (optional)</FieldLabel>
              <TextInput
                placeholder="e.g. fitness, home decor, pet accessories"
                value={niche}
                onChange={e => setNiche(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <FieldLabel>Category</FieldLabel>
                <SelectInput value={category} onChange={e => setCategory(e.target.value)}>
                  <option>Any</option>
                  <option>Electronics</option>
                  <option>Fashion & Accessories</option>
                  <option>Home & Kitchen</option>
                  <option>Health & Beauty</option>
                  <option>Sports & Fitness</option>
                  <option>Toys & Games</option>
                  <option>Pet Supplies</option>
                  <option>Automobile</option>
                </SelectInput>
              </div>
              <div>
                <FieldLabel>Price Range (₹)</FieldLabel>
                <SelectInput value={priceRange} onChange={e => setPriceRange(e.target.value)}>
                  <option>Any</option>
                  <option>Under ₹500</option>
                  <option>₹500 – ₹1000</option>
                  <option>₹1000 – ₹2500</option>
                  <option>₹2500+</option>
                </SelectInput>
              </div>
            </div>
          </div>
        }
      />
    </DashboardLayout>
  );
}
