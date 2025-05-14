import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Sidebar from "@/components/layout/Sidebar";
import { Helmet } from "react-helmet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { AlertCircle, Check, ChevronRight, CircleDollarSign, CogIcon, Cpu, Info, Power, RefreshCw, Rocket, Save, ZapIcon } from "lucide-react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AppSettings } from "@/lib/types";

// Types for bot configuration
interface BotConfig {
  id: string;
  name: string;
  type: "direct" | "triangular" | "futures" | "p2p" | "custom";
  enabled: boolean;
  autoTrade: boolean;
  autoSelectNetwork: boolean;
  maxSlippage: number;
  minProfitPercentage: number;
  maxTradeAmount: number;
  stopLossPercentage: number;
  takeProfitPercentage: number;
  tradingPairs: string[];
  exchanges: string[];
  createdAt: Date;
  lastModified: Date;
  lastRun?: Date;
  totalProfit: number;
  totalTrades: number;
  successRate: number;
}

// Default bot configurations
const defaultBotConfigs: Record<string, Partial<BotConfig>> = {
  direct: {
    type: "direct",
    name: "Direct Arbitrage Bot",
    maxSlippage: 0.1,
    minProfitPercentage: 0.5,
    maxTradeAmount: 1000,
    stopLossPercentage: 2,
    takeProfitPercentage: 2.5,
    autoSelectNetwork: true,
  },
  triangular: {
    type: "triangular",
    name: "Triangular Arbitrage Bot",
    maxSlippage: 0.2,
    minProfitPercentage: 0.8,
    maxTradeAmount: 1500,
    stopLossPercentage: 2.5,
    takeProfitPercentage: 3,
    autoSelectNetwork: true,
  },
  futures: {
    type: "futures",
    name: "Futures Arbitrage Bot",
    maxSlippage: 0.15,
    minProfitPercentage: 0.7,
    maxTradeAmount: 2000,
    stopLossPercentage: 3,
    takeProfitPercentage: 3.5,
    autoSelectNetwork: true,
  },
  p2p: {
    type: "p2p",
    name: "P2P Arbitrage Bot",
    maxSlippage: 0.25,
    minProfitPercentage: 1.2,
    maxTradeAmount: 1200,
    stopLossPercentage: 3.5,
    takeProfitPercentage: 4,
    autoSelectNetwork: true,
  }
};

// Sample trading pairs
const tradingPairs = [
  "BTC/USDT", "ETH/USDT", "SOL/USDT", "ADA/USDT", "DOT/USDT", 
  "LINK/USDT", "AVAX/USDT", "DOGE/USDT", "MATIC/USDT", "UNI/USDT"
];

// Sample exchanges
const exchanges = [
  "Binance", "Coinbase", "Kraken", "FTX", "Huobi", 
  "KuCoin", "Bybit", "OKX", "Gate.io", "Bitfinex"
];

// Sample networks
const networks = [
  { name: "Ethereum", fee: "$4.23", time: "3-5 min", congestion: 42 },
  { name: "Binance Smart Chain", fee: "$0.15", time: "30-45 sec", congestion: 28 },
  { name: "Solana", fee: "$0.001", time: "10-15 sec", congestion: 65 },
  { name: "Polygon", fee: "$0.01", time: "20-30 sec", congestion: 15 },
  { name: "Avalanche", fee: "$0.25", time: "1-2 min", congestion: 22 }
];

