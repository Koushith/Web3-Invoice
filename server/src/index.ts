/**
 * DeFInvoice API Server
 * Main entry point for the backend application
 */

// ============================================================================
// External Dependencies
// ============================================================================
import cors from 'cors';
import dotenv from 'dotenv';
import express, { NextFunction, Request, Response } from 'express';
import { existsSync } from 'fs';
import { resolve } from 'path';

// ============================================================================
// Internal Dependencies
// ============================================================================
import { connectDatabase } from './config/database.js';
import authRoutes from './routes/auth.js';
import customerRoutes from './routes/customerRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';
import invoiceRoutes from './routes/invoiceRoutes.js';
import organizationRoutes from './routes/organizationRoutes.js';
import passkeyRoutes from './routes/passkeys.js';
import paymentRoutes from './routes/paymentRoutes.js';
import userRoutes from './routes/users.js';

// ============================================================================
// Environment Configuration
// ============================================================================
const isDevelopment = process.env.NODE_ENV !== 'production';

// Load .env (production defaults)
dotenv.config();

// Override with .env.local in development
if (isDevelopment) {
  const envLocalPath = resolve(process.cwd(), '.env.local');
  if (existsSync(envLocalPath)) {
    dotenv.config({ path: envLocalPath, override: true });
    console.log('[ENV] 🔧 Development mode - .env + .env.local');
  } else {
    console.log('[ENV] ⚠️  Development mode but .env.local not found - using .env only');
  }
} else {
  console.log('[ENV] 🚀 Production mode - .env only');
}

// ============================================================================
// Express App Setup
// ============================================================================
const app = express();
const PORT = process.env.PORT || 5001;

// ============================================================================
// Middleware Configuration
// ============================================================================

// CORS - Allow multiple origins
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map((origin) => origin.trim())
  : ['http://localhost:5173'];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, etc.)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`[CORS] Blocked origin: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    optionsSuccessStatus: 200, // Some legacy browsers choke on 204
    preflightContinue: false,
  })
);

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// ============================================================================
// Routes
// ============================================================================

// Health check
app.get('/health', (_req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/passkeys', passkeyRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/organization', organizationRoutes);
app.use('/api/feedback', feedbackRoutes);

// ============================================================================
// Error Handlers
// ============================================================================

// 404 Handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Global Error Handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[ERROR]', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    error: isDevelopment ? err : {},
  });
});

// ============================================================================
// Server Startup
// ============================================================================

async function startServer() {
  try {
    // Connect to MongoDB
    await connectDatabase();

    // Start Express server
    app.listen(PORT, () => {
      const env = process.env.NODE_ENV || 'development';
      const envEmoji = env === 'production' ? '🚀' : '🔧';

      console.log('\n');
      console.log(`${envEmoji} DeFInvoice API Server`);
      console.log('━'.repeat(80));
      console.log(`Port:        ${PORT}`);
      console.log(`Environment: ${env}`);
      console.log(`Database:    Connected ✓`);
      console.log(`Firebase:    Initialized ✓`);
      console.log(`CORS:        ${allowedOrigins.join(', ')}`);
      console.log('━'.repeat(80));
      console.log('\n');
    });
  } catch (error) {
    console.error('[STARTUP] Failed to start server:', error);
    process.exit(1);
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  console.error('[FATAL] Unhandled Promise Rejection:', err);
  process.exit(1);
});

// Start the server
startServer();
