import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { P2PArbitrageOpportunity } from "@/lib/types";

interface P2PArbitrageProps {
  opportunities: P2PArbitrageOpportunity[];
  onViewDetails: (id: string) => void;
}

export default function P2PArbitrage({ opportunities, onViewDetails }: P2PArbitrageProps) {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">P2P Arbitrage <span className="text-accent text-base">{opportunities.length} opportunities</span></h2>
        <Button variant="link" className="text-muted-foreground hover:text-accent text-sm">View All</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {opportunities.map((opportunity) => (
          <Card key={opportunity.id} className="bg-background-surface rounded-xl border border-accent/20 overflow-hidden card-glow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold">{opportunity.pair}</h3>
                  <p className="text-muted-foreground text-sm mt-1">{opportunity.buyExchange} → {opportunity.sellExchange}</p>
                </div>
                <div className="bg-success/10 text-success px-3 py-1 rounded-full text-sm font-medium">
                  +{opportunity.profitPercentage.toFixed(2)}%
                </div>
              </div>
              
              <div className="flex justify-between mt-6 text-sm text-muted-foreground">
                <div>
                  <div>Buy Rate (P2P)</div>
                  <div className="text-foreground font-medium mt-1">{formatCurrency(opportunity.buyRate)}</div>
                </div>
                <div>
                  <div>Sell Rate</div>
                  <div className="text-foreground font-medium mt-1">{formatCurrency(opportunity.sellRate)}</div>
                </div>
                <div>
                  <div>Profit</div>
                  <div className="text-success font-medium mt-1">+{opportunity.profitPercentage.toFixed(2)}%</div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-accent/10 flex justify-between">
                <div className="text-sm">
                  <span className="text-muted-foreground">Updated</span>
                  <span className="text-foreground ml-1">
                    {Math.floor((Date.now() - opportunity.timestamp.getTime()) / 60000)}m ago
                  </span>
                </div>
                <Button 
                  variant="link" 
                  className="text-accent hover:text-accent-alt text-sm font-medium p-0 h-auto"
                  onClick={() => onViewDetails(opportunity.id)}
                >
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
