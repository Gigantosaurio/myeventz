# MyEventz - Plataforma Web de Gestión de Eventos

Una aplicación web moderna para descubrir, crear y gestionar eventos deportivos y de ocio en Zaragoza.

## 🚀 Tecnologías

### Frontend
- **React 18** con TypeScript
- **React Router DOM** para navegación
- **Axios** para peticiones HTTP
- **Lucide React** para iconos
- **Vite** como build tool
- **CSS Modules** para estilos

### Backend
- **Node.js** con Express
- **TypeScript**
- **MongoDB** (por implementar)
- **JWT** para autenticación

## 📁 Estructura del Proyecto

```
myeventz-web/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/          # Componentes reutilizables
│   │   │   │   ├── Button/
│   │   │   │   ├── Input/
│   │   │   │   ├── Card/
│   │   │   │   ├── Logo/
│   │   │   │   └── Tag/
│   │   │   ├── layout/          # Layouts y estructura
│   │   │   └── features/        # Componentes específicos
│   │   ├── pages/               # Páginas de la aplicación
│   │   ├── services/            # Servicios de API
│   │   ├── types/               # Tipos TypeScript
│   │   ├── styles/              # Estilos globales
│   │   ├── utils/               # Utilidades
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── index.html
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── package.json
│
└── backend/
    ├── src/
    │   ├── config/
    │   ├── controllers/
    │   ├── models/
    │   ├── routes/
    │   ├── middleware/
    │   └── server.ts
    └── package.json
```

## 🎨 Sistema de Diseño

### Colores
- **Primary**: `#7c3aed` (Púrpura)
- **Background Main**: `#0a0a1a` (Azul oscuro/negro)
- **Background Secondary**: `#1a1a2e`
- **Background Card**: `#16213e`
- **Text Primary**: `#ffffff`
- **Text Secondary**: `#b8b8d1`

### Componentes Base Implementados
✅ **Button**: Variantes (primary, secondary, outline, ghost), tamaños (sm, md, lg)
✅ **Input**: Con soporte para labels, errores, iconos y helpers
✅ **Card**: Tarjetas con efectos hover y diferentes paddings
✅ **Logo**: Logo de MyEventz con icono de ubicación
✅ **Tag**: Etiquetas para categorías con colores personalizables

## 🛠️ Instalación y Uso

### Frontend

```bash
cd frontend
npm install
npm run dev
```

El frontend se ejecutará en `http://localhost:3000`

### Backend

```bash
cd backend
npm install
npm run dev
```

El backend se ejecutará en `http://localhost:5000`

## 📝 Variables de Entorno

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/myeventz
JWT_SECRET=tu_secret_key_aqui
```

## 🎯 Roadmap de Desarrollo

### ✅ Fase 1: Configuración y Base (COMPLETADA)
- [x] Estructura del proyecto
- [x] Sistema de colores y tema dark
- [x] Componentes base reutilizables
- [x] Configuración TypeScript
- [x] Configuración de API con Axios

### 🚧 Fase 2: Autenticación (EN PROGRESO)
- [ ] Página de Login
- [ ] Página de Registro (3 pasos)
- [ ] Gestión de sesiones
- [ ] Protección de rutas

### 📋 Fase 3: Core de la App
- [ ] Home Screen con eventos populares
- [ ] Category Selection
- [ ] Category Results con filtros
- [ ] Búsqueda de eventos

### 📋 Fase 4: Gestión de Eventos
- [ ] Detalle de evento
- [ ] Crear evento
- [ ] Editar evento
- [ ] Participar/Cancelar participación
- [ ] Mapa de ubicación

### 📋 Fase 5: Perfiles y Social
- [ ] Búsqueda de usuarios
- [ ] Perfil público
- [ ] Mi perfil
- [ ] Editar perfil
- [ ] Lista de amigos/seguidos

## 🤝 Contribución

Este proyecto está en desarrollo activo. Cada fase se completa y valida antes de pasar a la siguiente.

## 📄 Licencia

Proyecto Fin de Carrera - Universidad de Zaragoza
