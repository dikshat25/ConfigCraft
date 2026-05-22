import React, { forwardRef } from 'react';
import Input from '../../ui/Input';
import { getLabel } from '../../../engine/localizationEngine';
import { useLocale } from '../../../hooks/useLocale';

const TextInput = forwardRef(({ field, error, ...props }, ref) => {
  const { locale } = useLocale();
  const label = getLabel(field.label, locale);
  const type = ['email', 'password', 'date'].includes(field.type) ? field.type : 'text';

  return (
    <Input
      ref={ref}
      type={type}
      label={label}
      error={error}
      required={field.required}
      placeholder={`Enter ${label.toLowerCase()}...`}
      {...props}
    />
  );
});

TextInput.displayName = 'TextInput';
export default TextInput;
