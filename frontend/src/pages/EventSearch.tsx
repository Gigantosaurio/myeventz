import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout/MainLayout';
import { Input, Tag, Button } from '../components/common';
import { EventCard } from '../components/features/EventCard/EventCard';
import { Search, Filter, X } from 'lucide-react';
import { colors } from '../styles/colors';
import './EventSearch.css';

// TODO: Obtener categorías desde la API
const CATEGORIES = [
  { name: 'Audiovisual', color: colors.categories.audiovisual },
  { name: 'Baloncesto', color: colors.categories.baloncesto },
  { name: 'Ciclismo', color: colors.categories.ciclismo },
  { name: 'Cocina', color: colors.categories.cocina },
  { name: 'Fútbol', color: colors.categories.futbol },
  { name: 'Gimnasia', color: colors.categories.gimnasia },
];

// TODO: Reemplazar con llamada real a la API
// const events = await eventService.searchEvents({ query, category, filters });
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
    title: 'Carrera Circuito MTB',
    imageUrl: 'https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=800',
    category: 'Ciclismo',
    categoryColor: colors.categories.ciclismo,
    date: '20/03/2024',
    location: 'Monte Torrero',
    participants: 27,
    maxParticipants: 50,
    likes: 35,
  },
  {
    id: '3',
    title: 'Competición BMX',
    imageUrl: 'https://images.unsplash.com/photo-1558981852-426c6c22a060?w=800',
    category: 'Ciclismo',
    categoryColor: colors.categories.ciclismo,
    date: '29/02/2025',
    location: 'Pistas BMX Zaragoza',
    participants: 24,
    maxParticipants: 30,
    likes: 56,
  },
];

export const EventSearch: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    // TODO: Realizar búsqueda cuando cambien los parámetros
    // const results = await eventService.searchEvents({
    //   query: searchQuery,
    //   category: selectedCategory,
    // });
    
    // Actualizar URL con parámetros de búsqueda
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (selectedCategory) params.set('category', selectedCategory);
    setSearchParams(params);
  }, [searchQuery, selectedCategory, setSearchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // La búsqueda se activa automáticamente por el useEffect
  };

  const handleCategoryFilter = (categoryName: string) => {
    if (selectedCategory === categoryName) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(categoryName);
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory(null);
  };

  // TODO: Filtrar eventos según los criterios
  const filteredEvents = MOCK_EVENTS;

  return (
    <MainLayout>
      <div className="event-search-page">
        {/* Header */}
        <header className="event-search-header">
          <h1>Buscar Eventos</h1>
        </header>

        {/* Contenido */}
        <div className="event-search-content">
          {/* Barra de búsqueda */}
          <div className="event-search-bar">
            <form onSubmit={handleSearch} className="event-search-form">
              <Input
                type="text"
                placeholder="Buscar eventos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={<Search size={20} />}
                fullWidth
              />
            </form>
            <Button
              variant={showFilters ? 'primary' : 'secondary'}
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={20} />
              Filtros
            </Button>
          </div>

          {/* Panel de filtros */}
          {showFilters && (
            <div className="event-search-filters">
              <div className="event-search-filters-header">
                <h3>Filtrar por categoría</h3>
                {(searchQuery || selectedCategory) && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    <X size={16} />
                    Limpiar filtros
                  </Button>
                )}
              </div>
              <div className="event-search-categories">
                {CATEGORIES.map((category) => (
                  <Tag
                    key={category.name}
                    color={category.color}
                    selected={selectedCategory === category.name}
                    onClick={() => handleCategoryFilter(category.name)}
                  >
                    {category.name}
                  </Tag>
                ))}
              </div>
            </div>
          )}

          {/* Resultados */}
          <div className="event-search-results">
            <div className="event-search-results-header">
              <h2>
                {filteredEvents.length} resultado{filteredEvents.length !== 1 ? 's' : ''}
                {searchQuery && ` para "${searchQuery}"`}
                {selectedCategory && ` en ${selectedCategory}`}
              </h2>
            </div>

            {filteredEvents.length > 0 ? (
              <div className="event-search-grid">
                {filteredEvents.map((event) => (
                  <EventCard key={event.id} {...event} />
                ))}
              </div>
            ) : (
              <div className="event-search-empty">
                <Search size={48} />
                <p>No se encontraron eventos</p>
                <Button variant="ghost" onClick={clearFilters}>
                  Limpiar filtros
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
