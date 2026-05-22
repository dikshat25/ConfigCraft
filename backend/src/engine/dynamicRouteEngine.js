import express from 'express';
import { logger } from '../utils/logger.js';
import crudRoutes from '../modules/crud/crud.routes.js';
import { authenticate } from '../middleware/authenticate.js';

const registeredConfigs = new Set();
let mainRouter = null;

/**
 * Initializes the dynamic route engine
 */
export function initDynamicRouteEngine(app) {
  mainRouter = express.Router();
  app.use('/api/apps', authenticate, mainRouter);
  logger.info('Dynamic route engine initialized');
}

/**
 * Dynamically registers routes for a new config
 */
export function registerDynamicRoutes(configId) {
  if (!mainRouter) {
    logger.warn('Cannot register route, engine not initialized');
    return;
  }
  
  if (registeredConfigs.has(configId)) {
    return; // Already registered
  }

  // Mount the CRUD router for this specific configId
  // Although express allows parameterized routes like /:configId/records,
  // the prompt specifically requested dynamic registration per config save.
  // By using mainRouter.use(`/${configId}`, crudRoutes), we simulate dynamic registration.
  
  // Note: To keep things simple and avoid deep nesting issues, 
  // crudRoutes itself handles the /records and /records/:id endpoints relative to its mount point.
  mainRouter.use(`/${configId}`, (req, res, next) => {
    req.dynamicConfigId = configId;
    next();
  }, crudRoutes);
  
  registeredConfigs.add(configId);
  logger.info(`Registered dynamic routes for config: ${configId}`);
}
