import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo, Input, Button } from '../components/common';
import { BottomNav } from '../components/layout/BottomNav/BottomNav';
import { EventCard } from '../components/features/EventCard/EventCard';
import { Search, Bell, LogOut } from 'lucide-react';
import { colors } from '../styles/colors';
import './Home.css';

// Datos de ejemplo
const POPULAR_EVENTS = [
  {
    id: '1',
    title: 'MB Universitarios',
    imageUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800',
    category: 'Ciclismo',
    categoryColor: colors.categories.ciclismo,
    date: '14/02/2024',
    location: 'Parque Grande',
    participants: 37,
    likes: 18,
  },
  {
    id: '2',
    title: 'Torneo Mortal Kombat',
    imageUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800',
    category: 'Audiovisual',
    categoryColor: colors.categories.audiovisual,
    date: '17/03/2024',
    location: 'Centro Cívico',
    participants: 16,
    maxParticipants: 32,
    likes: 45,
  },
];

const RECENT_POSTS = [
  {
    id: '3',
    title: 'Partido Volleyball San Valero',
    imageUrl: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800',
    category: 'Baloncesto',
    categoryColor: colors.categories.baloncesto,
    date: '26/02/2024',
    location: 'Centro deportivo municipal La Almozara',
    participants: 8,
  },
  {
    id: '4',
    title: 'Game of S.K.A.T.E.',
    imageUrl: 'https://images.unsplash.com/photo-1547447134-cd3f5c716030?w=800',
    category: 'Escalada',
    categoryColor: colors.categories.escalada,
    date: '25/02/2025',
    location: 'Skate Park Parque del Emeral',
    participants: 12,
    maxParticipants: 20,
  },
];

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="home-page">
      {/* Header */}
      <header className="home-header">
        <div className="home-header-content">
          <Logo size="sm" />
          <div className="home-header-actions">
            <button className="home-icon-button" aria-label="Notificaciones">
              <Bell size={20} />
            </button>
            <button className="home-icon-button" onClick={handleLogout} aria-label="Cerrar sesión">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="home-content">
        {/* Búsqueda */}
        <section className="home-search-section">
          <form onSubmit={handleSearch} className="home-search-form">
            <Input
              type="text"
              placeholder="Buscar eventos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search size={20} />}
              fullWidth
            />
          </form>
        </section>

        {/* Eventos populares */}
        <section className="home-section">
          <div className="home-section-header">
            <h2>Eventos populares:</h2>
          </div>
          <div className="home-events-grid">
            {POPULAR_EVENTS.map((event) => (
              <EventCard key={event.id} {...event} />
            ))}
          </div>
        </section>

        {/* Publicaciones recientes */}
        <section className="home-section">
          <div className="home-section-header">
            <h2>Publicaciones recientes:</h2>
          </div>
          <div className="home-events-grid">
            {RECENT_POSTS.map((event) => (
              <EventCard key={event.id} {...event} />
            ))}
          </div>
        </section>
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};
