#!/usr/bin/env node

/**
 * PrintLite Simple HTTP Server
 * Uses built-in Node.js HTTP module to avoid dependency issues
 */

const http = require('http');
const path = require('path');
const fs = require('fs');
const url = require('url');

const PORT = process.env.PORT || 5000;

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
    totalAmount: 70.8,
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
    totalAmount: 177,
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
    totalAmount: 177,
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

// Helper function to parse JSON from request
function parseJsonBody(req, callback) {
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });
  req.on('end', () => {
    try {
      const jsonData = body ? JSON.parse(body) : {};
      callback(null, jsonData);
    } catch (error) {
      callback(error, null);
    }
  });
}

// Set CORS headers
function setCORSHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

// Create HTTP server
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const { pathname, query } = parsedUrl;
  const method = req.method;

  // Set CORS headers for all requests
  setCORSHeaders(res);

  // Handle preflight requests
  if (method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // API Routes
  if (pathname === '/api/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'ok',
      message: 'PrintLite server is running',
      timestamp: new Date().toISOString(),
      currency: 'INR'
    }));
    return;
  }

  if (pathname === '/api/orders' && method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(sampleOrders));
    return;
  }

  if (pathname === '/api/orders' && method === 'POST') {
    parseJsonBody(req, (err, data) => {
      if (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
        return;
      }

      const newOrder = {
        id: `ORD${String(sampleOrders.length + 1).padStart(3, '0')}`,
        orderNumber: `PL2024${String(sampleOrders.length + 1).padStart(3, '0')}`,
        ...data,
        status: 'pending',
        paymentStatus: 'pending',
        createdBy: 'customer',
        createdAt: new Date().toISOString()
      };

      sampleOrders.push(newOrder);
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(newOrder));
    });
    return;
  }

  if (pathname.startsWith('/api/orders/') && method === 'GET') {
    const orderId = pathname.split('/').pop();
    const order = sampleOrders.find(o => o.id === orderId || o.orderNumber === orderId);
    
    if (!order) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Order not found' }));
      return;
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(order));
    return;
  }

  if (pathname === '/api/admin/login' && method === 'POST') {
    parseJsonBody(req, (err, data) => {
      if (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
        return;
      }

      const { mobile, password } = data;

      if (mobile === '9876543210' && password === 'admin123') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          user: {
            mobile: '9876543210',
            role: 'admin',
            name: 'Admin User'
          },
          token: 'admin-token-123'
        }));
      } else {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: false,
          error: 'Invalid credentials'
        }));
      }
    });
    return;
  }

  if (pathname === '/api/calculate-price' && method === 'POST') {
    parseJsonBody(req, (err, data) => {
      if (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
        return;
      }

      const { pages, copies, paperType, printType, paperQuality, sides } = data;

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

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        subtotal: Math.round(subtotal * 100) / 100,
        taxes: Math.round(taxes * 100) / 100,
        total: Math.round(total * 100) / 100,
        currency: 'INR',
        breakdown: `₹${pricePerPage.toFixed(2)} per page × ${pages} pages × ${copies} copies`
      }));
    });
    return;
  }

  // Serve static files from client build
  const staticPath = path.join(__dirname, 'client/dist', pathname === '/' ? 'index.html' : pathname);
  
  if (fs.existsSync(staticPath)) {
    const ext = path.extname(staticPath).toLowerCase();
    const contentTypeMap = {
      '.html': 'text/html',
      '.js': 'application/javascript',
      '.css': 'text/css',
      '.json': 'application/json',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.gif': 'image/gif',
      '.svg': 'image/svg+xml',
      '.ico': 'image/x-icon'
    };

    const contentType = contentTypeMap[ext] || 'application/octet-stream';
    
    fs.readFile(staticPath, (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end('File not found');
        return;
      }

      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    });
    return;
  }

  // Fallback to index.html for client-side routing
  const indexPath = path.join(__dirname, 'client/dist/index.html');
  if (fs.existsSync(indexPath)) {
    fs.readFile(indexPath, (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end('Server error');
        return;
      }

      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    });
  } else {
    res.writeHead(404);
    res.end('Application not built. Please run: npm run build');
  }
});

// Start server
server.listen(PORT, '0.0.0.0', () => {
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

module.exports = server;