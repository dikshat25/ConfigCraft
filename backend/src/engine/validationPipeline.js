import { healConfig } from './selfHealingEngine.js';
import { coerceType } from '../utils/typeCoercion.js';

/**
 * Validates incoming payload against normalized config rules
 * @param {object} payload 
 * @param {object} rawConfig 
 * @returns {{ valid: boolean, errors: array, sanitized: object }}
 */
export function validatePayload(payload, rawConfig) {
  const { config } = healConfig(rawConfig);
  const errors = [];
  const sanitized = {};

  if (!payload || typeof payload !== 'object') {
    return { valid: false, errors: [{ field: 'root', message: 'Payload must be an object' }], sanitized: {} };
  }

  const fieldsMap = new Map();
  config.fields.forEach(f => fieldsMap.set(f.name, f));

  // Check for required fields & validate known fields
  for (const field of config.fields) {
    let value = payload[field.name];
    
    if (value === undefined || value === null || value === '') {
      if (field.required) {
        errors.push({ field: field.name, message: `Field '${field.name}' is required.` });
      }
      continue;
    }

    // Coerce types where possible
    value = coerceType(value, field.type);
    
    // Type-specific validation
    if (field.type === 'number' && typeof value !== 'number') {
      errors.push({ field: field.name, message: `Field '${field.name}' must be a valid number.` });
    }
    
    // Validation rules
    if (field.validation) {
      const { min, max, pattern, minLength, maxLength } = field.validation;
      
      if (field.type === 'number') {
        if (min !== undefined && value < min) errors.push({ field: field.name, message: `Value must be at least ${min}.` });
        if (max !== undefined && value > max) errors.push({ field: field.name, message: `Value must be at most ${max}.` });
      } else if (typeof value === 'string') {
        if (minLength !== undefined && value.length < minLength) errors.push({ field: field.name, message: `Must be at least ${minLength} characters.` });
        if (maxLength !== undefined && value.length > maxLength) errors.push({ field: field.name, message: `Must be at most ${maxLength} characters.` });
        if (pattern) {
          try {
            const regex = new RegExp(pattern);
            if (!regex.test(value)) {
              errors.push({ field: field.name, message: `Does not match required pattern.` });
            }
          } catch (e) {
            // Invalid regex in config, ignore validation
          }
        }
      }
    }

    sanitized[field.name] = value;
  }

  return {
    valid: errors.length === 0,
    errors,
    sanitized
  };
}
