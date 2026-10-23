import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get the current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env file in the root directory
dotenv.config({ path: join(__dirname, '.env') });

// Log environment variables (for debugging, remove in production)
console.log('Environment Variables:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('MONGODB_URI:', process.env.MONGODB_URI ? '***' : 'Not set');

// Import the main app after environment variables are loaded
import('./server.js').catch(err => {
    console.error('Failed to start server:', err);
    process.exit(1);
});
