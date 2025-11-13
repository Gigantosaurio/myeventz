import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Logo } from '../../common';
import { Home, Tag, Plus, Search, User, LogOut, Menu, X } from 'lucide-react';
import './Sidebar.css';

/**
 * Sidebar - Navegación lateral principal de la aplicación
 * 
 * Características:
 * - Navegación con 5 items principales
 * - Indicador visual del item activo
 * - Información del usuario en la parte inferior
 * - Botón de logout
 * - Modo colapsable (hamburguesa)
 * 
 * TODO: Conectar con el backend para obtener datos del usuario real
 */

interface SidebarProps {
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ className = '' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // TODO: Obtener datos del usuario del contexto o del localStorage
  // TODO: Cuando tengamos backend, hacer fetch a /api/auth/me
  const currentUser = {
    fullName: 'Miguel Ángel Rogel R',
    username: '@mangelrogel420',
    avatar: null, // TODO: Implementar subida de avatar
  };

  const navItems = [
    { icon: Home, label: 'Home', path: '/home' },
    { icon: Tag, label: 'Categorías', path: '/categories' },
    { icon: Plus, label: 'Crear Evento', path: '/create-event' },
    { icon: Search, label: 'Buscar', path: '/search' },
    { icon: User, label: 'Mi Perfil', path: '/profile' },
  ];

  const handleLogout = () => {
    // TODO: Llamar a /api/auth/logout si tenemos backend
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''} ${className}`}>
      {/* Toggle button */}
      <button
        className="sidebar-toggle"
        onClick={toggleSidebar}
        aria-label={isCollapsed ? 'Expandir menú' : 'Colapsar menú'}
      >
        {isCollapsed ? <Menu size={20} /> : <X size={20} />}
      </button>

      {/* Logo */}
      <div className="sidebar-header">
        {!isCollapsed && <Logo size="md" />}
      </div>

      {/* Navegación principal */}
      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <button
              key={item.path}
              className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
              aria-label={item.label}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon size={20} />
              {!isCollapsed && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Usuario en la parte inferior */}
      <div className="sidebar-footer">
        {isCollapsed ? (
          <button
            className="sidebar-user-collapsed"
            onClick={handleProfileClick}
            title="Mi perfil"
          >
            {currentUser.avatar ? (
              <img src={currentUser.avatar} alt={currentUser.fullName} />
            ) : (
              <span>{currentUser.fullName.charAt(0)}</span>
            )}
          </button>
        ) : (
          <>
            <div className="sidebar-user" onClick={handleProfileClick}>
              <div className="sidebar-user-avatar">
                {currentUser.avatar ? (
                  <img src={currentUser.avatar} alt={currentUser.fullName} />
                ) : (
                  <span>{currentUser.fullName.charAt(0)}</span>
                )}
              </div>
              <div className="sidebar-user-info">
                <p className="sidebar-user-name">{currentUser.fullName}</p>
                <p className="sidebar-user-username">{currentUser.username}</p>
              </div>
            </div>

            {/* Botón de logout */}
            <button
              className="sidebar-logout"
              onClick={handleLogout}
              aria-label="Cerrar sesión"
            >
              <LogOut size={20} />
            </button>
          </>
        )}
      </div>
    </aside>
  );
};
