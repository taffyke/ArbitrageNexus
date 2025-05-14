import { useState, useEffect } from "react";
import Sidebar from "@/components/layout/Sidebar";
import { Helmet } from "react-helmet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileOverview from "@/components/profile/ProfileOverview";
import AccountSettings from "@/components/profile/AccountSettings";
import ApiKeys from "@/components/profile/ApiKeys";
import ApiKeyDialog from "@/components/profile/ApiKeyDialog";
import ThemeSettings from "@/components/profile/ThemeSettings";
import { 
  UserProfile,
  AppSettings,
  ExchangeInfo
} from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { supabase } from "@/lib/supabase";

// Initial profile data for UI display
const initialProfile: UserProfile = {
  id: "user1",
  firstName: "John",
  lastName: "Smith",
  email: "john.smith@example.com",
  phone: "+1 (555) 123-4567",
  country: "United States",
  memberSince: new Date(2023, 3, 15), // April 15, 2023
  subscription: "Pro Plan",
  apiUsage: {
    used: 762,
    limit: 1000,
  }
};

// Initial app settings
const initialSettings: AppSettings = {
  darkMode: true,
  realTimeUpdates: true,
  autoExecuteTrades: false,
  priceAlerts: true,
  enableAnimations: true,
};

// Initial exchange connections
const initialExchanges: ExchangeInfo[] = [
  {
    id: "exchange1",
    name: "Binance",
    dateAdded: new Date(2023, 3, 20), // April 20, 2023
  },
  {
    id: "exchange2",
    name: "Coinbase",
    dateAdded: new Date(2023, 3, 22), // April 22, 2023
  },
  {
    id: "exchange3",
    name: "Kraken",
    dateAdded: new Date(2023, 3, 25), // April 25, 2023
  },
];

// Define the shape of API key data from Supabase
interface ApiKeyData {
  id: string;
  exchange_name: string;
  created_at: string;
}

