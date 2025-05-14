import { useState } from "react";
import { UserProfile } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AppSettings } from "@/lib/types";
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

interface AccountSettingsProps {
  profile: UserProfile;
  appSettings: AppSettings;
  onUpdateProfile: (updatedProfile: Partial<UserProfile>) => void;
  onUpdateSettings: (updatedSettings: Partial<AppSettings>) => void;
}

export default function AccountSettings({ 
  profile, 
  appSettings, 
  onUpdateProfile, 
  onUpdateSettings 
}: AccountSettingsProps) {
  const [formData, setFormData] = useState({
    firstName: profile.firstName,
    lastName: profile.lastName,
    email: profile.email,
    phone: profile.phone || "",
    country: profile.country || "United States",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onUpdateProfile(formData);
  };

  const handleSettingChange = (key: keyof AppSettings, value: boolean) => {
    onUpdateSettings({ [key]: value });
  };

  return (
    <>
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-1">Personal Information</h3>
        <p className="text-muted-foreground text-sm">Update your personal details and contact information</p>
      </div>
      
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="firstName" className="text-muted-foreground mb-2 text-sm">First Name</Label>
            <Input
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className="w-full bg-background-surface border-accent/20 focus:border-accent"
            />
          </div>
          <div>
            <Label htmlFor="lastName" className="text-muted-foreground mb-2 text-sm">Last Name</Label>
            <Input
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className="w-full bg-background-surface border-accent/20 focus:border-accent"
            />
          </div>
          <div>
            <Label htmlFor="email" className="text-muted-foreground mb-2 text-sm">Email Address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full bg-background-surface border-accent/20 focus:border-accent"
            />
          </div>
          <div>
            <Label htmlFor="phone" className="text-muted-foreground mb-2 text-sm">Phone Number</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full bg-background-surface border-accent/20 focus:border-accent"
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="country" className="text-muted-foreground mb-2 text-sm">Country</Label>
          <Select value={formData.country} onValueChange={(value) => setFormData(prev => ({ ...prev, country: value }))}>
            <SelectTrigger id="country" className="w-full bg-background-surface border-accent/20 focus:border-accent">
              <SelectValue placeholder="Select a country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="United States">United States</SelectItem>
              <SelectItem value="Canada">Canada</SelectItem>
              <SelectItem value="United Kingdom">United Kingdom</SelectItem>
              <SelectItem value="Australia">Australia</SelectItem>
              <SelectItem value="Germany">Germany</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="pt-4 border-t border-accent/10">
          <Button className="bg-accent hover:bg-accent/80 text-background" onClick={handleSubmit}>
            Save Changes
          </Button>
        </div>
      </div>

      <div className="mt-12 mb-6">
        <h3 className="text-xl font-semibold mb-1">Application Settings</h3>
        <p className="text-muted-foreground text-sm">Configure your app preferences and display options</p>
      </div>
      
      <Card className="bg-background-surface rounded-xl border border-accent/20 overflow-hidden card-glow mb-8">
        <CardContent className="p-6 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-medium">Dark Mode</h4>
              <p className="text-muted-foreground text-sm mt-1">Toggle between dark and light theme</p>
            </div>
            <Switch 
              checked={appSettings.darkMode} 
              onCheckedChange={(checked) => handleSettingChange('darkMode', checked)} 
              className="bg-accent data-[state=unchecked]:bg-gray-600"
            />
          </div>
          
          <div className="flex justify-between items-center pt-5 border-t border-accent/10">
            <div>
              <h4 className="font-medium">Real-time Updates</h4>
              <p className="text-muted-foreground text-sm mt-1">Enable live data updates from exchanges</p>
            </div>
            <Switch 
              checked={appSettings.realTimeUpdates} 
              onCheckedChange={(checked) => handleSettingChange('realTimeUpdates', checked)} 
              className="bg-accent data-[state=unchecked]:bg-gray-600"
            />
          </div>
          
          <div className="flex justify-between items-center pt-5 border-t border-accent/10">
            <div>
              <h4 className="font-medium">Auto-Execute Trades</h4>
              <p className="text-muted-foreground text-sm mt-1">Automatically execute trades meeting your criteria</p>
            </div>
            <Switch 
              checked={appSettings.autoExecuteTrades} 
              onCheckedChange={(checked) => handleSettingChange('autoExecuteTrades', checked)} 
              className="bg-accent data-[state=unchecked]:bg-gray-600"
            />
          </div>
          
          <div className="flex justify-between items-center pt-5 border-t border-accent/10">
            <div>
              <h4 className="font-medium">Price Alerts</h4>
              <p className="text-muted-foreground text-sm mt-1">Receive notifications for price movements</p>
            </div>
            <Switch 
              checked={appSettings.priceAlerts} 
              onCheckedChange={(checked) => handleSettingChange('priceAlerts', checked)} 
              className="bg-accent data-[state=unchecked]:bg-gray-600"
            />
          </div>
        </CardContent>
      </Card>
    </>
  );
}
