import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertExchangeApiKeySchema, insertUserSettingsSchema } from "@shared/schema";
import { z } from "zod";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // all routes should be prefixed with /api
  
  // User Routes
  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.status(201).json({ 
        message: "User created successfully", 
        user: { ...user, password: undefined } 
      });
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: fromZodError(error).message });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const userId = Number(req.params.id);
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json({ ...user, password: undefined });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Exchange API Keys Routes
  app.post("/api/exchange-api-keys", async (req, res) => {
    try {
      const apiKeyData = insertExchangeApiKeySchema.parse(req.body);
      const apiKey = await storage.createExchangeApiKey(apiKeyData);
      res.status(201).json({ 
        message: "Exchange API key added successfully", 
        apiKey: { ...apiKey, apiSecret: undefined } 
      });
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: fromZodError(error).message });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  app.get("/api/exchange-api-keys/:userId", async (req, res) => {
    try {
      const userId = Number(req.params.userId);
      const apiKeys = await storage.getExchangeApiKeysByUserId(userId);
      
      // Remove sensitive information
      const safeApiKeys = apiKeys.map(key => ({ ...key, apiSecret: undefined }));
      
      res.json(safeApiKeys);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete("/api/exchange-api-keys/:id", async (req, res) => {
    try {
      const apiKeyId = Number(req.params.id);
      await storage.deleteExchangeApiKey(apiKeyId);
      res.json({ message: "Exchange API key deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // User Settings Routes
  app.post("/api/user-settings", async (req, res) => {
    try {
      const settingsData = insertUserSettingsSchema.parse(req.body);
      const settings = await storage.createUserSettings(settingsData);
      res.status(201).json({ 
        message: "User settings created successfully", 
        settings
      });
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: fromZodError(error).message });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  app.get("/api/user-settings/:userId", async (req, res) => {
    try {
      const userId = Number(req.params.userId);
      const settings = await storage.getUserSettingsByUserId(userId);
      
      if (!settings) {
        return res.status(404).json({ message: "User settings not found" });
      }
      
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.put("/api/user-settings/:userId", async (req, res) => {
    try {
      const userId = Number(req.params.userId);
      const settingsData = insertUserSettingsSchema.partial().parse(req.body);
      const settings = await storage.updateUserSettings(userId, settingsData);
      
      if (!settings) {
        return res.status(404).json({ message: "User settings not found" });
      }
      
      res.json({ message: "User settings updated successfully", settings });
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: fromZodError(error).message });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  // Arbitrage Opportunities (mock endpoints for now - will be replaced with real data later)
  app.get("/api/arbitrage/opportunities", async (req, res) => {
    try {
      // For the demo, we'll return mock data
      // In a real implementation, this would query historical or live opportunities
      const opportunities = await storage.getMockArbitrageOpportunities();
      res.json(opportunities);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
