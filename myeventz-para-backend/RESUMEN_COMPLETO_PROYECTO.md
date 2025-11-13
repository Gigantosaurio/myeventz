# 📋 RESUMEN COMPLETO DEL PROYECTO - MyEventz

## 🎯 Objetivo del Proyecto
Crear una plataforma web completa para gestionar eventos deportivos y de ocio en Zaragoza, España. 
Es un proyecto de TFG (Trabajo Fin de Grado) que requiere frontend + backend + base de datos completamente funcional.

---

## ✅ ESTADO ACTUAL (100% Frontend + Base de Datos)

### Frontend: **COMPLETO** ✅
- 11 pantallas totalmente funcionales
- 45+ archivos TypeScript
- 100% responsive
- Todos los componentes con TODOs marcando puntos de integración backend

### Base de Datos: **COMPLETA** ✅
- Esquema MySQL diseñado y probado
- Script SQL funcionando correctamente
- 6 tablas principales + 1 tabla de likes
- Datos de prueba insertados
- Vistas y procedimientos almacenados creados

### Backend: **PENDIENTE** ❌
- Necesita implementación completa en Node.js/Express + TypeScript
- Todos los endpoints están especificados
- Arquitectura recomendada definida

---

## 📱 PANTALLAS DEL FRONTEND (11 totales)

### Autenticación (2)
1. **Login** (`/login`)
   - Diseño horizontal con imagen de fondo
   - Validaciones de formulario
   - TODO: POST /api/auth/login

2. **Registro** (`/register`)
   - 3 pasos: Cuenta → Datos Personales → Hobbies
   - Validaciones por paso
   - Selector de fecha de nacimiento
   - Selección múltiple de hobbies
   - TODO: POST /api/auth/register

### Aplicación Principal (9 con Sidebar)
3. **Home** (`/home`)
   - 2 secciones: Eventos Populares + Publicaciones Recientes
   - Grid de eventos con imágenes
   - TODO: GET /api/events/popular, GET /api/events/recent

4. **Categorías** (`/categories`)
   - Búsqueda por texto (título/ubicación)
   - Filtros por múltiples categorías
   - Contador de resultados
   - Botón limpiar filtros
   - TODO: GET /api/events/search?search=texto&categories=1,2,3

5. **Búsqueda Mixta** (`/search`)
   - Buscar usuarios Y eventos en una pantalla
   - Tabs: Todo / Usuarios / Eventos
   - Búsqueda en tiempo real
   - TODO: GET /api/search?q=query&type=all|users|events

6. **Detalle Evento** (`/event/:id`)
   - Información completa del evento
   - Lista de participantes con avatares
   - Botón "Unirme/Salir" según estado
   - Botón "Me gusta" con contador
   - TODO: GET /api/events/:id, POST /api/events/:id/join, POST /api/events/:id/like

7. **Crear Evento** (`/create-event`)
   - Formulario completo en una página
   - Selección de categoría (1 sola)
   - Selección de fecha/hora
   - Rango de edad
   - Ubicación con mapa (Google Maps)
   - Upload de imagen
   - TODO: POST /api/events

8. **Buscar Usuarios** (`/users` - integrado en /search)
   - Lista de usuarios con avatar
   - Click para ver perfil
   - TODO: GET /api/users?search=texto

9. **Mi Perfil** (`/profile`)
   - Información del usuario actual
   - Botón "Editar Perfil"
   - Hobbies con tags de colores
   - Eventos organizados
   - Eventos en los que participa
   - TODO: GET /api/auth/me, GET /api/users/:id/events

10. **Perfil de Otro Usuario** (`/profile/:userId`)
    - Mismo diseño que Mi Perfil
    - Sin botón editar
    - TODO: GET /api/users/:id

11. **Editar Perfil** (`/profile/edit`)
    - Upload de foto con preview
    - Editar nombre, email, bio
    - Seleccionar hobbies
    - Añadir redes sociales
    - Validaciones completas
    - TODO: PUT /api/users/:id (multipart/form-data)

### Componente Global
- **Sidebar Colapsable**
  - Navegación principal
  - Botón hamburguesa (260px ↔ 80px)
  - Avatar del usuario abajo
  - Botón logout
  - Responsive

---

## 🗄️ ESTRUCTURA DE BASE DE DATOS

### IMPORTANTE: Se usa el esquema original del usuario, no el mío

