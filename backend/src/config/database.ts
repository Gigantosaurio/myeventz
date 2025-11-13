import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Configuración del pool de conexiones MySQL
export const dbPool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'myeventz',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

/**
 * Función para verificar la conexión a MySQL
 */
export const testConnection = async (): Promise<void> => {
  try {
    const connection = await dbPool.getConnection();
    console.log('✅ Conexión a MySQL establecida correctamente');
    console.log(`📊 Base de datos: ${process.env.DB_NAME}`);
    console.log(`🔌 Host: ${process.env.DB_HOST}:${process.env.DB_PORT}`);
    connection.release();
  } catch (error) {
    console.error('❌ Error al conectar con MySQL:', error);
    console.error('');
    console.error('💡 Verifica que:');
    console.error('   1. XAMPP MySQL esté corriendo');
    console.error('   2. El archivo .env tenga las credenciales correctas');
    console.error('   3. La base de datos "myeventz" exista');
    throw error;
  }
};

/**
 * Función para cerrar el pool de conexiones
 */
export const closeConnection = async (): Promise<void> => {
  try {
    await dbPool.end();
    console.log('✅ Pool de conexiones MySQL cerrado');
  } catch (error) {
    console.error('❌ Error al cerrar el pool de conexiones:', error);
    throw error;
  }
};
