# ConfigCraft

> A config-driven application runtime that dynamically generates forms, tables, CRUD APIs, and database operations from JSON configurations — with a self-healing engine that gracefully recovers from broken or incomplete configs.

**Built by [Diksha Thongire](https://github.com/yourusername) · Full Stack Developer**

---

## Live Demo

🔗 **[configcraft.vercel.app](https://your-live-url.vercel.app)**

---

## What Is This?

ConfigCraft is a **metadata-driven application runtime** — not a hardcoded CRUD app. You give it a JSON configuration, and it dynamically spins up:

- A fully rendered **frontend UI** (forms, tables, dashboards)
- Working **backend CRUD APIs** (generated at runtime)
- **PostgreSQL-backed data storage** (via Prisma)
- **Auth-aware, user-scoped** data access

The system is designed to survive imperfect input. Broken configs don't crash the app — they get healed, warned about, and rendered safely.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite, Tailwind CSS, Zustand |
| Backend | Node.js, Express.js |
| Database | PostgreSQL + Prisma ORM |
| Auth | JWT + bcrypt |
| Deployment | Vercel (frontend) + Railway (backend + DB) |

---

## Core Features

### Self-Healing Config Engine
The most important system in the codebase. When a JSON config is uploaded, `selfHealingEngine.js` normalizes it before it ever reaches the renderer or database.

| Problem | Detection | Action |
|---|---|---|
| Missing field type | `field.type === undefined` | Default to `"text"` |
| Unknown type (e.g. `"txt"`) | Not in registry | Check aliases, else fallback to `"text"` |
| Missing field name | `field.name === undefined` | Auto-generate `field_${index}` |
| Duplicate field names | Two fields share same name | Rename second to `name_2` |
| Missing label | `field.label === undefined` | Infer from field name |
| Select with no options | `type === "select" && !options` | Default to `[]` |
| Config is not an object | Array, string, null | Wrap or normalize safely |
| Completely broken JSON | `JSON.parse` throws | Return empty safe config |

Every healing action is collected as a warning and displayed in the **Runtime Warning Panel** — an amber UI above any generated form.

### Dynamic Form Generator
JSON config → rendered form. Supports: `text`, `textarea`, `number`, `select`, `checkbox`, `date`, `email`, `password`. Validation driven by config rules.

### Dynamic Table Generator
JSON config → data table with pagination, column sorting, and empty states.

### Dynamic CRUD APIs
Routes are generated at runtime per config:
```
POST   /api/apps/:configId/records
GET    /api/apps/:configId/records
GET    /api/apps/:configId/records/:id
PUT    /api/apps/:configId/records/:id
DELETE /api/apps/:configId/records/:id
```

### CSV Import System
Upload a CSV → map columns to config fields → batch import to PostgreSQL → render in dynamic table. Handles: empty files, duplicate headers, type mismatches, rows with missing/extra columns.

### Multi-Language Support
Full English and Hindi UI support. Toggle instantly without page refresh. Field labels support i18n objects:
```json
{ "label": { "en": "Name", "hi": "नाम" } }
```

### Authentication
JWT-based auth with bcrypt password hashing. Every database query filters by `userId` — complete tenant isolation.

---

## Architecture

```
User uploads JSON config
        ↓
selfHealingEngine.js normalizes + collects warnings
        ↓
componentRegistry maps field types → React components
        ↓
DynamicForm / DynamicTable renders UI
        ↓
User submits data → validationPipeline checks against config
        ↓
DynamicRecord stored as JSONB in PostgreSQL
        ↓
Table view fetches and renders records
```

### Why JSONB for dynamic records?

Instead of running `ALTER TABLE` every time a config changes (slow, risky, impossible at scale), all generated records are stored as `Json` in a single `DynamicRecord` table via Prisma. The schema stays stable. The data stays flexible. Old records survive config evolution without any migration.

### Why Vite over Next.js?

The backend needs to be a completely independent runtime engine — decoupled from any frontend framework. By separating them, the Express backend can serve dynamic APIs to any client. Next.js would have coupled SSR complexity to a system that doesn't need it.

### Why a Component Registry?

Instead of `if/else` chains to decide which component to render, `componentRegistry.js` maps field types to components. Adding a new field type requires registering one entry — no changes to core rendering logic. This is the extensibility pattern that makes the system maintainable.

---

## Database Schema

```prisma
model User {
  id         String          @id @default(cuid())
  email      String          @unique
  password   String
  name       String?
  appConfigs AppConfig[]
  records    DynamicRecord[]
  csvUploads CSVUpload[]
}

model AppConfig {
  id               String          @id @default(cuid())
  userId           String
  name             String
  rawConfig        Json
  normalizedConfig Json?
  warnings         Json?           @default("[]")
  records          DynamicRecord[]
}

model DynamicRecord {
  id       String    @id @default(cuid())
  userId   String
  configId String
  data     Json
}

model CSVUpload {
  id        String @id @default(cuid())
  userId    String
  configId  String
  filename  String
  rowCount  Int
  columnMap Json
  errors    Json?
  status    String @default("pending")
}
```

---

## Edge Cases Handled

**Config**
- Null or non-object config
- Fields array missing or not an array
- Unknown component types → `UnsupportedField` rendered, layout stable
- Duplicate field names → renamed with suffix
- `min > max` in validation → swapped with warning
- Config with zero fields → empty state UI

**API**
- Expired / malformed JWT → 401 with error code
- Accessing another user's config → 403
- Invalid JSON body → 400
- Negative pagination values → defaulted to page 1, limit 10

**CSV**
- File not `.csv` → rejected
- File over 5MB → rejected
- Empty file → `{ imported: 0 }` response
- Duplicate headers → first occurrence used, warned
- Rows with extra columns → extra columns ignored
- `"true"` / `"yes"` / `"1"` strings → normalized to boolean for checkbox fields

**UI**
- Config load > 2s → skeleton loader shown
- Form submit with no internet → toast error, submit re-enabled
- Missing translation → falls back to English, then raw key
- Field render crash → that field shows `FallbackRenderer`, rest of form works

---

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database (local or Railway)

### Installation

```bash
# Clone the repo
git clone https://github.com/yourusername/configcraft.git
cd configcraft

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Environment Setup

**backend/.env**
```env
DATABASE_URL="postgresql://user:password@host:5432/configcraft"
JWT_SECRET="your-32-char-secret-here"
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

**frontend/.env**
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### Database Setup

```bash
cd backend
npx prisma migrate dev --name init
npx prisma generate
```

### Run Locally

```bash
# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Frontend
cd frontend
npm run dev
```

Open `http://localhost:5173`

---

## Deployment

| Service | Platform | Notes |
|---|---|---|
| Frontend | Vercel | Connect GitHub repo, set root to `/frontend` |
| Backend | Railway | Set root to `/backend`, add env vars |
| Database | Railway PostgreSQL | Copy `DATABASE_PUBLIC_URL` to backend env |

Start command for Railway backend:
```
npx prisma migrate deploy && node server.js
```

---

## Project Structure

```
configcraft/
├── frontend/
│   ├── src/
│   │   ├── engine/
│   │   │   ├── selfHealingEngine.js    ← Core healing logic
│   │   │   ├── componentRegistry.js   ← Field type → component map
│   │   │   └── localizationEngine.js  ← i18n label resolution
│   │   ├── components/dynamic/
│   │   │   ├── DynamicForm.jsx
│   │   │   ├── DynamicTable.jsx
│   │   │   └── RuntimeWarningPanel.jsx
│   │   ├── store/                     ← Zustand stores
│   │   └── pages/
└── backend/
    ├── src/
    │   ├── engine/
    │   │   ├── selfHealingEngine.js   ← Backend healing mirror
    │   │   └── validationPipeline.js  ← Record validation
    │   ├── modules/
    │   │   ├── auth/
    │   │   ├── config/
    │   │   ├── crud/
    │   │   └── csv/
    │   └── middleware/
    └── prisma/
        └── schema.prisma
```

---

## Submission

- **Live URL:** [configcraft.vercel.app](https://your-live-url.vercel.app)
- **GitHub:** [github.com/yourusername/configcraft](https://github.com/yourusername/configcraft)
- **Loom Video:** [Watch walkthrough](https://loom.com/your-video-link)

---

*Built for the Full Stack Engineer Internship Evaluation — Track A: AI App Generator*
