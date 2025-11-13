# 🔄 ACTUALIZACIÓN DEL BACKEND - Nuevos Endpoints

## ✨ Novedades

### Nuevos Endpoints de Usuarios

✅ **GET /api/users** - Buscar usuarios
✅ **GET /api/users/:id** - Ver perfil de usuario (con hobbies y estadísticas)
✅ **PUT /api/users/:id** - Editar perfil (con upload de foto)
✅ **GET /api/users/:id/events** - Todos los eventos del usuario
✅ **GET /api/users/:id/events/organized** - Eventos organizados
✅ **GET /api/users/:id/events/participating** - Eventos participando

### Sistema de Subida de Fotos

✅ Upload de foto de perfil
✅ Multer ya configurado en el backend original
✅ Validación de tipos de archivo (jpg, png, gif, webp)
✅ Límite de 5MB
✅ Nombres únicos con timestamp

---

## 📦 INSTALACIÓN

### Opción 1: Copiar archivos manualmente

1. **Descomprimir el tar.gz:**
```bash
tar -xzf backend-update-v2.tar.gz
```

2. **Copiar los archivos a tu proyecto:**

```bash
# Desde la carpeta backend-update/
cp src/models/userModel.ts ../myeventz-backend/src/models/
cp src/controllers/userController.ts ../myeventz-backend/src/controllers/
cp src/routes/users.ts ../myeventz-backend/src/routes/
cp src/app.ts ../myeventz-backend/src/
```

3. **Reiniciar el servidor:**
```bash
cd myeventz-backend
npm run dev
```

### Opción 2: Usar los comandos de copia directa

Desde tu carpeta `myeventz-backend`:

```bash
# Asumiendo que backend-update está en el mismo directorio
cp -f ../backend-update/src/models/userModel.ts src/models/
cp -f ../backend-update/src/controllers/userController.ts src/controllers/
cp -f ../backend-update/src/routes/users.ts src/routes/
cp -f ../backend-update/src/app.ts src/

# Reiniciar
npm run dev
```

---

## 📁 ARCHIVOS INCLUIDOS

```
backend-update/
├── src/
│   ├── models/
│   │   └── userModel.ts          ⬅️ REEMPLAZAR (funciones nuevas)
│   ├── controllers/
│   │   └── userController.ts     ⬅️ NUEVO
│   ├── routes/
│   │   └── users.ts               ⬅️ NUEVO
│   └── app.ts                     ⬅️ REEMPLAZAR (añade ruta users)
└── GUIA_ACTUALIZACION.md
```

---

## 🧪 PROBAR LOS NUEVOS ENDPOINTS

### 1. Ver Perfil de Usuario

```bash
curl http://localhost:3000/api/users/1
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "id_usuario": 1,
    "usuario": "gamiluu",
    "nombre": "Gabriel",
    "apel1": "Milagro",
    "apel2": "López",
    "bio": "Hola me gusta la nintendo",
    "imagen_perfil": null,
    "hobbies": [
      {
        "id_categoria": 48,
        "categoria": "Audiovisual",
        "color": "#f59e0b"
      }
    ],
    "eventos_organizados": 2,
    "eventos_participando": 5
  }
}
```

---

### 2. Editar Perfil (CON FOTO)

**Usando cURL:**
```bash
# Primero hacer login para obtener el token
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"usuario":"gamiluu","clave":"123"}' \
  | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

# Editar perfil con foto
curl -X PUT http://localhost:3000/api/users/1 \
  -H "Authorization: Bearer $TOKEN" \
  -F "nombre=Gabriel" \
  -F "apel1=Milagro" \
  -F "bio=Nueva biografía actualizada" \
  -F "hobbies=[1,2,3]" \
  -F "ig=@mi_instagram" \
  -F "imagen_perfil=@/ruta/a/tu/foto.jpg"
```

**Usando Swagger:**
1. Ir a http://localhost:3000/api-docs
2. Hacer login en **Auth → POST /auth/login**
3. Copiar el token
4. Click en **Authorize** (candado) y pegar: `Bearer TOKEN`
5. Ir a **Users → PUT /users/{id}**
6. Click "Try it out"
7. Rellenar campos y subir foto
8. Click "Execute"

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "id_usuario": 1,
    "usuario": "gamiluu",
    "nombre": "Gabriel",
    "apel1": "Milagro",
    "bio": "Nueva biografía actualizada",
    "imagen_perfil": "/uploads/image-1731442800000-123456789.jpg",
    "ig": "@mi_instagram",
    "hobbies": [
      { "id_categoria": 1, "categoria": "Fútbol", "color": "#22c55e" },
      { "id_categoria": 2, "categoria": "Baloncesto", "color": "#ef4444" },
      { "id_categoria": 3, "categoria": "Ciclismo", "color": "#3b82f6" }
    ],
    "eventos_organizados": 2,
    "eventos_participando": 5
  },
  "message": "Perfil actualizado exitosamente"
}
```

---

### 3. Buscar Usuarios

```bash
curl "http://localhost:3000/api/users?search=gabriel"
```

---

### 4. Obtener Eventos del Usuario

```bash
# Todos los eventos (organizados + participando)
curl http://localhost:3000/api/users/1/events

