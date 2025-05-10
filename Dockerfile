FROM node:23-alpine AS builder

# Instalar pnpm
RUN npm install -g pnpm

WORKDIR /app
COPY package.json ./
COPY prisma ./prisma

# Instalar dependências
RUN pnpm install

# Generate Prisma client
RUN pnpm prisma:generate

# Copy the rest of the application code
COPY . .

# Build do projeto
RUN pnpm build

FROM node:23-alpine AS runner

# Install pnpm in the runner stage
RUN npm install -g pnpm

WORKDIR /app

# Copiar arquivos necessários
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma

# Expor porta
EXPOSE 3001

# Comando para iniciar em produção
CMD ["pnpm", "start"]