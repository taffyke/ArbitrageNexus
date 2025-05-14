import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { FuturesArbitrageOpportunity } from "@/lib/types";

interface FuturesArbitrageProps {
  opportunities: FuturesArbitrageOpportunity[];
  onTrade: (id: string) => void;
}

export default function FuturesArbitrage({ opportunities, onTrade }: FuturesArbitrageProps) {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Futures Arbitrage <span className="text-accent text-base">{opportunities.length} opportunities</span></h2>
        <Button variant="link" className="text-muted-foreground hover:text-accent text-sm">View All</Button>
      </div>

      <Card className="bg-background-surface rounded-xl border border-accent/20 overflow-hidden card-glow p-6 mb-8">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-left text-muted-foreground text-sm font-medium">Asset</TableHead>
                <TableHead className="text-left text-muted-foreground text-sm font-medium">Spot Price</TableHead>
                <TableHead className="text-left text-muted-foreground text-sm font-medium">Futures Price</TableHead>
                <TableHead className="text-left text-muted-foreground text-sm font-medium">Premium</TableHead>
                <TableHead className="text-left text-muted-foreground text-sm font-medium">Exchange</TableHead>
                <TableHead className="text-left text-muted-foreground text-sm font-medium">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {opportunities.map((opportunity) => (
                <TableRow key={opportunity.id} className="border-t border-accent/10">
                  <TableCell className="py-4 pr-4 font-medium">{opportunity.pair}</TableCell>
                  <TableCell className="py-4 pr-4">{formatCurrency(opportunity.spotPrice)}</TableCell>
                  <TableCell className="py-4 pr-4">{formatCurrency(opportunity.futuresPrice)}</TableCell>
                  <TableCell className="py-4 pr-4 text-success">
                    +{opportunity.premium.toFixed(2)}%
                  </TableCell>
                  <TableCell className="py-4 pr-4 text-muted-foreground">{opportunity.exchange}</TableCell>
                  <TableCell className="py-4">
                    <Button 
                      variant="link" 
                      className="text-accent hover:text-accent-alt text-sm font-medium p-0 h-auto"
                      onClick={() => onTrade(opportunity.id)}
                    >
                      Trade
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
