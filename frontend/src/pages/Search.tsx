import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout/MainLayout';
import { Input, Card } from '../components/common';
import { Search as SearchIcon, User, Calendar } from 'lucide-react';
import { EventCard } from '../components/features/EventCard/EventCard';
import { colors } from '../styles/colors';
import './Search.css';

/**
 * Search - Búsqueda mixta de usuarios y eventos
 * Permite buscar tanto usuarios como eventos en una sola pantalla
 * Similar a la búsqueda de Instagram
 * 
 * TODO: Backend
 * - GET /api/search?q=query&type=all - Búsqueda mixta
 * - GET /api/search?q=query&type=users - Solo usuarios
 * - GET /api/search?q=query&type=events - Solo eventos
 */

interface UserResult {
  id: string;
  username: string;
  fullName: string;
  profilePicture?: string;
  bio?: string;
}

interface EventResult {
  id: string;
  title: string;
  imageUrl: string;
  category: string;
  categoryColor: string;
  date: string;
  location: string;
  participants: number;
  maxParticipants?: number;
}

// TODO: Obtener desde la API
// const results = await searchService.search({ query, type: 'all' });
const MOCK_USERS: UserResult[] = [
  {
    id: '1',
    username: 'mangelrogel420',
    fullName: 'Miguel Ángel Rogel Ruiz',
    bio: 'Amante del deporte y la aventura',
  },
  {
    id: '2',
    username: 'gamibliblio',
    fullName: 'Gabriel Milagro López',
    bio: 'Me gusta la edición de vídeo, salir con los amigos...',
  },
  {
    id: '3',
    username: 'carlosguevara',
    fullName: 'Carlos Fernández Guevara',
  },
];

const MOCK_EVENTS: EventResult[] = [
  {
    id: '1',
    title: 'Partido de fútbol 11',
    imageUrl: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800',
    category: 'Fútbol',
    categoryColor: colors.categories.futbol,
    date: '15/11/2024',
    location: 'Parque Grande',
    participants: 18,
    maxParticipants: 22,
  },
  {
    id: '2',
    title: 'Ruta en bici por el Ebro',
    imageUrl: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800',
    category: 'Ciclismo',
    categoryColor: colors.categories.ciclismo,
    date: '16/11/2024',
    location: 'Paseo Echegaray',
    participants: 8,
    maxParticipants: 15,
  },
  {
    id: '3',
    title: 'Taller de cocina asiática',
    imageUrl: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800',
    category: 'Cocina',
    categoryColor: colors.categories.cocina,
    date: '17/11/2024',
    location: 'Centro Cívico',
    participants: 10,
    maxParticipants: 12,
  },
];

type SearchTab = 'all' | 'users' | 'events';

export const Search: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<SearchTab>('all');

  // Filtrar resultados
  const filteredUsers = MOCK_USERS.filter(
    (user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredEvents = MOCK_EVENTS.filter(
    (event) =>
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const hasResults = filteredUsers.length > 0 || filteredEvents.length > 0;

  const handleUserClick = (userId: string) => {
    navigate(`/profile/${userId}`);
  };

  return (
    <MainLayout>
      <div className="search-page">
        {/* Header */}
        <header className="search-header">
          <h1>Buscar</h1>
        </header>

        {/* Contenido */}
        <div className="search-content">
          {/* Barra de búsqueda */}
          <div className="search-input-wrapper">
            <Input
              type="text"
              placeholder="Buscar usuarios o eventos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<SearchIcon size={20} />}
              fullWidth
            />
          </div>

          {/* Tabs */}
          <div className="search-tabs">
            <button
              className={`search-tab ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              Todo
            </button>
            <button
              className={`search-tab ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              <User size={18} />
              Usuarios {filteredUsers.length > 0 && `(${filteredUsers.length})`}
            </button>
            <button
              className={`search-tab ${activeTab === 'events' ? 'active' : ''}`}
              onClick={() => setActiveTab('events')}
            >
              <Calendar size={18} />
              Eventos {filteredEvents.length > 0 && `(${filteredEvents.length})`}
            </button>
          </div>

          {/* Resultados */}
          {searchQuery === '' ? (
            <div className="search-empty-state">
              <SearchIcon size={64} />
              <h3>Busca usuarios o eventos</h3>
              <p>Escribe en la barra de búsqueda para encontrar personas o eventos</p>
            </div>
          ) : !hasResults ? (
            <div className="search-empty-state">
              <SearchIcon size={64} />
              <h3>No se encontraron resultados</h3>
              <p>Intenta con otras palabras clave</p>
            </div>
          ) : (
            <div className="search-results">
              {/* Usuarios */}
              {(activeTab === 'all' || activeTab === 'users') && filteredUsers.length > 0 && (
                <section className="search-section">
                  <h2 className="search-section-title">
                    <User size={20} />
                    Usuarios
                  </h2>
                  <div className="search-users-list">
                    {filteredUsers.map((user) => (
                      <Card
                        key={user.id}
                        className="search-user-card"
                        hover
                        clickable
                        onClick={() => handleUserClick(user.id)}
                      >
                        <div className="search-user-avatar">
                          {user.profilePicture ? (
                            <img src={user.profilePicture} alt={user.username} />
                          ) : (
                            <User size={24} />
                          )}
                        </div>
                        <div className="search-user-info">
                          <h3 className="search-user-name">{user.fullName}</h3>
                          <p className="search-user-username">@{user.username}</p>
                          {user.bio && <p className="search-user-bio">{user.bio}</p>}
                        </div>
                      </Card>
                    ))}
                  </div>
                </section>
              )}

              {/* Eventos */}
              {(activeTab === 'all' || activeTab === 'events') && filteredEvents.length > 0 && (
                <section className="search-section">
                  <h2 className="search-section-title">
                    <Calendar size={20} />
                    Eventos
                  </h2>
                  <div className="search-events-grid">
                    {filteredEvents.map((event) => (
                      <EventCard key={event.id} {...event} />
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};
