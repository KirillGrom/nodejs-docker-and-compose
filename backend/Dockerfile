FROM node:16-alpine AS builder

# Установка зависимостей для сборки нативных модулей
RUN apk add --no-cache python3 make g++

WORKDIR /app

COPY package*.json ./

# Установка всех зависимостей (в т.ч. dev), чтобы сработал build
RUN npm ci

COPY . .

# Сборка проекта
RUN npm run build


# Финальный образ
FROM node:22-alpine

# Установка зависимостей для сборки нативных модулей
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Копируем только необходимые файлы
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

# Установка production-зависимостей (включая bcrypt)
RUN npm ci --omit=dev

# Установка pm2
RUN npm install -g pm2

COPY ecosystem.config.js ./

ENV PORT=3000
EXPOSE 3000

CMD ["pm2-runtime", "ecosystem.config.js"]