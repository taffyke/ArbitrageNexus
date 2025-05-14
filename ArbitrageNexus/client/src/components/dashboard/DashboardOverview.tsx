import { useState } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowUpRight, 
  ArrowLeftRight, 
  Percent, 
  Link2,
  Zap,
  Flame,
  Clock,
  RefreshCw,
  Wallet,
  CircleDollarSign,
  Trophy,
  Filter,
  PanelTop,
  PanelBottom,
  BarChart3,
  ChevronDown,
  AlertCircle,
  ExternalLink,
  LineChart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import StatCard from "./StatCard";
import ProfitChart from "./ProfitChart";
import ArbitrageOpportunity from "./ArbitrageOpportunity";
import { ArbitrageOpportunity as ArbitrageOpportunityType } from "@/lib/types";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Legend, 
  Tooltip,
  Area,
  AreaChart,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data for the UI display
const recentOpportunities: ArbitrageOpportunityType[] = [
  {
    id: "1",
    type: "direct",
    pair: "BTC/USDT",
    exchanges: ["Binance", "Kraken"],
    profit: 853.43,
    profitPercentage: 2.34,
    timestamp: new Date(Date.now() - 5 * 60 * 1000) // 5 minutes ago
  },
  {
    id: "2",
    type: "triangular",
    pair: "ETH → BTC → USDT",
    exchanges: ["Coinbase"],
    profit: 30.81,
    profitPercentage: 1.87,
    timestamp: new Date(Date.now() - 12 * 60 * 1000) // 12 minutes ago
  },
  {
    id: "3",
    type: "futures",
    pair: "SOL/USDT",
    exchanges: ["FTX", "Huobi"],
    profit: 0.44,
    profitPercentage: 3.12,
    timestamp: new Date(Date.now() - 28 * 60 * 1000) // 28 minutes ago
  },
  {
    id: "4",
    type: "p2p",
    pair: "MATIC/USDT",
    exchanges: ["Binance P2P"],
    profit: 15.3,
    profitPercentage: 1.53,
    timestamp: new Date(Date.now() - 45 * 60 * 1000) // 45 minutes ago
  }
];

const allOpportunities = [
  ...recentOpportunities,
  {
    id: "5",
    type: "direct",
    pair: "ETH/USDT",
    exchanges: ["OKX", "Bybit"],
    profit: 214.22,
    profitPercentage: 1.89,
    timestamp: new Date(Date.now() - 50 * 60 * 1000)
  },
  {
    id: "6",
    type: "triangular",
    pair: "BNB → SOL → USDT",
    exchanges: ["Binance"],
    profit: 18.65,
    profitPercentage: 1.45,
    timestamp: new Date(Date.now() - 62 * 60 * 1000)
  },
  {
    id: "7",
    type: "futures",
    pair: "ADA/USDT",
    exchanges: ["Binance", "Huobi"],
    profit: 0.09,
    profitPercentage: 2.53,
    timestamp: new Date(Date.now() - 74 * 60 * 1000)
  },
  {
    id: "8",
    type: "p2p",
    pair: "BTC/USDT",
    exchanges: ["Binance P2P", "Kraken"],
    profit: 431.18,
    profitPercentage: 1.67,
    timestamp: new Date(Date.now() - 120 * 60 * 1000)
  }
];

const volumeByExchangeData = [
  { name: "Binance", value: 45 },
  { name: "Coinbase", value: 25 },
  { name: "Kraken", value: 18 },
  { name: "Others", value: 12 }
];

const arbitrageTypesData = [
  { name: "Direct", value: 70 },
  { name: "Triangular", value: 90 },
  { name: "Futures", value: 50 },
  { name: "P2P", value: 35 }
];

const profitByExchangeData = [
  { name: "Binance", profit: 5423, trades: 42 },
  { name: "Coinbase", profit: 3218, trades: 28 },
  { name: "Kraken", profit: 2156, trades: 19 },
  { name: "Huobi", profit: 1042, trades: 12 },
  { name: "OKX", profit: 624, trades: 7 }
];

