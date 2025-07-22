const { createServer } = require('http');
const { readFile, existsSync } = require('fs');
const { join } = require('path');

// __dirname is available in CommonJS

// Simple in-memory storage for orders
let orders = [];
let nextOrderId = 1;

// All prices are already in Indian Rupees (INR)
function formatINRPrice(inrPrice) {
  return Math.round(parseFloat(inrPrice) * 100) / 100; // Round to 2 decimal places
}

const server = createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // API Routes
  if (url.pathname.startsWith('/api/')) {
    res.setHeader('Content-Type', 'application/json');
    
    if (url.pathname === '/api/orders' && req.method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', () => {
        try {
          const orderData = JSON.parse(body);
          
          // Format prices (already in INR)
          if (orderData.items) {
            orderData.items.forEach(item => {
              if (item.price) {
                item.priceInr = formatINRPrice(item.price);
              }
            });
          }
          
          // Ensure totalAmount is properly formatted in INR
          if (orderData.totalAmount) {
            orderData.totalAmount = formatINRPrice(orderData.totalAmount);
          }
          
          const order = {
            id: nextOrderId++,
            ...orderData,
            status: 'pending',
            createdAt: new Date().toISOString(),
            currency: 'INR'
          };
          
          orders.push(order);
          console.log('Order created:', order);
          
          res.writeHead(200);
          res.end(JSON.stringify({ success: true, order }));
        } catch (error) {
          console.error('Error creating order:', error);
          res.writeHead(400);
          res.end(JSON.stringify({ error: 'Invalid order data' }));
        }
      });
      return;
    }
    
    if (url.pathname === '/api/orders' && req.method === 'GET') {
      res.writeHead(200);
      res.end(JSON.stringify(orders));
      return;
    }
    
    if (url.pathname.startsWith('/api/orders/') && req.method === 'GET') {
      const orderId = parseInt(url.pathname.split('/')[3]);
      const order = orders.find(o => o.id === orderId);
      
      if (order) {
        res.writeHead(200);
        res.end(JSON.stringify(order));
      } else {
        res.writeHead(404);
        res.end(JSON.stringify({ error: 'Order not found' }));
      }
      return;
    }
    
    // Health check
    if (url.pathname === '/api/health') {
      res.writeHead(200);
      res.end(JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }));
      return;
    }
  }
  
  // Serve the React frontend for all non-API routes
  const filePath = join(__dirname, '../client/index.html');
  if (existsSync(filePath)) {
    readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(500);
        res.end('Error loading frontend');
        return;
      }
      res.setHeader('Content-Type', 'text/html');
      res.writeHead(200);
      res.end(content);
    });
    return;
  }
  
  // For other static files, return 404 for now
  res.writeHead(404);
  res.end('Static file serving disabled - using API-only mode');
});

const PORT = 5000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
  console.log(`💰 Currency: Indian Rupees (INR)`);
  console.log(`📊 Admin panel available`);
  console.log(`📦 Orders storage: In-memory (temporary)`);
});