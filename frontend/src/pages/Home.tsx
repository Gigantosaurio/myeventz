import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout/MainLayout';
import { Input } from '../components/common';
import { EventCard } from '../components/features/EventCard/EventCard';
import { Search } from 'lucide-react';
import { eventService } from '../services';
import type { EventDetail } from '../types';
import './Home.css';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [popularEvents, setPopularEvents] = useState<EventDetail[]>([]);
  const [recentEvents, setRecentEvents] = useState<EventDetail[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar eventos al montar el componente
  useEffect(() => {
    const loadEvents = async () => {
      try {
        setIsLoading(true);
        const [popular, recent] = await Promise.all([
          eventService.getPopularEvents(10),
          eventService.getRecentEvents(20)
        ]);
        setPopularEvents(popular);
        setRecentEvents(recent);
      } catch (err) {
        console.error('Error loading events:', err);
        setError('Error al cargar los eventos');
      } finally {
        setIsLoading(false);
      }
    };

    loadEvents();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <MainLayout>
      <div className="home-page">
        {/* Header */}
        <header className="home-header">
          <h1>Inicio</h1>
        </header>

        {/* Contenido principal */}
        <div className="home-content">
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

          {/* Error */}
          {error && (
            <div className="home-error">
              <p>{error}</p>
            </div>
          )}

          {/* Loading */}
          {isLoading && (
            <div className="home-loading">
              <p>Cargando eventos...</p>
            </div>
          )}

          {/* Eventos populares */}
          {!isLoading && popularEvents.length > 0 && (
            <section className="home-section">
              <div className="home-section-header">
                <h2>Eventos populares:</h2>
              </div>
              <div className="home-events-grid">
                {popularEvents.map((event) => (
                  <EventCard key={event.id_evento} event={event} />
                ))}
              </div>
            </section>
          )}

          {/* Publicaciones recientes */}
          {!isLoading && recentEvents.length > 0 && (
            <section className="home-section">
              <div className="home-section-header">
                <h2>Publicaciones recientes:</h2>
              </div>
              <div className="home-events-grid">
                {recentEvents.map((event) => (
                  <EventCard key={event.id_evento} event={event} />
                ))}
              </div>
            </section>
          )}

          {/* No hay eventos */}
          {!isLoading && !error && popularEvents.length === 0 && recentEvents.length === 0 && (
            <div className="home-empty">
              <p>No hay eventos disponibles en este momento</p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};
