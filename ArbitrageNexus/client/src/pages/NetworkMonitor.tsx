import { useState, useEffect } from "react";
import Sidebar from "@/components/layout/Sidebar";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Network,
  Zap,
  PiggyBank,
  Clock,
  CheckCircle2,
  AlertCircle,
  Info,
  RefreshCw,
  Wallet,
  Globe,
  Cpu,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

// Network types
type NetworkStatus = "Operational" | "Congested" | "Slow" | "Issues";
type BlockchainNetwork = {
  id: string;
  name: string;
  token: string;
  status: NetworkStatus;
  gasPrice: number; // in GWEI
  averageBlockTime: number; // in seconds
  transactionFee: number; // in USD
  transactionTime: number; // in minutes
  congestionLevel: number; // 0-100
  recommendedFor: ("arbitrage" | "transfer" | "trading")[];
  lastUpdated: Date;
};

// Mock network data
const networkData: BlockchainNetwork[] = [
  {
    id: "ethereum",
    name: "Ethereum",
    token: "ETH",
    status: "Operational",
    gasPrice: 25,
    averageBlockTime: 12,
    transactionFee: 5.23,
    transactionTime: 2.5,
    congestionLevel: 45,
    recommendedFor: ["trading"],
    lastUpdated: new Date(),
  },
  {
    id: "binance",
    name: "Binance Smart Chain",
    token: "BNB",
    status: "Operational",
    gasPrice: 5,
    averageBlockTime: 3,
    transactionFee: 0.15,
    transactionTime: 0.5,
    congestionLevel: 20,
    recommendedFor: ["arbitrage", "transfer", "trading"],
    lastUpdated: new Date(),
  },
  {
    id: "polygon",
    name: "Polygon",
    token: "MATIC",
    status: "Operational",
    gasPrice: 30,
    averageBlockTime: 2,
    transactionFee: 0.01,
    transactionTime: 0.3,
    congestionLevel: 15,
    recommendedFor: ["arbitrage", "transfer"],
    lastUpdated: new Date(),
  },
  {
    id: "solana",
    name: "Solana",
    token: "SOL",
    status: "Slow",
    gasPrice: 0,
    averageBlockTime: 0.4,
    transactionFee: 0.00025,
    transactionTime: 0.1,
    congestionLevel: 60,
    recommendedFor: ["transfer", "trading"],
    lastUpdated: new Date(),
  },
  {
    id: "arbitrum",
    name: "Arbitrum",
    token: "ETH",
    status: "Operational",
    gasPrice: 0.1,
    averageBlockTime: 0.25,
    transactionFee: 0.12,
    transactionTime: 0.2,
    congestionLevel: 10,
    recommendedFor: ["arbitrage", "transfer", "trading"],
    lastUpdated: new Date(),
  },
  {
    id: "optimism",
    name: "Optimism",
    token: "ETH",
    status: "Operational",
    gasPrice: 0.1,
    averageBlockTime: 0.5,
    transactionFee: 0.15,
    transactionTime: 0.3,
    congestionLevel: 12,
    recommendedFor: ["arbitrage", "transfer"],
    lastUpdated: new Date(),
  },
  {
    id: "avalanche",
    name: "Avalanche",
    token: "AVAX",
    status: "Congested",
    gasPrice: 35,
    averageBlockTime: 3,
    transactionFee: 0.6,
    transactionTime: 1.2,
    congestionLevel: 75,
    recommendedFor: ["trading"],
    lastUpdated: new Date(),
  },
  {
    id: "tron",
    name: "Tron",
    token: "TRX",
    status: "Operational",
    gasPrice: 0,
    averageBlockTime: 3,
    transactionFee: 0.0008,
    transactionTime: 0.8,
    congestionLevel: 25,
    recommendedFor: ["transfer"],
    lastUpdated: new Date(),
  },
];

// Simple exchange-to-network mapping for arbitrage routing
const exchangeNetworkSupport = [
  { exchange: "Binance", networks: ["ethereum", "binance", "solana", "polygon", "avalanche", "tron"] },
  { exchange: "Coinbase", networks: ["ethereum", "solana", "polygon", "arbitrum", "optimism"] },
  { exchange: "Kraken", networks: ["ethereum", "solana", "polygon", "avalanche"] },
  { exchange: "FTX", networks: ["ethereum", "solana", "binance", "avalanche"] },
  { exchange: "Huobi", networks: ["ethereum", "binance", "solana", "avalanche", "tron"] },
];

