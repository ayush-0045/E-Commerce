import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected...');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

const fixIndexes = async () => {
  try {
    // Get the User collection
    const collection = mongoose.connection.collection('users');
    
    // Drop the problematic index
    try {
      await collection.dropIndex('username_1');
      console.log('Successfully dropped the username_1 index');
    } catch (err) {
      if (err.codeName === 'IndexNotFound') {
        console.log('username_1 index not found, no action needed');
      } else {
        throw err;
      }
    }
    
    // Create a new sparse unique index
    await collection.createIndex({ username: 1 }, { unique: true, sparse: true });
    console.log('Created new sparse unique index on username field');
    
    console.log('Index fix completed successfully');
    process.exit(0);
  } catch (err) {
    console.error('Error fixing indexes:', err);
    process.exit(1);
  }
};

// Run the script
(async () => {
  await connectDB();
  await fixIndexes();
})();
