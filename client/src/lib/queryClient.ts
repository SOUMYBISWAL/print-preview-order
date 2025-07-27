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
  // Use environment-specific API URL
  const apiBaseUrl = import.meta.env.VITE_API_URL || 
                     (import.meta.env.DEV ? 'http://localhost:5000' : '');
  const fullUrl = url.startsWith('http') ? url : `${apiBaseUrl}${url}`;
  
  const response = await fetch(fullUrl, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// Set default query function
queryClient.setQueryDefaults(['*'], {
  queryFn: ({ queryKey }) => {
    const [url] = queryKey as [string];
    return apiRequest(url);
  },
});