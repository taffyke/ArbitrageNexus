import { useState } from "react";
import { supabase, encryptData } from "@/lib/supabase";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage,
  FormDescription
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const exchangeOptions = [
  { value: "binance", label: "Binance" },
  { value: "coinbase", label: "Coinbase" },
  { value: "kraken", label: "Kraken" },
  { value: "kucoin", label: "KuCoin" },
  { value: "ftx", label: "FTX" },
  { value: "bybit", label: "Bybit" },
  { value: "okx", label: "OKX" },
  { value: "huobi", label: "Huobi" },
  { value: "bitfinex", label: "Bitfinex" },
  { value: "bitstamp", label: "Bitstamp" }
];

// Create a schema for the form validation
const formSchema = z.object({
  exchange: z.string({ required_error: "Please select an exchange" }),
  apiKey: z.string().min(10, { message: "API key must be at least 10 characters" }),
  apiSecret: z.string().min(10, { message: "API secret must be at least 10 characters" }),
  description: z.string().optional()
});

type FormValues = z.infer<typeof formSchema>;

interface ApiKeyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ApiKeyDialog({ isOpen, onClose, onSuccess }: ApiKeyDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      exchange: "",
      apiKey: "",
      apiSecret: "",
      description: ""
    }
  });
  
  const onSubmit = async (values: FormValues) => {
    try {
      setIsSubmitting(true);
      
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("You must be logged in to add API keys");
      }
      
      // Encrypt sensitive data before sending to the server
      // In a real application, this would use proper encryption
      const encryptedApiKey = await encryptData(values.apiKey);
      const encryptedApiSecret = await encryptData(values.apiSecret);
      
      // Find the exchange label
      const exchangeInfo = exchangeOptions.find(option => option.value === values.exchange);
      
      // Insert the API key into Supabase
      const { error } = await supabase
        .from('exchange_api_keys')
        .insert({
          user_id: user.id,
          exchange_name: exchangeInfo?.label || values.exchange,
          api_key: encryptedApiKey,
          api_secret: encryptedApiSecret,
          description: values.description || null,
          permissions: ['read', 'trade'], // Default permissions
          is_active: true
        });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "API key added",
        description: `Successfully added API key for ${exchangeInfo?.label || values.exchange}`
      });
      
      // Reset the form and close the dialog
      form.reset();
      onSuccess();
      onClose();
      
    } catch (error: any) {
      toast({
        title: "Error adding API key",
        description: error.message || "Failed to add API key. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-accent">Add Exchange API Key</DialogTitle>
          <DialogDescription>
            Connect to exchange APIs to enable real-time market data and trading.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="exchange"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Exchange</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an exchange" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {exchangeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="apiKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>API Key</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter your API key" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Make sure to provide API keys with proper permissions.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="apiSecret"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>API Secret</FormLabel>
                  <FormControl>
                    <Input 
                      type="password"
                      placeholder="Enter your API secret" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="E.g., Trading account, Read-only API" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter className="pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                className="bg-accent hover:bg-accent/80 text-background"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin text-background" />
                    Adding...
                  </>
                ) : (
                  "Add API Key"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 