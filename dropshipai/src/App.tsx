import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";

import LandingPage from "./pages/landing";
import AuthPage from "./pages/auth";
import DashboardPage from "./pages/dashboard";
import AdGeneratorPage from "./pages/ad-generator";
import PricingCalculatorPage from "./pages/pricing-calculator";
import ProductSourcingPage from "./pages/product-sourcing";
import AIAssistantPage from "./pages/ai-assistant";
import DescriptionWriterPage from "./pages/description-writer";
import WinningProductsPage from "./pages/winning-products";
import InstagramCaptionsPage from "./pages/instagram-captions";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/dashboard" component={DashboardPage} />
      <Route path="/ad-generator" component={AdGeneratorPage} />
      <Route path="/pricing-calculator" component={PricingCalculatorPage} />
      <Route path="/product-sourcing" component={ProductSourcingPage} />
      <Route path="/ai-assistant" component={AIAssistantPage} />
      <Route path="/description-writer" component={DescriptionWriterPage} />
      <Route path="/winning-products" component={WinningProductsPage} />
      <Route path="/instagram-captions" component={InstagramCaptionsPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
