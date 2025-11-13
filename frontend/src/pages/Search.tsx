import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout/MainLayout';
import { Input, Card } from '../components/common';
import { Search as SearchIcon, User } from 'lucide-react';
import { EventCard } from '../components/features/EventCard/EventCard';
import { eventService, userService } from '../services';
import { getProfileImageUrl } from '../utils/imageUtils';
import type { EventDetail, User as UserType } from '../types';
import './Search.css';

type SearchTab = 'events' | 'users';

export const Search: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<SearchTab>('events');
  const [searchQuery, setSearchQuery] = useState('');
  const [events, setEvents] = useState<EventDetail[]>([]);
  const [users, setUsers] = useState<UserType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar resultados cuando cambia la búsqueda o el tab
  useEffect(() => {
    const loadResults = async () => {
      if (!searchQuery.trim()) {
        setEvents([]);
        setUsers([]);
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        if (activeTab === 'events') {
          const results = await eventService.searchEvents(searchQuery);
          setEvents(results);
        } else {
          const results = await userService.searchUsers(searchQuery);
          setUsers(results);
        }
      } catch (err) {
        console.error('Error searching:', err);
        setError(`Error al buscar ${activeTab === 'events' ? 'eventos' : 'usuarios'}`);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(loadResults, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery, activeTab]);

  const handleUserClick = (userId: number) => {
    navigate(`/profile/${userId}`);
  };

  return (
    <MainLayout>
      <div className="search-page">
        {/* Header */}
        <header className="search-header">
          <h1>Buscar</h1>
        </header>

        {/* Tabs */}
        <div className="search-tabs">
          <button
            className={`search-tab ${activeTab === 'events' ? 'active' : ''}`}
            onClick={() => setActiveTab('events')}
          >
            Eventos
          </button>
          <button
            className={`search-tab ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            Usuarios
          </button>
        </div>

        {/* Barra de búsqueda */}
        <section className="search-bar-section">
          <Input
            type="text"
            placeholder={`Buscar ${activeTab === 'events' ? 'eventos' : 'usuarios'}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<SearchIcon size={20} />}
            fullWidth
          />
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

          {/* Resultados de Eventos */}
          {activeTab === 'events' && !isLoading && !error && (
            <>
              {searchQuery && events.length > 0 && (
                <div className="search-results-grid">
                  {events.map((event) => (
                    <EventCard key={event.id_evento} event={event} />
                  ))}
                </div>
              )}

              {searchQuery && events.length === 0 && (
                <div className="search-empty">
                  <SearchIcon size={48} />
                  <p>No se encontraron eventos con "{searchQuery}"</p>
                </div>
              )}

              {!searchQuery && (
                <div className="search-empty">
                  <SearchIcon size={48} />
                  <p>Escribe algo para buscar eventos</p>
                </div>
              )}
            </>
          )}

          {/* Resultados de Usuarios */}
          {activeTab === 'users' && !isLoading && !error && (
            <>
              {searchQuery && users.length > 0 && (
                <div className="search-users-list">
                  {users.map((user) => (
                    <Card
                      key={user.id_usuario}
                      className="search-user-card"
                      hover
                      clickable
                      onClick={() => handleUserClick(user.id_usuario)}
                    >
                      <div className="search-user-content">
                        <div className="search-user-avatar">
                          {getProfileImageUrl(user.imagen_perfil) ? (
                            <img src={getProfileImageUrl(user.imagen_perfil)!} alt={user.usuario} />
                          ) : (
                            <User size={24} />
                          )}
                        </div>
                        <div className="search-user-info">
                          <h3 className="search-user-name">
                            {user.nombre} {user.apel1} {user.apel2 || ''}
                          </h3>
                          <p className="search-user-username">@{user.usuario}</p>
                          {user.bio && <p className="search-user-bio">{user.bio}</p>}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}

              {searchQuery && users.length === 0 && (
                <div className="search-empty">
                  <User size={48} />
                  <p>No se encontraron usuarios con "{searchQuery}"</p>
                </div>
              )}

              {!searchQuery && (
                <div className="search-empty">
                  <User size={48} />
                  <p>Escribe algo para buscar usuarios</p>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </MainLayout>
  );
};
