import { Router } from 'express';
import * as authController from '../controllers/authController';
import { authenticate } from '../middleware/auth';

const router = Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Registrar nuevo usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - usuario
 *               - clave
 *               - nombre
 *               - apel1
 *               - f_nac
 *             properties:
 *               usuario:
 *                 type: string
 *                 example: nuevo_usuario
 *               clave:
 *                 type: string
 *                 example: password123
 *               nombre:
 *                 type: string
 *                 example: Juan
 *               apel1:
 *                 type: string
 *                 example: Pérez
 *               apel2:
 *                 type: string
 *                 example: García
 *               f_nac:
 *                 type: string
 *                 format: date
 *                 example: 2000-01-15
 *               bio:
 *                 type: string
 *                 example: Amante del deporte
 *               hobbies:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [1, 2, 3]
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *       409:
 *         description: El usuario ya existe
 */
router.post('/register', authController.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Iniciar sesión
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - usuario
 *               - clave
 *             properties:
 *               usuario:
 *                 type: string
 *                 example: gamiluu
 *               clave:
 *                 type: string
 *                 example: 123
 *     responses:
 *       200:
 *         description: Login exitoso
 *       401:
 *         description: Credenciales inválidas
 */
router.post('/login', authController.login);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     tags: [Auth]
 *     summary: Obtener usuario actual
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Usuario actual
 *       401:
 *         description: No autenticado
 */
router.get('/me', authenticate, authController.getCurrentUser);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     tags: [Auth]
 *     summary: Cerrar sesión
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout exitoso
 */
router.post('/logout', authenticate, authController.logout);

export default router;
