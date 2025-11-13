# Backend Update v2 - Usuarios y Fotos

## 📦 Instalación Rápida

```bash
# 1. Descomprimir
tar -xzf backend-update-v2.tar.gz

# 2. Copiar archivos (desde myeventz-backend/)
cp -f ../backend-update/src/models/userModel.ts src/models/
cp -f ../backend-update/src/controllers/userController.ts src/controllers/
cp -f ../backend-update/src/routes/users.ts src/routes/
cp -f ../backend-update/src/app.ts src/

# 3. Reiniciar servidor
npm run dev
```

## ✨ Nuevos Endpoints

- GET `/api/users` - Buscar usuarios
- GET `/api/users/:id` - Ver perfil con hobbies y stats
- PUT `/api/users/:id` - **Editar perfil + foto de perfil**
- GET `/api/users/:id/events` - Eventos del usuario

## 📸 Sistema de Fotos

El upload de fotos **YA ESTÁ FUNCIONANDO**. Solo tienes que:

1. Hacer PUT `/api/users/:id` con `multipart/form-data`
2. Incluir el campo `imagen_perfil` con el archivo
3. La foto se guarda en `uploads/` y se devuelve la URL

**Ejemplo desde frontend:**

```typescript
const formData = new FormData();
formData.append('imagen_perfil', file);
formData.append('nombre', 'Gabriel');
formData.append('hobbies', JSON.stringify([1,2,3]));

await api.put('/users/1', formData);
```

## 🧪 Probar

```bash
# Ver perfil
curl http://localhost:3000/api/users/1

# Buscar usuarios
curl "http://localhost:3000/api/users?search=gabriel"
```

Ver **GUIA_ACTUALIZACION.md** para más detalles.
