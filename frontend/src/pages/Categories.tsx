import React, { useState, useEffect } from 'react';
import { MainLayout } from '../components/layout';
import { Tag, Input } from '../components/common';
import { EventCard } from '../components/features/EventCard/EventCard';
import { Search } from 'lucide-react';
import { categoryService, eventService } from '../services';
import type { Category, EventDetail } from '../types';
import './Categories.css';

export const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
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

  // Cargar eventos cuando cambian los filtros
  useEffect(() => {
    const loadEvents = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const results = await eventService.searchEvents(
          searchQuery || undefined,
          selectedCategories.length > 0 ? selectedCategories : undefined
        );
        setEvents(results);
      } catch (err) {
        console.error('Error loading events:', err);
        setError('Error al cargar los eventos');
      } finally {
        setIsLoading(false);
      }
    };

    loadEvents();
  }, [selectedCategories, searchQuery]);

  const toggleCategory = (categoryId: number) => {
    setSelectedCategories((prev) => {
      if (prev.includes(categoryId)) {
        return prev.filter((id) => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSearchQuery('');
  };

  const hasActiveFilters = selectedCategories.length > 0 || searchQuery !== '';

  return (
    <MainLayout>
      <div className="categories-page">
        {/* Header */}
        <header className="categories-header">
          <h1>Buscar Eventos</h1>
          <p>Busca por texto y filtra por categorías</p>
        </header>

        {/* Búsqueda por texto */}
        <section className="categories-search">
          <Input
            type="text"
            placeholder="Buscar por título o ubicación..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search size={20} />}
            fullWidth
          />
        </section>

        {/* Selección de categorías */}
        <section className="categories-selection">
          <h3 className="categories-selection-title">Filtrar por categoría</h3>
          <div className="categories-grid">
            {categories.map((category) => (
              <Tag
                key={category.id_categoria}
                color={category.color}
                selected={selectedCategories.includes(category.id_categoria)}
                onClick={() => toggleCategory(category.id_categoria)}
              >
                {category.categoria}
              </Tag>
            ))}
          </div>

          {/* Filtros activos */}
          {hasActiveFilters && (
            <div className="categories-active-filters">
              <span>
                {selectedCategories.length > 0 &&
                  `${selectedCategories.length} ${
                    selectedCategories.length === 1 ? 'categoría' : 'categorías'
                  } seleccionada${selectedCategories.length === 1 ? '' : 's'}`}
                {searchQuery && selectedCategories.length > 0 && ' • '}
                {searchQuery && `Búsqueda: "${searchQuery}"`}
              </span>
              <button className="categories-clear-button" onClick={clearFilters}>
                Limpiar filtros
              </button>
            </div>
          )}
        </section>

        {/* Resultados */}
        <section className="categories-results">
          <h2>
            {events.length} evento{events.length !== 1 ? 's' : ''} encontrado
            {events.length !== 1 ? 's' : ''}
          </h2>

          {error && (
            <div className="categories-error">
              <p>{error}</p>
            </div>
          )}

          {isLoading ? (
            <div className="categories-loading">Cargando eventos...</div>
          ) : events.length > 0 ? (
            <div className="categories-events-grid">
              {events.map((event) => (
                <EventCard key={event.id_evento} event={event} />
              ))}
            </div>
          ) : (
            <div className="categories-empty">
              <Search size={48} />
              <p>No se encontraron eventos con los filtros aplicados</p>
              {hasActiveFilters && (
                <button className="categories-clear-button" onClick={clearFilters}>
                  Limpiar filtros
                </button>
              )}
            </div>
          )}
        </section>
      </div>
    </MainLayout>
  );
};
