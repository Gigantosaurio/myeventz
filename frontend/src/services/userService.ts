import { api } from './api';
import type { User, UserProfile, UpdateProfileData, Event, ApiResponse } from '../types';

export const userService = {
  /**
   * Buscar usuarios por nombre o username
   */
  async searchUsers(searchTerm: string): Promise<User[]> {
    const response = await api.get<ApiResponse<User[]>>('/users', {
      params: { search: searchTerm }
    });
    return response.data.data || [];
  },

  /**
   * Obtener perfil de usuario por ID
   */
  async getUserById(userId: number): Promise<UserProfile> {
    const response = await api.get<ApiResponse<UserProfile>>(`/users/${userId}`);
    return response.data.data!;
  },

  /**
   * Actualizar perfil de usuario
   */
  async updateUser(userId: number, updateData: UpdateProfileData): Promise<User> {
    const formData = new FormData();

    // Añadir campos al formData
    if (updateData.nombre) formData.append('nombre', updateData.nombre);
    if (updateData.apel1) formData.append('apel1', updateData.apel1);
    if (updateData.apel2) formData.append('apel2', updateData.apel2);
    if (updateData.bio) formData.append('bio', updateData.bio);
    if (updateData.ig) formData.append('ig', updateData.ig);
    if (updateData.fb) formData.append('fb', updateData.fb);
    if (updateData.x) formData.append('x', updateData.x);
    if (updateData.yt) formData.append('yt', updateData.yt);
    if (updateData.tt) formData.append('tt', updateData.tt);

    if (updateData.hobbies) {
      formData.append('hobbies', JSON.stringify(updateData.hobbies));
    }

    if (updateData.imagen_perfil) {
      formData.append('imagen_perfil', updateData.imagen_perfil);
    }

    const response = await api.put<ApiResponse<User>>(`/users/${userId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // Actualizar usuario en localStorage si es el usuario actual
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (user.id_usuario === userId) {
        localStorage.setItem('user', JSON.stringify(response.data.data));
      }
    }

    return response.data.data!;
  },

  /**
   * Obtener eventos organizados por un usuario
   */
  async getUserOrganizedEvents(userId: number): Promise<Event[]> {
    const response = await api.get<ApiResponse<Event[]>>(`/users/${userId}/events/organized`);
    return response.data.data || [];
  },

  /**
   * Obtener eventos en los que participa un usuario
   */
  async getUserParticipatingEvents(userId: number): Promise<Event[]> {
    const response = await api.get<ApiResponse<Event[]>>(`/users/${userId}/events/participating`);
    return response.data.data || [];
  },

  /**
   * Obtener TODOS los eventos de un usuario (organizados + participando)
   */
  async getAllUserEvents(userId: number): Promise<{ organized: Event[]; participating: Event[] }> {
    const response = await api.get<ApiResponse<{ organized: Event[]; participating: Event[] }>>(
      `/users/${userId}/events`
    );
    return response.data.data!;
  },

  /**
   * Obtener eventos que le gustan a un usuario
   */
  async getUserLikedEvents(userId: number): Promise<Event[]> {
    const response = await api.get<ApiResponse<Event[]>>(`/users/${userId}/events/liked`);
    return response.data.data || [];
  },
};

export default userService;
