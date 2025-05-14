import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Bell, Zap, Search, Filter, ExternalLink, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { getTimeAgo } from "@/lib/utils";

// Define news item interface
interface NewsItem {
  id: string;
  title: string;
  source: string;
  category: 'market' | 'technology' | 'regulation' | 'exchange' | 'trending';
  url: string;
  timestamp: Date;
  important?: boolean;
}

// Mock news data - would be replaced with real API data in production
const mockNews: NewsItem[] = [
  {
    id: "news-1",
    title: "Bitcoin breaks $80K resistance as ETF inflows reach record highs",
    source: "CoinDesk",
    category: "market",
    url: "#",
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    important: true
  },
  {
    id: "news-2",
    title: "Ethereum layer-2 solutions see 300% increase in TVL over past month",
    source: "CryptoSlate",
    category: "technology",
    url: "#",
    timestamp: new Date(Date.now() - 1000 * 60 * 15) // 15 minutes ago
  },
  {
    id: "news-3",
    title: "SEC approves spot Ethereum ETF applications from major issuers",
    source: "Bloomberg",
    category: "regulation",
    url: "#",
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    important: true
  },
  {
    id: "news-4",
    title: "Binance introduces new arbitrage-friendly fee structure for institutional traders",
    source: "Binance Blog",
    category: "exchange",
    url: "#",
    timestamp: new Date(Date.now() - 1000 * 60 * 45) // 45 minutes ago
  },
  {
    id: "news-5",
    title: "New cross-chain arbitrage protocol launches with $50M TVL on first day",
    source: "DeFi Pulse",
    category: "trending",
    url: "#",
    timestamp: new Date(Date.now() - 1000 * 60 * 60) // 1 hour ago
  },
  {
    id: "news-6",
    title: "Flash crash on major exchange creates temporary 4.2% arbitrage opportunity",
    source: "CoinTelegraph",
    category: "market",
    url: "#",
    timestamp: new Date(Date.now() - 1000 * 60 * 75) // 1 hour 15 min ago
  },
  {
    id: "news-7",
    title: "Japanese regulators propose new framework for crypto exchange operations",
    source: "Nikkei Asia",
    category: "regulation",
    url: "#",
    timestamp: new Date(Date.now() - 1000 * 60 * 90) // 1 hour 30 min ago
  },
  {
    id: "news-8",
    title: "Solana DeFi ecosystem TVL surpasses $15 billion as yields attract arbitrage traders",
    source: "Solana News",
    category: "technology",
    url: "#",
    timestamp: new Date(Date.now() - 1000 * 60 * 120) // 2 hours ago
  }
];

// Badge colors by category
const categoryColors: Record<string, string> = {
  market: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  technology: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  regulation: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  exchange: "bg-green-500/10 text-green-500 border-green-500/20",
  trending: "bg-pink-500/10 text-pink-500 border-pink-500/20"
};

