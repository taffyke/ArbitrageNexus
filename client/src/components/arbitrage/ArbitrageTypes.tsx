import { Button } from "@/components/ui/button";

interface ArbitrageTypesProps {
  selectedType: string;
  onTypeChange: (type: string) => void;
}

export default function ArbitrageTypes({ selectedType, onTypeChange }: ArbitrageTypesProps) {
  const types = [
    { id: "all", label: "All Types" },
    { id: "direct", label: "Direct Arbitrage" },
    { id: "triangular", label: "Triangular Arbitrage" },
    { id: "futures", label: "Futures Arbitrage" },
    { id: "p2p", label: "P2P Arbitrage" }
  ];

  return (
    <div className="mb-8">
      <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
        {types.map((type) => (
          <Button
            key={type.id}
            variant={selectedType === type.id ? "default" : "outline"}
            className={
              selectedType === type.id
                ? "px-4 py-2 bg-accent text-background rounded-md whitespace-nowrap"
                : "px-4 py-2 bg-background-surface hover:bg-background-surface/80 border border-accent/20 text-foreground rounded-md whitespace-nowrap"
            }
            onClick={() => onTypeChange(type.id)}
          >
            {type.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
