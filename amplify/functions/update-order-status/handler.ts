import type { AppSyncResolverHandler } from 'aws-lambda';

interface UpdateOrderStatusArgs {
  orderId: string;
  status: string;
  adminNotes?: string;
}

interface OrderResult {
  id: string;
  status: string;
  adminNotes?: string;
  updatedAt: string;
}

export const handler: AppSyncResolverHandler<UpdateOrderStatusArgs, OrderResult> = async (event) => {
  const { orderId, status, adminNotes } = event.arguments;

  try {
    // Validate status
    const validStatuses = ['pending', 'processing', 'printing', 'ready', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      throw new Error('Invalid status provided');
    }

    // Here you would typically update the order in DynamoDB
    // For now, return a mock response structure
    const updatedOrder = {
      id: orderId,
      status,
      adminNotes: adminNotes || '',
      updatedAt: new Date().toISOString()
    };

    console.log(`Order ${orderId} status updated to ${status}`, {
      adminNotes,
      timestamp: updatedOrder.updatedAt
    });

    return updatedOrder;

  } catch (error) {
    console.error('Update order status error:', error);
    throw new Error('Failed to update order status');
  }
};