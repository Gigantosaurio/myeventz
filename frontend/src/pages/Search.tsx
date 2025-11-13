import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout/MainLayout';
import { Input } from '../components/common';
import { Search as SearchIcon } from 'lucide-react';
import { EventCard } from '../components/features/EventCard/EventCard';
import { eventService } from '../services';
import type { EventDetail } from '../types';
import './Search.css';

export const Search: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [events, setEvents] = useState<EventDetail[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar eventos cuando cambia la búsqueda
  useEffect(() => {
    const loadEvents = async () => {
      if (!searchQuery.trim()) {
        setEvents([]);
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const results = await eventService.searchEvents(searchQuery);
        setEvents(results);
      } catch (err) {
        console.error('Error searching events:', err);
        setError('Error al buscar eventos');
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(loadEvents, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <MainLayout>
      <div className="search-page">
        {/* Header */}
        <header className="search-header">
          <h1>Buscar Eventos</h1>
        </header>

        {/* Barra de búsqueda */}
        <section className="search-bar-section">
          <form onSubmit={handleSubmit} className="search-form">
            <Input
              type="text"
              placeholder="Buscar eventos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<SearchIcon size={20} />}
              fullWidth
            />
          </form>
        </section>

        {/* Resultados */}
        <section className="search-results">
          {error && (
            <div className="search-error">
              <p>{error}</p>
            </div>
          )}

          {isLoading && (
            <div className="search-loading">
              <p>Buscando...</p>
            </div>
          )}

          {!isLoading && searchQuery && events.length > 0 && (
            <>
              <h2 className="search-section-title">
                {events.length} evento{events.length !== 1 ? 's' : ''} encontrado{events.length !== 1 ? 's' : ''}
              </h2>
              <div className="search-events-grid">
                {events.map((event) => (
                  <EventCard key={event.id_evento} event={event} />
                ))}
              </div>
            </>
          )}

          {!isLoading && searchQuery && events.length === 0 && !error && (
            <div className="search-empty">
              <SearchIcon size={48} />
              <p>No se encontraron eventos con "{searchQuery}"</p>
              <p className="search-empty-hint">Intenta con otro término de búsqueda</p>
            </div>
          )}

          {!searchQuery && !isLoading && (
            <div className="search-empty">
              <SearchIcon size={48} />
              <p>Escribe algo para buscar eventos</p>
            </div>
          )}
        </section>
      </div>
    </MainLayout>
  );
};
