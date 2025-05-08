# Ratotecki - Site Corporativo

Este é um site moderno para a Ratotecki, empresa especializada em sistemas de proteção e controle no setor energético utilizando Inteligência Artificial e gêmeos virtuais. O projeto foi desenvolvido com [Next.js](https://nextjs.org) e inicializado com [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Funcionalidades

- Landing page completa com design responsivo usando Tailwind CSS
- Navegação desktop/mobile com Navbar interativo
- Seção Hero destacando a missão da empresa
- Seções About e Features apresentando a plataforma e tecnologias
- Seção de notícias (News) com carrossel responsivo
- Formulário de contato em modal
- Footer com informações da empresa e logos de parceiros (ABB e SynerLeap)
- Sistema de tema claro/escuro usando Zustand para persistência
- Botão de voltar ao topo
- Estrutura de dados separada (dados de notícias em JSON)

## Estrutura do Projeto

O projeto segue uma arquitetura organizada:

- `/src/components` - Componentes reutilizáveis da interface
  - `/sections` - Seções principais da landing page
  - `/ui` - Componentes de UI reutilizáveis
- `/data` - Arquivos JSON com dados estruturados
  - `news.json` - Dados das notícias exibidas no carrossel

## Começando

Primeiro, execute o servidor de desenvolvimento:

```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
# ou
bun dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador para ver o resultado.

## Tecnologias Utilizadas

- Next.js - Framework React
- Tailwind CSS - Estilização
- Framer Motion - Animações
- Zustand - Gerenciamento de estado
- TypeScript - Tipagem estática

## Aprendendo Mais

Para saber mais sobre o Next.js, consulte os seguintes recursos:

- [Documentação do Next.js](https://nextjs.org/docs) - saiba mais sobre os recursos e API do Next.js.
- [Aprenda Next.js](https://nextjs.org/learn) - um tutorial interativo do Next.js.

## Implantação na Vercel

A maneira mais fácil de implantar seu aplicativo Next.js é usar a [Plataforma Vercel](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) dos criadores do Next.js.

Consulte a [documentação de implantação do Next.js](https://nextjs.org/docs/app/building-your-application/deploying) para obter mais detalhes.
