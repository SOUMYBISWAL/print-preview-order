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

  // For development, serve the client files directly
  if (pathname === '/' || pathname === '/index.html') {
    const indexPath = path.join(__dirname, 'client/index.html');
    fs.readFile(indexPath, 'utf-8', (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end('Server error loading index.html');
        return;
      }
      
      // Simple HTML for development that shows the working backend
      const devHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PrintLite - Online Printing Service</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 1200px; margin: 0 auto; padding: 20px; }
        .header { background: #2563eb; color: white; padding: 20px; border-radius: 8px; text-align: center; }
        .status { background: #10b981; color: white; padding: 10px; border-radius: 4px; margin: 20px 0; }
        .api-test { background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .currency { color: #059669; font-weight: bold; }
        button { background: #2563eb; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; }
        .orders { background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🖨️ PrintLite - Online Printing Service</h1>
        <p>Professional document printing with doorstep delivery</p>
    </div>
    
    <div class="status">
        ✅ Backend Server Running Successfully on Port 5000
    </div>
    
    <div class="api-test">
        <h2>🔧 Backend API Status</h2>
        <p><strong>Currency:</strong> <span class="currency">Indian Rupees (INR) ₹</span></p>
        <p><strong>Admin Credentials:</strong> Mobile: 9876543210, Password: admin123</p>
        
        <h3>Available API Endpoints:</h3>
        <ul>
            <li>GET /api/health - Server status</li>
            <li>GET /api/orders - List all orders</li>
            <li>POST /api/orders - Create new order</li>
            <li>POST /api/admin/login - Admin authentication</li>
            <li>POST /api/calculate-price - Price calculation</li>
        </ul>
        
        <button onclick="testAPI()">Test API Connection</button>
        <button onclick="loadOrders()">Load Sample Orders</button>
        <div id="api-result"></div>
    </div>
    
    <div class="orders">
        <h2>📋 Sample Orders</h2>
        <div id="orders-list">Click "Load Sample Orders" to view orders</div>
    </div>
    
    <script>
        async function testAPI() {
            try {
                const response = await fetch('/api/health');
                const data = await response.json();
                document.getElementById('api-result').innerHTML = 
                    '<div style="background: #10b981; color: white; padding: 10px; margin: 10px 0; border-radius: 4px;">' +
                    'API Test Successful! Status: ' + data.status + ' | Currency: ' + data.currency +
                    '</div>';
            } catch (error) {
                document.getElementById('api-result').innerHTML = 
                    '<div style="background: #ef4444; color: white; padding: 10px; margin: 10px 0; border-radius: 4px;">' +
                    'API Test Failed: ' + error.message +
                    '</div>';
            }
        }
        
        async function loadOrders() {
            try {
                const response = await fetch('/api/orders');
                const orders = await response.json();
                let html = '<h3>Orders (₹ INR Currency):</h3>';
                orders.forEach(order => {
                    html += '<div style="border: 1px solid #e5e7eb; padding: 15px; margin: 10px 0; border-radius: 4px;">';
                    html += '<strong>Order #' + order.orderNumber + '</strong><br>';
                    html += 'Customer: ' + order.customerName + '<br>';
                    html += 'Amount: ₹' + order.totalAmount + ' (' + order.currency + ')<br>';
                    html += 'Status: ' + order.status + '<br>';
                    html += 'Files: ' + order.fileNames.join(', ') + '<br>';
                    html += '</div>';
                });
                document.getElementById('orders-list').innerHTML = html;
            } catch (error) {
                document.getElementById('orders-list').innerHTML = 
                    '<div style="color: red;">Error loading orders: ' + error.message + '</div>';
            }
        }
    </script>
</body>
</html>`;
      
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(devHtml);
    });
    return;
  }

  // Handle other static files if needed
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found', message: 'Frontend development server running' }));
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