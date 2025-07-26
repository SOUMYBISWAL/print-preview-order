import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

// Default fetcher function for React Query
export async function apiRequest(url: string, options: RequestInit = {}) {
  // Check if we're running locally with a backend server
  const isLocal = window.location.hostname.includes('replit.dev') || 
                  window.location.hostname.includes('localhost') ||
                  window.location.port === '5000';
  
  if (isLocal) {
    // For local development, use the backend API
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  } else {
    // For static deployment, use localStorage
    return handleStaticRequest(url, options);
  }
}

// Handle API requests for static deployment (using localStorage)
async function handleStaticRequest(url: string, options: RequestInit = {}) {
  const method = options.method || 'GET';
  
  if (url === '/api/orders' && method === 'POST') {
    const orderData = JSON.parse(options.body as string);
    const order = {
      ...orderData,
      id: 'ORD' + Math.floor(Math.random() * 10000).toString().padStart(3, '0'),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: orderData.status || 'pending'
    };
    
    const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    existingOrders.push(order);
    localStorage.setItem('orders', JSON.stringify(existingOrders));
    
    return { success: true, order };
  }
  
  if (url === '/api/orders' && method === 'GET') {
    return JSON.parse(localStorage.getItem('orders') || '[]');
  }
  
  if (url.startsWith('/api/orders/') && method === 'GET') {
    const orderId = url.split('/').pop();
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const order = orders.find((o: any) => o.id === orderId);
    
    if (!order) {
      throw new Error('Order not found');
    }
    
    return order;
  }
  
  if (url.startsWith('/api/orders/') && method === 'PUT') {
    const orderId = url.split('/').pop();
    const updateData = JSON.parse(options.body as string);
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const orderIndex = orders.findIndex((o: any) => o.id === orderId);
    
    if (orderIndex === -1) {
      throw new Error('Order not found');
    }
    
    orders[orderIndex] = { ...orders[orderIndex], ...updateData };
    localStorage.setItem('orders', JSON.stringify(orders));
    
    return { success: true, order: orders[orderIndex] };
  }
  
  if (url === '/api/admin/login' && method === 'POST') {
    const { mobile, password } = JSON.parse(options.body as string);
    
    // Admin credentials: mobile=9876543210, password=admin123
    if (mobile === '9876543210' && password === 'admin123') {
      const admin = {
        id: 1,
        mobile: '9876543210',
        role: 'admin',
        name: 'Admin User'
      };
      localStorage.setItem('admin', JSON.stringify(admin));
      return { success: true, admin };
    } else {
      throw new Error('Invalid credentials');
    }
  }
  
  if (url === '/api/health' && method === 'GET') {
    return { status: 'ok', message: 'Static deployment running' };
  }
  
  throw new Error(`API endpoint ${url} not available in static deployment`);
}

// Set default query function
queryClient.setQueryDefaults(['*'], {
  queryFn: ({ queryKey }) => {
    const [url] = queryKey as [string];
    return apiRequest(url);
  },
});