import { api } from './api';
import type { Event, EventDetail, CreateEventData, ApiResponse } from '../types';

export const eventService = {
  /**
   * Obtener eventos populares
   */
  async getPopularEvents(limit: number = 10): Promise<EventDetail[]> {
    const response = await api.get<ApiResponse<EventDetail[]>>('/events/popular', {
      params: { limit }
    });
    return response.data.data || [];
  },

  /**
   * Obtener eventos recientes
   */
  async getRecentEvents(limit: number = 20): Promise<EventDetail[]> {
    const response = await api.get<ApiResponse<EventDetail[]>>('/events/recent', {
      params: { limit }
    });
    return response.data.data || [];
  },

  /**
   * Buscar eventos
   */
  async searchEvents(searchTerm?: string, categoryIds?: number[]): Promise<EventDetail[]> {
    const params: any = {};
    if (searchTerm) params.search = searchTerm;
    if (categoryIds && categoryIds.length > 0) {
      params.categories = categoryIds.join(',');
    }

    const response = await api.get<ApiResponse<EventDetail[]>>('/events/search', { params });
    return response.data.data || [];
  },

  /**
   * Obtener evento por ID
   */
  async getEventById(id: number): Promise<EventDetail> {
    const response = await api.get<ApiResponse<EventDetail>>(`/events/${id}`);
    return response.data.data!;
  },

  /**
   * Crear nuevo evento
   */
  async createEvent(eventData: CreateEventData): Promise<Event> {
    const formData = new FormData();

    // Añadir campos al formData
    formData.append('titulo', eventData.titulo);
    formData.append('descripcion', eventData.descripcion);
    formData.append('fecha', eventData.fecha);
    formData.append('hora', eventData.hora);
    formData.append('edad_min', eventData.edad_min.toString());
    formData.append('edad_max', eventData.edad_max.toString());
    formData.append('ubicacion', eventData.ubicacion);
    formData.append('max_participantes', eventData.max_participantes.toString());
    formData.append('id_categoria', eventData.id_categoria.toString());

    if (eventData.lat !== undefined) formData.append('lat', eventData.lat.toString());
    if (eventData.lng !== undefined) formData.append('lng', eventData.lng.toString());
    if (eventData.imagen) formData.append('imagen', eventData.imagen);

    const response = await api.post<ApiResponse<Event>>('/events', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.data!;
  },

  /**
   * Unirse a un evento
   */
  async joinEvent(eventId: number): Promise<void> {
    await api.post(`/events/${eventId}/join`);
  },

  /**
   * Salir de un evento
   */
  async leaveEvent(eventId: number): Promise<void> {
    await api.delete(`/events/${eventId}/leave`);
  },

  /**
   * Dar like a un evento
   */
  async likeEvent(eventId: number): Promise<void> {
    await api.post(`/events/${eventId}/like`);
  },

  /**
   * Quitar like de un evento
   */
  async unlikeEvent(eventId: number): Promise<void> {
    await api.delete(`/events/${eventId}/unlike`);
  },
};

export default eventService;
