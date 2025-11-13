import React, { useState, useEffect } from 'react';
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
import { eventService, authService } from '../services';
import type { EventDetail as EventDetailType } from '../types';
import './EventDetail.css';

export const EventDetail: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();

  const [event, setEvent] = useState<EventDetailType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isParticipating, setIsParticipating] = useState(false);
  const [likes, setLikes] = useState(0);
  const [participantsCount, setParticipantsCount] = useState(0);

  const currentUser = authService.getStoredUser();

  useEffect(() => {
    const loadEvent = async () => {
      if (!eventId) {
        setError('ID de evento no válido');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const eventData = await eventService.getEventById(parseInt(eventId));
        setEvent(eventData);
        setIsLiked(!!eventData.liked_by_user);
        setIsParticipating(!!eventData.is_participant);
        setLikes(eventData.total_likes);
        setParticipantsCount(eventData.participantes_actuales);
      } catch (err) {
        console.error('Error loading event:', err);
        setError('Error al cargar el evento');
      } finally {
        setIsLoading(false);
      }
    };

    loadEvent();
  }, [eventId]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleLike = async () => {
    if (!currentUser || !eventId) {
      navigate('/login');
      return;
    }

    try {
      if (isLiked) {
        await eventService.unlikeEvent(parseInt(eventId));
        setIsLiked(false);
        setLikes(likes - 1);
      } else {
        await eventService.likeEvent(parseInt(eventId));
        setIsLiked(true);
        setLikes(likes + 1);
      }
    } catch (err) {
      console.error('Error toggling like:', err);
      alert('Error al dar like al evento');
    }
  };

  const handleParticipate = async () => {
    if (!currentUser || !eventId) {
      navigate('/login');
      return;
    }

    try {
      if (isParticipating) {
        await eventService.leaveEvent(parseInt(eventId));
        setIsParticipating(false);
        setParticipantsCount(participantsCount - 1);
      } else {
        await eventService.joinEvent(parseInt(eventId));
        setIsParticipating(true);
        setParticipantsCount(participantsCount + 1);
      }
    } catch (err) {
      console.error('Error toggling participation:', err);
      alert('Error al participar en el evento');
    }
  };

  const handleShare = () => {
    if (navigator.share && event) {
      navigator
        .share({
          title: event.titulo,
          text: event.descripcion,
          url: window.location.href,
        })
        .catch((err) => console.error('Error sharing:', err));
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Enlace copiado al portapapeles');
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatTime = (timeStr: string) => {
    return timeStr.substring(0, 5);
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="event-detail-page">
          <div className="event-detail-loading">Cargando evento...</div>
        </div>
      </MainLayout>
    );
  }

  if (error || !event) {
    return (
      <MainLayout>
        <div className="event-detail-page">
          <div className="event-detail-error">{error || 'Evento no encontrado'}</div>
        </div>
      </MainLayout>
    );
  }

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
          {event.imagen && (
            <div className="event-detail-image">
              <img src={event.imagen} alt={event.titulo} />
              <div className="event-detail-image-tags">
                {event.categoria_nombre && (
                  <Tag color={event.categoria_color || '#7c3aed'} size="sm">
                    {event.categoria_nombre}
                  </Tag>
                )}
              </div>
            </div>
          )}

          {/* Información principal */}
          <div className="event-detail-main">
            <div className="event-detail-main-left">
              {/* Título y descripción */}
              <Card className="event-detail-card">
                <h2 className="event-detail-title">{event.titulo}</h2>
                <p className="event-detail-description">{event.descripcion}</p>
              </Card>

              {/* Detalles del evento */}
              <Card className="event-detail-card">
                <h3>Detalles del evento:</h3>
                <div className="event-detail-info-list">
                  <div className="event-detail-info-item">
                    <Calendar size={20} />
                    <div>
                      <span className="event-detail-info-label">Fecha y hora</span>
                      <span className="event-detail-info-value">
                        {formatDate(event.fecha)} {formatTime(event.hora)}
                      </span>
                    </div>
                  </div>

                  <div className="event-detail-info-item">
                    <Clock size={20} />
                    <div>
                      <span className="event-detail-info-label">Rango de edad</span>
                      <span className="event-detail-info-value">
                        de {event.edad_min} a {event.edad_max} años
                      </span>
                    </div>
                  </div>

                  <div className="event-detail-info-item">
                    <MapPin size={20} />
                    <div>
                      <span className="event-detail-info-label">Ubicación</span>
                      <span className="event-detail-info-value">{event.ubicacion}</span>
                    </div>
                  </div>
                </div>

                {/* Mapa placeholder */}
                {event.lat && event.lng && (
                  <div className="event-detail-map">
                    <div className="event-detail-map-placeholder">
                      <MapPin size={32} />
                      <p>Mapa de ubicación</p>
                      <p className="event-detail-map-coords">
                        {event.lat}, {event.lng}
                      </p>
                    </div>
                  </div>
                )}
              </Card>
            </div>

            <div className="event-detail-main-right">
              {/* Participantes */}
              <Card className="event-detail-card">
                <div className="event-detail-participants-header">
                  <h3>Participantes ({participantsCount})</h3>
                  <span className="event-detail-participants-limit">
                    {participantsCount}/{event.max_participantes}
                  </span>
                </div>

                {event.participantes && event.participantes.length > 0 ? (
                  <div className="event-detail-participants-list">
                    {event.participantes.map((participant) => (
                      <div
                        key={participant.id_usuario}
                        className="event-detail-participant"
                        onClick={() => navigate(`/profile/${participant.id_usuario}`)}
                      >
                        <div className="event-detail-participant-avatar">
                          {participant.imagen_perfil ? (
                            <img src={participant.imagen_perfil} alt={participant.nombre_completo} />
                          ) : (
                            <User size={16} />
                          )}
                        </div>
                        <span className="event-detail-participant-name">
                          {participant.nombre_completo}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="event-detail-participants-empty">
                    <Users size={32} />
                    <p>Aún no hay participantes</p>
                  </div>
                )}

                {/* Botón de participar */}
                <Button
                  variant={isParticipating ? 'secondary' : 'primary'}
                  size="lg"
                  fullWidth
                  onClick={handleParticipate}
                  disabled={!currentUser}
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
                  onClick={() => navigate(`/profile/${event.organizador_id}`)}
                >
                  <div className="event-detail-organizer-avatar">
                    {event.organizador_imagen ? (
                      <img src={event.organizador_imagen} alt={event.organizador_nombre} />
                    ) : (
                      <User size={24} />
                    )}
                  </div>
                  <div className="event-detail-organizer-info">
                    <span className="event-detail-organizer-name">
                      {event.organizador_nombre}
                    </span>
                    <span className="event-detail-organizer-username">
                      @{event.organizador_usuario}
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
