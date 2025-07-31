// AWS Amplify Configuration for PrintLite
import { Amplify } from 'aws-amplify';
import amplifyconfig from '../amplifyconfiguration.json';

// Configure Amplify with existing configuration
console.log('Configuring Amplify with configuration');
Amplify.configure(amplifyconfig);

export { Amplify };
export default amplifyconfig;