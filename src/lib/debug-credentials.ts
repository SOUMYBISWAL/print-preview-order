// Debug function to check if credentials are available
export const debugCredentials = () => {
  console.log('Environment variable check:');
  console.log('VITE_AWS_REGION:', import.meta.env.VITE_AWS_REGION);
  console.log('VITE_AWS_ACCESS_KEY_ID exists:', !!import.meta.env.VITE_AWS_ACCESS_KEY_ID);
  console.log('VITE_AWS_SECRET_ACCESS_KEY exists:', !!import.meta.env.VITE_AWS_SECRET_ACCESS_KEY);
  
  console.log('Raw values:');
  console.log('VITE_AWS_ACCESS_KEY_ID length:', (import.meta.env.VITE_AWS_ACCESS_KEY_ID || '').length);
  console.log('VITE_AWS_SECRET_ACCESS_KEY length:', (import.meta.env.VITE_AWS_SECRET_ACCESS_KEY || '').length);
};