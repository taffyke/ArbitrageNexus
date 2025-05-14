import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from "recharts";
import { formatCurrency } from "@/lib/utils";
import { 
  MapPinXInside, 
  Ruler, 
  ArrowLeftRight, 
  Save 
} from "lucide-react";

// Mock data for the UI display
const candlestickData = [
  { time: "00:00", open: 26200, high: 26400, low: 26100, close: 26300 },
  { time: "02:00", open: 26300, high: 26500, low: 26200, close: 26250 },
  { time: "04:00", open: 26250, high: 26300, low: 26100, close: 26200 },
  { time: "06:00", open: 26200, high: 26400, low: 26150, close: 26350 },
  { time: "08:00", open: 26350, high: 26500, low: 26300, close: 26450 },
  { time: "10:00", open: 26450, high: 26600, low: 26400, close: 26550 },
  { time: "12:00", open: 26550, high: 26600, low: 26400, close: 26500 },
  { time: "14:00", open: 26500, high: 26700, low: 26450, close: 26650 },
  { time: "16:00", open: 26650, high: 26800, low: 26600, close: 26700 },
  { time: "18:00", open: 26700, high: 26900, low: 26650, close: 26850 },
  { time: "20:00", open: 26850, high: 27000, low: 26800, close: 26950 },
  { time: "22:00", open: 26950, high: 27100, low: 26900, close: 27000 }
];

type TimeRange = "1D" | "1W" | "1M" | "3M" | "1Y";

interface PriceChartProps {
  pair: string;
}

export default function PriceChart({ pair }: PriceChartProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>("1D");
  
  return (
    <Card className="bg-background-surface rounded-xl border border-accent/20 card-glow mb-8">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg">{pair} Price Chart</CardTitle>
        <div className="flex space-x-2">
          {(["1D", "1W", "1M", "3M", "1Y"] as TimeRange[]).map((range) => (
            <Button
              key={range}
              size="sm"
              variant={timeRange === range ? "default" : "outline"}
              className={timeRange === range ? "bg-accent text-background" : "bg-background/40 text-muted-foreground hover:bg-background/60"}
              onClick={() => setTimeRange(range)}
            >
              {range}
            </Button>
          ))}
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={candlestickData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--accent) / 0.1)" />
              <XAxis 
                dataKey="time" 
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                axisLine={{ stroke: 'hsl(var(--accent) / 0.2)' }}
              />
              <YAxis 
                domain={['dataMin - 100', 'dataMax + 100']}
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                axisLine={{ stroke: 'hsl(var(--accent) / 0.2)' }}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip
                labelFormatter={(value) => `Time: ${value}`}
                formatter={(value: number, name: string) => {
                  return [formatCurrency(value), name.charAt(0).toUpperCase() + name.slice(1)];
                }}
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--background-surface))', 
                  borderColor: 'hsl(var(--accent) / 0.2)',
                  color: 'hsl(var(--foreground))'
                }}
              />
              <Bar 
                dataKey="high" 
                fill="hsl(var(--success))" 
                opacity={0.3} 
                stackId="stack"
              />
              <Bar 
                dataKey="low" 
                fill="hsl(var(--danger))" 
                opacity={0.3} 
                stackId="stack"
              />
              <Bar 
                dataKey={(data) => data.close > data.open ? data.close - data.open : 0} 
                fill="hsl(var(--success))" 
                name="bullish"
                stackId="stack"
              />
              <Bar 
                dataKey={(data) => data.open > data.close ? data.open - data.close : 0} 
                fill="hsl(var(--danger))" 
                name="bearish"
                stackId="stack"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Chart Controls */}
        <div className="flex flex-wrap gap-3 mt-4">
          <Button variant="outline" size="sm" className="bg-background/40 text-muted-foreground hover:bg-background/60">
            <MapPinXInside className="h-4 w-4 mr-1" /> Technical Indicators
          </Button>
          <Button variant="outline" size="sm" className="bg-background/40 text-muted-foreground hover:bg-background/60">
            <Ruler className="h-4 w-4 mr-1" /> Drawing Tools
          </Button>
          <Button variant="outline" size="sm" className="bg-background/40 text-muted-foreground hover:bg-background/60">
            <ArrowLeftRight className="h-4 w-4 mr-1" /> Compare Exchanges
          </Button>
          <Button variant="outline" size="sm" className="bg-background/40 text-muted-foreground hover:bg-background/60">
            <Save className="h-4 w-4 mr-1" /> Save Layout
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
