import { pgTable, text, serial, integer, boolean, decimal, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  customerName: text("customer_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("pending"), // pending, processing, printing, shipped, delivered
  totalPages: integer("total_pages").notNull(),
  printType: text("print_type").notNull(), // color, black_white
  paperSize: text("paper_size").notNull(), // A4, A3, etc
  paperType: text("paper_type").notNull(), // 70gsm, 90gsm, 120gsm
  sides: text("sides").notNull(), // single, double
  binding: text("binding"), // none, spiral, staple
  copies: integer("copies").notNull().default(1),
  deliveryAddress: text("delivery_address").notNull(),
  paymentMethod: text("payment_method").notNull(), // upi, card, cash
  paymentStatus: text("payment_status").notNull().default("pending"), // pending, completed, failed
  fileNames: json("file_names").$type<string[]>().notNull(), // Array of uploaded file names
  specialInstructions: text("special_instructions"),
  userId: integer("user_id"), // Optional - only if user is logged in
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  orders: many(orders),
}));

export const ordersRelations = relations(orders, ({ one }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
}));

// Schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
}).partial();

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;
export type UpdateOrder = z.infer<typeof updateOrderSchema>;
