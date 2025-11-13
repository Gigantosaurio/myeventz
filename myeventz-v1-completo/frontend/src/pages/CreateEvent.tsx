import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout/MainLayout';
import { Input, Button, Card, Tag } from '../components/common';
import { ArrowLeft, Upload, X } from 'lucide-react';
import { colors } from '../styles/colors';
import './CreateEvent.css';

// TODO: Obtener categorías desde la API
// const categories = await categoryService.getAllCategories();
const CATEGORIES = [
  { name: 'Audiovisual', color: colors.categories.audiovisual },
  { name: 'Baloncesto', color: colors.categories.baloncesto },
  { name: 'Calistenia', color: colors.categories.calistenia },
  { name: 'Ciclismo', color: colors.categories.ciclismo },
  { name: 'Cocina', color: colors.categories.cocina },
  { name: 'Crossfit', color: colors.categories.crossfit },
  { name: 'Danza', color: colors.categories.danza },
  { name: 'Escalada', color: colors.categories.escalada },
  { name: 'Esgrima', color: colors.categories.esgrima },
  { name: 'Fútbol', color: colors.categories.futbol },
  { name: 'Gimnasia', color: colors.categories.gimnasia },
  { name: 'Golf', color: colors.categories.golf },
  { name: 'Karate', color: colors.categories.karate },
  { name: 'Motocross', color: colors.categories.motocross },
];

interface EventFormData {
  title: string;
  description: string;
  category: string;
  date: string;
  time: string;
  minAge: string;
  maxAge: string;
  location: string;
  maxParticipants: string;
  image: File | null;
}

