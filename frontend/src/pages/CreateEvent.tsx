import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout/MainLayout';
import { Input, Button, Card, Tag } from '../components/common';
import { ArrowLeft, Upload, X } from 'lucide-react';
import { eventService, categoryService, authService } from '../services';
import type { Category, CreateEventData } from '../types';
import './CreateEvent.css';

interface EventFormData {
  titulo: string;
  descripcion: string;
  id_categoria: number | null;
  fecha: string;
  hora: string;
  edad_min: string;
  edad_max: string;
  ubicacion: string;
  max_participantes: string;
  imagen: File | null;
}

export const CreateEvent: React.FC = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState<Category[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<EventFormData>({
    titulo: '',
    descripcion: '',
    id_categoria: null,
    fecha: '',
    hora: '',
    edad_min: '18',
    edad_max: '99',
    ubicacion: '',
    max_participantes: '10',
    imagen: null,
  });

  useEffect(() => {
    const loadCategories = async () => {
      const currentUser = authService.getStoredUser();

      if (!currentUser) {
        navigate('/login');
        return;
      }

      try {
        setIsLoading(true);
        const categoriesData = await categoryService.getAllCategories();
        setCategories(categoriesData);
      } catch (err) {
        console.error('Error loading categories:', err);
        setError('Error al cargar las categorías');
      } finally {
        setIsLoading(false);
      }
    };

    loadCategories();
  }, [navigate]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCategorySelect = (categoryId: number) => {
    setFormData((prev) => ({
      ...prev,
      id_categoria: categoryId,
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
    if (!formData.titulo.trim()) {
      setError('El título es obligatorio');
      return false;
    }
    if (!formData.descripcion.trim()) {
      setError('La descripción es obligatoria');
      return false;
    }
    if (!formData.id_categoria) {
      setError('Selecciona una categoría');
      return false;
    }
    if (!formData.fecha) {
      setError('La fecha es obligatoria');
      return false;
    }
    if (!formData.hora) {
      setError('La hora es obligatoria');
      return false;
    }
    if (!formData.ubicacion.trim()) {
      setError('La ubicación es obligatoria');
      return false;
    }

    const minAge = parseInt(formData.edad_min);
    const maxAge = parseInt(formData.edad_max);
    if (minAge < 0 || maxAge < 0 || minAge > maxAge) {
      setError('Rango de edad inválido');
      return false;
    }

    const maxPart = parseInt(formData.max_participantes);
    if (maxPart < 1) {
      setError('Debe haber al menos 1 participante');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm() || !formData.id_categoria) {
      return;
    }

    setIsSubmitting(true);

    try {
      const eventData: CreateEventData = {
        titulo: formData.titulo,
        descripcion: formData.descripcion,
        fecha: formData.fecha,
        hora: formData.hora,
        edad_min: parseInt(formData.edad_min),
        edad_max: parseInt(formData.edad_max),
        ubicacion: formData.ubicacion,
        max_participantes: parseInt(formData.max_participantes),
        id_categoria: formData.id_categoria,
        imagen: formData.imagen || undefined,
      };

      const newEvent = await eventService.createEvent(eventData);
      navigate(`/event/${newEvent.id_evento}`);
    } catch (err) {
      console.error('Error creating event:', err);
      setError('Error al crear el evento. Por favor, inténtalo de nuevo.');
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="create-event-page">
          <div className="create-event-loading">Cargando categorías...</div>
        </div>
      </MainLayout>
    );
  }

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
                name="titulo"
                label="Título del evento"
                placeholder="Ej: Partido de fútbol en Parque Grande"
                value={formData.titulo}
                onChange={handleInputChange}
                required
                fullWidth
              />

              <div className="create-event-textarea-wrapper">
                <label className="create-event-label">Descripción</label>
                <textarea
                  name="descripcion"
                  className="create-event-textarea"
                  placeholder="Describe tu evento..."
                  value={formData.descripcion}
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
                {categories.map((category) => (
                  <Tag
                    key={category.id_categoria}
                    color={category.color}
                    selected={formData.id_categoria === category.id_categoria}
                    onClick={() => handleCategorySelect(category.id_categoria)}
                  >
                    {category.categoria}
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
                  name="fecha"
                  label="Fecha"
                  value={formData.fecha}
                  onChange={handleInputChange}
                  required
                  fullWidth
                />
                <Input
                  type="time"
                  name="hora"
                  label="Hora"
                  value={formData.hora}
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
                  name="edad_min"
                  label="Edad mínima"
                  value={formData.edad_min}
                  onChange={handleInputChange}
                  min="0"
                  required
                  fullWidth
                />
                <Input
                  type="number"
                  name="edad_max"
                  label="Edad máxima"
                  value={formData.edad_max}
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
                name="ubicacion"
                label="Ubicación"
                placeholder="Ej: Parque Grande José Antonio Labordeta"
                value={formData.ubicacion}
                onChange={handleInputChange}
                required
                fullWidth
              />
              <Input
                type="number"
                name="max_participantes"
                label="Número máximo de participantes"
                value={formData.max_participantes}
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
