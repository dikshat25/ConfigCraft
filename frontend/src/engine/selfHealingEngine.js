export const SUPPORTED_FIELD_TYPES = ['text', 'textarea', 'number', 'select', 'checkbox', 'date', 'email', 'password'];

export const TYPE_ALIASES = {
  'txt': 'text',
  'string': 'text',
  'str': 'text',
  'num': 'number',
  'int': 'number',
  'integer': 'number',
  'bool': 'checkbox',
  'boolean': 'checkbox',
  'dropdown': 'select',
  'multiline': 'textarea',
  'longtext': 'textarea',
};

const VALID_VALIDATION_RULES = ['required', 'min', 'max', 'pattern', 'minLength', 'maxLength'];
const VALID_TOP_LEVEL_TYPES = ['form', 'table', 'dashboard'];

function normalizeLabel(label, fieldName, warnings) {
  if (label === undefined || label === null || label === '') {
    warnings.push({ field: fieldName, issue: `Missing label`, action: 'inferred from name', severity: 'info' });
    return { en: fieldName.charAt(0).toUpperCase() + fieldName.slice(1) };
  }
  if (typeof label === 'string') {
    return { en: label };
  }
  if (typeof label === 'object' && !Array.isArray(label)) {
    return label;
  }
  warnings.push({ field: fieldName, issue: `label is neither string nor object`, action: 'normalized', severity: 'warn' });
  return { en: String(label) };
}

function normalizeOptions(options, fieldName, warnings) {
  if (!options) {
    warnings.push({ field: fieldName, issue: `type === 'select' && !field.options`, action: 'rendered empty select', severity: 'warn' });
    return [];
  }
  if (!Array.isArray(options)) {
    warnings.push({ field: fieldName, issue: `options must be an array`, action: 'reset to empty', severity: 'warn' });
    return [];
  }
  
  let needsNormalization = false;
  const normalizedOptions = options.map(opt => {
    if (typeof opt === 'string' || typeof opt === 'number') {
      needsNormalization = true;
      return { label: String(opt), value: String(opt) };
    }
    return opt;
  });

  if (needsNormalization) {
    warnings.push({ field: fieldName, issue: `Options are plain strings`, action: 'normalized to {label, value} format', severity: 'info' });
  }
  
  return normalizedOptions;
}

