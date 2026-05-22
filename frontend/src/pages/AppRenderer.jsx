import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useConfig } from '../hooks/useConfig';
import DynamicForm from '../components/dynamic/DynamicForm';
import DynamicTable from '../components/dynamic/DynamicTable';
import RuntimeWarningPanel from '../components/dynamic/RuntimeWarningPanel';
import Spinner from '../components/ui/Spinner';
import { ArrowLeft, Lock, LayoutTemplate, Database } from 'lucide-react';

export default function AppRenderer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { loadConfig, activeConfig, healedConfig, loading } = useConfig();
  const [view, setView] = useState('form');

  useEffect(() => {
    if (id) {
      loadConfig(id).then(({ healedConfig }) => {
        // default to table if config.type is table, otherwise form
        if (healedConfig?.type === 'table') setView('table');
      }).catch(console.error);
    }
  }, [id, loadConfig]);

  if (loading || !activeConfig) {
    return <div className="flex justify-center p-12"><Spinner /></div>;
  }

  const handleSuccess = () => {
    setView('table');
  };

  const domainName = activeConfig.name.toLowerCase().replace(/[^a-z0-9]/g, '-');

  return (
    <div className="p-[32px_48px] max-w-screen-xl mx-auto w-full relative">
      {/* Decorative Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[radial-gradient(ellipse,var(--emerald-glow)_0%,transparent_60%)] pointer-events-none -z-10 blur-[80px] opacity-60"></div>

      {/* Header */}
      <div className="flex items-center mb-8">
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center text-text-secondary hover:text-accent-emerald transition-colors duration-200 mr-4"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="font-syne text-[28px] font-extrabold text-text-primary tracking-[-1px] leading-[1.1]">{activeConfig.name}</h1>
          <p className="text-[14px] text-text-secondary mt-1">Live preview of your generated application</p>
        </div>
      </div>

      {/* Computer Screen / Browser Mockup */}
      <div className="rounded-xl border border-border-emphasis bg-bg-secondary shadow-[0_20px_60px_rgba(0,0,0,0.4)] overflow-hidden flex flex-col mx-auto transition-all duration-300">
        
        {/* Browser Topbar */}
        <div className="h-14 bg-bg-tertiary border-b border-border-subtle flex items-center px-4 gap-4">
          
          {/* Traffic Lights */}
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-[#EF4444] border border-[rgba(0,0,0,0.1)]"></div>
            <div className="w-3 h-3 rounded-full bg-[#F5A623] border border-[rgba(0,0,0,0.1)]"></div>
            <div className="w-3 h-3 rounded-full bg-[#00D97E] border border-[rgba(0,0,0,0.1)]"></div>
          </div>
          
          {/* URL Bar */}
          <div className="flex-1 max-w-2xl mx-auto bg-bg-primary border border-border-subtle rounded-md h-8 flex items-center px-3 gap-2 shadow-inner">
            <Lock size={12} className="text-accent-emerald" />
            <span className="font-mono text-[12px] text-text-secondary truncate">
              <span className="text-text-tertiary">https://</span>
              {domainName}
              <span className="text-text-tertiary">.configcraft.app</span>
            </span>
          </div>

          {/* View Toggles */}
          <div className="flex bg-bg-primary rounded-md border border-border-subtle p-0.5">
            <button 
              className={`flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium rounded-sm transition-colors ${view === 'form' ? 'bg-bg-tertiary text-text-primary shadow-sm' : 'text-text-secondary hover:text-text-primary'}`}
              onClick={() => setView('form')}
            >
              <LayoutTemplate size={14} />
              Form
            </button>
            <button 
              className={`flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium rounded-sm transition-colors ${view === 'table' ? 'bg-bg-tertiary text-text-primary shadow-sm' : 'text-text-secondary hover:text-text-primary'}`}
              onClick={() => setView('table')}
            >
              <Database size={14} />
              Data
            </button>
          </div>
        </div>

        {/* App Content Area (Viewport) */}
        <div className="bg-bg-primary min-h-[600px] overflow-y-auto">
          {/* A simulated app topbar inside the generated app */}
          <div className="h-12 bg-bg-secondary border-b border-border-subtle px-6 flex items-center shadow-sm">
            <span className="font-syne font-semibold text-[15px] text-text-primary">{activeConfig.name}</span>
          </div>
          
          <div className="p-8 max-w-4xl mx-auto">
            <RuntimeWarningPanel configWarnings={activeConfig.warnings || []} />
            
            <div className="bg-bg-secondary border border-border-subtle rounded-lg p-6 shadow-card">
              {view === 'form' ? (
                <DynamicForm configId={id} config={healedConfig} onSuccess={handleSuccess} />
              ) : (
                <DynamicTable configId={id} config={healedConfig} />
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
