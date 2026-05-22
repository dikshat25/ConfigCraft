import { useState, useCallback } from 'react';
import { useConfigStore } from '../store/configStore';
import { configService } from '../services';
import { healConfig } from '../engine/selfHealingEngine';
import { useWarningStore } from '../store/warningStore';
import { logger } from '../utils/logger';

export function useConfig() {
  const [loading, setLoading] = useState(false);
  const { configs, setConfigs, activeConfig, setActiveConfig, healedConfig } = useConfigStore();
  const { setWarnings } = useWarningStore();

  const loadConfigs = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await configService.list();
      setConfigs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [setConfigs]);

  const loadConfig = useCallback(async (id) => {
    setLoading(true);
    try {
      const { data } = await configService.get(id);
      const { config, warnings } = healConfig(data.rawConfig);
      
      // Log warnings to store
      setWarnings(warnings);
      warnings.forEach(w => logger.warn(`Self-healing applied`, w));

      setActiveConfig(data, config);
      return { configData: data, healedConfig: config };
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [setActiveConfig, setWarnings]);

  const saveConfig = useCallback(async (name, rawConfigStr) => {
    setLoading(true);
    try {
      let parsed;
      try {
        parsed = JSON.parse(rawConfigStr);
      } catch (e) {
        throw new Error('Invalid JSON format');
      }

      const { data } = await configService.create({ name, config: parsed });
      return data;
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    configs,
    activeConfig,
    healedConfig,
    loadConfigs,
    loadConfig,
    saveConfig
  };
}
