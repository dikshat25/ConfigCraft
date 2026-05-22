import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import { errorHandler } from './middleware/errorHandler.js';
import { requestLogger } from './middleware/requestLogger.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import { initDynamicRouteEngine } from './engine/dynamicRouteEngine.js';
import { apiResponse } from './utils/apiResponse.js';

import authRoutes from './modules/auth/auth.routes.js';
import configRoutes from './modules/config/config.routes.js';
import csvRoutes from './modules/csv/csv.routes.js';

const app = express();

// Fix __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Frontend build path
const frontendPath = path.join(__dirname, '../../frontend/dist');

// ======================
// Middleware
// ======================

app.use(
  cors({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use(requestLogger);

app.use('/api', apiLimiter);

// ======================
// Health Check
// ======================

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

// ======================
// Static API Routes
// ======================

app.use('/api/auth', authRoutes);
app.use('/api/configs', configRoutes);
app.use('/api/csv', csvRoutes);

// ======================
// Dynamic Route Engine
// ======================

initDynamicRouteEngine(app);

// ======================
// 404 API Handler
// ======================

app.use('/api/*', (req, res) => {
  return apiResponse.error(
    res,
    'API Route not found',
    'NOT_FOUND',
    {},
    404
  );
});

// ======================
// Serve Frontend
// ======================

app.use(express.static(frontendPath));

// ======================
// React Router Fallback
// ======================

app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// ======================
// Global Error Handler
// ======================

app.use(errorHandler);

export default app;