export default function Profile() {
  const [activeTab, setActiveTab] = useState("account");
  const [profile, setProfile] = useState<UserProfile>(initialProfile);
  const [appSettings, setAppSettings] = useState<AppSettings>(initialSettings);
  const [exchanges, setExchanges] = useState<ExchangeInfo[]>(initialExchanges);
  const [isApiKeyDialogOpen, setIsApiKeyDialogOpen] = useState(false);
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  // Check for tab parameter in URL on initial load
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const tabParam = queryParams.get('tab');
    if (tabParam && ['account', 'api', 'appearance', 'notifications', 'billing'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, []);

  // Load API keys from Supabase
  useEffect(() => {
    async function fetchApiKeys() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          const { data, error } = await supabase
            .from('exchange_api_keys')
            .select('id, exchange_name, created_at')
            .eq('user_id', user.id);
          
          if (error) {
            console.error("Error fetching API keys:", error);
          } else if (data) {
            // Map Supabase data to our ExchangeInfo type
            const fetchedExchanges: ExchangeInfo[] = data.map((item: ApiKeyData) => ({
              id: item.id,
              name: item.exchange_name,
              dateAdded: new Date(item.created_at)
            }));
            
            // Only update if we have actual data to avoid losing the initial data for demo purposes
            if (fetchedExchanges.length > 0) {
              setExchanges(fetchedExchanges);
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch API keys:", error);
      }
    }
    
    fetchApiKeys();
  }, []);

  // Update URL when tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setLocation(`/profile?tab=${value}`, { replace: true });
  };

  const handleUpdateProfile = (updatedProfile: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updatedProfile }));
    toast({
      title: "Profile updated",
      description: "Your profile information has been updated successfully."
    });
  };

  const handleUpdateSettings = (updatedSettings: Partial<AppSettings>) => {
    setAppSettings(prev => ({ ...prev, ...updatedSettings }));
    toast({
      title: "Settings updated",
      description: "Your application settings have been updated successfully."
    });
  };

  const handleAddExchange = () => {
    setIsApiKeyDialogOpen(true);
  };

  const handleApiKeySuccess = async () => {
    // Refresh the API keys list
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data, error } = await supabase
          .from('exchange_api_keys')
          .select('id, exchange_name, created_at')
          .eq('user_id', user.id);
        
        if (error) {
          console.error("Error fetching API keys:", error);
        } else if (data) {
          // Map Supabase data to our ExchangeInfo type
          const fetchedExchanges: ExchangeInfo[] = data.map((item: ApiKeyData) => ({
            id: item.id,
            name: item.exchange_name,
            dateAdded: new Date(item.created_at)
          }));
          
          setExchanges(fetchedExchanges);
        }
      }
    } catch (error) {
      console.error("Failed to refresh API keys:", error);
    }
  };

  const handleEditExchange = async (id: string) => {
    // In a real app, this would open a dialog to edit the API key
    toast({
      title: "Edit Exchange",
      description: `Editing exchange with ID: ${id}`
    });
  };

  const handleRemoveExchange = async (id: string) => {
    try {
      const { error } = await supabase
        .from('exchange_api_keys')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      setExchanges(prev => prev.filter(exchange => exchange.id !== id));
      
      toast({
        title: "Exchange removed",
        description: "The exchange connection has been removed successfully."
      });
    } catch (error: any) {
      toast({
        title: "Error removing exchange",
        description: error.message || "Failed to remove exchange. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>Profile & Settings | ArbitragePro</title>
        <meta name="description" content="Manage your account, API connections, and application preferences." />
      </Helmet>
      <div className="h-screen w-screen bg-background overflow-hidden">
        <div className="flex h-full">
          <Sidebar />
          <main className="flex-1 h-full overflow-auto">
            <div className="p-6 h-full overflow-auto">
              <div className="max-w-4xl mx-auto">
                {/* Profile Header */}
                <div className="mb-8">
                  <h1 className="text-3xl font-bold">Profile & Settings</h1>
                  <p className="text-muted-foreground mt-1">Manage your account and application preferences</p>
                </div>

                {/* Profile Overview */}
                <ProfileOverview 
                  profile={profile} 
                  onEditProfile={() => handleTabChange("account")} 
                />

                {/* Tabs for Profile Sections */}
                <Tabs value={activeTab} onValueChange={handleTabChange} className="mb-8">
                  <TabsList className="border-b border-accent/10 bg-transparent w-full justify-start rounded-none mb-0 pb-0">
                    <TabsTrigger 
                      value="account"
                      className="py-3 data-[state=active]:border-b-2 data-[state=active]:border-accent data-[state=active]:text-accent data-[state=active]:shadow-none data-[state=inactive]:border-b-2 data-[state=inactive]:border-transparent data-[state=inactive]:text-muted-foreground bg-transparent"
                    >
                      Account Settings
                    </TabsTrigger>
                    <TabsTrigger 
                      value="api"
                      className="py-3 data-[state=active]:border-b-2 data-[state=active]:border-accent data-[state=active]:text-accent data-[state=active]:shadow-none data-[state=inactive]:border-b-2 data-[state=inactive]:border-transparent data-[state=inactive]:text-muted-foreground bg-transparent"
                    >
                      API Keys
                    </TabsTrigger>
                    <TabsTrigger 
                      value="appearance"
                      className="py-3 data-[state=active]:border-b-2 data-[state=active]:border-accent data-[state=active]:text-accent data-[state=active]:shadow-none data-[state=inactive]:border-b-2 data-[state=inactive]:border-transparent data-[state=inactive]:text-muted-foreground bg-transparent"
                    >
                      Appearance
                    </TabsTrigger>
                    <TabsTrigger 
                      value="notifications"
                      className="py-3 data-[state=active]:border-b-2 data-[state=active]:border-accent data-[state=active]:text-accent data-[state=active]:shadow-none data-[state=inactive]:border-b-2 data-[state=inactive]:border-transparent data-[state=inactive]:text-muted-foreground bg-transparent"
                    >
                      Notifications
                    </TabsTrigger>
                    <TabsTrigger 
                      value="billing"
                      className="py-3 data-[state=active]:border-b-2 data-[state=active]:border-accent data-[state=active]:text-accent data-[state=active]:shadow-none data-[state=inactive]:border-b-2 data-[state=inactive]:border-transparent data-[state=inactive]:text-muted-foreground bg-transparent"
                    >
                      Billing
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="account">
                    <AccountSettings
                      profile={profile}
                      appSettings={appSettings}
                      onUpdateProfile={handleUpdateProfile}
                      onUpdateSettings={handleUpdateSettings}
                    />
                  </TabsContent>

                  <TabsContent value="api">
                    <ApiKeys
                      exchanges={exchanges}
                      onAddExchange={handleAddExchange}
                      onEditExchange={handleEditExchange}
                      onRemoveExchange={handleRemoveExchange}
                    />
                  </TabsContent>

                  <TabsContent value="appearance">
                    <ThemeSettings
                      appSettings={appSettings}
                      onUpdateSettings={handleUpdateSettings}
                    />
                  </TabsContent>

                  <TabsContent value="notifications">
                    <div className="py-8 text-center text-muted-foreground">
                      <p>Notification settings will be implemented in a future update.</p>
                    </div>
                  </TabsContent>

                  <TabsContent value="billing">
                    <div className="py-8 text-center text-muted-foreground">
                      <p>Billing and subscription management will be implemented in a future update.</p>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </main>
        </div>
      </div>
      
      {/* API Key Dialog */}
      <ApiKeyDialog 
        isOpen={isApiKeyDialogOpen} 
        onClose={() => setIsApiKeyDialogOpen(false)}
        onSuccess={handleApiKeySuccess}
      />
    </>
  );
}
