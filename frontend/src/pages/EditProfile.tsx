import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout/MainLayout';
import { Input, Button, Card, Tag } from '../components/common';
import { ArrowLeft, User, Upload, X } from 'lucide-react';
import { colors } from '../styles/colors';
import './EditProfile.css';

// TODO: Obtener hobbies/categorías disponibles desde la API
// const availableHobbies = await categoryService.getAllCategories();
const AVAILABLE_HOBBIES = [
  'Audiovisual', 'Baloncesto', 'Calistenia', 'Ciclismo', 'Cocina', 
  'Crossfit', 'Danza', 'Escalada', 'Esgrima', 'Fútbol', 
  'Gimnasia', 'Golf', 'Karate', 'Motocross', 'Videojuegos', 
  'Volleyball', 'IA', 'Edición de vídeo', 'Parkour'
];

interface ProfileFormData {
  fullName: string;
  username: string;
  email: string;
  bio: string;
  hobbies: string[];
  profilePicture: File | null;
  socialNetworks: {
    instagram: string;
    twitter: string;
    youtube: string;
  };
}

export const EditProfile: React.FC = () => {
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // TODO: Obtener datos del usuario actual desde la API
  // const currentUser = await userService.getCurrentProfile();
  const [formData, setFormData] = useState<ProfileFormData>({
    fullName: 'Miguel Ángel Rogel Ruiz',
    username: 'mangelrogel420',
    email: 'miguel@example.com',
    bio: 'Me llama Miguel Ángel, aunque mis amigos me llaman Manolo. Me gusta mucho subir vídeos a YT y quedar con los amigos.',
    hobbies: ['Videojuegos', 'Volleyball', 'Audiovisual', 'IA', 'Edición de vídeo', 'Parkour'],
    profilePicture: null,
    socialNetworks: {
      instagram: '',
      twitter: '',
      youtube: '',
    },
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      // Para redes sociales (socialNetworks.instagram)
      const [parent, child] = name.split('.');
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as any),
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleHobbyToggle = (hobby: string) => {
    setFormData((prev) => ({
      ...prev,
      hobbies: prev.hobbies.includes(hobby)
        ? prev.hobbies.filter((h) => h !== hobby)
        : [...prev.hobbies, hobby],
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Por favor, selecciona un archivo de imagen válido');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError('La imagen no puede superar los 5MB');
        return;
      }

      setFormData((prev) => ({ ...prev, profilePicture: file }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setError(null);
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({ ...prev, profilePicture: null }));
    setImagePreview(null);
  };

  const validateForm = (): boolean => {
    if (!formData.fullName.trim()) {
      setError('El nombre completo es obligatorio');
      return false;
    }
    if (!formData.username.trim()) {
      setError('El nombre de usuario es obligatorio');
      return false;
    }
    if (!formData.email.trim()) {
      setError('El email es obligatorio');
      return false;
    }
    if (formData.hobbies.length === 0) {
      setError('Selecciona al menos un hobby');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Enviar datos al backend
      // const formDataToSend = new FormData();
      // formDataToSend.append('fullName', formData.fullName);
      // formDataToSend.append('username', formData.username);
      // formDataToSend.append('email', formData.email);
      // formDataToSend.append('bio', formData.bio);
      // formDataToSend.append('hobbies', JSON.stringify(formData.hobbies));
      // formDataToSend.append('socialNetworks', JSON.stringify(formData.socialNetworks));
      // if (formData.profilePicture) {
      //   formDataToSend.append('profilePicture', formData.profilePicture);
      // }
      // 
      // const response = await userService.updateProfile(formDataToSend);
      // localStorage.setItem('user', JSON.stringify(response));

      // Simulación de actualización exitosa
      setTimeout(() => {
        setSuccess(true);
        setTimeout(() => {
          navigate('/profile');
        }, 1500);
      }, 1000);
    } catch (err) {
      setError('Error al actualizar el perfil. Por favor, inténtalo de nuevo.');
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate('/profile');
  };

  return (
    <MainLayout>
      <div className="edit-profile-page">
        {/* Header */}
        <header className="edit-profile-header">
          <button
            className="edit-profile-back"
            onClick={handleBack}
            aria-label="Volver"
          >
            <ArrowLeft size={24} />
          </button>
          <h1>Editar Perfil</h1>
          <div style={{ width: '2.5rem' }} />
        </header>

        {/* Contenido */}
        <div className="edit-profile-content">
          <form onSubmit={handleSubmit} className="edit-profile-form">
            {/* Foto de perfil */}
            <Card className="edit-profile-section">
              <h2>Foto de perfil</h2>
              <div className="edit-profile-photo-section">
                <div className="edit-profile-photo-preview">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" />
                  ) : (
                    <User size={48} />
                  )}
                </div>
                <div className="edit-profile-photo-actions">
                  {imagePreview ? (
                    <>
                      <label className="edit-profile-photo-change">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          hidden
                        />
                        Cambiar foto
                      </label>
                      <button
                        type="button"
                        className="edit-profile-photo-remove"
                        onClick={handleRemoveImage}
                      >
                        Eliminar
                      </button>
                    </>
                  ) : (
                    <label className="edit-profile-photo-upload">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        hidden
                      />
                      <Upload size={20} />
                      Subir foto
                    </label>
                  )}
                </div>
              </div>
            </Card>

            {/* Información básica */}
            <Card className="edit-profile-section">
              <h2>Información básica</h2>
              <Input
                type="text"
                name="fullName"
                label="Nombre completo"
                placeholder="Tu nombre completo"
                value={formData.fullName}
                onChange={handleInputChange}
                required
                fullWidth
              />
              <Input
                type="text"
                name="username"
                label="Nombre de usuario"
                placeholder="tunombredeusuario"
                value={formData.username}
                onChange={handleInputChange}
                required
                fullWidth
              />
              <Input
                type="email"
                name="email"
                label="Email"
                placeholder="tu@email.com"
                value={formData.email}
                onChange={handleInputChange}
                required
                fullWidth
              />
            </Card>

            {/* Biografía */}
            <Card className="edit-profile-section">
              <h2>Biografía</h2>
              <div className="edit-profile-textarea-wrapper">
                <textarea
                  name="bio"
                  className="edit-profile-textarea"
                  placeholder="Cuéntanos sobre ti..."
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows={5}
                  maxLength={500}
                />
                <span className="edit-profile-char-count">
                  {formData.bio.length}/500
                </span>
              </div>
            </Card>

            {/* Hobbies */}
            <Card className="edit-profile-section">
              <h2>Hobbies e intereses</h2>
              <p className="edit-profile-section-description">
                Selecciona tus hobbies (al menos uno)
              </p>
              <div className="edit-profile-hobbies">
                {AVAILABLE_HOBBIES.map((hobby) => (
                  <Tag
                    key={hobby}
                    color={colors.categories[hobby.toLowerCase() as keyof typeof colors.categories] || colors.primary}
                    selected={formData.hobbies.includes(hobby)}
                    onClick={() => handleHobbyToggle(hobby)}
                  >
                    {hobby}
                  </Tag>
                ))}
              </div>
            </Card>

            {/* Redes sociales */}
            <Card className="edit-profile-section">
              <h2>Redes sociales (opcional)</h2>
              <Input
                type="text"
                name="socialNetworks.instagram"
                label="Instagram"
                placeholder="@tuusuario"
                value={formData.socialNetworks.instagram}
                onChange={handleInputChange}
                fullWidth
              />
              <Input
                type="text"
                name="socialNetworks.twitter"
                label="Twitter/X"
                placeholder="@tuusuario"
                value={formData.socialNetworks.twitter}
                onChange={handleInputChange}
                fullWidth
              />
              <Input
                type="text"
                name="socialNetworks.youtube"
                label="YouTube"
                placeholder="Tu canal"
                value={formData.socialNetworks.youtube}
                onChange={handleInputChange}
                fullWidth
              />
            </Card>

            {/* Mensajes */}
            {error && (
              <div className="edit-profile-error">
                {error}
              </div>
            )}

            {success && (
              <div className="edit-profile-success">
                ¡Perfil actualizado correctamente!
              </div>
            )}

            {/* Botones */}
            <div className="edit-profile-actions">
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
                disabled={isSubmitting || success}
              >
                {isSubmitting ? 'Guardando...' : success ? 'Guardado ✓' : 'Guardar Cambios'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  );
};
