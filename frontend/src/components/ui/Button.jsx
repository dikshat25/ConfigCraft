import React from 'react';

export default function Button({ children, variant = 'primary', className = '', ...props }) {
  const baseStyle = "inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-bg-primary";
  const variants = {
    primary: "bg-accent-emerald text-bg-primary hover:bg-emerald-400 focus:ring-accent-emerald",
    secondary: "bg-bg-tertiary text-text-primary border border-border-subtle hover:bg-border-subtle focus:ring-text-secondary",
    ghost: "bg-transparent text-text-secondary hover:text-text-primary hover:bg-bg-tertiary focus:ring-border-subtle",
    danger: "bg-transparent text-accent-danger hover:bg-accent-danger/10 focus:ring-accent-danger"
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