export const CreateEvent: React.FC = () => {
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    category: '',
    date: '',
    time: '',
    minAge: '18',
    maxAge: '99',
    location: '',
    maxParticipants: '10',
    image: null,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCategorySelect = (categoryName: string) => {
    setFormData((prev) => ({
      ...prev,
      category: categoryName,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        setError('Por favor, selecciona un archivo de imagen válido');
        return;
      }

      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('La imagen no puede superar los 5MB');
        return;
      }

      setFormData((prev) => ({ ...prev, image: file }));

      // Crear preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setError(null);
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, image: null }));
    setImagePreview(null);
  };

  const validateForm = (): boolean => {
    if (!formData.title.trim()) {
      setError('El título es obligatorio');
      return false;
    }
    if (!formData.description.trim()) {
      setError('La descripción es obligatoria');
      return false;
    }
    if (!formData.category) {
      setError('Selecciona una categoría');
      return false;
    }
    if (!formData.date) {
      setError('La fecha es obligatoria');
      return false;
    }
    if (!formData.time) {
      setError('La hora es obligatoria');
      return false;
    }
    if (!formData.location.trim()) {
      setError('La ubicación es obligatoria');
      return false;
    }

    const minAge = parseInt(formData.minAge);
    const maxAge = parseInt(formData.maxAge);
    if (minAge < 0 || maxAge < 0 || minAge > maxAge) {
      setError('Rango de edad inválido');
      return false;
    }

    const maxPart = parseInt(formData.maxParticipants);
    if (maxPart < 1) {
      setError('Debe haber al menos 1 participante');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Enviar datos al backend
      // const formDataToSend = new FormData();
      // formDataToSend.append('title', formData.title);
      // formDataToSend.append('description', formData.description);
      // formDataToSend.append('category', formData.category);
      // formDataToSend.append('date', formData.date);
      // formDataToSend.append('time', formData.time);
      // formDataToSend.append('minAge', formData.minAge);
      // formDataToSend.append('maxAge', formData.maxAge);
      // formDataToSend.append('location', formData.location);
      // formDataToSend.append('maxParticipants', formData.maxParticipants);
      // if (formData.image) {
      //   formDataToSend.append('image', formData.image);
      // }
      // 
      // const response = await eventService.createEvent(formDataToSend);
      // navigate(`/event/${response.id}`);

      // Simulación de creación exitosa
      setTimeout(() => {
        alert('¡Evento creado exitosamente!');
        navigate('/home');
      }, 1000);
    } catch (err) {
      setError('Error al crear el evento. Por favor, inténtalo de nuevo.');
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <MainLayout>
      <div className="create-event-page">
        {/* Header */}
        <header className="create-event-header">
          <button
            className="create-event-back"
            onClick={handleBack}
            aria-label="Volver"
          >
            <ArrowLeft size={24} />
          </button>
          <h1>Crear Evento</h1>
          <div style={{ width: '2.5rem' }} /> {/* Spacer para centrar */}
        </header>

        {/* Contenido */}
        <div className="create-event-content">
          <form onSubmit={handleSubmit} className="create-event-form">
            {/* Título */}
            <Card className="create-event-section">
              <h2>Información básica</h2>
              <Input
                type="text"
                name="title"
                label="Título del evento"
                placeholder="Ej: Partido de fútbol en Parque Grande"
                value={formData.title}
                onChange={handleInputChange}
                required
                fullWidth
              />

              <div className="create-event-textarea-wrapper">
                <label className="create-event-label">Descripción</label>
                <textarea
                  name="description"
                  className="create-event-textarea"
                  placeholder="Describe tu evento..."
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={6}
                  required
                />
              </div>
            </Card>

            {/* Categoría */}
            <Card className="create-event-section">
              <h2>Categoría</h2>
              <div className="create-event-categories">
                {CATEGORIES.map((category) => (
                  <Tag
                    key={category.name}
                    color={category.color}
                    selected={formData.category === category.name}
                    onClick={() => handleCategorySelect(category.name)}
                  >
                    {category.name}
                  </Tag>
                ))}
              </div>
            </Card>

            {/* Fecha y hora */}
            <Card className="create-event-section">
              <h2>Fecha y hora</h2>
              <div className="create-event-row">
                <Input
                  type="date"
                  name="date"
                  label="Fecha"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                  fullWidth
                />
                <Input
                  type="time"
                  name="time"
                  label="Hora"
                  value={formData.time}
                  onChange={handleInputChange}
                  required
                  fullWidth
                />
              </div>
            </Card>

            {/* Edad */}
            <Card className="create-event-section">
              <h2>Rango de edad</h2>
              <div className="create-event-row">
                <Input
                  type="number"
                  name="minAge"
                  label="Edad mínima"
                  value={formData.minAge}
                  onChange={handleInputChange}
                  min="0"
                  required
                  fullWidth
                />
                <Input
                  type="number"
                  name="maxAge"
                  label="Edad máxima"
                  value={formData.maxAge}
                  onChange={handleInputChange}
                  min="0"
                  required
                  fullWidth
                />
              </div>
            </Card>

            {/* Ubicación y participantes */}
            <Card className="create-event-section">
              <h2>Ubicación y participantes</h2>
              <Input
                type="text"
                name="location"
                label="Ubicación"
                placeholder="Ej: Parque Grande José Antonio Labordeta"
                value={formData.location}
                onChange={handleInputChange}
                required
                fullWidth
              />
              <Input
                type="number"
                name="maxParticipants"
                label="Número máximo de participantes"
                value={formData.maxParticipants}
                onChange={handleInputChange}
                min="1"
                required
                fullWidth
              />
            </Card>

            {/* Imagen */}
            <Card className="create-event-section">
              <h2>Imagen del evento (opcional)</h2>
              {imagePreview ? (
                <div className="create-event-image-preview">
                  <img src={imagePreview} alt="Preview" />
                  <button
                    type="button"
                    className="create-event-image-remove"
                    onClick={handleRemoveImage}
                  >
                    <X size={20} />
                  </button>
                </div>
              ) : (
                <label className="create-event-image-upload">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    hidden
                  />
                  <Upload size={32} />
                  <span>Subir imagen</span>
                  <span className="create-event-image-help">
                    JPG, PNG o WEBP (máx. 5MB)
                  </span>
                </label>
              )}
            </Card>

            {/* Error */}
            {error && (
              <div className="create-event-error">
                {error}
              </div>
            )}

            {/* Botones */}
            <div className="create-event-actions">
              <Button
                type="button"
                variant="secondary"
                size="lg"
                onClick={handleBack}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creando...' : 'Crear Evento'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  );
};
