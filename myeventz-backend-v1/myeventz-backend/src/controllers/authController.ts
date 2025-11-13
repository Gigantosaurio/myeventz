import { Response } from 'express';
import { AuthRequest, UserRegisterInput, UserLoginInput, AppError } from '../types';
import * as userModel from '../models/userModel';
import { hashPassword, comparePassword } from '../utils/bcrypt';
import { generateToken } from '../utils/jwt';

/**
 * POST /api/auth/register
 * Registrar nuevo usuario
 */
export const register = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userData: UserRegisterInput = req.body;

    // Validar que el username no exista
    const existingUser = await userModel.findUserByUsername(userData.usuario);
    if (existingUser) {
      throw new AppError(409, 'El nombre de usuario ya está en uso');
    }

    // Hashear password
    const hashedPassword = await hashPassword(userData.clave);

    // Crear usuario
    const userId = await userModel.createUser(userData, hashedPassword);

    // Añadir hobbies si se proporcionaron
    if (userData.hobbies && userData.hobbies.length > 0) {
      await userModel.addUserHobbies(userId, userData.hobbies);
    }

    // Obtener usuario creado (sin password)
    const user = await userModel.findUserById(userId);
    if (!user) {
      throw new AppError(500, 'Error al crear usuario');
    }

    // Eliminar password del objeto
    delete user.clave;

    // Generar token
    const token = generateToken({ id: user.id_usuario, usuario: user.usuario });

    // Responder
    res.status(201).json({
      success: true,
      data: {
        token,
        user,
      },
      message: 'Usuario registrado exitosamente',
    });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        success: false,
        error: error.message,
      });
    } else {
      console.error('Error en register:', error);
      res.status(500).json({
        success: false,
        error: 'Error al registrar usuario',
      });
    }
  }
};

/**
 * POST /api/auth/login
 * Iniciar sesión
 */
export const login = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { usuario, clave }: UserLoginInput = req.body;

    // Buscar usuario
    const user = await userModel.findUserByUsername(usuario);
    if (!user) {
      throw new AppError(401, 'Credenciales inválidas');
    }

    // Verificar password
    const isValidPassword = await comparePassword(clave, user.clave!);
    if (!isValidPassword) {
      throw new AppError(401, 'Credenciales inválidas');
    }

    // Eliminar password del objeto
    delete user.clave;

    // Generar token
    const token = generateToken({ id: user.id_usuario, usuario: user.usuario });

    // Responder
    res.json({
      success: true,
      data: {
        token,
        user,
      },
      message: 'Login exitoso',
    });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        success: false,
        error: error.message,
      });
    } else {
      console.error('Error en login:', error);
      res.status(500).json({
        success: false,
        error: 'Error al iniciar sesión',
      });
    }
  }
};

/**
 * GET /api/auth/me
 * Obtener usuario actual (requiere autenticación)
 */
export const getCurrentUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError(401, 'No autenticado');
    }

    // Obtener usuario
    const user = await userModel.findUserById(req.user.id);
    if (!user) {
      throw new AppError(404, 'Usuario no encontrado');
    }

    // Eliminar password
    delete user.clave;

    // Obtener hobbies
    const hobbies = await userModel.getUserHobbies(user.id_usuario);

    res.json({
      success: true,
      data: {
        user: {
          ...user,
          hobbies,
        },
      },
    });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        success: false,
        error: error.message,
      });
    } else {
      console.error('Error en getCurrentUser:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener usuario actual',
      });
    }
  }
};

/**
 * POST /api/auth/logout
 * Cerrar sesión (solo informativo, el token se elimina en el cliente)
 */
export const logout = async (req: AuthRequest, res: Response): Promise<void> => {
  res.json({
    success: true,
    message: 'Logout exitoso',
  });
};
