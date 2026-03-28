import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { 
  Home, Zap, Calculator, Search, Bot, 
  FileText, Trophy, Instagram, Menu,
  Bell, Search as SearchIcon, User, LogOut, Store, CheckCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/contexts/AuthContext";

const NAV_ITEMS = [
  { path: "/dashboard", label: "Dashboard", icon: Home },
  { path: "/ad-generator", label: "Ad Generator", icon: Zap },
  { path: "/pricing-calculator", label: "Pricing Calculator", icon: Calculator },
  { path: "/product-sourcing", label: "Product Sourcing", icon: Search },
  { path: "/ai-assistant", label: "AI Assistant", icon: Bot },
  { path: "/description-writer", label: "Description Writer", icon: FileText },
  { path: "/winning-products", label: "Winning Products", icon: Trophy },
  { path: "/instagram-captions", label: "Instagram Captions", icon: Instagram },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, shopifyStatus, shopifyLoading, connectShopify, logout } = useAuth();

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2 group cursor-pointer">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center shadow-[0_0_15px_-3px_rgba(124,58,237,0.5)] group-hover:shadow-[0_0_20px_0px_rgba(236,72,153,0.6)] transition-all">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            Dropship<span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-400">AI</span>
          </span>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = location === item.path;
          const Icon = item.icon;
          return (
            <Link key={item.path} href={item.path} className="block">
              <div
                className={cn(
                  "relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer group",
                  isActive
                    ? "bg-gradient-to-r from-purple-500/20 to-pink-500/10 text-white border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]"
                    : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
                )}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-nav-indicator"
                    className="absolute left-0 w-1 h-8 bg-gradient-to-b from-purple-500 to-pink-500 rounded-r-full"
                    initial={false}
                  />
                )}
                <Icon className={cn("w-5 h-5 transition-colors", isActive ? "text-pink-400" : "group-hover:text-purple-400")} />
                <span className="font-medium text-sm">{item.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mt-auto border-t border-white/10 space-y-2">
        {user ? (
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 overflow-hidden">
              {user.avatar
                ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                : <User className="w-4 h-4 text-white" />
              }
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user.name}</p>
              <p className="text-xs text-gray-400 truncate">{user.email}</p>
            </div>
            <button
              onClick={logout}
              title="Logout"
              className="text-gray-500 hover:text-red-400 transition-colors p-1 rounded"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <Link href="/auth" className="block">
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
              <User className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-400">Sign In</span>
            </div>
          </Link>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050508] text-white flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col fixed inset-y-0 z-50 bg-[#08080d]/90 backdrop-blur-md border-r border-white/10">
        <SidebarContent />
      </aside>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.aside
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-72 z-50 bg-[#08080d]/95 backdrop-blur-md border-r border-white/10 md:hidden"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen md:pl-64">
        {/* Topbar */}
        <header className="h-16 flex items-center justify-between px-4 sm:px-8 border-b border-white/5 sticky top-0 z-30 bg-[#050508]/80 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <button
              className="md:hidden p-2 text-gray-400 hover:text-white"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="hidden sm:flex items-center bg-white/5 border border-white/10 rounded-full px-3 py-1.5 focus-within:ring-1 focus-within:ring-purple-500/50 transition-all">
              <SearchIcon className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search tools..."
                className="bg-transparent border-none outline-none text-sm text-white px-2 placeholder:text-gray-500 w-48 lg:w-64"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="relative p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/5">
              <Bell className="w-5 h-5" />
            </button>

            {shopifyLoading ? (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm text-gray-400">
                <Store className="w-4 h-4 animate-pulse" />
                <span>Checking...</span>
              </div>
            ) : shopifyStatus?.connected ? (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20 text-sm text-green-400">
                <CheckCircle className="w-4 h-4" />
                <span>{shopifyStatus.storeName || "Connected"}</span>
              </div>
            ) : (
              <Button variant="glass" size="sm" onClick={connectShopify} className="hidden sm:flex gap-2">
                <Store className="w-4 h-4" />
                Connect Store
              </Button>
            )}
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-4 sm:p-8 overflow-x-hidden">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-6xl mx-auto w-full"
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
