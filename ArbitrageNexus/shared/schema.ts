import { pgTable, text, serial, integer, boolean, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  phone: text("phone"),
  country: text("country"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  subscription: text("subscription").default("Free").notNull(),
  apiUsageLimit: integer("api_usage_limit").default(100).notNull(),
  apiUsageCount: integer("api_usage_count").default(0).notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  firstName: true,
  lastName: true,
  phone: true,
  country: true,
});

// Exchange API Keys schema
export const exchangeApiKeys = pgTable("exchange_api_keys", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  apiKey: text("api_key").notNull(),
  apiSecret: text("api_secret").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  isActive: boolean("is_active").default(true).notNull(),
});

export const insertExchangeApiKeySchema = createInsertSchema(exchangeApiKeys).pick({
  userId: true,
  name: true,
  apiKey: true,
  apiSecret: true,
});

// User settings schema
export const userSettings = pgTable("user_settings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  darkMode: boolean("dark_mode").default(true).notNull(),
  realTimeUpdates: boolean("real_time_updates").default(true).notNull(),
  autoExecuteTrades: boolean("auto_execute_trades").default(false).notNull(),
  priceAlerts: boolean("price_alerts").default(true).notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertUserSettingsSchema = createInsertSchema(userSettings).pick({
  userId: true,
  darkMode: true,
  realTimeUpdates: true,
  autoExecuteTrades: true,
  priceAlerts: true,
});

// Arbitrage type enum
export const arbitrageTypeEnum = pgEnum("arbitrage_type", ["direct", "triangular", "futures", "p2p"]);

// Arbitrage opportunities schema
export const arbitrageOpportunities = pgTable("arbitrage_opportunities", {
  id: serial("id").primaryKey(),
  type: arbitrageTypeEnum("type").notNull(),
  pair: text("pair").notNull(),
  exchanges: text("exchanges").array().notNull(),
  profit: text("profit").notNull(),
  profitPercentage: text("profit_percentage").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  details: text("details"), // JSON string with type-specific details
  isActive: boolean("is_active").default(true).notNull(),
});

export const insertArbitrageOpportunitySchema = createInsertSchema(arbitrageOpportunities).pick({
  type: true,
  pair: true,
  exchanges: true,
  profit: true,
  profitPercentage: true,
  details: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertExchangeApiKey = z.infer<typeof insertExchangeApiKeySchema>;
export type ExchangeApiKey = typeof exchangeApiKeys.$inferSelect;

export type InsertUserSettings = z.infer<typeof insertUserSettingsSchema>;
export type UserSettings = typeof userSettings.$inferSelect;

export type InsertArbitrageOpportunity = z.infer<typeof insertArbitrageOpportunitySchema>;
export type ArbitrageOpportunity = typeof arbitrageOpportunities.$inferSelect;
