import React from 'react';
import { Logo } from '../../common';
import './AuthLayout.css';

interface AuthLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  showHeader?: boolean;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ 
  children, 
  title = '¡Bienvenido!',
  subtitle = 'Tu portal de actividades y experiencias en Zaragoza.',
  showHeader = true 
}) => {
  return (
    <div className="auth-layout">
      <div className="auth-layout-container">
        {showHeader && (
          <div className="auth-layout-header">
            <div className="auth-layout-header-left">
              <Logo size="md" />
            </div>
            <div className="auth-layout-header-right">
              <h1 className="auth-layout-title">{title}</h1>
              <p className="auth-layout-subtitle">{subtitle}</p>
            </div>
          </div>
        )}
        <div className="auth-layout-content">
          {children}
        </div>
      </div>
    </div>
  );
};
