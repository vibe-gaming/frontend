
FROM node:20

# Включаем corepack (чтобы работал pnpm/yarn)
RUN corepack enable && corepack prepare yarn@4.9.1

WORKDIR /app

COPY package.json ./

# Активируем нужную версию менеджера пакетов (рекомендуется)
RUN yarn install

RUN yarn build

COPY . .

CMD ["yarn", "preview"]
