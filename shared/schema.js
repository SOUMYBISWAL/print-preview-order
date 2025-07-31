import { z } from "zod";

// Order schema for validation
export const insertOrderSchema = z.object({
  customerName: z.string().min(1, "Customer name is required"),
  customerEmail: z.string().email("Valid email is required"),
  customerPhone: z.string().min(10, "Valid phone number is required"),
  deliveryAddress: z.string().min(10, "Delivery address is required"),
  files: z.array(z.object({
    fileName: z.string(),
    fileSize: z.number(),
    fileType: z.string().optional(),
    estimatedPages: z.number().min(1)
  })).min(1, "At least one file is required"),
  printSettings: z.object({
    paperType: z.enum(["70GSM", "90GSM", "120GSM"]),
    colorOption: z.enum(["black-white", "color"]),
    printSides: z.enum(["single", "double"]),
    bindingOption: z.enum(["none", "spiral", "staple"]),
    copies: z.number().min(1).max(100)
  }),
  totalPages: z.number().min(1),
  totalPrice: z.number().min(0),
  status: z.enum(["pending", "processing", "printing", "shipped", "delivered"]).default("pending")
});

export const updateOrderSchema = z.object({
  customerName: z.string().min(1).optional(),
  customerEmail: z.string().email().optional(),
  customerPhone: z.string().min(10).optional(),
  deliveryAddress: z.string().min(10).optional(),
  status: z.enum(["pending", "processing", "printing", "shipped", "delivered"]).optional(),
  totalPrice: z.number().min(0).optional()
});

// User schema for validation
export const insertUserSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Valid email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["user", "admin"]).default("user")
});

export const updateUserSchema = z.object({
  username: z.string().min(3).optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
  role: z.enum(["user", "admin"]).optional()
});

// Print settings schema
export const printSettingsSchema = z.object({
  paperType: z.enum(["70GSM", "90GSM", "120GSM"]),
  colorOption: z.enum(["black-white", "color"]),
  printSides: z.enum(["single", "double"]),
  bindingOption: z.enum(["none", "spiral", "staple"]),
  copies: z.number().min(1).max(100)
});

// File upload schema
export const fileUploadSchema = z.object({
  fileName: z.string().min(1),
  fileSize: z.number().min(1),
  fileType: z.string().optional(),
  estimatedPages: z.number().min(1)
});