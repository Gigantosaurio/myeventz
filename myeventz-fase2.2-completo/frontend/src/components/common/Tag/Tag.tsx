import React from 'react';
import './Tag.css';

interface TagProps {
  children: React.ReactNode;
  color?: string;
  selected?: boolean;
  onClick?: () => void;
  size?: 'sm' | 'md';
}

export const Tag: React.FC<TagProps> = ({
  children,
  color = '#8b5cf6',
  selected = false,
  onClick,
  size = 'md',
}) => {
  return (
    <span
      className={`tag tag-${size} ${selected ? 'tag-selected' : ''} ${onClick ? 'tag-clickable' : ''}`}
      style={{ 
        '--tag-color': color,
        backgroundColor: selected ? color : 'transparent',
        borderColor: color,
      } as React.CSSProperties}
      onClick={onClick}
    >
      {children}
    </span>
  );
};
