import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useConfig } from '../hooks/useConfig';
import { useT } from '../hooks/useT';
import { healConfig } from '../engine/selfHealingEngine';
import RuntimeWarningPanel from '../components/dynamic/RuntimeWarningPanel';
import toast from 'react-hot-toast';
import { Code2 } from 'lucide-react';

export default function ConfigUpload() {
  const [name, setName] = useState('');
  const [jsonInput, setJsonInput] = useState('{\n  "type": "form",\n  "fields": []\n}');
  const [jsonError, setJsonError] = useState(null);
  const [previewHealed, setPreviewHealed] = useState(null);
  const [previewWarnings, setPreviewWarnings] = useState([]);
  
  const { saveConfig, loading } = useConfig();
  const navigate = useNavigate();
  const t = useT();

  useEffect(() => {
    try {
      const parsed = JSON.parse(jsonInput);
      setJsonError(null);
      const { config, warnings } = healConfig(parsed);
      setPreviewHealed(config);
      setPreviewWarnings(warnings);
    } catch (err) {
      setJsonError('Invalid JSON syntax');
      setPreviewHealed(null);
      setPreviewWarnings([]);
    }
  }, [jsonInput]);

  const handleSave = async () => {
    if (jsonError) {
      toast.error('Fix JSON errors before saving');
      return;
    }
    try {
      const saved = await saveConfig(name || 'Unnamed App', jsonInput);
      toast.success('App created successfully!');
      navigate(`/apps/${saved.id}`);
    } catch (err) {
      toast.error('Failed to save config');
    }
  };

  return (
    <div className="p-[32px_48px] max-w-screen-xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-[32px] gap-4">
        <div>
          <h1 className="font-syne text-[28px] font-extrabold text-text-primary tracking-[-1px] leading-[1.1]">{t('createNewApp')}</h1>
          <p className="text-[14px] text-text-secondary mt-1">Define your app with a JSON configuration</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-[32px]">
        {/* Editor Panel */}
        <div className="bg-bg-secondary border border-border-subtle rounded-lg overflow-hidden flex flex-col shadow-card">
          {/* Terminal Header */}
          <div className="bg-bg-tertiary border-b border-border-subtle px-4 py-3 flex items-center">
            <div className="flex gap-2">
              <div className="w-[10px] h-[10px] rounded-full bg-[#EF4444]"></div>
              <div className="w-[10px] h-[10px] rounded-full bg-[#F5A623]"></div>
              <div className="w-[10px] h-[10px] rounded-full bg-[#00D97E]"></div>
            </div>
            <span className="text-[13px] text-text-secondary ml-2 font-medium">{t('jsonConfig')}</span>
            {jsonError && <span className="text-[12px] text-accent-danger font-medium ml-auto">{jsonError}</span>}
          </div>

          <div className="p-[16px_16px_0]">
            <label className="text-[12px] text-text-secondary font-medium mb-[6px] block">{t('appName')}</label>
            <input 
              className="w-full bg-bg-tertiary border border-border-emphasis rounded-sm px-[14px] py-[10px] text-[14px] text-text-primary outline-none focus:border-accent-emerald focus:ring-1 focus:ring-emerald-glow transition-all mb-4"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Employee Directory"
            />
          </div>

          <textarea
            className="w-full flex-1 min-h-[320px] p-4 bg-bg-tertiary text-accent-emerald font-mono text-[13px] leading-[1.7] outline-none border-none resize-y"
            style={{ tabSize: 2 }}
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            spellCheck={false}
          />
        </div>

        {/* Preview Panel */}
        <div className="flex flex-col">
          <div className="bg-bg-secondary border border-border-subtle rounded-lg overflow-hidden shadow-card flex-1">
            <div className="p-[12px_16px] border-b border-border-subtle flex items-center justify-between">
              <span className="font-syne text-[14px] font-semibold text-text-primary">{t('livePreview')}</span>
              {previewHealed && (
                <span className="bg-bg-tertiary border border-border-emphasis text-[11px] text-text-secondary px-[10px] py-[3px] rounded-full font-medium uppercase">
                  {previewHealed.type} VIEW
                </span>
              )}
            </div>

            <div className="p-5">
              <RuntimeWarningPanel configWarnings={previewWarnings} />

              {previewHealed ? (
                <div className="space-y-4 opacity-80 pointer-events-none">
                  {previewHealed.fields.map((f, i) => (
                    <div key={i} className="p-3 bg-bg-tertiary border border-border-subtle rounded-sm">
                      <div className="font-medium text-text-primary text-[14px]">{f.name}</div>
                      <div className="text-[12px] text-text-secondary mt-1">Type: <span className="text-accent-emerald">{f.type}</span></div>
                    </div>
                  ))}
                  {previewHealed.fields.length === 0 && (
                    <div className="text-center py-8">
                      <Code2 size={24} className="mx-auto text-text-tertiary mb-2" />
                      <div className="text-[14px] text-text-secondary">{t('noFieldsDetected')}</div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="min-h-[200px] flex flex-col items-center justify-center p-8 bg-bg-tertiary border border-dashed border-border-emphasis rounded-sm text-center">
                  <Code2 size={32} className="text-text-tertiary mb-3" />
                  <span className="text-[14px] text-text-secondary">Fix JSON errors to see preview</span>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-5 flex justify-end">
            <button 
              onClick={handleSave} 
              disabled={loading || !!jsonError}
              className="bg-accent-emerald text-black font-medium px-5 py-2.5 rounded-sm shadow-[0_0_16px_var(--emerald-glow)] hover:opacity-85 hover:-translate-y-[1px] transition-all duration-250 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t('saveAndGenerate')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
