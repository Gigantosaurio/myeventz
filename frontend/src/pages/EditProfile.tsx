import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout/MainLayout';
import { Input, Button, Card, Tag } from '../components/common';
import { ArrowLeft, User, Upload, X } from 'lucide-react';
import { authService, userService, categoryService } from '../services';
import type { Category, UserProfile, UpdateProfileData } from '../types';
import './EditProfile.css';

interface ProfileFormData {
  nombre: string;
  apel1: string;
  apel2: string;
  bio: string;
  hobbies: number[];
  profilePicture: File | null;
  ig: string;
  fb: string;
  x: string;
  yt: string;
  tt: string;
}

export const EditProfile: React.FC = () => {
  const navigate = useNavigate();
  const currentUser = authService.getStoredUser();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState<ProfileFormData>({
    nombre: '',
    apel1: '',
    apel2: '',
    bio: '',
    hobbies: [],
    profilePicture: null,
    ig: '',
    fb: '',
    x: '',
    yt: '',
    tt: '',
  });

  useEffect(() => {
    const loadData = async () => {
      if (!currentUser) {
        navigate('/login');
        return;
      }

      try {
        setIsLoading(true);
        const [profileData, categoriesData] = await Promise.all([
          userService.getUserById(currentUser.id_usuario),
          categoryService.getAllCategories(),
        ]);

        setProfile(profileData);
        setCategories(categoriesData);

        // Inicializar formulario con datos del perfil
        setFormData({
          nombre: profileData.nombre || '',
          apel1: profileData.apel1 || '',
          apel2: profileData.apel2 || '',
          bio: profileData.bio || '',
          hobbies: profileData.hobbies?.map((h) => h.id_categoria) || [],
          profilePicture: null,
          ig: profileData.ig || '',
          fb: profileData.fb || '',
          x: profileData.x || '',
          yt: profileData.yt || '',
          tt: profileData.tt || '',
        });

        if (profileData.imagen_perfil) {
          setImagePreview(profileData.imagen_perfil);
        }
      } catch (err) {
        console.error('Error loading profile:', err);
        setError('Error al cargar el perfil');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [currentUser, navigate]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleHobbyToggle = (hobbyId: number) => {
    setFormData((prev) => ({
      ...prev,
      hobbies: prev.hobbies.includes(hobbyId)
        ? prev.hobbies.filter((id) => id !== hobbyId)
        : [...prev.hobbies, hobbyId],
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
    if (!formData.nombre.trim()) {
      setError('El nombre es obligatorio');
      return false;
    }
    if (!formData.apel1.trim()) {
      setError('El primer apellido es obligatorio');
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

    if (!validateForm() || !currentUser) {
      return;
    }

    setIsSubmitting(true);

    try {
      const updateData: UpdateProfileData = {
        nombre: formData.nombre,
        apel1: formData.apel1,
        apel2: formData.apel2 || undefined,
        bio: formData.bio || undefined,
        hobbies: formData.hobbies,
        ig: formData.ig || undefined,
        fb: formData.fb || undefined,
        x: formData.x || undefined,
        yt: formData.yt || undefined,
        tt: formData.tt || undefined,
        imagen_perfil: formData.profilePicture || undefined,
      };

      await userService.updateUser(currentUser.id_usuario, updateData);
      setSuccess(true);

      setTimeout(() => {
        navigate('/profile');
      }, 1500);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Error al actualizar el perfil. Por favor, inténtalo de nuevo.');
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigate('/profile');
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="edit-profile-page">
          <div className="edit-profile-loading">Cargando perfil...</div>
        </div>
      </MainLayout>
    );
  }

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
                name="nombre"
                label="Nombre"
                placeholder="Tu nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                required
                fullWidth
              />
              <Input
                type="text"
                name="apel1"
                label="Primer apellido"
                placeholder="Tu primer apellido"
                value={formData.apel1}
                onChange={handleInputChange}
                required
                fullWidth
              />
              <Input
                type="text"
                name="apel2"
                label="Segundo apellido (opcional)"
                placeholder="Tu segundo apellido"
                value={formData.apel2}
                onChange={handleInputChange}
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
                {categories.map((category) => (
                  <Tag
                    key={category.id_categoria}
                    color={category.color}
                    selected={formData.hobbies.includes(category.id_categoria)}
                    onClick={() => handleHobbyToggle(category.id_categoria)}
                  >
                    {category.categoria}
                  </Tag>
                ))}
              </div>
            </Card>

            {/* Redes sociales */}
            <Card className="edit-profile-section">
              <h2>Redes sociales (opcional)</h2>
              <Input
                type="text"
                name="ig"
                label="Instagram"
                placeholder="@tuusuario"
                value={formData.ig}
                onChange={handleInputChange}
                fullWidth
              />
              <Input
                type="text"
                name="fb"
                label="Facebook"
                placeholder="@tuusuario"
                value={formData.fb}
                onChange={handleInputChange}
                fullWidth
              />
              <Input
                type="text"
                name="x"
                label="X (Twitter)"
                placeholder="@tuusuario"
                value={formData.x}
                onChange={handleInputChange}
                fullWidth
              />
              <Input
                type="text"
                name="yt"
                label="YouTube"
                placeholder="Tu canal"
                value={formData.yt}
                onChange={handleInputChange}
                fullWidth
              />
              <Input
                type="text"
                name="tt"
                label="TikTok"
                placeholder="@tuusuario"
                value={formData.tt}
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
