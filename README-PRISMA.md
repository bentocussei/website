# Instruções do Prisma para o Projeto Ratotecki Website

## Configuração Inicial

1. Certifique-se de ter um banco de dados PostgreSQL configurado
2. Configure a variável de ambiente `DATABASE_URL` no arquivo `.env`

```
DATABASE_URL="postgresql://postgres:password@localhost:5432/ratotecki_db?schema=public"
```

## Comandos disponíveis

### Gerar cliente Prisma
```bash
pnpm prisma:generate
```

### Criar migrações
```bash
pnpm prisma:migrate:dev
```

### Aplicar migrações no Railway (produção)
```bash
pnpm prisma:migrate:deploy
```

### Enviar schema para o banco de dados sem migrações
```bash
pnpm prisma:db:push
```

### Executar seed para popular o banco de dados com dados iniciais
```bash
pnpm prisma:db:seed
```

### Executar seed no Railway (produção)
```bash
pnpm railway:db:seed
```

### Resetar o banco de dados (apaga tudo e recria)
```bash
pnpm db:reset
```

### Setup completo do banco de dados no Railway (migrações + seed)
```bash
pnpm db:setup
```

### Definir variáveis de ambiente no Railway
```bash
pnpm railway:env:set NOME_DA_VARIAVEL=valor
```

### Abrir o Prisma Studio (interface visual)
```bash
pnpm prisma:studio
```

## Dados de seed

O seed cria automaticamente:

1. Um usuário admin (Email: admin@ratotecki.com, Senha: admin123)
2. Notícias de exemplo
3. Itens na lista de espera
4. Mensagens de contato de exemplo

## Configuração do Railway

1. Instale a CLI do Railway: `pnpm add -g @railway/cli`
2. Faça login: `railway login`
3. Vincule o projeto: `railway link`
4. Verifique a conexão: `railway status`

### Variáveis de ambiente necessárias no Railway

Certifique-se de configurar as seguintes variáveis no Railway:

```bash
# Configuração do banco de dados
DATABASE_URL="postgresql://..."

# Configuração do NextAuth
NEXTAUTH_SECRET="string-secreta-aqui"
NEXTAUTH_URL="https://seu-dominio.com"

# Outras configurações (opcional)
NODE_ENV="production"
```

Para configurar:
```bash
pnpm railway:env:set DATABASE_URL="sua-url-do-banco"
pnpm railway:env:set NEXTAUTH_SECRET="string-secreta-aqui"
pnpm railway:env:set NEXTAUTH_URL="https://seu-dominio.com"
```

## Fluxo de trabalho recomendado

### Desenvolvimento local
1. Modifique o `schema.prisma` conforme necessário
2. Execute `pnpm prisma:db:push` para atualizar rápido o banco sem migrações
3. Execute `pnpm prisma:generate` para atualizar o cliente Prisma
4. Use `pnpm prisma:studio` para visualizar/editar dados

### Criando migrações para produção
1. Modifique o `schema.prisma` conforme necessário
2. Execute `pnpm prisma:migrate:dev` para criar uma migração localmente
3. Envie as mudanças para o repositório
4. Execute `pnpm prisma:migrate:deploy` para aplicar migrações no Railway
5. Execute `pnpm railway:db:seed` se precisar popular dados no Railway

### Acesso ao sistema
1. Use `/paitrabalhou` para acessar a página de login do administrador
2. Use as credenciais do seed (Email: admin@ratotecki.com, Senha: admin123) 