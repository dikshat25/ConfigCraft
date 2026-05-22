import React from 'react';

export default function Badge({ children, variant = 'info', className = '' }) {
  const variants = {
    info: 'bg-accent-indigo/10 text-accent-indigo border border-accent-indigo/20',
    success: 'bg-accent-emerald/10 text-accent-emerald border border-accent-emerald/20',
    warning: 'bg-accent-amber/10 text-accent-amber border border-accent-amber/20',
    error: 'bg-accent-danger/10 text-accent-danger border border-accent-danger/20',
    neutral: 'bg-bg-tertiary text-text-secondary border border-border-subtle',
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
