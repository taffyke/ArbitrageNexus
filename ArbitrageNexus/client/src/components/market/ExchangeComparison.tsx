import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Download } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { ExchangeData } from "@/lib/types";

// Mock data for the UI display
const exchangeData: ExchangeData[] = [
  { 
    id: "1", 
    name: "Binance", 
    price: 26342.18, 
    volume: 3.2, 
    priceDifference: 0, 
    spread: 0.15, 
    liquidityScore: 9.5 
  },
  { 
    id: "2", 
    name: "Coinbase", 
    price: 26387.65, 
    volume: 1.8, 
    priceDifference: 0.17, 
    spread: 0.25, 
    liquidityScore: 8.5 
  },
  { 
    id: "3", 
    name: "Kraken", 
    price: 26395.42, 
    volume: 0.9, 
    priceDifference: 0.20, 
    spread: 0.20, 
    liquidityScore: 8.0 
  },
  { 
    id: "4", 
    name: "FTX", 
    price: 26315.76, 
    volume: 1.1, 
    priceDifference: -0.10, 
    spread: 0.18, 
    liquidityScore: 8.3 
  },
  { 
    id: "5", 
    name: "Huobi", 
    price: 26298.32, 
    volume: 0.7, 
    priceDifference: -0.17, 
    spread: 0.22, 
    liquidityScore: 7.5 
  }
];

interface ExchangeComparisonProps {
  pair: string;
}

export default function ExchangeComparison({ pair }: ExchangeComparisonProps) {
  return (
    <Card className="bg-background-surface rounded-xl border border-accent/20 card-glow mb-8">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg">Exchange Price Comparison</CardTitle>
        <Button size="sm" className="bg-accent text-background">
          <Download className="h-4 w-4 mr-1" /> Export
        </Button>
      </CardHeader>
      
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-left text-muted-foreground text-sm font-medium">Exchange</TableHead>
                <TableHead className="text-right text-muted-foreground text-sm font-medium">Price (USDT)</TableHead>
                <TableHead className="text-right text-muted-foreground text-sm font-medium">24h Volume</TableHead>
                <TableHead className="text-right text-muted-foreground text-sm font-medium">Price Difference</TableHead>
                <TableHead className="text-right text-muted-foreground text-sm font-medium">Spread</TableHead>
                <TableHead className="text-right text-muted-foreground text-sm font-medium">Liquidity Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {exchangeData.map((exchange) => (
                <TableRow key={exchange.id} className="border-t border-accent/10">
                  <TableCell className="py-4 pr-8 font-medium">{exchange.name}</TableCell>
                  <TableCell className="py-4 pr-8 text-right">{formatCurrency(exchange.price)}</TableCell>
                  <TableCell className="py-4 pr-8 text-right">${exchange.volume}B</TableCell>
                  <TableCell className={`py-4 pr-8 text-right ${exchange.priceDifference >= 0 ? 'text-success' : 'text-danger'}`}>
                    {exchange.priceDifference >= 0 ? '+' : ''}{exchange.priceDifference.toFixed(2)}%
                  </TableCell>
                  <TableCell className="py-4 pr-8 text-right">{exchange.spread.toFixed(2)}%</TableCell>
                  <TableCell className="py-4 text-right">
                    <div className="flex items-center justify-end">
                      <div className="w-24 bg-background h-2 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${exchange.liquidityScore >= 8.5 ? 'bg-success' : 'bg-warning'}`} 
                          style={{ width: `${(exchange.liquidityScore / 10) * 100}%` }}
                        ></div>
                      </div>
                      <span className="ml-2">{exchange.liquidityScore.toFixed(1)}</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
