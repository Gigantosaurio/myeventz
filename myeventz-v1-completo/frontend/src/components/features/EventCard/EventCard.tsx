import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Tag } from '../../common';
import { Calendar, MapPin, Users, Heart } from 'lucide-react';
import './EventCard.css';

interface EventCardProps {
  id: string;
  title: string;
  imageUrl?: string;
  category: string;
  categoryColor: string;
  date: string;
  location: string;
  participants: number;
  maxParticipants?: number;
  likes?: number;
}

export const EventCard: React.FC<EventCardProps> = ({
  id,
  title,
  imageUrl,
  category,
  categoryColor,
  date,
  location,
  participants,
  maxParticipants,
  likes,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/event/${id}`);
  };

  return (
    <Card className="event-card" hover clickable onClick={handleClick}>
      {imageUrl && (
        <div className="event-card-image">
          <img src={imageUrl} alt={title} />
          {likes !== undefined && (
            <div className="event-card-likes">
              <Heart size={16} />
              <span>{likes}</span>
            </div>
          )}
        </div>
      )}
      <div className="event-card-content">
        <div className="event-card-header">
          <h3 className="event-card-title">{title}</h3>
          <Tag color={categoryColor} size="sm">
            {category}
          </Tag>
        </div>
        <div className="event-card-details">
          <div className="event-card-detail">
            <Calendar size={16} />
            <span>{date}</span>
          </div>
          <div className="event-card-detail">
            <MapPin size={16} />
            <span>{location}</span>
          </div>
          <div className="event-card-detail">
            <Users size={16} />
            <span>
              {participants}
              {maxParticipants && `/${maxParticipants}`}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};
