import { useState } from "react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Area,
  AreaChart
} from "recharts";
import { ChartDataPoint } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

// This is just mock data for the UI display
const dailyProfitData: ChartDataPoint[] = [
  { timestamp: "00:00", value: 120 },
  { timestamp: "02:00", value: 150 },
  { timestamp: "04:00", value: 145 },
  { timestamp: "06:00", value: 160 },
  { timestamp: "08:00", value: 175 },
  { timestamp: "10:00", value: 190 },
  { timestamp: "12:00", value: 185 },
  { timestamp: "14:00", value: 200 },
  { timestamp: "16:00", value: 210 },
  { timestamp: "18:00", value: 230 },
  { timestamp: "20:00", value: 245 },
  { timestamp: "22:00", value: 260 },
];

type TimeRange = "day" | "week" | "month";

export default function ProfitChart() {
  const [timeRange, setTimeRange] = useState<TimeRange>("day");
  
  return (
    <div className="bg-background-surface p-6 rounded-xl border border-accent/20 card-glow">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-semibold text-lg">Profit Performance</h3>
        <div className="flex space-x-2">
          <Button 
            size="sm"
            variant={timeRange === "day" ? "default" : "outline"}
            className={timeRange === "day" ? "bg-accent text-background" : "bg-background/40 text-muted-foreground hover:bg-background/60"}
            onClick={() => setTimeRange("day")}
          >
            Day
          </Button>
          <Button 
            size="sm"
            variant={timeRange === "week" ? "default" : "outline"}
            className={timeRange === "week" ? "bg-accent text-background" : "bg-background/40 text-muted-foreground hover:bg-background/60"}
            onClick={() => setTimeRange("week")}
          >
            Week
          </Button>
          <Button 
            size="sm"
            variant={timeRange === "month" ? "default" : "outline"}
            className={timeRange === "month" ? "bg-accent text-background" : "bg-background/40 text-muted-foreground hover:bg-background/60"}
            onClick={() => setTimeRange("month")}
          >
            Month
          </Button>
        </div>
      </div>
      
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={dailyProfitData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--accent) / 0.1)" />
            <XAxis 
              dataKey="timestamp" 
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
              axisLine={{ stroke: 'hsl(var(--accent) / 0.2)' }}
            />
            <YAxis 
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
              axisLine={{ stroke: 'hsl(var(--accent) / 0.2)' }}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip
              contentStyle={{ 
                backgroundColor: 'hsl(var(--background-surface))', 
                borderColor: 'hsl(var(--accent) / 0.2)',
                color: 'hsl(var(--foreground))'
              }}
              formatter={(value: number) => [formatCurrency(value), 'Profit']}
              labelFormatter={(label) => `Time: ${label}`}
            />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="hsl(var(--accent))" 
              fillOpacity={1}
              fill="url(#colorProfit)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
