import { ReactNode, useEffect, useState } from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: string;
  storageKey?: string;
  [x: string]: any;
}

export function ThemeProvider({ 
  children,
  ...props
}: ThemeProviderProps) {
  // This helps prevent hydration mismatch
  const [mounted, setMounted] = useState(false)

  // Set mounted true after first render
  useEffect(() => {
    setMounted(true)
  }, [])

  // Apply saved color scheme
  useEffect(() => {
    if (mounted) {
      const savedColorScheme = localStorage.getItem("color-scheme");
      if (savedColorScheme) {
        document.documentElement.setAttribute("data-color-scheme", savedColorScheme);
        
        // Update CSS variables for the theme
        const updateThemeVariables = (colorScheme: string) => {
          const root = document.documentElement;
          
          // Define color variables for each theme
          const themeColors: Record<string, Record<string, string>> = {
            blue: {
              accent: "180 100% 50%",
              "accent-alt": "255 100% 75%"
            },
            purple: {
              accent: "262.1 83.3% 57.8%",
              "accent-alt": "291.1 63.3% 42.8%"
            },
            pink: {
              accent: "322.7 85.5% 70.1%",
              "accent-alt": "342.1 67.5% 50.1%"
            },
            orange: {
              accent: "20.5 90.2% 48.2%",
              "accent-alt": "35.5 91.7% 32.9%"
            },
            green: {
              accent: "142.1 76.2% 36.3%",
              "accent-alt": "160.1 84.1% 39.4%"
            },
            teal: {
              accent: "173.9 80.4% 40.0%",
              "accent-alt": "183.2 75.4% 34.5%"
            }
          };
          
          // Apply the selected theme colors
          const selectedColors = themeColors[colorScheme];
          if (selectedColors) {
            Object.entries(selectedColors).forEach(([property, value]) => {
              root.style.setProperty(`--${property}`, value);
            });
            
            // Also update sidebar and chart colors to match theme
            root.style.setProperty('--sidebar-primary', selectedColors.accent);
            root.style.setProperty('--sidebar-accent', selectedColors["accent-alt"]);
            root.style.setProperty('--chart-1', selectedColors.accent);
            root.style.setProperty('--chart-2', selectedColors["accent-alt"]);
          }
        }
        
        updateThemeVariables(savedColorScheme);
      }
    }
  }, [mounted]);

  if (!mounted) {
    return null;
  }

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      {...props}
    >
      {children}
    </NextThemesProvider>
  )
}