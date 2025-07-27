import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import path from "path";
import { promises as fs } from "fs";
import { storage } from "./storage";
import { insertOrderSchema, updateOrderSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Order management routes
  
  // Create a new order (for guest users and logged-in users)
  app.post("/api/orders", async (req, res) => {
    console.log("POST /api/orders called with body:", req.body);
    console.log("Headers:", req.headers);
    
    try {
      const orderData = insertOrderSchema.parse(req.body);
      const order = await storage.createOrder(orderData);
      console.log("Order created successfully:", order);
      res.json({ success: true, order });
    } catch (error) {
      console.error("Error creating order:", error);
      if (error instanceof z.ZodError) {
        console.error("Validation errors:", error.errors);
        res.status(400).json({ error: "Invalid order data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create order" });
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

  // Configure multer for file uploads
  const storage_config = multer.diskStorage({
    destination: async (req, file, cb) => {
      const uploadDir = path.join(process.cwd(), 'uploads');
      try {
        await fs.mkdir(uploadDir, { recursive: true });
        cb(null, uploadDir);
      } catch (error) {
        cb(error instanceof Error ? error : new Error('Failed to create upload directory'), uploadDir);
      }
    },
    filename: (req, file, cb) => {
      // Generate unique filename
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = path.extname(file.originalname);
      const name = path.basename(file.originalname, ext);
      cb(null, `${name}-${uniqueSuffix}${ext}`);
    }
  });

  const upload = multer({
    storage: storage_config,
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB limit
    },
    fileFilter: (req, file, cb) => {
      // Check file type
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'image/bmp',
        'image/webp',
        'text/plain'
      ];
      
      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('File type not supported'));
      }
    }
  });

  // File upload endpoint
  app.post('/api/upload', upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const fileData = {
        key: `uploads/${req.file.filename}`,
        name: req.file.originalname,
        size: req.file.size,
        type: req.file.mimetype,
        path: req.file.path,
        uploadedAt: new Date().toISOString()
      };

      res.json({
        success: true,
        file: fileData,
        key: fileData.key
      });

    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ 
        error: 'Failed to upload file',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Download uploaded files
  app.get('/api/uploads/:filename', async (req, res) => {
    try {
      const filename = req.params.filename;
      const filePath = path.join(process.cwd(), 'uploads', filename);
      
      // Check if file exists
      await fs.access(filePath);
      
      // Send file
      res.sendFile(filePath);
      
    } catch (error) {
      console.error('Download error:', error);
      res.status(404).json({ error: 'File not found' });
    }
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
