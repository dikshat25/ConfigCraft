import React from 'react';
import { getComponent } from '../../engine/componentRegistry';
import FallbackRenderer from './FallbackRenderer';

export default function DynamicField({ field, value, onChange, error }) {
  const Component = getComponent(field.type);

  return (
    <FallbackRenderer>
      <Component 
        field={field} 
        value={value} 
        onChange={onChange} 
        error={error} 
      />
    </FallbackRenderer>
  );
}
