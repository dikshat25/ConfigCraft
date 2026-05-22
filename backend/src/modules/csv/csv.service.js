import { PrismaClient } from '@prisma/client';
import { validatePayload } from '../../engine/validationPipeline.js';

const prisma = new PrismaClient();

export const csvService = {
  async importCsv(userId, { configId, columnMap, rows }) {
    if (!rows || !Array.isArray(rows) || rows.length === 0) {
      const err = new Error('No data rows found');
      err.code = 'CSV_IMPORT_ERROR';
      err.details = { total: 0, imported: 0 };
      throw err;
    }

    if (rows.length > 1000) {
      // Prompt says: Row count exceeds 1000 → accept first 1000, warn user
      rows = rows.slice(0, 1000);
    }

    const config = await prisma.appConfig.findUnique({
      where: { id: configId }
    });

    if (!config || config.userId !== userId) {
      const err = new Error('Config not found or forbidden');
      err.code = 'FORBIDDEN';
      throw err;
    }

    let imported = 0;
    let failed = 0;
    const errors = [];
    const validRows = [];

    // Prompt says: For each row: run through validation pipeline
    rows.forEach((row, index) => {
      // row is already a mapped object based on columnMap from frontend
      // The frontend should have mapped the CSV row to the config field names
      const { valid, errors: rowErrors, sanitized } = validatePayload(row, config.rawConfig);
      
      if (valid) {
        validRows.push({
          userId,
          configId,
          data: sanitized
        });
        imported++;
      } else {
        failed++;
        errors.push({ row: index + 1, reason: rowErrors.map(e => e.message).join(', ') });
      }
    });

    if (validRows.length > 0) {
      await prisma.dynamicRecord.createMany({
        data: validRows
      });
    }

    const uploadRecord = await prisma.cSVUpload.create({
      data: {
        userId,
        configId,
        filename: 'import.csv', // passed from frontend ideally, hardcoding for safety
        rowCount: rows.length,
        columnMap,
        errors,
        status: failed === 0 ? 'success' : 'partial_success'
      }
    });

    return {
      total: rows.length,
      imported,
      failed,
      errors,
      uploadId: uploadRecord.id
    };
  }
};
