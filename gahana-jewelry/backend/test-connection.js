import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb+srv://ayushvishwakarma437_db_user:609DHdghsaCESERY@cluster0.msayaji.mongodb.net/gahana-jewelry?retryWrites=true&w=majority';

async function testConnection() {
  try {
    console.log('Attempting to connect to MongoDB Atlas...');
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    console.log('✅ Successfully connected to MongoDB Atlas!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    if (error.code === 'MONGODB_DUPLICATE_KEY_ERROR') {
      console.error('This usually means you have duplicate indexes in your schema.');
    } else if (error.code === 'ENOTFOUND') {
      console.error('Could not resolve the hostname. Please check your internet connection.');
    } else if (error.code === 'ETIMEDOUT') {
      console.error('Connection timed out. Please check if your IP is whitelisted in MongoDB Atlas.');
    }
    process.exit(1);
  }
}

testConnection();
