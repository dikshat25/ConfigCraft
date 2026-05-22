import React from 'react';

export default function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-bg-secondary border border-dashed border-border-emphasis rounded-xl">
      <div className="w-12 h-12 rounded-full bg-bg-tertiary flex items-center justify-center text-text-secondary mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-text-primary mb-1">{title}</h3>
      <p className="text-sm text-text-secondary mb-6 max-w-sm">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
}
