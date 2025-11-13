import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthLayout } from '../components/layout/AuthLayout/AuthLayout';
import { Button, Input, Card, Tag } from '../components/common';
import { PageTransition } from '../components/common/PageTransition/PageTransition';
import { Mail, Lock, User, Calendar, ArrowLeft, ArrowRight } from 'lucide-react';
import { colors } from '../styles/colors';
import './Register.css';

interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  dateOfBirth: string;
  firstName: string;
  lastName: string;
  hobbies: string[];
}

interface FormErrors {
  [key: string]: string;
}

const HOBBIES = [
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

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  
  const [formData, setFormData] = useState<RegisterFormData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: '',
    firstName: '',
    lastName: '',
    hobbies: [],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const toggleHobby = (hobby: string) => {
    setFormData(prev => ({
      ...prev,
      hobbies: prev.hobbies.includes(hobby)
        ? prev.hobbies.filter(h => h !== hobby)
        : [...prev.hobbies, hobby],
    }));
  };

  const validateStep1 = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'El nombre de usuario es requerido';
    } else if (formData.username.length < 4) {
      newErrors.username = 'El usuario debe tener al menos 4 caracteres';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El correo electrónico es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El correo electrónico no es válido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu contraseña';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'La fecha de nacimiento es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'El nombre es requerido';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Los apellidos son requeridos';
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
      // TODO: Aquí irá la llamada a la API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Registro exitoso:', formData);
      
      // Redirigir al login
      navigate('/login');
    } catch (error: any) {
      console.error('Error en registro:', error);
      setErrors({
        general: error.response?.data?.message || 'Error al crear la cuenta',
      });
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
            {/* Step 1: Datos de usuario */}
            {currentStep === 1 && (
              <div className="register-step-content">
                <Input
                  id="username"
                  name="username"
                  type="text"
                  label="Nombre de usuario"
                  placeholder="mangelrogel420"
                  value={formData.username}
                  onChange={handleChange}
                  error={errors.username}
                  icon={<User size={20} />}
                  fullWidth
                />

                <Input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  label="Fecha de nacimiento"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  error={errors.dateOfBirth}
                  icon={<Calendar size={20} />}
                  fullWidth
                />

                <Input
                  id="email"
                  name="email"
                  type="email"
                  label="Correo Electrónico"
                  placeholder="armange69@gmail.com"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                  icon={<Mail size={20} />}
                  fullWidth
                />

                <Input
                  id="password"
                  name="password"
                  type="password"
                  label="Contraseña"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  error={errors.password}
                  icon={<Lock size={20} />}
                  fullWidth
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
                />
              </div>
            )}

            {/* Step 2: Nombre y apellidos */}
            {currentStep === 2 && (
              <div className="register-step-content">
                <div className="register-name-row">
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    label="Nombre"
                    placeholder="Miguel Ángel"
                    value={formData.firstName}
                    onChange={handleChange}
                    error={errors.firstName}
                    fullWidth
                  />

                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    label="Apellidos"
                    placeholder="Rogel Ruiz"
                    value={formData.lastName}
                    onChange={handleChange}
                    error={errors.lastName}
                    fullWidth
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
                  {HOBBIES.map(hobby => (
                    <Tag
                      key={hobby.name}
                      color={hobby.color}
                      selected={formData.hobbies.includes(hobby.name)}
                      onClick={() => toggleHobby(hobby.name)}
                    >
                      {hobby.name}
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
