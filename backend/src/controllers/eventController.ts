import { Response } from 'express';
import { AuthRequest, EventCreateInput, AppError } from '../types';
import * as eventModel from '../models/eventModel';

/**
 * GET /api/events/popular
 */
export const getPopularEvents = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const events = await eventModel.getPopularEvents(limit);

    res.json({
      success: true,
      data: events,
    });
  } catch (error) {
    console.error('Error en getPopularEvents:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener eventos populares',
    });
  }
};

/**
 * GET /api/events/recent
 */
export const getRecentEvents = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const limit = parseInt(req.query.limit as string) || 20;
    const events = await eventModel.getRecentEvents(limit);

    res.json({
      success: true,
      data: events,
    });
  } catch (error) {
    console.error('Error en getRecentEvents:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener eventos recientes',
    });
  }
};

/**
 * GET /api/events/search
 */
export const searchEvents = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const searchTerm = req.query.search as string;
    const categoryIds = req.query.categories as string;

    const events = await eventModel.searchEvents(searchTerm, categoryIds);

    res.json({
      success: true,
      data: events,
    });
  } catch (error) {
    console.error('Error en searchEvents:', error);
    res.status(500).json({
      success: false,
      error: 'Error al buscar eventos',
    });
  }
};

/**
 * GET /api/events/:id
 */
export const getEventById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const eventId = parseInt(req.params.id);
    const userId = req.user?.id;

    const event = await eventModel.getEventById(eventId, userId);

    if (!event) {
      throw new AppError(404, 'Evento no encontrado');
    }

    // Obtener participantes
    const participantes = await eventModel.getEventParticipants(eventId);

    res.json({
      success: true,
      data: {
        ...event,
        participantes,
      },
    });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        success: false,
        error: error.message,
      });
    } else {
      console.error('Error en getEventById:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener evento',
      });
    }
  }
};

/**
 * POST /api/events
 */
export const createEvent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError(401, 'No autenticado');
    }

    const eventData: EventCreateInput = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : undefined;

    const eventId = await eventModel.createEvent(eventData, req.user.id, imagePath);

    // Obtener evento creado
    const event = await eventModel.getEventById(eventId);

    res.status(201).json({
      success: true,
      data: event,
      message: 'Evento creado exitosamente',
    });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        success: false,
        error: error.message,
      });
    } else {
      console.error('Error en createEvent:', error);
      res.status(500).json({
        success: false,
        error: 'Error al crear evento',
      });
    }
  }
};

/**
 * POST /api/events/:id/join
 */
export const joinEvent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError(401, 'No autenticado');
    }

    const eventId = parseInt(req.params.id);
    await eventModel.joinEvent(eventId, req.user.id);

    res.json({
      success: true,
      message: 'Te has unido al evento exitosamente',
    });
  } catch (error) {
    console.error('Error en joinEvent:', error);
    res.status(500).json({
      success: false,
      error: 'Error al unirse al evento',
    });
  }
};

/**
 * DELETE /api/events/:id/leave
 */
export const leaveEvent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError(401, 'No autenticado');
    }

    const eventId = parseInt(req.params.id);
    await eventModel.leaveEvent(eventId, req.user.id);

    res.json({
      success: true,
      message: 'Has salido del evento exitosamente',
    });
  } catch (error) {
    console.error('Error en leaveEvent:', error);
    res.status(500).json({
      success: false,
      error: 'Error al salir del evento',
    });
  }
};

/**
 * POST /api/events/:id/like
 */
export const likeEvent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError(401, 'No autenticado');
    }

    const eventId = parseInt(req.params.id);
    await eventModel.likeEvent(eventId, req.user.id);

    res.json({
      success: true,
      message: 'Like añadido exitosamente',
    });
  } catch (error) {
    console.error('Error en likeEvent:', error);
    res.status(500).json({
      success: false,
      error: 'Error al dar like al evento',
    });
  }
};

/**
 * DELETE /api/events/:id/unlike
 */
export const unlikeEvent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError(401, 'No autenticado');
    }

    const eventId = parseInt(req.params.id);
    await eventModel.unlikeEvent(eventId, req.user.id);

    res.json({
      success: true,
      message: 'Like eliminado exitosamente',
    });
  } catch (error) {
    console.error('Error en unlikeEvent:', error);
    res.status(500).json({
      success: false,
      error: 'Error al quitar like del evento',
    });
  }
};
