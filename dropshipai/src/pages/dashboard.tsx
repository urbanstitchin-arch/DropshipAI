import React, { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { IndianRupee, ShoppingCart, Package, RefreshCw, Store, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { dashboard } from "@/lib/api";

interface DashboardData {
  revenue: number;
  orders: number;
  products: number;
  recentActivity?: Array<{ id: string; type: string; title: string; time: string }>;
}

export default function DashboardPage() {
  const [, setLocation] = useLocation();
  const { user, loading: authLoading, shopifyStatus, connectShopify, refreshShopify } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [dataLoading, setDataLoading] = useState(false);
  const [dataError, setDataError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      setLocation("/auth");
    }
  }, [user, authLoading, setLocation]);

  const fetchDashboard = async () => {
    setDataLoading(true);
    setDataError(null);
    try {
      const result = await dashboard.getData();
      setData(result);
    } catch (err) {
      setDataError("Could not load dashboard data.");
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchDashboard();
  }, [user]);

  if (authLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-8 h-8 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  const stats = [
    {
      label: "Revenue",
      value: data ? `₹${data.revenue.toLocaleString("en-IN")}` : "₹—",
      sub: shopifyStatus?.connected ? "Total revenue" : "Connect store to see revenue",
      icon: IndianRupee,
      color: "purple",
    },
    {
      label: "Orders",
      value: data ? String(data.orders) : "—",
      sub: "Total orders",
      icon: ShoppingCart,
      color: "pink",
    },
    {
      label: "Products",
      value: data ? String(data.products) : "—",
      sub: "Active products",
      icon: Package,
      color: "orange",
    },
  ];

  const colorMap: Record<string, string> = {
    purple: "bg-purple-500/10 border-purple-500/20 text-purple-400",
    pink: "bg-pink-500/10 border-pink-500/20 text-pink-400",
    orange: "bg-orange-500/10 border-orange-500/20 text-orange-400",
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""}
            </h1>
            <p className="text-gray-400 mt-1">Here's what's happening with your store today.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="hidden sm:flex"
              onClick={() => { refreshShopify(); fetchDashboard(); }}
              isLoading={dataLoading}
            >
              <RefreshCw className="w-4 h-4 mr-2" /> Refresh
            </Button>
          </div>
        </div>

        {dataError && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {dataError}
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <GlassCard key={stat.label} className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-2 rounded-lg border ${colorMap[stat.color]}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <div>
                  {dataLoading ? (
                    <div className="h-9 w-24 bg-white/5 rounded animate-pulse mb-2" />
                  ) : (
                    <p className="text-3xl font-bold text-white">{stat.value}</p>
                  )}
                  <p className="text-sm text-gray-400 mt-1">{stat.sub}</p>
                </div>
              </GlassCard>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chart / Connect CTA */}
          <div className="lg:col-span-2">
            {shopifyStatus?.connected ? (
              <GlassCard className="h-full min-h-[300px] flex flex-col items-center justify-center p-8 border-dashed border-white/20">
                <p className="text-gray-400 text-center">Revenue chart will appear here once data is available.</p>
              </GlassCard>
            ) : (
              <GlassCard className="h-full min-h-[300px] flex flex-col items-center justify-center p-8 border-dashed border-white/20">
                <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                  <Store className="w-8 h-8 text-gray-500" />
                </div>
                <h3 className="text-xl font-medium text-white mb-2">Connect Your Store</h3>
                <p className="text-gray-400 text-center max-w-sm mb-6">
                  Connect your Shopify store to visualize revenue, orders, and AI-driven growth metrics.
                </p>
                <Button onClick={connectShopify}>Connect Shopify Store</Button>
              </GlassCard>
            )}
          </div>

          {/* Recent Activity */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white">Recent Activity</h2>
            <GlassCard className="p-0 overflow-hidden">
              {data?.recentActivity && data.recentActivity.length > 0 ? (
                data.recentActivity.map((item) => (
                  <div key={item.id} className="p-4 border-b border-white/5 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center flex-shrink-0">
                      <Store className="w-4 h-4 text-purple-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white truncate">{item.title}</p>
                      <p className="text-xs text-gray-500">{item.time}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center">
                  <p className="text-sm text-gray-400">No activity yet.</p>
                  <p className="text-xs text-gray-500 mt-1">Your generated assets will appear here.</p>
                </div>
              )}
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-4 border-b border-white/5 flex items-center gap-4 opacity-20">
                  <div className="w-10 h-10 rounded bg-white/5 animate-pulse" />
                  <div className="space-y-2 flex-1">
                    <div className="h-3 w-3/4 bg-white/5 rounded animate-pulse" />
                    <div className="h-2 w-1/2 bg-white/5 rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </GlassCard>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
