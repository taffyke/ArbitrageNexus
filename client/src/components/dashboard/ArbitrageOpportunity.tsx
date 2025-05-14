import { ArbitrageOpportunity as ArbitrageOpportunityType } from "@/lib/types";
import { cn, formatCurrency, formatPercentage } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ArbitrageOpportunityProps {
  opportunity: ArbitrageOpportunityType;
  onClick?: () => void;
}

export default function ArbitrageOpportunity({ opportunity, onClick }: ArbitrageOpportunityProps) {
  // Format the time ago
  const timeAgo = new Date(opportunity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'direct': return 'Direct';
      case 'triangular': return 'Triangular';
      case 'futures': return 'Futures';
      case 'p2p': return 'P2P';
      default: return type;
    }
  };

  return (
    <div 
      className="p-4 rounded-lg bg-background-surface border border-accent/20 hover:border-accent transition-colors cursor-pointer"
      onClick={onClick}
    >
      <div className="flex justify-between">
        <span className="font-medium">{opportunity.pair}</span>
        <span className={cn(
          "font-semibold",
          opportunity.profitPercentage > 0 ? "text-success" : "text-danger"
        )}>
          {opportunity.profitPercentage > 0 ? "+" : ""}
          {formatPercentage(opportunity.profitPercentage)}
        </span>
      </div>
      <div className="text-sm text-muted-foreground mt-2 flex justify-between">
        <span>{opportunity.exchanges.join(" → ")}</span>
        <span>{getTypeLabel(opportunity.type)}</span>
      </div>
      <div className="mt-3 text-xs flex justify-between">
        <span className="text-muted-foreground">{timeAgo} ago</span>
        <Button variant="link" size="sm" className="text-accent hover:text-accent-alt h-auto p-0">
          Execute
        </Button>
      </div>
    </div>
  );
}
