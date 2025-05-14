import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    positive: boolean;
  };
  iconBgColor?: string;
  iconColor?: string;
  trendColor?: string;
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  iconBgColor = "bg-accent/10",
  iconColor = "text-accent",
  trendColor
}: StatCardProps) {
  const trendColorClass = trendColor || (trend?.positive ? "text-success" : "text-warning");
  
  return (
    <div className="bg-background-surface p-6 rounded-xl border border-accent/20 card-glow">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-muted-foreground text-sm">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
        </div>
        <div className={cn("p-2 rounded-lg", iconBgColor)}>
          <Icon className={cn("h-5 w-5", iconColor)} />
        </div>
      </div>
      {trend && (
        <div className={cn("mt-4 text-xs", trendColorClass)}>
          <span className="inline-flex items-center gap-1">
            {trend.positive ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            )}
            {trend.value}
          </span>
        </div>
      )}
    </div>
  );
}
