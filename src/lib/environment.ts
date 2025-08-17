// Environment configuration for PrintLite frontend-only app

export const isDevelopment = () => {
  return import.meta.env.DEV || import.meta.env.NODE_ENV === 'development';
};

export const config = {
  isDev: isDevelopment(),
  
  // Feature flags for frontend-only functionality
  features: {
    enableLocalStorage: true,
    enableFilePreview: true,
    enablePageCounting: true,
  }
};

export default config;