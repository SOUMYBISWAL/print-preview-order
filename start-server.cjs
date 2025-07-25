#!/usr/bin/env node

// Simple HTTP server using Node.js built-in modules to bypass dependency issues
const http = require('http');
const url = require('url');
const path = require('path');
const fs = require('fs');

// Sample orders data for testing admin panel and API functionality
const sampleOrders = [
  {
    id: 'ORDER001',
    customerName: 'Priya Sharma',
    mobile: '9876543210',
    email: 'priya.sharma@email.com',
    address: '123 MG Road, Bangalore, Karnataka 560001',
    files: [
      { name: 'resume.pdf', pages: 3, settings: { paperType: '70 GSM', color: 'black', sides: 'single', copies: 2 } }
    ],
    totalAmount: '₹15',
    status: 'pending',
    orderDate: '2025-01-15',
    deliveryType: 'home'
  },
  {
    id: 'ORDER002',
    customerName: 'Rahul Verma',
    mobile: '9123456789',
    email: 'rahul.verma@email.com',
    address: '456 Park Street, Kolkata, West Bengal 700016',
    files: [
      { name: 'presentation.pptx', pages: 15, settings: { paperType: '90 GSM', color: 'color', sides: 'double', copies: 1 } }
    ],
    totalAmount: '₹45',
    status: 'processing',
    orderDate: '2025-01-16',
    deliveryType: 'pickup'
  },
  {
    id: 'ORDER003',
    customerName: 'Anjali Gupta',
    mobile: '9988776655',
    email: 'anjali.gupta@email.com',
    address: '789 Connaught Place, New Delhi, Delhi 110001',
    files: [
      { name: 'thesis.docx', pages: 50, settings: { paperType: '120 GSM', color: 'black', sides: 'double', copies: 3 } }
    ],
    totalAmount: '₹225',
    status: 'completed',
    orderDate: '2025-01-14',
    deliveryType: 'home'
  }
];

function parseBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(body));
      } catch (e) {
        resolve({});
      }
    });
  });
}

function sendJSON(res, data, status = 200) {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  });
  res.end(JSON.stringify(data));
}

function handleCORS(req, res) {
  if (req.method === 'OPTIONS') {
    res.writeHead(200, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    });
    res.end();
    return true;
  }
  return false;
}

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  
  // Handle CORS preflight
  if (handleCORS(req, res)) return;

  console.log(`${req.method} ${pathname}`);

  // API Routes
  if (pathname === '/api/health') {
    sendJSON(res, { status: 'OK', message: 'PrintLite server is running' });
  }
  else if (pathname === '/api/orders' && req.method === 'GET') {
    sendJSON(res, sampleOrders);
  }
  else if (pathname === '/api/orders' && req.method === 'POST') {
    const body = await parseBody(req);
    const order = {
      id: `ORDER${String(sampleOrders.length + 1).padStart(3, '0')}`,
      ...body,
      orderDate: new Date().toISOString().split('T')[0],
      status: 'pending'
    };
    sampleOrders.push(order);
    sendJSON(res, { success: true, orderId: order.id });
  }
  else if (pathname.startsWith('/api/orders/') && req.method === 'GET') {
    const orderId = pathname.split('/')[3];
    const order = sampleOrders.find(o => o.id === orderId);
    if (order) {
      sendJSON(res, order);
    } else {
      sendJSON(res, { error: 'Order not found' }, 404);
    }
  }
  else if (pathname.startsWith('/api/orders/') && req.method === 'PATCH') {
    const orderId = pathname.split('/')[3];
    const body = await parseBody(req);
    const orderIndex = sampleOrders.findIndex(o => o.id === orderId);
    if (orderIndex !== -1) {
      sampleOrders[orderIndex] = { ...sampleOrders[orderIndex], ...body };
      sendJSON(res, { success: true, order: sampleOrders[orderIndex] });
    } else {
      sendJSON(res, { error: 'Order not found' }, 404);
    }
  }
  else if (pathname === '/api/admin/login' && req.method === 'POST') {
    const body = await parseBody(req);
    const { mobile, password } = body;
    if (mobile === '9876543210' && password === 'admin123') {
      sendJSON(res, { success: true, message: 'Login successful' });
    } else {
      sendJSON(res, { success: false, message: 'Invalid credentials' }, 401);
    }
  }
  // Default route for non-API requests
  else {
    sendJSON(res, { 
      message: 'PrintLite API Server - Migration Mode',
      version: '1.0.0',
      endpoints: [
        'GET /api/health',
        'GET /api/orders',
        'POST /api/orders',
        'GET /api/orders/:id',
        'PATCH /api/orders/:id',
        'POST /api/admin/login'
      ],
      adminCredentials: {
        mobile: '9876543210',
        password: 'admin123'
      }
    });
  }
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ PrintLite server started successfully`);
  console.log(`🌐 Server running on http://0.0.0.0:${PORT}`);
  console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📊 Sample orders loaded: ${sampleOrders.length}`);
  console.log(`🔐 Admin credentials - Mobile: 9876543210, Password: admin123`);
  console.log(`📡 API endpoints ready:`);
  console.log(`   GET  /api/health`);
  console.log(`   GET  /api/orders`);
  console.log(`   POST /api/orders`);
  console.log(`   POST /api/admin/login`);
});