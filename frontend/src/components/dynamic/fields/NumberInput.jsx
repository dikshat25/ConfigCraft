import React, { forwardRef } from 'react';
import Input from '../../ui/Input';
import { getLabel } from '../../../engine/localizationEngine';
import { useLocale } from '../../../hooks/useLocale';

const NumberInput = forwardRef(({ field, error, ...props }, ref) => {
  const { locale } = useLocale();
  const label = getLabel(field.label, locale);

  return (
    <Input
      ref={ref}
      type="number"
      label={label}
      error={error}
      required={field.required}
      min={field.validation?.min}
      max={field.validation?.max}
      {...props}
    />
  );
});

NumberInput.displayName = 'NumberInput';
export default NumberInput;