El estudiante ya tiene su propio esquema MySQL diseñado y probado. 
**USAR ESTE ESQUEMA**, no el que propuse inicialmente.

### Tablas (6 + 1)

#### 1. **usuarios** (Tabla principal de usuarios)
```sql
id_usuario INT PRIMARY KEY AUTO_INCREMENT
usuario VARCHAR(30) UNIQUE NOT NULL          -- Username único
clave VARCHAR(255) NOT NULL                   -- Password hasheado (bcrypt)
nombre VARCHAR(40)                            -- Nombre
apel1 VARCHAR(60)                             -- Apellido 1
apel2 VARCHAR(60)                             -- Apellido 2 (puede ser null)
f_nac DATE                                    -- Fecha de nacimiento
bio VARCHAR(255)                              -- Biografía
imagen_perfil VARCHAR(255)                    -- URL de la foto de perfil
ig VARCHAR(60)                                -- Instagram
fb VARCHAR(60)                                -- Facebook
x VARCHAR(60)                                 -- Twitter/X
yt VARCHAR(60)                                -- YouTube
tt VARCHAR(60)                                -- TikTok
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
```

#### 2. **categorias** (Categorías de eventos)
```sql
id_categoria INT PRIMARY KEY AUTO_INCREMENT
categoria VARCHAR(50) NOT NULL                -- Nombre de la categoría
color VARCHAR(7) DEFAULT '#7c3aed'            -- Color en formato hex
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
```

