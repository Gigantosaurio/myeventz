import React, { useState } from 'react';
import { MainLayout } from '../components/layout';
import { Tag, Input } from '../components/common';
import { EventCard } from '../components/features/EventCard/EventCard';
import { Search } from 'lucide-react';
import { colors } from '../styles/colors';
import './Categories.css';

/**
 * Categories - Pantalla de búsqueda por categorías
 * 
 * Permite al usuario:
 * - Ver todas las categorías disponibles
 * - Seleccionar múltiples categorías
 * - Buscar eventos por texto
 * - Filtrar eventos por categorías seleccionadas
 * 
 * TODO: Backend
 * - GET /api/categories - Obtener todas las categorías
 * - GET /api/events?categories=cat1,cat2&search=texto - Filtrar eventos
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
  {
    id: '3',
    title: 'Partido de fútbol 11',
    imageUrl: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800',
    category: 'Fútbol',
    categoryColor: colors.categories.futbol,
    date: '15/11/2024',
    location: 'Campo Municipal',
    participants: 18,
    maxParticipants: 22,
  },
  {
    id: '4',
    title: 'Clase de cocina italiana',
    imageUrl: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800',
    category: 'Cocina',
    categoryColor: colors.categories.cocina,
    date: '20/11/2024',
    location: 'Escuela de Hostelería',
    participants: 8,
    maxParticipants: 12,
  },
];

export const Categories: React.FC = () => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
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
    //     params: { 
    //       categories: selectedCategories.join(','),
    //       search: searchQuery 
    //     }
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
    setSearchQuery('');
    // TODO: Recargar todos los eventos
  };

  /**
   * Filtrar eventos por categorías y búsqueda (client-side temporal)
   * TODO: Esto se hará en el backend
   */
  const filteredEvents = MOCK_EVENTS.filter((event) => {
    const matchesCategory =
      selectedCategories.length === 0 || selectedCategories.includes(event.category);
    const matchesSearch =
      searchQuery === '' ||
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
            {filteredEvents.length} evento{filteredEvents.length !== 1 ? 's' : ''} encontrado
            {filteredEvents.length !== 1 ? 's' : ''}
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
