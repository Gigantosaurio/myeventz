import { Request, Response } from 'express';
import * as userModel from '../models/userModel';
import * as eventModel from '../models/eventModel';

/**
 * GET /api/search
 * Búsqueda mixta de usuarios y eventos
 */
export const mixedSearch = async (req: Request, res: Response): Promise<void> => {
  try {
    const query = req.query.q as string;
    const type = req.query.type as string || 'all';

    if (!query || query.trim().length === 0) {
      res.json({
        success: true,
        data: {
          users: [],
          events: [],
        },
      });
      return;
    }

    let users: any[] = [];
    let events: any[] = [];

    // Buscar según el tipo
    if (type === 'all' || type === 'users') {
      users = await userModel.searchUsers(query);
    }

    if (type === 'all' || type === 'events') {
      events = await eventModel.searchEvents(query);
    }

    res.json({
      success: true,
      data: {
        users,
        events,
      },
    });
  } catch (error) {
    console.error('Error en mixedSearch:', error);
    res.status(500).json({
      success: false,
      error: 'Error al realizar la búsqueda',
    });
  }
};
