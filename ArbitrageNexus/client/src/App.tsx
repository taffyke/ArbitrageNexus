import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { PrivateRoute } from "@/components/auth/PrivateRoute";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Auth from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import Arbitrage from "@/pages/Arbitrage";
import MarketAnalysis from "@/pages/MarketAnalysis";
import Profile from "@/pages/Profile";
import ProfitCalculator from "@/pages/ProfitCalculator";
import NetworkMonitor from "@/pages/NetworkMonitor";
import BotTrading from "@/pages/BotTrading";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/auth/login" component={Auth} />
      <Route path="/auth/signup" component={Auth} />
      
      {/* Protected Routes */}
      <Route path="/dashboard">
        {(params) => <PrivateRoute component={Dashboard} {...params} />}
      </Route>
      <Route path="/arbitrage">
        {(params) => <PrivateRoute component={Arbitrage} {...params} />}
      </Route>
      <Route path="/market-analysis">
        {(params) => <PrivateRoute component={MarketAnalysis} {...params} />}
      </Route>
      <Route path="/profit-calculator">
        {(params) => <PrivateRoute component={ProfitCalculator} {...params} />}
      </Route>
      <Route path="/network-monitor">
        {(params) => <PrivateRoute component={NetworkMonitor} {...params} />}
      </Route>
      <Route path="/bot-trading">
        {(params) => <PrivateRoute component={BotTrading} {...params} />}
      </Route>
      <Route path="/profile">
        {(params) => <PrivateRoute component={Profile} {...params} />}
      </Route>
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
