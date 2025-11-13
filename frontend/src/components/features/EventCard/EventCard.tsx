import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Tag } from '../../common';
import { Calendar, MapPin, Users, Heart } from 'lucide-react';
import type { EventDetail } from '../../../types';
import './EventCard.css';

interface EventCardProps {
  event: EventDetail;
}

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/event/${event.id_evento}`);
  };

  // Formatear fecha para mostrar (YYYY-MM-DD -> DD/MM/YYYY)
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <Card className="event-card" hover clickable onClick={handleClick}>
      {event.imagen && (
        <div className="event-card-image">
          <img src={event.imagen} alt={event.titulo} />
          {event.total_likes !== undefined && event.total_likes > 0 && (
            <div className="event-card-likes">
              <Heart size={16} fill={event.liked_by_user ? 'currentColor' : 'none'} />
              <span>{event.total_likes}</span>
            </div>
          )}
        </div>
      )}
      <div className="event-card-content">
        <div className="event-card-header">
          <h3 className="event-card-title">{event.titulo}</h3>
          {event.categoria_nombre && event.categoria_color && (
            <Tag color={event.categoria_color} size="sm">
              {event.categoria_nombre}
            </Tag>
          )}
        </div>
        <div className="event-card-details">
          <div className="event-card-detail">
            <Calendar size={16} />
            <span>{formatDate(event.fecha)}</span>
          </div>
          <div className="event-card-detail">
            <MapPin size={16} />
            <span>{event.ubicacion}</span>
          </div>
          <div className="event-card-detail">
            <Users size={16} />
            <span>
              {event.participantes_actuales}
              {event.max_participantes && `/${event.max_participantes}`}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};
