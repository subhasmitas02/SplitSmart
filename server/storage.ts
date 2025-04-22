import {
  users, type User, type InsertUser,
  categories, type Category, type InsertCategory,
  expenses, type Expense, type InsertExpense,
  roommates, type Roommate, type InsertRoommate,
  households, type Household, type InsertHousehold,
  splits, type Split, type InsertSplit,
  type ExpenseWithDetails,
  type RoommateWithUser,
  type SplitWithDetails
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Categories
  getCategories(): Promise<Category[]>;
  getCategory(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  // Expenses
  getExpenses(): Promise<Expense[]>;
  getExpenseById(id: number): Promise<Expense | undefined>;
  getExpenseWithDetails(id: number): Promise<ExpenseWithDetails | undefined>;
  getExpensesByUserId(userId: number): Promise<Expense[]>;
  createExpense(expense: InsertExpense): Promise<Expense>;
  
  // Roommates
  getRoommates(): Promise<Roommate[]>;
  getRoommatesByHouseholdId(householdId: number): Promise<RoommateWithUser[]>;
  createRoommate(roommate: InsertRoommate): Promise<Roommate>;
  
  // Households
  getHouseholds(): Promise<Household[]>;
  getHouseholdById(id: number): Promise<Household | undefined>;
  createHousehold(household: InsertHousehold): Promise<Household>;
  
  // Splits
  getSplitsByExpenseId(expenseId: number): Promise<Split[]>;
  getSplitsByUserId(userId: number): Promise<SplitWithDetails[]>;
  createSplit(split: InsertSplit): Promise<Split>;
  updateSplitPaymentStatus(id: number, isPaid: boolean): Promise<Split | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private categories: Map<number, Category>;
  private expenses: Map<number, Expense>;
  private roommates: Map<number, Roommate>;
  private households: Map<number, Household>;
  private splits: Map<number, Split>;
  
  private userIdCounter: number;
  private categoryIdCounter: number;
  private expenseIdCounter: number;
  private roommateIdCounter: number;
  private householdIdCounter: number;
  private splitIdCounter: number;

  constructor() {
    this.users = new Map();
    this.categories = new Map();
    this.expenses = new Map();
    this.roommates = new Map();
    this.households = new Map();
    this.splits = new Map();
    
    this.userIdCounter = 1;
    this.categoryIdCounter = 1;
    this.expenseIdCounter = 1;
    this.roommateIdCounter = 1;
    this.householdIdCounter = 1;
    this.splitIdCounter = 1;
    
    // Initialize with some default data
    this.initializeDefaultData();
  }

  private initializeDefaultData() {
    // Create a default user
    const user: User = {
      id: this.userIdCounter++,
      username: "jamie",
      password: "password123", // In a real app, this would be hashed
      email: "jamie@remote.co",
      displayName: "Jamie Smith",
      avatarInitials: "JS",
    };
    this.users.set(user.id, user);
    
    // Create some default roommates
    const user2: User = {
      id: this.userIdCounter++,
      username: "kim",
      password: "password123",
      email: "kim@example.com",
      displayName: "Kim Lee",
      avatarInitials: "KL",
    };
    this.users.set(user2.id, user2);
    
    const user3: User = {
      id: this.userIdCounter++,
      username: "mike",
      password: "password123",
      email: "mike@example.com",
      displayName: "Mike Rodriguez",
      avatarInitials: "MR",
    };
    this.users.set(user3.id, user3);
    
    // Create a household
    const household: Household = {
      id: this.householdIdCounter++,
      name: "Our Apartment",
      createdById: user.id,
    };
    this.households.set(household.id, household);
    
    // Add roommates to household
    const roommate1: Roommate = {
      id: this.roommateIdCounter++,
      userId: user.id,
      householdId: household.id,
    };
    this.roommates.set(roommate1.id, roommate1);
    
    const roommate2: Roommate = {
      id: this.roommateIdCounter++,
      userId: user2.id,
      householdId: household.id,
    };
    this.roommates.set(roommate2.id, roommate2);
    
    const roommate3: Roommate = {
      id: this.roommateIdCounter++,
      userId: user3.id,
      householdId: household.id,
    };
    this.roommates.set(roommate3.id, roommate3);
    
    // Create default categories
    const categories = [
      { name: "Rent", icon: "home", color: "#6366f1" },
      { name: "Utilities", icon: "bolt", color: "#8b5cf6" },
      { name: "Groceries", icon: "shopping-basket", color: "#f97316" },
      { name: "Internet", icon: "wifi", color: "#22c55e" },
      { name: "Subscriptions", icon: "tv", color: "#ef4444" },
    ];
    
    categories.forEach(cat => {
      const category: Category = {
        id: this.categoryIdCounter++,
        name: cat.name,
        icon: cat.icon,
        color: cat.color,
      };
      this.categories.set(category.id, category);
    });
    
    // Create some sample expenses
    const now = new Date();
    
    // Rent expense
    const rentExpense: Expense = {
      id: this.expenseIdCounter++,
      name: "May Rent",
      amount: 1800,
      date: new Date(now.getFullYear(), now.getMonth(), 1),
      notes: "Monthly rent payment",
      createdById: user.id,
      categoryId: 1, // Rent category
    };
    this.expenses.set(rentExpense.id, rentExpense);
    
    // Split the rent
    const rentSplit1: Split = {
      id: this.splitIdCounter++,
      expenseId: rentExpense.id,
      userId: user.id,
      amount: 600,
      isPaid: true,
      dueDate: new Date(now.getFullYear(), now.getMonth(), 31),
    };
    this.splits.set(rentSplit1.id, rentSplit1);
    
    const rentSplit2: Split = {
      id: this.splitIdCounter++,
      expenseId: rentExpense.id,
      userId: user2.id,
      amount: 600,
      isPaid: true,
      dueDate: new Date(now.getFullYear(), now.getMonth(), 31),
    };
    this.splits.set(rentSplit2.id, rentSplit2);
    
    const rentSplit3: Split = {
      id: this.splitIdCounter++,
      expenseId: rentExpense.id,
      userId: user3.id,
      amount: 600,
      isPaid: false,
      dueDate: new Date(now.getFullYear(), now.getMonth(), 31),
    };
    this.splits.set(rentSplit3.id, rentSplit3);
    
    // Grocery expense
    const groceryExpense: Expense = {
      id: this.expenseIdCounter++,
      name: "Costco Run",
      amount: 156.88,
      date: new Date(now.getFullYear(), now.getMonth(), 18),
      notes: "Weekly grocery shopping",
      createdById: user.id,
      categoryId: 3, // Groceries category
    };
    this.expenses.set(groceryExpense.id, groceryExpense);
    
    // Split the grocery expense
    const grocerySplit1: Split = {
      id: this.splitIdCounter++,
      expenseId: groceryExpense.id,
      userId: user.id,
      amount: 78.44,
      isPaid: true,
      dueDate: new Date(now.getFullYear(), now.getMonth(), 25),
    };
    this.splits.set(grocerySplit1.id, grocerySplit1);
    
    const grocerySplit2: Split = {
      id: this.splitIdCounter++,
      expenseId: groceryExpense.id,
      userId: user2.id,
      amount: 78.44,
      isPaid: false,
      dueDate: new Date(now.getFullYear(), now.getMonth(), 25),
    };
    this.splits.set(grocerySplit2.id, grocerySplit2);
    
    // Additional expenses
    const electricityExpense: Expense = {
      id: this.expenseIdCounter++,
      name: "Electricity Bill",
      amount: 124.87,
      date: new Date(now.getFullYear(), now.getMonth(), 12),
      notes: "Monthly electricity bill",
      createdById: user.id,
      categoryId: 2, // Utilities category
    };
    this.expenses.set(electricityExpense.id, electricityExpense);

    // Split the electricity expense
    this.splits.set(this.splitIdCounter++, {
      id: this.splitIdCounter,
      expenseId: electricityExpense.id,
      userId: user.id,
      amount: 41.62,
      isPaid: true,
      dueDate: new Date(now.getFullYear(), now.getMonth(), 20),
    });
    
    this.splits.set(this.splitIdCounter++, {
      id: this.splitIdCounter,
      expenseId: electricityExpense.id,
      userId: user2.id,
      amount: 41.62,
      isPaid: true,
      dueDate: new Date(now.getFullYear(), now.getMonth(), 20),
    });
    
    this.splits.set(this.splitIdCounter++, {
      id: this.splitIdCounter,
      expenseId: electricityExpense.id,
      userId: user3.id,
      amount: 41.63,
      isPaid: true,
      dueDate: new Date(now.getFullYear(), now.getMonth(), 20),
    });

    const internetExpense: Expense = {
      id: this.expenseIdCounter++,
      name: "Internet Service",
      amount: 79.99,
      date: new Date(now.getFullYear(), now.getMonth(), 10),
      notes: "Monthly internet service",
      createdById: user.id,
      categoryId: 4, // Internet category
    };
    this.expenses.set(internetExpense.id, internetExpense);

    // Split the internet expense
    this.splits.set(this.splitIdCounter++, {
      id: this.splitIdCounter,
      expenseId: internetExpense.id,
      userId: user.id,
      amount: 26.66,
      isPaid: true,
      dueDate: new Date(now.getFullYear(), now.getMonth(), 15),
    });
    
    this.splits.set(this.splitIdCounter++, {
      id: this.splitIdCounter,
      expenseId: internetExpense.id,
      userId: user2.id,
      amount: 26.66,
      isPaid: true,
      dueDate: new Date(now.getFullYear(), now.getMonth(), 15),
    });
    
    this.splits.set(this.splitIdCounter++, {
      id: this.splitIdCounter,
      expenseId: internetExpense.id,
      userId: user3.id,
      amount: 26.67,
      isPaid: true,
      dueDate: new Date(now.getFullYear(), now.getMonth(), 15),
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Category methods
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategory(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = this.categoryIdCounter++;
    const category: Category = { ...insertCategory, id };
    this.categories.set(id, category);
    return category;
  }

  // Expense methods
  async getExpenses(): Promise<Expense[]> {
    return Array.from(this.expenses.values());
  }

  async getExpenseById(id: number): Promise<Expense | undefined> {
    return this.expenses.get(id);
  }

  async getExpenseWithDetails(id: number): Promise<ExpenseWithDetails | undefined> {
    const expense = this.expenses.get(id);
    if (!expense) return undefined;

    const category = this.categories.get(expense.categoryId);
    const createdBy = this.users.get(expense.createdById);
    
    if (!category || !createdBy) return undefined;
    
    const allSplits = Array.from(this.splits.values())
      .filter(split => split.expenseId === id)
      .map(split => {
        const user = this.users.get(split.userId);
        return user ? { ...split, user } : undefined;
      })
      .filter((split): split is (Split & { user: User }) => split !== undefined);

    return {
      ...expense,
      category,
      createdBy,
      splits: allSplits,
    };
  }

  async getExpensesByUserId(userId: number): Promise<Expense[]> {
    // Get all expenses created by this user
    const userExpenses = Array.from(this.expenses.values())
      .filter(expense => expense.createdById === userId);
    
    // Get all expenses where this user is part of a split
    const splitExpenseIds = Array.from(this.splits.values())
      .filter(split => split.userId === userId)
      .map(split => split.expenseId);
    
    const splitExpenses = Array.from(this.expenses.values())
      .filter(expense => splitExpenseIds.includes(expense.id));
    
    // Combine and deduplicate
    const allExpenses = [...userExpenses, ...splitExpenses];
    const uniqueExpenses = Array.from(new Map(allExpenses.map(expense => [expense.id, expense])).values());
    
    return uniqueExpenses;
  }

  async createExpense(insertExpense: InsertExpense): Promise<Expense> {
    const id = this.expenseIdCounter++;
    const expense: Expense = { ...insertExpense, id };
    this.expenses.set(id, expense);
    return expense;
  }

  // Roommate methods
  async getRoommates(): Promise<Roommate[]> {
    return Array.from(this.roommates.values());
  }

  async getRoommatesByHouseholdId(householdId: number): Promise<RoommateWithUser[]> {
    const householdRoommates = Array.from(this.roommates.values())
      .filter(roommate => roommate.householdId === householdId);

    const roommatesWithUser = householdRoommates.map(roommate => {
      const user = this.users.get(roommate.userId);
      if (!user) return undefined;

      // Calculate owed amount
      const owedSplits = Array.from(this.splits.values())
        .filter(split => split.userId === user.id && !split.isPaid);
      
      const owedAmount = owedSplits.reduce((sum, split) => sum + split.amount, 0);

      return {
        ...roommate,
        user,
        owedAmount,
      };
    }).filter((roommate): roommate is RoommateWithUser => roommate !== undefined);

    return roommatesWithUser;
  }

  async createRoommate(insertRoommate: InsertRoommate): Promise<Roommate> {
    const id = this.roommateIdCounter++;
    const roommate: Roommate = { ...insertRoommate, id };
    this.roommates.set(id, roommate);
    return roommate;
  }

  // Household methods
  async getHouseholds(): Promise<Household[]> {
    return Array.from(this.households.values());
  }

  async getHouseholdById(id: number): Promise<Household | undefined> {
    return this.households.get(id);
  }

  async createHousehold(insertHousehold: InsertHousehold): Promise<Household> {
    const id = this.householdIdCounter++;
    const household: Household = { ...insertHousehold, id };
    this.households.set(id, household);
    return household;
  }

  // Split methods
  async getSplitsByExpenseId(expenseId: number): Promise<Split[]> {
    return Array.from(this.splits.values())
      .filter(split => split.expenseId === expenseId);
  }

  async getSplitsByUserId(userId: number): Promise<SplitWithDetails[]> {
    const userSplits = Array.from(this.splits.values())
      .filter(split => split.userId === userId);
    
    const splitsWithDetails = userSplits.map(split => {
      const expense = this.expenses.get(split.expenseId);
      const user = this.users.get(split.userId);
      
      if (!expense || !user) return undefined;
      
      return {
        ...split,
        expense,
        user,
      };
    }).filter((split): split is SplitWithDetails => split !== undefined);
    
    return splitsWithDetails;
  }

  async createSplit(insertSplit: InsertSplit): Promise<Split> {
    const id = this.splitIdCounter++;
    const split: Split = { ...insertSplit, id };
    this.splits.set(id, split);
    return split;
  }

  async updateSplitPaymentStatus(id: number, isPaid: boolean): Promise<Split | undefined> {
    const split = this.splits.get(id);
    if (!split) return undefined;
    
    const updatedSplit: Split = { ...split, isPaid };
    this.splits.set(id, updatedSplit);
    return updatedSplit;
  }
}

export const storage = new MemStorage();
