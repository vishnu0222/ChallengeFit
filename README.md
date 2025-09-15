# Fitness Challenges & Workouts API (NestJS + Prisma)

A production-style backend for managing users, fitness challenges, and structured workout plans (plans → splits → exercises). Built with **NestJS**, **Prisma** (PostgreSQL), and **JWT** auth.

## Highlights

* Modular architecture: `auth`, `user`, `challenge`, `workout`, `prisma`
* Workout domain split into focused controllers/services: **plans**, **splits**, **exercises**
* JWT authentication with route guards
* Typed ORM via Prisma schema & migrations
* DTO validation with Nest pipes
* *(Optional)* file upload for challenge image (`image` field, multipart)
  
## Architecture Overview
### High-Level Request Flow
<img width="3840" height="402" alt="Untitled diagram _ Mermaid Chart-2025-09-07-001354" src="https://github.com/user-attachments/assets/30098f29-7626-4b67-9c70-1d45ac840467" />

### Module Architecture & Responsibilities
* Auth: Sign-up, sign-in (argon2 hashing, JWT issuance)
* User: Profile read/update, challenge lists for a user
* Challenge: Create/update/delete, join/leave, list views (active/upcoming/completed)
* Workout: Workout plans, splits, and exercises (in distinct controllers/services)
* Prisma: Centralized DB client provider
<img width="3840" height="1524" alt="Untitled diagram _ Mermaid Chart-2025-09-07-001044" src="https://github.com/user-attachments/assets/57131c28-e899-4046-9d28-de85c3f62014" />
  
## Data Model (Prisma)
<img width="1050" height="1900" alt="Untitled diagram _ Mermaid Chart-2025-09-07-001146" src="https://github.com/user-attachments/assets/51c74a4d-bbef-4e41-8949-d2877e70f898" />

## 🚀 Quickstart

### 1) Prerequisites
- Node 18+
- PostgreSQL 14+

### 2) Configure environment
Create a `.env` in the project root


### 2) Install & set up DB
```bash
npm install
npx prisma generate
npx prisma migrate dev --name init
```

### 3) Run
```bash
npm run start:dev
# http://localhost:3000
```

## Security
* JWT bearer auth for protected routes
* Hashing for passwords (e.g., argon2/bcrypt in the Auth service)
* Validation pipe rejects unexpected payload fields (whitelisting & transformation)
* File uploads (challenge image) are handled via interceptors; only image field is accepted

## Database & Migrations
* Generate client after schema changes: npx prisma generate
* Create migration (dev): npx prisma migrate dev --name 
* Apply in prod: npx prisma migrate deploy
* Inspect schema & data: npx prisma studio


