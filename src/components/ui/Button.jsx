import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  onClick,
  disabled = false,
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
  
  const variants = {
    primary: 'bg-accent text-white hover:bg-accent/90 focus:ring-accent',
    secondary: 'bg-surface text-primary border border-primary/20 hover:bg-primary/5 focus:ring-primary',
    destructive: 'bg-destructive text-white hover:bg-destructive/90 focus:ring-destructive',
    outline: 'border border-white/20 text-white hover:bg-white/10 focus:ring-white',
    ghost: 'text-white hover:bg-white/10 focus:ring-white'
  };
  
  const sizes = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-10 px-4 py-2',
    lg: 'h-12 px-6 text-lg'
  };
  
  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;