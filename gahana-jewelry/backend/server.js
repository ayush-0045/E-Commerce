import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import config from './config.js';
import connectDB from './config/db.js';
import errorMiddleware from './middleware/error.js';

// Import Routes
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));
// CORS configuration
const whitelist = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:5000',
  'http://127.0.0.1:5000',
  process.env.FRONTEND_URL
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Check if origin is in whitelist or is a subdomain of a whitelisted domain
    const allowed = whitelist.some(domain => {
      return origin === domain || 
             origin.startsWith(domain.replace(/^https?:\/\//, 'http://'));
    });
    
    if (allowed) {
      callback(null, true);
    } else {
      console.warn('CORS blocked request from origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['Set-Cookie'],
  exposedHeaders: ['Set-Cookie'],
  optionsSuccessStatus: 200 // Some legacy browsers choke on 204
};

// Log allowed origins for debugging
console.log('Allowed CORS origins:', whitelist);

app.use(cors(corsOptions));

// Routes
app.get('/', (req, res) => {
    res.send('Gahana Jewelry API is running...');
});

// API Routes
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes);

// Error Handling Middleware
app.use(errorMiddleware);

const server = app.listen(config.PORT, () => {
    console.log(`Server running in ${config.NODE_ENV} mode on port ${config.PORT}`.cyan.bold);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error(`Error: ${err.message}`.red);
    // Close server & exit process
    server.close(() => process.exit(1));
});
