import React from 'react';
import { MapPin } from 'lucide-react';
import './Logo.css';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', showIcon = true }) => {
  return (
    <div className={`logo logo-${size}`}>
      <span className="logo-text">MyEventz</span>
      {showIcon && <MapPin className="logo-icon" />}
    </div>
  );
};
