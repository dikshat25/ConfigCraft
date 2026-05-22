import Papa from 'papaparse';

/**
 * Parses a CSV file and extracts headers and sample rows.
 * @param {File} file 
 * @returns {Promise<{ headers: string[], rows: object[] }>}
 */
export function parseCSV(file) {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0 && results.data.length === 0) {
          return reject(new Error('Failed to parse CSV. Check file format.'));
        }
        
        // Ensure headers are clean
        const rawHeaders = results.meta.fields || [];
        const cleanHeaders = rawHeaders.filter(h => h && h.trim() !== '');

        resolve({
          headers: cleanHeaders,
          rows: results.data
        });
      },
      error: (error) => {
        reject(error);
      }
    });
  });
}

/**
 * Maps parsed CSV rows to config fields based on user mapping
 */
export function mapCsvRows(rows, columnMap) {
  return rows.map(row => {
    const mappedRow = {};
    for (const [csvCol, configField] of Object.entries(columnMap)) {
      if (configField && configField !== '') {
        mappedRow[configField] = row[csvCol];
      }
    }
    return mappedRow;
  });
}
