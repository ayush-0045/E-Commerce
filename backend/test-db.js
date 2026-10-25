import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Load environment variables
dotenv.config();

console.log('Testing MongoDB connection...');
console.log('Connection string:', 
  process.env.MONGODB_URI 
    ? process.env.MONGODB_URI.substring(0, 30) + '...' 
    : 'No MONGODB_URI found in .env');

async function testConnection() {
  try {
    console.log('Attempting to connect...');
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('✅ Successfully connected to MongoDB!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    if (error.code === 'MONGODB_DUPLICATE_KEY_ERROR') {
      console.error('This usually means you have duplicate indexes in your schema.');
    }
    process.exit(1);
  }
}

testConnection();
