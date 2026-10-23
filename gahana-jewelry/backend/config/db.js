import mongoose from 'mongoose';
import colors from 'colors';
import config from '../config.js';

const connectDB = async () => {
    try {
        console.log('Connecting to MongoDB...'.yellow);
        
        // Get the connection string from config
        const connectionString = config.MONGODB_URI;
        
        // Log connection details (masking password for security)
        const logConnectionString = connectionString.includes('@')
            ? 'mongodb+srv://' + connectionString.split('@')[1].split('/')[0] + '/...'
            : connectionString;
            
        console.log('Using connection string:'.yellow, logConnectionString);
        
        const conn = await mongoose.connect(connectionString, {
            serverSelectionTimeoutMS: 10000, // 10 seconds timeout
            socketTimeoutMS: 45000,
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`.green.bold);
    } catch (error) {
        console.error('❌ MongoDB Connection Error:'.red.bold, error.message);
        console.error('Please check your MongoDB connection string and network access.');
        
        if (error.name === 'MongoParseError') {
            console.error('Invalid MongoDB connection string format'.yellow);
        } else if (error.name === 'MongooseServerSelectionError') {
            console.error('Could not connect to MongoDB server'.yellow);
            console.error('1. Check if your IP is whitelisted in MongoDB Atlas'.yellow);
            console.error('2. Check your internet connection'.yellow);
            console.error('3. Verify the database name and credentials'.yellow);
        }
        
        process.exit(1);
    }
};

export default connectDB;
