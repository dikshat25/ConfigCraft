import React, { forwardRef } from 'react';
import { getLabel } from '../../../engine/localizationEngine';
import { useLocale } from '../../../hooks/useLocale';

const CheckboxInput = forwardRef(({ field, error, className = '', value, onChange, ...props }, ref) => {
  const { locale } = useLocale();
  const label = getLabel(field.label, locale);

  return (
    <div className={`flex flex-col w-full ${className}`}>
      <label className="flex items-center gap-3 cursor-pointer group">
        <div className="relative flex items-center justify-center">
          <input
            ref={ref}
            type="checkbox"
            className="peer sr-only"
            checked={Boolean(value)}
            onChange={onChange}
            required={field.required}
            {...props}
          />
          <div className="w-5 h-5 border-2 rounded transition-colors border-border-subtle bg-bg-tertiary peer-checked:bg-accent-emerald peer-checked:border-accent-emerald peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-bg-primary peer-focus-visible:ring-accent-emerald group-hover:border-accent-emerald/50"></div>
          {value && (
            <svg className="absolute w-3.5 h-3.5 text-bg-primary pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
        <span className="text-sm font-medium text-text-primary">{label}</span>
      </label>
      {error && <span className="mt-1 text-xs text-accent-danger">{error}</span>}
    </div>
  );
});

CheckboxInput.displayName = 'CheckboxInput';
export default CheckboxInput;
