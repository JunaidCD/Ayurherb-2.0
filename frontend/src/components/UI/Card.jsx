import React from 'react';

const Card = ({ 
  children, 
  className = '', 
  hover = false, 
  gradient = false,
  glass = false 
}) => {
  const baseClasses = 'rounded-xl border border-dark-700 p-6';
  const hoverClasses = hover ? 'card-hover' : '';
  const gradientClasses = gradient ? 'gradient-bg' : 'bg-dark-800';
  const glassClasses = glass ? 'glass-dark' : '';
  
  return (
    <div className={`${baseClasses} ${gradientClasses} ${glassClasses} ${hoverClasses} ${className}`}>
      {children}
    </div>
  );
};

export default Card;
