import React from 'react';
import { Sidebar } from '../Sidebar/Sidebar';
import './MainLayout.css';

/**
 * MainLayout - Layout principal de la aplicación con Sidebar
 * 
 * Envuelve todas las páginas principales de la app
 * Incluye el Sidebar lateral y un área de contenido
 * 
 * Uso:
 * <MainLayout>
 *   <YourPageComponent />
 * </MainLayout>
 */

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="main-layout">
      <Sidebar />
      <main className="main-layout-content">
        {children}
      </main>
    </div>
  );
};
