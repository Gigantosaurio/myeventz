import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthLayout } from '../components/layout/AuthLayout/AuthLayout';
import { Button, Input, Card, Tag } from '../components/common';
import { PageTransition } from '../components/common/PageTransition/PageTransition';
import { Lock, User, Calendar, ArrowLeft, ArrowRight } from 'lucide-react';
import { authService, categoryService, handleApiError } from '../services';
import type { RegisterFormData, Category } from '../types';
import './Register.css';

interface FormErrors {
  [key: string]: string;
}

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [categories, setCategories] = useState<Category[]>([]);

  const [formData, setFormData] = useState<RegisterFormData>({
    usuario: '',
    clave: '',
    confirmPassword: '',
    nombre: '',
    apel1: '',
    apel2: '',
    f_nac: '',
    bio: '',
    hobbies: [],
  });

  // Cargar categorías al montar el componente
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const cats = await categoryService.getAllCategories();
        setCategories(cats);
      } catch (error) {
        console.error('Error loading categories:', error);
      }
    };
    loadCategories();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const toggleHobby = (categoryId: number) => {
    setFormData(prev => ({
      ...prev,
      hobbies: prev.hobbies.includes(categoryId)
        ? prev.hobbies.filter(id => id !== categoryId)
        : [...prev.hobbies, categoryId],
    }));
  };

  const validateStep1 = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.usuario.trim()) {
      newErrors.usuario = 'El nombre de usuario es requerido';
    } else if (formData.usuario.length < 3) {
      newErrors.usuario = 'El usuario debe tener al menos 3 caracteres';
    }

    if (!formData.clave) {
      newErrors.clave = 'La contraseña es requerida';
    } else if (formData.clave.length < 3) {
      newErrors.clave = 'La contraseña debe tener al menos 3 caracteres';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu contraseña';
    } else if (formData.clave !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    if (!formData.f_nac) {
      newErrors.f_nac = 'La fecha de nacimiento es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }

    if (!formData.apel1.trim()) {
      newErrors.apel1 = 'El primer apellido es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = (): boolean => {
    const newErrors: FormErrors = {};

    if (formData.hobbies.length < 3) {
      newErrors.hobbies = 'Selecciona al menos 3 hobbies o categorías';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    let isValid = false;

    if (currentStep === 1) {
      isValid = validateStep1();
    } else if (currentStep === 2) {
      isValid = validateStep2();
    }

    if (isValid && currentStep < 3) {
      setDirection('right');
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setDirection('left');
      setCurrentStep(currentStep - 1);
      setErrors({});
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateStep3()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // Llamada a la API
      await authService.register(formData);

      console.log('Registro exitoso');

      // Redirigir al home directamente (el servicio ya guarda el token)
      navigate('/home');
    } catch (error: any) {
      console.error('Error en registro:', error);
      setErrors({
        general: handleApiError(error),
      });
      // Volver al paso 1 si hay error
      setDirection('left');
      setCurrentStep(1);
    } finally {
      setIsLoading(false);
    }
  };

  const getTitles = () => {
    switch (currentStep) {
      case 1:
        return {
          title: '¡Regístrate!',
          subtitle: 'Regístrate como un nuevo usuario de MyEventz',
        };
      case 2:
        return {
          title: 'Completa tu información',
          subtitle: 'Completa la información adicional de tu nuevo perfil',
        };
      case 3:
        return {
          title: 'Selecciona tus hobbies',
          subtitle: 'Selecciona al menos 3 hobbies y categorías que sean de tu interés',
        };
      default:
        return {
          title: '¡Regístrate!',
          subtitle: 'Crea tu cuenta en MyEventz',
        };
    }
  };

  const { title, subtitle } = getTitles();

  return (
    <AuthLayout title={title} subtitle={subtitle}>
      <Card className="register-card">
        {/* Indicador de pasos */}
        <div className="register-steps">
          {[1, 2, 3].map(step => (
            <div
              key={step}
              className={`register-step ${currentStep >= step ? 'active' : ''}`}
            >
              {step}
            </div>
          ))}
        </div>

        <PageTransition direction={direction}>
          <form onSubmit={currentStep === 3 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }} className="register-form">
            {/* Error general */}
            {errors.general && (
              <div className="register-error-banner">
                {errors.general}
              </div>
            )}

            {/* Step 1: Datos de usuario */}
            {currentStep === 1 && (
              <div className="register-step-content">
                <Input
                  id="usuario"
                  name="usuario"
                  type="text"
                  label="Nombre de usuario"
                  placeholder="mangelrogel420"
                  value={formData.usuario}
                  onChange={handleChange}
                  error={errors.usuario}
                  icon={<User size={20} />}
                  fullWidth
                  disabled={isLoading}
                />

                <Input
                  id="f_nac"
                  name="f_nac"
                  type="date"
                  label="Fecha de nacimiento"
                  value={formData.f_nac}
                  onChange={handleChange}
                  error={errors.f_nac}
                  icon={<Calendar size={20} />}
                  fullWidth
                  disabled={isLoading}
                />

                <Input
                  id="clave"
                  name="clave"
                  type="password"
                  label="Contraseña"
                  placeholder="••••••••"
                  value={formData.clave}
                  onChange={handleChange}
                  error={errors.clave}
                  icon={<Lock size={20} />}
                  fullWidth
                  disabled={isLoading}
                />

                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  label="Confirmar contraseña"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  error={errors.confirmPassword}
                  icon={<Lock size={20} />}
                  fullWidth
                  disabled={isLoading}
                />
              </div>
            )}

            {/* Step 2: Nombre y apellidos */}
            {currentStep === 2 && (
              <div className="register-step-content">
                <Input
                  id="nombre"
                  name="nombre"
                  type="text"
                  label="Nombre"
                  placeholder="Miguel Ángel"
                  value={formData.nombre}
                  onChange={handleChange}
                  error={errors.nombre}
                  fullWidth
                  disabled={isLoading}
                />

                <div className="register-name-row">
                  <Input
                    id="apel1"
                    name="apel1"
                    type="text"
                    label="Primer Apellido"
                    placeholder="Rogel"
                    value={formData.apel1}
                    onChange={handleChange}
                    error={errors.apel1}
                    fullWidth
                    disabled={isLoading}
                  />

                  <Input
                    id="apel2"
                    name="apel2"
                    type="text"
                    label="Segundo Apellido (opcional)"
                    placeholder="Ruiz"
                    value={formData.apel2 || ''}
                    onChange={handleChange}
                    fullWidth
                    disabled={isLoading}
                  />
                </div>

                <div className="register-bio-container">
                  <label htmlFor="bio" className="register-bio-label">
                    Bio (opcional)
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    placeholder="Cuéntanos algo sobre ti..."
                    value={formData.bio || ''}
                    onChange={handleChange}
                    className="register-bio-textarea"
                    rows={3}
                    disabled={isLoading}
                  />
                </div>
              </div>
            )}

            {/* Step 3: Hobbies */}
            {currentStep === 3 && (
              <div className="register-step-content">
                {errors.hobbies && (
                  <div className="register-error-text">{errors.hobbies}</div>
                )}
                <div className="register-hobbies">
                  {categories.map(category => (
                    <Tag
                      key={category.id_categoria}
                      color={category.color}
                      selected={formData.hobbies.includes(category.id_categoria)}
                      onClick={() => toggleHobby(category.id_categoria)}
                    >
                      {category.categoria}
                    </Tag>
                  ))}
                </div>
                <div className="register-hobbies-count">
                  {formData.hobbies.length} seleccionado{formData.hobbies.length !== 1 ? 's' : ''}
                </div>
              </div>
            )}

            {/* Botones de navegación */}
            <div className="register-actions">
              {currentStep > 1 && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleBack}
                  disabled={isLoading}
                >
                  <ArrowLeft size={20} />
                  Atrás
                </Button>
              )}

              {currentStep < 3 ? (
                <Button
                  type="submit"
                  variant="primary"
                  fullWidth={currentStep === 1}
                  disabled={isLoading}
                >
                  Continuar
                  <ArrowRight size={20} />
                </Button>
              ) : (
                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  loading={isLoading}
                >
                  Crear Cuenta
                </Button>
              )}
            </div>

            {/* Link a login */}
            {currentStep === 1 && (
              <Link to="/login" className="register-login-link">
                <Button
                  type="button"
                  variant="ghost"
                  size="lg"
                  fullWidth
                  disabled={isLoading}
                >
                  Volver Al Inicio de Sesión
                </Button>
              </Link>
            )}
          </form>
        </PageTransition>
      </Card>
    </AuthLayout>
  );
};
