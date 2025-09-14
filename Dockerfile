# Dockerfile otimizado para produção com multi-stage build
# Stage 1: Build da aplicação
FROM node:18-alpine as build

WORKDIR /app

# Copiar arquivos de dependências primeiro (para melhor cache do Docker)
COPY package*.json ./

# Instalar dependências
RUN npm ci --only=production --silent

# Copiar código fonte
COPY . .

# Build da aplicação para produção
RUN npm run build

# Stage 2: Servidor de produção com Nginx
FROM nginx:alpine

# Copiar build da aplicação do stage anterior
COPY --from=build /app/dist /usr/share/nginx/html

# Copiar configuração customizada do Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Criar usuário não-root para segurança
RUN addgroup -g 1001 -S nginx && \
    adduser -S nginx -u 1001

# Exposer porta 80
EXPOSE 80

# Comando para iniciar o Nginx
CMD ["nginx", "-g", "daemon off;"]