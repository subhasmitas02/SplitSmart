import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertExpenseSchema, insertSplitSchema, insertCategorySchema, insertUserSchema, insertRoommateSchema, insertHouseholdSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes - prefix all routes with /api
  const apiRouter = app.route("/api");

  // User endpoints
  app.get("/api/users/:id", async (req: Request, res: Response) => {
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await storage.getUser(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Don't send the password
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  });

  app.post("/api/users", async (req: Request, res: Response) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      
      // Don't send the password
      const { password, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid user data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create user" });
    }
  });

  app.post("/api/login", async (req: Request, res: Response) => {
    try {
      const { username, password } = z.object({
        username: z.string(),
        password: z.string()
      }).parse(req.body);

      const user = await storage.getUserByUsername(username);
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid username or password" });
      }

      // Don't send the password
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid login data", errors: error.errors });
      }
      res.status(500).json({ message: "Login failed" });
    }
  });

  // Category endpoints
  app.get("/api/categories", async (_req: Request, res: Response) => {
    const categories = await storage.getCategories();
    res.json(categories);
  });

  app.post("/api/categories", async (req: Request, res: Response) => {
    try {
      const categoryData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(categoryData);
      res.status(201).json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid category data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create category" });
    }
  });

  // Expense endpoints
  app.get("/api/expenses", async (_req: Request, res: Response) => {
    const expenses = await storage.getExpenses();
    res.json(expenses);
  });

  app.get("/api/expenses/:id", async (req: Request, res: Response) => {
    const expenseId = parseInt(req.params.id);
    if (isNaN(expenseId)) {
      return res.status(400).json({ message: "Invalid expense ID" });
    }

    const expense = await storage.getExpenseWithDetails(expenseId);
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.json(expense);
  });

  app.get("/api/users/:userId/expenses", async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await storage.getUser(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const expenses = await storage.getExpensesByUserId(userId);
    res.json(expenses);
  });

  app.post("/api/expenses", async (req: Request, res: Response) => {
    try {
      const expenseData = insertExpenseSchema.parse(req.body);
      const expense = await storage.createExpense(expenseData);
      res.status(201).json(expense);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid expense data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create expense" });
    }
  });

  // Household endpoints
  app.get("/api/households", async (_req: Request, res: Response) => {
    const households = await storage.getHouseholds();
    res.json(households);
  });

  app.get("/api/households/:id", async (req: Request, res: Response) => {
    const householdId = parseInt(req.params.id);
    if (isNaN(householdId)) {
      return res.status(400).json({ message: "Invalid household ID" });
    }

    const household = await storage.getHouseholdById(householdId);
    if (!household) {
      return res.status(404).json({ message: "Household not found" });
    }

    res.json(household);
  });

  app.post("/api/households", async (req: Request, res: Response) => {
    try {
      const householdData = insertHouseholdSchema.parse(req.body);
      const household = await storage.createHousehold(householdData);
      res.status(201).json(household);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid household data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create household" });
    }
  });

  // Roommate endpoints
  app.get("/api/roommates", async (_req: Request, res: Response) => {
    const roommates = await storage.getRoommates();
    res.json(roommates);
  });

  app.get("/api/households/:householdId/roommates", async (req: Request, res: Response) => {
    const householdId = parseInt(req.params.householdId);
    if (isNaN(householdId)) {
      return res.status(400).json({ message: "Invalid household ID" });
    }

    const roommates = await storage.getRoommatesByHouseholdId(householdId);
    res.json(roommates);
  });

  app.post("/api/roommates", async (req: Request, res: Response) => {
    try {
      const roommateData = insertRoommateSchema.parse(req.body);
      const roommate = await storage.createRoommate(roommateData);
      res.status(201).json(roommate);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid roommate data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create roommate" });
    }
  });

  // Split endpoints
  app.get("/api/expenses/:expenseId/splits", async (req: Request, res: Response) => {
    const expenseId = parseInt(req.params.expenseId);
    if (isNaN(expenseId)) {
      return res.status(400).json({ message: "Invalid expense ID" });
    }

    const splits = await storage.getSplitsByExpenseId(expenseId);
    res.json(splits);
  });

  app.get("/api/users/:userId/splits", async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const splits = await storage.getSplitsByUserId(userId);
    res.json(splits);
  });

  app.post("/api/splits", async (req: Request, res: Response) => {
    try {
      const splitData = insertSplitSchema.parse(req.body);
      const split = await storage.createSplit(splitData);
      res.status(201).json(split);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid split data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create split" });
    }
  });

  app.patch("/api/splits/:id", async (req: Request, res: Response) => {
    const splitId = parseInt(req.params.id);
    if (isNaN(splitId)) {
      return res.status(400).json({ message: "Invalid split ID" });
    }

    try {
      const { isPaid } = z.object({
        isPaid: z.boolean()
      }).parse(req.body);

      const updatedSplit = await storage.updateSplitPaymentStatus(splitId, isPaid);
      if (!updatedSplit) {
        return res.status(404).json({ message: "Split not found" });
      }

      res.json(updatedSplit);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid update data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update split" });
    }
  });

  // Summary endpoints for dashboard
  app.get("/api/users/:userId/dashboard", async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await storage.getUser(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get all expenses for this user
    const expenses = await storage.getExpensesByUserId(userId);
    
    // Get all splits for this user
    const splits = await storage.getSplitsByUserId(userId);
    
    // Calculate total expenses
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    // Calculate user's share
    const userShare = splits.reduce((sum, split) => sum + split.amount, 0);
    
    // Calculate outstanding amount (unpaid splits)
    const outstandingAmount = splits
      .filter(split => !split.isPaid)
      .reduce((sum, split) => sum + split.amount, 0);
    
    // Get user's roommates
    const households = await storage.getHouseholds();
    const userHouseholds = households.filter(h => h.createdById === userId);
    
    let roommateCount = 0;
    if (userHouseholds.length > 0) {
      const roommates = await storage.getRoommatesByHouseholdId(userHouseholds[0].id);
      roommateCount = roommates.length;
    }
    
    // Get recent expenses (last 5)
    const recentExpenses = expenses
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
    
    const expensesWithDetails = await Promise.all(
      recentExpenses.map(async exp => {
        const details = await storage.getExpenseWithDetails(exp.id);
        return details;
      })
    );
    
    // Group expenses by category
    const categories = await storage.getCategories();
    const expensesByCategory = categories.map(category => {
      const categoryExpenses = expenses.filter(expense => expense.categoryId === category.id);
      const total = categoryExpenses.reduce((sum, expense) => sum + expense.amount, 0);
      const percentage = totalExpenses > 0 ? Math.round((total / totalExpenses) * 100) : 0;
      
      return {
        category,
        total,
        percentage
      };
    }).filter(item => item.total > 0)
      .sort((a, b) => b.total - a.total);
    
    res.json({
      totalExpenses,
      userShare,
      outstandingAmount,
      roommateCount,
      recentExpenses: expensesWithDetails.filter(Boolean),
      expensesByCategory
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}
