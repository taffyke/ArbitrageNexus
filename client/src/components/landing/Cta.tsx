import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Cta() {
  return (
    <div className="py-20 px-4 text-center bg-gradient-to-b from-background to-primary">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold mb-6">Ready to start your <span className="text-accent">arbitrage journey</span>?</h2>
        <p className="text-xl text-muted-foreground mb-8">Join thousands of traders who are already capitalizing on market inefficiencies.</p>
        <Link href="/dashboard">
          <Button size="lg" className="px-8 py-4 bg-accent hover:bg-accent/80 text-background font-medium text-xl">
            Launch Application
          </Button>
        </Link>
      </div>
    </div>
  );
}
