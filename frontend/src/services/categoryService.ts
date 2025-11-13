import { api } from './api';
import type { Category, Event, ApiResponse } from '../types';

export const categoryService = {
  /**
   * Obtener todas las categorías
   */
  async getAllCategories(): Promise<Category[]> {
    const response = await api.get<ApiResponse<Category[]>>('/categories');
    return response.data.data || [];
  },

  /**
   * Obtener categoría por ID
   */
  async getCategoryById(categoryId: number): Promise<Category> {
    const response = await api.get<ApiResponse<Category>>(`/categories/${categoryId}`);
    return response.data.data!;
  },

  /**
   * Obtener eventos de una categoría
   */
  async getCategoryEvents(categoryId: number): Promise<Event[]> {
    const response = await api.get<ApiResponse<Event[]>>(`/categories/${categoryId}/events`);
    return response.data.data || [];
  },
};

export default categoryService;
