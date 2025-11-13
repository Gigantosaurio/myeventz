import { Response } from 'express';
import { AuthRequest, AppError } from '../types';
import * as userModel from '../models/userModel';

/**
 * GET /api/users
 * Buscar usuarios por query
 */
export const searchUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const query = req.query.search as string;

    if (!query || query.trim().length === 0) {
      res.json({
        success: true,
        data: [],
      });
      return;
    }

    const users = await userModel.searchUsers(query);

    // Eliminar passwords
    const sanitizedUsers = users.map((user) => {
      const { clave, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });

    res.json({
      success: true,
      data: sanitizedUsers,
    });
  } catch (error) {
    console.error('Error en searchUsers:', error);
    res.status(500).json({
      success: false,
      error: 'Error al buscar usuarios',
    });
  }
};

/**
 * GET /api/users/:id
 * Obtener perfil de usuario con estadísticas
 */
export const getUserById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = parseInt(req.params.id);

    const user = await userModel.getUserWithStats(userId);

    if (!user) {
      throw new AppError(404, 'Usuario no encontrado');
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        success: false,
        error: error.message,
      });
    } else {
      console.error('Error en getUserById:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener usuario',
      });
    }
  }
};

/**
 * PUT /api/users/:id
 * Actualizar perfil de usuario (con imagen opcional)
 */
export const updateUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError(401, 'No autenticado');
    }

    const userId = parseInt(req.params.id);

    // Verificar que el usuario está actualizando su propio perfil
    if (req.user.id !== userId) {
      throw new AppError(403, 'No tienes permiso para editar este perfil');
    }

    const { nombre, apel1, apel2, bio, ig, fb, x, yt, tt, hobbies } = req.body;

    // Actualizar datos del usuario
    const userData = {
      nombre,
      apel1,
      apel2,
      bio,
      ig,
      fb,
      x,
      yt,
      tt,
    };

    await userModel.updateUser(userId, userData);

    // Si se subió una imagen, actualizar
    if (req.file) {
      const imageUrl = `/uploads/${req.file.filename}`;
      await userModel.updateProfilePicture(userId, imageUrl);
    }

    // Si se enviaron hobbies, actualizar
    if (hobbies) {
      let hobbiesArray: number[];
      
      // Manejar diferentes formatos de hobbies
      if (typeof hobbies === 'string') {
        try {
          hobbiesArray = JSON.parse(hobbies);
        } catch {
          // Si no es JSON válido, intentar separar por comas
          hobbiesArray = hobbies.split(',').map(h => parseInt(h.trim())).filter(h => !isNaN(h));
        }
      } else if (Array.isArray(hobbies)) {
        hobbiesArray = hobbies.map(h => parseInt(h)).filter(h => !isNaN(h));
      } else {
        hobbiesArray = [];
      }

      await userModel.updateUserHobbies(userId, hobbiesArray);
    }

    // Obtener usuario actualizado
    const updatedUser = await userModel.getUserWithStats(userId);

    res.json({
      success: true,
      data: updatedUser,
      message: 'Perfil actualizado exitosamente',
    });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        success: false,
        error: error.message,
      });
    } else {
      console.error('Error en updateUser:', error);
      res.status(500).json({
        success: false,
        error: 'Error al actualizar usuario',
      });
    }
  }
};

/**
 * GET /api/users/:id/events/organized
 * Obtener eventos organizados por un usuario
 */
export const getUserOrganizedEvents = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = parseInt(req.params.id);

    const events = await userModel.getUserOrganizedEvents(userId);

    res.json({
      success: true,
      data: events,
    });
  } catch (error) {
    console.error('Error en getUserOrganizedEvents:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener eventos organizados',
    });
  }
};

/**
 * GET /api/users/:id/events/participating
 * Obtener eventos en los que participa un usuario
 */
export const getUserParticipatingEvents = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = parseInt(req.params.id);

    const events = await userModel.getUserParticipatingEvents(userId);

    res.json({
      success: true,
      data: events,
    });
  } catch (error) {
    console.error('Error en getUserParticipatingEvents:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener eventos participando',
    });
  }
};

/**
 * GET /api/users/:id/events
 * Obtener TODOS los eventos de un usuario (organizados + participando)
 */
export const getAllUserEvents = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = parseInt(req.params.id);

    const organized = await userModel.getUserOrganizedEvents(userId);
    const participating = await userModel.getUserParticipatingEvents(userId);

    res.json({
      success: true,
      data: {
        organized,
        participating,
      },
    });
  } catch (error) {
    console.error('Error en getAllUserEvents:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener eventos del usuario',
    });
  }
};

/**
 * GET /api/users/:id/events/liked
 */
export const getUserLikedEvents = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = parseInt(req.params.id);
    const events = await userModel.getUserLikedEvents(userId);
    res.json({
      success: true,
      data: events,
    });
  } catch (error) {
    console.error('Error en getUserLikedEvents:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener eventos favoritos',
    });
  }
};
