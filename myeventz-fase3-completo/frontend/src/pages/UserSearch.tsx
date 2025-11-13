import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input, Card } from '../components/common';
import { BottomNav } from '../components/layout/BottomNav/BottomNav';
import { Search, User } from 'lucide-react';
import './UserSearch.css';

interface UserProfile {
  id: string;
  username: string;
  fullName: string;
  profilePicture?: string;
  bio?: string;
}

// Datos de ejemplo
const USERS: UserProfile[] = [
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
  {
    id: '4',
    username: 'jorgealquezar',
    fullName: 'Jorge Alquézar',
  },
];

export const UserSearch: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUsers = USERS.filter(
    (user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUserClick = (userId: string) => {
    navigate(`/profile/${userId}`);
  };

  return (
    <div className="user-search-page">
      {/* Header */}
      <header className="user-search-header">
        <h1>Buscar usuarios</h1>
      </header>

      {/* Contenido */}
      <main className="user-search-content">
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
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <Card
                key={user.id}
                className="user-search-card"
                hover
                clickable
                onClick={() => handleUserClick(user.id)}
              >
                <div className="user-search-card-content">
                  <div className="user-search-avatar">
                    {user.profilePicture ? (
                      <img src={user.profilePicture} alt={user.username} />
                    ) : (
                      <User size={24} />
                    )}
                  </div>
                  <div className="user-search-info">
                    <h3 className="user-search-name">{user.fullName}</h3>
                    <p className="user-search-username">@{user.username}</p>
                    {user.bio && <p className="user-search-bio">{user.bio}</p>}
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="user-search-empty">
              <User size={48} />
              <p>No se encontraron usuarios</p>
            </div>
          )}
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};
