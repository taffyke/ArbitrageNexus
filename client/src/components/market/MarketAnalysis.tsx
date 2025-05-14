import { useState } from "react";
import { motion } from "framer-motion";
import { 
  RefreshCw, 
  BarChart3, 
  LineChart as LineChartIcon, 
  Zap, 
  ArrowLeftRight,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  Filter,
  Download,
  HelpCircle,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Wallet
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import StatCard from "@/components/dashboard/StatCard";
import PriceChart from "./PriceChart";
import ExchangeComparison from "./ExchangeComparison";
import MarketDepth from "./MarketDepth";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  ScatterChart, 
  Scatter,
  ZAxis,
  ReferenceLine,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Treemap
} from "recharts";

// Sample data for correlation heatmap
const correlationData = [
  { exchange: "Binance", correlationScore: 0.98, volumeRatio: 3.2, priceDifference: 0.05, arbitrageOpportunity: 'Low' },
  { exchange: "Coinbase", correlationScore: 0.92, volumeRatio: 2.8, priceDifference: 0.34, arbitrageOpportunity: 'Medium' },
  { exchange: "Kraken", correlationScore: 0.95, volumeRatio: 2.1, priceDifference: 0.15, arbitrageOpportunity: 'Low' },
  { exchange: "OKX", correlationScore: 0.87, volumeRatio: 2.4, priceDifference: 0.72, arbitrageOpportunity: 'High' },
  { exchange: "Bybit", correlationScore: 0.89, volumeRatio: 1.9, priceDifference: 0.65, arbitrageOpportunity: 'Medium' },
  { exchange: "Kucoin", correlationScore: 0.85, volumeRatio: 1.6, priceDifference: 0.78, arbitrageOpportunity: 'High' },
  { exchange: "Huobi", correlationScore: 0.91, volumeRatio: 1.8, priceDifference: 0.42, arbitrageOpportunity: 'Medium' },
  { exchange: "Gate.io", correlationScore: 0.84, volumeRatio: 1.3, priceDifference: 0.82, arbitrageOpportunity: 'High' },
];

// Sample data for arbitrage heatmap (pairs vs exchanges price differences)
const heatmapData = [
  { pair: "BTC/USDT", binance: 0.02, coinbase: 0.34, kraken: 0.15, okx: 0.42, bybit: 0.26 },
  { pair: "ETH/USDT", binance: 0.19, coinbase: 0.12, kraken: 0.27, okx: 0.15, bybit: 0.38 },
  { pair: "SOL/USDT", binance: 0.31, coinbase: 0.26, kraken: 0.08, okx: 0.19, bybit: 0.04 },
  { pair: "ADA/USDT", binance: 0.04, coinbase: 0.18, kraken: 0.35, okx: 0.11, bybit: 0.29 },
  { pair: "DOT/USDT", binance: 0.26, coinbase: 0.42, kraken: 0.19, okx: 0.05, bybit: 0.37 },
  { pair: "AVAX/USDT", binance: 0.38, coinbase: 0.09, kraken: 0.24, okx: 0.32, bybit: 0.16 },
  { pair: "MATIC/USDT", binance: 0.11, coinbase: 0.28, kraken: 0.06, okx: 0.37, bybit: 0.22 },
];

// Sample data for liquidity analysis
const liquidityData = [
  { pair: "BTC/USDT", bidAskSpread: 0.02, marketDepth: 95, slippage: 0.03, volumeToLiquidityRatio: 0.78 },
  { pair: "ETH/USDT", bidAskSpread: 0.04, marketDepth: 89, slippage: 0.05, volumeToLiquidityRatio: 0.72 },
  { pair: "SOL/USDT", bidAskSpread: 0.07, marketDepth: 75, slippage: 0.09, volumeToLiquidityRatio: 0.65 },
  { pair: "ADA/USDT", bidAskSpread: 0.06, marketDepth: 82, slippage: 0.08, volumeToLiquidityRatio: 0.68 },
  { pair: "DOT/USDT", bidAskSpread: 0.09, marketDepth: 70, slippage: 0.11, volumeToLiquidityRatio: 0.62 },
  { pair: "AVAX/USDT", bidAskSpread: 0.05, marketDepth: 85, slippage: 0.06, volumeToLiquidityRatio: 0.71 },
  { pair: "MATIC/USDT", bidAskSpread: 0.08, marketDepth: 73, slippage: 0.10, volumeToLiquidityRatio: 0.64 },
];

