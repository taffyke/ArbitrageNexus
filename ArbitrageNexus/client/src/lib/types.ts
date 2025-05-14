export interface ArbitrageOpportunity {
  id: string;
  type: 'direct' | 'triangular' | 'futures' | 'p2p';
  pair: string;
  exchanges: string[];
  profit: number;
  profitPercentage: number;
  timestamp: Date;
}

export interface DirectArbitrageOpportunity extends ArbitrageOpportunity {
  type: 'direct';
  buyPrice: number;
  sellPrice: number;
  buyExchange: string;
  sellExchange: string;
}

export interface TriangularArbitrageOpportunity extends ArbitrageOpportunity {
  type: 'triangular';
  path: string[];
  exchange: string;
  initialAmount: number;
  finalAmount: number;
}

export interface FuturesArbitrageOpportunity extends ArbitrageOpportunity {
  type: 'futures';
  spotPrice: number;
  futuresPrice: number;
  premium: number;
  exchange: string;
}

export interface P2PArbitrageOpportunity extends ArbitrageOpportunity {
  type: 'p2p';
  buyRate: number;
  sellRate: number;
  buyExchange: string;
  sellExchange: string;
}

export interface ExchangeInfo {
  id: string;
  name: string;
  logo?: string;
  dateAdded: Date;
  apiKey?: string;
}

export interface ExchangeData {
  id: string;
  name: string;
  price: number;
  volume: number;
  priceDifference: number;
  spread: number;
  liquidityScore: number;
}

export interface ChartDataPoint {
  timestamp: Date | string;
  value: number;
}

export interface OrderBookEntry {
  price: number;
  amount: number;
}

export interface MarketDepth {
  bids: OrderBookEntry[];
  asks: OrderBookEntry[];
  bidVolume: number;
  askVolume: number;
}

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  country?: string;
  memberSince: Date;
  subscription: string;
  apiUsage: {
    used: number;
    limit: number;
  };
}

export interface AppSettings {
  darkMode: boolean;
  realTimeUpdates: boolean;
  autoExecuteTrades: boolean;
  priceAlerts: boolean;
  enableAnimations: boolean;
}
