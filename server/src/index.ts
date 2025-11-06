import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDatabase } from './config/database';
import { initializeFirebase } from './config/firebase';
import { errorHandler } from './middleware';

// Load environment variables
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5173'],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    message: 'DefInvoice API is running',
    timestamp: new Date().toISOString(),
  });
});

// Import routes
import {
  authRoutes,
  customerRoutes,
  invoiceRoutes,
  paymentRoutes,
  dashboardRoutes,
} from './routes';

// API Routes
app.get('/api/v1', (req: Request, res: Response) => {
  res.json({
    message: 'DefInvoice API v1',
    version: '1.0.0',
    endpoints: {
      auth: '/api/v1/auth',
      customers: '/api/v1/customers',
      invoices: '/api/v1/invoices',
      payments: '/api/v1/payments',
      dashboard: '/api/v1/dashboard',
    },
  });
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/customers', customerRoutes);
app.use('/api/v1/invoices', invoiceRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);

// Error handling middleware (must be last)
app.use(errorHandler);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: {
      message: 'Route not found',
      status: 404,
    },
  });
});

// Start server
const startServer = async () => {
  try {
    // Connect to database
    await connectDatabase();

    // Initialize Firebase (optional - only if credentials are provided)
    try {
      if (process.env.FIREBASE_PROJECT_ID) {
        initializeFirebase();
      } else {
        console.warn('⚠️  Firebase credentials not configured - authentication will not work');
      }
    } catch (firebaseError) {
      console.warn('⚠️  Firebase initialization failed:', firebaseError);
      console.warn('   Server will continue but authentication will not work');
    }

    app.listen(PORT, () => {
      console.log('=================================');
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`📍 Environment: ${process.env.NODE_ENV}`);
      console.log(`🔗 Health check: http://localhost:${PORT}/health`);
      console.log(`📚 API v1: http://localhost:${PORT}/api/v1`);
      console.log('=================================');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
