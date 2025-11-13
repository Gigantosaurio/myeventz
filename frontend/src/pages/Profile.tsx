import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout/MainLayout';
import { Card, Tag } from '../components/common';
import { EventCard } from '../components/features/EventCard/EventCard';
import { ArrowLeft, User, Edit } from 'lucide-react';
import { userService, authService } from '../services';
import type { UserProfile, EventDetail } from '../types';
import './Profile.css';

export const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { userId: userIdParam } = useParams();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [organizedEvents, setOrganizedEvents] = useState<EventDetail[]>([]);
  const [participatingEvents, setParticipatingEvents] = useState<EventDetail[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      // Determinar si es perfil propio
      const currentUser = authService.getStoredUser();
      const userId = userIdParam ? parseInt(userIdParam) : currentUser?.id_usuario;
      const ownProfile = !userIdParam || (currentUser && userId === currentUser.id_usuario);
      setIsOwnProfile(ownProfile);

      if (!userId) {
        setError('Usuario no encontrado');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Cargar perfil y eventos en paralelo
        const [profileData, eventsData] = await Promise.all([
          userService.getUserById(userId),
          userService.getAllUserEvents(userId)
        ]);

        setProfile(profileData);
        setOrganizedEvents(eventsData.organized as EventDetail[]);
        setParticipatingEvents(eventsData.participating as EventDetail[]);
      } catch (err) {
        console.error('Error loading profile:', err);
        setError('Error al cargar el perfil');
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [userIdParam]);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="profile-page">
          <div className="profile-loading">Cargando perfil...</div>
        </div>
      </MainLayout>
    );
  }

  if (error || !profile) {
    return (
      <MainLayout>
        <div className="profile-page">
          <div className="profile-error">{error || 'Perfil no encontrado'}</div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="profile-page">
        {/* Header */}
        <header className="profile-header">
          {!isOwnProfile && (
            <button
              className="profile-back-button"
              onClick={() => navigate(-1)}
              aria-label="Volver"
            >
              <ArrowLeft size={24} />
            </button>
          )}
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
        <div className="profile-content">
          {/* Info del usuario */}
          <Card className="profile-card">
            <div className="profile-info">
              <div className="profile-avatar">
                {profile.imagen_perfil ? (
                  <img src={profile.imagen_perfil} alt={profile.nombre} />
                ) : (
                  <User size={48} />
                )}
              </div>
              <div className="profile-details">
                <h2 className="profile-name">
                  {profile.nombre} {profile.apel1} {profile.apel2 || ''}
                </h2>
                <p className="profile-username">@{profile.usuario}</p>
              </div>
            </div>

            {/* Bio */}
            {profile.bio && (
              <div className="profile-bio">
                <h3>Biografía e intereses:</h3>
                <p>{profile.bio}</p>
              </div>
            )}

            {/* Hobbies */}
            {profile.hobbies && profile.hobbies.length > 0 && (
              <div className="profile-hobbies">
                {profile.hobbies.map((hobby) => (
                  <Tag key={hobby.id_categoria} color={hobby.color} size="sm">
                    {hobby.categoria}
                  </Tag>
                ))}
              </div>
            )}

            {/* Redes Sociales */}
            <div className="profile-social">
              <h3>Redes Sociales</h3>
              {profile.ig || profile.fb || profile.x || profile.yt || profile.tt ? (
                <div className="profile-social-links">
                  {profile.ig && <p>Instagram: {profile.ig}</p>}
                  {profile.fb && <p>Facebook: {profile.fb}</p>}
                  {profile.x && <p>X (Twitter): {profile.x}</p>}
                  {profile.yt && <p>YouTube: {profile.yt}</p>}
                  {profile.tt && <p>TikTok: {profile.tt}</p>}
                </div>
              ) : (
                <p className="profile-social-placeholder">No hay redes sociales añadidas</p>
              )}
            </div>

            {/* Estadísticas */}
            <div className="profile-stats">
              <div className="profile-stat">
                <span className="profile-stat-value">{profile.eventos_organizados || 0}</span>
                <span className="profile-stat-label">Eventos organizados</span>
              </div>
              <div className="profile-stat">
                <span className="profile-stat-value">{profile.eventos_participando || 0}</span>
                <span className="profile-stat-label">Participaciones</span>
              </div>
            </div>
          </Card>

          {/* Mis eventos */}
          {organizedEvents.length > 0 && (
            <section className="profile-section">
              <h2>Mis eventos:</h2>
              <div className="profile-events-grid">
                {organizedEvents.map((event) => (
                  <EventCard key={event.id_evento} event={event} />
                ))}
              </div>
            </section>
          )}

          {/* Participaciones */}
          {participatingEvents.length > 0 && (
            <section className="profile-section">
              <h2>Participaciones:</h2>
              <div className="profile-events-grid">
                {participatingEvents.map((event) => (
                  <EventCard key={event.id_evento} event={event} />
                ))}
              </div>
            </section>
          )}

          {/* Sin eventos */}
          {organizedEvents.length === 0 && participatingEvents.length === 0 && (
            <div className="profile-empty">
              <p>Este usuario aún no tiene eventos</p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};