const marketTrendsData = [
  { date: "1 May", btc: 0.7, eth: 0.9, sol: 1.2, ada: -0.5, dot: 0.3 },
  { date: "2 May", btc: 1.2, eth: 0.6, sol: 1.8, ada: 0.2, dot: -0.4 },
  { date: "3 May", btc: 0.8, eth: 1.5, sol: 2.1, ada: 0.7, dot: 0.5 },
  { date: "4 May", btc: 1.5, eth: 1.8, sol: 1.5, ada: 1.2, dot: 0.9 },
  { date: "5 May", btc: 2.3, eth: 2.1, sol: 0.8, ada: 1.5, dot: 1.2 },
  { date: "6 May", btc: 1.9, eth: 2.5, sol: 1.2, ada: 0.8, dot: 1.7 },
  { date: "7 May", btc: 2.5, eth: 3.0, sol: 2.3, ada: 1.1, dot: 2.0 }
];

const marketCorrelationData = [
  { subject: 'BTC', A: 120, B: 110, fullMark: 150 },
  { subject: 'ETH', A: 98, B: 130, fullMark: 150 },
  { subject: 'SOL', A: 86, B: 130, fullMark: 150 },
  { subject: 'ADA', A: 99, B: 100, fullMark: 150 },
  { subject: 'DOT', A: 85, B: 90, fullMark: 150 },
  { subject: 'AVAX', A: 65, B: 85, fullMark: 150 }
];

const topPairsData = [
  { pair: "BTC/USDT", volume: "$2.4B", opportunities: 18, avgProfit: "1.85%" },
  { pair: "ETH/USDT", volume: "$1.2B", opportunities: 14, avgProfit: "1.62%" },
  { pair: "SOL/USDT", volume: "$420M", opportunities: 9, avgProfit: "2.05%" },
  { pair: "BNB/USDT", volume: "$320M", opportunities: 7, avgProfit: "1.43%" }
];

const networkStatusData = [
  { network: "Ethereum", status: "Operational", fee: "$4.23", congestion: 42 },
  { network: "Binance", status: "Operational", fee: "$0.15", congestion: 28 },
  { network: "Solana", status: "Minor Issues", fee: "$0.001", congestion: 65 },
  { network: "Polygon", status: "Operational", fee: "$0.01", congestion: 15 }
];

const arbiTraderStats = [
  { trader: "CryptoWhale", profit: "$24,532", winRate: 92, trades: 284 },
  { trader: "ArbiMaster", profit: "$18,721", winRate: 89, trades: 356 },
  { trader: "FlashTrader", profit: "$15,625", winRate: 94, trades: 198 },
  { trader: "You", profit: "$12,464", winRate: 87, trades: 142 }
];

const COLORS = ['hsl(var(--accent))', 'hsl(var(--accent-alt))', 'hsl(var(--success))', 'hsl(var(--warning))'];

