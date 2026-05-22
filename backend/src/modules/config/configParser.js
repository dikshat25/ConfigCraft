import { healConfig } from '../../engine/selfHealingEngine.js';

/**
 * Parses and heals a raw JSON config, determining if it is valid
 * @param {any} rawConfig 
 */
export function parseConfig(rawConfig) {
  const { config, warnings, isHealed } = healConfig(rawConfig);
  
  // As per prompt, we accept even malformed configs (they get healed).
  // A config is "invalid" only if it completely failed to produce anything useful,
  // but selfHealingEngine always returns a safe fallback.
  // We'll mark it isValid = true unless there's a fatal error.
  const hasFatalError = warnings.some(w => w.severity === 'error');

  return {
    normalizedConfig: config,
    warnings,
    isValid: !hasFatalError
  };
}
