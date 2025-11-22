# Этап сборки
FROM node:22.21.1-alpine AS builder

# Установка yarn
RUN corepack enable && corepack prepare yarn@4.9.1 --activate

WORKDIR /app

# Принимаем все переменные окружения через ARG
# Vite требует, чтобы переменные начинались с VITE_ для доступа через import.meta.env
ARG VITE_API_URL
ARG VITE_API_TIMEOUT
ARG VITE_APP_TAG_VERSION
ARG NODE_ENV=production

# Устанавливаем как ENV для использования во время сборки
# Vite встраивает эти переменные в код во время сборки
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_API_TIMEOUT=$VITE_API_TIMEOUT
ENV VITE_APP_TAG_VERSION=$VITE_APP_TAG_VERSION
ENV NODE_ENV=$NODE_ENV

# Копирование файлов конфигурации
COPY package.json yarn.lock .yarnrc.yml* ./
COPY .yarn ./.yarn

# Копирование исходного кода
COPY . .

# Установка зависимостей
RUN yarn install --immutable

# Генерация API и сборка проекта
# Переменные окружения будут доступны через import.meta.env во время сборки
RUN yarn generate:api && yarn build

# Этап production
FROM node:22.21.1-alpine

WORKDIR /app

# Установка serve для раздачи статических файлов
RUN npm install -g serve

# Копирование собранных файлов из этапа сборки
COPY --from=builder /app/dist ./dist

# Открытие порта
EXPOSE 3000

# Запуск serve
CMD ["serve", "-s", "dist", "-l", "3000"]
