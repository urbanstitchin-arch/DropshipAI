const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.1-8b-instant";

export function cleanOutput(text: string): string {
  return text
    .replace(/[\u{1F300}-\u{1FFFF}]/gu, "")
    .replace(/[\u{2600}-\u{26FF}]/gu, "")
    .replace(/[\u{2700}-\u{27BF}]/gu, "")
    .replace(/#\w+/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export async function generateAI(prompt: string, systemPrompt?: string): Promise<string> {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  if (!apiKey) throw new Error("VITE_GROQ_API_KEY is not configured.");

  const res = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        {
          role: "system",
          content: systemPrompt ||
            "You are an expert ecommerce consultant specializing in Indian dropshipping and Shopify. Provide direct, structured, actionable responses. No emojis. No filler. No hashtags.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.6,
      max_tokens: 1024,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Groq API error ${res.status}: ${err}`);
  }

  const data = await res.json();
  if (!data.choices) throw new Error(JSON.stringify(data));
  return cleanOutput(data.choices[0].message.content as string);
}

export async function generateImage(imagePrompt: string): Promise<string> {
  const apiKey = import.meta.env.VITE_HF_API_KEY;
  if (!apiKey) throw new Error("VITE_HF_API_KEY is not configured. Please add your HuggingFace API key.");

  const res = await fetch(
    "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ inputs: imagePrompt }),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Image generation error ${res.status}: ${err}`);
  }

  const blob = await res.blob();
  return URL.createObjectURL(blob);
}
