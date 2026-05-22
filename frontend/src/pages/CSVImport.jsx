import React, { useState, useEffect } from 'react';
import { useConfig } from '../hooks/useConfig';
import { useT } from '../hooks/useT';
import { csvService } from '../services';
import { parseCSV, mapCsvRows } from '../utils/csvParser';
import toast from 'react-hot-toast';
import { UploadCloud } from 'lucide-react';

export default function CSVImport() {
  const { configs, loadConfigs } = useConfig();
  const t = useT();
  const [selectedConfigId, setSelectedConfigId] = useState('');
  const [file, setFile] = useState(null);
  const [csvData, setCsvData] = useState(null);
  const [columnMap, setColumnMap] = useState({});
  const [isImporting, setIsImporting] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    loadConfigs();
  }, [loadConfigs]);

  const handleFileChange = async (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    if (!selected.name.endsWith('.csv')) {
      toast.error('Only CSV files are accepted');
      return;
    }
    
    if (selected.size > 5 * 1024 * 1024) {
      toast.error('File size must be under 5MB');
      return;
    }

    setFile(selected);
    try {
      const parsed = await parseCSV(selected);
      setCsvData(parsed);
      
      const initialMap = {};
      parsed.headers.forEach(h => { initialMap[h] = ''; });
      setColumnMap(initialMap);
      setResult(null);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleImport = async () => {
    if (!selectedConfigId || !csvData) return;
    setIsImporting(true);
    setResult(null);

    try {
      const mappedRows = mapCsvRows(csvData.rows, columnMap);
      const { data } = await csvService.upload({
        configId: selectedConfigId,
        columnMap,
        rows: mappedRows
      });
      
      setResult(data);
      if (data.failed === 0) {
        toast.success(`Successfully imported ${data.imported} rows!`);
      } else {
        toast.error(`Imported ${data.imported}, failed ${data.failed}.`);
      }
    } catch (err) {
      toast.error(err.message || 'Import failed');
    } finally {
      setIsImporting(false);
    }
  };

  const selectedConfig = configs.find(c => c.id === selectedConfigId);

  return (
    <div className="p-[32px_48px] max-w-screen-xl mx-auto w-full">
      <div className="flex items-center justify-between mb-[32px]">
        <div>
          <h1 className="font-syne text-[28px] font-extrabold text-text-primary tracking-[-1px] leading-[1.1]">{t('importCSV')}</h1>
          <p className="text-[14px] text-text-secondary mt-1">Upload and map CSV data into your app</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[32px]">
        
        <div className="space-y-[16px]">
          <div className="bg-bg-secondary border border-border-subtle rounded-lg p-[24px]">
            <h3 className="font-syne text-[15px] font-semibold text-text-primary mb-[20px] flex items-center">
              <span className="w-[28px] h-[28px] rounded-full bg-emerald-glow border border-[rgba(0,217,126,0.2)] text-accent-emerald font-syne text-[13px] font-bold flex items-center justify-center mr-[12px]">1.</span>
              {t('selectTargetApp')}
            </h3>
            <select 
              className="bg-bg-tertiary border border-border-emphasis text-text-primary rounded-sm px-[16px] py-[11px] text-[14px] w-full appearance-none outline-none focus:border-accent-emerald transition-colors"
              value={selectedConfigId}
              onChange={e => setSelectedConfigId(e.target.value)}
            >
              <option value="" disabled>Select an App</option>
              {configs.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div className="bg-bg-secondary border border-border-subtle rounded-lg p-[24px]">
            <h3 className="font-syne text-[15px] font-semibold text-text-primary mb-[20px] flex items-center">
              <span className="w-[28px] h-[28px] rounded-full bg-emerald-glow border border-[rgba(0,217,126,0.2)] text-accent-emerald font-syne text-[13px] font-bold flex items-center justify-center mr-[12px]">2.</span>
              {t('uploadFile')}
            </h3>
            <div className="relative border-[2px] border-dashed border-border-emphasis hover:border-accent-emerald rounded-md p-[56px_24px] text-center hover:bg-emerald-dim transition-all duration-250 cursor-pointer group">
              <input 
                type="file" 
                accept=".csv" 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                onChange={handleFileChange}
              />
              <UploadCloud className="mx-auto text-text-tertiary mb-[12px] group-hover:text-accent-emerald transition-colors w-[40px] h-[40px]" />
              <p className="text-[15px] font-medium text-text-primary">{t('clickOrDrag')}</p>
              <p className="text-[13px] text-text-secondary mt-[4px]">{t('maxSize')}</p>
            </div>
            {file && <p className="text-[14px] text-accent-emerald mt-[16px] font-medium px-2">Selected: {file.name}</p>}
          </div>

          {result && (
            <div className="bg-emerald-glow border border-[rgba(0,217,126,0.3)] rounded-lg p-[24px]">
              <h3 className="font-syne text-[15px] font-semibold mb-[16px] text-text-primary">Import Results</h3>
              <div className="grid grid-cols-3 gap-[16px] mb-[16px] text-center">
                <div className="p-3 bg-bg-secondary rounded-sm border border-border-subtle"><div className="font-syne text-[22px] font-bold text-text-primary">{result.total}</div><div className="text-[12px] text-text-secondary mt-1">Total Rows</div></div>
                <div className="p-3 bg-bg-secondary rounded-sm border border-border-subtle"><div className="font-syne text-[22px] font-bold text-accent-emerald">{result.imported}</div><div className="text-[12px] text-text-secondary mt-1">Imported</div></div>
                <div className="p-3 bg-bg-secondary rounded-sm border border-border-subtle"><div className="font-syne text-[22px] font-bold text-accent-danger">{result.failed}</div><div className="text-[12px] text-text-secondary mt-1">Failed</div></div>
              </div>
              {result.errors?.length > 0 && (
                <div className="max-h-[160px] overflow-y-auto text-[12px] text-text-secondary space-y-[4px] bg-bg-primary p-3 rounded-sm border border-border-subtle">
                  {result.errors.map((e, i) => <div key={i}><span className="text-accent-danger font-medium">Row {e.row}:</span> {e.reason}</div>)}
                </div>
              )}
            </div>
          )}
        </div>

        {csvData && selectedConfig && (
          <div className="bg-bg-secondary border border-border-subtle rounded-lg p-[24px] h-fit">
            <h3 className="font-syne text-[15px] font-semibold text-text-primary mb-[20px] flex items-center">
              <span className="w-[28px] h-[28px] rounded-full bg-emerald-glow border border-[rgba(0,217,126,0.2)] text-accent-emerald font-syne text-[13px] font-bold flex items-center justify-center mr-[12px]">3.</span>
              Map Columns
            </h3>
            <div className="space-y-[16px] max-h-[500px] overflow-y-auto pr-2">
              {csvData.headers.map(csvHeader => (
                <div key={csvHeader} className="flex items-center gap-[16px] border-b border-border-subtle pb-[16px]">
                  <div className="w-1/3">
                    <div className="text-[14px] font-medium text-text-primary truncate">{csvHeader}</div>
                    <div className="text-[12px] text-text-secondary mt-[2px]">CSV Column</div>
                  </div>
                  <div className="text-text-tertiary">&rarr;</div>
                  <div className="flex-1">
                    <select 
                      className="bg-bg-tertiary border border-border-emphasis text-text-primary rounded-sm px-[16px] py-[11px] w-full appearance-none outline-none focus:border-accent-emerald focus:ring-1 focus:ring-emerald-glow transition-all text-[14px]"
                      value={columnMap[csvHeader] || ''}
                      onChange={e => setColumnMap({ ...columnMap, [csvHeader]: e.target.value })}
                    >
                      <option value="">-- Ignore --</option>
                      {selectedConfig.normalizedConfig?.fields?.map(f => (
                        <option key={f.name} value={f.name}>{f.name} ({f.type})</option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-[24px] flex justify-end">
              <button 
                onClick={handleImport} 
                disabled={isImporting}
                className="bg-accent-emerald text-black font-medium px-5 py-2.5 rounded-sm shadow-[0_0_16px_var(--emerald-glow)] hover:opacity-85 hover:-translate-y-[1px] transition-all duration-250 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isImporting ? 'Importing...' : 'Start Import'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
