import React from 'react';

export default function UnsupportedField({ field }) {
  return (
    <div className="p-3 border border-dashed border-accent-amber/50 bg-accent-amber/5 rounded-lg flex items-center justify-between">
      <div>
        <span className="text-sm font-medium text-text-primary">Unsupported Field Type: </span>
        <code className="text-xs bg-bg-tertiary px-1 py-0.5 rounded text-accent-amber">{field.type}</code>
      </div>
      <div className="text-xs text-text-secondary">
        Field: <span className="font-mono text-text-primary">{field.name}</span>
      </div>
    </div>
  );
}