export function healConfig(rawConfig) {
  const warnings = [];
  let config = rawConfig;

  if (typeof config === 'string') {
    try {
      config = JSON.parse(config);
    } catch (err) {
      warnings.push({ field: 'root', issue: 'JSON.parse throws', action: 'loaded empty config', severity: 'error' });
      return { config: { type: 'form', fields: [] }, warnings, isHealed: true };
    }
  }

  if (config === null || config === undefined) {
    warnings.push({ field: 'root', issue: 'config === null', action: 'loaded empty config', severity: 'error' });
    return { config: { type: 'form', fields: [] }, warnings, isHealed: true };
  }

  if (Array.isArray(config)) {
    warnings.push({ field: 'root', issue: 'Array.isArray(config)', action: 'wrapped as form fields', severity: 'warn' });
    config = { type: 'form', fields: config };
  } else if (typeof config !== 'object') {
    warnings.push({ field: 'root', issue: 'Config is valid JSON but not an object', action: 'wrapped as form', severity: 'warn' });
    config = { type: 'form', fields: [] };
  }

  let finalConfig = { ...config };

  if (!finalConfig.type) {
    warnings.push({ field: 'root', issue: 'Config has no type field', action: 'defaulted to form', severity: 'warn' });
    finalConfig.type = 'form';
  } else if (!VALID_TOP_LEVEL_TYPES.includes(finalConfig.type)) {
    warnings.push({ field: 'root', issue: `Not form, table, dashboard`, action: `defaulted to form`, severity: 'warn' });
    finalConfig.type = 'form';
  }

  if (!finalConfig.fields || !Array.isArray(finalConfig.fields)) {
    warnings.push({ field: 'root', issue: `config.fields is absent/wrong`, action: 'initialized empty', severity: 'warn' });
    finalConfig.fields = [];
  }

  const seenNames = new Set();
  const healedFields = finalConfig.fields.map((field, index) => {
    let healedField = { ...field };

    if (healedField.fields) {
      warnings.push({ field: healedField.name || `field_${index}`, issue: 'Nested fields detected', action: 'ignored nested fields', severity: 'warn' });
      delete healedField.fields;
    }

    if (!healedField.name) {
      const generatedName = `field_${index}`;
      warnings.push({ field: generatedName, issue: `field.name === undefined`, action: `assigned '${generatedName}'`, severity: 'warn' });
      healedField.name = generatedName;
    }

    const reservedKeywords = ['class', 'function', 'return', 'var', 'let', 'const', 'import', 'export'];
    if (reservedKeywords.includes(healedField.name)) {
      warnings.push({ field: healedField.name, issue: 'Field name is reserved keyword', action: `prefixed with field_`, severity: 'warn' });
      healedField.name = `field_${healedField.name}`;
    }

    if (seenNames.has(healedField.name)) {
      const newName = `${healedField.name}_${index}`;
      warnings.push({ field: healedField.name, issue: `Two fields share same name`, action: `renamed to '${newName}'`, severity: 'warn' });
      healedField.name = newName;
    }
    seenNames.add(healedField.name);

    if (healedField.label === undefined) {
      warnings.push({ field: healedField.name, issue: `field.label === undefined`, action: 'inferred from name', severity: 'info' });
      healedField.label = { en: healedField.name.charAt(0).toUpperCase() + healedField.name.slice(1) };
    } else {
      healedField.label = normalizeLabel(healedField.label, healedField.name, warnings);
    }

    if (healedField.type === undefined) {
      warnings.push({ field: healedField.name, issue: `field.type === undefined`, action: 'defaulted to text', severity: 'warn' });
      healedField.type = 'text';
    } else if (!SUPPORTED_FIELD_TYPES.includes(healedField.type)) {
      const alias = TYPE_ALIASES[healedField.type.toLowerCase()];
      if (alias) {
        warnings.push({ field: healedField.name, issue: `Unknown type '${healedField.type}'`, action: `falling back to ${alias}`, severity: 'warn' });
        healedField.type = alias;
      } else {
        warnings.push({ field: healedField.name, issue: `Unknown type '${healedField.type}'`, action: `falling back to text`, severity: 'warn' });
        healedField.type = 'text';
      }
    }

    if (healedField.type === 'select') {
      healedField.options = normalizeOptions(healedField.options, healedField.name, warnings);
    }

    if (healedField.required === undefined) {
      healedField.required = false;
    } else if (typeof healedField.required === 'string') {
      const lower = healedField.required.toLowerCase();
      healedField.required = ['true', 'yes', '1'].includes(lower);
    } else {
      healedField.required = Boolean(healedField.required);
    }

    if (healedField.validation && typeof healedField.validation === 'object') {
      const validRules = {};
      for (const [rule, value] of Object.entries(healedField.validation)) {
        if (VALID_VALIDATION_RULES.includes(rule)) {
          validRules[rule] = value;
        } else {
          warnings.push({ field: healedField.name, issue: `Rules not in supported set`, action: `removed unknown rule '${rule}'`, severity: 'warn' });
        }
      }
      if (validRules.min !== undefined && validRules.max !== undefined && validRules.min > validRules.max) {
        warnings.push({ field: healedField.name, issue: `validation.min > validation.max`, action: 'swapped them', severity: 'warn' });
        const temp = validRules.min;
        validRules.min = validRules.max;
        validRules.max = temp;
      }
      healedField.validation = validRules;
    }

    return healedField;
  });

  finalConfig.fields = healedFields;

  return {
    config: finalConfig,
    warnings,
    isHealed: warnings.length > 0
  };
}
