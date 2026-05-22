import React, { forwardRef } from 'react';
import { getLabel } from '../../../engine/localizationEngine';
import { useLocale } from '../../../hooks/useLocale';

const TextareaInput = forwardRef(({ field, error, className = '', ...props }, ref) => {
  const { locale } = useLocale();
  const label = getLabel(field.label, locale);

  return (
    <div className="flex flex-col w-full">
      {label && <label className="mb-1 text-sm font-medium text-text-secondary">{label}</label>}
      <textarea
        ref={ref}
        rows={4}
        className={`w-full bg-bg-tertiary border text-text-primary rounded-lg px-3 py-2 outline-none transition-colors 
          ${error ? 'border-accent-danger focus:border-accent-danger focus:ring-1 focus:ring-accent-danger/20' : 'border-border-subtle focus:border-accent-emerald focus:ring-1 focus:ring-accent-emerald/20'} 
          ${className}`}
        required={field.required}
        placeholder={`Enter ${label.toLowerCase()}...`}
        {...props}
      />
      {error && <span className="mt-1 text-xs text-accent-danger">{error}</span>}
    </div>
  );
});

TextareaInput.displayName = 'TextareaInput';
export default TextareaInput;
