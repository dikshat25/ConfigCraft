/**
 * Resolves localized labels based on field definition and current locale
 * @param {string|object} labelValue 
 * @param {string} locale 
 * @returns {string}
 */
export function getLabel(labelValue, locale = 'en') {
  if (typeof labelValue === 'string') return labelValue;
  if (typeof labelValue === 'object' && labelValue !== null) {
    return labelValue[locale] || labelValue['en'] || Object.values(labelValue)[0] || 'Unnamed Field';
  }
  return 'Unnamed Field';
}
