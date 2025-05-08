# Ratotecki - Corporate Website

This is a modern website for Ratotecki, a company specializing in protection and control systems for the energy sector using Artificial Intelligence and virtual twins. The project was developed with [Next.js](https://nextjs.org) and bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Features

- Complete responsive landing page using Tailwind CSS
- Desktop/mobile navigation with interactive Navbar
- Hero section highlighting the company's mission
- About and Features sections presenting the platform and technologies
- News section with responsive carousel
- Contact form in modal
- Footer with company information and partner logos (ABB and SynerLeap)
- Light/dark theme system using Zustand for persistence
- Back-to-top button
- Separated data structure (news data in JSON)

## Project Structure

The project follows an organized architecture:

- `/src/components` - Reusable interface components
  - `/sections` - Main landing page sections
  - `/ui` - Reusable UI components
- `/data` - JSON files with structured data
  - `news.json` - News data displayed in the carousel

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Technologies Used

- Next.js - React framework
- Tailwind CSS - Styling
- Framer Motion - Animations
- Zustand - State management
- TypeScript - Static typing
