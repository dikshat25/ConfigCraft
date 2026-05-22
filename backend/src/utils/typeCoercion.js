/**
 * Coerces a value to the expected type safely
 * @param {*} value - The input value
 * @param {string} type - The expected field type
 * @returns {*} The coerced value, or the original if coercion isn't safe/possible
 */
export function coerceType(value, type) {
  if (value === null || value === undefined || value === '') {
    return null; // Let validation handle required checks
  }

  switch (type) {
    case 'number': {
      const parsed = Number(value);
      return isNaN(parsed) ? value : parsed;
    }
    case 'checkbox': {
      if (typeof value === 'boolean') return value;
      if (typeof value === 'string') {
        const lower = value.toLowerCase().trim();
        if (['true', 'yes', '1'].includes(lower)) return true;
        if (['false', 'no', '0'].includes(lower)) return false;
      }
      if (value === 1) return true;
      if (value === 0) return false;
      return Boolean(value);
    }
    case 'text':
    case 'textarea':
    case 'email':
    case 'password': {
      return typeof value === 'string' ? value : String(value);
    }
    case 'date': {
      // Basic check, full validation should happen later
      const d = new Date(value);
      return isNaN(d.getTime()) ? value : d.toISOString();
    }
    default:
      return value;
  }
}