export default function NetworkMonitor() {
  const [networks, setNetworks] = useState<BlockchainNetwork[]>(networkData);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState<keyof BlockchainNetwork>("congestionLevel");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [recommendedPairs, setRecommendedPairs] = useState<{ from: string; to: string; reason: string }[]>([]);

  // Function to refresh network data (in a real app, this would fetch from an API)
  const refreshNetworkData = () => {
    setLoading(true);
    // Simulate network request
    setTimeout(() => {
      // Randomly update congestion levels and status for demo purposes
      const updatedNetworks = networkData.map(network => {
        const congestionChange = Math.random() > 0.5 ? Math.random() * 10 : -Math.random() * 10;
        const newCongestion = Math.max(0, Math.min(100, network.congestionLevel + congestionChange));
        
        let status: NetworkStatus = "Operational";
        if (newCongestion > 80) status = "Congested";
        else if (newCongestion > 60) status = "Slow";
        else if (newCongestion > 40 && Math.random() > 0.7) status = "Issues";
        
        return {
          ...network,
          congestionLevel: newCongestion,
          status,
          lastUpdated: new Date()
        };
      });
      
      setNetworks(updatedNetworks);
      setLoading(false);
      
      // Update recommended arbitrage routing
      generateArbitrageRecommendations(updatedNetworks);
    }, 1000);
  };
  
  // Generate arbitrage routing recommendations
  const generateArbitrageRecommendations = (networkList: BlockchainNetwork[]) => {
    // Find the networks with lowest congestion that support arbitrage
    const arbitrageNetworks = networkList
      .filter(n => n.recommendedFor.includes("arbitrage") && n.congestionLevel < 50)
      .sort((a, b) => a.transactionFee - b.transactionFee)
      .slice(0, 3);
    
    if (arbitrageNetworks.length < 2) return;
    
    // Find exchanges that support these networks
    const recommendations = [];
    
    for (let i = 0; i < arbitrageNetworks.length; i++) {
      for (let j = i + 1; j < arbitrageNetworks.length; j++) {
        const network1 = arbitrageNetworks[i];
        const network2 = arbitrageNetworks[j];
        
        // Find exchanges that support both networks
        const supportingExchanges = exchangeNetworkSupport.filter(e => 
          e.networks.includes(network1.id) && e.networks.includes(network2.id)
        );
        
        if (supportingExchanges.length > 0) {
          recommendations.push({
            from: network1.name,
            to: network2.name,
            reason: `Low fees and congestion, supported on ${supportingExchanges.map(e => e.exchange).join(", ")}`
          });
        }
      }
    }
    
    setRecommendedPairs(recommendations);
  };

  // Initial data load
  useEffect(() => {
    refreshNetworkData();
    // In a real application, you'd set up an interval to refresh
    // const interval = setInterval(refreshNetworkData, 30000);
    // return () => clearInterval(interval);
  }, []);

  // Sorting function
  const sortedNetworks = [...networks].sort((a, b) => {
    if (sortDirection === "asc") {
      return a[sortBy] > b[sortBy] ? 1 : -1;
    } else {
      return a[sortBy] < b[sortBy] ? 1 : -1;
    }
  });

  // Handle sort click
  const handleSort = (column: keyof BlockchainNetwork) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortDirection("asc");
    }
  };

  // Render status badge
  const renderStatusBadge = (status: NetworkStatus) => {
    let color = "";
    let icon = null;
    
    switch (status) {
      case "Operational":
        color = "bg-success/20 text-success border-success/20";
        icon = <CheckCircle2 className="w-3 h-3 mr-1" />;
        break;
      case "Congested":
        color = "bg-danger/20 text-danger border-danger/20";
        icon = <AlertCircle className="w-3 h-3 mr-1" />;
        break;
      case "Slow":
        color = "bg-warning/20 text-warning border-warning/20";
        icon = <Clock className="w-3 h-3 mr-1" />;
        break;
      case "Issues":
        color = "bg-orange-500/20 text-orange-500 border-orange-500/20";
        icon = <Info className="w-3 h-3 mr-1" />;
        break;
    }
    
    return (
      <Badge variant="outline" className={`flex items-center ${color}`}>
        {icon}
        {status}
      </Badge>
    );
  };

  return (
    <>
      <Helmet>
        <title>Network Monitor | ArbitragePro</title>
        <meta
          name="description"
          content="Real-time blockchain network status and congestion monitoring for optimal arbitrage execution."
        />
      </Helmet>
      <div className="h-screen w-screen bg-background overflow-hidden">
        <div className="flex h-full">
          <Sidebar />
          <main className="flex-1 h-full overflow-auto p-6">
            <div className="max-w-7xl mx-auto space-y-8">
              {/* Header */}
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold flex items-center">
                    <Network className="mr-2 h-8 w-8 text-accent" />
                    Network Monitor
                  </h1>
                  <p className="text-muted-foreground mt-1">
                    Real-time blockchain network status and congestion monitoring for optimal arbitrage execution
                  </p>
                </div>
                <Button
                  onClick={refreshNetworkData}
                  disabled={loading}
                  className="bg-accent hover:bg-accent/80 text-background"
                >
                  <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                  Refresh
                </Button>
              </div>

              {/* Network Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-background-surface border-accent/20 card-glow">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <Zap className="mr-2 h-5 w-5 text-accent" />
                      Best for Speed
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {networks
                      .sort((a, b) => a.transactionTime - b.transactionTime)
                      .slice(0, 1)
                      .map((network) => (
                        <div key={network.id} className="flex flex-col">
                          <div className="flex items-center justify-between">
                            <span className="text-2xl font-bold">{network.name}</span>
                            {renderStatusBadge(network.status)}
                          </div>
                          <div className="mt-2 text-muted-foreground">
                            Transaction time: <span className="text-foreground font-medium">{network.transactionTime} min</span>
                          </div>
                          <div className="text-muted-foreground">
                            Fee: <span className="text-foreground font-medium">${network.transactionFee.toFixed(4)}</span>
                          </div>
                        </div>
                      ))}
                  </CardContent>
                </Card>

                <Card className="bg-background-surface border-accent/20 card-glow">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <PiggyBank className="mr-2 h-5 w-5 text-accent" />
                      Lowest Fees
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {networks
                      .sort((a, b) => a.transactionFee - b.transactionFee)
                      .slice(0, 1)
                      .map((network) => (
                        <div key={network.id} className="flex flex-col">
                          <div className="flex items-center justify-between">
                            <span className="text-2xl font-bold">{network.name}</span>
                            {renderStatusBadge(network.status)}
                          </div>
                          <div className="mt-2 text-muted-foreground">
                            Fee: <span className="text-foreground font-medium">${network.transactionFee.toFixed(4)}</span>
                          </div>
                          <div className="text-muted-foreground">
                            Gas price: <span className="text-foreground font-medium">{network.gasPrice} Gwei</span>
                          </div>
                        </div>
                      ))}
                  </CardContent>
                </Card>

                <Card className="bg-background-surface border-accent/20 card-glow">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <Wallet className="mr-2 h-5 w-5 text-accent" />
                      Best for Arbitrage
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {networks
                      .filter(n => n.recommendedFor.includes("arbitrage") && n.status === "Operational")
                      .sort((a, b) => (a.transactionFee * a.transactionTime) - (b.transactionFee * b.transactionTime))
                      .slice(0, 1)
                      .map((network) => (
                        <div key={network.id} className="flex flex-col">
                          <div className="flex items-center justify-between">
                            <span className="text-2xl font-bold">{network.name}</span>
                            {renderStatusBadge(network.status)}
                          </div>
                          <div className="mt-2 text-muted-foreground">
                            Congestion: <span className="text-foreground font-medium">{network.congestionLevel}%</span>
                          </div>
                          <div className="text-muted-foreground">
                            Fee: <span className="text-foreground font-medium">${network.transactionFee.toFixed(4)}</span>
                          </div>
                        </div>
                      ))}
                  </CardContent>
                </Card>

                <Card className="bg-background-surface border-accent/20 card-glow">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center">
                      <Globe className="mr-2 h-5 w-5 text-accent" />
                      Network Health
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span>Operational:</span>
                        <span className="font-medium">{networks.filter(n => n.status === "Operational").length}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Slow:</span>
                        <span className="font-medium">{networks.filter(n => n.status === "Slow").length}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Congested:</span>
                        <span className="font-medium">{networks.filter(n => n.status === "Congested").length}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Issues:</span>
                        <span className="font-medium">{networks.filter(n => n.status === "Issues").length}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recommended Routing */}
              {recommendedPairs.length > 0 && (
                <Card className="bg-background-surface/80 backdrop-blur border-accent/20 card-glow">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <Cpu className="mr-2 h-5 w-5 text-accent" />
                      Recommended Arbitrage Network Routing
                    </CardTitle>
                    <CardDescription>
                      Based on current network conditions and exchange compatibility
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {recommendedPairs.map((pair, index) => (
                        <Card key={index} className="bg-accent/5 border-accent/10">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                <Layers className="h-4 w-4 text-accent" />
                                <span className="font-medium">Route {index + 1}</span>
                              </div>
                              <Badge variant="outline" className="bg-success/10 text-success border-success/10">
                                Recommended
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between mt-3">
                              <span className="text-muted-foreground">{pair.from}</span>
                              <ArrowRightLeftIcon className="h-4 w-4 mx-2 text-accent" />
                              <span className="text-muted-foreground">{pair.to}</span>
                            </div>
                            <div className="mt-3 text-xs text-muted-foreground">
                              {pair.reason}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Network Status Table */}
              <Card className="bg-background-surface/80 backdrop-blur border-accent/20 card-glow">
                <CardHeader>
                  <CardTitle className="text-lg">Network Status</CardTitle>
                  <CardDescription>
                    Current status of major blockchain networks for arbitrage
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-36" onClick={() => handleSort("name")}>
                            Network {sortBy === "name" && (sortDirection === "asc" ? "↑" : "↓")}
                          </TableHead>
                          <TableHead onClick={() => handleSort("status")}>
                            Status {sortBy === "status" && (sortDirection === "asc" ? "↑" : "↓")}
                          </TableHead>
                          <TableHead className="text-right" onClick={() => handleSort("congestionLevel")}>
                            Congestion {sortBy === "congestionLevel" && (sortDirection === "asc" ? "↑" : "↓")}
                          </TableHead>
                          <TableHead className="text-right" onClick={() => handleSort("gasPrice")}>
                            Gas Price {sortBy === "gasPrice" && (sortDirection === "asc" ? "↑" : "↓")}
                          </TableHead>
                          <TableHead className="text-right" onClick={() => handleSort("transactionFee")}>
                            Tx Fee (USD) {sortBy === "transactionFee" && (sortDirection === "asc" ? "↑" : "↓")}
                          </TableHead>
                          <TableHead className="text-right" onClick={() => handleSort("transactionTime")}>
                            Avg Time {sortBy === "transactionTime" && (sortDirection === "asc" ? "↑" : "↓")}
                          </TableHead>
                          <TableHead>Recommended For</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sortedNetworks.map((network) => (
                          <TableRow key={network.id}>
                            <TableCell className="font-medium">{network.name}</TableCell>
                            <TableCell>{renderStatusBadge(network.status)}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end space-x-2">
                                <HoverCard>
                                  <HoverCardTrigger className="cursor-help">
                                    <Info className="h-4 w-4 text-muted-foreground" />
                                  </HoverCardTrigger>
                                  <HoverCardContent className="w-60 bg-background-surface text-xs">
                                    <p>Network congestion level affects transaction confirmation times and potentially fees.</p>
                                    <ul className="mt-2 space-y-1">
                                      <li>• 0-30%: Low congestion</li>
                                      <li>• 31-60%: Moderate congestion</li>
                                      <li>• 61-80%: High congestion</li>
                                      <li>• 81-100%: Severe congestion</li>
                                    </ul>
                                  </HoverCardContent>
                                </HoverCard>
                                <div className="w-24 flex items-center space-x-2">
                                  <Progress 
                                    value={network.congestionLevel} 
                                    className={
                                      network.congestionLevel < 30 ? "bg-success/20" : 
                                      network.congestionLevel < 60 ? "bg-warning/20" : 
                                      "bg-danger/20"
                                    }
                                  />
                                  <span>{network.congestionLevel}%</span>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              {network.gasPrice > 0 ? `${network.gasPrice} Gwei` : 'N/A'}
                            </TableCell>
                            <TableCell className="text-right">${network.transactionFee.toFixed(4)}</TableCell>
                            <TableCell className="text-right">{network.transactionTime} min</TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1 justify-start">
                                {network.recommendedFor.includes("arbitrage") && (
                                  <Badge className="bg-accent/10 text-accent border-accent/20 text-xs">
                                    Arbitrage
                                  </Badge>
                                )}
                                {network.recommendedFor.includes("transfer") && (
                                  <Badge className="bg-green-500/10 text-green-500 border-green-500/20 text-xs">
                                    Transfer
                                  </Badge>
                                )}
                                {network.recommendedFor.includes("trading") && (
                                  <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20 text-xs">
                                    Trading
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}

function ArrowRightLeftIcon(props: React.ComponentProps<typeof Zap>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 3 4 7l4 4" />
      <path d="M4 7h16" />
      <path d="m16 21 4-4-4-4" />
      <path d="M20 17H4" />
    </svg>
  );
}