# ConfigCraft

A config-driven low-code application generator that dynamically creates forms, tables, CRUD APIs, and database operations from imperfect JSON configurations.

## Architecture

ConfigCraft consists of:
- **Frontend**: React + Vite, Tailwind CSS, Zustand, React Router
- **Backend**: Node.js, Express, Prisma, PostgreSQL
- **Self-Healing Engine**: Gracefully handles incomplete, inconsistent, or partially incorrect JSON configs on both frontend (UI generation) and backend (API validation).

## Features
- **Dynamic UI Generation**: Forms and tables built dynamically at runtime based on JSON config.
- **Robust Self-Healing**: Automatically fixes malformed configs (missing types, missing names, duplicate fields, broken JSON).
- **Dynamic CRUD APIs**: Auto-registers secure, JWT-protected REST endpoints for every valid config.
- **CSV Data Import**: Native support for mapping and batch-importing CSV data into dynamically generated schemas.
- **Multi-language Support**: Built-in localization engine for field labels and UI elements.

## Getting Started

### Prerequisites
- Node.js v18+
- PostgreSQL
- NPM or Yarn

### Backend Setup
1. Navigate to `backend/`
2. Run `npm install`
3. Copy `.env.example` to `.env` and fill in your details
4. Run `npx prisma db push` to initialize the database
5. Run `npm run dev` to start the server on port 5000

### Frontend Setup
1. Navigate to `frontend/`
2. Run `npm install`
3. Copy `.env.example` to `.env`
4. Run `npm run dev` to start the Vite server
5. Open your browser to `http://localhost:5173`

## Usage
1. Sign up for a new account.
2. Go to **New App** and paste a JSON configuration. (e.g. `{"type": "form", "fields": [{"name": "title", "type": "text"}]}`)
3. The Self-Healing Engine will fix any issues and display a preview.
4. Save to generate your dynamic endpoints and UI.
5. Use the Form view to insert data, and the Table view to manage it.
