# Max Backend Project

## Overview

Max Backend Project is an application designed to manage artists and music releases. It uses Hono.js framework for backend, Drizzle ORM for database interactions, Zod for input validation, and cloudflare worker/D1 as serverless.

## Prerequisites

- Node.js (version 18 or later)
- Yarn package manager

## Quick Start

### 1. Clone the Repository

Using HTTPS:

```bash
git clone https://github.com/silacode/max-backend-project.git
```

Using SSH:

```bash
git clone git@github.com:silacode/max-backend-project.git
```

```bash
cd max-backend-project
```

### 2. Setup the Project

This command installs dependencies, generates types, sets up the database schema, applies migrations, and seeds the database with initial data.

```bash
yarn setup:all
```

### 3. Start the Development Server

```bash
yarn dev
```

### 3. Run Unit Test

```bash
yarn test
```

## Available Scripts

- `yarn setup`: Installs dependencies and generates Cloudflare types.
- `yarn setup:db`: Sets up the database schema, applies migrations, and seeds the database.
- `yarn setup:all`: Complete project setup (dependencies + database).
- `yarn dev`: Starts the development server.
- `yarn dev:full`: Sets up the database and starts the development server.
- `yarn test`: Runs the test suite using Vitest.
- `yarn deploy`: Deploys the application to Cloudflare Workers.
- `yarn db:generate`: Generates database schema using Drizzle Kit.
- `yarn db:migrate`: Applies database migrations.
- `yarn db:seed`: Seeds the database with initial data.

## Project Structure

- **src/**: Contains the main application code.
  - **routes/**: API route handlers.
  - **middleware/**: Middleware functions.
  - **db/**: Database schema and setup.
  - **schemas/**: Zod validation schemas.
  - **utils/**: Utility functions.
- **test/**: Contains test files.
- **drizzle/**: Drizzle ORM configuration.

## Configuration

- **wrangler.toml**: Configuration for Cloudflare Workers.
- **tsconfig.json**: TypeScript configuration.
- **package.json**: Project metadata and scripts.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
