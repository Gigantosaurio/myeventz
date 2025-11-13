import { Request } from 'express';

// ============================================
// USER TYPES
// ============================================

export interface User {
  id_usuario: number;
  usuario: string;
  clave?: string; // Nunca se devuelve al cliente
  nombre: string;
  apel1: string;
  apel2?: string;
  f_nac: Date;
  bio?: string;
  imagen_perfil?: string;
  ig?: string;
  fb?: string;
  x?: string;
  yt?: string;
  tt?: string;
  created_at: Date;
  updated_at: Date;
}

export interface UserRegisterInput {
  usuario: string;
  clave: string;
  nombre: string;
  apel1: string;
  apel2?: string;
  f_nac: string; // YYYY-MM-DD
  bio?: string;
  hobbies: number[]; // Array de id_categoria
}

export interface UserLoginInput {
  usuario: string;
  clave: string;
}

// ============================================
// EVENT TYPES
// ============================================

export interface Event {
  id_evento: number;
  id_usuario: number;
  titulo: string;
  fecha: Date;
  hora: string;
  descripcion: string;
  edad_min: number;
  edad_max: number;
  ubicacion: string;
  imagen?: string;
  lat?: number;
  lng?: number;
  max_participantes: number;
  created_at: Date;
  updated_at: Date;
}

export interface EventCreateInput {
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

// ============================================
// CATEGORY TYPES
// ============================================

export interface Category {
  id_categoria: number;
  categoria: string;
  color: string;
  created_at: Date;
}

// ============================================
// AUTH TYPES
// ============================================

export interface JWTPayload {
  id: number;
  usuario: string;
}

export interface AuthRequest extends Request {
  user?: JWTPayload;
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

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational: boolean = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}
