import { api } from './api';
import type { LoginFormData, RegisterFormData, AuthResponse, User, ApiResponse } from '../types';

export const authService = {
  /**
   * Login de usuario
   */
  async login(credentials: LoginFormData): Promise<{ user: User; token: string }> {
    const response = await api.post<AuthResponse>('/auth/login', credentials);

    const { user, token } = response.data.data;

    // Guardar token y usuario en localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));

    return { user, token };
  },

  /**
   * Registro de usuario
   */
  async register(userData: RegisterFormData): Promise<{ user: User; token: string }> {
    // Preparar datos para el backend (sin confirmPassword)
    const { confirmPassword, ...registerData } = userData;

    const response = await api.post<AuthResponse>('/auth/register', registerData);

    const { user, token } = response.data.data;

    // Guardar token y usuario en localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));

    return { user, token };
  },

  /**
   * Obtener usuario actual
   */
  async getCurrentUser(): Promise<User> {
    const response = await api.get<ApiResponse<User>>('/auth/me');
    return response.data.data!;
  },

  /**
   * Logout de usuario
   */
  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } finally {
      // Limpiar localStorage siempre
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  /**
   * Verificar si el usuario está autenticado
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  },

  /**
   * Obtener usuario del localStorage
   */
  getStoredUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  },

  /**
   * Obtener token del localStorage
   */
  getToken(): string | null {
    return localStorage.getItem('token');
  }
};

export default authService;
