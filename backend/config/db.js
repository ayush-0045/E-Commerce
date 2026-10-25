import mongoose from 'mongoose';
import colors from 'colors';
import config from '../config.js';
import { seedInitialData } from '../services/embeddedDb.js';

const connectDB = async () => {
    try {
        console.log('Connecting to database...'.yellow);
        const connectionString = config.MONGODB_URI || 'mongodb://127.0.0.1:27017/gahana-jewelry';

        try {
            const conn = await mongoose.connect(connectionString, {
                serverSelectionTimeoutMS: 2500, // Fast failover if no external database running
                socketTimeoutMS: 45000,
            });
            console.log(`✅ MongoDB Connected to: ${conn.connection.host}`.green.bold);
        } catch (connectionErr) {
            console.warn(`Local/Remote MongoDB not reachable at ${connectionString}.`.yellow);
            console.log(`Activating local persistent database engine...`.cyan);
            await seedInitialData();
            console.log(`✅ Local persistent database active and seeded with Indian jewelry catalog.`.green.bold);
        }
    } catch (error) {
        console.error('Database connection notice:', error.message);
    }
};

export default connectDB;
