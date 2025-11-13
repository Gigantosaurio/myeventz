import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'MyEventz API',
      version: '1.0.0',
      description: 'API REST para la plataforma de gestión de eventos MyEventz',
      contact: {
        name: 'MyEventz Team',
        email: 'support@myeventz.com',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}/api`,
        description: 'Servidor de desarrollo',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Ingresa el token JWT obtenido del login',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id_usuario: { type: 'integer', example: 1 },
            usuario: { type: 'string', example: 'gamiluu' },
            nombre: { type: 'string', example: 'Gabriel' },
            apel1: { type: 'string', example: 'Milagro' },
            apel2: { type: 'string', example: 'López', nullable: true },
            f_nac: { type: 'string', format: 'date', example: '2002-05-19' },
            bio: { type: 'string', example: 'Hola me gusta la nintendo', nullable: true },
            imagen_perfil: { type: 'string', nullable: true },
          },
        },
        Event: {
          type: 'object',
          properties: {
            id_evento: { type: 'integer', example: 1 },
            titulo: { type: 'string', example: 'Partido de fútbol 11' },
            descripcion: { type: 'string', example: 'Partido en el Parque Grande' },
            fecha: { type: 'string', format: 'date', example: '2024-12-15' },
            hora: { type: 'string', format: 'time', example: '18:00' },
            ubicacion: { type: 'string', example: 'Parque Grande' },
            edad_min: { type: 'integer', example: 16 },
            edad_max: { type: 'integer', example: 45 },
            max_participantes: { type: 'integer', example: 22 },
            imagen: { type: 'string', nullable: true },
          },
        },
        Category: {
          type: 'object',
          properties: {
            id_categoria: { type: 'integer', example: 1 },
            categoria: { type: 'string', example: 'Fútbol' },
            color: { type: 'string', example: '#22c55e' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            error: { type: 'string', example: 'Mensaje de error' },
          },
        },
      },
    },
    tags: [
      { name: 'Auth', description: 'Autenticación y registro' },
      { name: 'Users', description: 'Gestión de usuarios' },
      { name: 'Events', description: 'Gestión de eventos' },
      { name: 'Categories', description: 'Categorías de eventos' },
      { name: 'Search', description: 'Búsqueda de usuarios y eventos' },
    ],
  },
  apis: ['./src/routes/*.ts'],
};

const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app: Express): void => {
  // Swagger UI
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'MyEventz API Documentation',
  }));

  // JSON endpoint
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  const port = process.env.PORT || 3000;
  console.log(`📚 Swagger docs disponibles en: http://localhost:${port}/api-docs`);
};
