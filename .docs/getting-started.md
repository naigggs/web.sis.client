# Getting Started

This guide walks through setting up the EduNest SIS client for local development.

---

## Prerequisites

| Tool                          | Minimum Version | Purpose                         |
| ----------------------------- | --------------- | ------------------------------- |
| [Node.js](https://nodejs.org) | 20+             | JavaScript runtime              |
| [Bun](https://bun.sh)         | 1.x             | Package manager & script runner |
| Git                           | Any             | Version control                 |
| **SIS Backend**               | Running         | API server (Fastify / NestJS)   |

---

## Installation

```bash
# Clone the repository
git clone <repo-url>
cd sis-client

# Install dependencies
bun install
```

---

## Environment Variables

Create a `.env.local` file in the project root. The configuration is environment-aware — the client selects the correct API URL based on the active environment.

```env
# Which environment to use: development | staging | production
NEXT_PUBLIC_ENVIRONMENT=development

# API URLs per environment
NEXT_PUBLIC_DEV_SERVICE_API_URL=http://localhost:3000
NEXT_PUBLIC_STAGING_SERVICE_API_URL=https://staging-api.edunest.example
NEXT_PUBLIC_PROD_SERVICE_API_URL=https://api.edunest.example
```

### How it works

The resolution logic lives in `config/constants.ts`:

```
ENVIRONMENT = NEXT_PUBLIC_ENVIRONMENT || NODE_ENV || "development"

API_URL = production  → PROD URL
          staging     → STAGING URL
          otherwise   → DEV URL
```

Helper predicates `isDevelopment()`, `isStaging()`, and `isProduction()` are exported for conditional logic elsewhere in the app.

---

## Running the Dev Server

```bash
bun run dev
```

The server starts on **port 4000** (`next dev -p 4000`).

Open [http://localhost:4000](http://localhost:4000) in your browser. The root path `/` redirects to:

- `/dashboard` for admin users
- `/grades` for staff users
- `/enrollment` for student users
- `/login` if unauthenticated

---

## Building for Production

```bash
bun run build
```

This runs `next build` with the default Turbopack pipeline.

---

## Linting

```bash
bun run lint
```

Uses ESLint 9 with `eslint-config-next`.

---

## Seed Data

The backend should be seeded before using the client. Expected seed data:

| Entity             | Count    | Notes                           |
| ------------------ | -------- | ------------------------------- |
| Admin user         | 1        | `admin@edunest.edu`             |
| Courses            | 3–5      | Distributed subjects            |
| Subjects           | 8–15     | Assigned to courses             |
| Prerequisite links | ≥ 5      | For testable prerequisite logic |
| Students           | 50       | Assigned to courses             |
| Reservations       | Optional | For testing reservation flow    |
| Grades             | Optional | For testing grading sheet       |

---

## Next Steps

- [Architecture](.docs/architecture.md) — Understand the app structure
- [Authentication](.docs/authentication.md) — How login, session, and route protection work
- [Role-Based Access](.docs/role-based-access.md) — What each role can see and do
