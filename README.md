# Fitness Platform Web

Frontend application for the Fitness Platform.

## Tech Stack

- React
- TypeScript
- Vite

## Requirements

- Node.js 22+
- npm

## Environment Setup

Create a local `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Default development configuration:

```env
VITE_API_URL=http://localhost:8080
```

> Environment variables exposed to the frontend must use the `VITE_` prefix.
> Sensitive values must never be stored in frontend environment variables.

## Installation

Install project dependencies:

```bash
npm install
```

## Development

Start the local development server:

```bash
npm run dev
```

Vite will display the local development URL in the terminal.

## Lint

Run static analysis:

```bash
npm run lint
```

## Production Build

Generate the production build:

```bash
npm run build
```