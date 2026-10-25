import config from './config.js';

console.log('Environment Variables from config:');
console.log({
  NODE_ENV: config.NODE_ENV,
  PORT: config.PORT,
  MONGODB_URI: config.MONGODB_URI ? '***' : 'Not set',
  JWT_SECRET: config.JWT_SECRET ? '***' : 'Not set'
});
