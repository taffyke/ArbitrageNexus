import { useEffect, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Hero() {
  const parallaxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!parallaxRef.current) return;
      const parallaxLayers = parallaxRef.current.querySelectorAll('.parallax-layer');
      
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      
      parallaxLayers.forEach((layer, index) => {
        const htmlLayer = layer as HTMLElement;
        const speed = (3 - index) * 15; // Different speed for each layer
        const xOffset = (0.5 - x) * speed;
        const yOffset = (0.5 - y) * speed;
        
        htmlLayer.style.transform = `translate3d(${xOffset}px, ${yOffset}px, 0)`;
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div ref={parallaxRef} className="relative h-screen overflow-hidden grid-pattern">
      {/* Background Stars Layer (slowest) */}
      <div className="parallax-layer absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(123,97,255,0.15)_0,_transparent_70%)]"></div>
        {/* Random stars */}
        <div className="absolute h-2 w-2 rounded-full bg-white/40 top-1/4 left-1/3"></div>
        <div className="absolute h-1 w-1 rounded-full bg-white/30 top-1/2 left-1/4"></div>
        <div className="absolute h-3 w-3 rounded-full bg-white/20 top-3/4 left-2/3"></div>
        <div className="absolute h-2 w-2 rounded-full bg-white/50 top-1/5 left-3/4"></div>
        <div className="absolute h-1 w-1 rounded-full bg-white/60 top-2/3 left-1/5"></div>
        <div className="absolute h-2 w-2 rounded-full bg-white/40 top-1/3 left-4/5"></div>
        <div className="absolute h-1 w-1 rounded-full bg-white/30 top-3/5 left-2/5"></div>
        <div className="absolute h-2 w-2 rounded-full bg-white/50 top-4/5 left-1/2"></div>
      </div>

      {/* Floating Elements (middle speed) */}
      <div className="parallax-layer absolute inset-0 z-10">
        {/* A futuristic crypto graphic element */}
        <motion.div 
          className="absolute w-72 h-72 top-1/3 right-10 opacity-30"
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* A hexagonal grid pattern */}
          <div className="absolute w-full h-full border border-accent/30 rotate-45"></div>
          <div className="absolute w-4/5 h-4/5 left-[10%] top-[10%] border border-accent/40 rotate-45"></div>
          <div className="absolute w-3/5 h-3/5 left-[20%] top-[20%] border border-accent/50 rotate-45"></div>
        </motion.div>

        {/* A digital coin element floating on the left */}
        <motion.div 
          className="absolute w-60 h-60 top-2/3 left-16 opacity-20"
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 6, delay: 1, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="absolute w-full h-full rounded-full border-2 border-accent-alt/30"></div>
          <div className="absolute w-4/5 h-4/5 left-[10%] top-[10%] rounded-full border-2 border-accent-alt/40"></div>
          <div className="absolute w-3/5 h-3/5 left-[20%] top-[20%] rounded-full border-2 border-accent-alt/50"></div>
        </motion.div>
      </div>

      {/* Primary Content Layer (static) */}
      <div className="parallax-layer relative z-20 flex flex-col items-center justify-center h-full text-center px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-glow">
          <span className="text-white">Crypto Arbitrage</span>
          <span className="text-accent"> Reimagined</span>
        </h1>
        <p className="text-xl md:text-2xl max-w-2xl mb-8 text-muted-foreground">
          Discover and capitalize on price discrepancies across multiple exchanges in real-time with our advanced arbitrage platform.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <Link href="/auth/login">
            <Button size="lg" className="px-8 py-3 bg-accent hover:bg-accent/80 text-background font-medium text-lg">
              Get Started
            </Button>
          </Link>
          <Button size="lg" variant="outline" className="px-8 py-3 border-accent text-accent hover:bg-accent/10 font-medium text-lg">
            Learn More
          </Button>
        </div>

        {/* Floating statistic cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-16 max-w-4xl w-full">
          <motion.div 
            className="bg-background-surface/50 backdrop-blur-sm p-6 rounded-xl border border-accent/20 card-glow"
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="text-3xl font-bold text-accent mb-2">24/7</div>
            <div className="text-muted-foreground">Real-time market monitoring across exchanges</div>
          </motion.div>
          <motion.div 
            className="bg-background-surface/50 backdrop-blur-sm p-6 rounded-xl border border-accent/20 card-glow"
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 6, delay: 1, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="text-3xl font-bold text-accent mb-2">4 Types</div>
            <div className="text-muted-foreground">Of arbitrage opportunities identified automatically</div>
          </motion.div>
          <motion.div 
            className="bg-background-surface/50 backdrop-blur-sm p-6 rounded-xl border border-accent/20 card-glow"
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 6, delay: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="text-3xl font-bold text-accent mb-2">15+</div>
            <div className="text-muted-foreground">Exchange integrations for maximum coverage</div>
          </motion.div>
        </div>
      </div>

      {/* Foreground Elements (fastest) */}
      <div className="parallax-layer absolute inset-0 pointer-events-none z-30">
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent"></div>
      </div>
    </div>
  );
}
