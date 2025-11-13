# 🗄️ Guía de Instalación - Base de Datos MySQL

## 📦 MyEventz Database - Instalación Completa

Esta guía te llevará paso a paso para instalar la base de datos MySQL en XAMPP y prepararla para migración a AWS RDS.

---

## 📋 Contenido

1. [Instalación en XAMPP](#instalación-en-xampp)
2. [Estructura de la Base de Datos](#estructura-de-la-base-de-datos)
3. [Datos de Prueba](#datos-de-prueba)
4. [Vistas y Procedimientos](#vistas-y-procedimientos)
5. [Migración a AWS RDS](#migración-a-aws-rds)
6. [Consultas Útiles](#consultas-útiles)

---

## 🚀 Instalación en XAMPP

### Paso 1: Iniciar XAMPP

```bash
# En Windows
1. Abrir XAMPP Control Panel
2. Iniciar "Apache" y "MySQL"
3. Click en "Admin" en MySQL (abre phpMyAdmin)
```

### Paso 2: Importar la Base de Datos

**Opción A: Desde phpMyAdmin (Recomendado)**

```
1. Abrir http://localhost/phpmyadmin
2. Click en "Nuevo" (para crear nueva BD)
3. NO crear nada, ir directamente a "Importar"
4. Click "Seleccionar archivo"
5. Seleccionar: myeventz_database.sql
6. Click "Continuar"
7. ✅ ¡Listo! La BD se creará automáticamente
```

**Opción B: Desde línea de comandos**

```bash
# Navegar a la carpeta de MySQL
cd C:\xampp\mysql\bin

# Ejecutar el script
mysql -u root -p < ruta/al/archivo/myeventz_database.sql

# Si no tienes contraseña (XAMPP por defecto)
mysql -u root < ruta/al/archivo/myeventz_database.sql
```

### Paso 3: Verificar la Instalación

```sql
-- Conectar a MySQL
USE myeventz;

-- Verificar tablas creadas
SHOW TABLES;

-- Verificar datos
SELECT COUNT(*) FROM users;      -- Debe mostrar 5
SELECT COUNT(*) FROM categories; -- Debe mostrar 14
SELECT COUNT(*) FROM events;     -- Debe mostrar 8
```

---

## 📊 Estructura de la Base de Datos

### Diagrama de Tablas

```
┌──────────────┐
│    users     │─────┐
└──────────────┘     │
       │             │
       │◄────────────┼──────────┐
       │             │          │
       ▼             │          │
┌──────────────┐     │    ┌─────────────────┐
│    events    │◄────┤    │ event_participants│
└──────────────┘     │    └─────────────────┘
       │             │
       │             │    ┌─────────────────┐
       │             └────│  event_likes    │
       │                  └─────────────────┘
       ▼
┌──────────────┐          ┌─────────────────┐
│ categories   │◄─────────│ user_hobbies    │
└──────────────┘          └─────────────────┘
                                  │
                                  ▼
                          ┌─────────────────┐
                          │ social_networks │
                          └─────────────────┘
```

### Tablas Principales

#### 1. **users** - Usuarios del sistema
```sql
- id (PK)
- username (UNIQUE)
- email (UNIQUE)
- password_hash
- full_name
- bio
- profile_picture
- created_at
- updated_at
```

#### 2. **categories** - Categorías de eventos
```sql
- id (PK)
- name (UNIQUE)
- color (formato #RRGGBB)
- icon
- created_at
```

#### 3. **events** - Eventos creados
```sql
- id (PK)
- title
- description
- category_id (FK → categories)
- organizer_id (FK → users)
- event_date
- event_time
- location_name
- location_address
- location_lat, location_lng
- min_age, max_age
- max_participants
- image_url
- created_at, updated_at
```

#### 4. **event_participants** - Participantes en eventos
```sql
- id (PK)
- event_id (FK → events)
- user_id (FK → users)
- joined_at
- UNIQUE(event_id, user_id)
```

#### 5. **event_likes** - Likes en eventos
```sql
- id (PK)
- event_id (FK → events)
- user_id (FK → users)
- liked_at
- UNIQUE(event_id, user_id)
```

#### 6. **user_hobbies** - Hobbies de usuarios
```sql
- id (PK)
- user_id (FK → users)
- category_id (FK → categories)
- UNIQUE(user_id, category_id)
```

#### 7. **social_networks** - Redes sociales
```sql
- id (PK)
- user_id (FK → users, UNIQUE)
- instagram
- twitter
- youtube
- created_at, updated_at
```

---

## 🧪 Datos de Prueba

### Usuarios Incluidos

| Username | Email | Password | Full Name |
|----------|-------|----------|-----------|
| mangelrogel420 | miguel@example.com | password123 | Miguel Ángel Rogel Ruiz |
| gamibliblio | gabi@example.com | password123 | Gabriel Milagro López |
| carlosguevara | carlos@example.com | password123 | Carlos Fernández Guevara |
| jorgealquezar | jorge@example.com | password123 | Jorge Alquézar |
| lauragonzalez | laura@example.com | password123 | Laura González |

**Nota:** Las contraseñas están hasheadas con bcrypt. Para producción, usa un hash real.

### Categorías (14 total)

- Audiovisual (#f59e0b)
- Baloncesto (#ef4444)
- Calistenia (#84cc16)
- Ciclismo (#3b82f6)
- Cocina (#ec4899)
- Crossfit (#f97316)
- Danza (#a855f7)
- Escalada (#14b8a6)
- Esgrima (#6366f1)
- Fútbol (#22c55e)
- Gimnasia (#06b6d4)
- Golf (#eab308)
- Karate (#dc2626)
- Motocross (#f43f5e)

### Eventos (8 total)

1. **Partido de fútbol 11** - Fútbol
2. **Ruta en bici por el Ebro** - Ciclismo
3. **Taller de cocina asiática** - Cocina
4. **Escalada indoor - Nivel iniciación** - Escalada
5. **Festival de Cine Independiente** - Audiovisual
6. **CrossFit Open Box** - Crossfit
7. **Torneo 3x3 de baloncesto** - Baloncesto
8. **Clase de Salsa para principiantes** - Danza

---

## 📈 Vistas y Procedimientos

### Vistas Creadas

#### v_events_full
Vista completa de eventos con toda la información

```sql
SELECT * FROM v_events_full;
```

Incluye:
- Información del evento
- Nombre de categoría y color
- Datos del organizador
- Número de participantes actuales
- Total de likes

#### v_users_stats
Estadísticas de usuarios

```sql
SELECT * FROM v_users_stats;
```

Incluye:
- Información del usuario
- Eventos organizados
- Eventos en los que participa

### Funciones

#### is_event_full(event_id)
Verifica si un evento está lleno

```sql
SELECT is_event_full(1); -- 0 = No lleno, 1 = Lleno
```

### Procedimientos Almacenados

#### get_popular_events(limit)
Obtiene eventos más populares

```sql
CALL get_popular_events(5);
```

#### get_recent_events(limit)
Obtiene eventos más recientes

```sql
CALL get_recent_events(10);
```

---

## ☁️ Migración a AWS RDS

### Paso 1: Crear instancia RDS en AWS

```bash
1. Acceder a AWS Console → RDS
2. Click "Create database"
3. Seleccionar "MySQL"
4. Configuración:
   - Versión: MySQL 8.0+
   - Template: Free tier (para desarrollo)
   - DB instance: db.t3.micro
   - Storage: 20 GB
   - Username: admin
   - Password: [tu_password_seguro]
5. Configurar VPC y Security Group
6. Habilitar acceso público (solo para desarrollo)
7. Create database
```

### Paso 2: Configurar Security Group

```bash
1. EC2 → Security Groups
2. Seleccionar el SG de tu RDS
3. Inbound rules → Edit
4. Add rule:
   - Type: MySQL/Aurora
   - Port: 3306
   - Source: 0.0.0.0/0 (solo para desarrollo!)
5. Save rules
```

### Paso 3: Exportar desde XAMPP

```bash
# Desde phpMyAdmin:
1. Seleccionar base de datos "myeventz"
2. Click "Exportar"
3. Método: Rápido
4. Formato: SQL
5. Click "Continuar"
6. Se descargará myeventz.sql
```

### Paso 4: Importar a AWS RDS

```bash
# Usando MySQL Workbench o línea de comandos
mysql -h [tu-endpoint-rds].rds.amazonaws.com \
      -P 3306 \
      -u admin \
      -p \
      < myeventz_database.sql

# Ejemplo:
mysql -h myeventz.c9x8y7z6w5v4.us-east-1.rds.amazonaws.com \
      -P 3306 \
      -u admin \
      -p \
      < myeventz_database.sql
```

### Paso 5: Verificar en RDS

```sql
-- Conectar a RDS
mysql -h [tu-endpoint].rds.amazonaws.com -u admin -p

-- Usar base de datos
USE myeventz;

-- Verificar tablas
SHOW TABLES;

-- Verificar datos
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM events;
```

---

## 🔍 Consultas Útiles

### Obtener todos los eventos con participantes

```sql
SELECT 
    e.title,
    e.event_date,
    c.name AS category,
    u.full_name AS organizer,
    COUNT(ep.id) AS participants,
    e.max_participants
FROM events e
JOIN categories c ON e.category_id = c.id
JOIN users u ON e.organizer_id = u.id
LEFT JOIN event_participants ep ON e.id = ep.event_id
GROUP BY e.id;
```

### Eventos que un usuario ha organizado

```sql
SELECT e.* 
FROM events e
WHERE e.organizer_id = 1; -- ID del usuario
```

### Eventos en los que un usuario participa

```sql
SELECT e.*
FROM events e
JOIN event_participants ep ON e.id = ep.event_id
WHERE ep.user_id = 1; -- ID del usuario
```

### Buscar eventos por texto

```sql
SELECT *
FROM events
WHERE MATCH(title, description) AGAINST('fútbol' IN NATURAL LANGUAGE MODE);
```

### Buscar usuarios por texto

```sql
SELECT *
FROM users
WHERE MATCH(full_name, username, bio) AGAINST('miguel' IN NATURAL LANGUAGE MODE);
```

### Eventos próximos con lugares disponibles

```sql
SELECT 
    e.*,
    e.max_participants - COUNT(ep.id) AS available_spots
FROM events e
LEFT JOIN event_participants ep ON e.id = ep.event_id
WHERE e.event_date >= CURDATE()
GROUP BY e.id
HAVING available_spots > 0
ORDER BY e.event_date;
```

### Top usuarios más activos

```sql
SELECT 
    u.username,
    u.full_name,
    COUNT(DISTINCT e.id) AS events_organized,
    COUNT(DISTINCT ep.event_id) AS events_participated
FROM users u
LEFT JOIN events e ON u.id = e.organizer_id
LEFT JOIN event_participants ep ON u.id = ep.user_id
GROUP BY u.id
ORDER BY (events_organized + events_participated) DESC
LIMIT 10;
```

### Categorías más populares

```sql
SELECT 
    c.name,
    COUNT(e.id) AS total_events,
    SUM(CASE WHEN e.event_date >= CURDATE() THEN 1 ELSE 0 END) AS upcoming_events
FROM categories c
LEFT JOIN events e ON c.id = e.category_id
GROUP BY c.id
ORDER BY total_events DESC;
```

---

## 🔒 Seguridad

### Cambiar contraseña de root (XAMPP)

```sql
-- Desde phpMyAdmin o MySQL CLI
ALTER USER 'root'@'localhost' IDENTIFIED BY 'nueva_contraseña';
FLUSH PRIVILEGES;
```

### Crear usuario con permisos limitados

```sql
-- Usuario solo para la app (recomendado)
CREATE USER 'myeventz_app'@'localhost' IDENTIFIED BY 'password_seguro';
GRANT SELECT, INSERT, UPDATE, DELETE ON myeventz.* TO 'myeventz_app'@'localhost';
FLUSH PRIVILEGES;
```

### Backup de la base de datos

```bash
# Backup completo
mysqldump -u root -p myeventz > myeventz_backup.sql

# Backup solo estructura (sin datos)
mysqldump -u root -p --no-data myeventz > myeventz_structure.sql

# Backup solo datos (sin estructura)
mysqldump -u root -p --no-create-info myeventz > myeventz_data.sql
```

---

## 🐛 Solución de Problemas

### Error: "Access denied for user"

```bash
# Verificar usuario y contraseña
mysql -u root -p

# Si es XAMPP y no tienes contraseña:
mysql -u root
```

### Error: "Can't connect to MySQL server"

```bash
# Verificar que MySQL está corriendo
# En XAMPP: Iniciar el módulo MySQL
# En cmd: netstat -an | find "3306"
```

### Error al importar: "Unknown command"

```bash
# Asegúrate de usar el comando correcto:
mysql -u root -p myeventz < myeventz_database.sql

# NO uses:
mysql -u root -p < myeventz_database.sql myeventz  # ❌ Orden incorrecto
```

### Tablas no aparecen en phpMyAdmin

```sql
-- Refrescar desde MySQL CLI
USE myeventz;
SHOW TABLES;

-- En phpMyAdmin: Click en "Recargar" (icono de actualizar)
```

---

## 📚 Recursos Adicionales

- [MySQL Documentation](https://dev.mysql.com/doc/)
- [AWS RDS MySQL Guide](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_MySQL.html)
- [phpMyAdmin Documentation](https://www.phpmyadmin.net/docs/)

---

## ✅ Checklist de Instalación

- [ ] XAMPP instalado y corriendo
- [ ] MySQL iniciado en XAMPP
- [ ] Script SQL ejecutado correctamente
- [ ] 8 tablas creadas
- [ ] 5 usuarios insertados
- [ ] 14 categorías insertadas
- [ ] 8 eventos insertados
- [ ] Vistas creadas (v_events_full, v_users_stats)
- [ ] Procedimientos creados (get_popular_events, get_recent_events)
- [ ] Consultas de prueba ejecutadas correctamente

---

¿Listo para conectar con el backend? Continúa con la **Etapa 2: Backend** 🚀