export default function NewsTicker() {
  const [news, setNews] = useState<NewsItem[]>(mockNews);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [expanded, setExpanded] = useState<boolean>(false);
  const [scrollPosition, setScrollPosition] = useState<number>(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Filter news based on search query and active category filters
  const filteredNews = news.filter(item => {
    const matchesSearch = !searchQuery || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.source.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilters = activeFilters.length === 0 || 
      activeFilters.includes(item.category);
    
    return matchesSearch && matchesFilters;
  });

  // Toggle a category filter
  const toggleFilter = (category: string) => {
    if (activeFilters.includes(category)) {
      setActiveFilters(activeFilters.filter(f => f !== category));
    } else {
      setActiveFilters([...activeFilters, category]);
    }
  };

  // Auto-scroll functionality for the ticker in collapsed mode
  useEffect(() => {
    if (!expanded && filteredNews.length > 0) {
      const scrollInterval = setInterval(() => {
        setScrollPosition(prev => (prev + 1) % filteredNews.length);
      }, 5000);
      
      return () => clearInterval(scrollInterval);
    }
  }, [expanded, filteredNews.length]);

  // Manually scroll the expanded news view when scrollPosition changes
  useEffect(() => {
    if (expanded && scrollContainerRef.current) {
      const newsItems = scrollContainerRef.current.querySelectorAll('.news-item');
      if (newsItems.length > scrollPosition) {
        newsItems[scrollPosition].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [scrollPosition, expanded]);

  return (
    <Card className="w-full bg-background-surface/80 backdrop-blur-sm border-accent/20 overflow-hidden">
      <CardContent className="p-0">
        {/* Collapsed View (Ticker) */}
        {!expanded && (
          <div className="flex items-center px-3 py-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-accent mr-2 flex-shrink-0"
              onClick={() => setExpanded(true)}
            >
              <Bell className="h-5 w-5" />
            </Button>
            
            <div className="overflow-hidden flex-1 relative">
              <div className="flex items-center">
                {filteredNews.length > 0 ? (
                  <motion.div
                    key={filteredNews[scrollPosition].id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="flex items-center"
                  >
                    {filteredNews[scrollPosition].important && (
                      <Badge variant="outline" className="mr-2 bg-red-500/10 text-red-500 border-red-500/20">
                        <Zap className="h-3 w-3 mr-1" />
                        Breaking
                      </Badge>
                    )}
                    <Badge 
                      variant="outline" 
                      className={`mr-2 ${categoryColors[filteredNews[scrollPosition].category]}`}
                    >
                      {filteredNews[scrollPosition].category}
                    </Badge>
                    <span className="font-medium mr-2 truncate">
                      {filteredNews[scrollPosition].title}
                    </span>
                    <span className="text-muted-foreground text-sm">
                      {filteredNews[scrollPosition].source} • {getTimeAgo(filteredNews[scrollPosition].timestamp)}
                    </span>
                  </motion.div>
                ) : (
                  <div className="text-muted-foreground">No news matching your filters</div>
                )}
              </div>
            </div>
            
            <div className="flex items-center ml-2 space-x-1 flex-shrink-0">
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-muted-foreground hover:text-accent"
                onClick={() => setScrollPosition(prev => (prev - 1 + filteredNews.length) % filteredNews.length)}
                disabled={filteredNews.length <= 1}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-left"><path d="m15 18-6-6 6-6"/></svg>
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-muted-foreground hover:text-accent"
                onClick={() => setScrollPosition(prev => (prev + 1) % filteredNews.length)}
                disabled={filteredNews.length <= 1}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-right"><path d="m9 18 6-6-6-6"/></svg>
              </Button>
              <span className="text-xs text-muted-foreground">
                {filteredNews.length > 0 ? `${scrollPosition + 1}/${filteredNews.length}` : '0/0'}
              </span>
            </div>
          </div>
        )}
        
        {/* Expanded View (Full News List) */}
        {expanded && (
          <div className="p-3">
            <div className="flex items-center justify-between mb-3">
              <div className="font-medium flex items-center">
                <Bell className="h-5 w-5 mr-2 text-accent" />
                Crypto News Feed
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setExpanded(false)}
                className="text-muted-foreground"
              >
                Collapse
              </Button>
            </div>
            
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-2 mb-3">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search news..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                
                {Object.keys(categoryColors).map(category => (
                  <Button
                    key={category}
                    variant="outline"
                    size="sm"
                    className={`text-xs ${
                      activeFilters.includes(category) 
                        ? categoryColors[category]
                        : 'border-muted-foreground/20'
                    }`}
                    onClick={() => toggleFilter(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
            
            {/* News List */}
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2" ref={scrollContainerRef}>
              {filteredNews.length > 0 ? (
                filteredNews.map((item, index) => (
                  <div 
                    key={item.id} 
                    className={`news-item p-2 border border-border rounded-lg hover:bg-accent/5 transition-colors ${
                      index === scrollPosition ? 'bg-accent/5 border-accent/20' : ''
                    }`}
                    onClick={() => setScrollPosition(index)}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          {item.important && (
                            <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
                              <Zap className="h-3 w-3 mr-1" />
                              Breaking
                            </Badge>
                          )}
                          <Badge 
                            variant="outline" 
                            className={categoryColors[item.category]}
                          >
                            {item.category}
                          </Badge>
                          <span className="text-xs text-muted-foreground flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {getTimeAgo(item.timestamp)}
                          </span>
                        </div>
                        <div className="font-medium">{item.title}</div>
                        <div className="text-sm text-muted-foreground mt-1">Source: {item.source}</div>
                      </div>
                      <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-accent" asChild>
                        <a href={item.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  No news matching your search criteria
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}