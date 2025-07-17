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
  // Check if we're on Amplify deployment (no backend server)
  const isAmplifyDeployment = window.location.hostname.includes('amplifyapp.com') || 
                              window.location.hostname.includes('shopbazarr.in') ||
                              !window.location.hostname.includes('replit.dev');
  
  if (isAmplifyDeployment) {
    // For Amplify deployment, use localStorage to simulate API responses
    return handleAmplifyRequest(url, options);
  }
  
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
}

// Handle API requests for Amplify deployment (frontend-only)
async function handleAmplifyRequest(url: string, options: RequestInit = {}) {
  const method = options.method || 'GET';
  
  if (url === '/api/orders' && method === 'POST') {
    // Simulate order creation
    const orderData = JSON.parse(options.body as string);
    const order = {
      ...orderData,
      id: Math.floor(Math.random() * 10000),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'pending'
    };
    
    // Store order in localStorage for tracking
    const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    existingOrders.push(order);
    localStorage.setItem('orders', JSON.stringify(existingOrders));
    
    return { success: true, order };
  }
  
  if (url === '/api/orders' && method === 'GET') {
    // Return orders from localStorage
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    return orders;
  }
  
  if (url.startsWith('/api/orders/') && method === 'GET') {
    // Get specific order by ID
    const orderId = parseInt(url.split('/').pop() || '0');
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const order = orders.find((o: any) => o.id === orderId);
    
    if (!order) {
      throw new Error('Order not found');
    }
    
    return order;
  }
  
  // For other requests, throw appropriate errors
  throw new Error(`API endpoint ${url} not available in static deployment`);
}

// Set default query function
queryClient.setQueryDefaults(['*'], {
  queryFn: ({ queryKey }) => {
    const [url] = queryKey as [string];
    return apiRequest(url);
  },
});