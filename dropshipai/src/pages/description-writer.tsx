import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ToolShell, FieldLabel, TextInput, TextareaInput, SelectInput } from "@/components/layout/ToolShell";
import { generateAI } from "@/lib/groq";

export default function DescriptionWriterPage() {
  const [productName, setProductName] = useState("");
  const [features, setFeatures] = useState("");
  const [audience, setAudience] = useState("General");
  const [length, setLength] = useState("Medium");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRun = async () => {
    if (!productName.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const wordCount = length === "Short" ? "80-120" : length === "Medium" ? "180-250" : "350-450";
      const prompt = `Write a professional ecommerce product description for an Indian Shopify store.

Product: ${productName}
${features ? `Features:\n${features}` : ""}
Target Audience: ${audience}
Word Count: ${wordCount} words

Structure your output EXACTLY as:

Headline:
[compelling headline]

Key Benefits:
- [benefit 1]
- [benefit 2]
- [benefit 3]
- [benefit 4]

Description:
[detailed product description focused on value for Indian buyers]

Call to Action:
[clear CTA]

No emojis. No hashtags. No filler phrases. Professional tone.`;
      const output = await generateAI(prompt);
      setResult(output);
    } catch (e: any) {
      setError(e.message || "Failed to write description. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => { setResult(null); setError(null); setProductName(""); setFeatures(""); };

  return (
    <DashboardLayout>
      <ToolShell
        title="Description Writer"
        description="Create structured, SEO-ready product descriptions with headlines, bullet benefits, and a clear call to action."
        runLabel="Write Description"
        result={result}
        loading={loading}
        error={error}
        onRun={handleRun}
        onReset={handleReset}
        form={
          <div className="space-y-4">
            <div>
              <FieldLabel>Product Name *</FieldLabel>
              <TextInput
                placeholder="e.g. Wireless Noise Cancelling Headphones"
                value={productName}
                onChange={e => setProductName(e.target.value)}
              />
            </div>
            <div>
              <FieldLabel>Key Features / USPs</FieldLabel>
              <TextareaInput
                placeholder="One feature per line, e.g.&#10;40hr battery life&#10;Active noise cancellation&#10;IPX5 water resistant"
                rows={4}
                value={features}
                onChange={e => setFeatures(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <FieldLabel>Target Audience</FieldLabel>
                <SelectInput value={audience} onChange={e => setAudience(e.target.value)}>
                  <option>General</option>
                  <option>Students</option>
                  <option>Professionals</option>
                  <option>Gamers</option>
                  <option>Fitness Enthusiasts</option>
                  <option>Homemakers</option>
                </SelectInput>
              </div>
              <div>
                <FieldLabel>Length</FieldLabel>
                <SelectInput value={length} onChange={e => setLength(e.target.value)}>
                  <option>Short</option>
                  <option>Medium</option>
                  <option>Long</option>
                </SelectInput>
              </div>
            </div>
          </div>
        }
      />
    </DashboardLayout>
  );
}
