import { useEffect, useState } from "react";
import { useTheme as useNextTheme } from "next-themes";

// Types for theme system
type Theme = "light" | "dark" | "system";
type ColorScheme = "blue" | "purple" | "pink" | "orange" | "green" | "teal";

// Basic theme hook from next-themes
export const useTheme = () => {
  return useNextTheme();
};

// Get the user's color scheme preference
export const useColorScheme = () => {
  const [colorScheme, setColorScheme] = useState<ColorScheme | null>(null);

  useEffect(() => {
    // Get from localStorage
    const savedColorScheme = localStorage.getItem("color-scheme") as ColorScheme | null;
    if (savedColorScheme) {
      setColorScheme(savedColorScheme);
      document.documentElement.setAttribute("data-color-scheme", savedColorScheme);
    } else {
      // Default to blue
      setColorScheme("blue");
      document.documentElement.setAttribute("data-color-scheme", "blue");
    }
  }, []);

  const updateColorScheme = (newColorScheme: ColorScheme) => {
    setColorScheme(newColorScheme);
    localStorage.setItem("color-scheme", newColorScheme);
    document.documentElement.setAttribute("data-color-scheme", newColorScheme);
    
    // Apply theme specific CSS variables
    updateThemeVariables(newColorScheme);
  };

  return { colorScheme, setColorScheme: updateColorScheme };
};

// Combine theme and color scheme hooks
export const useThemeMode = () => {
  const { theme, setTheme } = useTheme();
  const { colorScheme, setColorScheme } = useColorScheme();

  // Type-safe versions
  const setTypedTheme = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  const setTypedColorScheme = (newColorScheme: ColorScheme) => {
    setColorScheme(newColorScheme);
  };

  return {
    theme: theme as Theme,
    setTheme: setTypedTheme,
    colorScheme,
    setColorScheme: setTypedColorScheme,
  };
};

// Available color schemes
export const colorSchemes: { value: ColorScheme; label: string; }[] = [
  { value: "blue", label: "Blue" },
  { value: "purple", label: "Purple" },
  { value: "pink", label: "Pink" },
  { value: "orange", label: "Orange" },
  { value: "green", label: "Green" },
  { value: "teal", label: "Teal" }
];

// Available theme modes
export const themeModes: { value: Theme; label: string; }[] = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System" }
];

// Update CSS variables based on selected color scheme
function updateThemeVariables(colorScheme: ColorScheme) {
  const root = document.documentElement;
  
  // Define color variables for each theme
  const themeColors = {
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
  Object.entries(selectedColors).forEach(([property, value]) => {
    root.style.setProperty(`--${property}`, value);
  });
  
  // Also update sidebar accent colors
  root.style.setProperty('--sidebar-primary', selectedColors.accent);
  root.style.setProperty('--sidebar-accent', selectedColors["accent-alt"]);
  
  // Update chart colors to match theme
  root.style.setProperty('--chart-1', selectedColors.accent);
  root.style.setProperty('--chart-2', selectedColors["accent-alt"]);
}