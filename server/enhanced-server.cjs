const { createServer } = require('http');
const { readFile, existsSync } = require('fs');
const { join } = require('path');
const { parse } = require('url');

// Simple in-memory storage for orders
let orders = [];
let nextOrderId = 1;

// AWS S3 configuration (if available)
const AWS_CONFIG = {
  accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
  region: process.env.AWS_S3_REGION || 'ap-south-1',
  bucketName: process.env.AWS_S3_BUCKET_NAME || 'uploadedfile25'
};

// Check if AWS credentials are available
const isS3Available = AWS_CONFIG.accessKeyId && AWS_CONFIG.secretAccessKey;

// All prices are already in Indian Rupees (INR)
function formatINRPrice(inrPrice) {
  return Math.round(parseFloat(inrPrice) * 100) / 100; // Round to 2 decimal places
}

// Parse JSON body from request
function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(error);
      }
    });
  });
}

const server = createServer(async (req, res) => {
  const url = parse(req.url, true);
  
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
    
    // Health check
    if (url.pathname === '/api/health') {
      res.writeHead(200);
      res.end(JSON.stringify({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        s3Available: isS3Available,
        region: AWS_CONFIG.region,
        bucket: AWS_CONFIG.bucketName
      }));
      return;
    }

    // S3 configuration endpoint
    if (url.pathname === '/api/s3-config' && req.method === 'GET') {
      res.writeHead(200);
      res.end(JSON.stringify({
        available: isS3Available,
        region: AWS_CONFIG.region,
        bucket: AWS_CONFIG.bucketName,
        configured: !!process.env.AWS_S3_ACCESS_KEY_ID
      }));
      return;
    }
    
    // Orders endpoints
    if (url.pathname === '/api/orders' && req.method === 'POST') {
      try {
        const orderData = await parseBody(req);
        
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

    // File upload endpoint (placeholder for S3 integration)
    if (url.pathname === '/api/upload' && req.method === 'POST') {
      res.writeHead(200);
      res.end(JSON.stringify({
        success: true,
        message: 'File upload configured for S3',
        s3Available: isS3Available,
        bucket: AWS_CONFIG.bucketName
      }));
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
  console.log(`☁️  S3 Storage: ${isS3Available ? 'Configured' : 'Not configured'}`);
  if (isS3Available) {
    console.log(`📁 S3 Bucket: ${AWS_CONFIG.bucketName} (${AWS_CONFIG.region})`);
  }
});