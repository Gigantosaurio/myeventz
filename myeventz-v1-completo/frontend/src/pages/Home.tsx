import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout/MainLayout';
import { Input } from '../components/common';
import { EventCard } from '../components/features/EventCard/EventCard';
import { Search } from 'lucide-react';
import { colors } from '../styles/colors';
import './Home.css';

// TODO: Reemplazar con llamada real a la API
// const events = await eventService.getPopularEvents();
const POPULAR_EVENTS = [
  {
    id: '1',
    title: 'MB Universitarios',
    imageUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800',
    category: 'Ciclismo',
    categoryColor: colors.categories.ciclismo,
    date: '14/02/2024',
    location: 'Parque Grande',
    participants: 37,
    likes: 18,
  },
  {
    id: '2',
    title: 'Torneo Mortal Kombat',
    imageUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800',
    category: 'Audiovisual',
    categoryColor: colors.categories.audiovisual,
    date: '17/03/2024',
    location: 'Centro Cívico',
    participants: 16,
    maxParticipants: 32,
    likes: 45,
  },
  {
    id: '3',
    title: 'Carrera Circuito MTB',
    imageUrl: 'https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=800',
    category: 'Ciclismo',
    categoryColor: colors.categories.ciclismo,
    date: '20/03/2024',
    location: 'Monte Torrero',
    participants: 27,
    maxParticipants: 50,
    likes: 35,
  },
];

// TODO: Reemplazar con llamada real a la API
// const recentPosts = await eventService.getRecentPosts();
const RECENT_POSTS = [
  {
    id: '4',
    title: 'Partido Volleyball San Valero',
    imageUrl: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800',
    category: 'Baloncesto',
    categoryColor: colors.categories.baloncesto,
    date: '26/02/2024',
    location: 'Centro deportivo municipal La Almozara',
    participants: 8,
  },
  {
    id: '5',
    title: 'Game of S.K.A.T.E.',
    imageUrl: 'https://images.unsplash.com/photo-1547447134-cd3f5c716030?w=800',
    category: 'Escalada',
    categoryColor: colors.categories.escalada,
    date: '25/02/2025',
    location: 'Skate Park Parque del Emeral',
    participants: 12,
    maxParticipants: 20,
  },
  {
    id: '6',
    title: 'Competición BMX',
    imageUrl: 'https://images.unsplash.com/photo-1558981852-426c6c22a060?w=800',
    category: 'Ciclismo',
    categoryColor: colors.categories.ciclismo,
    date: '29/02/2025',
    location: 'Pistas BMX Zaragoza',
    participants: 24,
    maxParticipants: 30,
    likes: 56,
  },
  {
    id: '7',
    title: 'Entrenamiento Maratón',
    imageUrl: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800',
    category: 'Gimnasia',
    categoryColor: colors.categories.gimnasia,
    date: '01/03/2025',
    location: 'Parque Grande José Antonio Labordeta',
    participants: 43,
    likes: 28,
  },
];

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // TODO: Implementar búsqueda real
      // navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <MainLayout>
      <div className="home-page">
        {/* Header */}
        <header className="home-header">
          <h1>Inicio</h1>
        </header>

        {/* Contenido principal */}
        <div className="home-content">
          {/* Búsqueda */}
          <section className="home-search-section">
            <form onSubmit={handleSearch} className="home-search-form">
              <Input
                type="text"
                placeholder="Buscar eventos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={<Search size={20} />}
                fullWidth
              />
            </form>
          </section>

          {/* Eventos populares */}
          <section className="home-section">
            <div className="home-section-header">
              <h2>Eventos populares:</h2>
            </div>
            <div className="home-events-grid">
              {POPULAR_EVENTS.map((event) => (
                <EventCard key={event.id} {...event} />
              ))}
            </div>
          </section>

          {/* Publicaciones recientes */}
          <section className="home-section">
            <div className="home-section-header">
              <h2>Publicaciones recientes:</h2>
            </div>
            <div className="home-events-grid">
              {RECENT_POSTS.map((event) => (
                <EventCard key={event.id} {...event} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </MainLayout>
  );
};
