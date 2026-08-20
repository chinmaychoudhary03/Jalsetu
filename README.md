# JJM Gram Jal O&M — Rural Water Supply Management PWA

A mobile-first Progressive Web Application for Gram Panchayat water-supply infrastructure management.

---

## Project Structure

```
jalsathi/
├── client/          ← React 18 + Vite 5 PWA (frontend)
├── server/          ← Node.js + Express API (backend)
├── docker-compose.yml
├── package.json     ← Monorepo root
└── .env.example
```

---

## Quick Start

### Prerequisites

- Node.js 18+
- Docker Desktop (for PostgreSQL + PostGIS)

### 1. Clone & Install

```bash
# Install all dependencies (both client and server)
npm install
npm install --workspace=client
npm install --workspace=server
```

### 2. Environment Variables

```bash
# Root
cp .env.example .env

# Server
cp server/.env.example server/.env
# Edit server/.env and set DATABASE_URL, JWT_SECRET, Razorpay keys

# Client (optional — defaults to localhost:3001)
cp client/.env.example client/.env
```

### 3. Start the Database

```bash
# Start PostgreSQL + PostGIS (with schema + seed data auto-loaded)
docker-compose up -d postgres
```

Wait ~10 seconds for DB to initialize, then verify:
```bash
docker logs jalsathi_db
```

### 4. Start Development Servers

**Option A — Start both together (from root):**
```bash
npm run dev
```

**Option B — Start separately:**
```bash
# Terminal 1 — Backend API (port 3001)
npm run dev:server

# Terminal 2 — React PWA (port 5173)
npm run dev:client
```

Open: **http://localhost:5173**

---

## Default Login Credentials (seed data)

| Username | Password | Role |
|----------|----------|------|
| `admin` | `password123` | GP Admin |
| `operator1` | `password123` | Operator |
| `phed1` | `password123` | PHED Official |

---

## API Endpoints

Base URL: `http://localhost:3001/api/v1`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/health` | Online/offline ping | ❌ None |
| POST | `/api/v1/auth/login` | Login, get JWT | ❌ None |
| GET | `/api/v1/auth/me` | Current user info | ✅ Required |
| GET | `/api/v1/dashboard/stats` | Dashboard summary | ✅ Required |
| GET | `/api/v1/assets` | List assets | ✅ Required |
| GET | `/api/v1/assets/geojson` | GeoJSON for map | ✅ Required |
| GET | `/api/v1/assets/:id` | Asset + history | ✅ Required |
| POST | `/api/v1/assets` | Create asset | ✅ PHED/Admin |
| GET | `/api/v1/maintenance` | List issues | ✅ Required |
| POST | `/api/v1/maintenance` | Report issue | ✅ Required |
| PUT | `/api/v1/maintenance/:id/status` | Advance status | ✅ Required |
| GET | `/api/v1/inventory` | List inventory | ✅ Required |
| POST | `/api/v1/inventory/:id/transaction` | Stock in/out | ✅ Required |
| GET | `/api/v1/finance/cashbook` | Cash book | ✅ Required |
| POST | `/api/v1/finance/receipt` | Add receipt | ✅ GP Admin |
| POST | `/api/v1/finance/expenditure` | Add expenditure | ✅ GP Admin |
| GET | `/api/v1/consumers` | Consumer list | ✅ Required |
| GET | `/api/v1/bills` | Bill list | ✅ Required |
| POST | `/api/v1/bills` | Generate bill | ✅ GP Admin |
| POST | `/api/v1/payments/create-order` | Razorpay order | ✅ Required |
| POST | `/api/v1/payments/verify` | Verify payment | ✅ Required |

---

## Offline Detection (3 Layers)

The PWA uses three layers to detect connectivity (implemented in `client/src/store/uiStore.js`):

1. **Layer 1 — Instant**: `navigator.onLine` checked on app load
2. **Layer 2 — Instant**: `window 'online'/'offline'` events
3. **Layer 3 — Reliable**: Every 30 seconds, pings `GET /api/health`. Catches captive-portal "connected but no internet" scenarios.

UI indicator: **✓ Synced** / **● Offline** / **↻ N records waiting**

Offline form submissions are queued in IndexedDB (Dexie.js) and replayed when connectivity returns.

---

## Village: Koregaon, Maharashtra

Seeded with sample data for **Koregaon Gram Panchayat** (Satara District):

- 📍 GPS Center: 17.6834°N, 74.0069°E
- 🏗️ **Assets**: 3 Pumps, 1 Treatment Plant, 8 Valves, 1 Storage Tank, 5 Pipelines
- 👥 **Consumers**: 20 sample households
- 📦 **Inventory**: 10 items (3 low stock / replenishment required)
- 💰 **Finance**: Sample receipts and expenditure records
- 🧾 **Bills**: 20 August 2026 bills (mix of paid/pending/overdue)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite 5, Tailwind CSS 3 |
| Routing | React Router v6 |
| State | Zustand |
| Data Fetching | TanStack React Query v5 |
| HTTP | Axios |
| Offline DB | Dexie.js (IndexedDB) |
| i18n | i18next + react-i18next |
| Icons | Lucide React |
| Maps | Leaflet + React Leaflet (Phase 2) |
| PWA | vite-plugin-pwa (Workbox) |
| Backend | Node.js 18, Express 4 |
| Database | PostgreSQL 15 + PostGIS 3.3 |
| Auth | JWT (jsonwebtoken + bcryptjs) |
| Payments | Razorpay |

---

## Languages Supported

- 🇬🇧 English (complete)
- 🇮🇳 Hindi (scaffolded)
- 🇮🇳 Marathi (scaffolded)

Select language in Settings screen.

---

## Build for Production

```bash
npm run build:client
# Output: client/dist/  (ready to deploy to any static host)
```

---

## Phase Roadmap

| Phase | Status | Scope |
|-------|--------|-------|
| **1** | ✅ Done | Scaffold, DB, backend API, auth, PWA base, offline detection |
| **2** | 🔜 Next | Dashboard (real data) + GIS Map (Leaflet) |
| **3** | 🔜 | Assets module (list, detail, timeline) |
| **4** | 🔜 | O&M / Maintenance module |
| **5** | 🔜 | Inventory module |
| **6** | 🔜 | Finance module (cash book) |
| **7** | 🔜 | Consumers + Billing |
| **8** | 🔜 | Payment flow (Razorpay) |
| **9** | 🔜 | Full offline queue + sync |
| **10** | 🔜 | Hindi/Marathi translations + Settings |
| **11** | 🔜 | Accessibility + rural UX polish |
