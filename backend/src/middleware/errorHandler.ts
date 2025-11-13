import { Request, Response, NextFunction } from 'express';
import { AppError } from '../types';

/**
 * Middleware global de manejo de errores
 * IMPORTANTE: Debe ser el último middleware en app.ts
 */
export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('❌ Error capturado:', err);

  // Error personalizado de la aplicación
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: err.message,
    });
    return;
  }

  // Error de Multer (upload)
  if (err.name === 'MulterError') {
    res.status(400).json({
      success: false,
      error: 'Error en la subida de archivo: ' + err.message,
    });
    return;
  }

  // Error de validación de express-validator
  if (err.name === 'ValidationError') {
    res.status(400).json({
      success: false,
      error: 'Error de validación',
      details: err.message,
    });
    return;
  }

  // Error de JWT
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    res.status(401).json({
      success: false,
      error: 'Token inválido o expirado',
    });
    return;
  }

  // Error de MySQL
  if ('code' in err && typeof err.code === 'string') {
    const mysqlError = err as any;
    if (mysqlError.code === 'ER_DUP_ENTRY') {
      res.status(409).json({
        success: false,
        error: 'El registro ya existe',
      });
      return;
    }
    if (mysqlError.code === 'ER_NO_REFERENCED_ROW_2') {
      res.status(400).json({
        success: false,
        error: 'Referencia inválida',
      });
      return;
    }
  }

  // Error genérico
  res.status(500).json({
    success: false,
    error:
      process.env.NODE_ENV === 'production'
        ? 'Error interno del servidor'
        : err.message,
  });
};

/**
 * Middleware para rutas no encontradas (404)
 * Debe ir antes del errorHandler
 */
export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    error: `Ruta no encontrada: ${req.method} ${req.path}`,
  });
};
