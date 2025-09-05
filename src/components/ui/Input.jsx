import React from 'react';

const Input = ({ 
  label,
  className = '',
  ...props 
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium mb-2 text-white">
          {label}
        </label>
      )}
      <input
        className={`w-full px-3 py-2 border border-white/20 rounded-md bg-white/10 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent ${className}`}
        {...props}
      />
    </div>
  );
};

export default Input;