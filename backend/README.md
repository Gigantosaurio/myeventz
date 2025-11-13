# 🚀 MyEventz Backend API

Backend completo para la plataforma de gestión de eventos MyEventz.

## 📋 Tabla de Contenidos

- [Requisitos](#requisitos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Uso](#uso)
- [Endpoints Disponibles](#endpoints-disponibles)
- [Testing con Swagger](#testing-con-swagger)
- [Solución de Problemas](#solución-de-problemas)

---

## ✅ Requisitos

- Node.js v18 o superior
- XAMPP con MySQL
- Base de datos `myeventz` importada

---

## 📦 Instalación

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

Copiar `.env.example` a `.env`:

```bash
cp .env.example .env
```

Editar `.env` con tus configuraciones:

```env
NODE_ENV=development
PORT=3000

# XAMPP MySQL (por defecto no tiene password)
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=myeventz

JWT_SECRET=cambiar_este_secreto_en_produccion
JWT_EXPIRES_IN=7d

CORS_ORIGIN=http://localhost:5173
```

### 3. Importar base de datos

**Opción A: Desde XAMPP phpMyAdmin**
1. Abrir http://localhost/phpmyadmin
2. Crear base de datos `myeventz`
3. Importar el archivo `MyEventz_Completo_Actualizado.sql`

**Opción B: Desde terminal**
```bash
mysql -u root -p < MyEventz_Completo_Actualizado.sql
```

### 4. Verificar base de datos

```sql
USE myeventz;
SHOW TABLES;
SELECT COUNT(*) FROM usuarios;  -- Debe devolver 5
SELECT COUNT(*) FROM categorias;  -- Debe devolver 50
```

---

## 🚀 Uso

### Desarrollo

```bash
npm run dev
```

El servidor se iniciará en `http://localhost:3000`

### Producción

```bash
# Compilar TypeScript
npm run build

# Iniciar servidor
npm start
```

---

## 📚 Endpoints Disponibles

### Autenticación

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Registrar usuario | No |
| POST | `/api/auth/login` | Iniciar sesión | No |
| GET | `/api/auth/me` | Usuario actual | Sí |
| POST | `/api/auth/logout` | Cerrar sesión | Sí |

### Eventos

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/api/events/popular` | Eventos populares | No |
| GET | `/api/events/recent` | Eventos recientes | No |
| GET | `/api/events/search` | Buscar eventos | No |
| GET | `/api/events/:id` | Detalle de evento | Opcional |
| POST | `/api/events` | Crear evento | Sí |
| POST | `/api/events/:id/join` | Unirse a evento | Sí |
| DELETE | `/api/events/:id/leave` | Salir de evento | Sí |
| POST | `/api/events/:id/like` | Like al evento | Sí |
| DELETE | `/api/events/:id/unlike` | Quitar like | Sí |

### Categorías

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/api/categories` | Todas las categorías | No |
| GET | `/api/categories/:id` | Categoría por ID | No |
| GET | `/api/categories/:id/events` | Eventos de categoría | No |

### Búsqueda

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/api/search` | Búsqueda mixta | No |

---

## 🧪 Testing con Swagger

1. Iniciar el servidor: `npm run dev`

2. Abrir Swagger UI: http://localhost:3000/api-docs

3. Probar endpoints:

### Login

1. Ir a **Auth** → **POST /auth/login**
2. Click en "Try it out"
3. Usar credenciales de prueba:
```json
{
  "usuario": "gamiluu",
  "clave": "123"
}
```
4. Click en "Execute"
5. Copiar el `token` de la respuesta

### Usar Token

1. Click en el botón **Authorize** (candado) arriba a la derecha
2. Pegar el token en el formato: `Bearer TOKEN_AQUI`
3. Click en "Authorize"
4. Ahora puedes usar endpoints protegidos

### Ejemplo: Obtener eventos populares

1. Ir a **Events** → **GET /events/popular**
2. Click en "Try it out"
3. (Opcional) Cambiar el parámetro `limit`
4. Click en "Execute"
5. Ver la respuesta

---

## 🔧 Solución de Problemas

### Error: Cannot connect to MySQL

**Causa:** XAMPP MySQL no está corriendo o credenciales incorrectas.

**Solución:**
1. Abrir XAMPP Control Panel
2. Iniciar MySQL (botón "Start")
3. Verificar que está en puerto 3306
4. Verificar credenciales en `.env`

### Error: Database 'myeventz' doesn't exist

**Causa:** La base de datos no ha sido importada.

**Solución:**
```bash
mysql -u root -p < MyEventz_Completo_Actualizado.sql
```

### Error: Token inválido

**Causa:** Token expirado o no válido.

**Solución:**
1. Hacer login de nuevo: POST `/api/auth/login`
2. Copiar el nuevo token
3. Actualizar el token en Swagger

### Error: EADDRINUSE (puerto en uso)

**Causa:** El puerto 3000 ya está siendo usado.

**Solución:**
1. Cambiar el puerto en `.env`:
```env
PORT=3001
```
2. O detener el proceso que usa el puerto 3000

### Error: File upload fails

**Causa:** Carpeta `uploads` no existe o sin permisos.

**Solución:**
```bash
mkdir uploads
chmod 755 uploads
```

---

## 📝 Usuarios de Prueba

| Usuario | Password | Nombre |
|---------|----------|--------|
| gamiluu | 123 | Gabriel Milagro López |
| charly | 123 | Carlos Fernández Guevara |
| gigantosaurio | 123 | Jorge Alquezar |
| carver | 123 | Noe |
| mangelrogel420 | 123 | Miguel Ángel Rogel Ruiz |

---

## 🔐 Seguridad

⚠️ **IMPORTANTE:** En producción:

1. Cambiar `JWT_SECRET` por un secreto seguro y largo
2. Usar contraseñas fuertes (no "123")
3. Habilitar HTTPS
4. Configurar CORS correctamente
5. Usar rate limiting para endpoints de autenticación

---

## 🛠️ Tecnologías

- **Express** - Framework web
- **TypeScript** - Tipado estático
- **MySQL2** - Driver MySQL con queries directas (sin ORM)
- **JWT** - Autenticación con tokens
- **Bcrypt** - Hash de contraseñas
- **Multer** - Upload de archivos
- **Swagger** - Documentación de API

---

## 📧 Soporte

Si encuentras problemas:

1. Revisa la sección [Solución de Problemas](#solución-de-problemas)
2. Verifica los logs del servidor
3. Asegúrate de que MySQL esté corriendo
4. Verifica que la BD esté importada correctamente

---

## 📄 Licencia

MIT License - Proyecto académico (TFG)

---

¡Backend listo! 🎉

Ahora puedes:
1. ✅ Probar endpoints en Swagger: http://localhost:3000/api-docs
2. ✅ Conectar con el frontend React
3. ✅ Desarrollar nuevos endpoints
