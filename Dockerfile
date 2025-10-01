# Dockerfile otimizado para produção com multi-stage build
# Stage 1: Build da aplicação
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000
CMD ["npm", "run", "dev", "--", "--host"]