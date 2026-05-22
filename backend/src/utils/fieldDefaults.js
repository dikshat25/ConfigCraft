/**
 * Default empty values for different field types
 * @param {string} type 
 * @returns {*}
 */
export function getDefaultValue(type) {
  switch (type) {
    case 'number': return 0;
    case 'checkbox': return false;
    case 'select': return null;
    default: return '';
  }
}