**Categorías importantes para el frontend (50 total en BD):**
- Fútbol (#22c55e)
- Baloncesto (#ef4444)
- Ciclismo (#3b82f6)
- Escalada (#14b8a6)
- Gimnasia (#06b6d4)
- Golf (#eab308)
- Esgrima (#6366f1)
- Karate (#dc2626)
- Crossfit (#f97316)
- Danza (#a855f7)
- Calistenia (#84cc16)
- Motocross (#f43f5e)
- Cocina (#ec4899)
- Audiovisual (#f59e0b)
- ... y 36 más

#### 3. **eventos** (Eventos creados)
```sql
id_evento INT PRIMARY KEY AUTO_INCREMENT
id_usuario INT NOT NULL                       -- FK → usuarios (organizador)
titulo VARCHAR(80) NOT NULL
fecha DATE NOT NULL
hora TIME NOT NULL
descripcion VARCHAR(255)
edad_min INT DEFAULT 0
edad_max INT DEFAULT 99
ubicacion VARCHAR(255) NOT NULL               -- Nombre del lugar
imagen VARCHAR(255)                           -- URL de la imagen
lat DECIMAL(10,8)                             -- Latitud (Google Maps)
lng DECIMAL(11,8)                             -- Longitud (Google Maps)
max_participantes INT DEFAULT 10              -- Límite de participantes
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP

FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
```

#### 4. **participantes_eventos** (Relación usuarios-eventos)
```sql
id_participacion INT PRIMARY KEY AUTO_INCREMENT
id_evento INT NOT NULL                        -- FK → eventos
id_usuario INT NOT NULL                       -- FK → usuarios
fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP     -- Fecha de unión

UNIQUE (id_evento, id_usuario)                -- Un usuario solo puede unirse 1 vez
FOREIGN KEY (id_evento) REFERENCES eventos(id_evento) ON DELETE CASCADE
FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
```

#### 5. **eventos_likes** (Likes en eventos)
```sql
id_like INT PRIMARY KEY AUTO_INCREMENT
id_evento INT NOT NULL                        -- FK → eventos
id_usuario INT NOT NULL                       -- FK → usuarios
fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP

UNIQUE (id_evento, id_usuario)                -- Un usuario solo 1 like por evento
FOREIGN KEY (id_evento) REFERENCES eventos(id_evento) ON DELETE CASCADE
FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
```

#### 6. **usuarios_hobbies** (Hobbies de usuarios)
```sql
id_usuario INT NOT NULL                       -- FK → usuarios
id_categoria INT NOT NULL                     -- FK → categorias

UNIQUE (id_usuario, id_categoria)             -- Un hobby solo 1 vez por usuario
FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria) ON DELETE CASCADE
```

#### 7. **eventos_categorias** (Categorías de eventos)
```sql
id_evento INT NOT NULL                        -- FK → eventos
id_categoria INT NOT NULL                     -- FK → categorias

UNIQUE (id_evento, id_categoria)
FOREIGN KEY (id_evento) REFERENCES eventos(id_evento) ON DELETE CASCADE
FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria) ON DELETE CASCADE
```

**Nota importante:** El frontend actualmente usa 1 categoría por evento, pero la BD 
permite múltiples. Para V1 del backend, implementar solo 1 categoría por evento.

### Vistas Creadas
- **v_eventos_completos**: Eventos con toda la info + organizador + contadores
- **v_usuarios_stats**: Usuarios con estadísticas de eventos
- **v_categorias_stats**: Categorías con contador de eventos

### Procedimientos Almacenados
- **sp_eventos_populares(limit)**: Eventos más populares
- **sp_eventos_recientes(limit)**: Eventos más recientes
- **sp_buscar_eventos(search, categoria_ids)**: Búsqueda con filtros

### Funciones
- **fn_evento_lleno(id_evento)**: Verificar si evento está lleno
- **fn_nombre_completo(id_usuario)**: Obtener nombre completo

---

## 🔀 MAPEO: Base de Datos ↔ Frontend

### Nombres de Tablas
```
BD                      → Frontend
─────────────────────────────────────
usuarios                → users
categorias              → categories
eventos                 → events
participantes_eventos   → eventParticipants
eventos_likes           → eventLikes
usuarios_hobbies        → userHobbies
eventos_categorias      → eventCategories
```

### Campos Críticos
```
BD                      → Frontend           → Tipo
───────────────────────────────────────────────────
id_usuario              → id                 → number
usuario                 → username           → string
clave                   → password           → string (solo en registro/login)
nombre                  → firstName          → string
apel1                   → lastName1          → string
apel2                   → lastName2          → string (optional)
f_nac                   → birthDate          → Date
imagen_perfil           → profilePicture     → string (URL)

id_evento               → id                 → number
titulo                  → title              → string
descripcion             → description        → string
ubicacion               → location           → string
lat, lng                → lat, lng           → number
max_participantes       → maxParticipants    → number

id_categoria            → id                 → number
categoria               → name               → string
color                   → color              → string (hex)
```

---

## 🔌 ENDPOINTS BACKEND NECESARIOS (TODOS)

### Autenticación
```
POST   /api/auth/register
Body: {
  usuario: string,
  clave: string,
  nombre: string,
  apel1: string,
  apel2?: string,
  f_nac: string (YYYY-MM-DD),
  bio?: string,
  hobbies: number[] (array de id_categoria)
}
Response: { token: string, user: UserObject }

POST   /api/auth/login
Body: { usuario: string, clave: string }
Response: { token: string, user: UserObject }

GET    /api/auth/me
Headers: { Authorization: "Bearer TOKEN" }
Response: { user: UserObject }

POST   /api/auth/logout
Headers: { Authorization: "Bearer TOKEN" }
Response: { message: "Logout successful" }
```

### Usuarios
```
GET    /api/users?search=texto
Response: UserObject[]

GET    /api/users/:id
Response: UserObject + { 
  hobbies: CategoryObject[],
  eventos_organizados: EventObject[],
  eventos_participados: EventObject[]
}

PUT    /api/users/:id
Headers: { Authorization: "Bearer TOKEN" }
Body: FormData {
  nombre, apel1, apel2, bio,
  hobbies: string (JSON array de IDs),
  imagen_perfil: File,
  ig, fb, x, yt, tt
}
Response: UserObject actualizado

GET    /api/users/:id/events
Response: EventObject[]

GET    /api/users/:id/participations
Response: EventObject[]
```

### Eventos
```
GET    /api/events
Query: ?fecha=YYYY-MM-DD&categoria=1,2,3
Response: EventObject[]

GET    /api/events/popular?limit=10
Response: EventObject[]

GET    /api/events/recent?limit=20
Response: EventObject[]

GET    /api/events/search?search=texto&categories=1,2,3
Response: EventObject[]

GET    /api/events/:id
Response: EventObject + {
  organizador: UserObject,
  participantes: UserObject[],
  categorias: CategoryObject[],
  liked_by_user: boolean,
  is_participant: boolean
}

POST   /api/events
Headers: { Authorization: "Bearer TOKEN" }
Body: FormData {
  titulo, descripcion, fecha, hora,
  edad_min, edad_max, ubicacion,
  lat, lng, max_participantes,
  id_categoria,
  imagen: File
}
Response: EventObject creado

PUT    /api/events/:id
Headers: { Authorization: "Bearer TOKEN" }
Body: Similar a POST
Response: EventObject actualizado

DELETE /api/events/:id
Headers: { Authorization: "Bearer TOKEN" }
Response: { message: "Event deleted" }

POST   /api/events/:id/join
Headers: { Authorization: "Bearer TOKEN" }
Response: { message: "Joined successfully" }

DELETE /api/events/:id/leave
Headers: { Authorization: "Bearer TOKEN" }
Response: { message: "Left successfully" }

POST   /api/events/:id/like
Headers: { Authorization: "Bearer TOKEN" }
Response: { message: "Liked", total_likes: number }

DELETE /api/events/:id/unlike
Headers: { Authorization: "Bearer TOKEN" }
Response: { message: "Unliked", total_likes: number }
```

### Búsqueda Mixta
```
GET    /api/search?q=query&type=all|users|events
Response: {
  users: UserObject[],
  events: EventObject[]
}
```

### Categorías
```
GET    /api/categories
Response: CategoryObject[]

GET    /api/categories/:id/events
Response: EventObject[]
```

---

## 📦 ESTRUCTURA BACKEND RECOMENDADA

```
backend/
├── src/
│   ├── config/
│   │   ├── database.ts          # Conexión MySQL
│   │   └── env.ts               # Variables de entorno
│   │
│   ├── models/                  # No usar ORM, usar queries directas
│   │   ├── userModel.ts         # Queries de usuarios
│   │   ├── eventModel.ts        # Queries de eventos
│   │   └── categoryModel.ts     # Queries de categorías
│   │
│   ├── controllers/
│   │   ├── authController.ts    # Register, Login, Me, Logout
│   │   ├── userController.ts    # CRUD usuarios
│   │   ├── eventController.ts   # CRUD eventos + join/leave/like
│   │   ├── searchController.ts  # Búsqueda mixta
│   │   └── categoryController.ts
│   │
│   ├── routes/
│   │   ├── auth.ts
│   │   ├── users.ts
│   │   ├── events.ts
│   │   ├── search.ts
│   │   └── categories.ts
│   │
│   ├── middleware/
│   │   ├── auth.ts              # Verificar JWT
│   │   ├── upload.ts            # Multer para imágenes
│   │   └── errorHandler.ts      # Manejo de errores global
│   │
│   ├── utils/
│   │   ├── jwt.ts               # Generar/verificar tokens
│   │   └── bcrypt.ts            # Hashear/comparar passwords
│   │
│   ├── types/
│   │   └── index.ts             # Interfaces TypeScript
│   │
│   └── app.ts                   # Setup Express + rutas
│
├── uploads/                     # Imágenes subidas (gitignore)
├── .env                         # Variables de entorno (gitignore)
├── .env.example                 # Template de .env
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🛠️ TECNOLOGÍAS BACKEND

### Obligatorias
- **Node.js** v18+
- **Express** - Framework web
- **TypeScript** - Tipado estático
- **MySQL2** - Driver MySQL (NO usar ORM)
- **jsonwebtoken** - Autenticación JWT
- **bcryptjs** - Hash de passwords
- **multer** - Upload de archivos
- **cors** - CORS middleware
- **dotenv** - Variables de entorno
- **express-validator** - Validaciones

### Opcionales pero recomendadas
- **morgan** - Logger de peticiones HTTP
- **helmet** - Seguridad headers HTTP
- **compression** - Comprimir respuestas

### NO usar
- ❌ Sequelize
- ❌ TypeORM
- ❌ Prisma
- ❌ Mongoose (es para MongoDB)

**Razón:** El estudiante quiere queries SQL directas para aprender.

---

## 🎯 PRIORIDADES DE IMPLEMENTACIÓN

### Fase 1: Setup + Autenticación (PRIORIDAD MÁXIMA)
1. Setup proyecto TypeScript + Express
2. Conexión a MySQL
3. POST /api/auth/register (con bcrypt)
4. POST /api/auth/login (con JWT)
5. GET /api/auth/me (verificar token)
6. Middleware de autenticación

### Fase 2: Eventos Básicos
1. GET /api/events (listar todos)
2. GET /api/events/:id (detalle)
3. GET /api/events/popular
4. GET /api/events/recent
5. POST /api/events (crear evento)

### Fase 3: Participación e Interacción
1. POST /api/events/:id/join
2. DELETE /api/events/:id/leave
3. POST /api/events/:id/like
4. DELETE /api/events/:id/unlike

### Fase 4: Búsqueda y Perfiles
1. GET /api/events/search (con filtros)
2. GET /api/search (búsqueda mixta)
3. GET /api/users/:id
4. PUT /api/users/:id (editar perfil)

### Fase 5: Upload de Imágenes
1. Setup multer
2. Upload imagen de evento
3. Upload imagen de perfil
4. Servir imágenes estáticas

### Fase 6: Categorías
1. GET /api/categories
2. GET /api/categories/:id/events

---

## 🔐 CONFIGURACIÓN .env

```env
# Server
NODE_ENV=development
PORT=3000

# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=myeventz

# JWT
JWT_SECRET=tu_secreto_super_seguro_aqui_cambiar_en_produccion
JWT_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:5173

# Upload
UPLOAD_MAX_SIZE=5242880
UPLOAD_DIR=uploads
```

---

## 📝 EJEMPLO DE QUERIES (NO ORM)

### Ejemplo de userModel.ts
```typescript
import mysql from 'mysql2/promise';
import { dbPool } from '../config/database';

export const findUserByUsername = async (usuario: string) => {
  const [rows] = await dbPool.execute(
    'SELECT * FROM usuarios WHERE usuario = ?',
    [usuario]
  );
  return rows[0];
};

export const createUser = async (userData: any) => {
  const [result] = await dbPool.execute(
    `INSERT INTO usuarios (usuario, clave, nombre, apel1, apel2, f_nac, bio)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [userData.usuario, userData.clave, userData.nombre, userData.apel1, 
     userData.apel2, userData.f_nac, userData.bio]
  );
  return result.insertId;
};
```

### Ejemplo de eventModel.ts
```typescript
export const getPopularEvents = async (limit: number = 10) => {
  const [rows] = await dbPool.execute(
    `CALL sp_eventos_populares(?)`,
    [limit]
  );
  return rows[0]; // Los procedimientos devuelven array de arrays
};

export const getEventById = async (id: number) => {
  const [rows] = await dbPool.execute(
    `SELECT e.*, 
            CONCAT(u.nombre, ' ', u.apel1, ' ', IFNULL(u.apel2, '')) AS organizador_nombre,
            u.usuario AS organizador_usuario,
            u.imagen_perfil AS organizador_imagen
     FROM eventos e
     JOIN usuarios u ON e.id_usuario = u.id_usuario
     WHERE e.id_evento = ?`,
    [id]
  );
  return rows[0];
};
```

---

## ✅ CHECKLIST COMPLETO DEL PROYECTO

### Frontend ✅
- [x] Login
- [x] Registro (3 pasos)
- [x] Home (populares + recientes)
- [x] Categorías (con filtros)
- [x] Búsqueda mixta
- [x] Detalle evento
- [x] Crear evento
- [x] Mi perfil
- [x] Perfil de otros
- [x] Editar perfil
- [x] Sidebar colapsable
- [x] Componentes reutilizables
- [x] TODOs marcados

### Base de Datos ✅
- [x] Script SQL completo
- [x] 7 tablas creadas
- [x] Relaciones FK correctas
- [x] Datos de prueba
- [x] 50 categorías insertadas
- [x] 5 usuarios de prueba
- [x] 8 eventos de prueba
- [x] Vistas útiles
- [x] Procedimientos almacenados
- [x] Funciones auxiliares

### Backend ❌
- [ ] Setup proyecto Node + TypeScript + Express
- [ ] Conexión MySQL
- [ ] Autenticación (JWT + bcrypt)
- [ ] Endpoints de usuarios
- [ ] Endpoints de eventos
- [ ] Endpoints de búsqueda
- [ ] Endpoints de categorías
- [ ] Middleware de autenticación
- [ ] Upload de imágenes (multer)
- [ ] Validaciones (express-validator)
- [ ] Manejo de errores
- [ ] CORS configurado
- [ ] Documentación API

### Deployment ❌
- [ ] Frontend en Vercel/Netlify
- [ ] Backend en Railway/Render
- [ ] MySQL en PlanetScale/Railway
- [ ] Imágenes en Cloudinary/S3
- [ ] Variables de entorno configuradas
- [ ] HTTPS habilitado
- [ ] Dominio configurado

---

## 📄 ARCHIVOS A COMPARTIR EN EL PRÓXIMO CHAT

Cuando continúes en otro chat, comparte estos archivos:

### 1. Base de Datos
- **MyEventz_Completo_Actualizado.sql** (script completo corregido)
- **Diagrama de la BD** (la imagen que compartiste)

### 2. Documentación
- **Este documento** (RESUMEN_COMPLETO_PROYECTO.md)

### 3. Estructura Frontend (opcional, si hay dudas)
- `App.tsx` (rutas completas)
- Cualquier componente específico que genere dudas

### 4. Información Adicional
- **Credenciales de prueba:**
  - Usuario: `gamiluu`, `charly`, `gigantosaurio`, `carver`, `mangelrogel420`
  - Contraseña para todos: `123`

---

## 🚀 PROMPT PARA EL SIGUIENTE CHAT

```
Hola, soy un estudiante desarrollando MyEventz, una plataforma web de eventos 
deportivos y sociales en Zaragoza para mi TFG.

ESTADO ACTUAL:
✅ Frontend completo en React + TypeScript (11 pantallas)
✅ Base de datos MySQL diseñada y poblada
❌ Backend pendiente (Node.js + Express + TypeScript)

Adjunto:
1. MyEventz_Completo_Actualizado.sql - Script de base de datos completo
2. Diagrama de la BD (imagen)
3. RESUMEN_COMPLETO_PROYECTO.md - Documentación exhaustiva

NECESITO:
Implementar el backend completo en Node.js + Express + TypeScript.
- NO usar ORM (queries SQL directas con mysql2)
- Autenticación con JWT + bcrypt
- Upload de imágenes con multer
- Seguir la estructura y endpoints especificados en el documento

PRIORIDAD:
1. Setup inicial del proyecto
2. Conexión a MySQL
3. Autenticación (register/login con JWT)
4. Endpoints de eventos
5. Upload de imágenes

Por favor, revisa el documento completo y dime por dónde empezamos.
```

---

## 💡 NOTAS IMPORTANTES

### Sobre las Contraseñas
- En desarrollo: Hash simple de bcrypt
- Las contraseñas de prueba son "123" para todos los usuarios
- En producción: Usar rounds más altos de bcrypt (12+)

### Sobre las Imágenes
- Desarrollo: Guardar en carpeta local `uploads/`
- Producción: Migrar a Cloudinary o AWS S3
- Tamaño máximo: 5MB
- Formatos: jpg, jpeg, png, webp, gif

### Sobre CORS
- Desarrollo: `http://localhost:5173` (Vite default)
- Producción: Configurar dominio real

### Sobre JWT
- Expiración: 7 días en desarrollo
- En producción: Considerar refresh tokens
- Guardar en localStorage del frontend

### Sobre SQL Injection
- SIEMPRE usar placeholders (?) en queries
- NUNCA concatenar strings en SQL
- Validar inputs con express-validator

### Sobre Rate Limiting
- Implementar en producción
- Especialmente en /auth/login y /auth/register
- Usar `express-rate-limit`

---

## 🎓 CONTEXTO ACADÉMICO

- **Proyecto:** Trabajo Fin de Grado (TFG)
- **Institución:** Universidad (San Valero mencionado en código)
- **Ubicación:** Zaragoza, España
- **Objetivo:** Plataforma funcional para gestión de eventos
- **Evaluación:** Requiere demostración completa frontend + backend + BD

---

## 📞 PUNTOS DE CONTACTO TÉCNICOS

### Si surgen dudas sobre:
- **Nombres de BD:** Usar exactamente los del esquema (`usuarios`, `eventos`, etc.)
- **Campos:** Referirse al mapeo BD ↔ Frontend
- **Endpoints:** Seguir la lista exacta de este documento
- **Estructura:** Seguir el árbol de directorios recomendado
- **Queries:** Ver ejemplos en este documento

---

## ✨ RESUMEN EN 3 PUNTOS

1. **Frontend**: 11 pantallas React + TypeScript completamente funcionales con TODOs
2. **Base de Datos**: MySQL con 7 tablas, 50 categorías, datos de prueba listos
3. **Falta**: Backend completo Node.js + Express + TypeScript con queries directas

---

**Última actualización:** 2024-11-11
**Versión:** 1.1 (Frontend completo + BD lista)
**Siguiente paso:** Backend implementation

---

¡ÉXITO EN EL DESARROLLO DEL BACKEND! 🚀
