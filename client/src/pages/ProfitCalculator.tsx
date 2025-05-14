import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import { Helmet } from "react-helmet";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Calculator, Info, ArrowRightLeft, BarChart4, Wallet } from "lucide-react";
import { motion } from "framer-motion";

export default function ProfitCalculator() {
  const [arbitrageType, setArbitrageType] = useState("direct");
  const [calculationResult, setCalculationResult] = useState<null | {
    profit: number;
    profitPercentage: number;
    fee: number;
    netProfit: number;
    timeRequired: number;
    risk: "Low" | "Medium" | "High";
  }>(null);
  
  // Direct Arbitrage Calculator State
  const [directInputs, setDirectInputs] = useState({
    buyPrice: 26500,
    sellPrice: 26700,
    amount: 1,
    buyExchangeFee: 0.1,
    sellExchangeFee: 0.1,
    includeNetworkFees: true,
    networkFee: 15,
    gasPrice: "average",
  });
  
  // Triangular Arbitrage Calculator State
  const [triangularInputs, setTriangularInputs] = useState({
    startAmount: 1000,
    firstPairRate: 0.03,
    secondPairRate: 28000,
    thirdPairRate: 1.01,
    exchangeFee: 0.1,
    includeSlippage: true,
    slippage: 0.5,
  });
  
  // Futures Arbitrage Calculator State
  const [futuresInputs, setFuturesInputs] = useState({
    spotPrice: 26500,
    futuresPrice: 26900,
    amount: 1,
    daysToExpiration: 30,
    fundingRate: 0.01,
    spotExchangeFee: 0.1,
    futuresExchangeFee: 0.05,
  });
  
  // P2P Arbitrage Calculator State
  const [p2pInputs, setP2pInputs] = useState({
    buyPrice: 0.98,
    sellPrice: 1.02,
    amount: 1000,
    paymentFee: 1.5,
    withdrawalFee: 5,
    timeToComplete: 30,
  });
  
  const calculateDirectArbitrage = () => {
    const { buyPrice, sellPrice, amount, buyExchangeFee, sellExchangeFee, includeNetworkFees, networkFee } = directInputs;
    
    const rawProfit = (sellPrice - buyPrice) * amount;
    const buyFee = (buyPrice * amount * buyExchangeFee) / 100;
    const sellFee = (sellPrice * amount * sellExchangeFee) / 100;
    const totalFee = buyFee + sellFee + (includeNetworkFees ? networkFee : 0);
    const netProfit = rawProfit - totalFee;
    const profitPercentage = (netProfit / (buyPrice * amount)) * 100;
    
    setCalculationResult({
      profit: rawProfit,
      profitPercentage: profitPercentage,
      fee: totalFee,
      netProfit: netProfit,
      timeRequired: 5, // Estimated time in minutes
      risk: profitPercentage > 2 ? "Low" : profitPercentage > 0.5 ? "Medium" : "High"
    });
  };
  
  const calculateTriangularArbitrage = () => {
    const { startAmount, firstPairRate, secondPairRate, thirdPairRate, exchangeFee, includeSlippage, slippage } = triangularInputs;
    
    // Convert to second currency
    const secondAmount = startAmount * firstPairRate;
    // Convert to third currency
    const thirdAmount = secondAmount * secondPairRate;
    // Convert back to first currency
    const finalAmount = thirdAmount / thirdPairRate;
    
    const rawProfit = finalAmount - startAmount;
    
    // Calculate fees for each trade
    const firstTradeFee = (startAmount * firstPairRate * exchangeFee) / 100;
    const secondTradeFee = (secondAmount * secondPairRate * exchangeFee) / 100;
    const thirdTradeFee = (thirdAmount * exchangeFee) / 100;
    
    // Calculate slippage if included
    const slippageAmount = includeSlippage ? (rawProfit * slippage) / 100 : 0;
    
    // Calculate total fees
    const totalFee = firstTradeFee + secondTradeFee + thirdTradeFee + slippageAmount;
    
    // Calculate net profit
    const netProfit = rawProfit - totalFee;
    
    // Calculate profit percentage
    const profitPercentage = (netProfit / startAmount) * 100;
    
    setCalculationResult({
      profit: rawProfit,
      profitPercentage: profitPercentage,
      fee: totalFee,
      netProfit: netProfit,
      timeRequired: 1, // Triangular is typically fast
      risk: profitPercentage > 1.5 ? "Low" : profitPercentage > 0.3 ? "Medium" : "High"
    });
  };
  
  const calculateFuturesArbitrage = () => {
    const { spotPrice, futuresPrice, amount, daysToExpiration, fundingRate, spotExchangeFee, futuresExchangeFee } = futuresInputs;
    
    // Calculate raw profit from price difference
    const rawProfit = (futuresPrice - spotPrice) * amount;
    
    // Calculate fees
    const spotFee = (spotPrice * amount * spotExchangeFee) / 100;
    const futuresFee = (futuresPrice * amount * futuresExchangeFee) / 100;
    
    // Calculate funding costs (for perpetual futures)
    const fundingCost = (spotPrice * amount * fundingRate * daysToExpiration) / 100;
    
    // Calculate total fees and costs
    const totalFee = spotFee + futuresFee + fundingCost;
    
    // Calculate net profit
    const netProfit = rawProfit - totalFee;
    
    // Calculate profit percentage
    const profitPercentage = (netProfit / (spotPrice * amount)) * 100;
    
    // Calculate annualized return
    const annualizedReturn = (profitPercentage * 365) / daysToExpiration;
    
    setCalculationResult({
      profit: rawProfit,
      profitPercentage: profitPercentage,
      fee: totalFee,
      netProfit: netProfit,
      timeRequired: daysToExpiration * 1440, // Convert days to minutes
      risk: annualizedReturn > 15 ? "Low" : annualizedReturn > 5 ? "Medium" : "High"
    });
  };
  
  const calculateP2PArbitrage = () => {
    const { buyPrice, sellPrice, amount, paymentFee, withdrawalFee, timeToComplete } = p2pInputs;
    
    // Calculate raw profit
    const buyTotal = amount * buyPrice;
    const sellTotal = amount * sellPrice;
    const rawProfit = sellTotal - buyTotal;
    
    // Calculate fees
    const paymentProcessingFee = (buyTotal * paymentFee) / 100;
    const totalFee = paymentProcessingFee + withdrawalFee;
    
    // Calculate net profit
    const netProfit = rawProfit - totalFee;
    
    // Calculate profit percentage
    const profitPercentage = (netProfit / buyTotal) * 100;
    
    setCalculationResult({
      profit: rawProfit,
      profitPercentage: profitPercentage,
      fee: totalFee,
      netProfit: netProfit,
      timeRequired: timeToComplete, // In minutes
      risk: profitPercentage > 3 ? "Low" : profitPercentage > 1 ? "Medium" : "High"
    });
  };
  
  const handleCalculate = () => {
    switch (arbitrageType) {
      case "direct":
        calculateDirectArbitrage();
        break;
      case "triangular":
        calculateTriangularArbitrage();
        break;
      case "futures":
        calculateFuturesArbitrage();
        break;
      case "p2p":
        calculateP2PArbitrage();
        break;
    }
  };
  
  const renderResultCard = () => {
    if (!calculationResult) return null;
    
    const { profit, profitPercentage, fee, netProfit, timeRequired, risk } = calculationResult;
    
    const riskColor = risk === "Low" ? "text-success" : risk === "Medium" ? "text-warning" : "text-danger";
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="mb-6 border-accent/20 shadow-lg bg-background-surface/80 backdrop-blur card-glow">
          <CardHeader>
            <CardTitle className="text-lg text-center">Calculation Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center p-4 bg-background/40 rounded-lg">
                <span className="text-muted-foreground text-sm">Gross Profit</span>
                <span className="text-xl font-bold text-accent">${profit.toFixed(2)}</span>
              </div>
              <div className="flex flex-col items-center p-4 bg-background/40 rounded-lg">
                <span className="text-muted-foreground text-sm">Net Profit</span>
                <span className="text-xl font-bold text-accent">${netProfit.toFixed(2)}</span>
              </div>
              <div className="flex flex-col items-center p-4 bg-background/40 rounded-lg">
                <span className="text-muted-foreground text-sm">Profit Percentage</span>
                <span className="text-xl font-bold text-accent">{profitPercentage.toFixed(2)}%</span>
              </div>
              <div className="flex flex-col items-center p-4 bg-background/40 rounded-lg">
                <span className="text-muted-foreground text-sm">Total Fees</span>
                <span className="text-xl font-bold text-danger">${fee.toFixed(2)}</span>
              </div>
              <div className="flex flex-col items-center p-4 bg-background/40 rounded-lg">
                <span className="text-muted-foreground text-sm">Time Required</span>
                <span className="text-xl font-bold">
                  {timeRequired >= 1440 
                    ? `${(timeRequired / 1440).toFixed(1)} days` 
                    : timeRequired >= 60 
                      ? `${(timeRequired / 60).toFixed(1)} hours` 
                      : `${timeRequired} min`}
                </span>
              </div>
              <div className="flex flex-col items-center p-4 bg-background/40 rounded-lg">
                <span className="text-muted-foreground text-sm">Risk Level</span>
                <span className={`text-xl font-bold ${riskColor}`}>{risk}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };
  
  return (
    <>
      <Helmet>
        <title>Profit Calculator | ArbitragePro</title>
        <meta name="description" content="Calculate potential profits for different types of cryptocurrency arbitrage strategies." />
      </Helmet>
      <div className="h-screen w-screen bg-background overflow-hidden">
        <div className="flex h-full">
          <Sidebar />
          <main className="flex-1 h-full overflow-auto p-6">
            <div className="max-w-5xl mx-auto">
              <div className="mb-8">
                <h1 className="text-3xl font-bold flex items-center">
                  <Calculator className="mr-2 h-8 w-8 text-accent" />
                  Profit Calculator
                </h1>
                <p className="text-muted-foreground mt-1">
                  Calculate potential profits for different types of cryptocurrency arbitrage strategies
                </p>
              </div>

              <Tabs value={arbitrageType} onValueChange={setArbitrageType} className="mb-6">
                <TabsList className="w-full grid grid-cols-4 bg-background-surface/80">
                  <TabsTrigger value="direct" className="flex items-center gap-2">
                    <ArrowRightLeft className="h-4 w-4" />
                    <span>Direct</span>
                  </TabsTrigger>
                  <TabsTrigger value="triangular" className="flex items-center gap-2">
                    <BarChart4 className="h-4 w-4" />
                    <span>Triangular</span>
                  </TabsTrigger>
                  <TabsTrigger value="futures" className="flex items-center gap-2">
                    <Info className="h-4 w-4" />
                    <span>Futures</span>
                  </TabsTrigger>
                  <TabsTrigger value="p2p" className="flex items-center gap-2">
                    <Wallet className="h-4 w-4" />
                    <span>P2P</span>
                  </TabsTrigger>
                </TabsList>

                {/* Direct Arbitrage Calculator */}
                <TabsContent value="direct">
                  <Card className="border-accent/20 shadow-md bg-background-surface/80 backdrop-blur mb-6">
                    <CardHeader>
                      <CardTitle>Direct Arbitrage Calculator</CardTitle>
                      <CardDescription>
                        Calculate potential profits from price differences of the same asset across different exchanges.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="buyPrice">Buy Price (USD)</Label>
                          <Input
                            id="buyPrice"
                            type="number"
                            value={directInputs.buyPrice}
                            onChange={(e) => setDirectInputs({...directInputs, buyPrice: parseFloat(e.target.value)})}
                            className="bg-background/50 border-accent/20"
                          />
                        </div>
                        <div>
                          <Label htmlFor="sellPrice">Sell Price (USD)</Label>
                          <Input
                            id="sellPrice"
                            type="number"
                            value={directInputs.sellPrice}
                            onChange={(e) => setDirectInputs({...directInputs, sellPrice: parseFloat(e.target.value)})}
                            className="bg-background/50 border-accent/20"
                          />
                        </div>
                        <div>
                          <Label htmlFor="amount">Amount (BTC)</Label>
                          <Input
                            id="amount"
                            type="number"
                            value={directInputs.amount}
                            onChange={(e) => setDirectInputs({...directInputs, amount: parseFloat(e.target.value)})}
                            className="bg-background/50 border-accent/20"
                          />
                        </div>
                        <div>
                          <Label htmlFor="gasPrice">Gas Price</Label>
                          <Select 
                            value={directInputs.gasPrice} 
                            onValueChange={(value) => setDirectInputs({...directInputs, gasPrice: value})}
                          >
                            <SelectTrigger id="gasPrice" className="bg-background/50 border-accent/20">
                              <SelectValue placeholder="Select gas price" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="low">Low</SelectItem>
                              <SelectItem value="average">Average</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="buyFee">Buy Exchange Fee (%)</Label>
                          <div className="flex items-center gap-2">
                            <Slider
                              id="buyFee"
                              min={0}
                              max={2}
                              step={0.01}
                              value={[directInputs.buyExchangeFee]}
                              onValueChange={(value) => setDirectInputs({...directInputs, buyExchangeFee: value[0]})}
                              className="flex-grow"
                            />
                            <span className="min-w-10 text-center">{directInputs.buyExchangeFee.toFixed(2)}%</span>
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="sellFee">Sell Exchange Fee (%)</Label>
                          <div className="flex items-center gap-2">
                            <Slider
                              id="sellFee"
                              min={0}
                              max={2}
                              step={0.01}
                              value={[directInputs.sellExchangeFee]}
                              onValueChange={(value) => setDirectInputs({...directInputs, sellExchangeFee: value[0]})}
                              className="flex-grow"
                            />
                            <span className="min-w-10 text-center">{directInputs.sellExchangeFee.toFixed(2)}%</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="includeNetworkFees"
                            checked={directInputs.includeNetworkFees}
                            onCheckedChange={(checked) => setDirectInputs({...directInputs, includeNetworkFees: checked})}
                          />
                          <Label htmlFor="includeNetworkFees">Include Network Fees</Label>
                        </div>
                        {directInputs.includeNetworkFees && (
                          <div>
                            <Label htmlFor="networkFee">Network Fee (USD)</Label>
                            <Input
                              id="networkFee"
                              type="number"
                              value={directInputs.networkFee}
                              onChange={(e) => setDirectInputs({...directInputs, networkFee: parseFloat(e.target.value)})}
                              className="bg-background/50 border-accent/20"
                            />
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Triangular Arbitrage Calculator */}
                <TabsContent value="triangular">
                  <Card className="border-accent/20 shadow-md bg-background-surface/80 backdrop-blur mb-6">
                    <CardHeader>
                      <CardTitle>Triangular Arbitrage Calculator</CardTitle>
                      <CardDescription>
                        Calculate potential profits from executing a series of trades within the same exchange.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="startAmount">Start Amount (USDT)</Label>
                          <Input
                            id="startAmount"
                            type="number"
                            value={triangularInputs.startAmount}
                            onChange={(e) => setTriangularInputs({...triangularInputs, startAmount: parseFloat(e.target.value)})}
                            className="bg-background/50 border-accent/20"
                          />
                        </div>
                        <div>
                          <Label htmlFor="firstPairRate">First Pair Rate (USDT → BTC)</Label>
                          <Input
                            id="firstPairRate"
                            type="number"
                            value={triangularInputs.firstPairRate}
                            onChange={(e) => setTriangularInputs({...triangularInputs, firstPairRate: parseFloat(e.target.value)})}
                            className="bg-background/50 border-accent/20"
                          />
                        </div>
                        <div>
                          <Label htmlFor="secondPairRate">Second Pair Rate (BTC → ETH)</Label>
                          <Input
                            id="secondPairRate"
                            type="number"
                            value={triangularInputs.secondPairRate}
                            onChange={(e) => setTriangularInputs({...triangularInputs, secondPairRate: parseFloat(e.target.value)})}
                            className="bg-background/50 border-accent/20"
                          />
                        </div>
                        <div>
                          <Label htmlFor="thirdPairRate">Third Pair Rate (ETH → USDT)</Label>
                          <Input
                            id="thirdPairRate"
                            type="number"
                            value={triangularInputs.thirdPairRate}
                            onChange={(e) => setTriangularInputs({...triangularInputs, thirdPairRate: parseFloat(e.target.value)})}
                            className="bg-background/50 border-accent/20"
                          />
                        </div>
                        <div>
                          <Label htmlFor="exchangeFee">Exchange Fee (%)</Label>
                          <div className="flex items-center gap-2">
                            <Slider
                              id="exchangeFee"
                              min={0}
                              max={2}
                              step={0.01}
                              value={[triangularInputs.exchangeFee]}
                              onValueChange={(value) => setTriangularInputs({...triangularInputs, exchangeFee: value[0]})}
                              className="flex-grow"
                            />
                            <span className="min-w-10 text-center">{triangularInputs.exchangeFee.toFixed(2)}%</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="includeSlippage"
                            checked={triangularInputs.includeSlippage}
                            onCheckedChange={(checked) => setTriangularInputs({...triangularInputs, includeSlippage: checked})}
                          />
                          <Label htmlFor="includeSlippage">Include Slippage</Label>
                        </div>
                        {triangularInputs.includeSlippage && (
                          <div>
                            <Label htmlFor="slippage">Slippage (%)</Label>
                            <div className="flex items-center gap-2">
                              <Slider
                                id="slippage"
                                min={0}
                                max={5}
                                step={0.1}
                                value={[triangularInputs.slippage]}
                                onValueChange={(value) => setTriangularInputs({...triangularInputs, slippage: value[0]})}
                                className="flex-grow"
                              />
                              <span className="min-w-10 text-center">{triangularInputs.slippage.toFixed(1)}%</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Futures Arbitrage Calculator */}
                <TabsContent value="futures">
                  <Card className="border-accent/20 shadow-md bg-background-surface/80 backdrop-blur mb-6">
                    <CardHeader>
                      <CardTitle>Futures Arbitrage Calculator</CardTitle>
                      <CardDescription>
                        Calculate potential profits from the difference between spot and futures prices.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="spotPrice">Spot Price (USD)</Label>
                          <Input
                            id="spotPrice"
                            type="number"
                            value={futuresInputs.spotPrice}
                            onChange={(e) => setFuturesInputs({...futuresInputs, spotPrice: parseFloat(e.target.value)})}
                            className="bg-background/50 border-accent/20"
                          />
                        </div>
                        <div>
                          <Label htmlFor="futuresPrice">Futures Price (USD)</Label>
                          <Input
                            id="futuresPrice"
                            type="number"
                            value={futuresInputs.futuresPrice}
                            onChange={(e) => setFuturesInputs({...futuresInputs, futuresPrice: parseFloat(e.target.value)})}
                            className="bg-background/50 border-accent/20"
                          />
                        </div>
                        <div>
                          <Label htmlFor="amount">Amount (BTC)</Label>
                          <Input
                            id="amount"
                            type="number"
                            value={futuresInputs.amount}
                            onChange={(e) => setFuturesInputs({...futuresInputs, amount: parseFloat(e.target.value)})}
                            className="bg-background/50 border-accent/20"
                          />
                        </div>
                        <div>
                          <Label htmlFor="daysToExpiration">Days to Expiration</Label>
                          <Input
                            id="daysToExpiration"
                            type="number"
                            value={futuresInputs.daysToExpiration}
                            onChange={(e) => setFuturesInputs({...futuresInputs, daysToExpiration: parseInt(e.target.value)})}
                            className="bg-background/50 border-accent/20"
                          />
                        </div>
                        <div>
                          <Label htmlFor="fundingRate">Funding Rate (%) per day</Label>
                          <div className="flex items-center gap-2">
                            <Slider
                              id="fundingRate"
                              min={0}
                              max={0.1}
                              step={0.001}
                              value={[futuresInputs.fundingRate]}
                              onValueChange={(value) => setFuturesInputs({...futuresInputs, fundingRate: value[0]})}
                              className="flex-grow"
                            />
                            <span className="min-w-10 text-center">{futuresInputs.fundingRate.toFixed(3)}%</span>
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="spotFee">Spot Exchange Fee (%)</Label>
                          <div className="flex items-center gap-2">
                            <Slider
                              id="spotFee"
                              min={0}
                              max={2}
                              step={0.01}
                              value={[futuresInputs.spotExchangeFee]}
                              onValueChange={(value) => setFuturesInputs({...futuresInputs, spotExchangeFee: value[0]})}
                              className="flex-grow"
                            />
                            <span className="min-w-10 text-center">{futuresInputs.spotExchangeFee.toFixed(2)}%</span>
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="futuresFee">Futures Exchange Fee (%)</Label>
                          <div className="flex items-center gap-2">
                            <Slider
                              id="futuresFee"
                              min={0}
                              max={2}
                              step={0.01}
                              value={[futuresInputs.futuresExchangeFee]}
                              onValueChange={(value) => setFuturesInputs({...futuresInputs, futuresExchangeFee: value[0]})}
                              className="flex-grow"
                            />
                            <span className="min-w-10 text-center">{futuresInputs.futuresExchangeFee.toFixed(2)}%</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* P2P Arbitrage Calculator */}
                <TabsContent value="p2p">
                  <Card className="border-accent/20 shadow-md bg-background-surface/80 backdrop-blur mb-6">
                    <CardHeader>
                      <CardTitle>P2P Arbitrage Calculator</CardTitle>
                      <CardDescription>
                        Calculate potential profits from P2P exchange rate differences.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="buyPrice">Buy Rate (per USDT)</Label>
                          <Input
                            id="buyPrice"
                            type="number"
                            value={p2pInputs.buyPrice}
                            onChange={(e) => setP2pInputs({...p2pInputs, buyPrice: parseFloat(e.target.value)})}
                            className="bg-background/50 border-accent/20"
                          />
                        </div>
                        <div>
                          <Label htmlFor="sellPrice">Sell Rate (per USDT)</Label>
                          <Input
                            id="sellPrice"
                            type="number"
                            value={p2pInputs.sellPrice}
                            onChange={(e) => setP2pInputs({...p2pInputs, sellPrice: parseFloat(e.target.value)})}
                            className="bg-background/50 border-accent/20"
                          />
                        </div>
                        <div>
                          <Label htmlFor="amount">Amount (USDT)</Label>
                          <Input
                            id="amount"
                            type="number"
                            value={p2pInputs.amount}
                            onChange={(e) => setP2pInputs({...p2pInputs, amount: parseFloat(e.target.value)})}
                            className="bg-background/50 border-accent/20"
                          />
                        </div>
                        <div>
                          <Label htmlFor="paymentFee">Payment Processing Fee (%)</Label>
                          <div className="flex items-center gap-2">
                            <Slider
                              id="paymentFee"
                              min={0}
                              max={5}
                              step={0.1}
                              value={[p2pInputs.paymentFee]}
                              onValueChange={(value) => setP2pInputs({...p2pInputs, paymentFee: value[0]})}
                              className="flex-grow"
                            />
                            <span className="min-w-10 text-center">{p2pInputs.paymentFee.toFixed(1)}%</span>
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="withdrawalFee">Withdrawal Fee (USD)</Label>
                          <Input
                            id="withdrawalFee"
                            type="number"
                            value={p2pInputs.withdrawalFee}
                            onChange={(e) => setP2pInputs({...p2pInputs, withdrawalFee: parseFloat(e.target.value)})}
                            className="bg-background/50 border-accent/20"
                          />
                        </div>
                        <div>
                          <Label htmlFor="timeToComplete">Est. Time to Complete (min)</Label>
                          <Input
                            id="timeToComplete"
                            type="number"
                            value={p2pInputs.timeToComplete}
                            onChange={(e) => setP2pInputs({...p2pInputs, timeToComplete: parseInt(e.target.value)})}
                            className="bg-background/50 border-accent/20"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              <div className="flex justify-center mb-8">
                <Button onClick={handleCalculate} className="bg-accent hover:bg-accent/80 text-background font-medium text-lg px-10 py-6">
                  Calculate Profit
                </Button>
              </div>

              {renderResultCard()}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}