import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Card, Tag } from '../components/common';
import { BottomNav } from '../components/layout/BottomNav/BottomNav';
import { EventCard } from '../components/features/EventCard/EventCard';
import { ArrowLeft, User, Edit } from 'lucide-react';
import { colors } from '../styles/colors';
import './Profile.css';

// Datos de ejemplo
const USER_PROFILE = {
  id: '1',
  username: 'mangelrogel420',
  fullName: 'Miguel Ángel Rogel Ruiz',
  bio: 'Me llama Miguel Ángel, aunque mis amigos me llaman Manolo. Me gusta mucho subir vídeos a YT y quedar con los amigos.',
  hobbies: ['Videojuegos', 'Volleyball', 'Audiovisual', 'IA', 'Edición de vídeo', 'Editar', 'Parkour'],
};

const USER_EVENTS = [
  {
    id: '1',
    title: 'Ruta Panticosa',
    imageUrl: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800',
    category: 'Ciclismo',
    categoryColor: colors.categories.ciclismo,
    date: '02/08/2023',
    location: 'Panticosa',
    participants: 5,
  },
];

const USER_PARTICIPATIONS = [
  {
    id: '2',
    title: 'Festival De Cine ZGZ',
    imageUrl: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800',
    category: 'Audiovisual',
    categoryColor: colors.categories.audiovisual,
    date: '05/06/2023',
    location: 'Cines Palafox',
    participants: 24,
  },
  {
    id: '3',
    title: 'Bald Boss Party',
    imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800',
    category: 'Cocina',
    categoryColor: colors.categories.cocina,
    date: '14/02/2023',
    location: 'TBD',
    participants: 8,
  },
];

export const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  
  // Determinar si es el perfil propio
  const isOwnProfile = !userId || userId === '1'; // Simplificado para demo

  return (
    <div className="profile-page">
      {/* Header */}
      <header className="profile-header">
        <button
          className="profile-back-button"
          onClick={() => navigate(-1)}
          aria-label="Volver"
        >
          <ArrowLeft size={24} />
        </button>
        <h1>{isOwnProfile ? 'Mi perfil' : 'Perfil'}</h1>
        {isOwnProfile && (
          <button
            className="profile-edit-button"
            onClick={() => navigate('/profile/edit')}
            aria-label="Editar perfil"
          >
            <Edit size={20} />
          </button>
        )}
      </header>

      {/* Contenido */}
      <main className="profile-content">
        {/* Info del usuario */}
        <Card className="profile-card">
          <div className="profile-info">
            <div className="profile-avatar">
              <User size={48} />
            </div>
            <div className="profile-details">
              <h2 className="profile-name">{USER_PROFILE.fullName}</h2>
              <p className="profile-username">@{USER_PROFILE.username}</p>
            </div>
          </div>

          {/* Bio */}
          <div className="profile-bio">
            <h3>Biografía e intereses:</h3>
            <p>{USER_PROFILE.bio}</p>
          </div>

          {/* Hobbies */}
          <div className="profile-hobbies">
            {USER_PROFILE.hobbies.map((hobby, index) => (
              <Tag
                key={index}
                color={colors.categories[hobby.toLowerCase() as keyof typeof colors.categories] || colors.primary}
                size="sm"
              >
                {hobby}
              </Tag>
            ))}
          </div>

          {/* Redes Sociales (placeholder) */}
          <div className="profile-social">
            <h3>Mis Redes Sociales</h3>
            <p className="profile-social-placeholder">No hay redes sociales añadidas</p>
          </div>
        </Card>

        {/* Mis eventos */}
        <section className="profile-section">
          <h2>Mis eventos:</h2>
          <div className="profile-events-grid">
            {USER_EVENTS.map((event) => (
              <EventCard key={event.id} {...event} />
            ))}
          </div>
        </section>

        {/* Participaciones */}
        <section className="profile-section">
          <h2>Participaciones:</h2>
          <div className="profile-events-grid">
            {USER_PARTICIPATIONS.map((event) => (
              <EventCard key={event.id} {...event} />
            ))}
          </div>
        </section>
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};
