import React from 'react';

export default function Card({ children, className = '', ...props }) {
  return (
    <div className={`bg-bg-secondary border border-border-subtle rounded-xl shadow-card overflow-hidden ${className}`} {...props}>
      {children}
    </div>
  );
}
