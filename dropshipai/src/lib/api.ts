const TOOLS_BASE = "https://dropshipai.in/api";
const CORE_BASE = "https://app.dropshipai.in/api";

function getToken(): string | null {
  return localStorage.getItem("dropshipai_token");
}

function authHeaders(): HeadersInit {
  const token = getToken();
  return token
    ? { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
    : { "Content-Type": "application/json" };
}

async function coreGet<T>(path: string): Promise<T> {
  const res = await fetch(`${CORE_BASE}${path}`, { headers: authHeaders() });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
}

async function corePost<T>(path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${CORE_BASE}${path}`, {
    method: "POST",
    headers: authHeaders(),
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
}

async function toolPost<T>(path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${TOOLS_BASE}${path}`, {
    method: "POST",
    headers: authHeaders(),
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface DashboardData {
  revenue: number;
  orders: number;
  products: number;
  recentActivity?: Array<{ id: string; type: string; title: string; time: string }>;
}

export interface ShopifyStatus {
  connected: boolean;
  storeName?: string;
  storeUrl?: string;
}

export const auth = {
  getUser: () => coreGet<User>("/user"),
  logout: async () => {
    localStorage.removeItem("dropshipai_token");
  },
  getGoogleLoginUrl: () => `${CORE_BASE}/auth/google`,
};

export const shopify = {
  getConnectUrl: () => `${CORE_BASE}/shopify/connect`,
  getStatus: () => coreGet<ShopifyStatus>("/shopify/status"),
};

export const dashboard = {
  getData: () => coreGet<DashboardData>("/dashboard"),
};

export const tools = {
  generateAd: (body: unknown) => toolPost<{ result: string }>("/ad-generator", body),
  calculatePricing: (body: unknown) => toolPost<{ result: string }>("/pricing", body),
  sourceProducts: (body: unknown) => toolPost<{ result: string }>("/products", body),
  chat: (body: unknown) => toolPost<{ result: string }>("/chat", body),
  writeDescription: (body: unknown) => toolPost<{ result: string }>("/description", body),
  getWinningProducts: (body: unknown) => toolPost<{ result: string }>("/winning", body),
  generateCaptions: (body: unknown) => toolPost<{ result: string }>("/captions", body),
};

export { getToken };
