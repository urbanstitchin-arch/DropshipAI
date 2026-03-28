import React from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { 
  Bot, Zap, Search, FileText, 
  ChevronRight, BarChart3, Globe, 
  Instagram, Target, CheckCircle2 
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { cn } from "@/lib/utils";

const FEATURES = [
  { icon: Zap, title: "AI Ad Generator", desc: "Create high-converting FB & Insta video ads in seconds without editing skills.", href: "/ad-generator" },
  { icon: BarChart3, title: "Pricing Calculator", desc: "Calculate exact profit margins considering RTO, Indian shipping, and ad costs.", href: "/pricing-calculator" },
  { icon: Search, title: "Product Sourcing", desc: "Find trusted Indian suppliers (IndiaMart, Roposo) for winning products instantly.", href: "/product-sourcing" },
  { icon: Bot, title: "AI Assistant", desc: "24/7 expert advice on scaling your specific store and fixing low conversion rates.", href: "/ai-assistant" },
  { icon: FileText, title: "Description Writer", desc: "SEO-optimized product descriptions that speak to the Indian buyer psychology.", href: "/description-writer" },
  { icon: Instagram, title: "Instagram Captions", desc: "Viral reel captions and hashtags tailored for the Indian e-commerce market.", href: "/instagram-captions" },
];

export default function LandingPage() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-[#050508] text-white selection:bg-purple-500/30">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-600/20 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[60%] bg-pink-600/20 blur-[150px] rounded-full mix-blend-screen" />
        <img 
          src={`${import.meta.env.BASE_URL}images/hero-glow.png`} 
          alt="" 
          className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-screen"
        />
      </div>

      {/* Navbar */}
      <nav className="relative z-50 flex items-center justify-between px-6 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">Dropship<span className="text-pink-500">AI</span></span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-white transition-colors">How it Works</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" className="hidden sm:inline-flex" onClick={() => setLocation("/auth")}>Login</Button>
          <Button onClick={() => setLocation("/auth")}>Start for Free</Button>
        </div>
      </nav>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="pt-20 pb-32 px-6 max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-purple-300 mb-6 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
              </span>
              Built exclusively for Indian Dropshippers 🇮🇳
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
              Scale Your Shopify Store with <span className="text-gradient">AI Power</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-400 mb-8 leading-relaxed">
              Stop guessing. Automate your ad creatives, find winning products, and calculate exact margins to dominate the Indian e-commerce market.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="w-full sm:w-auto" onClick={() => setLocation("/auth")}>
                Start 7-Day Free Trial
              </Button>
              <Button variant="glass" size="lg" className="w-full sm:w-auto" onClick={() => setLocation("/dashboard")}>
                View Dashboard <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
            
            <div className="mt-10 flex items-center gap-4 text-sm text-gray-500">
              <div className="flex -space-x-2">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full bg-gray-800 border-2 border-[#050508] flex items-center justify-center text-xs overflow-hidden">
                    <img src={`https://images.unsplash.com/photo-${1534528741775 + i}?w=100&h=100&fit=crop`} alt="user" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <p>Trusted by 2,000+ brand owners</p>
            </div>
          </motion.div>

          {/* Hero Visuals */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="relative lg:h-[600px] flex items-center justify-center"
          >
            {/* Horizontal glowing beam */}
            <div className="absolute top-1/2 -left-32 w-64 h-[2px] bg-gradient-to-r from-transparent via-pink-500 to-transparent blur-[1px] -rotate-12 opacity-50 hidden lg:block" />
            
            {/* Portal Glow */}
            <img 
              src={`${import.meta.env.BASE_URL}images/portal.png`} 
              alt="" 
              className="absolute w-[120%] max-w-none opacity-40 animate-pulse slow-spin mix-blend-screen"
              style={{ animationDuration: '10s' }}
            />

            {/* Dashboard Mockup Card */}
            <GlassCard className="relative w-full max-w-md mx-auto aspect-[4/3] p-0 overflow-hidden border-white/20 shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500">
              <div className="absolute inset-x-0 top-0 h-10 bg-white/5 border-b border-white/10 flex items-center px-4 gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/50" />
              </div>
              <div className="pt-14 p-6 space-y-4">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-sm text-gray-400">Total Revenue</p>
                    <p className="text-3xl font-bold text-white">₹1,42,500</p>
                  </div>
                  <div className="px-2 py-1 rounded bg-green-500/20 text-green-400 text-xs font-medium">
                    +24% today
                  </div>
                </div>
                {/* Mock Chart */}
                <div className="h-32 w-full mt-4 flex items-end gap-2">
                  {[40, 70, 45, 90, 65, 85, 100].map((h, i) => (
                    <motion.div 
                      key={i}
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      transition={{ delay: 0.5 + (i * 0.1), duration: 0.5 }}
                      className="flex-1 bg-gradient-to-t from-purple-600/50 to-pink-500 rounded-t-sm"
                    />
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                    <Bot className="w-5 h-5 text-purple-400 mb-2" />
                    <p className="text-xs text-gray-400">AI Ads Gen</p>
                    <p className="font-semibold">12 Ready</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                    <Target className="w-5 h-5 text-pink-400 mb-2" />
                    <p className="text-xs text-gray-400">Win Rate</p>
                    <p className="font-semibold">68%</p>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-24 px-6 bg-black/40 border-y border-white/5">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">An entire agency in your pocket.</h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Everything you need to launch, test, and scale winning dropshipping products in India, automated by AI.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {FEATURES.map((feat, i) => (
                <GlassCard
                  key={i}
                  hoverLift
                  glowOnHover
                  className="p-8 cursor-pointer group"
                  onClick={() => setLocation(feat.href)}
                >
                  <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-6 group-hover:bg-purple-500/20 transition-colors">
                    <feat.icon className="w-6 h-6 text-pink-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-pink-300 transition-colors">{feat.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{feat.desc}</p>
                  <div className="mt-4 flex items-center gap-1 text-purple-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    Try it free <ChevronRight className="w-4 h-4" />
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="py-24 px-6 max-w-7xl mx-auto">
           <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">Go from 0 to sales in hours.</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { step: "01", title: "Connect Store", desc: "Link your Shopify in one click. We analyze your niche instantly." },
                { step: "02", title: "Generate Assets", desc: "AI creates your video ads, descriptions, and calculates pricing." },
                { step: "03", title: "Launch & Scale", desc: "Run ads with confidence knowing your exact margins and RTO buffers." }
              ].map((item, i) => (
                <div key={i} className="relative p-6 rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent">
                  <div className="text-5xl font-extrabold text-white/5 absolute top-4 right-4">{item.step}</div>
                  <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center font-bold mb-6 shadow-lg shadow-purple-500/30">
                    {i + 1}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-400">{item.desc}</p>
                </div>
              ))}
            </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-24 px-6 bg-black/40 border-t border-white/5">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">Simple, transparent pricing</h2>
              <p className="text-gray-400 text-lg">No hidden fees. Cancel anytime.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                { name: "Starter", price: "499", desc: "Perfect for testing the waters", features: ["10 AI Ads per month", "Basic Pricing Calculator", "Standard Support"] },
                { name: "Pro", price: "1499", desc: "For scaling dropshippers", popular: true, features: ["Unlimited AI Ads", "Advanced RTO Calculator", "Product Sourcing Tool", "Priority Support"] },
                { name: "Agency", price: "2999", desc: "Manage multiple stores", features: ["Everything in Pro", "5 Store Connections", "White-label reports", "Dedicated Account Manager"] }
              ].map((tier, i) => (
                <GlassCard key={i} className={cn("flex flex-col", tier.popular && "border-pink-500/50 shadow-[0_0_40px_-10px_rgba(236,72,153,0.3)] scale-105 z-10")}>
                  {tier.popular && (
                    <div className="absolute top-0 inset-x-0 flex justify-center -mt-3">
                      <span className="bg-gradient-primary text-white text-xs font-bold px-3 py-1 rounded-full">MOST POPULAR</span>
                    </div>
                  )}
                  <h3 className="text-xl font-medium text-gray-300">{tier.name}</h3>
                  <div className="mt-4 mb-2 flex items-baseline">
                    <span className="text-5xl font-bold tracking-tight">₹{tier.price}</span>
                    <span className="text-gray-500 ml-2">/mo</span>
                  </div>
                  <p className="text-sm text-gray-400 mb-8">{tier.desc}</p>
                  
                  <ul className="space-y-4 flex-1 mb-8">
                    {tier.features.map((feat, j) => (
                      <li key={j} className="flex items-center gap-3 text-sm text-gray-300">
                        <CheckCircle2 className="w-4 h-4 text-purple-400" />
                        {feat}
                      </li>
                    ))}
                  </ul>
                  <Button variant={tier.popular ? "primary" : "glass"} className="w-full" onClick={() => setLocation("/auth")}>
                    Get Started
                  </Button>
                </GlassCard>
              ))}
            </div>
          </div>
        </section>

        {/* Footer CTA */}
        <section className="py-32 px-6 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-purple-900/20" />
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to print money?</h2>
            <p className="text-xl text-gray-400 mb-10">Join thousands of Indian dropshippers automating their workflow today.</p>
            <Button size="lg" onClick={() => setLocation("/auth")}>Create Free Account</Button>
          </div>
        </section>
      </main>
    </div>
  );
}