# Solo organizados
curl http://localhost:3000/api/users/1/events/organized

# Solo participando
curl http://localhost:3000/api/users/1/events/participating
```

---

## 📸 CÓMO FUNCIONA EL SISTEMA DE FOTOS

### Backend (Ya está listo)

1. **Multer** está configurado en `src/middleware/upload.ts`
2. Las fotos se guardan en la carpeta `uploads/` con nombre único
3. Se valida que sean imágenes (jpg, png, gif, webp)
4. Límite de 5MB por archivo

### Servir las fotos

Las fotos se sirven automáticamente desde:
```
http://localhost:3000/uploads/nombre-archivo.jpg
```

### Frontend - Cómo usar

**1. Subir foto al editar perfil:**

```typescript
// React + axios
const formData = new FormData();
formData.append('nombre', 'Gabriel');
formData.append('apel1', 'Milagro');
formData.append('bio', 'Nueva bio');
formData.append('hobbies', JSON.stringify([1, 2, 3]));
formData.append('imagen_perfil', file); // File object del input

const response = await api.put(`/users/${userId}`, formData, {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});
```

**2. Mostrar la foto:**

```typescript
// Si el usuario tiene imagen_perfil
const imageUrl = user.imagen_perfil 
  ? `http://localhost:3000${user.imagen_perfil}`
  : '/default-avatar.png';

<img src={imageUrl} alt={user.nombre} />
```

---

## 🔒 PERMISOS

### Endpoints Públicos (sin token)
- ✅ GET /api/users (buscar usuarios)
- ✅ GET /api/users/:id (ver perfil)
- ✅ GET /api/users/:id/events (eventos del usuario)
- ✅ GET /api/users/:id/events/organized
- ✅ GET /api/users/:id/events/participating

### Endpoints Protegidos (requieren token)
- 🔒 PUT /api/users/:id (editar perfil)
  - Solo puedes editar tu propio perfil
  - Si intentas editar otro perfil → 403 Forbidden

---

## ✅ CHECKLIST DE VERIFICACIÓN

Después de actualizar, verifica:

- [ ] Servidor reiniciado sin errores
- [ ] `http://localhost:3000/api-docs` muestra los nuevos endpoints
- [ ] GET `/api/users/1` devuelve perfil con hobbies
- [ ] PUT `/api/users/1` permite editar (con token)
- [ ] Upload de foto funciona
- [ ] Las fotos se ven en `http://localhost:3000/uploads/nombre.jpg`

---

## 🐛 SOLUCIÓN DE PROBLEMAS

### Error: "Cannot PUT /api/users/1"

**Causa:** La ruta no está registrada en app.ts

**Solución:** Verificar que app.ts tiene la línea:
```typescript
app.use(`${apiPrefix}/users`, userRoutes);
```

### Error: "No tienes permiso para editar este perfil"

**Causa:** Estás intentando editar un perfil que no es tuyo.

**Solución:** Solo puedes editar tu propio perfil. El ID del usuario en la URL debe coincidir con el ID del token.

### Error al subir foto: "File too large"

**Causa:** La imagen supera los 5MB.

**Solución:** Comprimir la imagen o aumentar el límite en `.env`:
```env
UPLOAD_MAX_SIZE=10485760  # 10MB
```

### Las imágenes no se ven

**Causa:** La carpeta `uploads/` no existe o no tiene permisos.

**Solución:**
```bash
mkdir -p uploads
chmod 755 uploads
```

---

## 📊 NUEVOS ENDPOINTS - RESUMEN

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/api/users` | Buscar usuarios | No |
| GET | `/api/users/:id` | Ver perfil | No |
| PUT | `/api/users/:id` | Editar perfil + foto | Sí |
| GET | `/api/users/:id/events` | Todos los eventos | No |
| GET | `/api/users/:id/events/organized` | Eventos organizados | No |
| GET | `/api/users/:id/events/participating` | Eventos participando | No |

---

## 🎉 ¡Listo!

Ahora tu backend tiene:

✅ Sistema completo de perfiles de usuario
✅ Upload de fotos de perfil
✅ Búsqueda de usuarios
✅ Eventos del usuario (organizados y participando)
✅ Edición de perfil con hobbies y redes sociales

**Próximo paso:** Conectar con el frontend React para editar perfiles y subir fotos.
