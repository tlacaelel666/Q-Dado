# Usa una imagen oficial de Node.js como base
FROM node:20-alpine

# Establece el directorio de trabajo en el contenedor
WORKDIR /app

# Copia los archivos de dependencias primero
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto del código fuente
COPY . .

# Compila TypeScript (asume que tienes un script 'build' en package.json)
RUN npm run build

# Expone el puerto (ajusta el puerto si tu app usa otro)
EXPOSE 3000

# Comando para iniciar la app (ajusta si tu script se llama diferente)
CMD ["npm", "start"]