// Sample data for volatility analysis
const volatilityData = [
  { timestamp: "10:00", btc: 1.2, eth: 1.8, sol: 2.5, ada: 1.4, dot: 1.9 },
  { timestamp: "11:00", btc: 1.3, eth: 1.6, sol: 2.7, ada: 1.5, dot: 2.1 },
  { timestamp: "12:00", btc: 1.5, eth: 1.9, sol: 2.3, ada: 1.8, dot: 1.7 },
  { timestamp: "13:00", btc: 1.4, eth: 2.2, sol: 2.1, ada: 1.3, dot: 1.8 },
  { timestamp: "14:00", btc: 1.6, eth: 1.7, sol: 2.4, ada: 1.6, dot: 2.2 },
  { timestamp: "15:00", btc: 1.2, eth: 1.9, sol: 2.8, ada: 1.7, dot: 2.0 },
  { timestamp: "16:00", btc: 1.5, eth: 2.0, sol: 2.2, ada: 1.5, dot: 1.9 },
];

// Sample data for price difference radar
const radarChartData = [
  { subject: 'BTC/USDT', binance: 95, coinbase: 92, kraken: 94, okx: 90, fullMark: 100 },
  { subject: 'ETH/USDT', binance: 93, coinbase: 90, kraken: 91, okx: 89, fullMark: 100 },
  { subject: 'SOL/USDT', binance: 90, coinbase: 88, kraken: 86, okx: 92, fullMark: 100 },
  { subject: 'ADA/USDT', binance: 94, coinbase: 91, kraken: 89, okx: 93, fullMark: 100 },
  { subject: 'DOT/USDT', binance: 92, coinbase: 87, kraken: 90, okx: 91, fullMark: 100 },
  { subject: 'AVAX/USDT', binance: 91, coinbase: 89, kraken: 92, okx: 88, fullMark: 100 },
];

// Sample data for arbitrage opportunity index
const opportunityIndexData = [
  { date: "05/01", direct: 58, triangular: 65, futures: 72, p2p: 45 },
  { date: "05/02", direct: 62, triangular: 63, futures: 68, p2p: 48 },
  { date: "05/03", direct: 65, triangular: 68, futures: 65, p2p: 52 },
  { date: "05/04", direct: 60, triangular: 72, futures: 63, p2p: 55 },
  { date: "05/05", direct: 68, triangular: 75, futures: 67, p2p: 58 },
  { date: "05/06", direct: 72, triangular: 70, futures: 74, p2p: 60 },
  { date: "05/07", direct: 75, triangular: 68, futures: 78, p2p: 62 },
];

// Scatter plot data showing correlation between volume and price difference
const scatterData = [
  { exchange: "Binance", volume: 820, priceDeviation: 0.21, arbitrageScore: 35 },
  { exchange: "Coinbase", volume: 580, priceDeviation: 0.38, arbitrageScore: 52 },
  { exchange: "Kraken", volume: 490, priceDeviation: 0.25, arbitrageScore: 38 },
  { exchange: "OKX", volume: 390, priceDeviation: 0.49, arbitrageScore: 65 },
  { exchange: "Bybit", volume: 320, priceDeviation: 0.42, arbitrageScore: 58 },
  { exchange: "Kucoin", volume: 280, priceDeviation: 0.57, arbitrageScore: 72 },
  { exchange: "Huobi", volume: 250, priceDeviation: 0.36, arbitrageScore: 48 },
  { exchange: "Gate.io", volume: 190, priceDeviation: 0.62, arbitrageScore: 78 },
  { exchange: "Bitfinex", volume: 170, priceDeviation: 0.33, arbitrageScore: 45 },
  { exchange: "Gemini", volume: 160, priceDeviation: 0.45, arbitrageScore: 60 },
];

