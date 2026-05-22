import React from 'react';
import PageWrapper from '../components/layout/PageWrapper';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useWarningStore } from '../store/warningStore';
import { AlertTriangle, Trash2 } from 'lucide-react';

export default function ErrorMonitor() {
  const { warnings, clearWarnings } = useWarningStore();

  return (
    <PageWrapper 
      title="Error Monitor" 
      actions={
        <Button variant="secondary" onClick={clearWarnings} disabled={warnings.length === 0}>
          <Trash2 size={16} className="mr-2" /> Clear All
        </Button>
      }
    >
      <Card className="overflow-hidden">
        {warnings.length === 0 ? (
          <div className="p-12 text-center text-text-secondary">
            <div className="inline-flex w-12 h-12 rounded-full bg-bg-tertiary items-center justify-center mb-4">
              <AlertTriangle size={24} />
            </div>
            <p>No warnings recorded in this session.</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-bg-tertiary border-b border-border-subtle">
                <th className="px-4 py-3 text-xs font-semibold text-text-secondary uppercase">Severity</th>
                <th className="px-4 py-3 text-xs font-semibold text-text-secondary uppercase">Field</th>
                <th className="px-4 py-3 text-xs font-semibold text-text-secondary uppercase">Issue</th>
                <th className="px-4 py-3 text-xs font-semibold text-text-secondary uppercase">Action Taken</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {warnings.map((w, i) => (
                <tr key={i} className="hover:bg-bg-tertiary/50">
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${w.severity === 'warn' ? 'bg-accent-amber/10 text-accent-amber' : 'bg-accent-indigo/10 text-accent-indigo'}`}>
                      {w.severity.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm font-mono text-text-primary">{w.field}</td>
                  <td className="px-4 py-3 text-sm text-text-secondary">{w.issue}</td>
                  <td className="px-4 py-3 text-sm text-accent-emerald">{w.action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </PageWrapper>
  );
}
