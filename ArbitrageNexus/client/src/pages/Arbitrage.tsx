import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import { Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Helmet } from "react-helmet";
import ArbitrageTypes from "@/components/arbitrage/ArbitrageTypes";
import DirectArbitrage from "@/components/arbitrage/DirectArbitrage";
import TriangularArbitrage from "@/components/arbitrage/TriangularArbitrage";
import FuturesArbitrage from "@/components/arbitrage/FuturesArbitrage";
import P2PArbitrage from "@/components/arbitrage/P2PArbitrage";
import { 
  DirectArbitrageOpportunity, 
  TriangularArbitrageOpportunity,
  FuturesArbitrageOpportunity,
  P2PArbitrageOpportunity 
} from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

// Mock data for UI display
const directOpportunities: DirectArbitrageOpportunity[] = [
  {
    id: "direct1",
    type: "direct",
    pair: "BTC/USDT",
    exchanges: ["Binance", "Kraken"],
    profit: 853.43,
    profitPercentage: 3.24,
    timestamp: new Date(Date.now() - 2 * 60 * 1000),
    buyPrice: 26342.18,
    sellPrice: 27195.61,
    buyExchange: "Binance",
    sellExchange: "Kraken"
  },
  {
    id: "direct2",
    type: "direct",
    pair: "ETH/USDT",
    exchanges: ["Coinbase", "Binance"],
    profit: 45.38,
    profitPercentage: 2.78,
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    buyPrice: 1632.45,
    sellPrice: 1677.83,
    buyExchange: "Coinbase",
    sellExchange: "Binance"
  },
  {
    id: "direct3",
    type: "direct",
    pair: "SOL/USDT",
    exchanges: ["Huobi", "FTX"],
    profit: 0.44,
    profitPercentage: 2.15,
    timestamp: new Date(Date.now() - 8 * 60 * 1000),
    buyPrice: 20.43,
    sellPrice: 20.87,
    buyExchange: "Huobi",
    sellExchange: "FTX"
  }
];

const triangularOpportunities: TriangularArbitrageOpportunity[] = [
  {
    id: "triangular1",
    type: "triangular",
    pair: "ETH → BTC → USDT",
    exchanges: ["Binance"],
    profit: 30.81,
    profitPercentage: 1.87,
    timestamp: new Date(Date.now() - 3 * 60 * 1000),
    path: ["ETH", "BTC", "USDT"],
    exchange: "Binance",
    initialAmount: 1,
    finalAmount: 1675.34
  },
  {
    id: "triangular2",
    type: "triangular",
    pair: "USDT → ADA → BNB",
    exchanges: ["Coinbase"],
    profit: 13.50,
    profitPercentage: 1.35,
    timestamp: new Date(Date.now() - 7 * 60 * 1000),
    path: ["USDT", "ADA", "BNB"],
    exchange: "Coinbase",
    initialAmount: 1000,
    finalAmount: 1013.50
  }
];

const futuresOpportunities: FuturesArbitrageOpportunity[] = [
  {
    id: "futures1",
    type: "futures",
    pair: "BTC/USDT",
    exchanges: ["Binance"],
    profit: 550.25,
    profitPercentage: 2.09,
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    spotPrice: 26342.18,
    futuresPrice: 26892.43,
    premium: 2.09,
    exchange: "Binance"
  },
  {
    id: "futures2",
    type: "futures",
    pair: "ETH/USDT",
    exchanges: ["FTX"],
    profit: 27.43,
    profitPercentage: 1.68,
    timestamp: new Date(Date.now() - 22 * 60 * 1000),
    spotPrice: 1632.45,
    futuresPrice: 1659.88,
    premium: 1.68,
    exchange: "FTX"
  },
  {
    id: "futures3",
    type: "futures",
    pair: "SOL/USDT",
    exchanges: ["Bybit"],
    profit: 0.31,
    profitPercentage: 1.52,
    timestamp: new Date(Date.now() - 35 * 60 * 1000),
    spotPrice: 20.43,
    futuresPrice: 20.74,
    premium: 1.52,
    exchange: "Bybit"
  }
];

const p2pOpportunities: P2PArbitrageOpportunity[] = [
  {
    id: "p2p1",
    type: "p2p",
    pair: "USDT P2P",
    exchanges: ["Binance P2P", "Coinbase"],
    profit: 38.50,
    profitPercentage: 3.85,
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    buyRate: 0.97,
    sellRate: 1.00,
    buyExchange: "Binance P2P",
    sellExchange: "Coinbase"
  },
  {
    id: "p2p2",
    type: "p2p",
    pair: "BTC P2P",
    exchanges: ["Local Exchange", "Kraken"],
    profit: 581.75,
    profitPercentage: 2.21,
    timestamp: new Date(Date.now() - 23 * 60 * 1000),
    buyRate: 25760.43,
    sellRate: 26342.18,
    buyExchange: "Local Exchange",
    sellExchange: "Kraken"
  }
];

export default function Arbitrage() {
  const [selectedType, setSelectedType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const handleViewDetails = (id: string) => {
    toast({
      title: "Viewing details",
      description: `Viewing opportunity details for ID: ${id}`,
    });
  };

  const handleTrade = (id: string) => {
    toast({
      title: "Trade initiated",
      description: `Preparing to execute trade for ID: ${id}`,
    });
  };

  return (
    <>
      <Helmet>
        <title>Arbitrage Opportunities | ArbitragePro</title>
        <meta name="description" content="Monitor and execute profitable arbitrage trades across multiple exchanges in real-time." />
      </Helmet>
      <div className="h-screen w-screen bg-background overflow-hidden">
        <div className="flex h-full">
          <Sidebar />
          <main className="flex-1 h-full overflow-auto">
            <div className="p-6 h-full overflow-auto">
              <div className="max-w-7xl mx-auto">
                {/* Arbitrage Header */}
                <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold">Arbitrage Opportunities</h1>
                    <p className="text-muted-foreground mt-1">Monitor and execute profitable arbitrage trades</p>
                  </div>
                  <div className="mt-4 md:mt-0 flex space-x-3">
                    <div className="relative">
                      <Input
                        type="text"
                        placeholder="Search pairs..."
                        className="bg-background-surface border-accent/20 pr-10 w-full"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      <Search className="absolute right-3 top-3 text-muted-foreground h-4 w-4" />
                    </div>
                    <Button className="bg-accent hover:bg-accent/80 text-background">
                      <Filter className="mr-2 h-4 w-4" /> Filter
                    </Button>
                  </div>
                </div>

                {/* Arbitrage Type Tabs */}
                <ArbitrageTypes
                  selectedType={selectedType}
                  onTypeChange={setSelectedType}
                />

                {/* Display appropriate arbitrage section based on type */}
                {(selectedType === "all" || selectedType === "direct") && (
                  <DirectArbitrage
                    opportunities={directOpportunities}
                    onViewDetails={handleViewDetails}
                  />
                )}

                {(selectedType === "all" || selectedType === "triangular") && (
                  <TriangularArbitrage
                    opportunities={triangularOpportunities}
                    onViewDetails={handleViewDetails}
                  />
                )}

                {(selectedType === "all" || selectedType === "futures") && (
                  <FuturesArbitrage
                    opportunities={futuresOpportunities}
                    onTrade={handleTrade}
                  />
                )}

                {(selectedType === "all" || selectedType === "p2p") && (
                  <P2PArbitrage
                    opportunities={p2pOpportunities}
                    onViewDetails={handleViewDetails}
                  />
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
