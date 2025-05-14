import { 
  ArrowLeftRight, 
  LineChart, 
  Bell, 
  Bot, 
  Shield, 
  History 
} from "lucide-react";

export default function Features() {
  const features = [
    {
      icon: ArrowLeftRight,
      title: "Multi-Exchange Arbitrage",
      description: "Monitor price differences across multiple exchanges simultaneously to find the most profitable opportunities."
    },
    {
      icon: LineChart,
      title: "Real-Time Analytics",
      description: "Advanced data visualization and analytics tools to make informed trading decisions."
    },
    {
      icon: Bell,
      title: "Instant Alerts",
      description: "Get notified instantly when profitable arbitrage opportunities arise based on your criteria."
    },
    {
      icon: Bot,
      title: "Automated Trading",
      description: "Execute trades automatically across exchanges when conditions meet your specified parameters."
    },
    {
      icon: Shield,
      title: "Secure API Integration",
      description: "Connect your exchange accounts securely with read-only API keys for maximum security."
    },
    {
      icon: History,
      title: "Historical Performance",
      description: "Track your past arbitrage trades and analyze performance to improve your strategy."
    }
  ];

  return (
    <div id="features" className="py-24 px-4 max-w-7xl mx-auto">
      <h2 className="text-4xl font-bold text-center mb-16">Advanced <span className="text-accent">Features</span></h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div key={index} className="bg-background-surface p-8 rounded-xl border border-accent/20 card-glow">
            <feature.icon className="text-accent text-4xl mb-4 h-10 w-10" />
            <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
            <p className="text-muted-foreground">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
