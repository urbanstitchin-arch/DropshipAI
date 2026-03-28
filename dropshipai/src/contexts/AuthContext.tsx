import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { auth, shopify, User, ShopifyStatus } from "@/lib/api";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  shopifyStatus: ShopifyStatus | null;
  shopifyLoading: boolean;
  connectShopify: () => void;
  refreshShopify: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  shopifyStatus: null,
  shopifyLoading: false,
  connectShopify: () => {},
  refreshShopify: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [shopifyStatus, setShopifyStatus] = useState<ShopifyStatus | null>(null);
  const [shopifyLoading, setShopifyLoading] = useState(false);

  const loadUser = useCallback(async () => {
    try {
      const u = await auth.getUser();
      setUser(u);
    } catch {
      setUser(null);
      localStorage.removeItem("dropshipai_token");
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshShopify = useCallback(async () => {
    setShopifyLoading(true);
    try {
      const status = await shopify.getStatus();
      setShopifyStatus(status);
    } catch {
      setShopifyStatus({ connected: false });
    } finally {
      setShopifyLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("dropshipai_token");
    if (token) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, [loadUser]);

  useEffect(() => {
    if (user) {
      refreshShopify();
    }
  }, [user, refreshShopify]);

  const connectShopify = useCallback(() => {
    const url = shopify.getConnectUrl();
    const width = 600;
    const height = 700;
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;
    const popup = window.open(
      url,
      "shopify-connect",
      `width=${width},height=${height},left=${left},top=${top},scrollbars=yes`
    );

    const poll = setInterval(async () => {
      if (!popup || popup.closed) {
        clearInterval(poll);
        await refreshShopify();
        return;
      }
      try {
        const status = await shopify.getStatus();
        if (status.connected) {
          clearInterval(poll);
          popup.close();
          setShopifyStatus(status);
        }
      } catch {
      }
    }, 2000);
  }, [refreshShopify]);

  const logout = useCallback(() => {
    auth.logout();
    setUser(null);
    setShopifyStatus(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, shopifyStatus, shopifyLoading, connectShopify, refreshShopify, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