// Arbitrage opportunities by asset size (treemap)
const assetOpportunitiesData = [
  {
    name: 'Assets',
    children: [
      { name: 'BTC', size: 3500, value: 3500, fill: 'hsl(var(--accent))' },
      { name: 'ETH', size: 2800, value: 2800, fill: 'hsl(var(--accent-alt))' },
      { name: 'SOL', size: 1800, value: 1800, fill: 'hsl(var(--success))' },
      { name: 'ADA', size: 1200, value: 1200, fill: 'hsl(var(--warning))' },
      { name: 'DOT', size: 950, value: 950, fill: 'hsl(var(--destructive))' },
      { name: 'AVAX', size: 850, value: 850, fill: 'hsl(var(--accent) / 0.7)' },
      { name: 'MATIC', size: 680, value: 680, fill: 'hsl(var(--accent-alt) / 0.7)' },
      { name: 'LINK', size: 580, value: 580, fill: 'hsl(var(--success) / 0.7)' },
      { name: 'XRP', size: 520, value: 520, fill: 'hsl(var(--warning) / 0.7)' },
      { name: 'DOGE', size: 480, value: 480, fill: 'hsl(var(--destructive) / 0.7)' },
    ],
  },
];

export default function MarketAnalysis() {
  const [selectedPair, setSelectedPair] = useState("BTC/USDT");
  const [timeRange, setTimeRange] = useState("1D");
  const [loading, setLoading] = useState(false);
  const [opportunityThreshold, setOpportunityThreshold] = useState([0.3]);
  
  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };
  
  const opportunityColor = (value: number): string => {
    if (value < 0.2) return 'bg-muted text-muted-foreground';
    if (value < 0.4) return 'bg-warning/20 text-warning';
    return 'bg-success/20 text-success';
  };
  
  return (
    <div className="p-6 h-full overflow-auto bg-gradient-to-b from-background to-background-surface/60">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <motion.div 
          className="mb-8 flex flex-col md:flex-row md:items-center justify-between"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <h1 className="text-3xl font-bold text-glow flex items-center">
              <BarChart3 className="mr-2 h-6 w-6 text-accent" />
              Market Analysis
            </h1>
            <p className="text-muted-foreground mt-1">Advanced crypto market analysis focused on arbitrage opportunities</p>
          </div>
          
          <motion.div 
            className="mt-4 md:mt-0 flex space-x-3"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search markets..."
                className="pl-9 bg-background-surface/80 border-accent/20 w-[200px]"
              />
            </div>
            
            <Select defaultValue={selectedPair} onValueChange={setSelectedPair}>
              <SelectTrigger className="w-[180px] bg-background-surface/80 border-accent/20">
                <SelectValue placeholder="Select pair" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BTC/USDT">BTC/USDT</SelectItem>
                <SelectItem value="ETH/USDT">ETH/USDT</SelectItem>
                <SelectItem value="SOL/USDT">SOL/USDT</SelectItem>
                <SelectItem value="ADA/USDT">ADA/USDT</SelectItem>
                <SelectItem value="DOT/USDT">DOT/USDT</SelectItem>
                <SelectItem value="AVAX/USDT">AVAX/USDT</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[120px] bg-background-surface/80 border-accent/20">
                <SelectValue placeholder="Time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1D">1 Day</SelectItem>
                <SelectItem value="1W">1 Week</SelectItem>
                <SelectItem value="1M">1 Month</SelectItem>
                <SelectItem value="3M">3 Months</SelectItem>
              </SelectContent>
            </Select>
            
            <Button 
              variant="default" 
              className="bg-accent hover:bg-accent/80 text-background"
              onClick={handleRefresh}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </motion.div>
        </motion.div>
        
        {/* Market Statistics */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <StatCard
            title={`${selectedPair.split('/')[0]} Price (Avg)`}
            value="$29,854.23"
            icon={ArrowUpRight}
            trend={{ value: "+1.2% in 24h", positive: true }}
            iconBgColor="bg-accent/10"
            iconColor="text-accent"
          />
          
          <StatCard
            title="Exchange Spread"
            value="0.95%"
            icon={ArrowLeftRight}
            trend={{ value: "0.2% higher than avg", positive: true }}
            iconBgColor="bg-warning/10"
            iconColor="text-warning"
          />
          
          <StatCard
            title="Arbitrage Signal"
            value="Medium"
            icon={Zap}
            trend={{ value: "3 active opportunities", positive: true }}
            iconBgColor="bg-success/10"
            iconColor="text-success"
          />
          
          <StatCard
            title="Execution ETA"
            value="4.2s"
            icon={RefreshCw}
            trend={{ value: "0.5s lower than avg", positive: true }}
            iconBgColor="bg-accent-alt/10"
            iconColor="text-accent-alt"
          />
        </motion.div>
        
        {/* Main Content */}
        <Tabs defaultValue="arbitrage" className="space-y-4">
          <TabsList className="bg-background-surface/80 border border-accent/10 p-1">
            <TabsTrigger value="arbitrage">Arbitrage Analysis</TabsTrigger>
            <TabsTrigger value="correlation">Price Correlation</TabsTrigger>
            <TabsTrigger value="liquidity">Liquidity Analysis</TabsTrigger>
            <TabsTrigger value="volatility">Volatility</TabsTrigger>
          </TabsList>

          {/* Arbitrage Analysis Tab */}
          <TabsContent value="arbitrage" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-semibold">Arbitrage Opportunity Overview</h2>
                <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
                  {selectedPair}
                </Badge>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">Min. Opportunity Threshold:</span>
                  <Slider
                    value={opportunityThreshold}
                    onValueChange={setOpportunityThreshold}
                    min={0.1}
                    max={1.0}
                    step={0.1}
                    className="w-32"
                  />
                  <span className="text-sm font-medium">{opportunityThreshold[0]}%</span>
                </div>
                <Button variant="outline" size="sm" className="bg-background-surface/80 border-accent/20">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Arbitrage Heatmap */}
              <Card className="card-glow bg-background-surface/80 backdrop-blur border-accent/20">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg flex items-center">
                        <Zap className="mr-2 h-5 w-5 text-accent" />
                        Exchange Price Difference Heatmap
                      </CardTitle>
                      <CardDescription>
                        Visualizing price disparities between exchanges (%)
                      </CardDescription>
                    </div>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <HelpCircle className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="w-80 p-4">
                        <p>This heatmap shows the percentage price difference between exchanges for various trading pairs. Higher values (darker colors) indicate greater arbitrage potential.</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-80 overflow-x-auto">
                    <table className="w-full min-w-[600px]">
                      <thead>
                        <tr>
                          <th className="sticky left-0 bg-background-surface z-10 border-r border-border/10 text-left px-3 py-2 text-sm font-medium">Pair</th>
                          <th className="px-3 py-2 text-sm font-medium text-center">Binance</th>
                          <th className="px-3 py-2 text-sm font-medium text-center">Coinbase</th>
                          <th className="px-3 py-2 text-sm font-medium text-center">Kraken</th>
                          <th className="px-3 py-2 text-sm font-medium text-center">OKX</th>
                          <th className="px-3 py-2 text-sm font-medium text-center">Bybit</th>
                        </tr>
                      </thead>
                      <tbody>
                        {heatmapData.map((row, index) => (
                          <tr key={index} className={index % 2 === 0 ? 'bg-background/30' : 'bg-transparent'}>
                            <td className="sticky left-0 bg-background-surface z-10 border-r border-border/10 px-3 py-2 text-sm font-medium">{row.pair}</td>
                            <td className={`px-3 py-2 text-center text-sm ${opportunityColor(row.binance)}`}>
                              {(row.binance * 100).toFixed(2)}%
                            </td>
                            <td className={`px-3 py-2 text-center text-sm ${opportunityColor(row.coinbase)}`}>
                              {(row.coinbase * 100).toFixed(2)}%
                            </td>
                            <td className={`px-3 py-2 text-center text-sm ${opportunityColor(row.kraken)}`}>
                              {(row.kraken * 100).toFixed(2)}%
                            </td>
                            <td className={`px-3 py-2 text-center text-sm ${opportunityColor(row.okx)}`}>
                              {(row.okx * 100).toFixed(2)}%
                            </td>
                            <td className={`px-3 py-2 text-center text-sm ${opportunityColor(row.bybit)}`}>
                              {(row.bybit * 100).toFixed(2)}%
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between pt-2 border-t border-accent/10 text-sm">
                  <span className="text-muted-foreground">
                    Updated: 5 minutes ago
                  </span>
                  <Button variant="link" size="sm" className="h-8 p-0 text-accent" asChild>
                    <a href="#" className="flex items-center">
                      View details
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </a>
                  </Button>
                </CardFooter>
              </Card>

              {/* Arbitrage Scatter Plot */}
              <Card className="card-glow bg-background-surface/80 backdrop-blur border-accent/20">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg flex items-center">
                        <ArrowLeftRight className="mr-2 h-5 w-5 text-accent" />
                        Volume vs. Price Deviation
                      </CardTitle>
                      <CardDescription>
                        Identifying high-volume arbitrage opportunities
                      </CardDescription>
                    </div>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <HelpCircle className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="w-80 p-4">
                        <p>This scatter plot shows the relationship between trading volume and price deviation across exchanges. The size of each point represents the arbitrage opportunity score.</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <ScatterChart
                        margin={{ top: 20, right: 30, bottom: 10, left: 10 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.3)" />
                        <XAxis 
                          dataKey="volume" 
                          name="Volume" 
                          type="number" 
                          unit="BTC"
                          stroke="hsl(var(--muted-foreground))"
                        />
                        <YAxis 
                          dataKey="priceDeviation" 
                          name="Price Deviation" 
                          unit="%" 
                          stroke="hsl(var(--muted-foreground))"
                        />
                        <ZAxis 
                          dataKey="arbitrageScore" 
                          range={[50, 400]} 
                          name="Arbitrage Score" 
                        />
                        <RechartsTooltip 
                          cursor={{ strokeDasharray: '3 3' }}
                          contentStyle={{
                            backgroundColor: "hsl(var(--background-surface))",
                            borderColor: "hsl(var(--border))",
                          }}
                          formatter={(value: any, name: string) => {
                            if (name === 'Price Deviation') return [`${(value * 100).toFixed(2)}%`, name];
                            return [value, name];
                          }}
                        />
                        <ReferenceLine 
                          y={opportunityThreshold[0]} 
                          stroke="hsl(var(--accent))" 
                          strokeDasharray="3 3"
                          label={{ 
                            value: 'Opportunity Threshold', 
                            position: 'right', 
                            fill: 'hsl(var(--accent))' 
                          }}
                        />
                        <Scatter 
                          name="Exchanges" 
                          data={scatterData} 
                          fill="hsl(var(--accent))" 
                        />
                      </ScatterChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between pt-2 border-t border-accent/10 text-sm">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-success mr-1"></div>
                      <span className="text-muted-foreground text-xs">High opportunity</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-warning mr-1"></div>
                      <span className="text-muted-foreground text-xs">Medium opportunity</span>
                    </div>
                  </div>
                  <Button variant="link" size="sm" className="h-8 p-0 text-accent">
                    See trend analysis
                  </Button>
                </CardFooter>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
              {/* Original Price Chart */}
              <Card className="card-glow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <LineChartIcon className="mr-2 h-5 w-5 text-accent" />
                    Price Chart
                  </CardTitle>
                  <CardDescription>
                    {selectedPair} price across different time periods
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PriceChart pair={selectedPair} />
                </CardContent>
              </Card>

              {/* Asset Opportunity Treemap */}
              <Card className="card-glow bg-background-surface/80 backdrop-blur border-accent/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <BarChart3 className="mr-2 h-5 w-5 text-accent" />
                    Arbitrage Opportunities by Asset
                  </CardTitle>
                  <CardDescription>Asset distribution of current arbitrage opportunities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <Treemap
                        data={assetOpportunitiesData}
                        dataKey="value"
                        nameKey="name"
                        stroke="hsl(var(--background))"
                        fill="hsl(var(--accent))"
                      >
                        <RechartsTooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--background-surface))",
                            borderColor: "hsl(var(--border))",
                          }}
                          formatter={(value: number, name: string, props: any) => {
                            return [`Score: ${value}`, name];
                          }}
                        />
                      </Treemap>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
                <CardFooter className="pt-2 border-t border-accent/10">
                  <span className="text-sm text-muted-foreground">
                    Size represents potential profitability across all exchanges
                  </span>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          {/* Price Correlation Tab */}
          <TabsContent value="correlation" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className="card-glow bg-background-surface/80 backdrop-blur border-accent/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <ArrowLeftRight className="mr-2 h-5 w-5 text-accent" />
                    Exchange Correlation Analysis
                  </CardTitle>
                  <CardDescription>
                    Identifying exchange pairs with low correlation for arbitrage
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80 overflow-y-auto">
                    <table className="w-full">
                      <thead className="sticky top-0 bg-background-surface z-10">
                        <tr className="border-b border-border/10">
                          <th className="px-3 py-2 text-left text-sm font-medium">Exchange</th>
                          <th className="px-3 py-2 text-left text-sm font-medium">Correlation Score</th>
                          <th className="px-3 py-2 text-left text-sm font-medium">Volume Ratio</th>
                          <th className="px-3 py-2 text-left text-sm font-medium">Price Diff %</th>
                          <th className="px-3 py-2 text-left text-sm font-medium">Opportunity</th>
                        </tr>
                      </thead>
                      <tbody>
                        {correlationData.map((item, index) => (
                          <tr key={index} className={index % 2 === 0 ? 'bg-background/30' : 'bg-transparent'}>
                            <td className="px-3 py-2 text-sm">{item.exchange}</td>
                            <td className="px-3 py-2 text-sm">{item.correlationScore.toFixed(2)}</td>
                            <td className="px-3 py-2 text-sm">{item.volumeRatio.toFixed(1)}x</td>
                            <td className="px-3 py-2 text-sm">{(item.priceDifference * 100).toFixed(2)}%</td>
                            <td className="px-3 py-2 text-sm">
                              <Badge variant="outline" className={
                                item.arbitrageOpportunity === 'Low' 
                                  ? 'bg-muted/20 text-muted-foreground' 
                                  : item.arbitrageOpportunity === 'Medium'
                                    ? 'bg-warning/20 text-warning'
                                    : 'bg-success/20 text-success'
                              }>
                                {item.arbitrageOpportunity}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
                <CardFooter className="pt-2 border-t border-accent/10">
                  <span className="text-sm text-muted-foreground">
                    Lower correlation scores and higher price differences indicate better arbitrage opportunities
                  </span>
                </CardFooter>
              </Card>

              <Card className="card-glow bg-background-surface/80 backdrop-blur border-accent/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <RefreshCw className="mr-2 h-5 w-5 text-accent" />
                    Exchange Price Correlation Radar
                  </CardTitle>
                  <CardDescription>
                    Visualizing price consistency across exchanges by trading pair
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarChartData}>
                        <PolarGrid stroke="hsl(var(--border) / 0.3)" />
                        <PolarAngleAxis dataKey="subject" stroke="hsl(var(--muted-foreground))" />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="hsl(var(--muted-foreground))" />
                        <Radar
                          name="Binance"
                          dataKey="binance"
                          stroke="hsl(var(--accent))"
                          fill="hsl(var(--accent) / 0.6)"
                          fillOpacity={0.6}
                        />
                        <Radar
                          name="Coinbase"
                          dataKey="coinbase"
                          stroke="hsl(var(--accent-alt))"
                          fill="hsl(var(--accent-alt) / 0.6)"
                          fillOpacity={0.6}
                        />
                        <Radar
                          name="Kraken"
                          dataKey="kraken"
                          stroke="hsl(var(--success))"
                          fill="hsl(var(--success) / 0.6)"
                          fillOpacity={0.6}
                        />
                        <Radar
                          name="OKX"
                          dataKey="okx"
                          stroke="hsl(var(--warning))"
                          fill="hsl(var(--warning) / 0.6)"
                          fillOpacity={0.6}
                        />
                        <Legend />
                        <RechartsTooltip 
                          contentStyle={{
                            backgroundColor: "hsl(var(--background-surface))",
                            borderColor: "hsl(var(--border))",
                          }}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
                <CardFooter className="pt-2 border-t border-accent/10">
                  <span className="text-sm text-muted-foreground">
                    Greater disparities between exchange values indicate arbitrage potential
                  </span>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          {/* Liquidity Analysis Tab */}
          <TabsContent value="liquidity" className="space-y-4">
            <Card className="card-glow bg-background-surface/80 backdrop-blur border-accent/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <AlertCircle className="mr-2 h-5 w-5 text-accent" />
                  Liquidity Analysis by Trading Pair
                </CardTitle>
                <CardDescription>
                  Assess liquidity factors to determine viable arbitrage trade sizes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border/10">
                        <th className="px-4 py-3 text-left text-sm font-medium">Trading Pair</th>
                        <th className="px-4 py-3 text-left text-sm font-medium">Bid/Ask Spread</th>
                        <th className="px-4 py-3 text-left text-sm font-medium">Market Depth</th>
                        <th className="px-4 py-3 text-left text-sm font-medium">Slippage (1% depth)</th>
                        <th className="px-4 py-3 text-left text-sm font-medium">Volume/Liquidity Ratio</th>
                        <th className="px-4 py-3 text-left text-sm font-medium">Arbitrage Viability</th>
                      </tr>
                    </thead>
                    <tbody>
                      {liquidityData.map((item, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-background/30' : 'bg-transparent'}>
                          <td className="px-4 py-3 text-sm font-medium">{item.pair}</td>
                          <td className="px-4 py-3 text-sm">{(item.bidAskSpread * 100).toFixed(2)}%</td>
                          <td className="px-4 py-3 text-sm">${item.marketDepth.toLocaleString()}M</td>
                          <td className="px-4 py-3 text-sm">{(item.slippage * 100).toFixed(2)}%</td>
                          <td className="px-4 py-3 text-sm">{item.volumeToLiquidityRatio.toFixed(2)}</td>
                          <td className="px-4 py-3 text-sm">
                            <div className="flex items-center">
                              <div className={`w-2 h-2 rounded-full mr-2 ${
                                item.volumeToLiquidityRatio > 0.7 
                                  ? 'bg-success' 
                                  : item.volumeToLiquidityRatio > 0.5 
                                    ? 'bg-warning' 
                                    : 'bg-destructive'
                              }`}></div>
                              <span>
                                {item.volumeToLiquidityRatio > 0.7 
                                  ? 'High' 
                                  : item.volumeToLiquidityRatio > 0.5 
                                    ? 'Medium' 
                                    : 'Low'
                                }
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
              <CardFooter className="pt-2 border-t border-accent/10">
                <div className="flex items-center justify-between w-full">
                  <span className="text-sm text-muted-foreground">
                    Lower spreads and higher market depth typically support larger arbitrage trades
                  </span>
                  <Button variant="outline" size="sm" className="text-accent border-accent/20">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Detailed Report
                  </Button>
                </div>
              </CardFooter>
            </Card>
            
            <Card className="card-glow">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Wallet className="mr-2 h-5 w-5 text-accent" />
                  Market Depth Analysis
                </CardTitle>
                <CardDescription>
                  Visualizing order book depth across exchanges
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MarketDepth pair={selectedPair} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Volatility Tab */}
          <TabsContent value="volatility" className="space-y-4">
            <Card className="card-glow bg-background-surface/80 backdrop-blur border-accent/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Zap className="mr-2 h-5 w-5 text-accent" />
                  Volatility Comparison
                </CardTitle>
                <CardDescription>
                  Identify high-volatility periods for increased arbitrage opportunities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={volatilityData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.3)" />
                      <XAxis dataKey="timestamp" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <RechartsTooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--background-surface))",
                          borderColor: "hsl(var(--border))",
                        }}
                        formatter={(value: number) => [`${value}%`, 'Volatility']}
                      />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="btc"
                        name="BTC"
                        stackId="1"
                        stroke="hsl(var(--accent))"
                        fill="hsl(var(--accent) / 0.2)"
                      />
                      <Area
                        type="monotone"
                        dataKey="eth"
                        name="ETH"
                        stackId="2"
                        stroke="hsl(var(--accent-alt))"
                        fill="hsl(var(--accent-alt) / 0.2)"
                      />
                      <Area
                        type="monotone"
                        dataKey="sol"
                        name="SOL"
                        stackId="3"
                        stroke="hsl(var(--success))"
                        fill="hsl(var(--success) / 0.2)"
                      />
                      <Area
                        type="monotone"
                        dataKey="ada"
                        name="ADA"
                        stackId="4"
                        stroke="hsl(var(--warning))"
                        fill="hsl(var(--warning) / 0.2)"
                      />
                      <Area
                        type="monotone"
                        dataKey="dot"
                        name="DOT"
                        stackId="5"
                        stroke="hsl(var(--destructive))"
                        fill="hsl(var(--destructive) / 0.2)"
                      />
                      <ReferenceLine
                        y={2.0}
                        stroke="hsl(var(--accent))"
                        strokeDasharray="3 3"
                        label={{
                          value: 'High volatility threshold',
                          position: 'right',
                          fill: 'hsl(var(--accent))'
                        }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
              <CardFooter className="pt-2 border-t border-accent/10">
                <div className="text-sm text-muted-foreground flex items-center space-x-8">
                  <div className="flex items-center">
                    <ArrowUpRight className="h-4 w-4 text-success mr-1" />
                    <span>High volatility typically increases arbitrage opportunities</span>
                  </div>
                  <div className="flex items-center">
                    <ArrowDownRight className="h-4 w-4 text-warning mr-1" />
                    <span>Consider execution speed during volatile periods</span>
                  </div>
                </div>
              </CardFooter>
            </Card>
            
            <Card className="card-glow">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <LineChartIcon className="mr-2 h-5 w-5 text-accent" />
                  Exchange Comparison
                </CardTitle>
                <CardDescription>
                  Price variations across major exchanges
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ExchangeComparison pair={selectedPair} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
