import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useConfig } from '../hooks/useConfig';
import { useT } from '../hooks/useT';
import PageWrapper from '../components/layout/PageWrapper';
import Spinner from '../components/ui/Spinner';
import { Plus, LayoutGrid, Calendar, Hash, Github } from 'lucide-react';

export default function Dashboard() {
  const { configs, loadConfigs, loading } = useConfig();
  const navigate = useNavigate();
  const t = useT();

  useEffect(() => {
    loadConfigs();
  }, [loadConfigs]);

  const renderContent = () => {
    if (loading && configs.length === 0) {
      return <div className="flex justify-center p-12"><Spinner /></div>;
    }

    if (configs.length === 0) {
      return (
        <div className="text-center py-[80px]">
          <LayoutGrid size={48} className="mx-auto text-text-tertiary mb-4" />
          <h3 className="font-syne text-[18px] font-semibold text-text-primary mb-1">No apps yet</h3>
          <p className="text-[14px] text-text-secondary mb-6">Create your first config-driven app</p>
          <button 
            className="bg-accent-emerald text-black font-medium px-5 py-2.5 rounded-sm shadow-[0_0_16px_var(--emerald-glow)] hover:opacity-85 hover:-translate-y-[1px] transition-all duration-250"
            onClick={() => navigate('/configs/new')}
          >
            {t('createNewApp')}
          </button>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
        {configs.map(config => (
          <div 
            key={config.id} 
            className="bg-bg-secondary border border-border-subtle rounded-lg p-5 cursor-pointer transition-all duration-250 hover:border-[rgba(0,217,126,0.25)] hover:shadow-[0_0_24px_rgba(0,217,126,0.07)] hover:-translate-y-[2px] group"
            onClick={() => navigate(`/apps/${config.id}`)}
          >
            <div className="flex items-start justify-between">
              <div className="w-[44px] h-[44px] bg-emerald-glow rounded-sm flex items-center justify-center">
                <LayoutGrid size={20} className="text-accent-emerald" />
              </div>
              
              {!config.isValid && (
                <span className="bg-danger-dim border border-[rgba(239,68,68,0.2)] text-accent-danger text-[11px] px-[10px] py-[3px] rounded-full font-medium">Invalid Config</span>
              )}
              {config.isValid && config.warnings?.length > 0 && (
                <span className="bg-amber-dim border border-[rgba(245,166,35,0.2)] text-accent-amber text-[11px] px-[10px] py-[3px] rounded-full font-medium">{config.warnings.length} Warnings</span>
              )}
            </div>
            
            <h3 className="font-syne text-[17px] font-semibold text-text-primary mt-4 mb-1.5 group-hover:text-accent-emerald transition-colors">{config.name}</h3>
            
            <div className="flex items-center gap-4 text-[13px] text-text-secondary">
              <span className="flex items-center gap-1.5"><Calendar size={14} /> {new Date(config.createdAt).toLocaleDateString()}</span>
              <span className="flex items-center gap-1.5"><Hash size={14} /> {config.normalizedConfig?.fields?.length || 0} fields</span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="p-[32px_48px] max-w-screen-xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-[32px] gap-4">
        <div>
          <h1 className="font-syne text-[28px] font-extrabold text-text-primary tracking-[-1px] leading-[1.1]">{t('dashboard')}</h1>
          <p className="text-[14px] text-text-secondary mt-1">Manage your config-driven applications</p>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/dikshat25/ConfigCraft"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors duration-200"
            title="View on GitHub"
          >
            <Github size={20} />
            <span className="text-[14px] font-medium hidden sm:inline">GitHub</span>
          </a>
          <button 
            onClick={() => navigate('/configs/new')}
            className="flex items-center justify-center bg-accent-emerald text-black font-medium px-5 py-2.5 rounded-sm shadow-[0_0_16px_var(--emerald-glow)] hover:opacity-85 hover:-translate-y-[1px] transition-all duration-250 whitespace-nowrap"
          >
            <Plus size={16} className="mr-2" /> {t('newApp')}
          </button>
        </div>
      </div>

      {renderContent()}
    </div>
  );
}
