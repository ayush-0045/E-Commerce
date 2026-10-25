import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env file
dotenv.config({ path: resolve(__dirname, '.env') });

const config = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 5000,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/gahana-jewelry',
  JWT_SECRET: process.env.JWT_SECRET || 'dev_secret_key_change_in_production_7a9f8b2c',
  JWT_EXPIRE: process.env.JWT_EXPIRE || '30d',
  COOKIE_EXPIRE: parseInt(process.env.COOKIE_EXPIRE) || 30
};

// Log the configuration (masking sensitive data)
console.log('Configuration loaded:');
console.log({
  NODE_ENV: config.NODE_ENV,
  PORT: config.PORT,
  MONGODB_URI: config.MONGODB_URI ? '***' : 'Not set',
  JWT_SECRET: config.JWT_SECRET ? '***' : 'Not set',
  JWT_EXPIRE: config.JWT_EXPIRE,
  COOKIE_EXPIRE: config.COOKIE_EXPIRE
});

export default config;
