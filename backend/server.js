import dotenv from 'dotenv';
dotenv.config();

import app from './src/app.js';
import { logger } from './src/utils/logger.js';
import { PrismaClient } from '@prisma/client';
import { registerDynamicRoutes } from './src/engine/dynamicRouteEngine.js';

const prisma = new PrismaClient();

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    // Connect Database
    await prisma.$connect();

    logger.info('Connected to database');

    // Register dynamic routes safely
    try {
      const configs = await prisma.appConfig.findMany({
        select: { id: true }
      });

      if (configs.length > 0) {
        for (const config of configs) {
          try {
            registerDynamicRoutes(config.id);
          } catch (routeError) {
            logger.error('Dynamic route registration failed', {
              configId: config.id,
              error: routeError.message
            });
          }
        }

        logger.info(`Registered ${configs.length} dynamic configs`);
      } else {
        logger.info('No dynamic configs found');
      }
    } catch (dynamicError) {
      logger.error('Failed loading dynamic routes', {
        error: dynamicError.message
      });
    }

    // Start Server
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });

  } catch (err) {
    logger.error('Failed to start server', {
      error: err.message,
      stack: err.stack
    });

    process.exit(1);
  }
}

startServer();