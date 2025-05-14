import { useLocation, Link } from "wouter";
import { useState, useEffect } from "react";
import { 
  LayoutDashboard, 
  ArrowLeftRight, 
  LineChart, 
  User, 
  Settings, 
  Calculator,
  Network,
  ChevronLeft,
  ChevronRight,
  Cpu
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function Sidebar() {
  const [location] = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setCollapsed(true);
      }
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);
  
  const navigationItems = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
      active: location === "/dashboard",
    },
    {
      name: "Arbitrage",
      icon: ArrowLeftRight,
      href: "/arbitrage",
      active: location === "/arbitrage",
    },
    {
      name: "Market Analysis",
      icon: LineChart,
      href: "/market-analysis",
      active: location === "/market-analysis",
    },
    {
      name: "Bot Trading",
      icon: Cpu,
      href: "/bot-trading",
      active: location === "/bot-trading",
    },
    {
      name: "Profit Calculator",
      icon: Calculator,
      href: "/profit-calculator",
      active: location === "/profit-calculator",
    },
    {
      name: "Network Monitor",
      icon: Network,
      href: "/network-monitor",
      active: location === "/network-monitor",
    },
    {
      name: "Profile",
      icon: User,
      href: "/profile",
      active: location === "/profile",
    },
  ];

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <motion.div 
      className={cn(
        "h-full bg-primary-light border-r border-accent/10 flex flex-col relative z-20",
        collapsed ? "w-16" : "w-64"
      )}
      initial={false}
      animate={{ width: collapsed ? 68 : 256 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      {/* Collapse button */}
      <motion.button
        className="absolute -right-3 top-24 bg-background border border-accent/30 rounded-full p-1 cursor-pointer z-30 hover:bg-accent/10"
        onClick={toggleSidebar}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {collapsed ? <ChevronRight className="h-4 w-4 text-accent" /> : <ChevronLeft className="h-4 w-4 text-accent" />}
      </motion.button>

      {/* Logo */}
      <div className="p-4 border-b border-accent/10 flex items-center justify-center">
        <Link href="/">
          <AnimatePresence mode="wait">
            {!collapsed ? (
              <motion.div 
                key="full-logo"
                className="text-accent font-bold text-xl cursor-pointer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                ArbitragePro
              </motion.div>
            ) : (
              <motion.div 
                key="mini-logo"
                className="text-accent font-bold text-xl cursor-pointer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                AP
              </motion.div>
            )}
          </AnimatePresence>
        </Link>
      </div>
      
      {/* Navigation Menu */}
      <nav className="flex-1 pt-5 pb-4 overflow-y-auto scrollbar-hide">
        <ul className="space-y-1 px-2">
          <TooltipProvider delayDuration={0}>
            {navigationItems.map((item) => (
              <li key={item.name}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link href={item.href}>
                      <motion.div 
                        className={cn(
                          "flex items-center px-4 py-3 rounded-lg group transition-all cursor-pointer",
                          item.active
                            ? "text-primary-foreground bg-accent/10 border-l-4 border-accent"
                            : "text-muted-foreground hover:text-primary-foreground hover:bg-background-surface/50"
                        )}
                        whileHover={{ x: 3 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <item.icon className={cn(
                          "w-6 h-6 text-center min-w-6",
                          !collapsed && "mr-3",
                          item.active ? "text-accent" : "group-hover:text-accent"
                        )} />
                        <AnimatePresence>
                          {!collapsed && (
                            <motion.span
                              initial={{ opacity: 0, width: 0 }}
                              animate={{ opacity: 1, width: "auto" }}
                              exit={{ opacity: 0, width: 0 }}
                              transition={{ duration: 0.2 }}
                              className="whitespace-nowrap"
                            >
                              {item.name}
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    </Link>
                  </TooltipTrigger>
                  {collapsed && (
                    <TooltipContent side="right" className="bg-background-surface">
                      {item.name}
                    </TooltipContent>
                  )}
                </Tooltip>
              </li>
            ))}
          </TooltipProvider>
        </ul>
      </nav>
      
      {/* User profile quick access */}
      <div className="p-4 border-t border-accent/10 flex items-center">
        <Avatar>
          <AvatarFallback className="bg-accent-alt text-white">JS</AvatarFallback>
        </Avatar>
        <AnimatePresence>
          {!collapsed && (
            <motion.div 
              className="ml-3"
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="text-sm font-medium">John Smith</div>
              <div className="text-xs text-muted-foreground">Pro Trader</div>
            </motion.div>
          )}
        </AnimatePresence>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href="/profile">
              <motion.div
                className="ml-auto text-muted-foreground hover:text-accent cursor-pointer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Settings className="h-5 w-5" />
              </motion.div>
            </Link>
          </TooltipTrigger>
          {collapsed && (
            <TooltipContent side="right" className="bg-background-surface">
              Settings
            </TooltipContent>
          )}
        </Tooltip>
      </div>
    </motion.div>
  );
}
