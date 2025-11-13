import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout/MainLayout';
import { Button, Tag, Card } from '../components/common';
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Users, 
  Heart, 
  Share2,
  Clock,
  User,
  X
} from 'lucide-react';
import { colors } from '../styles/colors';
import './EventDetail.css';

// TODO: Obtener evento desde la API
// const event = await eventService.getEventById(eventId);
const MOCK_EVENT = {
  id: '1',
  title: 'Sould Park Parkour Meet',
  description: 'Evento llamando organizar una quedada de parkour en el parque de camas elásticas del CC La Torre Outlet.\n\nAnimamos a cualquiera que le guste el deporte a venir, conocer gente y disfrutar, sin importar experiencia ni en esta modalidad.',
  imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=1200',
  category: 'Parkour',
  categoryColor: colors.categories.escalada,
  tags: ['Parkour', 'Deporte'],
  dateTime: '29/02/2023 19:45',
  ageRange: { min: 18, max: 25 },
  location: {
    name: 'Sould Park Jump CC La Torre Outlet Zaragoza',
    address: 'CC La Torre Outlet, Zaragoza',
    coordinates: { lat: 41.6488, lng: -0.8891 },
  },
  maxParticipants: 20,
  currentParticipants: 5,
  organizer: {
    id: '1',
    username: 'mangelrogel420',
    fullName: 'Miguel Ángel Rogel Ruiz',
    profilePicture: null,
  },
  participants: [
    { id: '1', username: 'mangelrogel420', fullName: 'Miguel Ángel Rogel Ruiz' },
    { id: '2', username: 'user2', fullName: 'Usuario 2' },
    { id: '3', username: 'user3', fullName: 'Usuario 3' },
    { id: '4', username: 'user4', fullName: 'Usuario 4' },
    { id: '5', username: 'user5', fullName: 'Usuario 5' },
  ],
  likes: 24,
  isLiked: false,
  isParticipating: false,
};

