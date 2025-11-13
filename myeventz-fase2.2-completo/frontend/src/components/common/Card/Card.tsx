import React from 'react';
import './Card.css';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  clickable?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  hover = false,
  clickable = false,
  padding = 'md',
  children,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`card card-padding-${padding} ${hover ? 'card-hover' : ''} ${
        clickable ? 'card-clickable' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
