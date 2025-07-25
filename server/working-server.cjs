const { createServer } = require('http');
const { readFile, existsSync } = require('fs');
const { join } = require('path');
const { parse } = require('url');

// Enhanced in-memory storage with proper admin functionality
let orders = [];
let nextOrderId = 1;

// Add some sample orders for testing admin panel
const sampleOrders = [
  {
    id: 1,
    customerName: "Rahul Sharma",
    email: "rahul@example.com",
    phone: "+91 9876543210",
    totalAmount: 150.50,
    status: "pending",
    totalPages: 25,
    printType: "color",
    paperSize: "A4",
    paperType: "90gsm",
    sides: "double",
    binding: "spiral",
    copies: 2,
    deliveryAddress: "123 MG Road, Bangalore 560001",
    paymentMethod: "upi",
    paymentStatus: "completed",
    fileNames: ["document1.pdf", "presentation.pptx"],
    specialInstructions: "Please print in color with spiral binding",
    createdAt: new Date('2025-07-24T10:30:00.000Z').toISOString(),
    updatedAt: new Date('2025-07-24T10:30:00.000Z').toISOString(),
    currency: "INR"
  },
  {
    id: 2,
    customerName: "Priya Patel",
    email: "priya@example.com",
    phone: "+91 8765432109",
    totalAmount: 89.25,
    status: "processing",
    totalPages: 15,
    printType: "black_white",
    paperSize: "A4",
    paperType: "70gsm",
    sides: "single",
    binding: "staple",
    copies: 1,
    deliveryAddress: "456 Park Street, Mumbai 400001",
    paymentMethod: "card",
    paymentStatus: "completed",
    fileNames: ["report.pdf"],
    specialInstructions: "Urgent delivery required",
    createdAt: new Date('2025-07-25T08:15:00.000Z').toISOString(),
    updatedAt: new Date('2025-07-25T09:00:00.000Z').toISOString(),
    currency: "INR"
  },
  {
    id: 3,
    customerName: "Amit Kumar",
    email: "amit@example.com",
    phone: "+91 7654321098",
    totalAmount: 245.75,
    status: "delivered",
    totalPages: 50,
    printType: "color",
    paperSize: "A4",
    paperType: "120gsm",
    sides: "double",
    binding: "spiral",
    copies: 3,
    deliveryAddress: "789 Civil Lines, Delhi 110001",
    paymentMethod: "upi",
    paymentStatus: "completed",
    fileNames: ["brochure.pdf", "catalog.pdf"],
    specialInstructions: "High quality printing for presentation",
    createdAt: new Date('2025-07-23T14:20:00.000Z').toISOString(),
    updatedAt: new Date('2025-07-25T09:30:00.000Z').toISOString(),
    currency: "INR"
  }
];

// Initialize with sample orders
orders = [...sampleOrders];
nextOrderId = 4;

// AWS S3 configuration
const AWS_CONFIG = {
  accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
  region: process.env.AWS_S3_REGION || 'ap-south-1',
  bucketName: process.env.AWS_S3_BUCKET_NAME || 'uploadedfile25'
};

const isS3Available = AWS_CONFIG.accessKeyId && AWS_CONFIG.secretAccessKey;

// Format INR prices
function formatINRPrice(inrPrice) {
  return Math.round(parseFloat(inrPrice) * 100) / 100;
}