export const EventDetail: React.FC = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  
  const [isLiked, setIsLiked] = useState(MOCK_EVENT.isLiked);
  const [isParticipating, setIsParticipating] = useState(MOCK_EVENT.isParticipating);
  const [likes, setLikes] = useState(MOCK_EVENT.likes);

  const handleBack = () => {
    navigate(-1);
  };

  const handleLike = async () => {
    // TODO: Llamar al endpoint de like/unlike
    // if (isLiked) {
    //   await eventService.unlikeEvent(eventId);
    // } else {
    //   await eventService.likeEvent(eventId);
    // }
    
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
  };

  const handleParticipate = async () => {
    // TODO: Llamar al endpoint de participar/cancelar
    // if (isParticipating) {
    //   await eventService.leaveEvent(eventId);
    // } else {
    //   await eventService.joinEvent(eventId);
    // }
    
    setIsParticipating(!isParticipating);
  };

  const handleShare = () => {
    // TODO: Implementar funcionalidad de compartir
    // navigator.share({ title, text, url });
    alert('Funcionalidad de compartir - Por implementar');
  };

  const handleParticipantClick = (userId: string) => {
    navigate(`/profile/${userId}`);
  };

  return (
    <MainLayout>
      <div className="event-detail-page">
        {/* Header */}
        <header className="event-detail-header">
          <button
            className="event-detail-back"
            onClick={handleBack}
            aria-label="Volver"
          >
            <ArrowLeft size={24} />
          </button>
          <h1>Detalle del Evento</h1>
          <div className="event-detail-actions">
            <button
              className={`event-detail-action ${isLiked ? 'liked' : ''}`}
              onClick={handleLike}
              aria-label="Me gusta"
            >
              <Heart size={20} fill={isLiked ? '#ef4444' : 'none'} />
              <span>{likes}</span>
            </button>
            <button
              className="event-detail-action"
              onClick={handleShare}
              aria-label="Compartir"
            >
              <Share2 size={20} />
            </button>
          </div>
        </header>

        {/* Contenido */}
        <div className="event-detail-content">
          {/* Imagen principal */}
          {MOCK_EVENT.imageUrl && (
            <div className="event-detail-image">
              <img src={MOCK_EVENT.imageUrl} alt={MOCK_EVENT.title} />
              <div className="event-detail-image-tags">
                {MOCK_EVENT.tags.map((tag, index) => (
                  <Tag key={index} color={MOCK_EVENT.categoryColor} size="sm">
                    {tag}
                  </Tag>
                ))}
              </div>
            </div>
          )}

          {/* Información principal */}
          <div className="event-detail-main">
            <div className="event-detail-main-left">
              {/* Título y descripción */}
              <Card className="event-detail-card">
                <h2 className="event-detail-title">{MOCK_EVENT.title}</h2>
                <p className="event-detail-description">{MOCK_EVENT.description}</p>
              </Card>

              {/* Detalles del evento */}
              <Card className="event-detail-card">
                <h3>Detalles del evento:</h3>
                <div className="event-detail-info-list">
                  <div className="event-detail-info-item">
                    <Calendar size={20} />
                    <div>
                      <span className="event-detail-info-label">Fecha y hora</span>
                      <span className="event-detail-info-value">{MOCK_EVENT.dateTime}</span>
                    </div>
                  </div>

                  <div className="event-detail-info-item">
                    <Clock size={20} />
                    <div>
                      <span className="event-detail-info-label">Rango de edad</span>
                      <span className="event-detail-info-value">
                        de {MOCK_EVENT.ageRange.min} a {MOCK_EVENT.ageRange.max} años
                      </span>
                    </div>
                  </div>

                  <div className="event-detail-info-item">
                    <MapPin size={20} />
                    <div>
                      <span className="event-detail-info-label">Ubicación</span>
                      <span className="event-detail-info-value">{MOCK_EVENT.location.name}</span>
                    </div>
                  </div>
                </div>

                {/* TODO: Integrar mapa real (Google Maps, Mapbox, etc.) */}
                <div className="event-detail-map">
                  <div className="event-detail-map-placeholder">
                    <MapPin size={32} />
                    <p>Mapa de ubicación</p>
                    <p className="event-detail-map-coords">
                      {MOCK_EVENT.location.coordinates.lat}, {MOCK_EVENT.location.coordinates.lng}
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            <div className="event-detail-main-right">
              {/* Participantes */}
              <Card className="event-detail-card">
                <div className="event-detail-participants-header">
                  <h3>Participantes ({MOCK_EVENT.currentParticipants})</h3>
                  <span className="event-detail-participants-limit">
                    {MOCK_EVENT.currentParticipants}/{MOCK_EVENT.maxParticipants}
                  </span>
                </div>

                <div className="event-detail-participants-list">
                  {MOCK_EVENT.participants.map((participant) => (
                    <div
                      key={participant.id}
                      className="event-detail-participant"
                      onClick={() => handleParticipantClick(participant.id)}
                    >
                      <div className="event-detail-participant-avatar">
                        <User size={16} />
                      </div>
                      <span className="event-detail-participant-name">
                        {participant.fullName}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Botón de participar */}
                <Button
                  variant={isParticipating ? 'secondary' : 'primary'}
                  size="lg"
                  fullWidth
                  onClick={handleParticipate}
                >
                  {isParticipating ? (
                    <>
                      <X size={20} />
                      CANCELAR
                    </>
                  ) : (
                    <>
                      <Users size={20} />
                      PARTICIPAR
                    </>
                  )}
                </Button>
              </Card>

              {/* Organizador */}
              <Card className="event-detail-card">
                <h3>Organizador</h3>
                <div
                  className="event-detail-organizer"
                  onClick={() => handleParticipantClick(MOCK_EVENT.organizer.id)}
                >
                  <div className="event-detail-organizer-avatar">
                    <User size={24} />
                  </div>
                  <div className="event-detail-organizer-info">
                    <span className="event-detail-organizer-name">
                      {MOCK_EVENT.organizer.fullName}
                    </span>
                    <span className="event-detail-organizer-username">
                      @{MOCK_EVENT.organizer.username}
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
