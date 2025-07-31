import type { Express } from "express";
import { createServer, type Server } from "http";
// Removed multer and fs imports since local file uploads are disabled
import { storage } from "./storage";
import { insertOrderSchema, updateOrderSchema } from "../shared/schema.js";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Order management routes
  
  // Create a new order (for guest users and logged-in users)
  app.post("/api/orders", async (req, res) => {
    console.log("POST /api/orders called with body:", req.body);
    console.log("Headers:", req.headers);
    
    try {
      console.log("Validating order data:", req.body);
      const orderData = insertOrderSchema.parse(req.body);
      console.log("Order data validated successfully:", orderData);
      const order = await storage.createOrder(orderData);
      console.log("Order created successfully:", order);
      res.json({ success: true, order });
    } catch (error) {
      console.error("Error creating order:", error);
      console.error("Error details:", error instanceof Error ? error.message : error);
      if (error instanceof z.ZodError) {
        console.error("Validation errors:", error.errors);
        res.status(400).json({ error: "Invalid order data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create order", message: error instanceof Error ? error.message : "Unknown error" });
      }
    }
  });

  // Get all orders (for admin panel)
  app.get("/api/orders", async (req, res) => {
    try {
      const orders = await storage.getAllOrders();
      res.json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });

  // Get a specific order by ID
  app.get("/api/orders/:id", async (req, res) => {
    try {
      const orderId = parseInt(req.params.id);
      if (isNaN(orderId)) {
        return res.status(400).json({ error: "Invalid order ID" });
      }
      
      const order = await storage.getOrder(orderId);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      
      res.json(order);
    } catch (error) {
      console.error("Error fetching order:", error);
      res.status(500).json({ error: "Failed to fetch order" });
    }
  });

  // Get orders for a specific user (when user is logged in)
  app.get("/api/users/:userId/orders", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ error: "Invalid user ID" });
      }
      
      const orders = await storage.getUserOrders(userId);
      res.json(orders);
    } catch (error) {
      console.error("Error fetching user orders:", error);
      res.status(500).json({ error: "Failed to fetch user orders" });
    }
  });

  // Update order status (for admin panel)
  app.patch("/api/orders/:id", async (req, res) => {
    try {
      const orderId = parseInt(req.params.id);
      if (isNaN(orderId)) {
        return res.status(400).json({ error: "Invalid order ID" });
      }
      
      const updates = updateOrderSchema.parse(req.body);
      const updatedOrder = await storage.updateOrder(orderId, updates);
      
      if (!updatedOrder) {
        return res.status(404).json({ error: "Order not found" });
      }
      
      res.json({ success: true, order: updatedOrder });
    } catch (error) {
      console.error("Error updating order:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid update data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to update order" });
      }
    }
  });

  // Delete an order (for admin panel)
  app.delete("/api/orders/:id", async (req, res) => {
    try {
      const orderId = parseInt(req.params.id);
      if (isNaN(orderId)) {
        return res.status(400).json({ error: "Invalid order ID" });
      }
      
      const deleted = await storage.deleteOrder(orderId);
      if (!deleted) {
        return res.status(404).json({ error: "Order not found" });
      }
      
      res.json({ success: true, message: "Order deleted successfully" });
    } catch (error) {
      console.error("Error deleting order:", error);
      res.status(500).json({ error: "Failed to delete order" });
    }
  });

  // Order tracking by order ID (for guest users)
  app.get("/api/track/:orderId", async (req, res) => {
    try {
      const orderId = parseInt(req.params.orderId);
      if (isNaN(orderId)) {
        return res.status(400).json({ error: "Invalid order ID" });
      }
      
      const order = await storage.getOrder(orderId);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      
      // Return limited information for tracking
      const trackingInfo = {
        id: order.id,
        status: order.status,
        paymentStatus: order.paymentStatus,
        totalAmount: order.totalAmount,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt
      };
      
      res.json(trackingInfo);
    } catch (error) {
      console.error("Error tracking order:", error);
      res.status(500).json({ error: "Failed to track order" });
    }
  });

  // Simplified fallback upload endpoint (without local file storage)
  app.post('/api/upload', async (req, res) => {
    console.log('POST /api/upload fallback called');
    
    try {
      // This is a fallback that just returns mock data
      // In practice, AWS Amplify Storage should be used
      const mockFile = {
        key: `fallback-${Date.now()}`,
        name: 'fallback-file.pdf',
        size: 1024000,
        type: 'application/pdf',
        pages: 5
      };

      console.log('Fallback upload response:', mockFile);

      res.json({ 
        success: true, 
        message: 'Fallback upload - AWS Amplify Storage should be used',
        file: mockFile
      });

    } catch (error) {
      console.error('Error in fallback upload:', error);
      res.status(500).json({ 
        error: 'Upload failed', 
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // File download endpoint (disabled - AWS Amplify Storage handles this)
  app.get('/api/uploads/:filename', async (req, res) => {
    res.status(404).json({ 
      error: 'Local file downloads disabled - AWS Amplify Storage handles file access' 
    });
  });

  // Admin login endpoint
  app.post('/api/admin/login', async (req, res) => {
    try {
      const { mobile, password } = req.body;
      
      // Admin credentials: mobile=9876543210, password=admin123
      if (mobile === '9876543210' && password === 'admin123') {
        const admin = {
          id: 1,
          mobile: '9876543210',
          role: 'admin',
          name: 'Admin User'
        };
        res.json({ success: true, admin });
      } else {
        res.status(401).json({ error: 'Invalid credentials' });
      }
    } catch (error) {
      console.error('Admin login error:', error);
      res.status(500).json({ error: 'Login failed' });
    }
  });

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ 
      status: 'ok', 
      message: 'PrintLite backend server running',
      timestamp: new Date().toISOString()
    });
  });

  const httpServer = createServer(app);

  return httpServer;
}
