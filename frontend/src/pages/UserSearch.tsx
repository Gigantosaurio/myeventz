import React, { useState, useEffect } from 'react';
import { getProfileImageUrl } from '../utils/imageUtils';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout/MainLayout';
import { Input, Card } from '../components/common';
import { Search, User } from 'lucide-react';
import { userService } from '../services';
import type { User as UserType } from '../types';
import './UserSearch.css';

export const UserSearch: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<UserType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const searchUsers = async () => {
      if (!searchQuery.trim()) {
        setUsers([]);
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const results = await userService.searchUsers(searchQuery);
        setUsers(results);
      } catch (err) {
        console.error('Error searching users:', err);
        setError('Error al buscar usuarios');
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchUsers, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const handleUserClick = (userId: number) => {
    navigate(`/profile/${userId}`);
  };

  return (
    <MainLayout>
      <div className="user-search-page">
        {/* Header */}
        <header className="user-search-header">
          <h1>Buscar usuarios</h1>
        </header>

        {/* Contenido */}
        <div className="user-search-content">
          {/* Búsqueda */}
          <div className="user-search-input-wrapper">
            <Input
              type="text"
              placeholder="Buscar usuarios..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search size={20} />}
              fullWidth
            />
          </div>

          {/* Lista de usuarios */}
          <div className="user-search-results">
            {error && (
              <div className="user-search-error">
                <p>{error}</p>
              </div>
            )}

            {isLoading && (
              <div className="user-search-loading">
                <p>Buscando usuarios...</p>
              </div>
            )}

            {!isLoading && !error && searchQuery && users.length > 0 && (
              users.map((user) => (
                <Card
                  key={user.id_usuario}
                  className="user-search-card"
                  hover
                  clickable
                  onClick={() => handleUserClick(user.id_usuario)}
                >
                  <div className="user-search-card-content">
                    <div className="user-search-avatar">
                      {getProfileImageUrl(user.imagen_perfil) ? (
                        <img src={getProfileImageUrl(user.imagen_perfil)!} alt={user.usuario} />
                      ) : (
                        <User size={24} />
                      )}
                    </div>
                    <div className="user-search-info">
                      <h3 className="user-search-name">
                        {user.nombre} {user.apel1} {user.apel2 || ''}
                      </h3>
                      <p className="user-search-username">@{user.usuario}</p>
                      {user.bio && <p className="user-search-bio">{user.bio}</p>}
                    </div>
                  </div>
                </Card>
              ))
            )}

            {!isLoading && !error && searchQuery && users.length === 0 && (
              <div className="user-search-empty">
                <User size={48} />
                <p>No se encontraron usuarios con "{searchQuery}"</p>
              </div>
            )}

            {!isLoading && !searchQuery && (
              <div className="user-search-empty">
                <Search size={48} />
                <p>Escribe algo para buscar usuarios</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
