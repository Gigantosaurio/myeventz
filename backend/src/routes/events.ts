import { Router } from 'express';
import * as eventController from '../controllers/eventController';
import { authenticate, optionalAuthenticate } from '../middleware/auth';
import { uploadSingle } from '../middleware/upload';

const router = Router();

/**
 * @swagger
 * /events/popular:
 *   get:
 *     tags: [Events]
 *     summary: Obtener eventos populares
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Número de eventos a devolver
 *     responses:
 *       200:
 *         description: Lista de eventos populares
 */
router.get('/popular', eventController.getPopularEvents);

/**
 * @swagger
 * /events/recent:
 *   get:
 *     tags: [Events]
 *     summary: Obtener eventos recientes
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Número de eventos a devolver
 *     responses:
 *       200:
 *         description: Lista de eventos recientes
 */
router.get('/recent', eventController.getRecentEvents);

/**
 * @swagger
 * /events/search:
 *   get:
 *     tags: [Events]
 *     summary: Buscar eventos
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Término de búsqueda
 *       - in: query
 *         name: categories
 *         schema:
 *           type: string
 *         description: IDs de categorías separados por comas (ej. 1,2,3)
 *     responses:
 *       200:
 *         description: Lista de eventos encontrados
 */
router.get('/search', eventController.searchEvents);

/**
 * @swagger
 * /events/{id}:
 *   get:
 *     tags: [Events]
 *     summary: Obtener evento por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del evento
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Detalle del evento
 *       404:
 *         description: Evento no encontrado
 */
router.get('/:id', optionalAuthenticate, eventController.getEventById);

/**
 * @swagger
 * /events:
 *   post:
 *     tags: [Events]
 *     summary: Crear nuevo evento
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - titulo
 *               - descripcion
 *               - fecha
 *               - hora
 *               - ubicacion
 *               - id_categoria
 *             properties:
 *               titulo:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               fecha:
 *                 type: string
 *                 format: date
 *               hora:
 *                 type: string
 *               edad_min:
 *                 type: integer
 *               edad_max:
 *                 type: integer
 *               ubicacion:
 *                 type: string
 *               lat:
 *                 type: number
 *               lng:
 *                 type: number
 *               max_participantes:
 *                 type: integer
 *               id_categoria:
 *                 type: integer
 *               imagen:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Evento creado exitosamente
 *       401:
 *         description: No autenticado
 */
router.post('/', authenticate, uploadSingle('imagen'), eventController.createEvent);

/**
 * @swagger
 * /events/{id}/join:
 *   post:
 *     tags: [Events]
 *     summary: Unirse a un evento
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Unido exitosamente
 *       401:
 *         description: No autenticado
 */
router.post('/:id/join', authenticate, eventController.joinEvent);

/**
 * @swagger
 * /events/{id}/leave:
 *   delete:
 *     tags: [Events]
 *     summary: Salir de un evento
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Salida exitosa
 *       401:
 *         description: No autenticado
 */
router.delete('/:id/leave', authenticate, eventController.leaveEvent);

/**
 * @swagger
 * /events/{id}/like:
 *   post:
 *     tags: [Events]
 *     summary: Dar like a un evento
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Like añadido
 *       401:
 *         description: No autenticado
 */
router.post('/:id/like', authenticate, eventController.likeEvent);

/**
 * @swagger
 * /events/{id}/unlike:
 *   delete:
 *     tags: [Events]
 *     summary: Quitar like de un evento
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Like eliminado
 *       401:
 *         description: No autenticado
 */
router.delete('/:id/unlike', authenticate, eventController.unlikeEvent);

export default router;
