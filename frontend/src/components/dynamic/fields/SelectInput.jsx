import React, { forwardRef } from 'react';
import { getLabel } from '../../../engine/localizationEngine';
import { useLocale } from '../../../hooks/useLocale';

const SelectInput = forwardRef(({ field, error, className = '', ...props }, ref) => {
  const { locale } = useLocale();
  const label = getLabel(field.label, locale);
  const options = field.options || [];

  return (
    <div className="flex flex-col w-full">
      {label && <label className="mb-1 text-sm font-medium text-text-secondary">{label}</label>}
      <select
        ref={ref}
        className={`w-full bg-bg-tertiary border text-text-primary rounded-lg px-3 py-2 outline-none transition-colors appearance-none
          ${error ? 'border-accent-danger focus:border-accent-danger focus:ring-1 focus:ring-accent-danger/20' : 'border-border-subtle focus:border-accent-emerald focus:ring-1 focus:ring-accent-emerald/20'} 
          ${className}`}
        required={field.required}
        {...props}
      >
        <option value="" disabled>Select an option</option>
        {options.map((opt, i) => (
          <option key={i} value={opt.value}>
            {getLabel(opt.label, locale)}
          </option>
        ))}
      </select>
      {error && <span className="mt-1 text-xs text-accent-danger">{error}</span>}
    </div>
  );
});

SelectInput.displayName = 'SelectInput';
export default SelectInput;
