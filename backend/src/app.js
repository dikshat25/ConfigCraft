import express from 'express';
import cors from 'cors';
import { errorHandler } from './middleware/errorHandler.js';
import { requestLogger } from './middleware/requestLogger.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import { initDynamicRouteEngine } from './engine/dynamicRouteEngine.js';
import { apiResponse } from './utils/apiResponse.js';

import authRoutes from './modules/auth/auth.routes.js';
import configRoutes from './modules/config/config.routes.js';
import csvRoutes from './modules/csv/csv.routes.js';

const app = express();

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(express.json({ limit: '10mb' })); // Support large JSON payloads for CSV import
app.use(requestLogger);
app.use('/api', apiLimiter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Static Routes
app.use('/api/auth', authRoutes);
app.use('/api/configs', configRoutes);
app.use('/api/csv', csvRoutes);

// Dynamic Routes Initialization
initDynamicRouteEngine(app);

// 404 Handler
app.use((req, res) => {
  apiResponse.error(res, 'Route not found', 'NOT_FOUND', {}, 404);
});

// Global Error Handler
app.use(errorHandler);

export default app;
