# Spacedey 🗃️

> **Find, compare, and book storage units across Nigeria — simple, fast, and secure.**

Spacedey is a full-stack web platform that connects individuals and businesses with storage facilities in Nigerian cities. From unit-size guides and interactive maps to seamless bookings and an integrated packing supplies store — everything you need is in one place.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🗺️ **Location Search** | Map-based search (Google Maps) to discover storage units in Lagos, Abuja, and more |
| 📐 **Unit Sizing Guides** | Visual size comparisons to help users pick the right unit |
| 📅 **Booking** | Streamlined reservation and checkout flow |
| 🛒 **Products Store** | Integrated store for moving and packing supplies |
| 🔗 **Referral Program** | Reward system for user referrals |
| 🔐 **Role-Based Auth** | JWT-secured authentication with `admin` and `user` roles |
| 🛡️ **Admin Dashboard** | Full user management — create, edit, and delete users at `/admin` |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router + Turbopack) |
| **Language** | TypeScript |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) |
| **Animations** | [Framer Motion](https://www.framer.com/motion/) |
| **Database** | PostgreSQL via [TypeORM](https://typeorm.io/) |
| **State Management** | [Zustand](https://zustand-demo.pmnd.rs/) |
| **Auth** | JWT (`jsonwebtoken` + `bcryptjs`) |
| **Maps** | Google Maps API (`@vis.gl/react-google-maps`) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Container** | Optional Docker + Docker Compose |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+
- **pnpm** (recommended) — `npm install -g pnpm`
- **Docker & Docker Compose** (optional, only if you want local Postgres in a container)

### 1. Clone the repository

```bash
git clone <repository-url>
cd spacedey
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Configure environment variables

```bash
cp .env.example .env.local
```

Then edit `.env.local` with your values:

```env
DATABASE_URL=postgresql://...
DIRECT_DATABASE_URL=postgresql://...
DB_USE_DIRECT_URL=false
DB_SSL=true
DB_SSL_REJECT_UNAUTHORIZED=false

# Auth
JWT_SECRET=your-secure-secret-key
PASSWORD_SALT=your-salt-value
TOKEN_SECRET=your-token-secret

# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key

# App
NODE_ENV=development
PORT=3000
```

### 4. Connect a database

If you are using Supabase, set `DATABASE_URL` and `DIRECT_DATABASE_URL` first.

If you prefer a local database, start a Postgres 15 instance however you normally manage local services, then point `.env.local` at it with `DATABASE_URL` and `DIRECT_DATABASE_URL`.

### 5. Run migrations

Create the schema first:

```bash
pnpm db:migrate
```

If you already have a database that was built with `synchronize`, baseline the initial migration once before switching to the migration flow:

```bash
pnpm db:baseline
```

### 6. Seed baseline data

```bash
pnpm run seed:data
```

For a local Postgres instance, `pnpm run seed:data` is also fine.

This creates two default accounts:

| Role | Email | Password |
|---|---|---|
| Admin | `admin@spacedey.com` | `admin123456` |
| User | `user@spacedey.com` | `user123456` |

> ⚠️ **Change these passwords before deploying to production!**

### 7. Start the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📜 Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Development server with Turbopack |
| `pnpm build` | Production build |
| `pnpm start` | Start the production server |
| `pnpm lint` | Run ESLint |
| `pnpm db:migrate` | Run pending TypeORM migrations |
| `pnpm db:migrate:revert` | Revert the most recent migration |
| `pnpm db:migrate:show` | List applied and pending migrations |
| `pnpm db:baseline` | Mark the initial migration as applied on an existing DB |
| `pnpm db:setup` | Run migrations, then seed baseline data |
| `pnpm seed:data` | Seed baseline users, sites, unit types, and inventory |

---

## 📁 Project Structure

```
spacedey/
├── app/                  # Next.js App Router (pages, layouts, API routes)
│   ├── api/              # API route handlers (auth, admin, sites)
│   ├── admin/            # Admin dashboard (protected)
│   └── auth/             # Sign in / Sign up pages
├── components/           # Reusable UI components
├── lib/                  # Utilities, TypeORM config, auth helpers, Zustand stores
├── config/               # App-wide configuration
├── contexts/             # React context providers
├── scripts/              # One-off scripts (e.g. DB seeding)
├── public/               # Static assets
├── docs/                 # Project documentation
│   └── ADMIN_PORTAL.md   # Admin dashboard & API reference
└── .env.example          # Environment variable template
```

---

## 📚 Documentation

| Document | Description |
|---|---|
| [Admin Portal Guide](./docs/ADMIN_PORTAL.md) | Role-based access, admin API endpoints, frontend usage, security checklist |
| [Supabase + Vercel DB Setup](./docs/SUPABASE_VERCEL.md) | Managed Postgres setup using Supabase with Vercel-friendly env vars |
| [Database Workflow](./docs/DATABASE_WORKFLOW.md) | Migrations, baselining, and seeding guidance |

---

## 🔌 API Overview

### Auth

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/signup` | Register a new user |
| `POST` | `/api/auth/login` | Sign in and receive a JWT |
| `POST` | `/api/auth/forgot-password` | Request a password reset |
| `POST` | `/api/auth/reset-password` | Complete a password reset |

### Storage

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/sites` | List all storage sites and unit types |

### Admin _(requires admin JWT)_

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/admin/users` | List all users |
| `POST` | `/api/admin/users` | Create a new user |
| `GET` | `/api/admin/users/:id` | Get a single user |
| `PATCH` | `/api/admin/users/:id` | Update a user |
| `DELETE` | `/api/admin/users/:id` | Delete a user |

> See [docs/ADMIN_PORTAL.md](./docs/ADMIN_PORTAL.md) for full request/response examples.

---

## 🔒 Security

- Passwords hashed with **bcryptjs** (10 salt rounds)
- Auth via **JWT** tokens (7-day expiry)
- All admin routes verify role server-side
- Admins cannot delete their own account
- `.env.local` is gitignored — never commit secrets

---

## 🗺️ Roadmap

- [ ] Email verification for new accounts
- [ ] Two-factor authentication (2FA)
- [ ] Password reset email flow
- [ ] User activity logging & audit trail
- [ ] Role-based permission customization
- [ ] User groups / organizations
- [ ] Email notifications

---

## 📄 License

Private — all rights reserved © Spacedey.
