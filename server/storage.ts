import { users, orders, type User, type InsertUser, type Order, type InsertOrder, type UpdateOrder } from "../shared/schema.js";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Order management
  createOrder(order: InsertOrder): Promise<Order>;
  getOrder(id: number): Promise<Order | undefined>;
  getAllOrders(): Promise<Order[]>;
  getUserOrders(userId: number): Promise<Order[]>;
  updateOrder(id: number, updates: UpdateOrder): Promise<Order | undefined>;
  deleteOrder(id: number): Promise<boolean>;
}

import { db } from "./db";
import { eq } from "drizzle-orm";

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    if (!db) throw new Error("Database not initialized");
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    if (!db) throw new Error("Database not initialized");
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    if (!db) throw new Error("Database not initialized");
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Order management methods
  async createOrder(order: InsertOrder): Promise<Order> {
    if (!db) throw new Error("Database not initialized");
    const [newOrder] = await db
      .insert(orders)
      .values({
        ...order,
        updatedAt: new Date(),
      })
      .returning();
    return newOrder;
  }

  async getOrder(id: number): Promise<Order | undefined> {
    if (!db) throw new Error("Database not initialized");
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order || undefined;
  }

  async getAllOrders(): Promise<Order[]> {
    if (!db) throw new Error("Database not initialized");
    return await db.select().from(orders).orderBy(orders.createdAt);
  }

  async getUserOrders(userId: number): Promise<Order[]> {
    if (!db) throw new Error("Database not initialized");
    return await db.select().from(orders).where(eq(orders.userId, userId)).orderBy(orders.createdAt);
  }

  async updateOrder(id: number, updates: UpdateOrder): Promise<Order | undefined> {
    if (!db) throw new Error("Database not initialized");
    const [updatedOrder] = await db
      .update(orders)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(orders.id, id))
      .returning();
    return updatedOrder || undefined;
  }

  async deleteOrder(id: number): Promise<boolean> {
    if (!db) throw new Error("Database not initialized");
    const result = await db.delete(orders).where(eq(orders.id, id));
    return (result.rowCount || 0) > 0;
  }
}

// Temporarily using MemStorage due to database connection issues
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private orders: Map<number, Order>;
  currentUserId: number;
  currentOrderId: number;

  constructor() {
    this.users = new Map();
    this.orders = new Map();
    this.currentUserId = 1;
    this.currentOrderId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Order management methods
  async createOrder(order: InsertOrder): Promise<Order> {
    const id = this.currentOrderId++;
    const newOrder: Order = {
      ...order,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.orders.set(id, newOrder);
    return newOrder;
  }

  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async getAllOrders(): Promise<Order[]> {
    return Array.from(this.orders.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getUserOrders(userId: number): Promise<Order[]> {
    return Array.from(this.orders.values())
      .filter(order => order.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async updateOrder(id: number, updates: UpdateOrder): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;
    
    const updatedOrder: Order = {
      ...order,
      ...updates,
      updatedAt: new Date(),
    };
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }

  async deleteOrder(id: number): Promise<boolean> {
    return this.orders.delete(id);
  }
}

export const storage = new MemStorage();
