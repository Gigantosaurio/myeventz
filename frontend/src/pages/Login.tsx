import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthLayout } from '../components/layout/AuthLayout/AuthLayout';
import { Button, Input, Card } from '../components/common';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import { authService, handleApiError } from '../services';
import type { LoginFormData } from '../types';
import './Login.css';

interface FormErrors {
  usuario?: string;
  clave?: string;
  general?: string;
}

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginFormData>({
    usuario: '',
    clave: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');

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

    if (!formData.usuario.trim()) {
      newErrors.usuario = 'El nombre de usuario es requerido';
    }

    if (!formData.clave) {
      newErrors.clave = 'La contraseña es requerida';
    } else if (formData.clave.length < 3) {
      newErrors.clave = 'La contraseña debe tener al menos 3 caracteres';
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
      // Llamada a la API
      const { user, token } = await authService.login(formData);

      console.log('Login exitoso:', user);

      // Redirigir al home
      navigate('/home');
    } catch (error: any) {
      console.error('Error en login:', error);
      setErrors({
        general: handleApiError(error),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestMode = () => {
    // Continuar como invitado - simplemente navegar al home sin autenticación
    navigate('/home');
  };

  const handleForgotPassword = async () => {
    if (!forgotPasswordEmail.trim()) {
      alert('Por favor, introduce tu nombre de usuario o correo electrónico');
      return;
    }

    // Aquí iría la llamada a la API para recuperar contraseña
    // Por ahora solo mostramos un mensaje
    alert(`Se enviará un correo de recuperación a la cuenta asociada con: ${forgotPasswordEmail}`);
    setShowForgotPassword(false);
    setForgotPasswordEmail('');
  };

  return (
    <AuthLayout>
      <Card className="login-card">
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
            id="usuario"
            name="usuario"
            type="text"
            label="Nombre de usuario"
            placeholder="mangelrogel420"
            value={formData.usuario}
            onChange={handleChange}
            error={errors.usuario}
            icon={<Mail size={20} />}
            fullWidth
            disabled={isLoading}
          />

          {/* Campo de contraseña */}
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

          {/* Enlace recuperar contraseña */}
          <div className="login-options">
            <button
              type="button"
              className="login-forgot-password-link"
              onClick={() => setShowForgotPassword(true)}
              disabled={isLoading}
            >
              ¿Has olvidado tu contraseña?
            </button>
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

          {/* Botón continuar como invitado */}
          <Button
            type="button"
            variant="secondary"
            size="lg"
            fullWidth
            onClick={handleGuestMode}
            disabled={isLoading}
          >
            Continuar como invitado
          </Button>
        </form>

        {/* Modal de recuperar contraseña */}
        {showForgotPassword && (
          <div className="login-modal-overlay" onClick={() => setShowForgotPassword(false)}>
            <div className="login-modal-content" onClick={(e) => e.stopPropagation()}>
              <h2>Recuperar contraseña</h2>
              <p>Introduce tu nombre de usuario o correo electrónico y te enviaremos instrucciones para recuperar tu contraseña.</p>
              <Input
                type="text"
                placeholder="Usuario o correo electrónico"
                value={forgotPasswordEmail}
                onChange={(e) => setForgotPasswordEmail(e.target.value)}
                fullWidth
                icon={<Mail size={20} />}
              />
              <div className="login-modal-actions">
                <Button
                  variant="secondary"
                  onClick={() => setShowForgotPassword(false)}
                >
                  Cancelar
                </Button>
                <Button
                  variant="primary"
                  onClick={handleForgotPassword}
                >
                  Enviar
                </Button>
              </div>
            </div>
          </div>
        )}
      </Card>
    </AuthLayout>
  );
};
