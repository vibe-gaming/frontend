# Этап сборки
FROM node:22.21.1-alpine AS builder

# Установка yarn
RUN corepack enable && corepack prepare yarn@4.9.1 --activate

WORKDIR /app

# Аргументы сборки
ARG VITE_API_TIMEOUT = 8000
ARG NODE_ENV=production
ARG VITE_API_URL = https://backend-production-10ec.up.railway.app/api/v1

# Переменные окружения
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_API_TIMEOUT=$VITE_API_TIMEOUT
ENV VITE_APP_TAG_VERSION=$VITE_APP_TAG_VERSION
ENV NODE_ENV=$NODE_ENV

# 1. Сначала копируем только файлы зависимостей
COPY package.json yarn.lock .yarnrc.yml* ./

# 2. Копируем папку .yarn, если она есть (для плагинов и конфигураций), но не обязательно для releases, так как corepack их скачает.
# Однако, так как это вызывало ошибку, и corepack используется, мы убрали явное копирование .yarn
# Если нужны специфичные плагины, убедитесь, что они не в .dockerignore

# 3. Устанавливаем зависимости (этот слой закэшируется, если package.json не менялся)
RUN yarn install --immutable

# 4. Только теперь копируем исходный код
COPY . .

# 5. Генерация API и сборка проекта
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