export default function DashboardOverview() {
  const [timePeriod, setTimePeriod] = useState("30d");
  const [opportunitiesTab, setOpportunitiesTab] = useState("recent");
  const [filteredOpportunities, setFilteredOpportunities] = useState(recentOpportunities);
  const [loading, setLoading] = useState(false);
  
  const refreshData = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };
  
  const handlePeriodChange = (period: string) => {
    setTimePeriod(period);
    // In a real app, this would refetch data based on the selected period
  };

  return (
    <div className="p-6 h-full overflow-auto bg-gradient-to-b from-background to-background-surface/60">
      <div className="max-w-7xl mx-auto">
        {/* Dashboard Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <motion.h1 
              className="text-3xl font-bold text-glow flex items-center"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <PanelTop className="mr-2 h-8 w-8 text-accent" />
              Command Center
            </motion.h1>
            <motion.p 
              className="text-muted-foreground mt-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Real-time overview of your arbitrage operations and market insights
            </motion.p>
          </div>
          <motion.div 
            className="mt-4 md:mt-0 flex space-x-3"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Select defaultValue={timePeriod} onValueChange={handlePeriodChange}>
              <SelectTrigger className="w-[120px] bg-background-surface/80 border-accent/20">
                <SelectValue placeholder="Time period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">Last 24h</SelectItem>
                <SelectItem value="7d">Last 7d</SelectItem>
                <SelectItem value="30d">Last 30d</SelectItem>
                <SelectItem value="90d">Last 90d</SelectItem>
                <SelectItem value="all">All time</SelectItem>
              </SelectContent>
            </Select>
            <Button className="bg-accent hover:bg-accent/80 text-background" onClick={refreshData}>
              <RefreshCw className="mr-2 h-4 w-4 text-background" />
              Refresh
            </Button>
            <Link href="/profile?tab=api">
            <Button className="bg-success hover:bg-success/80 text-background">
                <Link2 className="mr-2 h-4 w-4 text-background" />
              Add Exchange API
            </Button>
            </Link>
          </motion.div>
        </div>

        {/* Quick Stats */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <StatCard
            title="Total Profit (30d)"
            value="$12,463.84"
            icon={CircleDollarSign}
            trend={{ value: "23.5% from last month", positive: true }}
            iconBgColor="bg-success/10"
            iconColor="text-success"
          />
          
          <StatCard
            title="Arbitrage Win Rate"
            value="94.2%"
            icon={Flame}
            trend={{ value: "2.1% higher than average", positive: true }}
            iconBgColor="bg-accent/10"
            iconColor="text-accent"
          />
          
          <StatCard
            title="Current Opportunities"
            value="18"
            icon={Zap}
            trend={{ value: "4 new in the last hour", positive: true }}
            iconBgColor="bg-warning/10"
            iconColor="text-warning"
          />
          
          <StatCard
            title="Avg. Execution Time"
            value="3.7s"
            icon={Clock}
            trend={{ value: "0.5s faster than yesterday", positive: true }}
            iconBgColor="bg-accent-alt/10"
            iconColor="text-accent-alt"
          />
        </motion.div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Main Chart Section */}
          <motion.div 
            className="lg:col-span-2 space-y-5"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            {/* Profit Chart */}
            <Card className="bg-background-surface/80 backdrop-blur border-accent/20 card-glow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="text-lg flex items-center">
                    <LineChart className="mr-2 h-5 w-5 text-accent" />
                    Profit Performance
                  </CardTitle>
                  <CardDescription>Real-time profit tracking across all exchanges</CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Filter className="h-4 w-4 text-accent" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Chart Options</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Show all exchanges</DropdownMenuItem>
                    <DropdownMenuItem>Show by arbitrage type</DropdownMenuItem>
                    <DropdownMenuItem>Show cumulative</DropdownMenuItem>
                    <DropdownMenuItem>Export data</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent className="pb-4">
                <ProfitChart />
              </CardContent>
            </Card>

            {/* Exchange Performance */}
            <Card className="bg-background-surface/80 backdrop-blur border-accent/20 card-glow">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <BarChart3 className="mr-2 h-5 w-5 text-accent" />
                  Exchange Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {profitByExchangeData.map((exchange, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{exchange.name}</span>
                        <span className="text-success">${exchange.profit.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs text-muted-foreground">
                        <span>{exchange.trades} trades</span>
                        <span>${(exchange.profit / exchange.trades).toFixed(2)} avg. profit/trade</span>
                      </div>
                      <Progress value={(exchange.profit / profitByExchangeData[0].profit) * 100} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Market Insights Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Market Correlation */}
              <Card className="bg-background-surface/80 backdrop-blur border-accent/20 card-glow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Wallet className="mr-2 h-5 w-5 text-accent" />
                    Market Correlation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={marketCorrelationData}>
                        <PolarGrid stroke="hsl(var(--accent) / 0.2)" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                        <PolarRadiusAxis stroke="hsl(var(--accent) / 0.2)" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                        <Radar name="Price" dataKey="A" stroke="hsl(var(--accent))" fill="hsl(var(--accent) / 0.6)" fillOpacity={0.6} />
                        <Radar name="Volume" dataKey="B" stroke="hsl(var(--accent-alt))" fill="hsl(var(--accent-alt) / 0.6)" fillOpacity={0.6} />
                        <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background-surface))', borderColor: 'hsl(var(--accent) / 0.2)' }} />
                        <Legend />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Top Trading Pairs */}
              <Card className="bg-background-surface/80 backdrop-blur border-accent/20 card-glow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Trophy className="mr-2 h-5 w-5 text-accent" />
                    Top Arbitrage Pairs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topPairsData.map((pair, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${index === 0 ? 'bg-amber-500/20 text-amber-500' : index === 1 ? 'bg-slate-400/20 text-slate-400' : index === 2 ? 'bg-amber-700/20 text-amber-700' : 'bg-muted/20 text-muted-foreground'}`}>
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-medium">{pair.pair}</div>
                            <div className="text-xs text-muted-foreground">Volume: {pair.volume}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-success">{pair.avgProfit}</div>
                          <div className="text-xs text-muted-foreground">{pair.opportunities} opportunities</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* Sidebars */}
          <motion.div 
            className="space-y-5"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            {/* Arbitrage Opportunities */}
            <Card className="bg-background-surface/80 backdrop-blur border-accent/20 card-glow">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg flex items-center">
                    <Zap className="mr-2 h-5 w-5 text-accent" />
                    Arbitrage Opportunities
                  </CardTitle>
                  <Button variant="outline" size="sm" className="h-8 text-accent border-accent/20 hover:bg-accent/10" asChild>
                    <Link href="/opportunities">
                      <span className="flex items-center">
                        View all <ArrowUpRight className="ml-1 h-4 w-4 text-accent" />
                      </span>
                    </Link>
                  </Button>
                </div>
                <Tabs defaultValue="recent" onValueChange={(v) => setOpportunitiesTab(v)}>
                  <TabsList className="bg-background/20">
                    <TabsTrigger value="recent">Recent</TabsTrigger>
                    <TabsTrigger value="hot">Hot</TabsTrigger>
                    <TabsTrigger value="best">Best ROI</TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardHeader>
              <CardContent>
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={opportunitiesTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-3"
                  >
                    {opportunitiesTab === "recent" && recentOpportunities.slice(0, 4).map(opportunity => (
                      <ArbitrageOpportunity key={opportunity.id} opportunity={opportunity} />
                    ))}
                    {opportunitiesTab === "hot" && allOpportunities
                      .filter(opp => opp.type === "direct" || opp.type === "futures")
                      .sort((a, b) => b.profitPercentage - a.profitPercentage)
                      .slice(0, 4)
                      .map(opportunity => (
                        <ArbitrageOpportunity key={opportunity.id} opportunity={opportunity} />
                      ))
                    }
                    {opportunitiesTab === "best" && allOpportunities
                      .sort((a, b) => b.profitPercentage - a.profitPercentage)
                      .slice(0, 4)
                      .map(opportunity => (
                        <ArbitrageOpportunity key={opportunity.id} opportunity={opportunity} />
                      ))
                    }
                  </motion.div>
                </AnimatePresence>
              </CardContent>
              <CardFooter className="pt-2 border-t border-accent/10">
                <Button variant="ghost" className="w-full text-accent text-sm flex items-center" asChild>
                  <Link href="/arbitrage">
                    See all arbitrage opportunities
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            {/* Network Status */}
            <Card className="bg-background-surface/80 backdrop-blur border-accent/20 card-glow">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg flex items-center">
                    <AlertCircle className="mr-2 h-5 w-5 text-accent" />
                    Network Status
                  </CardTitle>
                  <Button variant="link" className="h-8 p-0 text-accent" asChild>
                    <Link href="/network-monitor">Details</Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {networkStatusData.map((network, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{network.network}</div>
                        <div className="flex items-center mt-1">
                          <div className={`w-2 h-2 rounded-full mr-2 ${network.status === "Operational" ? "bg-success" : "bg-warning"}`}></div>
                          <span className="text-xs text-muted-foreground">{network.status}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{network.fee}</div>
                        <div className="text-xs text-muted-foreground">Congestion: {network.congestion}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="pt-2 border-t border-accent/10">
                <Button variant="ghost" className="w-full text-accent text-sm" asChild>
                  <Link href="/network-monitor">Monitor all networks</Link>
                </Button>
              </CardFooter>
            </Card>
            
            {/* Trader Leaderboard */}
            <Card className="bg-background-surface/80 backdrop-blur border-accent/20 card-glow">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Trophy className="mr-2 h-5 w-5 text-accent" />
                  Arbitrage Leaderboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {arbiTraderStats.map((trader, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Avatar className="h-8 w-8 mr-3">
                          <AvatarFallback className={`text-xs ${trader.trader === "You" ? "bg-accent text-background" : "bg-accent/20 text-accent"}`}>
                            {trader.trader === "You" ? "YOU" : trader.trader.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium flex items-center">
                            {trader.trader} 
                            {trader.trader === "You" && <span className="ml-2 bg-accent/20 text-accent text-xs py-0.5 px-1.5 rounded">You</span>}
                          </div>
                          <div className="text-xs text-muted-foreground">{trader.trades} trades</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-success">{trader.profit}</div>
                        <div className="text-xs text-muted-foreground">Win rate: {trader.winRate}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
