# Sistema de Gestión de Expedientes e Indicios - DICRI / MP Guatemala

El sistema no se encuentra terminado, faltaron varias implementaciones como agregar indicios, aceptar y rechazar los expedientes. 

La manera mas rapida de levantar este servicio en este proyecto es con docker-s, basta con tener docker abierto, si es windows, y correr el siguiente comando: 

```bash
docker-compose up
```

de igual manera se pueden levantar individualmente. 

[![React](https://img.shields.io/badge/React-19.2.0-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-green.svg)](https://nodejs.org/)
[![SQL Server](https://img.shields.io/badge/SQL%20Server-2022-red.svg)](https://www.microsoft.com/sql-server)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://www.docker.com/)

Sistema completo para la gestión de expedientes e indicios forenses desarrollado con arquitectura cliente-servidor moderna.

---

##  Tabla de Contenidos

- [Arquitectura del Sistema](#-arquitectura-del-sistema)
- [Tecnologías Utilizadas](#-tecnologías-utilizadas)
- [Características Principales](#-características-principales)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Instalación y Configuración](#-instalación-y-configuración)
- [Despliegue con Docker](#-despliegue-con-docker)
- [Uso del Sistema](#-uso-del-sistema)
- [API Endpoints](#-api-endpoints)
- [Base de Datos](#-base-de-datos)
- [Seguridad](#-seguridad)

---

##  Arquitectura del Sistema

El sistema implementa una arquitectura de tres capas:

```
┌─────────────────┐
│    Frontend     │  React + Vite + TailwindCSS
│   (Port 80)     │  
└────────┬────────┘
         │ HTTP/REST
         │
┌────────▼────────┐
│    Backend      │  Node.js + Express
│  (Port 3000)    │  
└────────┬────────┘
         │ SQL Driver (mssql)
         │
┌────────▼────────┐
│   Database      │  SQL Server 2022
│  (Port 1433)    │  
└─────────────────┘
```

### Componentes

#### Frontend
- **Framework**: ReactJS 19.2.0
- **Build Tool**: Vite 7.2.2
- **Routing**: React Router DOM 7.9.6
- **HTTP Client**: Axios
- **UI**: TailwindCSS (configuración custom)
- **Notificaciones**: Sonner

#### Backend
- **Runtime**: Node.js 20.x
- **Framework**: Express 5.1.0
- **Database Driver**: mssql 11.0.1
- **Seguridad**: CORS, MD5 (cifrado de contraseñas)
- **Configuración**: dotenv

#### Base de Datos
- **Motor**: Microsoft SQL Server 2022 Developer Edition
- **Arquitectura**: Stored Procedures para toda la lógica de negocio
- **Contenedor**: Docker oficial de Microsoft

---

##  Tecnologías Utilizadas

### Backend

| Tecnología | Versión | Uso |
|-----------|---------|-----|
| Express | 5.1.0 | Framework web |
| mssql | 11.0.1 | Conector SQL Server |
| cors | 2.8.5 | Control de CORS |
| dotenv | 16.4.7 | Variables de entorno |
| md5 | 2.3.0 | Hash de contraseñas |

### Frontend

| Tecnología | Versión | Uso |
|-----------|---------|-----|
| React | 19.2.0 | Framework UI |
| React Router DOM | 7.9.6 | Navegación SPA |
| React Hook Form | 7.66.1 | Manejo de formularios |
| React Icons | 5.5.0 | Iconografía |
| Sonner | 2.0.7 | Notificaciones toast |
| Vite | 7.2.2 | Build tool |

---

##  Características Principales

### Gestión de Expedientes
-  Crear expedientes con fecha, técnico y descripción
-  Listar expedientes con filtros (estado, técnico, fecha)
-  Actualizar información del expediente
-  Eliminar expedientes (cascade a indicios y revisiones)

### Gestión de Indicios
-  Registrar indicios asociados a expedientes
-  Campos: descripción, color, tamaño, peso, ubicación
-  Múltiples indicios por expediente
-  Actualización y eliminación de indicios

### Flujo de Aprobación
-  Estados: En Revisión, Aprobado, Rechazado
-  Coordinadores pueden aprobar/rechazar
-  Justificación obligatoria al rechazar
-  Historial de revisiones

### Reportes y Estadísticas
-  Dashboard con métricas en tiempo real
-  Filtros por estado, técnico y fechas
-  Conteo de expedientes e indicios
-  Historial de revisiones

### Autenticación y Roles
-  Login con cifrado MD5
-  Sesión en localStorage
-  3 roles: Técnico, Coordinador, Administrador
-  Control de acceso por rol

---

##  Estructura del Proyecto

```
app-prueba/
├── Backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js          # Configuración SQL Server
│   │   ├── controllers/
│   │   │   ├── authController.js     # Login
│   │   │   ├── usuariosController.js # CRUD Usuarios
│   │   │   ├── expedientesController.js
│   │   │   ├── indiciosController.js
│   │   │   └── utilsController.js    # Roles, Estados, Stats
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── usuarios.js
│   │   │   ├── expedientes.js
│   │   │   ├── indicios.js
│   │   │   └── utils.js
│   │   └── index.js                  # Servidor Express
│   ├── .env.example
│   ├── Dockerfile
│   └── package.json
│
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Button.jsx
│   │   │   ├── InputField.jsx
│   │   │   └── PasswordInput.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── ExpedientesLista.jsx
│   │   ├── services/
│   │   │   ├── api.js                # Axios config
│   │   │   ├── authService.js
│   │   │   ├── expedientesService.js
│   │   │   ├── indiciosService.js
│   │   │   └── utilsService.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
│
├── DB/
│   ├── init/
│   │   ├── schema.sql                # Creación de tablas
│   │   ├── 02_datos_iniciales.sql    # Datos de prueba
│   │   └── 03_stored_procedures.sql  # SPs completos
│   ├── docker-compose.yaml           # Orquestación 3 servicios
│   └── EXPLICACION_VARIABLES_ENTORNO.md
│
└── README.md
```

---

##  Instalación y Configuración

### Prerrequisitos

- Node.js 20.x o superior
- Docker y Docker Compose
- Git

### 1. Clonar el Repositorio

```bash
git clone <repository-url>
cd app-prueba
```

### 2. Configurar Variables de Entorno

#### Backend
```bash
cd Backend
cp .env.example .env
```

Editar `.env`:
```env
PORT=3000
NODE_ENV=development
DB_SERVER=localhost
DB_PORT=1433
DB_USER=sa
DB_PASSWORD=prueba12345!
DB_DATABASE=PruebaTecnica
CORS_ORIGIN=http://localhost:5173
DB_ENCRYPT=false
DB_TRUST_SERVER_CERTIFICATE=true
```

#### Frontend
```bash
cd ../Frontend
cp .env.example .env
```

Editar `.env`:
```env
VITE_API_URL=http://localhost:3000/api
```

### 3. Instalar Dependencias

#### Backend
```bash
cd Backend
npm install
```

#### Frontend
```bash
cd ../Frontend
npm install
```

---

##  Despliegue con Docker

### Opción 1: Despliegue Completo (Recomendado)

Desde la carpeta `DB`:

```bash
cd DB
docker-compose up -d
```

Esto levantará:
-  SQL Server (puerto 1433)
-  Backend API (puerto 3000)
-  Frontend (puerto 80)

Acceder a: **http://localhost**

### Opción 2: Solo Base de Datos

```bash
cd DB
docker-compose up sqlserver -d
```

Luego ejecutar backend y frontend manualmente:

```bash
# Terminal 1 - Backend
cd Backend
npm run dev

# Terminal 2 - Frontend
cd Frontend
npm run dev
```

### Verificar Contenedores

```bash
docker ps
```

Deberías ver:
```
dicri-sqlserver  (1433:1433)
dicri-backend    (3000:3000)
dicri-frontend   (80:80)
```

### Detener Servicios

```bash
docker-compose down
```

### Ver Logs

```bash
# Todos los servicios
docker-compose logs -f

# Servicio específico
docker-compose logs -f backend
```

---

##  Uso del Sistema

### Usuarios de Prueba

El sistema viene con usuarios precargados:

| Correo | Contraseña | Rol | Funciones |
|--------|-----------|-----|-----------|
| `admin@dicri.gob.gt` | `admin123` | Administrador | Acceso total |
| `tecnico1@dicri.gob.gt` | `tecnico123` | Técnico | Crear/editar expedientes e indicios |
| `coordinador@dicri.gob.gt` | `coordinador123` | Coordinador | Revisar y aprobar/rechazar |
| `tecnico2@dicri.gob.gt` | `tecnico123` | Técnico | Crear/editar expedientes e indicios |

### Flujo de Trabajo

1. **Login**: Acceder con credenciales
2. **Dashboard**: Ver estadísticas y expedientes recientes
3. **Crear Expediente** (Técnico):
   - Ir a "Crear Nuevo Expediente"
   - Llenar descripción
   - Agregar indicios (descripción, color, tamaño, peso, ubicación)
4. **Revisar Expediente** (Coordinador):
   - Ir a "Revisar Expedientes"
   - Ver detalles e indicios
   - Aprobar o Rechazar (con justificación si rechaza)
5. **Consultar**: Ver historial y reportes

---

##  API Endpoints

### Autenticación

```http
POST /api/auth/login
Content-Type: application/json

{
  "correo": "tecnico1@dicri.gob.gt",
  "contrasenia": "tecnico123"
}
```

### Expedientes

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/expedientes` | Listar todos |
| GET | `/api/expedientes/:id` | Obtener por ID |
| GET | `/api/expedientes/tecnico/:tecnico_id` | Por técnico |
| GET | `/api/expedientes/estado/:estado_id` | Por estado |
| GET | `/api/expedientes/fecha?fecha_inicio=&fecha_fin=` | Por rango de fechas |
| POST | `/api/expedientes` | Crear |
| PUT | `/api/expedientes/:id` | Actualizar |
| PUT | `/api/expedientes/:id/revisar` | Aprobar/Rechazar |
| DELETE | `/api/expedientes/:id` | Eliminar |

### Indicios

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/indicios/expediente/:expediente_id` | Por expediente |
| GET | `/api/indicios/:id` | Obtener por ID |
| POST | `/api/indicios` | Crear |
| PUT | `/api/indicios/:id` | Actualizar |
| DELETE | `/api/indicios/:id` | Eliminar |

### Utilidades

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/utils/roles` | Listar roles |
| GET | `/api/utils/estados` | Listar estados |
| GET | `/api/utils/estadisticas` | Dashboard stats |
| GET | `/api/utils/revisiones` | Historial revisiones |

### Ejemplo: Crear Expediente

```bash
curl -X POST http://localhost:3000/api/expedientes \
  -H "Content-Type: application/json" \
  -d '{
    "descripcion": "Caso de robo en residencia",
    "tecnico_id": 2
  }'
```

Respuesta:
```json
{
  "success": true,
  "message": "Expediente creado exitosamente",
  "data": {
    "id": 1
  }
}
```

---

## 🗄️ Base de Datos

### Stored Procedures Principales

No se cargan automaticamente

#### Autenticación
- `sp_Login` - Validar credenciales

#### Usuarios
- `sp_ObtenerUsuarios`
- `sp_CrearUsuario`
- `sp_ActualizarUsuario`
- `sp_CambiarContrasenia`
- `sp_EliminarUsuario`

#### Expedientes
- `sp_ObtenerExpedientes`
- `sp_ObtenerExpedientePorId`
- `sp_ObtenerExpedientesPorTecnico`
- `sp_CrearExpediente`
- `sp_ActualizarExpediente`
- `sp_RevisarExpediente` (Aprobar/Rechazar)
- `sp_EliminarExpediente`

#### Indicios
- `sp_ObtenerIndiciosPorExpediente`
- `sp_CrearIndicio`
- `sp_ActualizarIndicio`
- `sp_EliminarIndicio`

#### Reportes
- `sp_ObtenerEstadisticas`
- `sp_ObtenerExpedientesPorFecha`
- `sp_ObtenerExpedientesPorEstado`
- `sp_ObtenerRevisiones`

---

##  Seguridad

### Cifrado de Contraseñas
-  Uso de **MD5** para hash de contraseñas
-  Cifrado en el cliente antes de enviar al backend
-  Contraseñas nunca almacenadas en texto plano

### CORS
-  Configuración de orígenes permitidos
-  Control de credenciales
-  Headers personalizados permitidos

### SQL Injection
-  100% uso de **Stored Procedures**
-  Parámetros vinculados (parameterized queries)
-  Validación de entradas

### Validaciones
-  Validación de campos en backend
-  Validación con React Hook Form en frontend
-  Manejo de errores consistente

---

##  Scripts Disponibles

### Backend

```bash
npm start          # Producción
npm run dev        # Desarrollo con nodemon
```

### Frontend

```bash
npm run dev        # Servidor de desarrollo
npm run build      # Build para producción
npm run preview    # Preview del build
npm run lint       # Linter
```

---

## 🧪 Pruebas

### Verificar Conexión a SQL Server

```bash
docker exec dicri-sqlserver /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "prueba12345!" -C -Q "SELECT name FROM sys.databases"
```

### Probar Backend

```bash
# Health check
curl http://localhost:3000/health

# Listar expedientes
curl http://localhost:3000/api/expedientes

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"correo":"tecnico1@dicri.gob.gt","contrasenia":"tecnico123"}'
```

---

##  Colección Postman

Puedes importar esta colección para probar todos los endpoints:

```json
{
  "info": {
    "name": "DICRI API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Login",
          "request": {
            "method": "POST",
            "url": "http://localhost:3000/api/auth/login",
            "body": {
              "mode": "raw",
              "raw": "{\n  \"correo\": \"tecnico1@dicri.gob.gt\",\n  \"contrasenia\": \"tecnico123\"\n}"
            }
          }
        }
      ]
    }
  ]
}
```

---

##  Contribución

Este es un proyecto de prueba técnica. Para contribuir:

1. Fork el proyecto
2. Crear una rama (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abrir Pull Request

---
