import React, { useState } from 'react';
import { Sidebar } from '../Sidebar/Sidebar';
import './MainLayout.css';

/**
 * MainLayout - Layout principal de la aplicación con Sidebar
 *
 * Envuelve todas las páginas principales de la app
 * Incluye el Sidebar lateral y un área de contenido responsive
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
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className={`main-layout ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <Sidebar onCollapse={setIsSidebarCollapsed} />
      <main className="main-layout-content">
        {children}
      </main>
    </div>
  );
};
