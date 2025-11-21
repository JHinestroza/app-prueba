# Guía de Instalación y Despliegue - Sistema DICRI

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** 20.x o superior - [Descargar](https://nodejs.org/)
- **Docker Desktop** - [Descargar](https://www.docker.com/products/docker-desktop/)
- **Git** - [Descargar](https://git-scm.com/)
- **PowerShell** (Windows) o Terminal (Linux/Mac)

---

## 🚀 Opción 1: Despliegue Rápido con Docker (Recomendado)

Esta opción levanta todos los servicios con un solo comando.

### Paso 1: Clonar el Repositorio

```powershell
git clone <repository-url>
cd app-prueba
```

### Paso 2: Instalar Dependencias del Backend

```powershell
cd Backend
npm install
```

**Importante**: Agregar las siguientes dependencias que faltan:

```powershell
npm install axios cors dotenv md5 mssql nodemon
```

### Paso 3: Instalar Dependencias del Frontend

```powershell
cd ..\Frontend
npm install
```

**Importante**: Agregar las siguientes dependencias que faltan:

```powershell
npm install axios md5
```

### Paso 4: Levantar Todos los Servicios

```powershell
cd ..\DB
docker-compose up -d --build
```

Esto iniciará:
- ✅ SQL Server en puerto `1433`
- ✅ Backend API en puerto `3000`
- ✅ Frontend en puerto `80`

### Paso 5: Verificar que Todo Funcione

```powershell
# Ver estado de contenedores
docker ps

# Ver logs en tiempo real
docker-compose logs -f

# Verificar base de datos
docker exec dicri-sqlserver /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "prueba12345!" -C -Q "SELECT name FROM sys.databases"
```

### Paso 6: Acceder al Sistema

Abrir en el navegador: **http://localhost**

**Usuarios de prueba:**
- Técnico: `tecnico1@dicri.gob.gt` / `tecnico123`
- Coordinador: `coordinador@dicri.gob.gt` / `coordinador123`
- Admin: `admin@dicri.gob.gt` / `admin123`

---

## 🔧 Opción 2: Desarrollo Local (Sin Docker para Backend/Frontend)

Esta opción es útil para desarrollo activo con hot-reload.

### Paso 1: Levantar Solo SQL Server

```powershell
cd DB
docker-compose up sqlserver -d
```

Esperar 30-40 segundos para que SQL Server inicie completamente.

### Paso 2: Verificar que SQL Server Esté Listo

```powershell
docker-compose logs sqlserver
```

Buscar el mensaje: `"Inicialización completa. SQL Server está listo."`

### Paso 3: Instalar y Configurar Backend

```powershell
cd ..\Backend

# Instalar dependencias (si aún no se ha hecho)
npm install axios cors dotenv md5 mssql

# Verificar que existe el archivo .env
# Si no existe, copiar de .env.example
copy .env.example .env

# Iniciar backend en modo desarrollo
npm run dev
```

El backend estará corriendo en `http://localhost:3000`

### Paso 4: Instalar y Configurar Frontend

Abrir **otra terminal** PowerShell:

```powershell
cd Frontend

# Instalar dependencias (si aún no se ha hecho)
npm install axios md5

# Verificar que existe el archivo .env
# Si no existe, copiar de .env.example
copy .env.example .env

# Iniciar frontend en modo desarrollo
npm run dev
```

El frontend estará corriendo en `http://localhost:5173`

### Paso 5: Acceder al Sistema

Abrir en el navegador: **http://localhost:5173**

---

## 📦 Comandos Útiles de npm

### Backend

```powershell
# Instalar TODAS las dependencias necesarias
npm install express mssql cors dotenv md5 nodemon

# Iniciar en desarrollo (con hot-reload)
npm run dev

# Iniciar en producción
npm start
```

### Frontend

```powershell
# Instalar TODAS las dependencias necesarias
npm install react react-dom react-router-dom react-hook-form react-icons sonner axios md5

# Iniciar servidor de desarrollo
npm run dev

# Construir para producción
npm run build

# Preview del build
npm run preview
```

---

## 🐳 Comandos Útiles de Docker

### Gestión de Contenedores

```powershell
# Ver contenedores corriendo
docker ps

# Ver todos los contenedores (incluso detenidos)
docker ps -a

# Ver logs de un servicio específico
docker-compose logs backend
docker-compose logs frontend
docker-compose logs sqlserver

# Ver logs en tiempo real
docker-compose logs -f

# Detener todos los servicios
docker-compose down

# Detener y eliminar volúmenes (⚠️ borra la BD)
docker-compose down -v

# Reiniciar un servicio específico
docker-compose restart backend

# Reconstruir imágenes
docker-compose build --no-cache

# Levantar y reconstruir
docker-compose up -d --build
```

### Interactuar con SQL Server

```powershell
# Entrar al contenedor
docker exec -it dicri-sqlserver /bin/bash

# Ejecutar consultas directamente
docker exec dicri-sqlserver /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "prueba12345!" -C -Q "SELECT * FROM PruebaTecnica.dbo.Usuarios"

# Ver tablas de la base de datos
docker exec dicri-sqlserver /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "prueba12345!" -C -Q "USE PruebaTecnica; SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES"
```

---

## 🔍 Solución de Problemas

### Problema: "Cannot find module 'axios'" o similar

**Solución:**
```powershell
cd Backend  # o Frontend según el error
npm install axios md5
```

### Problema: "Port 1433 is already in use"

**Solución:** Ya tienes SQL Server corriendo localmente.

Opción 1 - Detener SQL Server local:
```powershell
# Windows - abrir Servicios y detener "SQL Server (MSSQLSERVER)"
services.msc
```

Opción 2 - Cambiar puerto en docker-compose.yaml:
```yaml
ports:
  - "1434:1433"  # Usar puerto 1434 externamente
```

### Problema: "Cannot connect to SQL Server"

**Solución:**
```powershell
# Verificar que SQL Server está corriendo
docker ps

# Ver logs para errores
docker-compose logs sqlserver

# Reiniciar SQL Server
docker-compose restart sqlserver

# Esperar 30 segundos y probar de nuevo
```

### Problema: Backend no conecta con SQL Server en Docker

**Verificar archivo `.env` del Backend:**
```env
DB_SERVER=localhost  # Si backend corre fuera de Docker
# O
DB_SERVER=sqlserver  # Si backend corre dentro de Docker
```

### Problema: Frontend no puede hacer peticiones al Backend

**Verificar archivo `.env` del Frontend:**
```env
VITE_API_URL=http://localhost:3000/api
```

**Verificar CORS en Backend** (`src/index.js`):
```javascript
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true
}));
```

### Problema: "EADDRINUSE: address already in use"

Un puerto ya está en uso.

```powershell
# Windows - Ver qué proceso usa el puerto 3000
netstat -ano | findstr :3000

# Matar el proceso (reemplazar PID)
taskkill /PID <PID> /F
```

---

## 📊 Verificación de Instalación Exitosa

### Checklist Final

- [ ] SQL Server corriendo en puerto 1433
- [ ] Backend corriendo en puerto 3000
- [ ] Frontend corriendo en puerto 80 (Docker) o 5173 (dev)
- [ ] Login funciona correctamente
- [ ] Dashboard muestra estadísticas
- [ ] Se pueden ver expedientes

### Pruebas de API

```powershell
# Health check del backend
curl http://localhost:3000/health

# Login de prueba
curl -X POST http://localhost:3000/api/auth/login -H "Content-Type: application/json" -d '{\"correo\":\"tecnico1@dicri.gob.gt\",\"contrasenia\":\"tecnico123\"}'

# Listar expedientes
curl http://localhost:3000/api/expedientes
```

---

## 🎯 Siguiente Pasos

Una vez que el sistema esté funcionando:

1. **Explorar el Dashboard** - Ver estadísticas en tiempo real
2. **Crear un Expediente** - Como técnico, crear un nuevo caso
3. **Agregar Indicios** - Asociar evidencias al expediente
4. **Revisar como Coordinador** - Aprobar o rechazar expedientes
5. **Ver Reportes** - Filtrar por fechas, estados, técnicos

---

## 📚 Recursos Adicionales

- [Documentación de React](https://react.dev/)
- [Documentación de Express](https://expressjs.com/)
- [Documentación de SQL Server](https://learn.microsoft.com/en-us/sql/)
- [Documentación de Docker](https://docs.docker.com/)

---

## 🆘 Soporte

Si encuentras problemas no listados aquí:

1. Revisar logs: `docker-compose logs`
2. Verificar variables de entorno en archivos `.env`
3. Asegurar que todos los puertos estén disponibles
4. Reiniciar Docker Desktop

---

**¡Sistema listo para usar! 🚀**