export default function BotTrading() {
  const [savedBots, setSavedBots] = useState<BotConfig[]>([]);
  const [activeBotType, setActiveBotType] = useState<string>("direct");
  const [currentBot, setCurrentBot] = useState<BotConfig>({
    ...defaultBotConfigs.direct as BotConfig,
    id: "bot-" + Date.now(),
    enabled: false,
    autoTrade: false,
    tradingPairs: ["BTC/USDT"],
    exchanges: ["Binance", "Coinbase"],
    createdAt: new Date(),
    lastModified: new Date(),
    totalProfit: 0,
    totalTrades: 0,
    successRate: 0
  });
  
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionComplete, setExecutionComplete] = useState(false);
  const [needsApiKey, setNeedsApiKey] = useState(false);
  const [appSettings, setAppSettings] = useState<AppSettings>({
    darkMode: true,
    realTimeUpdates: true,
    autoExecuteTrades: false,
    priceAlerts: true,
    enableAnimations: true
  });

  // Load default bot config when active type changes
  useEffect(() => {
    if (defaultBotConfigs[activeBotType]) {
      setCurrentBot(prev => ({
        ...prev,
        ...defaultBotConfigs[activeBotType],
        id: `bot-${activeBotType}-${Date.now()}`,
        lastModified: new Date()
      }));
    }
  }, [activeBotType]);

  const saveBotConfig = () => {
    setSavedBots(prev => {
      // If bot with this ID already exists, update it
      const botIndex = prev.findIndex(bot => bot.id === currentBot.id);
      if (botIndex >= 0) {
        const updatedBots = [...prev];
        updatedBots[botIndex] = { 
          ...currentBot, 
          lastModified: new Date() 
        };
        return updatedBots;
      }
      
      // Otherwise add as new bot
      return [...prev, { 
        ...currentBot, 
        createdAt: new Date(), 
        lastModified: new Date() 
      }];
    });
  };

  const loadBotConfig = (botId: string) => {
    const bot = savedBots.find(bot => bot.id === botId);
    if (bot) {
      setCurrentBot(bot);
      setActiveBotType(bot.type);
    }
  };

  const deleteBotConfig = (botId: string) => {
    setSavedBots(prev => prev.filter(bot => bot.id !== botId));
    
    // If the current bot is deleted, reset to default of active type
    if (currentBot.id === botId) {
      setCurrentBot({
        ...defaultBotConfigs[activeBotType] as BotConfig,
        id: `bot-${activeBotType}-${Date.now()}`,
        enabled: false,
        autoTrade: false,
        tradingPairs: ["BTC/USDT"],
        exchanges: ["Binance", "Coinbase"],
        createdAt: new Date(),
        lastModified: new Date(),
        totalProfit: 0,
        totalTrades: 0,
        successRate: 0
      });
    }
  };

  const executeBot = () => {
    if (!appSettings.autoExecuteTrades && currentBot.autoTrade) {
      setNeedsApiKey(true);
      return;
    }
    
    setIsExecuting(true);
    
    // Simulate bot execution
    setTimeout(() => {
      setIsExecuting(false);
      setExecutionComplete(true);
      
      // Update bot stats
      setCurrentBot(prev => ({
        ...prev,
        lastRun: new Date(),
        totalTrades: prev.totalTrades + 1,
        totalProfit: prev.totalProfit + (Math.random() * 10 + 5),
        successRate: (prev.successRate * prev.totalTrades + 100) / (prev.totalTrades + 1)
      }));
      
      // Update saved bot if it exists
      setSavedBots(prev => {
        const botIndex = prev.findIndex(bot => bot.id === currentBot.id);
        if (botIndex >= 0) {
          const updatedBots = [...prev];
          updatedBots[botIndex] = { 
            ...currentBot, 
            lastRun: new Date(),
            totalTrades: currentBot.totalTrades + 1,
            totalProfit: currentBot.totalProfit + (Math.random() * 10 + 5),
            successRate: (currentBot.successRate * currentBot.totalTrades + 100) / (currentBot.totalTrades + 1)
          };
          return updatedBots;
        }
        return prev;
      });
      
      setTimeout(() => {
        setExecutionComplete(false);
      }, 5000);
    }, 3000);
  };

  const changeFieldValue = (field: keyof BotConfig, value: any) => {
    setCurrentBot(prev => ({
      ...prev,
      [field]: value,
      lastModified: new Date()
    }));
  };

  return (
    <>
      <Helmet>
        <title>Trading Bots | ArbitragePro</title>
        <meta name="description" content="Configure and manage automated trading bots for crypto arbitrage opportunities" />
      </Helmet>
      <div className="h-screen w-screen bg-background overflow-hidden">
        <div className="flex h-full">
          <Sidebar />
          <main className="flex-1 h-full overflow-auto">
            <div className="p-6 h-full overflow-auto bg-gradient-to-b from-background to-background-surface/60">
              <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div 
                  className="mb-8 flex flex-col md:flex-row md:items-center justify-between" 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div>
                    <h1 className="text-3xl font-bold text-glow flex items-center">
                      <Cpu className="mr-2 h-7 w-7 text-accent" />
                      Trading Bots
                    </h1>
                    <p className="text-muted-foreground mt-1">
                      Configure automated trading bots for different arbitrage strategies
                    </p>
                  </div>
                  
                  <div className="mt-4 md:mt-0 flex space-x-3">
                    <Button 
                      variant="outline"
                      className="border-accent/20 text-accent"
                      onClick={saveBotConfig}
                    >
                      <Save className="mr-2 h-4 w-4" />
                      Save Configuration
                    </Button>
                    
                    <Button 
                      className="bg-success hover:bg-success/80 text-background"
                      onClick={executeBot}
                      disabled={isExecuting}
                    >
                      {isExecuting ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          Executing...
                        </>
                      ) : (
                        <>
                          <Rocket className="mr-2 h-4 w-4" />
                          Execute Bot
                        </>
                      )}
                    </Button>
                  </div>
                </motion.div>
                
                {executionComplete && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <Alert className="mb-6 border-success/50 bg-success/10 text-success">
                      <Check className="h-4 w-4" />
                      <AlertTitle>Success!</AlertTitle>
                      <AlertDescription>
                        Bot execution completed successfully. Check the bot statistics for details.
                      </AlertDescription>
                    </Alert>
                  </motion.div>
                )}
                
                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  {/* Saved Bots Sidebar */}
                  <motion.div 
                    className="lg:col-span-1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <Card className="bg-background-surface/80 backdrop-blur border-accent/20">
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center">
                          <Cpu className="mr-2 h-5 w-5 text-accent" />
                          My Bots
                        </CardTitle>
                        <CardDescription>
                          Your saved bot configurations
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="max-h-[600px] overflow-y-auto pr-2">
                        {savedBots.length > 0 ? (
                          <div className="space-y-3">
                            {savedBots.map((bot) => (
                              <div 
                                key={bot.id}
                                className="p-3 rounded-md border border-border hover:border-accent/50 cursor-pointer transition-all"
                                onClick={() => loadBotConfig(bot.id)}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center">
                                    <div className={`w-2 h-2 rounded-full mr-2 ${bot.enabled ? 'bg-success' : 'bg-muted'}`}></div>
                                    <span className="font-medium">{bot.name}</span>
                                  </div>
                                  <Badge variant="outline" className="capitalize">
                                    {bot.type}
                                  </Badge>
                                </div>
                                
                                <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                                  <div>Profit: ${bot.totalProfit.toFixed(2)}</div>
                                  <div>Trades: {bot.totalTrades}</div>
                                </div>
                                
                                <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                                  <div>Success: {bot.successRate.toFixed(1)}%</div>
                                  <div>
                                    {bot.lastRun 
                                      ? `Last run: ${bot.lastRun.toLocaleDateString()}`
                                      : 'Never run'}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8 text-muted-foreground">
                            <p>No saved bots yet.</p>
                            <p className="text-sm mt-1">Configure and save a bot to see it here.</p>
                          </div>
                        )}
                      </CardContent>
                      <CardFooter className="flex justify-center">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" className="w-full text-accent text-sm">
                              Create New Bot
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Create New Bot</DialogTitle>
                              <DialogDescription>
                                Select a bot type to create a new trading bot configuration.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid grid-cols-2 gap-4 py-4">
                              {Object.entries(defaultBotConfigs).map(([type, config]) => (
                                <div 
                                  key={type}
                                  className="p-4 border border-border rounded-lg hover:border-accent/50 cursor-pointer"
                                  onClick={() => {
                                    setActiveBotType(type);
                                    setCurrentBot({
                                      ...config as BotConfig,
                                      id: `bot-${type}-${Date.now()}`,
                                      enabled: false,
                                      autoTrade: false,
                                      tradingPairs: ["BTC/USDT"],
                                      exchanges: ["Binance", "Coinbase"],
                                      createdAt: new Date(),
                                      lastModified: new Date(),
                                      totalProfit: 0,
                                      totalTrades: 0,
                                      successRate: 0
                                    });
                                  }}
                                >
                                  <h3 className="font-medium capitalize mb-1">{type} Arbitrage</h3>
                                  <p className="text-xs text-muted-foreground">
                                    Min Profit: {config.minProfitPercentage}%
                                  </p>
                                </div>
                              ))}
                            </div>
                            <DialogFooter>
                              <DialogClose asChild>
                                <Button type="button">Close</Button>
                              </DialogClose>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </CardFooter>
                    </Card>
                  </motion.div>
                  
                  {/* Bot Configuration */}
                  <motion.div 
                    className="lg:col-span-3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <Card className="bg-background-surface/80 backdrop-blur border-accent/20">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="flex items-center">
                              <Input 
                                value={currentBot.name} 
                                onChange={(e) => changeFieldValue('name', e.target.value)}
                                className="border-0 text-xl px-0 h-auto bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                              />
                            </CardTitle>
                            <CardDescription>
                              <Badge variant="outline" className="capitalize mr-2">
                                {currentBot.type} arbitrage
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                Last modified: {currentBot.lastModified.toLocaleString()}
                              </span>
                            </CardDescription>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Label htmlFor="bot-enabled" className="text-sm">Enabled</Label>
                            <Switch 
                              id="bot-enabled"
                              checked={currentBot.enabled}
                              onCheckedChange={(checked) => changeFieldValue('enabled', checked)}
                            />
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="space-y-6">
                        <Tabs defaultValue="settings" className="w-full">
                          <TabsList className="grid grid-cols-4 mb-4">
                            <TabsTrigger value="settings">Settings</TabsTrigger>
                            <TabsTrigger value="trading">Trading Pairs</TabsTrigger>
                            <TabsTrigger value="network">Network</TabsTrigger>
                            <TabsTrigger value="stats">Statistics</TabsTrigger>
                          </TabsList>
                          
                          {/* Settings Tab */}
                          <TabsContent value="settings" className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {/* Auto-Trade Setting */}
                              <div className="p-4 border border-border rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                  <Label htmlFor="auto-trade" className="font-medium">Auto Execute Trades</Label>
                                  <Switch 
                                    id="auto-trade"
                                    checked={currentBot.autoTrade}
                                    onCheckedChange={(checked) => changeFieldValue('autoTrade', checked)}
                                  />
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  When enabled, the bot will automatically execute trades when profitable opportunities are found.
                                </p>
                              </div>
                              
                              {/* Max Slippage */}
                              <div className="p-4 border border-border rounded-lg">
                                <Label className="font-medium mb-2 block">Max Slippage (%)</Label>
                                <div className="flex items-center space-x-4">
                                  <Slider
                                    value={[currentBot.maxSlippage]}
                                    min={0}
                                    max={1}
                                    step={0.05}
                                    onValueChange={(values) => changeFieldValue('maxSlippage', values[0])}
                                    className="flex-1"
                                  />
                                  <span className="w-12 text-center">{(currentBot.maxSlippage * 100).toFixed(1)}%</span>
                                </div>
                                <p className="text-sm text-muted-foreground mt-2">
                                  Maximum acceptable price deviation during trade execution.
                                </p>
                              </div>
                              
                              {/* Min Profit */}
                              <div className="p-4 border border-border rounded-lg">
                                <Label className="font-medium mb-2 block">Min Profit Threshold (%)</Label>
                                <div className="flex items-center space-x-4">
                                  <Slider
                                    value={[currentBot.minProfitPercentage]}
                                    min={0.1}
                                    max={5}
                                    step={0.1}
                                    onValueChange={(values) => changeFieldValue('minProfitPercentage', values[0])}
                                    className="flex-1"
                                  />
                                  <span className="w-12 text-center">{currentBot.minProfitPercentage.toFixed(1)}%</span>
                                </div>
                                <p className="text-sm text-muted-foreground mt-2">
                                  Minimum profit percentage required to execute a trade.
                                </p>
                              </div>
                              
                              {/* Max Trade Amount */}
                              <div className="p-4 border border-border rounded-lg">
                                <Label className="font-medium mb-2 block">Max Trade Amount (USD)</Label>
                                <div className="flex items-center space-x-2">
                                  <span className="text-muted-foreground">$</span>
                                  <Input
                                    type="number"
                                    value={currentBot.maxTradeAmount}
                                    onChange={(e) => changeFieldValue('maxTradeAmount', Number(e.target.value))}
                                    min={0}
                                    step={100}
                                  />
                                </div>
                                <p className="text-sm text-muted-foreground mt-2">
                                  Maximum amount per trade in USD.
                                </p>
                              </div>
                              
                              {/* Take Profit */}
                              <div className="p-4 border border-border rounded-lg">
                                <Label className="font-medium mb-2 block">Take Profit (%)</Label>
                                <div className="flex items-center space-x-4">
                                  <Slider
                                    value={[currentBot.takeProfitPercentage]}
                                    min={0.5}
                                    max={10}
                                    step={0.5}
                                    onValueChange={(values) => changeFieldValue('takeProfitPercentage', values[0])}
                                    className="flex-1"
                                  />
                                  <span className="w-12 text-center">{currentBot.takeProfitPercentage.toFixed(1)}%</span>
                                </div>
                                <p className="text-sm text-muted-foreground mt-2">
                                  Percentage gain at which to close the position.
                                </p>
                              </div>
                              
                              {/* Stop Loss */}
                              <div className="p-4 border border-border rounded-lg">
                                <Label className="font-medium mb-2 block">Stop Loss (%)</Label>
                                <div className="flex items-center space-x-4">
                                  <Slider
                                    value={[currentBot.stopLossPercentage]}
                                    min={0.5}
                                    max={10}
                                    step={0.5}
                                    onValueChange={(values) => changeFieldValue('stopLossPercentage', values[0])}
                                    className="flex-1"
                                  />
                                  <span className="w-12 text-center">{currentBot.stopLossPercentage.toFixed(1)}%</span>
                                </div>
                                <p className="text-sm text-muted-foreground mt-2">
                                  Percentage loss at which to close the position.
                                </p>
                              </div>
                            </div>
                          </TabsContent>
                          
                          {/* Trading Pairs Tab */}
                          <TabsContent value="trading" className="space-y-4">
                            <div className="flex items-center justify-between mb-4">
                              <Label className="font-medium">Trading Pairs</Label>
                              <Select
                                onValueChange={(value) => changeFieldValue('tradingPairs', [...currentBot.tradingPairs, value])}
                              >
                                <SelectTrigger className="w-[200px]">
                                  <SelectValue placeholder="Add trading pair" />
                                </SelectTrigger>
                                <SelectContent>
                                  {tradingPairs.filter(pair => !currentBot.tradingPairs.includes(pair)).map((pair) => (
                                    <SelectItem key={pair} value={pair}>{pair}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div className="space-y-2">
                              {currentBot.tradingPairs.length > 0 ? (
                                currentBot.tradingPairs.map((pair) => (
                                  <div key={pair} className="flex items-center justify-between p-3 border border-border rounded-lg">
                                    <span>{pair}</span>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => changeFieldValue('tradingPairs', currentBot.tradingPairs.filter(p => p !== pair))}
                                      className="text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                                    >
                                      Remove
                                    </Button>
                                  </div>
                                ))
                              ) : (
                                <div className="text-center py-8 text-muted-foreground">
                                  <p>No trading pairs selected.</p>
                                  <p className="text-sm mt-1">Add trading pairs to monitor for arbitrage opportunities.</p>
                                </div>
                              )}
                            </div>
                            
                            <Separator />
                            
                            <div className="flex items-center justify-between mb-4">
                              <Label className="font-medium">Exchanges</Label>
                              <Select
                                onValueChange={(value) => changeFieldValue('exchanges', [...currentBot.exchanges, value])}
                              >
                                <SelectTrigger className="w-[200px]">
                                  <SelectValue placeholder="Add exchange" />
                                </SelectTrigger>
                                <SelectContent>
                                  {exchanges.filter(exchange => !currentBot.exchanges.includes(exchange)).map((exchange) => (
                                    <SelectItem key={exchange} value={exchange}>{exchange}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div className="space-y-2">
                              {currentBot.exchanges.length > 0 ? (
                                currentBot.exchanges.map((exchange) => (
                                  <div key={exchange} className="flex items-center justify-between p-3 border border-border rounded-lg">
                                    <span>{exchange}</span>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => changeFieldValue('exchanges', currentBot.exchanges.filter(e => e !== exchange))}
                                      className="text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                                    >
                                      Remove
                                    </Button>
                                  </div>
                                ))
                              ) : (
                                <div className="text-center py-8 text-muted-foreground">
                                  <p>No exchanges selected.</p>
                                  <p className="text-sm mt-1">Add exchanges to monitor for arbitrage opportunities.</p>
                                </div>
                              )}
                            </div>
                          </TabsContent>
                          
                          {/* Network Tab */}
                          <TabsContent value="network" className="space-y-4">
                            <div className="p-4 border border-border rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <Label htmlFor="auto-network" className="font-medium">Auto-Select Network</Label>
                                <Switch 
                                  id="auto-network"
                                  checked={currentBot.autoSelectNetwork}
                                  onCheckedChange={(checked) => changeFieldValue('autoSelectNetwork', checked)}
                                />
                              </div>
                              <p className="text-sm text-muted-foreground">
                                When enabled, the bot will automatically select the most efficient network for trades based on fees and congestion.
                              </p>
                            </div>
                            
                            <div className="mt-4">
                              <Label className="font-medium mb-2 block">Available Networks</Label>
                              
                              <div className="space-y-3 mt-4">
                                {networks.map((network) => (
                                  <div key={network.name} className="p-3 border border-border rounded-lg flex items-center justify-between">
                                    <div>
                                      <div className="font-medium">{network.name}</div>
                                      <div className="flex items-center mt-1 text-xs text-muted-foreground space-x-3">
                                        <span>Fee: {network.fee}</span>
                                        <span>Avg. Time: {network.time}</span>
                                      </div>
                                    </div>
                                    
                                    <div className="flex items-center space-x-3">
                                      <div className="flex items-center">
                                        <div className={`w-2 h-2 rounded-full mr-1 ${
                                          network.congestion < 30 ? 'bg-success' : 
                                          network.congestion < 60 ? 'bg-warning' : 
                                          'bg-destructive'
                                        }`}></div>
                                        <span className="text-xs">{network.congestion}% congestion</span>
                                      </div>
                                      
                                      <RadioGroup 
                                        className="flex"
                                        defaultValue={networks[0].name}
                                        disabled={currentBot.autoSelectNetwork}
                                      >
                                        <RadioGroupItem value={network.name} className="text-accent" />
                                      </RadioGroup>
                                    </div>
                                  </div>
                                ))}
                              </div>
                              
                              {currentBot.autoSelectNetwork && (
                                <div className="mt-4 p-3 bg-accent/10 border border-accent/20 rounded-lg flex items-center text-sm">
                                  <Info className="h-4 w-4 mr-2 text-accent" />
                                  <p>
                                    Auto-select is enabled. The bot will choose Binance Smart Chain for this trade based on current conditions.
                                  </p>
                                </div>
                              )}
                            </div>
                          </TabsContent>
                          
                          {/* Statistics Tab */}
                          <TabsContent value="stats" className="space-y-4">
                            {currentBot.totalTrades > 0 ? (
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="p-4 border border-border rounded-lg">
                                  <div className="text-muted-foreground text-sm mb-1">Total Profit</div>
                                  <div className="text-2xl font-bold text-success flex items-center">
                                    <CircleDollarSign className="h-5 w-5 mr-1" />
                                    ${currentBot.totalProfit.toFixed(2)}
                                  </div>
                                </div>
                                
                                <div className="p-4 border border-border rounded-lg">
                                  <div className="text-muted-foreground text-sm mb-1">Total Trades</div>
                                  <div className="text-2xl font-bold flex items-center">
                                    <ZapIcon className="h-5 w-5 mr-1 text-accent" />
                                    {currentBot.totalTrades}
                                  </div>
                                </div>
                                
                                <div className="p-4 border border-border rounded-lg">
                                  <div className="text-muted-foreground text-sm mb-1">Success Rate</div>
                                  <div className="text-2xl font-bold flex items-center">
                                    <div className={`h-5 w-5 rounded-full mr-1 flex items-center justify-center ${
                                      currentBot.successRate > 80 ? 'bg-success text-success-foreground' : 
                                      currentBot.successRate > 50 ? 'bg-warning text-warning-foreground' : 
                                      'bg-destructive text-destructive-foreground'
                                    }`}>
                                      <Check className="h-3 w-3" />
                                    </div>
                                    {currentBot.successRate.toFixed(1)}%
                                  </div>
                                </div>
                                
                                <div className="md:col-span-3 p-4 border border-border rounded-lg">
                                  <div className="font-medium mb-2">Performance History</div>
                                  <div className="h-64">
                                    <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                                      Detailed performance history charts will appear here once enough data is collected.
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="text-center py-12 text-muted-foreground">
                                <CogIcon className="h-12 w-12 mx-auto mb-4 text-muted" />
                                <h3 className="text-lg font-medium mb-1">No Trading History</h3>
                                <p>This bot hasn't executed any trades yet.</p>
                                <p className="text-sm mt-1">Execute the bot to start collecting performance statistics.</p>
                                
                                <Button 
                                  variant="outline" 
                                  className="mt-4"
                                  onClick={executeBot}
                                  disabled={isExecuting}
                                >
                                  {isExecuting ? (
                                    <>
                                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                      Executing...
                                    </>
                                  ) : (
                                    <>
                                      <Rocket className="mr-2 h-4 w-4" />
                                      Execute Bot
                                    </>
                                  )}
                                </Button>
                              </div>
                            )}
                          </TabsContent>
                        </Tabs>
                      </CardContent>
                      
                      <CardFooter className="flex justify-between">
                        <Button 
                          variant="outline" 
                          className="border-destructive/20 text-destructive hover:bg-destructive/10"
                          onClick={() => deleteBotConfig(currentBot.id)}
                        >
                          Delete Bot
                        </Button>
                        
                        <div className="flex space-x-3">
                          <Button 
                            variant="outline"
                            className="border-accent/20 text-accent"
                            onClick={saveBotConfig}
                          >
                            <Save className="mr-2 h-4 w-4" />
                            Save Changes
                          </Button>
                          
                          <Button 
                            className="bg-success hover:bg-success/80 text-background"
                            onClick={executeBot}
                            disabled={isExecuting}
                          >
                            {isExecuting ? (
                              <>
                                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                Executing...
                              </>
                            ) : (
                              <>
                                <Power className="mr-2 h-4 w-4" />
                                Run Bot
                              </>
                            )}
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  </motion.div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      
      {/* API Key Dialog */}
      <Dialog open={needsApiKey} onOpenChange={setNeedsApiKey}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>API Key Required</DialogTitle>
            <DialogDescription>
              You need to connect exchange API keys with trading permissions to execute trades automatically.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Alert className="bg-warning/10 border-warning/50 text-warning">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Read-only API keys are not sufficient</AlertTitle>
              <AlertDescription>
                Auto-trading requires API keys with trading permissions. Please add API keys with the necessary permissions to execute trades.
              </AlertDescription>
            </Alert>
          </div>
          <DialogFooter className="sm:justify-between">
            <Button 
              variant="secondary" 
              onClick={() => setNeedsApiKey(false)}
            >
              Cancel
            </Button>
            <Button 
              type="button"
              onClick={() => {
                setNeedsApiKey(false);
                // TODO: Navigate to API key section
              }}
            >
              Add API Keys
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}