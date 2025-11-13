import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Logo } from '../components/common';
import { LogOut, Search, Plus, User } from 'lucide-react';
import './Home.css';

export const Home: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // TODO: Limpiar token y usuario del localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="home-container">
      {/* Header temporal */}
      <header className="home-header">
        <Logo size="md" />
        <Button variant="ghost" onClick={handleLogout}>
          <LogOut size={20} />
          Cerrar Sesión
        </Button>
      </header>

      {/* Contenido temporal */}
      <div className="home-content">
        <div className="home-welcome">
          <h1>🎉 ¡Login Exitoso!</h1>
          <p>Has iniciado sesión correctamente en MyEventz</p>
        </div>

        <div className="home-placeholder">
          <div className="placeholder-card">
            <Search size={48} />
            <h3>Buscar Eventos</h3>
            <p>Próximamente podrás buscar eventos por categorías</p>
          </div>

          <div className="placeholder-card">
            <Plus size={48} />
            <h3>Crear Evento</h3>
            <p>Próximamente podrás crear tus propios eventos</p>
          </div>

          <div className="placeholder-card">
            <User size={48} />
            <h3>Mi Perfil</h3>
            <p>Próximamente podrás gestionar tu perfil</p>
          </div>
        </div>

        <div className="home-status">
          <p>✅ Fase 1: Componentes base completada</p>
          <p>✅ Fase 2.1: Pantalla de Login completada</p>
          <p>🚧 Fase 2.2: Pantalla de Registro (próximamente)</p>
        </div>
      </div>
    </div>
  );
};
