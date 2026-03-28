import React from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { LucideIcon } from "lucide-react";

interface ToolViewProps {
  title: string;
  description: string;
  icon: LucideIcon;
  actionText?: string;
  onAction?: () => void;
}

export function ToolView({ 
  title, 
  description, 
  icon: Icon, 
  actionText = "Get Started", 
  onAction 
}: ToolViewProps) {
  
  const handleAction = () => {
    if (onAction) onAction();
    else alert("Store connection required to use this tool.");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">{title}</h1>
        <p className="text-gray-400 mt-2 text-lg max-w-2xl">{description}</p>
      </div>

      <GlassCard className="min-h-[400px] flex flex-col items-center justify-center text-center p-8 border-dashed border-white/20">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-white/10 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(124,58,237,0.15)] relative">
          <div className="absolute inset-0 bg-white/5 rounded-2xl blur-xl animate-pulse"></div>
          <Icon className="w-10 h-10 text-white relative z-10" />
        </div>
        
        <h3 className="text-2xl font-semibold text-white mb-2">Connect your Shopify Store</h3>
        <p className="text-gray-400 max-w-md mx-auto mb-8">
          To generate highly converting {title.toLowerCase()} tailored to your audience, please connect your store first. We'll analyze your catalog automatically.
        </p>
        
        <Button onClick={handleAction} size="lg" className="w-full sm:w-auto">
          {actionText}
        </Button>
      </GlassCard>
    </div>
  );
}
