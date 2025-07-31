import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Simple in-memory storage
const storage = {
  orders: [],
  nextOrderId: 1
};

// Add CORS headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Log requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

// Create order
app.post("/api/orders", (req, res) => {
  try {
    console.log("Creating order:", req.body);
    const order = {
      id: storage.nextOrderId++,
      ...req.body,
      status: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    storage.orders.push(order);
    console.log("Order created:", order);
    res.json({ success: true, order });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
});

// Get all orders
app.get("/api/orders", (req, res) => {
  res.json(storage.orders);
});

// File upload endpoint
app.post("/api/upload", (req, res) => {
  try {
    const { fileName, fileSize, fileType } = req.body;
    console.log(`Processing file: ${fileName}, Size: ${fileSize} bytes`);
    
    // Calculate estimated pages
    let estimatedPages = 1;
    const sizeInKB = fileSize / 1024;
    
    if (fileType === 'application/pdf') {
      estimatedPages = Math.max(1, Math.ceil(sizeInKB / 200));
    } else if (fileType?.includes('word')) {
      estimatedPages = Math.max(1, Math.ceil(sizeInKB / 100));
    } else if (fileType?.includes('image')) {
      estimatedPages = 1;
    } else {
      estimatedPages = Math.max(1, Math.ceil(sizeInKB / 150));
    }
    
    const fileInfo = {
      fileName,
      fileSize,
      fileType: fileType || 'unknown',
      estimatedPages,
      uploadedAt: new Date().toISOString()
    };
    
    res.json({ success: true, message: "File processed", file: fileInfo });
  } catch (error) {
    console.error("Error processing file:", error);
    res.status(500).json({ error: "Failed to process file" });
  }
});

// Serve static files from client/public
const clientPath = path.resolve(__dirname, '..', 'client');
app.use(express.static(path.join(clientPath, 'public')));

// Catch-all handler for SPA
app.get('*', (req, res) => {
  const indexPath = path.join(clientPath, 'index.html');
  res.sendFile(indexPath);
});

const server = createServer(app);
const port = 5000;

server.listen(port, '0.0.0.0', () => {
  console.log(`🚀 PrintLite server running on port ${port}`);
  console.log(`🔗 Local: http://localhost:${port}`);
  console.log(`🌐 Network: http://0.0.0.0:${port}`);
  console.log(`📊 API Health: http://localhost:${port}/api/health`);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  server.close(() => {
    console.log('👋 Server shut down successfully');
    process.exit(0);
  });
});

export default app;