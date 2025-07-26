#!/usr/bin/env node

/**
 * PrintLite Express Server
 * Simple CommonJS server to avoid tsx dependency issues
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from client build
app.use(express.static(path.join(__dirname, 'client/dist')));

// Sample data for development
const sampleOrders = [
  {
    id: 'ORD001',
    orderNumber: 'PL2024001',
    customerName: 'Rajesh Kumar',
    email: 'rajesh.kumar@example.com',
    phone: '9876543210',
    address: '123 MG Road, Bangalore, Karnataka 560001',
    paperType: 'A4',
    paperQuality: '70GSM',
    printType: 'blackwhite',
    sides: 'single',
    copies: 2,
    pricePerPage: 2,
    totalPages: 15,
    totalAmount: 70.8, // 15 * 2 * 2 + GST
    currency: 'INR',
    status: 'processing',
    paymentMethod: 'UPI',
    paymentStatus: 'completed',
    fileNames: ['resume.pdf', 'cover_letter.pdf'],
    specialInstructions: 'Please bind the documents together',
    createdBy: 'customer',
    createdAt: new Date('2024-01-15T10:30:00Z').toISOString()
  },
  {
    id: 'ORD002',
    orderNumber: 'PL2024002',
    customerName: 'Priya Sharma',
    email: 'priya.sharma@example.com',
    phone: '9876543211',
    address: '456 Park Street, Mumbai, Maharashtra 400001',
    paperType: 'A4',
    paperQuality: '90GSM',
    printType: 'color',
    sides: 'double',
    copies: 1,
    pricePerPage: 8,
    totalPages: 25,
    totalAmount: 177, // 25 * 8 * 1.2 * 0.7 + GST
    currency: 'INR',
    status: 'completed',
    paymentMethod: 'Card',
    paymentStatus: 'completed',
    fileNames: ['presentation.pptx'],
    specialInstructions: 'High quality color printing required',
    createdBy: 'customer',
    createdAt: new Date('2024-01-16T14:20:00Z').toISOString()
  },
  {
    id: 'ORD003',
    orderNumber: 'PL2024003',
    customerName: 'Amit Patel',
    email: 'amit.patel@example.com',
    phone: '9876543212',
    address: '789 SG Highway, Ahmedabad, Gujarat 380001',
    paperType: 'A4',
    paperQuality: '120GSM',
    printType: 'blackwhite',
    sides: 'single',
    copies: 5,
    pricePerPage: 2,
    totalPages: 10,
    totalAmount: 177, // 10 * 2 * 1.5 * 5 + GST
    currency: 'INR',
    status: 'pending',
    paymentMethod: 'UPI',
    paymentStatus: 'pending',
    fileNames: ['contract.pdf'],
    specialInstructions: 'Urgent - needed by tomorrow',
    createdBy: 'customer',
    createdAt: new Date('2024-01-17T09:15:00Z').toISOString()
  }
];

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'PrintLite server is running',
    timestamp: new Date().toISOString(),
    currency: 'INR'
  });
});

app.get('/api/orders', (req, res) => {
  res.json(sampleOrders);
});

app.get('/api/orders/:id', (req, res) => {
  const order = sampleOrders.find(o => o.id === req.params.id || o.orderNumber === req.params.id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }
  res.json(order);
});

app.post('/api/orders', (req, res) => {
  const newOrder = {
    id: `ORD${String(sampleOrders.length + 1).padStart(3, '0')}`,
    orderNumber: `PL2024${String(sampleOrders.length + 1).padStart(3, '0')}`,
    ...req.body,
    status: 'pending',
    paymentStatus: 'pending',
    createdBy: 'customer',
    createdAt: new Date().toISOString()
  };
  
  sampleOrders.push(newOrder);
  res.status(201).json(newOrder);
});

app.post('/api/admin/login', (req, res) => {
  const { mobile, password } = req.body;
  
  // Simple admin authentication
  if (mobile === '9876543210' && password === 'admin123') {
    res.json({ 
      success: true, 
      user: { 
        mobile: '9876543210', 
        role: 'admin',
        name: 'Admin User'
      },
      token: 'admin-token-123'
    });
  } else {
    res.status(401).json({ 
      success: false, 
      error: 'Invalid credentials' 
    });
  }
});

app.put('/api/orders/:id/status', (req, res) => {
  const order = sampleOrders.find(o => o.id === req.params.id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }
  
  order.status = req.body.status;
  res.json(order);
});

// File upload endpoint (simplified)
app.post('/api/upload', (req, res) => {
  // For development, just return success
  res.json({
    success: true,
    message: 'File uploaded successfully',
    fileName: 'sample-file.pdf',
    pages: 5
  });
});

// Calculate price endpoint
app.post('/api/calculate-price', (req, res) => {
  const { pages, copies, paperType, printType, paperQuality, sides } = req.body;
  
  // Pricing configuration (in INR)
  const PRICING_CONFIG = {
    paperType: { 'A4': 1.0, 'A3': 2.0, 'Letter': 1.0 },
    paperQuality: { '70GSM': 1.0, '90GSM': 1.2, '120GSM': 1.5 },
    printType: { 'blackwhite': 2.0, 'color': 8.0 },
    sides: { 'single': 1.0, 'double': 0.7 }
  };
  
  const TAX_RATE = 0.18; // 18% GST
  
  const basePrice = PRICING_CONFIG.printType[printType] || 2.0;
  const paperTypeMultiplier = PRICING_CONFIG.paperType[paperType] || 1.0;
  const paperQualityMultiplier = PRICING_CONFIG.paperQuality[paperQuality] || 1.0;
  const sidesMultiplier = PRICING_CONFIG.sides[sides] || 1.0;
  
  const pricePerPage = basePrice * paperTypeMultiplier * paperQualityMultiplier * sidesMultiplier;
  const subtotal = pricePerPage * pages * copies;
  const taxes = subtotal * TAX_RATE;
  const total = subtotal + taxes;
  
  res.json({
    subtotal: Math.round(subtotal * 100) / 100,
    taxes: Math.round(taxes * 100) / 100,
    total: Math.round(total * 100) / 100,
    currency: 'INR',
    breakdown: `₹${pricePerPage.toFixed(2)} per page × ${pages} pages × ${copies} copies`
  });
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, 'client/dist/index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send('Application not built. Please run: npm run build');
  }
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 PrintLite server running on port ${PORT}`);
  console.log(`📊 API endpoints available:`);
  console.log(`   GET  /api/health - Server status`);
  console.log(`   GET  /api/orders - List all orders`);
  console.log(`   POST /api/orders - Create new order`);
  console.log(`   POST /api/admin/login - Admin authentication`);
  console.log(`   POST /api/calculate-price - Price calculation`);
  console.log(`💰 Currency: Indian Rupees (INR)`);
  console.log(`🔐 Admin credentials: mobile=9876543210, password=admin123`);
});

module.exports = app;