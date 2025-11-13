import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthLayout } from '../components/layout/AuthLayout/AuthLayout';
import { Button, Input, Card, Logo } from '../components/common';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import './Login.css';

interface LoginFormData {
  username: string;
  password: string;
}

interface FormErrors {
  username?: string;
  password?: string;
  general?: string;
}

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginFormData>({
    username: '',
    password: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [rememberPassword, setRememberPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Limpiar error del campo cuando el usuario empieza a escribir
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'El nombre de usuario es requerido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // TODO: Aquí irá la llamada a la API
      // const response = await authService.login(formData);
      
      // Simulación de login (remover cuando tengamos backend)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Login exitoso:', formData);
      
      // TODO: Guardar token y usuario
      // localStorage.setItem('token', response.token);
      // localStorage.setItem('user', JSON.stringify(response.user));
      
      // Redirigir al home
      navigate('/home');
    } catch (error: any) {
      console.error('Error en login:', error);
      setErrors({
        general: error.response?.data?.message || 'Error al iniciar sesión. Verifica tus credenciales.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <Card className="login-card">
        {/* Header con Logo */}
        <div className="login-header">
          <Logo size="lg" />
          <h1 className="login-title">¡Bienvenido!</h1>
          <p className="login-subtitle">
            Tu portal de actividades y experiencias en Zaragoza.
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="login-form">
          {/* Error general */}
          {errors.general && (
            <div className="login-error-banner">
              <AlertCircle size={20} />
              <span>{errors.general}</span>
            </div>
          )}

          {/* Campo de usuario */}
          <Input
            id="username"
            name="username"
            type="text"
            label="Nombre de usuario"
            placeholder="mangelrogel420"
            value={formData.username}
            onChange={handleChange}
            error={errors.username}
            icon={<Mail size={20} />}
            fullWidth
            disabled={isLoading}
          />

          {/* Campo de contraseña */}
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
            disabled={isLoading}
          />

          {/* Recordar contraseña */}
          <div className="login-options">
            <label className="login-checkbox">
              <input
                type="checkbox"
                checked={rememberPassword}
                onChange={(e) => setRememberPassword(e.target.checked)}
                disabled={isLoading}
              />
              <span>¿Has olvidado tu contraseña?</span>
            </label>
          </div>

          {/* Botón de login */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={isLoading}
          >
            Iniciar Sesión
          </Button>

          {/* Enlace a registro */}
          <Link to="/register" className="login-register-link">
            <Button
              type="button"
              variant="ghost"
              size="lg"
              fullWidth
              disabled={isLoading}
            >
              Crear Una Nueva Cuenta
            </Button>
          </Link>
        </form>
      </Card>
    </AuthLayout>
  );
};
