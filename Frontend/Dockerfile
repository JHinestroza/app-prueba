# Usar Node.js 20 Alpine (imagen ligera)
FROM node:20-alpine

# Crear directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar todo el código fuente
COPY . .

# Exponer puerto 5173 (puerto por defecto de Vite)
EXPOSE 5173

# Comando para iniciar Vite en modo preview
# Usa --host para permitir acceso desde fuera del contenedor
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
