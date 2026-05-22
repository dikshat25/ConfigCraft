import React from 'react';
import { AlertTriangle, Info } from 'lucide-react';

export default function WarningBanner({ title, description, type = 'warning' }) {
  const isWarn = type === 'warning';
  return (
    <div className={`p-4 rounded-lg flex items-start gap-3 border ${
      isWarn 
        ? 'bg-accent-amber/10 border-accent-amber/20 text-accent-amber' 
        : 'bg-bg-tertiary border-border-subtle text-text-secondary'
    }`}>
      {isWarn ? <AlertTriangle size={20} className="mt-0.5 shrink-0" /> : <Info size={20} className="mt-0.5 shrink-0" />}
      <div>
        {title && <h4 className="font-semibold text-sm mb-0.5">{title}</h4>}
        <p className="text-sm opacity-90">{description}</p>
      </div>
    </div>
  );
}
