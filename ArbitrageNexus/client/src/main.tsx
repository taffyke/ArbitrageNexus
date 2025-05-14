import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { ThemeProvider } from "./components/ui/theme-provider";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider 
    defaultTheme="dark" 
    defaultColorScheme="blue"
    storageThemeKey="vite-ui-theme"
    storageColorKey="vite-ui-color"
  >
    <App />
  </ThemeProvider>
);
