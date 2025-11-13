import React, { useState } from 'react';
import { MainLayout } from '../components/layout';
import { Tag } from '../components/common';
import { EventCard } from '../components/features/EventCard/EventCard';
import { colors } from '../styles/colors';
import './Categories.css';

/**
 * Categories - Pantalla de búsqueda por categorías
 * 
 * Permite al usuario:
 * - Ver todas las categorías disponibles
 * - Seleccionar múltiples categorías
 * - Filtrar eventos por categorías seleccionadas
 * 
 * TODO: Backend
 * - GET /api/categories - Obtener todas las categorías
 * - GET /api/events?categories=cat1,cat2 - Filtrar eventos por categorías
 */

// TODO: Mover esto a un archivo de constants cuando tengamos backend
const CATEGORIES = [
  { id: '1', name: 'Audiovisual', color: colors.categories.audiovisual },
  { id: '2', name: 'Baloncesto', color: colors.categories.baloncesto },
  { id: '3', name: 'Calistenia', color: colors.categories.calistenia },
  { id: '4', name: 'Ciclismo', color: colors.categories.ciclismo },
  { id: '5', name: 'Cocina', color: colors.categories.cocina },
  { id: '6', name: 'Crossfit', color: colors.categories.crossfit },
  { id: '7', name: 'Danza', color: colors.categories.danza },
  { id: '8', name: 'Escalada', color: colors.categories.escalada },
  { id: '9', name: 'Esgrima', color: colors.categories.esgrima },
  { id: '10', name: 'Fútbol', color: colors.categories.futbol },
  { id: '11', name: 'Gimnasia', color: colors.categories.gimnasia },
  { id: '12', name: 'Golf', color: colors.categories.golf },
  { id: '13', name: 'Karate', color: colors.categories.karate },
  { id: '14', name: 'Motocross', color: colors.categories.motocross },
];

// TODO: Estos datos vendrán del backend
const MOCK_EVENTS = [
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

export const Categories: React.FC = () => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Toggle de selección de categoría
   * TODO: Cuando tengamos backend, hacer fetch de eventos filtrados
   */
  const toggleCategory = async (categoryName: string) => {
    setSelectedCategories((prev) => {
      if (prev.includes(categoryName)) {
        return prev.filter((c) => c !== categoryName);
      } else {
        return [...prev, categoryName];
      }
    });

    // TODO: Llamar al backend para obtener eventos filtrados
    // setIsLoading(true);
    // try {
    //   const response = await api.get('/events', {
    //     params: { categories: selectedCategories.join(',') }
    //   });
    //   setEvents(response.data);
    // } catch (error) {
    //   console.error('Error fetching filtered events:', error);
    // } finally {
    //   setIsLoading(false);
    // }
  };

  /**
   * Limpiar filtros
   */
  const clearFilters = () => {
    setSelectedCategories([]);
    // TODO: Recargar todos los eventos
  };

  /**
   * Filtrar eventos por categorías seleccionadas (client-side temporal)
   * TODO: Esto se hará en el backend
   */
  const filteredEvents =
    selectedCategories.length > 0
      ? MOCK_EVENTS.filter((event) => selectedCategories.includes(event.category))
      : MOCK_EVENTS;

  return (
    <MainLayout>
      <div className="categories-page">
        {/* Header */}
        <header className="categories-header">
          <h1>Categorías</h1>
          <p>Selecciona las categorías que te interesan</p>
        </header>

        {/* Selección de categorías */}
        <section className="categories-selection">
          <div className="categories-grid">
            {CATEGORIES.map((category) => (
              <Tag
                key={category.id}
                color={category.color}
                selected={selectedCategories.includes(category.name)}
                onClick={() => toggleCategory(category.name)}
              >
                {category.name}
              </Tag>
            ))}
          </div>

          {/* Filtros activos */}
          {selectedCategories.length > 0 && (
            <div className="categories-active-filters">
              <span>
                {selectedCategories.length} {selectedCategories.length === 1 ? 'categoría' : 'categorías'}{' '}
                seleccionada{selectedCategories.length === 1 ? '' : 's'}
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
            {selectedCategories.length > 0
              ? `Eventos de ${selectedCategories.join(', ')}`
              : 'Todos los eventos'}
          </h2>

          {isLoading ? (
            <div className="categories-loading">Cargando eventos...</div>
          ) : filteredEvents.length > 0 ? (
            <div className="categories-events-grid">
              {filteredEvents.map((event) => (
                <EventCard key={event.id} {...event} />
              ))}
            </div>
          ) : (
            <div className="categories-empty">
              <p>No hay eventos en las categorías seleccionadas</p>
            </div>
          )}
        </section>
      </div>
    </MainLayout>
  );
};
