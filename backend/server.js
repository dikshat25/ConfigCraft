import dotenv from 'dotenv';
dotenv.config();

import app from './src/app.js';
import { logger } from './src/utils/logger.js';
import { PrismaClient } from '@prisma/client';
import { registerDynamicRoutes } from './src/engine/dynamicRouteEngine.js';

const PORT = process.env.PORT || 5000;
const prisma = new PrismaClient();

async function startServer() {
  try {
    await prisma.$connect();
    logger.info('Connected to database');

    // Register dynamic routes for all existing configs on startup
    const configs = await prisma.appConfig.findMany({ select: { id: true } });
    for (const config of configs) {
      registerDynamicRoutes(config.id);
    }
    
    app.listen(PORT, () => {
      logger.info(`Server listening on port ${PORT}`);
    });
  } catch (err) {
    logger.error('Failed to start server', { error: err.message, stack: err.stack });
    process.exit(1);
  }
}

startServer();
