// Usuario
export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  bio?: string;
  profilePicture?: string;
  hobbies: string[];
  createdAt: string;
  updatedAt: string;
}

// Evento
export interface Event {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  location: {
    name: string;
    address: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  dateTime: string;
  ageRange: {
    min: number;
    max: number;
  };
  maxParticipants?: number;
  currentParticipants: number;
  organizer: {
    id: string;
    username: string;
    profilePicture?: string;
  };
  participants: Array<{
    id: string;
    username: string;
    profilePicture?: string;
  }>;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// Categoría
export interface Category {
  id: string;
  name: string;
  color: string;
  icon?: string;
}

// Formulario de registro
export interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  bio?: string;
  hobbies: string[];
}

// Formulario de login
export interface LoginFormData {
  username: string;
  password: string;
}

// Respuesta de autenticación
export interface AuthResponse {
  user: User;
  token: string;
}

// Estado de error
export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}
