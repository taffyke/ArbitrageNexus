import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { formatCurrency } from "@/lib/utils";
import { MarketDepth as MarketDepthType, OrderBookEntry } from "@/lib/types";

// Mock data for the UI display
const marketDepthData = [
  { price: 26100, bidVolume: 500, askVolume: 0 },
  { price: 26150, bidVolume: 420, askVolume: 0 },
  { price: 26200, bidVolume: 350, askVolume: 0 },
  { price: 26250, bidVolume: 280, askVolume: 0 },
  { price: 26300, bidVolume: 200, askVolume: 0 },
  { price: 26342, bidVolume: 0, askVolume: 0 }, // Current price
  { price: 26350, bidVolume: 0, askVolume: 150 },
  { price: 26400, bidVolume: 0, askVolume: 230 },
  { price: 26450, bidVolume: 0, askVolume: 310 },
  { price: 26500, bidVolume: 0, askVolume: 390 },
  { price: 26550, bidVolume: 0, askVolume: 470 }
];

const bids: OrderBookEntry[] = [
  { price: 26342.18, amount: 1.245 },
  { price: 26340.52, amount: 0.873 },
  { price: 26338.97, amount: 2.021 },
  { price: 26335.41, amount: 1.564 },
  { price: 26330.86, amount: 3.125 }
];

const asks: OrderBookEntry[] = [
  { price: 26345.72, amount: 0.952 },
  { price: 26348.31, amount: 1.764 },
  { price: 26352.85, amount: 0.685 },
  { price: 26356.49, amount: 2.314 },
  { price: 26362.07, amount: 1.127 }
];

const marketDepth: MarketDepthType = {
  bids,
  asks,
  bidVolume: 13.4,
  askVolume: 15.2
};

interface MarketDepthProps {
  pair: string;
}

export default function MarketDepth({ pair }: MarketDepthProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <Card className="bg-background-surface rounded-xl border border-accent/20 card-glow">
        <CardHeader>
          <CardTitle className="text-lg">Market Depth</CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={marketDepthData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--accent) / 0.1)" />
                <XAxis 
                  dataKey="price" 
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  axisLine={{ stroke: 'hsl(var(--accent) / 0.2)' }}
                  tickFormatter={(value) => `$${value}`}
                />
                <YAxis 
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  axisLine={{ stroke: 'hsl(var(--accent) / 0.2)' }}
                />
                <Tooltip
                  formatter={(value: number, name: string) => {
                    return [value, name === "bidVolume" ? "Bid Volume" : "Ask Volume"];
                  }}
                  labelFormatter={(value) => `Price: ${formatCurrency(value)}`}
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background-surface))', 
                    borderColor: 'hsl(var(--accent) / 0.2)',
                    color: 'hsl(var(--foreground))'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="bidVolume" 
                  stroke="hsl(var(--success))" 
                  fill="hsl(var(--success) / 0.5)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="askVolume" 
                  stroke="hsl(var(--danger))" 
                  fill="hsl(var(--danger) / 0.5)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          
          <div className="flex justify-between mt-4 text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-success/50 mr-2"></div>
              <span className="text-muted-foreground">Bids: ${marketDepth.bidVolume}M</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-danger/50 mr-2"></div>
              <span className="text-muted-foreground">Asks: ${marketDepth.askVolume}M</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-background-surface rounded-xl border border-accent/20 card-glow">
        <CardHeader>
          <CardTitle className="text-lg">Order Book</CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {/* Bids */}
            <div>
              <div className="flex justify-between text-xs text-muted-foreground mb-2">
                <span>Price (USDT)</span>
                <span>Amount (BTC)</span>
              </div>
              <div className="space-y-1">
                {marketDepth.bids.map((bid, index) => (
                  <div key={index} className="flex justify-between text-sm bg-success/5 p-1 rounded">
                    <span className="text-success">{bid.price.toFixed(2)}</span>
                    <span>{bid.amount}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Asks */}
            <div>
              <div className="flex justify-between text-xs text-muted-foreground mb-2">
                <span>Price (USDT)</span>
                <span>Amount (BTC)</span>
              </div>
              <div className="space-y-1">
                {marketDepth.asks.map((ask, index) => (
                  <div key={index} className="flex justify-between text-sm bg-danger/5 p-1 rounded">
                    <span className="text-danger">{ask.price.toFixed(2)}</span>
                    <span>{ask.amount}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
