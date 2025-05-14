import { useState, useEffect } from 'react';
import { useLocation, Redirect } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ChevronRight, Zap, TrendingUp, ArrowLeftRight, LineChart, Banknote, RefreshCw } from 'lucide-react';

export default function Auth() {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [, navigate] = useLocation();
  const { signIn, signUp, isAuthenticated } = useAuth();
  const { toast } = useToast();

  // If already authenticated, redirect to dashboard
  if (isAuthenticated) {
    return <Redirect to="/dashboard" />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await signIn(email, password);
      
      if (result.success) {
        toast({
          title: 'Login successful',
          description: 'Welcome back to ArbitragePro',
        });
        navigate('/dashboard');
      } else {
        toast({
          title: 'Login failed',
          description: result.error || 'Please check your credentials',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Login error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await signUp(email, password, username);
      
      if (result.success) {
        toast({
          title: 'Registration successful',
          description: 'Your account has been created, you can now login',
        });
        setActiveTab('login');
      } else {
        toast({
          title: 'Registration failed',
          description: result.error || 'Please check your information',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Registration error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>{activeTab === 'login' ? 'Login' : 'Sign Up'} | ArbitragePro</title>
      </Helmet>
      
      <div className="min-h-screen flex flex-col justify-center items-center relative overflow-hidden">
        {/* Futuristic Blockchain Background */}
        <div className="absolute inset-0 z-0">
          {/* Base gradient layer */}
          <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-accent/10"></div>
          
          {/* Cyber grid pattern */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgxMjMsIDk3LCAyNTUsIDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40"></div>
          
          {/* Digital light beam/scan effect */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent"
            initial={{ top: "-100%" }}
            animate={{ top: "200%" }}
            transition={{ 
              repeat: Infinity, 
              duration: 8,
              ease: "linear"
            }}
            style={{ height: "50%" }}
          />
          
          {/* Blockchain nodes and connections */}
          <div className="absolute inset-0">
            {/* Remove the node points sections and replace with crypto symbols */}
            
            {/* Floating cryptocurrency symbols */}
            {[
              { symbol: "₿", name: "BTC", x: "15%", y: "20%", color: "text-amber-500", size: "text-2xl", delay: 0 },
              { symbol: "Ξ", name: "ETH", x: "75%", y: "15%", color: "text-accent", size: "text-2xl", delay: 0.7 },
              { symbol: "Ł", name: "LTC", x: "25%", y: "65%", color: "text-gray-400", size: "text-xl", delay: 1.2 },
              { symbol: "⟠", name: "ADA", x: "80%", y: "75%", color: "text-blue-400", size: "text-xl", delay: 0.3 },
              { symbol: "Ð", name: "DOGE", x: "30%", y: "25%", color: "text-yellow-500", size: "text-xl", delay: 0.9 },
              { symbol: "₮", name: "USDT", x: "70%", y: "35%", color: "text-green-500", size: "text-xl", delay: 0.5 },
              { symbol: "⓿", name: "DOT", x: "40%", y: "85%", color: "text-pink-500", size: "text-xl", delay: 1.5 },
              { symbol: "◎", name: "SOL", x: "85%", y: "55%", color: "text-purple-400", size: "text-xl", delay: 0.4 },
              { symbol: "✕", name: "XRP", x: "20%", y: "40%", color: "text-accent-alt", size: "text-xl", delay: 1.8 },
              { symbol: "∞", name: "AVAX", x: "60%", y: "20%", color: "text-red-400", size: "text-xl", delay: 1.1 }
            ].map((crypto, i) => (
              <motion.div
                key={`crypto-${i}`}
                className={`absolute font-bold ${crypto.color} ${crypto.size} flex flex-col items-center`}
                style={{ left: crypto.x, top: crypto.y }}
                animate={{ 
                  y: [0, -15, 0],
                  opacity: [0.7, 1, 0.7],
                  filter: [
                    'drop-shadow(0 0 2px rgba(255, 255, 255, 0))',
                    'drop-shadow(0 0 8px rgba(255, 255, 255, 0.3))',
                    'drop-shadow(0 0 2px rgba(255, 255, 255, 0))'
                  ]
                }}
                transition={{ 
                  duration: 4 + Math.random() * 2,
                  delay: crypto.delay, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
              >
                <span>{crypto.symbol}</span>
                <span className="text-xs mt-1 opacity-70">{crypto.name}</span>
              </motion.div>
            ))}

            {/* Currency price animations */}
            {[
              { pair: "BTC/USD", price: "$62,105", change: "+2.4%", x: "10%", y: "10%", positive: true, delay: 0.2 },
              { pair: "ETH/USD", price: "$3,045", change: "-1.2%", x: "70%", y: "85%", positive: false, delay: 0.5 },
              { pair: "XRP/USD", price: "$0.5742", change: "+5.3%", x: "15%", y: "75%", positive: true, delay: 0.8 },
              { pair: "SOL/USD", price: "$142.17", change: "+3.1%", x: "65%", y: "25%", positive: true, delay: 1.0 }
            ].map((price, i) => (
              <motion.div
                key={`price-${i}`}
                className="absolute bg-background/40 backdrop-blur-md border border-accent/10 rounded-lg px-3 py-2"
                style={{ left: price.x, top: price.y }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ 
                  opacity: [0.7, 0.9, 0.7],
                  y: [0, -10, 0],
                  scale: [0.95, 1, 0.95],
                  boxShadow: [
                    '0 0 0 0 rgba(123, 97, 255, 0)',
                    '0 0 8px 2px rgba(123, 97, 255, 0.1)',
                    '0 0 0 0 rgba(123, 97, 255, 0)'
                  ]
                }}
                transition={{ 
                  duration: 5,
                  delay: price.delay,
                  repeat: Infinity, 
                  ease: "easeInOut"
                }}
              >
                <div className="text-xs font-medium text-muted-foreground">{price.pair}</div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-sm font-bold">{price.price}</span>
                  <span className={`text-xs ml-2 ${price.positive ? 'text-green-500' : 'text-red-500'}`}>
                    {price.change}
                  </span>
                </div>
              </motion.div>
            ))}
            
            {/* Arbitrage opportunity animations */}
            {[
              { exchanges: "Binance → Coinbase", profit: "+1.2%", x: "50%", y: "45%", delay: 1.4 },
              { exchanges: "Kraken → Gemini", profit: "+0.8%", x: "25%", y: "55%", delay: 2.1 }
            ].map((arb, i) => (
              <motion.div
                key={`arb-${i}`}
                className="absolute bg-accent/10 backdrop-blur-md border border-accent/20 rounded-lg px-3 py-2 text-accent"
                style={{ left: arb.x, top: arb.y }}
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: [0, 0.9, 0],
                  scale: [0.9, 1.05, 0.9],
                }}
                transition={{ 
                  duration: 8,
                  delay: arb.delay,
                  repeat: Infinity, 
                  ease: "easeInOut"
                }}
              >
                <div className="text-xs font-medium flex items-center">
                  <RefreshCw className="h-3 w-3 mr-1" />
                  <span>Arbitrage Opportunity</span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-sm">{arb.exchanges}</span>
                  <span className="text-xs ml-2 font-bold text-green-500">{arb.profit}</span>
                </div>
              </motion.div>
            ))}

            {/* Connection lines */}
            <svg className="absolute inset-0 w-full h-full z-0 opacity-20">
              <motion.path
                d="M 15% 15%, L 30% 25%, L 45% 18%, L 55% 28%, L 70% 20%, L 85% 30%"
                stroke="url(#accent-gradient)"
                strokeWidth="1"
                fill="none"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.6 }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.path
                d="M 20% 80%, L 35% 75%, L 50% 82%, L 65% 72%, L 80% 78%"
                stroke="url(#accent-alt-gradient)"
                strokeWidth="1"
                fill="none"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.6 }}
                transition={{ duration: 4.5, delay: 1, repeat: Infinity, ease: "easeInOut" }}
              />
              <defs>
                <linearGradient id="accent-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="rgba(123, 97, 255, 0.3)" />
                  <stop offset="50%" stopColor="rgba(123, 97, 255, 0.7)" />
                  <stop offset="100%" stopColor="rgba(123, 97, 255, 0.3)" />
                </linearGradient>
                <linearGradient id="accent-alt-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="rgba(236, 72, 153, 0.3)" />
                  <stop offset="50%" stopColor="rgba(236, 72, 153, 0.7)" />
                  <stop offset="100%" stopColor="rgba(236, 72, 153, 0.3)" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          
          {/* Floating crypto trading icons */}
          <motion.div 
            className="absolute top-1/4 left-1/5 flex items-center justify-center w-14 h-14 rounded-full bg-background/40 backdrop-blur-md border border-accent/10"
            animate={{ 
              y: [0, -15, 0],
              boxShadow: [
                '0 0 0 0 rgba(123, 97, 255, 0)',
                '0 0 8px 2px rgba(123, 97, 255, 0.2)',
                '0 0 0 0 rgba(123, 97, 255, 0)'
              ]
            }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            <LineChart className="h-6 w-6 text-accent" />
          </motion.div>
          
          <motion.div 
            className="absolute bottom-1/4 right-1/5 flex items-center justify-center w-14 h-14 rounded-full bg-background/40 backdrop-blur-md border border-accent-alt/10"
            animate={{ 
              y: [0, -15, 0],
              boxShadow: [
                '0 0 0 0 rgba(236, 72, 153, 0)',
                '0 0 8px 2px rgba(236, 72, 153, 0.2)',
                '0 0 0 0 rgba(236, 72, 153, 0)'
              ]
            }}
            transition={{ duration: 5, delay: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <RefreshCw className="h-6 w-6 text-accent-alt" />
          </motion.div>
          
          <motion.div 
            className="absolute top-2/3 right-1/3 flex items-center justify-center w-12 h-12 rounded-full bg-background/40 backdrop-blur-md border border-accent/10"
            animate={{ 
              y: [0, -12, 0],
              boxShadow: [
                '0 0 0 0 rgba(123, 97, 255, 0)',
                '0 0 8px 2px rgba(123, 97, 255, 0.2)',
                '0 0 0 0 rgba(123, 97, 255, 0)'
              ]
            }}
            transition={{ duration: 4.5, delay: 0.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <Banknote className="h-5 w-5 text-accent" />
          </motion.div>
          
          {/* Digital price movements in background */}
          <div className="absolute bottom-10 left-10 right-10 h-20 opacity-10">
            <motion.svg width="100%" height="100%" viewBox="0 0 600 100">
              {/* Price chart 1 */}
              <motion.path
                d="M0,50 L40,45 L80,55 L120,40 L160,60 L200,50 L240,30 L280,45 L320,50 L360,40 L400,60 L440,45 L480,55 L520,30 L560,50 L600,40"
                fill="none"
                stroke="rgba(123, 97, 255, 0.8)"
                strokeWidth="2"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />
              
              {/* Price chart 2 */}
              <motion.path
                d="M0,70 L40,65 L80,75 L120,60 L160,70 L200,55 L240,65 L280,55 L320,75 L360,60 L400,70 L440,50 L480,65 L520,55 L560,70 L600,60"
                fill="none"
                stroke="rgba(236, 72, 153, 0.8)"
                strokeWidth="2"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 3.5, delay: 0.5, repeat: Infinity, ease: "linear" }}
              />
            </motion.svg>
          </div>
        </div>
        
        {/* Auth Card */}
        <motion.div 
          className="w-full max-w-md z-10 bg-background/50 backdrop-blur-lg rounded-xl border border-accent/20 p-8 shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-accent mb-2">ArbitragePro</h1>
            <p className="text-muted-foreground">Your gateway to crypto arbitrage profits</p>
          </div>
          
          <AnimatePresence mode="wait">
            <Tabs 
              key={activeTab}
              defaultValue={activeTab} 
              onValueChange={(v) => setActiveTab(v as 'login' | 'signup')}
              className="w-full"
            >
              <TabsList className="grid grid-cols-2 mb-8">
                <TabsTrigger value="login" className="data-[state=active]:bg-accent data-[state=active]:text-background">Login</TabsTrigger>
                <TabsTrigger value="signup" className="data-[state=active]:bg-accent data-[state=active]:text-background">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <form onSubmit={handleLogin} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="bg-background/50 backdrop-blur-sm focus:ring-accent"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label htmlFor="password">Password</Label>
                        <a href="#" className="text-xs text-accent hover:underline">Forgot password?</a>
                      </div>
                      <Input 
                        id="password" 
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="bg-background/50 backdrop-blur-sm focus:ring-accent"
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-accent hover:bg-accent/80 text-background"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Logging in...
                        </>
                      ) : (
                        'Login'
                      )}
                    </Button>
                  </form>
                </motion.div>
              </TabsContent>
              
              <TabsContent value="signup">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <form onSubmit={handleSignup} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input 
                        id="username" 
                        placeholder="cryptotrader"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="bg-background/50 backdrop-blur-sm focus:ring-accent"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <Input 
                        id="signup-email" 
                        type="email" 
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="bg-background/50 backdrop-blur-sm focus:ring-accent"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <Input 
                        id="signup-password" 
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="bg-background/50 backdrop-blur-sm focus:ring-accent"
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-accent hover:bg-accent/80 text-background"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating account...
                        </>
                      ) : (
                        'Create Account'
                      )}
                    </Button>
                  </form>
                </motion.div>
              </TabsContent>
            </Tabs>
          </AnimatePresence>
          
          <div className="mt-8 text-center text-sm text-muted-foreground">
            <a href="/" className="flex items-center justify-center text-accent hover:underline">
              <ChevronRight className="mr-1 h-4 w-4" />
              Back to home
            </a>
          </div>
        </motion.div>
      </div>
    </>
  );
} 