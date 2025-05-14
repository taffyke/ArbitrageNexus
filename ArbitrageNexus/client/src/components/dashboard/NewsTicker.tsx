import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Bell, Zap, Search, Filter, ExternalLink, Clock, AlertCircle, Loader2 } from "lucide-react";
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

// Map API categories to our internal categories
const categoryMapping: Record<string, 'market' | 'technology' | 'regulation' | 'exchange' | 'trending'> = {
  "Market": "market",
  "Markets": "market",
  "Price Analysis": "market",
  "Trading": "market",
  "Business": "market",
  "Technology": "technology",
  "Tech": "technology",
  "Blockchain": "technology",
  "DeFi": "technology",
  "NFT": "technology",
  "Mining": "technology",
  "Regulation": "regulation",
  "Regulatory": "regulation",
  "Legal": "regulation",
  "Policy": "regulation",
  "Government": "regulation",
  "Exchange": "exchange",
  "Exchanges": "exchange",
  "CEX": "exchange",
  "DEX": "exchange",
  "Trending": "trending",
  "Altcoins": "trending",
  "Bitcoin": "trending",
  "Ethereum": "trending"
};

// Badge colors by category
const categoryColors: Record<string, string> = {
  market: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  technology: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  regulation: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  exchange: "bg-green-500/10 text-green-500 border-green-500/20",
  trending: "bg-pink-500/10 text-pink-500 border-pink-500/20"
};

export default function NewsTicker() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [expanded, setExpanded] = useState<boolean>(false);
  const [scrollPosition, setScrollPosition] = useState<number>(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Fetch news from API
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch from CryptoCompare News API
        const response = await fetch('https://min-api.cryptocompare.com/data/v2/news/?lang=EN&api_key=freekey');
        const data = await response.json();
        
        if (data.Response === "Error") {
          throw new Error(data.Message || "Failed to fetch news");
        }
        
        // Map API data to our NewsItem format
        const newsItems: NewsItem[] = data.Data.map((item: any, index: number) => {
          // Determine category based on tags or categories from API
          let category: 'market' | 'technology' | 'regulation' | 'exchange' | 'trending' = "market"; // Default
          
          if (item.categories) {
            // Try to map categories
            for (const cat of item.categories.split('|')) {
              if (categoryMapping[cat]) {
                category = categoryMapping[cat];
                break;
              }
            }
          } else if (item.tags) {
            // Try to map from tags if no categories
            for (const tag of item.tags.split('|')) {
              if (categoryMapping[tag]) {
                category = categoryMapping[tag];
                break;
              }
            }
          }
          
          // Determine if news is important (you can customize this logic)
          const isImportant = 
            item.title.includes("breaks") || 
            item.title.includes("announces") || 
            item.title.includes("launches") ||
            item.title.toLowerCase().includes("sec") ||
            item.title.includes("record") ||
            item.title.includes("surges") ||
            item.title.includes("crash");
          
          return {
            id: item.id || `news-${index}`,
            title: item.title,
            source: item.source || item.sourceInfo?.name || "Crypto News",
            category,
            url: item.url || item.guid,
            timestamp: new Date(item.published_on * 1000 || item.published_at || Date.now()),
            important: isImportant
          };
        });
        
        setNews(newsItems);
      } catch (err) {
        console.error("Failed to fetch news:", err);
        setError("Failed to load news. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    
    // Fetch initially
    fetchNews();
    
    // Set up interval for periodic updates (every 5 minutes)
    const interval = setInterval(fetchNews, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

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

  // Handle opening news in new tab
  const openNewsArticle = (url: string, event?: React.MouseEvent) => {
    if (event) {
      // If this is triggered from a button, don't propagate to prevent the card click
      event.stopPropagation();
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Render empty or loading state for the collapsed ticker
  const renderEmptyTicker = () => {
    if (isLoading) {
      return (
        <div className="flex items-center text-muted-foreground">
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Loading latest crypto news...
        </div>
      );
    }
    
    if (error) {
      return (
        <div className="flex items-center text-muted-foreground">
          <AlertCircle className="h-4 w-4 mr-2 text-destructive" />
          {error}
        </div>
      );
    }
    
    return <div className="text-muted-foreground">No news matching your filters</div>;
  };

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
              <Bell className="h-5 w-5 text-accent" />
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
                    className="flex items-center cursor-pointer"
                    onClick={() => openNewsArticle(filteredNews[scrollPosition].url)}
                  >
                    {filteredNews[scrollPosition].important && (
                      <Badge variant="outline" className="mr-2 bg-red-500/10 text-red-500 border-red-500/20">
                        <Zap className="h-3 w-3 mr-1 text-red-500" />
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
                ) : renderEmptyTicker()}
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
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-accent" />
                <span className="ml-2 text-muted-foreground">Loading latest crypto news...</span>
              </div>
            ) : error ? (
              <div className="text-center py-6 text-muted-foreground">
                <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-2" />
                <p>{error}</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => window.location.reload()}
                  className="mt-4"
                >
                  Refresh
                </Button>
              </div>
            ) : (
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2" ref={scrollContainerRef}>
              {filteredNews.length > 0 ? (
                filteredNews.map((item, index) => (
                  <div 
                    key={item.id} 
                    className={`news-item p-2 border border-border rounded-lg hover:bg-accent/5 transition-colors ${
                      index === scrollPosition ? 'bg-accent/5 border-accent/20' : ''
                      } cursor-pointer`}
                      onClick={() => openNewsArticle(item.url)}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          {item.important && (
                            <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
                                <Zap className="h-3 w-3 mr-1 text-red-500" />
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
                              <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                            {getTimeAgo(item.timestamp)}
                          </span>
                        </div>
                        <div className="font-medium">{item.title}</div>
                          <div className="text-sm text-muted-foreground mt-1">
                            Source: 
                            <Button 
                              variant="link" 
                              className="px-1 py-0 h-auto text-sm text-accent hover:text-accent-alt"
                              onClick={(e) => openNewsArticle(item.url, e)}
                            >
                              {item.source}
                            </Button>
                          </div>
                      </div>
                      <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-accent" asChild>
                          <a href={item.url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
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
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}