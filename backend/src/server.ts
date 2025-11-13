import dotenv from 'dotenv';

// Cargar variables de entorno ANTES de importar app
dotenv.config();

import app from './app';
import { testConnection, closeConnection } from './config/database';

const PORT = process.env.PORT || 3000;

// ============================================
// INICIAR SERVIDOR
// ============================================

const startServer = async () => {
  try {
    // Probar conexión a MySQL
    await testConnection();

    // Iniciar servidor HTTP
    const server = app.listen(PORT, () => {
      console.log('');
      console.log('╔══════════════════════════════════════════════════════╗');
      console.log('║                                                      ║');
      console.log('║           🚀  MyEventz API INICIADO  🚀             ║');
      console.log('║                                                      ║');
      console.log('╚══════════════════════════════════════════════════════╝');
      console.log('');
      console.log(`🌐 Servidor corriendo en: http://localhost:${PORT}`);
      console.log(`📚 Swagger docs: http://localhost:${PORT}/api-docs`);
      console.log(`💚 Health check: http://localhost:${PORT}/health`);
      console.log(`🔧 Ambiente: ${process.env.NODE_ENV || 'development'}`);
      console.log('');
      console.log('✨ Endpoints disponibles:');
      console.log('   POST   /api/auth/register');
      console.log('   POST   /api/auth/login');
      console.log('   GET    /api/auth/me');
      console.log('   GET    /api/events/popular');
      console.log('   GET    /api/events/recent');
      console.log('   GET    /api/events/:id');
      console.log('   POST   /api/events');
      console.log('   GET    /api/categories');
      console.log('   GET    /api/search');
      console.log('');
      console.log('💡 Presiona Ctrl+C para detener el servidor');
      console.log('');
    });

    // Manejo de señales de terminación
    const gracefulShutdown = async (signal: string) => {
      console.log(`\n⚠️  Señal ${signal} recibida. Cerrando servidor...`);

      server.close(async () => {
        console.log('✅ Servidor HTTP cerrado');

        try {
          await closeConnection();
          console.log('✅ Conexiones cerradas correctamente');
          process.exit(0);
        } catch (error) {
          console.error('❌ Error al cerrar conexiones:', error);
          process.exit(1);
        }
      });

      // Forzar cierre después de 10 segundos
      setTimeout(() => {
        console.error('❌ Forzando cierre del servidor...');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    console.error('');
    console.error('💡 Verifica que:');
    console.error('   1. XAMPP MySQL esté corriendo');
    console.error('   2. El archivo .env tenga las credenciales correctas');
    console.error('   3. La base de datos "myeventz" exista');
    console.error('');
    process.exit(1);
  }
};

// Iniciar servidor
startServer();
