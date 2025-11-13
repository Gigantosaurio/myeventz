import { Response, NextFunction } from 'express';
import { AuthRequest, AppError } from '../types';
import { verifyToken } from '../utils/jwt';

/**
 * Middleware para verificar JWT y proteger rutas
 * Uso: app.get('/ruta-protegida', authenticate, controller)
 */
export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Obtener token del header Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError(401, 'No se proporcionó token de autenticación');
    }

    // Extraer token (quitar "Bearer ")
    const token = authHeader.substring(7);

    // Verificar y decodificar token
    const decoded = verifyToken(token);

    // Añadir usuario decodificado al request
    req.user = decoded;

    next();
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        success: false,
        error: error.message,
      });
    } else {
      res.status(401).json({
        success: false,
        error: 'Token inválido o expirado',
      });
    }
  }
};

/**
 * Middleware opcional - no falla si no hay token
 * Útil para endpoints que pueden funcionar con o sin autenticación
 */
export const optionalAuthenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const decoded = verifyToken(token);
      req.user = decoded;
    }

    next();
  } catch (error) {
    // Si el token es inválido, simplemente continuar sin usuario
    next();
  }
};
