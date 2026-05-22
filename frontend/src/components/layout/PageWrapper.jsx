import React from 'react';

export default function PageWrapper({ title, subtitle, actions, children }) {
  return (
    <div className="max-w-screen-xl mx-auto w-full p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100 tracking-tight">{title}</h1>
          {subtitle && <p className="text-sm text-zinc-500 mt-1">{subtitle}</p>}
        </div>
        {actions && <div className="flex items-center gap-3">{actions}</div>}
      </div>
      <div className="w-full space-y-6">
        {children}
      </div>
    </div>
  );
}
