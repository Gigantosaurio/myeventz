import { Request, Response } from 'express';
import * as categoryModel from '../models/categoryModel';
import { AppError } from '../types';

/**
 * GET /api/categories
 * Obtener todas las categorías
 */
export const getAllCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await categoryModel.getAllCategories();

    res.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error('Error en getAllCategories:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener categorías',
    });
  }
};

/**
 * GET /api/categories/:id
 * Obtener una categoría por ID
 */
export const getCategoryById = async (req: Request, res: Response): Promise<void> => {
  try {
    const categoryId = parseInt(req.params.id);
    const category = await categoryModel.getCategoryById(categoryId);

    if (!category) {
      throw new AppError(404, 'Categoría no encontrada');
    }

    res.json({
      success: true,
      data: category,
    });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        success: false,
        error: error.message,
      });
    } else {
      console.error('Error en getCategoryById:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener categoría',
      });
    }
  }
};

/**
 * GET /api/categories/:id/events
 * Obtener eventos de una categoría
 */
export const getCategoryEvents = async (req: Request, res: Response): Promise<void> => {
  try {
    const categoryId = parseInt(req.params.id);
    const events = await categoryModel.getCategoryEvents(categoryId);

    res.json({
      success: true,
      data: events,
    });
  } catch (error) {
    console.error('Error en getCategoryEvents:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener eventos de la categoría',
    });
  }
};
