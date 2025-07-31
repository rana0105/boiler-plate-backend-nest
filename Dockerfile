# Dockerfile
FROM node:22.3.0

# Declare build-time argument
ARG APP_PORT=3000

# Set runtime environment variable
ENV APP_PORT=${APP_PORT}

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE ${APP_PORT}

CMD ["node", "dist/main"]
