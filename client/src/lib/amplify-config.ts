import { Amplify } from 'aws-amplify';
import outputs from '../../../amplify_outputs.json';

// Configure Amplify with Gen 2 outputs
Amplify.configure(outputs);

export { Amplify };