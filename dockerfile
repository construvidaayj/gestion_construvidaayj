# 1. Usa una imagen base más ligera
FROM node:18-alpine AS deps

# 2. Establece el directorio de trabajo
WORKDIR /app

# 3. Copia los archivos de dependencias
COPY package*.json ./

# 4. Instala solo dependencias de producción
RUN npm install --production

# ============================
# Fase de construcción
# ============================
FROM node:18-alpine AS builder

WORKDIR /app

# Copiamos dependencias y el resto del código
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Construimos la aplicación
RUN npm run build

# ============================
# Fase final: entorno de ejecución
# ============================
FROM node:18-alpine AS runner

WORKDIR /app

# Copia solo lo necesario para producción
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.js ./next.config.js

# Expón el puerto que Next usa por defecto
EXPOSE 3000

# Ejecuta la app
CMD ["npm", "run", "start"]
