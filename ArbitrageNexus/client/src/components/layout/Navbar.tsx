import { useState } from "react";
import { Link } from "wouter";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme } = useTheme();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-accent/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link href="/">
              <a className="text-accent font-bold text-2xl">ArbitragePro</a>
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="flex items-center space-x-8">
              <a href="#features" className="text-muted-foreground hover:text-accent transition-colors duration-200">
                Features
              </a>
              <a href="#how-it-works" className="text-muted-foreground hover:text-accent transition-colors duration-200">
                How It Works
              </a>
              <a href="#pricing" className="text-muted-foreground hover:text-accent transition-colors duration-200">
                Pricing
              </a>
              <Link href="/auth/login">
                <Button className="bg-accent hover:bg-accent/80 text-background">
                  Launch App
                </Button>
              </Link>
            </div>
          </div>
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-background/95 backdrop-blur-md border-b border-accent/20">
            <a href="#features" className="block px-3 py-2 text-base font-medium text-muted-foreground hover:text-accent">
              Features
            </a>
            <a href="#how-it-works" className="block px-3 py-2 text-base font-medium text-muted-foreground hover:text-accent">
              How It Works
            </a>
            <a href="#pricing" className="block px-3 py-2 text-base font-medium text-muted-foreground hover:text-accent">
              Pricing
            </a>
            <Link href="/auth/login">
              <a className="block px-3 py-2 text-base font-medium text-accent">
                Launch App
              </a>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
