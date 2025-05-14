import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Paintbrush, Moon, Sun, Zap } from "lucide-react";
import { AppSettings } from "@/lib/types";
import { useThemeMode, colorSchemes, themeModes } from "@/hooks/use-theme";

interface ThemeSettingsProps {
  appSettings: AppSettings;
  onUpdateSettings: (updatedSettings: Partial<AppSettings>) => void;
}

export default function ThemeSettings({ appSettings, onUpdateSettings }: ThemeSettingsProps) {
  const [selectedColorScheme, setSelectedColorScheme] = useState<string>("blue");
  const [selectedThemeMode, setSelectedThemeMode] = useState<string>("system");
  const { setTheme, theme, setColorScheme, colorScheme } = useThemeMode();

  useEffect(() => {
    setSelectedColorScheme(colorScheme || "blue");
    setSelectedThemeMode(theme);
  }, [colorScheme, theme]);

  const handleColorSchemeChange = (value: string) => {
    setSelectedColorScheme(value);
    setColorScheme(value as "blue" | "purple" | "pink" | "orange" | "green" | "teal");
  };

  const handleThemeModeChange = (value: string) => {
    setSelectedThemeMode(value);
    setTheme(value as "light" | "dark" | "system");
    
    // Also update the app settings if dark mode related
    if (value === "dark") {
      onUpdateSettings({ darkMode: true });
    } else if (value === "light") {
      onUpdateSettings({ darkMode: false });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Appearance</CardTitle>
          <CardDescription>
            Customize how the application looks and feels
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <Tabs defaultValue="theme" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="theme">Theme Mode</TabsTrigger>
              <TabsTrigger value="color">Color Scheme</TabsTrigger>
            </TabsList>
            
            {/* Theme Mode Settings */}
            <TabsContent value="theme" className="space-y-4 pt-4">
              <div className="space-y-2">
                <h3 className="text-lg font-medium flex items-center">
                  <Sun className="h-5 w-5 mr-2 text-warning" />
                  <Moon className="h-5 w-5 mr-2 text-accent" />
                  Theme Mode
                </h3>
                <p className="text-sm text-muted-foreground">
                  Choose between light, dark, or system theme
                </p>
              </div>
              
              <RadioGroup 
                value={selectedThemeMode}
                onValueChange={handleThemeModeChange}
                className="grid gap-4 grid-cols-1 md:grid-cols-3 mt-4"
              >
                {themeModes.map(option => (
                  <Label
                    key={option.value}
                    className={`flex flex-col items-center justify-between rounded-md border-2 p-4 cursor-pointer hover:border-accent/50 ${
                      selectedThemeMode === option.value ? 'border-accent' : 'border-border'
                    }`}
                  >
                    <RadioGroupItem 
                      value={option.value} 
                      id={`theme-${option.value}`}
                      className="sr-only"
                    />
                    <div className={`w-full h-24 rounded-md mb-2 ${
                      option.value === 'light' 
                        ? 'bg-[#f8f9fa] border border-gray-200' 
                        : option.value === 'dark'
                        ? 'bg-[#1a1b1e] border border-gray-800'
                        : 'bg-gradient-to-r from-[#f8f9fa] to-[#1a1b1e]'
                    }`}></div>
                    <div className="text-center">
                      <span className="block font-medium mb-1">{option.label}</span>
                      <span className="block text-xs text-muted-foreground">
                        {option.value === 'system' 
                          ? 'Follows your system preference' 
                          : `Always use ${option.value} mode`}
                      </span>
                    </div>
                  </Label>
                ))}
              </RadioGroup>
            </TabsContent>
            
            {/* Color Scheme Settings */}
            <TabsContent value="color" className="space-y-4 pt-4">
              <div className="space-y-2">
                <h3 className="text-lg font-medium flex items-center">
                  <Paintbrush className="h-5 w-5 mr-2 text-accent" />
                  Color Scheme
                </h3>
                <p className="text-sm text-muted-foreground">
                  Choose your preferred accent color for the interface
                </p>
              </div>
              
              <RadioGroup 
                value={selectedColorScheme}
                onValueChange={handleColorSchemeChange}
                className="grid gap-4 grid-cols-2 md:grid-cols-3 mt-4"
              >
                {colorSchemes.map(scheme => (
                  <Label
                    key={scheme.value}
                    className={`flex flex-col items-center justify-between rounded-md border-2 p-4 cursor-pointer hover:border-accent/50 ${
                      selectedColorScheme === scheme.value ? 'border-accent' : 'border-border'
                    }`}
                  >
                    <RadioGroupItem 
                      value={scheme.value} 
                      id={`color-${scheme.value}`}
                      className="sr-only"
                    />
                    <div className={`w-full h-16 rounded-md mb-3 ${scheme.value}-theme-sample`}></div>
                    <span className="font-medium">{scheme.label}</span>
                  </Label>
                ))}
              </RadioGroup>
            </TabsContent>
          </Tabs>
          
          <div className="space-y-6 border-t pt-6">
            <h3 className="text-lg font-medium">UI Preferences</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="real-time-updates">Real-time updates</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive live data updates in real-time
                  </p>
                </div>
                <Switch
                  id="real-time-updates"
                  checked={appSettings.realTimeUpdates}
                  onCheckedChange={(checked) => onUpdateSettings({ realTimeUpdates: checked })}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-execute" className="flex items-center">
                    <Zap className="h-4 w-4 mr-1 text-warning" />
                    Auto-execute trades
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Allow bots to execute trades automatically
                  </p>
                </div>
                <Switch
                  id="auto-execute"
                  checked={appSettings.autoExecuteTrades}
                  onCheckedChange={(checked) => onUpdateSettings({ autoExecuteTrades: checked })}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="price-alerts">Price alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications for price movements
                  </p>
                </div>
                <Switch
                  id="price-alerts"
                  checked={appSettings.priceAlerts}
                  onCheckedChange={(checked) => onUpdateSettings({ priceAlerts: checked })}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="animations">UI animations</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable animations for a more dynamic experience
                  </p>
                </div>
                <Switch
                  id="animations"
                  checked={appSettings.enableAnimations}
                  onCheckedChange={(checked) => onUpdateSettings({ enableAnimations: checked })}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}