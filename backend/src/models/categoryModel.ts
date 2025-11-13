import { RowDataPacket } from 'mysql2';
import { dbPool } from '../config/database';
import { Category } from '../types';

/**
 * Obtener todas las categorías
 */
export const getAllCategories = async (): Promise<Category[]> => {
  const [rows] = await dbPool.execute<RowDataPacket[]>(
    'SELECT * FROM categorias ORDER BY categoria ASC'
  );
  return rows as Category[];
};

/**
 * Obtener categoría por ID
 */
export const getCategoryById = async (id: number): Promise<Category | null> => {
  const [rows] = await dbPool.execute<RowDataPacket[]>(
    'SELECT * FROM categorias WHERE id_categoria = ?',
    [id]
  );
  return rows.length > 0 ? (rows[0] as Category) : null;
};

/**
 * Obtener eventos de una categoría
 */
export const getCategoryEvents = async (categoryId: number): Promise<any[]> => {
  const [rows] = await dbPool.execute<RowDataPacket[]>(
    `SELECT e.*, 
            CONCAT(u.nombre, ' ', u.apel1, ' ', IFNULL(u.apel2, '')) AS organizador_nombre,
            u.usuario AS organizador_usuario,
            (SELECT COUNT(*) FROM participantes_eventos pe WHERE pe.id_evento = e.id_evento) AS participantes_actuales,
            (SELECT COUNT(*) FROM eventos_likes el WHERE el.id_evento = e.id_evento) AS total_likes
     FROM eventos e
     JOIN usuarios u ON e.id_usuario = u.id_usuario
     JOIN eventos_categorias ec ON e.id_evento = ec.id_evento
     WHERE ec.id_categoria = ? AND e.fecha >= CURDATE()
     ORDER BY e.fecha ASC`,
    [categoryId]
  );
  return rows;
};
