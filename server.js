const express = require('express');
const path = require('path');

const app = express();

// Middleware - Manual CORS setup instead of using cors package
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sample orders data for testing
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

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

app.get('/api/orders', (req, res) => {
  res.json(sampleOrders);
});

app.post('/api/orders', (req, res) => {
  const order = {
    id: `ORDER${String(sampleOrders.length + 1).padStart(3, '0')}`,
    ...req.body,
    orderDate: new Date().toISOString().split('T')[0],
    status: 'pending'
  };
  sampleOrders.push(order);
  res.json({ success: true, orderId: order.id });
});

app.get('/api/orders/:id', (req, res) => {
  const order = sampleOrders.find(o => o.id === req.params.id);
  if (order) {
    res.json(order);
  } else {
    res.status(404).json({ error: 'Order not found' });
  }
});

app.patch('/api/orders/:id', (req, res) => {
  const orderIndex = sampleOrders.findIndex(o => o.id === req.params.id);
  if (orderIndex !== -1) {
    sampleOrders[orderIndex] = { ...sampleOrders[orderIndex], ...req.body };
    res.json({ success: true, order: sampleOrders[orderIndex] });
  } else {
    res.status(404).json({ error: 'Order not found' });
  }
});

// Admin authentication
app.post('/api/admin/login', (req, res) => {
  const { mobile, password } = req.body;
  if (mobile === '9876543210' && password === 'admin123') {
    res.json({ success: true, message: 'Login successful' });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

// Serve static files from client build
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist', 'public')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'public', 'index.html'));
  });
} else {
  // Development mode - serve a simple message for non-API routes
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.json({ 
        message: 'PrintLite API Server - Development Mode',
        endpoints: [
          'GET /api/health',
          'GET /api/orders',
          'POST /api/orders',
          'GET /api/orders/:id',
          'PATCH /api/orders/:id',
          'POST /api/admin/login'
        ]
      });
    }
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('API endpoints available:');
  console.log('- GET /api/health');
  console.log('- GET /api/orders');
  console.log('- POST /api/orders');
  console.log('- Admin login: mobile: 9876543210, password: admin123');
});