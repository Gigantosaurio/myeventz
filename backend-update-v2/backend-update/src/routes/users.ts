import { Router } from 'express';
import * as userController from '../controllers/userController';
import { authenticate } from '../middleware/auth';
import { uploadSingle } from '../middleware/upload';

const router = Router();

/**
 * @swagger
 * /users:
 *   get:
 *     tags: [Users]
 *     summary: Buscar usuarios
 *     parameters:
 *       - in: query
 *         name: search
 *         required: true
 *         schema:
 *           type: string
 *         description: Término de búsqueda (nombre o username)
 *         example: gabriel
 *     responses:
 *       200:
 *         description: Lista de usuarios encontrados
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 */
router.get('/', userController.searchUsers);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     tags: [Users]
 *     summary: Obtener perfil de usuario
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Perfil del usuario con estadísticas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     id_usuario:
 *                       type: integer
 *                     usuario:
 *                       type: string
 *                     nombre:
 *                       type: string
 *                     bio:
 *                       type: string
 *                     imagen_perfil:
 *                       type: string
 *                     hobbies:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Category'
 *                     eventos_organizados:
 *                       type: integer
 *                     eventos_participando:
 *                       type: integer
 *       404:
 *         description: Usuario no encontrado
 */
router.get('/:id', userController.getUserById);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     tags: [Users]
 *     summary: Actualizar perfil de usuario
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario (debe ser el mismo que el usuario autenticado)
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Gabriel
 *               apel1:
 *                 type: string
 *                 example: Milagro
 *               apel2:
 *                 type: string
 *                 example: López
 *               bio:
 *                 type: string
 *                 example: Me gusta la nintendo y el skate
 *               ig:
 *                 type: string
 *                 example: '@mi_instagram'
 *               fb:
 *                 type: string
 *                 example: 'facebook.com/mi_perfil'
 *               x:
 *                 type: string
 *                 example: '@mi_twitter'
 *               yt:
 *                 type: string
 *                 example: 'youtube.com/@mi_canal'
 *               tt:
 *                 type: string
 *                 example: '@mi_tiktok'
 *               hobbies:
 *                 type: string
 *                 description: Array de IDs de categorías en formato JSON string
 *                 example: '[1,2,3]'
 *               imagen_perfil:
 *                 type: string
 *                 format: binary
 *                 description: Imagen de perfil (opcional)
 *     responses:
 *       200:
 *         description: Perfil actualizado exitosamente
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No tienes permiso para editar este perfil
 */
router.put('/:id', authenticate, uploadSingle('imagen_perfil'), userController.updateUser);

/**
 * @swagger
 * /users/{id}/events/organized:
 *   get:
 *     tags: [Users]
 *     summary: Obtener eventos organizados por un usuario
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Lista de eventos organizados por el usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Event'
 */
router.get('/:id/events/organized', userController.getUserOrganizedEvents);

/**
 * @swagger
 * /users/{id}/events/participating:
 *   get:
 *     tags: [Users]
 *     summary: Obtener eventos en los que participa un usuario
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Lista de eventos en los que participa el usuario
 */
router.get('/:id/events/participating', userController.getUserParticipatingEvents);

/**
 * @swagger
 * /users/{id}/events:
 *   get:
 *     tags: [Users]
 *     summary: Obtener TODOS los eventos de un usuario
 *     description: Devuelve tanto los eventos organizados como aquellos en los que participa
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Eventos organizados y participando del usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     organized:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Event'
 *                     participating:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Event'
 */
router.get('/:id/events', userController.getAllUserEvents);

export default router;
