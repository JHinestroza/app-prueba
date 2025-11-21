# 🔧 Instalación de Dependencias Faltantes

Este documento lista todas las dependencias que necesitas instalar para que el proyecto funcione correctamente.

---

## 📦 Backend

Navega a la carpeta Backend y ejecuta:

```powershell
cd Backend

# Instalar todas las dependencias necesarias
npm install cors dotenv md5 mssql nodemon --save
```

O instala una por una si prefieres:

```powershell
npm install cors           # Manejo de CORS
npm install dotenv         # Variables de entorno
npm install md5            # Cifrado de contraseñas
npm install mssql          # Driver SQL Server
npm install nodemon --save-dev  # Hot reload en desarrollo
```

### Verificar package.json del Backend

Tu archivo `Backend/package.json` debe incluir estas dependencias:

```json
{
  "dependencies": {
    "express": "^5.1.0",
    "mssql": "^11.0.1",
    "cors": "^2.8.5",
    "dotenv": "^16.4.7",
    "md5": "^2.3.0"
  },
  "devDependencies": {
    "nodemon": "^3.1.9"
  },
  "scripts": {
    "start": "node src/index.js",
    "dev": "nodemon src/index.js"
  }
}
```

---

## 🎨 Frontend

Navega a la carpeta Frontend y ejecuta:

```powershell
cd Frontend

# Instalar todas las dependencias necesarias
npm install axios md5 --save
```

O instala una por una:

```powershell
npm install axios    # Cliente HTTP para API
npm install md5      # Cifrado de contraseñas en el cliente
```

### Verificar package.json del Frontend

Tu archivo `Frontend/package.json` debe incluir estas dependencias:

```json
{
  "dependencies": {
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "react-hook-form": "^7.66.1",
    "react-icons": "^5.5.0",
    "react-router-dom": "^7.9.6",
    "sonner": "^2.0.7",
    "axios": "^1.7.9",
    "md5": "^2.3.0"
  }
}
```

---

## ✅ Verificación

### Backend

```powershell
cd Backend
npm list cors dotenv md5 mssql
```

Deberías ver todas las dependencias listadas sin errores.

### Frontend

```powershell
cd Frontend
npm list axios md5
```

Deberías ver ambas dependencias listadas sin errores.

---

## 🚀 Después de Instalar

### 1. Reiniciar Servidores de Desarrollo

Si los servidores ya estaban corriendo, detenlos (Ctrl+C) y vuelve a iniciarlos:

**Backend:**
```powershell
cd Backend
npm run dev
```

**Frontend:**
```powershell
cd Frontend
npm run dev
```

### 2. Verificar que No Hay Errores

- Backend debería mostrar: `✅ Servidor Backend DICRI` sin errores de módulos
- Frontend debería compilar sin errores de `Cannot find module`

---

## 📝 Script Completo de Instalación

Si prefieres ejecutar todo de una vez:

```powershell
# Desde la raíz del proyecto (app-prueba)

# Instalar Backend
cd Backend
npm install
npm install cors dotenv md5 mssql nodemon --save

# Instalar Frontend
cd ..\Frontend
npm install
npm install axios md5 --save

# Volver a la raíz
cd ..

Write-Host "✅ Todas las dependencias instaladas correctamente"
```

---

## ⚠️ Problemas Comunes

### Error: "Cannot find module 'axios'"

```powershell
cd Frontend
npm install axios
```

### Error: "Cannot find module 'md5'"

```powershell
# Backend
cd Backend
npm install md5

# Frontend
cd Frontend
npm install md5
```

### Error: "Cannot find module 'mssql'"

```powershell
cd Backend
npm install mssql
```

### Error: "nodemon: command not found"

```powershell
cd Backend
npm install nodemon --save-dev
```

---

## 🔍 Comando para Ver Todas las Dependencias Instaladas

### Backend
```powershell
cd Backend
npm list --depth=0
```

### Frontend
```powershell
cd Frontend
npm list --depth=0
```

---

**¡Listo! Ahora puedes continuar con la guía de instalación principal.** 🚀
