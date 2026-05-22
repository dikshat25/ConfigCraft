import React, { useState } from 'react';
import { AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import { useWarningStore } from '../../store/warningStore';

export default function RuntimeWarningPanel({ configWarnings = [] }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const storeWarnings = useWarningStore(state => state.warnings);
  
  const allWarnings = [...configWarnings, ...storeWarnings];
  const uniqueWarnings = Array.from(new Map(allWarnings.map(w => [`${w.field}-${w.issue}`, w])).values());

  if (uniqueWarnings.length === 0) return null;

  const warnCount = uniqueWarnings.filter(w => w.severity === 'warn').length;

  return (
    <div className="mb-[20px] rounded-md border border-[rgba(245,166,35,0.2)] bg-amber-dim overflow-hidden">
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center p-[14px_16px] transition-colors"
      >
        <AlertTriangle size={16} className="text-accent-amber mr-[10px]" />
        <span className="font-syne font-semibold text-[13px] text-accent-amber">Self-Healing Activated</span>
        
        <span className="text-[11px] text-accent-amber bg-amber-dim border border-[rgba(245,166,35,0.3)] px-[8px] py-[2px] rounded-full ml-[10px]">
          {warnCount} warnings
        </span>
        
        <div className="ml-auto">
          {isExpanded ? <ChevronUp size={16} className="text-accent-amber" /> : <ChevronDown size={16} className="text-accent-amber" />}
        </div>
      </button>
      
      {isExpanded && (
        <div className="px-[16px] pb-[8px] text-[13px] max-h-[240px] overflow-y-auto font-sans">
          <ul className="flex flex-col">
            {uniqueWarnings.map((w, i) => (
              <li key={i} className="flex flex-col sm:flex-row sm:items-center gap-[10px] p-[8px_0] border-t border-[rgba(245,166,35,0.1)]">
                <span className="font-medium text-accent-amber">
                  {w.field}
                </span>
                <span className="opacity-60 hidden sm:inline text-accent-amber">&rarr;</span>
                <span className="text-text-secondary">{w.action}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
