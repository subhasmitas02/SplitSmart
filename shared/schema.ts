import { pgTable, text, serial, integer, boolean, timestamp, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull(),
  displayName: text("display_name").notNull(),
  avatarInitials: text("avatar_initials").notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
});

// Categories schema
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  icon: text("icon").notNull(),
  color: text("color").notNull(),
});

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
});

// Expenses schema
export const expenses = pgTable("expenses", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  amount: doublePrecision("amount").notNull(),
  date: timestamp("date").notNull(),
  notes: text("notes"),
  createdById: integer("created_by_id").notNull(),
  categoryId: integer("category_id").notNull(),
});

export const insertExpenseSchema = createInsertSchema(expenses).omit({
  id: true,
});

// Roommates schema (users who share expenses)
export const roommates = pgTable("roommates", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  householdId: integer("household_id").notNull(),
});

export const insertRoommateSchema = createInsertSchema(roommates).omit({
  id: true,
});

// Households schema
export const households = pgTable("households", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  createdById: integer("created_by_id").notNull(),
});

export const insertHouseholdSchema = createInsertSchema(households).omit({
  id: true,
});

// Splits schema (how expenses are split between roommates)
export const splits = pgTable("splits", {
  id: serial("id").primaryKey(),
  expenseId: integer("expense_id").notNull(),
  userId: integer("user_id").notNull(),
  amount: doublePrecision("amount").notNull(),
  isPaid: boolean("is_paid").notNull().default(false),
  dueDate: timestamp("due_date"),
});

export const insertSplitSchema = createInsertSchema(splits).omit({
  id: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;

export type Expense = typeof expenses.$inferSelect;
export type InsertExpense = z.infer<typeof insertExpenseSchema>;

export type Roommate = typeof roommates.$inferSelect;
export type InsertRoommate = z.infer<typeof insertRoommateSchema>;

export type Household = typeof households.$inferSelect;
export type InsertHousehold = z.infer<typeof insertHouseholdSchema>;

export type Split = typeof splits.$inferSelect;
export type InsertSplit = z.infer<typeof insertSplitSchema>;

// Extended types for API responses
export type ExpenseWithDetails = Expense & {
  category: Category;
  createdBy: User;
  splits: (Split & { user: User })[];
};

export type RoommateWithUser = Roommate & {
  user: User;
  owedAmount: number;
};

export type SplitWithDetails = Split & {
  expense: Expense;
  user: User;
};
