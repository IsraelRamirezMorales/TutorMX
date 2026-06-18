# Usar la imagen oficial de Node.js 20 basada en Alpine Linux
FROM node:20-alpine

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar package.json y package-lock.json para instalar dependencias primero (aprovecha la caché de Docker)
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto de los archivos del proyecto
COPY . .

# Compilar el proyecto Next.js
RUN npm run build

# Exponer el puerto por defecto de Next.js
EXPOSE 3000

# Comando para iniciar la aplicación en modo producción
CMD ["npm", "run", "start"]
