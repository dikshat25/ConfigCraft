import { PrismaClient } from '@prisma/client';
import { parseConfig } from './configParser.js';
import { registerDynamicRoutes } from '../../engine/dynamicRouteEngine.js';

const prisma = new PrismaClient();

export const configService = {
  async createConfig(userId, { name, config: rawConfig }) {
    const { normalizedConfig, warnings, isValid } = parseConfig(rawConfig);

    const appConfig = await prisma.appConfig.create({
      data: {
        userId,
        name: name || 'Unnamed App',
        rawConfig,
        normalizedConfig,
        warnings,
        isValid
      }
    });

    registerDynamicRoutes(appConfig.id);

    return appConfig;
  },

  async listConfigs(userId) {
    return prisma.appConfig.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        isValid: true,
        createdAt: true,
        updatedAt: true,
        // Calculate field count dynamically if needed, or just return normalizedConfig and let frontend count
        normalizedConfig: true,
        warnings: true
      }
    });
  },

  async getConfig(userId, configId) {
    const config = await prisma.appConfig.findUnique({
      where: { id: configId }
    });

    if (!config) {
      const err = new Error('Config not found');
      err.code = 'NOT_FOUND';
      throw err;
    }

    if (config.userId !== userId) {
      const err = new Error('Forbidden');
      err.code = 'FORBIDDEN';
      throw err;
    }

    return config;
  },

  async updateConfig(userId, configId, { name, config: rawConfig }) {
    await this.getConfig(userId, configId); // Ensures it exists and belongs to user

    const { normalizedConfig, warnings, isValid } = parseConfig(rawConfig);

    const updated = await prisma.appConfig.update({
      where: { id: configId },
      data: {
        name,
        rawConfig,
        normalizedConfig,
        warnings,
        isValid
      }
    });

    registerDynamicRoutes(updated.id);

    return updated;
  },

  async deleteConfig(userId, configId) {
    await this.getConfig(userId, configId); // Ensure exists and belongs to user
    await prisma.appConfig.delete({ where: { id: configId } });
    return true;
  }
};
