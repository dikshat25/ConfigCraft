import { PrismaClient } from '@prisma/client';
import { validatePayload } from '../../engine/validationPipeline.js';

const prisma = new PrismaClient();

export const crudService = {
  async getAppConfig(userId, configId) {
    const config = await prisma.appConfig.findUnique({
      where: { id: configId }
    });

    if (!config) {
      const err = new Error('App not found or deleted');
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

  async createRecord(userId, configId, payload) {
    const config = await this.getAppConfig(userId, configId);
    
    const { valid, errors, sanitized } = validatePayload(payload, config.rawConfig);
    if (!valid) {
      const err = new Error('Validation failed');
      err.code = 'VALIDATION_ERROR';
      err.details = errors;
      throw err;
    }

    const record = await prisma.dynamicRecord.create({
      data: {
        userId,
        configId,
        data: sanitized
      }
    });

    return record;
  },

  async listRecords(userId, configId, { page = 1, limit = 10, sort = 'createdAt', order = 'desc' }) {
    await this.getAppConfig(userId, configId);

    const skip = (page - 1) * limit;
    
    // sorting on JSON fields is tricky in Prisma natively without raw queries, 
    // we will sort by createdAt natively and do client-side or memory sort if sorting by a data field.
    // For simplicity, we just fetch with native sorting if it's a native field.
    
    let orderBy = {};
    if (['createdAt', 'updatedAt'].includes(sort)) {
      orderBy[sort] = order;
    } else {
      orderBy['createdAt'] = 'desc'; // Default fallback
    }

    const [records, total] = await Promise.all([
      prisma.dynamicRecord.findMany({
        where: { configId, userId, isDeleted: false },
        skip,
        take: limit,
        orderBy
      }),
      prisma.dynamicRecord.count({
        where: { configId, userId, isDeleted: false }
      })
    ]);

    // Memory sort if sorting by a json field
    if (!['createdAt', 'updatedAt'].includes(sort)) {
      records.sort((a, b) => {
        const valA = a.data[sort];
        const valB = b.data[sort];
        if (valA < valB) return order === 'asc' ? -1 : 1;
        if (valA > valB) return order === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return { records, total, page, limit };
  },

  async getRecord(userId, configId, recordId) {
    await this.getAppConfig(userId, configId);

    const record = await prisma.dynamicRecord.findUnique({
      where: { id: recordId }
    });

    if (!record || record.configId !== configId || record.isDeleted) {
      const err = new Error('Record not found');
      err.code = 'NOT_FOUND';
      throw err;
    }

    return record;
  },

  async updateRecord(userId, configId, recordId, payload) {
    const config = await this.getAppConfig(userId, configId);
    
    // Ensure record exists
    await this.getRecord(userId, configId, recordId);

    const { valid, errors, sanitized } = validatePayload(payload, config.rawConfig);
    if (!valid) {
      const err = new Error('Validation failed');
      err.code = 'VALIDATION_ERROR';
      err.details = errors;
      throw err;
    }

    const updated = await prisma.dynamicRecord.update({
      where: { id: recordId },
      data: { data: sanitized }
    });

    return updated;
  },

  async deleteRecord(userId, configId, recordId) {
    await this.getRecord(userId, configId, recordId);

    await prisma.dynamicRecord.update({
      where: { id: recordId },
      data: { isDeleted: true }
    });

    return true;
  }
};
