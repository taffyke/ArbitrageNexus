import { 
  users, type User, type InsertUser,
  exchangeApiKeys, type ExchangeApiKey, type InsertExchangeApiKey,
  userSettings, type UserSettings, type InsertUserSettings
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Exchange API Keys operations
  createExchangeApiKey(apiKey: InsertExchangeApiKey): Promise<ExchangeApiKey>;
  getExchangeApiKeysByUserId(userId: number): Promise<ExchangeApiKey[]>;
  deleteExchangeApiKey(id: number): Promise<void>;

  // User Settings operations
  createUserSettings(settings: InsertUserSettings): Promise<UserSettings>;
  getUserSettingsByUserId(userId: number): Promise<UserSettings | undefined>;
  updateUserSettings(userId: number, settings: Partial<InsertUserSettings>): Promise<UserSettings | undefined>;
  
  // Mock data for development (will be replaced later)
  getMockArbitrageOpportunities(): Promise<any[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private exchangeApiKeys: Map<number, ExchangeApiKey>;
  private userSettings: Map<number, UserSettings>;
  private userCurrentId: number;
  private apiKeyCurrentId: number;
  private settingsCurrentId: number;

  constructor() {
    this.users = new Map();
    this.exchangeApiKeys = new Map();
    this.userSettings = new Map();
    this.userCurrentId = 1;
    this.apiKeyCurrentId = 1;
    this.settingsCurrentId = 1;
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const now = new Date();
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: now,
      updatedAt: now,
      subscription: "Free",
      apiUsageLimit: 100,
      apiUsageCount: 0
    };
    this.users.set(id, user);
    return user;
  }

  // Exchange API Keys operations
  async createExchangeApiKey(insertApiKey: InsertExchangeApiKey): Promise<ExchangeApiKey> {
    const id = this.apiKeyCurrentId++;
    const now = new Date();
    const apiKey: ExchangeApiKey = {
      ...insertApiKey,
      id,
      createdAt: now,
      updatedAt: now,
      isActive: true
    };
    this.exchangeApiKeys.set(id, apiKey);
    return apiKey;
  }

  async getExchangeApiKeysByUserId(userId: number): Promise<ExchangeApiKey[]> {
    return Array.from(this.exchangeApiKeys.values()).filter(
      (apiKey) => apiKey.userId === userId,
    );
  }

  async deleteExchangeApiKey(id: number): Promise<void> {
    this.exchangeApiKeys.delete(id);
  }

  // User Settings operations
  async createUserSettings(insertSettings: InsertUserSettings): Promise<UserSettings> {
    const id = this.settingsCurrentId++;
    const now = new Date();
    const settings: UserSettings = {
      ...insertSettings,
      id,
      updatedAt: now
    };
    this.userSettings.set(id, settings);
    return settings;
  }

  async getUserSettingsByUserId(userId: number): Promise<UserSettings | undefined> {
    return Array.from(this.userSettings.values()).find(
      (settings) => settings.userId === userId,
    );
  }

  async updateUserSettings(userId: number, partialSettings: Partial<InsertUserSettings>): Promise<UserSettings | undefined> {
    const existingSettings = await this.getUserSettingsByUserId(userId);
    if (!existingSettings) {
      return undefined;
    }

    const updatedSettings: UserSettings = {
      ...existingSettings,
      ...partialSettings,
      updatedAt: new Date()
    };

    this.userSettings.set(existingSettings.id, updatedSettings);
    return updatedSettings;
  }

  // Mock data methods (for development only, will be replaced with real data)
  async getMockArbitrageOpportunities(): Promise<any[]> {
    return [
      {
        id: "direct1",
        type: "direct",
        pair: "BTC/USDT",
        exchanges: ["Binance", "Kraken"],
        profit: "853.43",
        profitPercentage: "3.24",
        timestamp: new Date(),
        details: JSON.stringify({
          buyPrice: 26342.18,
          sellPrice: 27195.61,
          buyExchange: "Binance",
          sellExchange: "Kraken"
        }),
        isActive: true
      },
      {
        id: "triangular1",
        type: "triangular",
        pair: "ETH → BTC → USDT",
        exchanges: ["Binance"],
        profit: "30.81",
        profitPercentage: "1.87",
        timestamp: new Date(),
        details: JSON.stringify({
          path: ["ETH", "BTC", "USDT"],
          exchange: "Binance",
          initialAmount: 1,
          finalAmount: 1675.34
        }),
        isActive: true
      },
      {
        id: "futures1",
        type: "futures",
        pair: "BTC/USDT",
        exchanges: ["Binance"],
        profit: "550.25",
        profitPercentage: "2.09",
        timestamp: new Date(),
        details: JSON.stringify({
          spotPrice: 26342.18,
          futuresPrice: 26892.43,
          premium: 2.09,
          exchange: "Binance"
        }),
        isActive: true
      },
      {
        id: "p2p1",
        type: "p2p",
        pair: "USDT P2P",
        exchanges: ["Binance P2P", "Coinbase"],
        profit: "38.50",
        profitPercentage: "3.85",
        timestamp: new Date(),
        details: JSON.stringify({
          buyRate: 0.97,
          sellRate: 1.00,
          buyExchange: "Binance P2P",
          sellExchange: "Coinbase"
        }),
        isActive: true
      }
    ];
  }
}

export const storage = new MemStorage();
