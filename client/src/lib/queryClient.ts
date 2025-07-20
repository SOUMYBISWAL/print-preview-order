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

// Handle API requests for Amplify deployment (using AWS backend)
async function handleAmplifyRequest(url: string, options: RequestInit = {}) {
  const method = options.method || 'GET';
  
  try {
    // Check if AWS Amplify is configured
    const { generateClient } = await import('aws-amplify/api');
    const client = generateClient();
    
    if (url === '/api/orders' && method === 'POST') {
      // Create order using AWS AppSync
      const orderData = JSON.parse(options.body as string);
      const { createGuestOrder } = await import('@/lib/graphql-queries');
      
      const result = await client.graphql({
        query: createGuestOrder,
        variables: {
          input: {
            ...orderData,
            status: orderData.status || 'pending'
          }
        }
      });
      
      const data = result.data as any;
      return { success: true, order: data?.createGuestOrder };
    }
    
    if (url === '/api/orders' && method === 'GET') {
      // Get all orders using AWS AppSync
      const { listOrders } = await import('@/lib/graphql-queries');
      
      const result = await client.graphql({
        query: listOrders
      });
      
      const data = result.data as any;
      return data?.listOrders?.items || [];
    }
    
    if (url.startsWith('/api/orders/') && method === 'GET') {
      // Get specific order by ID
      const orderId = url.split('/').pop();
      const { getOrder } = await import('@/lib/graphql-queries');
      
      const result = await client.graphql({
        query: getOrder,
        variables: { id: orderId }
      });
      
      const data = result.data as any;
      if (!data?.getOrder) {
        throw new Error('Order not found');
      }
      
      return data.getOrder;
    }
    
    // For other requests, throw appropriate errors
    throw new Error(`API endpoint ${url} not available`);
    
  } catch (amplifyError) {
    console.warn('AWS Amplify not available, falling back to localStorage:', amplifyError);
    
    // Fallback to localStorage if AWS is not configured
    if (url === '/api/orders' && method === 'POST') {
      const orderData = JSON.parse(options.body as string);
      const order = {
        ...orderData,
        id: Math.floor(Math.random() * 10000),
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
      const orderId = parseInt(url.split('/').pop() || '0');
      const orders = JSON.parse(localStorage.getItem('orders') || '[]');
      const order = orders.find((o: any) => o.id === orderId);
      
      if (!order) {
        throw new Error('Order not found');
      }
      
      return order;
    }
    
    throw new Error(`API endpoint ${url} not available in static deployment`);
  }
}

// Set default query function
queryClient.setQueryDefaults(['*'], {
  queryFn: ({ queryKey }) => {
    const [url] = queryKey as [string];
    return apiRequest(url);
  },
});