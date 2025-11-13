import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout/MainLayout';
import { Input, Tag } from '../components/common';
import { EventCard } from '../components/features/EventCard/EventCard';
import { Search } from 'lucide-react';
import { eventService, categoryService } from '../services';
import type { Category, EventDetail } from '../types';
import './EventSearch.css';

export const EventSearch: React.FC = () => {
  const [searchParams] = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [events, setEvents] = useState<EventDetail[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar categorías al montar
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const cats = await categoryService.getAllCategories();
        setCategories(cats);
      } catch (err) {
        console.error('Error loading categories:', err);
      }
    };
    loadCategories();
  }, []);

  // Buscar eventos cuando cambien filtros
  useEffect(() => {
    const loadEvents = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const results = await eventService.searchEvents(
          searchQuery || undefined,
          selectedCategory ? [selectedCategory] : undefined
        );
        setEvents(results);
      } catch (err) {
        console.error('Error searching events:', err);
        setError('Error al buscar eventos');
      } finally {
        setIsLoading(false);
      }
    };

    loadEvents();
  }, [searchQuery, selectedCategory]);

  return (
    <MainLayout>
      <div className="event-search-page">
        <header className="event-search-header">
          <h1>Buscar Eventos</h1>
        </header>

        <section className="event-search-filters">
          <Input
            type="text"
            placeholder="Buscar eventos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search size={20} />}
            fullWidth
          />

          <div className="event-search-categories">
            <Tag
              color="#7c3aed"
              selected={selectedCategory === null}
              onClick={() => setSelectedCategory(null)}
            >
              Todas
            </Tag>
            {categories.slice(0, 6).map((category) => (
              <Tag
                key={category.id_categoria}
                color={category.color}
                selected={selectedCategory === category.id_categoria}
                onClick={() => setSelectedCategory(category.id_categoria)}
              >
                {category.categoria}
              </Tag>
            ))}
          </div>
        </section>

        <section className="event-search-results">
          {error && (
            <div className="event-search-error">
              <p>{error}</p>
            </div>
          )}

          {isLoading ? (
            <div className="event-search-loading">Buscando...</div>
          ) : events.length > 0 ? (
            <>
              <h2>
                {events.length} evento{events.length !== 1 ? 's' : ''} encontrado{events.length !== 1 ? 's' : ''}
              </h2>
              <div className="event-search-grid">
                {events.map((event) => (
                  <EventCard key={event.id_evento} event={event} />
                ))}
              </div>
            </>
          ) : (
            <div className="event-search-empty">
              <Search size={48} />
              <p>No se encontraron eventos</p>
            </div>
          )}
        </section>
      </div>
    </MainLayout>
  );
};
