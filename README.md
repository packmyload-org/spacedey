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
| **Container** | Docker + Docker Compose |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+
- **pnpm** (recommended) — `npm install -g pnpm`
- **Docker & Docker Compose** (for the Postgres database)

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
# Postgres
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=admin
POSTGRES_PASSWORD=password
POSTGRES_DB=spacedey
DB_TYPE=postgres
DB_SSL=false

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

### 4. Start the database

```bash
docker-compose up -d
```

This starts a PostgreSQL instance on `localhost:5432`.

### 5. Seed default users

```bash
pnpm run seed:data
```

This creates two default accounts:

| Role | Email | Password |
|---|---|---|
| Admin | `admin@spacedey.com` | `admin123456` |
| User | `user@spacedey.com` | `user123456` |

> ⚠️ **Change these passwords before deploying to production!**

### 6. Start the development server

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
| `pnpm seed:data` | Seed the database with default users |

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
│   ├── ADMIN_PORTAL.md   # Admin dashboard & API reference
│   └── DOCKER_SETUP.md   # Docker & database setup guide
├── docker-compose.yml    # Local Postgres service
├── Dockerfile            # Production container definition
└── .env.example          # Environment variable template
```

---

## 📚 Documentation

| Document | Description |
|---|---|
| [Admin Portal Guide](./docs/ADMIN_PORTAL.md) | Role-based access, admin API endpoints, frontend usage, security checklist |
| [Docker & Postgres Setup](./docs/DOCKER_SETUP.md) | Full Docker setup, environment variables, deployment, troubleshooting |

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

## 🐳 Docker Quick Reference

```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f app
docker-compose logs -f postgres

# Open a Postgres shell
docker-compose exec postgres psql -U admin -d spacedey

# Stop services
docker-compose down
```

> See [docs/DOCKER_SETUP.md](./docs/DOCKER_SETUP.md) for the full guide including production deployment.

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
