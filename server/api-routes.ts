import { Express, Request, Response } from 'express';
import { db } from './db';
import { orders, users } from '@shared/schema';
import { eq } from 'drizzle-orm';

interface PrintSettings {
  paperType: string;
  color: boolean;
  sides: 'single' | 'double';
  binding?: string;
}

interface OrderRequest {
  userId?: string;
  fileDetails: Array<{
    url: string;
    name: string;
    size: number;
    pages: number;
  }>;
  printSettings: PrintSettings;
  deliveryAddress: string;
  customerName: string;
  email: string;
  phone: string;
}

/**
 * Calculate price based on print settings and pages
 * Prices are in Indian Rupees (INR)
 */
function calculatePrice(pages: number, settings: PrintSettings): number {
  let basePrice: number;
  
  // Base pricing per page in INR
  if (settings.color) {
    basePrice = 4.0; // ₹4 per page for color
  } else {
    basePrice = 1.5; // ₹1.50 per page for black & white
  }
  
  // Adjust for paper type
  switch (settings.paperType) {
    case '90gsm':
      basePrice += 0.25;
      break;
    case '120gsm':
      basePrice += 0.50;
      break;
    default: // 70gsm
      break;
  }
  
  // Calculate total pages based on sides
  const totalSheets = settings.sides === 'double' ? Math.ceil(pages / 2) : pages;
  let total = totalSheets * basePrice;
  
  // Add binding cost
  if (settings.binding && settings.binding !== 'none') {
    switch (settings.binding) {
      case 'spiral':
        total += 25; // ₹25 for spiral binding
        break;
      case 'staple':
        total += 5; // ₹5 for staple binding
        break;
    }
  }
  
  return Math.round(total * 100) / 100; // Round to 2 decimal places
}

export function setupAPIRoutes(app: Express) {
  
  /**
   * POST /api/calculate-price
   * Calculate price for a print job
   */
  app.post('/api/calculate-price', (req: Request, res: Response) => {
    try {
      const { pages, printSettings } = req.body;
      
      if (!pages || !printSettings) {
        return res.status(400).json({
          error: 'Missing required fields: pages and printSettings'
        });
      }
      
      const price = calculatePrice(pages, printSettings);
      
      res.json({
        price,
        currency: 'INR',
        breakdown: {
          basePrice: printSettings.color ? 4.0 : 1.5,
          paperType: printSettings.paperType,
          sides: printSettings.sides,
          binding: printSettings.binding || 'none',
          totalPages: pages
        }
      });
      
    } catch (error) {
      console.error('Error calculating price:', error);
      res.status(500).json({ error: 'Failed to calculate price' });
    }
  });
  
  /**
   * POST /api/orders
   * Create a new print order
   */
  app.post('/api/orders', async (req: Request, res: Response) => {
    try {
      const orderData = req.body as OrderRequest;
      
      // Validate required fields
      const requiredFields = ['fileDetails', 'printSettings', 'deliveryAddress', 'customerName', 'email', 'phone'];
      for (const field of requiredFields) {
        if (!orderData[field as keyof OrderRequest]) {
          return res.status(400).json({
            error: `Missing required field: ${field}`
          });
        }
      }
      
      // Calculate total pages and price
      const totalPages = orderData.fileDetails.reduce((sum, file) => sum + file.pages, 0);
      const totalAmount = calculatePrice(totalPages, orderData.printSettings);
      
      // Create order in database
      const newOrder = await db.insert(orders).values({
        customerName: orderData.customerName,
        email: orderData.email,
        phone: orderData.phone,
        totalAmount: totalAmount.toString(),
        status: 'pending',
        totalPages,
        printType: orderData.printSettings.color ? 'color' : 'black_white',
        paperSize: 'A4', // Default
        paperType: orderData.printSettings.paperType,
        sides: orderData.printSettings.sides,
        binding: orderData.printSettings.binding || 'none',
        copies: 1,
        deliveryAddress: orderData.deliveryAddress,
        paymentMethod: 'cash_on_delivery',
        paymentStatus: 'pending',
        fileNames: orderData.fileDetails.map(f => f.name),
        specialInstructions: null,
        userId: orderData.userId || null,
      }).returning();
      
      res.json({
        success: true,
        order: newOrder[0],
        totalAmount,
        currency: 'INR'
      });
      
    } catch (error) {
      console.error('Error creating order:', error);
      res.status(500).json({ error: 'Failed to create order' });
    }
  });
  
  /**
   * GET /api/orders/:userId
   * Get all orders for a specific user
   */
  app.get('/api/orders/:userId', async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      
      const userOrders = await db
        .select()
        .from(orders)
        .where(eq(orders.userId, userId))
        .orderBy(orders.createdAt);
      
      res.json(userOrders);
      
    } catch (error) {
      console.error('Error fetching user orders:', error);
      res.status(500).json({ error: 'Failed to fetch orders' });
    }
  });
  
  /**
   * GET /api/admin/orders
   * Get all orders for admin dashboard
   */
  app.get('/api/admin/orders', async (req: Request, res: Response) => {
    try {
      // TODO: Add admin authentication middleware
      
      const allOrders = await db
        .select()
        .from(orders)
        .orderBy(orders.createdAt);
      
      res.json(allOrders);
      
    } catch (error) {
      console.error('Error fetching admin orders:', error);
      res.status(500).json({ error: 'Failed to fetch orders' });
    }
  });
  
  /**
   * PUT /api/admin/orders/:orderId
   * Update order status (admin only)
   */
  app.put('/api/admin/orders/:orderId', async (req: Request, res: Response) => {
    try {
      // TODO: Add admin authentication middleware
      
      const { orderId } = req.params;
      const { status } = req.body;
      
      if (!status) {
        return res.status(400).json({ error: 'Status is required' });
      }
      
      const validStatuses = ['pending', 'processing', 'printing', 'shipped', 'delivered'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ 
          error: 'Invalid status. Valid values: ' + validStatuses.join(', ')
        });
      }
      
      const updatedOrder = await db
        .update(orders)
        .set({ 
          status,
          updatedAt: new Date()
        })
        .where(eq(orders.id, parseInt(orderId)))
        .returning();
      
      if (updatedOrder.length === 0) {
        return res.status(404).json({ error: 'Order not found' });
      }
      
      res.json({
        success: true,
        order: updatedOrder[0]
      });
      
    } catch (error) {
      console.error('Error updating order status:', error);
      res.status(500).json({ error: 'Failed to update order status' });
    }
  });
  
  /**
   * POST /api/upload-file
   * Handle file upload to S3 (when using AWS backend)
   */
  app.post('/api/upload-file', (req: Request, res: Response) => {
    // This endpoint will be handled by AWS Amplify Storage
    // when deployed to AWS, but provide fallback for development
    res.json({
      message: 'File upload should be handled by AWS Amplify Storage',
      developmentNote: 'Use the Amplify Storage components for file uploads'
    });
  });
  
  /**
   * GET /api/health
   * Health check endpoint
   */
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      database: db ? 'connected' : 'disconnected'
    });
  });
}