// Parse JSON body
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
  
  // CORS headers
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
        ordersCount: orders.length,
        region: AWS_CONFIG.region,
        bucket: AWS_CONFIG.bucketName
      }));
      return;
    }

    // Admin login
    if (url.pathname === '/api/admin/login' && req.method === 'POST') {
      try {
        const { mobile, password } = await parseBody(req);
        
        // Simple admin check (in production, use proper authentication)
        if (mobile === '9876543210' && password === 'admin123') {
          res.writeHead(200);
          res.end(JSON.stringify({ 
            success: true, 
            user: { isAdmin: true, mobile: mobile }
          }));
        } else {
          res.writeHead(401);
          res.end(JSON.stringify({ error: 'Invalid credentials' }));
        }
      } catch (error) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: 'Invalid request' }));
      }
      return;
    }

    // Orders endpoints
    if (url.pathname === '/api/orders' && req.method === 'GET') {
      // Sort orders by creation date (newest first)
      const sortedOrders = [...orders].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      
      res.writeHead(200);
      res.end(JSON.stringify(sortedOrders));
      return;
    }
    
    if (url.pathname === '/api/orders' && req.method === 'POST') {
      try {
        const orderData = await parseBody(req);
        
        // Format prices in INR
        if (orderData.items) {
          orderData.items.forEach(item => {
            if (item.price) {
              item.priceInr = formatINRPrice(item.price);
            }
          });
        }
        
        if (orderData.totalAmount) {
          orderData.totalAmount = formatINRPrice(orderData.totalAmount);
        }
        
        const order = {
          id: nextOrderId++,
          ...orderData,
          status: orderData.status || 'pending',
          paymentStatus: orderData.paymentStatus || 'pending',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          currency: 'INR'
        };
        
        orders.push(order);
        console.log('✅ Order created:', order.id, '-', order.customerName);
        
        res.writeHead(200);
        res.end(JSON.stringify({ success: true, order }));
      } catch (error) {
        console.error('❌ Error creating order:', error);
        res.writeHead(400);
        res.end(JSON.stringify({ error: 'Invalid order data' }));
      }
      return;
    }

    // Update order status
    if (url.pathname.match(/^\/api\/orders\/\d+$/) && req.method === 'PUT') {
      try {
        const orderId = parseInt(url.pathname.split('/')[3]);
        const updateData = await parseBody(req);
        
        const orderIndex = orders.findIndex(o => o.id === orderId);
        if (orderIndex === -1) {
          res.writeHead(404);
          res.end(JSON.stringify({ error: 'Order not found' }));
          return;
        }
        
        orders[orderIndex] = {
          ...orders[orderIndex],
          ...updateData,
          updatedAt: new Date().toISOString()
        };
        
        console.log('✅ Order updated:', orderId, '-', updateData);
        
        res.writeHead(200);
        res.end(JSON.stringify({ success: true, order: orders[orderIndex] }));
      } catch (error) {
        console.error('❌ Error updating order:', error);
        res.writeHead(400);
        res.end(JSON.stringify({ error: 'Invalid update data' }));
      }
      return;
    }
    
    // Get single order
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

    // S3 configuration
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

    // File upload
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

    // Admin stats
    if (url.pathname === '/api/admin/stats' && req.method === 'GET') {
      const stats = {
        totalOrders: orders.length,
        pendingOrders: orders.filter(o => o.status === 'pending').length,
        processingOrders: orders.filter(o => o.status === 'processing').length,
        deliveredOrders: orders.filter(o => o.status === 'delivered').length,
        totalRevenue: orders.reduce((sum, order) => sum + parseFloat(order.totalAmount), 0),
        currency: 'INR'
      };
      
      res.writeHead(200);
      res.end(JSON.stringify(stats));
      return;
    }
  }
  
  // Serve static files or frontend
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
  
  res.writeHead(404);
  res.end('Not found');
});

const PORT = 5000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 PrintLite Server running on http://0.0.0.0:${PORT}`);
  console.log(`💰 Currency: Indian Rupees (INR)`);
  console.log(`📊 Admin panel: Available with sample data`);
  console.log(`📦 Orders: ${orders.length} orders loaded`);
  console.log(`☁️  S3 Storage: ${isS3Available ? 'Configured' : 'Not configured'}`);
  console.log(`🔐 Admin login: mobile=9876543210, password=admin123`);
  
  if (isS3Available) {
    console.log(`📁 S3 Bucket: ${AWS_CONFIG.bucketName} (${AWS_CONFIG.region})`);
  }
});