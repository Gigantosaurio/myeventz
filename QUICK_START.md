# 🚀 MyEventz - Guía de Inicio Rápido

## ✅ Fase 1 COMPLETADA: Configuración y Base

¡Felicidades! Hemos completado la primera fase del proyecto MyEventz. Aquí está todo lo que se ha implementado:

## 📦 Estructura Creada

```
myeventz-web/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── common/
│   │   │       ├── Button/
│   │   │       ├── Input/
│   │   │       ├── Card/
│   │   │       ├── Logo/
│   │   │       └── Tag/
│   │   ├── pages/
│   │   │   └── ComponentsDemo.tsx
│   │   ├── services/
│   │   │   └── api.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── styles/
│   │   │   ├── colors.ts
│   │   │   └── global.css
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── index.html
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── package.json
│   └── .env.example
├── backend/
│   └── (pendiente de implementar)
├── README.md
├── .gitignore
└── install.sh
```

## 🎨 Componentes Implementados

### ✅ Button
- **Variantes**: primary, secondary, outline, ghost
- **Tamaños**: sm, md, lg
- **Estados**: normal, hover, loading, disabled
- **Opciones**: fullWidth

### ✅ Input
- **Características**:
  - Labels y placeholders
  - Iconos integrados
  - Mensajes de error
  - Helper text
  - Estados de focus
  - Validación visual

### ✅ Card
- **Características**:
  - Efectos hover
  - Clickable
  - Diferentes paddings (sm, md, lg, none)

### ✅ Logo
- **Tamaños**: sm, md, lg
- **Incluye**: Icono de ubicación (MapPin)

### ✅ Tag
- **Características**:
  - Colores personalizables
  - Estado seleccionado
  - Clickeable
  - Tamaños sm, md

## 🎨 Sistema de Diseño

### Paleta de Colores
```css
--primary: #7c3aed          /* Púrpura principal */
--primary-hover: #6d28d9    /* Púrpura hover */
--bg-main: #0a0a1a         /* Fondo principal */
--bg-secondary: #1a1a2e     /* Fondo secundario */
--bg-card: #16213e          /* Fondo tarjetas */
--text-primary: #ffffff     /* Texto principal */
--text-secondary: #b8b8d1   /* Texto secundario */
```

### Variables CSS Implementadas
- ✅ Sistema de espaciado (xs, sm, md, lg, xl, 2xl)
- ✅ Border radius (sm, md, lg, xl, full)
- ✅ Transiciones (fast, normal, slow)
- ✅ Scrollbar personalizado
- ✅ Animaciones (fadeIn, slideInUp, slideInDown)

## 🛠️ Tecnologías Configuradas

### Frontend
- ✅ React 18 + TypeScript
- ✅ Vite (build tool)
- ✅ React Router DOM
- ✅ Axios
- ✅ Lucide React (iconos)
- ✅ CSS personalizado con variables

### TypeScript
- ✅ Configuración estricta
- ✅ Tipos personalizados (User, Event, Category, etc.)
- ✅ Aliases de paths (@/components, @/pages, etc.)

## 🚀 Instalación y Uso

### Opción 1: Script Automático (Recomendado)

```bash
# Dale permisos de ejecución al script (solo primera vez)
chmod +x install.sh

# Ejecuta el script
./install.sh
```

Selecciona la opción que necesites:
1. Instalar todo (Frontend + Backend)
2. Solo Frontend
3. Solo Backend
4. Crear archivos .env

### Opción 2: Manual

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

El frontend se ejecutará en: http://localhost:3000

#### Backend (Cuando esté implementado)
```bash
cd backend
npm install
npm run dev
```

## 🎯 Ver la Demo

Una vez que hayas instalado y ejecutado el frontend, visita:

**http://localhost:3000**

Verás la página de demostración con todos los componentes funcionando:
- Logos en diferentes tamaños
- Botones con todas las variantes
- Inputs con iconos y validación
- Cards interactivas
- Tags de categorías
- Ejemplo de formulario de login completo

## 📝 Próximos Pasos

### Fase 2: Autenticación (Siguiente)
- [ ] Crear página de Login
- [ ] Crear página de Registro (3 pasos)
- [ ] Implementar sistema de autenticación JWT
- [ ] Protección de rutas privadas
- [ ] Gestión de estado de usuario

### ¿Listo para continuar?

Cuando estés listo para pasar a la **Fase 2: Autenticación**, avísame y comenzaremos con:
1. La página de Login (como en las imágenes de Figma)
2. El flujo completo de registro en 3 pasos
3. La integración con el backend

## 📚 Documentación Adicional

- **README.md**: Documentación completa del proyecto
- **Componentes**: Cada componente tiene su archivo .tsx y .css
- **Tipos**: Definidos en `src/types/index.ts`
- **Colores**: Sistema en `src/styles/colors.ts`

## 🐛 Troubleshooting

### Si tienes problemas con npm install:
```bash
# Limpia la caché de npm
npm cache clean --force

# Elimina node_modules y reinstala
rm -rf node_modules package-lock.json
npm install
```

### Si el puerto 3000 está ocupado:
Edita `vite.config.ts` y cambia el puerto:
```typescript
server: {
  port: 3001, // Cambia a otro puerto
  open: true,
}
```

## 🎉 ¡Éxito!

Has completado exitosamente la **Fase 1** del proyecto MyEventz. Todos los componentes base están listos y funcionando. 

**¿Alguna pregunta o quieres hacer algún ajuste antes de pasar a la Fase 2?**
