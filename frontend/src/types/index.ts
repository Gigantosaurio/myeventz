// ============================================
// USER TYPES
// ============================================

export interface User {
  id_usuario: number;
  usuario: string;
  nombre: string;
  apel1: string;
  apel2?: string;
  f_nac: string;
  bio?: string;
  imagen_perfil?: string;
  ig?: string;
  fb?: string;
  x?: string;
  yt?: string;
  tt?: string;
  created_at: string;
  updated_at: string;
}

export interface UserProfile extends User {
  hobbies?: Category[];
  eventos_organizados?: number;
  eventos_participando?: number;
}

export interface RegisterFormData {
  usuario: string;
  clave: string;
  confirmPassword?: string;
  nombre: string;
  apel1: string;
  apel2?: string;
  f_nac: string;
  bio?: string;
  hobbies: number[];
}

export interface LoginFormData {
  usuario: string;
  clave: string;
}

export interface UpdateProfileData {
  nombre?: string;
  apel1?: string;
  apel2?: string;
  bio?: string;
  ig?: string;
  fb?: string;
  x?: string;
  yt?: string;
  tt?: string;
  hobbies?: number[];
  imagen_perfil?: File;
}

// ============================================
// EVENT TYPES
// ============================================

export interface Event {
  id_evento: number;
  id_usuario: number;
  titulo: string;
  fecha: string;
  hora: string;
  descripcion: string;
  edad_min: number;
  edad_max: number;
  ubicacion: string;
  imagen?: string;
  lat?: number;
  lng?: number;
  max_participantes: number;
  created_at: string;
  updated_at: string;
}

export interface EventDetail extends Event {
  organizador_nombre: string;
  organizador_usuario: string;
  organizador_imagen?: string;
  organizador_id: number;
  categoria_nombre?: string;
  categoria_color?: string;
  participantes_actuales: number;
  total_likes: number;
  is_participant?: boolean;
  liked_by_user?: boolean;
}

export interface CreateEventData {
  titulo: string;
  descripcion: string;
  fecha: string;
  hora: string;
  edad_min: number;
  edad_max: number;
  ubicacion: string;
  lat?: number;
  lng?: number;
  max_participantes: number;
  id_categoria: number;
  imagen?: File;
}

// ============================================
// CATEGORY TYPES
// ============================================

export interface Category {
  id_categoria: number;
  categoria: string;
  color: string;
  created_at?: string;
}

// ============================================
// AUTH TYPES
// ============================================

export interface AuthResponse {
  success: boolean;
  data: {
    user: User;
    token: string;
  };
  message?: string;
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// ============================================
// ERROR TYPES
// ============================================

export interface ApiError {
  message: string;
  error?: string;
  errors?: Record<string, string[]>;
}
