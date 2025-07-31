import { createServer } from "http";
import { storage } from "./storage.js";
// import { insertOrderSchema, updateOrderSchema } from "../shared/schema.js";
// import { z } from "zod";

// Simple validation schemas without zod
const insertOrderSchema = {
  parse: (data) => {
    if (!data.customerName || !data.customerEmail || !data.files || data.files.length === 0) {
      throw new Error("Missing required fields");
    }
    return data;
  }
};

const updateOrderSchema = {
  parse: (data) => data
};

export async function registerRoutes(app) {
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
      if (error.message === "Missing required fields") {
        console.error("Validation errors:", error.message);
        res.status(400).json({ error: "Invalid order data", details: error.message });
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

  // Update order status (for admin panel)
  app.patch("/api/orders/:id", async (req, res) => {
    try {
      const orderId = parseInt(req.params.id);
      if (isNaN(orderId)) {
        return res.status(400).json({ error: "Invalid order ID" });
      }

      const updateData = updateOrderSchema.parse(req.body);
      const updated = await storage.updateOrder(orderId, updateData);
      
      if (!updated) {
        return res.status(404).json({ error: "Order not found" });
      }
      
      res.json({ success: true, order: updated });
    } catch (error) {
      console.error("Error updating order:", error);
      if (error.message === "Missing required fields") {
        res.status(400).json({ error: "Invalid update data", details: error.message });
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

      res.json({ success: true, message: "Order deleted" });
    } catch (error) {
      console.error("Error deleting order:", error);
      res.status(500).json({ error: "Failed to delete order" });
    }
  });

  // File upload endpoint - calculates pages
  app.post("/api/upload", async (req, res) => {
    try {
      // Extract file information from the request
      const { fileName, fileSize, fileType } = req.body;
      
      if (!fileName || !fileSize) {
        return res.status(400).json({ error: "Missing fileName or fileSize" });
      }

      console.log(`Processing file: ${fileName}, Size: ${fileSize} bytes, Type: ${fileType}`);

      // Calculate estimated pages based on file type and size
      let estimatedPages = 1;
      const sizeInKB = fileSize / 1024;

      if (fileType === 'application/pdf') {
        // PDF: ~200KB per page (more realistic estimate)
        estimatedPages = Math.max(1, Math.ceil(sizeInKB / 200));
      } else if (fileType?.includes('word') || fileName.toLowerCase().endsWith('.docx') || fileName.toLowerCase().endsWith('.doc')) {
        // Word documents: ~100KB per page
        estimatedPages = Math.max(1, Math.ceil(sizeInKB / 100));
      } else if (fileType?.includes('image') || /\.(jpg|jpeg|png|gif|bmp)$/i.test(fileName)) {
        // Images: 1 page per file
        estimatedPages = 1;
      } else if (fileType?.includes('text') || fileName.toLowerCase().endsWith('.txt')) {
        // Text files: ~5KB per page
        estimatedPages = Math.max(1, Math.ceil(sizeInKB / 5));
      } else {
        // Other documents: ~150KB per page
        estimatedPages = Math.max(1, Math.ceil(sizeInKB / 150));
      }

      console.log(`Estimated pages for ${fileName}: ${estimatedPages}`);

      const fileInfo = {
        fileName,
        fileSize,
        fileType: fileType || 'unknown',
        estimatedPages,
        uploadedAt: new Date().toISOString()
      };

      res.json({
        success: true,
        message: "File information processed successfully",
        file: fileInfo
      });
    } catch (error) {
      console.error("Error processing file upload:", error);
      res.status(500).json({ error: "Failed to process file upload" });
    }
  });

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "healthy", timestamp: new Date().toISOString() });
  });

  // Admin login endpoint (simple authentication)
  app.post("/api/admin/login", (req, res) => {
    const { username, password } = req.body;
    
    // Simple hardcoded admin credentials for demo
    if (username === "admin" && password === "admin123") {
      res.json({ success: true, message: "Admin logged in successfully", role: "admin" });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  });

  // User registration endpoint (simple)
  app.post("/api/register", async (req, res) => {
    const { username, password, email } = req.body;
    
    try {
      // Simple registration - in a real app, you'd hash passwords and store in DB
      const user = {
        id: Date.now(),
        username,
        email,
        createdAt: new Date().toISOString()
      };
      
      res.json({ success: true, user: { id: user.id, username: user.username, email: user.email } });
    } catch (error) {
      console.error("Error registering user:", error);
      res.status(500).json({ error: "Registration failed" });
    }
  });

  // User login endpoint (simple)
  app.post("/api/login", async (req, res) => {
    const { username, password } = req.body;
    
    try {
      // Simple login - in a real app, you'd verify against stored credentials
      if (username && password) {
        const user = {
          id: Date.now(),
          username,
          loginAt: new Date().toISOString()
        };
        
        res.json({ success: true, user });
      } else {
        res.status(401).json({ error: "Invalid credentials" });
      }
    } catch (error) {
      console.error("Error logging in user:", error);
      res.status(500).json({ error: "Login failed" });
    }
  });

  return createServer(app);
}