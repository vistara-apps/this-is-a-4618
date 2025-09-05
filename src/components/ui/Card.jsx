import React from 'react';

const Card = ({ 
  children, 
  variant = 'default', 
  className = '',
  onClick 
}) => {
  const baseClasses = 'rounded-lg shadow-card';
  
  const variants = {
    default: 'bg-surface text-primary',
    outline: 'border border-primary/20 bg-surface text-primary',
    interactive: 'bg-surface text-primary hover:shadow-modal transition-shadow cursor-pointer glass-card',
    glass: 'glass-card text-white'
  };
  
  return (
    <div 
      className={`${baseClasses} ${variants[variant]} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;