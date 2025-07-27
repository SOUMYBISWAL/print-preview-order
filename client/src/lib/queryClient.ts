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
  // Always use the Node.js backend API
  const response = await fetch(url, {
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