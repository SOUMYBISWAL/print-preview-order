import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

// Frontend-only localStorage-based API simulation
export async function apiRequest(url: string, options: RequestInit = {}) {
  console.log('Frontend-only mode: Simulating API call to', url);
  
  // Simulate network delay for realistic UX
  await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300));
  
  // Mock responses based on URL patterns
  if (url.includes('/health')) {
    return { status: 'ok', message: 'Frontend-only mode active', timestamp: new Date().toISOString() };
  }
  
  if (url.includes('/orders')) {
    const orders = JSON.parse(localStorage.getItem('printlite_orders') || '[]');
    
    if (options.method === 'POST' && options.body) {
      const newOrder = JSON.parse(options.body as string);
      newOrder.id = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      newOrder.status = 'pending';
      newOrder.createdAt = new Date().toISOString();
      newOrder.updatedAt = new Date().toISOString();
      orders.push(newOrder);
      localStorage.setItem('printlite_orders', JSON.stringify(orders));
      return newOrder;
    }
    
    if (url.includes('/orders/') && options.method === 'GET') {
      const orderId = url.split('/orders/')[1];
      const order = orders.find((o: any) => o.id === orderId);
      if (!order) throw new Error('Order not found');
      return order;
    }
    
    return orders;
  }
  
  if (url.includes('/admin/stats')) {
    const orders = JSON.parse(localStorage.getItem('printlite_orders') || '[]');
    return {
      totalOrders: orders.length,
      totalRevenue: orders.reduce((sum: number, order: any) => sum + (order.totalPrice || 0), 0),
      pendingOrders: orders.filter((order: any) => order.status === 'pending').length,
      completedOrders: orders.filter((order: any) => order.status === 'completed').length,
      recentOrders: orders.slice(-5).reverse()
    };
  }
  
  if (url.includes('/auth/login')) {
    // Simple mock authentication
    const credentials = JSON.parse(options.body as string || '{}');
    if (credentials.username === 'admin' && credentials.password === 'admin') {
      localStorage.setItem('printlite_user', JSON.stringify({ 
        id: 'admin', 
        username: 'admin', 
        role: 'admin',
        loginAt: new Date().toISOString()
      }));
      return { success: true, user: { username: 'admin', role: 'admin' } };
    }
    throw new Error('Invalid credentials');
  }
  
  if (url.includes('/auth/logout')) {
    localStorage.removeItem('printlite_user');
    return { success: true };
  }
  
  // Default response for unknown endpoints
  return { message: 'Frontend-only mode - endpoint not implemented', url };
}

// Set default query function
queryClient.setQueryDefaults(['*'], {
  queryFn: ({ queryKey }) => {
    const [url] = queryKey as [string];
    return apiRequest(url);
  },
});