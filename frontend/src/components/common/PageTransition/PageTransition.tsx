import React from 'react';
import './PageTransition.css';

interface PageTransitionProps {
  children: React.ReactNode;
  direction?: 'left' | 'right' | 'up' | 'down';
}

export const PageTransition: React.FC<PageTransitionProps> = ({ 
  children, 
  direction = 'right' 
}) => {
  return (
    <div className={`page-transition page-transition-${direction}`}>
      {children}
    </div>
  );
};
