import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardHeader 
} from "@/components/ui/card";
import { ArrowLeftRight } from "lucide-react";
import { ExchangeInfo } from "@/lib/types";
import { getFormattedDate } from "@/lib/utils";

interface ApiKeysProps {
  exchanges: ExchangeInfo[];
  onAddExchange: () => void;
  onEditExchange: (id: string) => void;
  onRemoveExchange: (id: string) => void;
}

export default function ApiKeys({ 
  exchanges, 
  onAddExchange, 
  onEditExchange, 
  onRemoveExchange 
}: ApiKeysProps) {
  return (
    <>
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-1">Exchange API Keys</h3>
        <p className="text-muted-foreground text-sm">Manage your exchange API connections</p>
      </div>

      <Card className="bg-background-surface rounded-xl border border-accent/20 overflow-hidden card-glow mb-8">
        <CardHeader className="p-6 pb-0">
          <div className="flex justify-between items-center">
            <h4 className="font-medium">Connected Exchanges</h4>
            <Button className="bg-accent hover:bg-accent/80 text-background text-sm" onClick={onAddExchange}>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add New
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <div className="space-y-4">
            {exchanges.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                No exchanges connected. Add an exchange to get started.
              </div>
            ) : (
              exchanges.map((exchange) => (
                <div key={exchange.id} className="p-4 rounded-lg border border-accent/20 flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center text-accent">
                      <ArrowLeftRight className="h-5 w-5" />
                    </div>
                    <div className="ml-4">
                      <div className="font-medium">{exchange.name}</div>
                      <div className="text-muted-foreground text-sm">
                        Added on {getFormattedDate(exchange.dateAdded)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Button 
                      variant="link" 
                      className="text-accent hover:text-accent-alt text-sm p-0 h-auto"
                      onClick={() => onEditExchange(exchange.id)}
                    >
                      Edit
                    </Button>
                    <Button 
                      variant="link" 
                      className="text-danger hover:text-danger/80 text-sm p-0 h-auto"
                      onClick={() => onRemoveExchange(exchange.id)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
