# VyapaarIQ — Production Deployment Guide

> **Architecture Summary**: VyapaarIQ is a two-tier application.
> - **Tier 1 (Frontend):** React + Vite SPA — deployed as a **static site** on Netlify (drag-and-drop dist/ folder).
> - **Tier 2 (Backend):** FastAPI + PostgreSQL/PostGIS — deployed on a **server-based host** (Render, Railway, Fly.io, etc.).
>
> ⚠️ **Netlify cannot run FastAPI or PostgreSQL.** Netlify hosts the frontend static files only.

---

## 1. Frontend — Netlify Deployment (Drag & Drop)

### Step 1: Set Environment Variable
Before building, create a .env file in the project root (or set it in Netlify's UI):

`env
VITE_API_BASE_URL=https://your-production-api-host.com
`

> Replace https://your-production-api-host.com with your actual FastAPI backend URL.

### Step 2: Build the Production Bundle
`powershell
npm run build
`
This produces the dist/ folder. Drag **dist/** onto Netlify.

The folder contains:
- index.html — SPA entry point
- _redirects — Netlify SPA routing (/* /index.html 200)
- ssets/ — CSS + JS bundles

### Step 3: Set Environment Variables in Netlify
Go to **Site settings → Environment variables**:
| Variable | Value |
|---|---|
| VITE_API_BASE_URL | https://your-production-api-host.com |

Then trigger a **new deploy**.

### Supported Routes
All SPA routes work via _redirects:
- /, /analyze, /analysis/:analysisId
- /how-it-works, /market, /finance, /risk, /about

---

## 2. Backend — FastAPI on Render

1. Create a Render **Web Service** pointed at your repo.
2. Set **Root Directory**: ackend, **Runtime**: Python 3.11
3. **Build Command**: pip install -r requirements.txt
4. **Start Command**: uvicorn app.main:app --host 0.0.0.0 --port \
5. Set env vars (see Section 6 below).
6. After first deploy: lembic upgrade head

**Alternatives**: Railway, Fly.io, DigitalOcean App Platform, AWS Elastic Beanstalk.

---

## 3. Database — PostgreSQL + PostGIS

VyapaarIQ requires **PostGIS** for spatial queries.

| Provider | PostGIS | Free Tier |
|---|---|---|
| Supabase | Yes (built-in) | 500 MB |
| Neon | Yes | 512 MB |
| Render Postgres | Yes | 1 GB |

After provisioning: copy connection strings → set in backend env vars → run lembic upgrade head → import Nashik pilot data from ackend/ingestion/.

---

## 4. CORS Configuration

Set ALLOWED_ORIGINS on your backend host:

| Scenario | Value |
|---|---|
| Local dev | http://localhost:5173,http://localhost:5174 |
| Production | https://your-app.netlify.app,https://vyapaariq.com |
| Open | * |

---

## 5. Local Development

`powershell
# Frontend
cp .env.example .env
npm install && npm run dev   # http://localhost:5173

# Backend (separate terminal)
cd backend
cp .env.example .env
venv\Scripts\activate
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload --port 8000
`

---

## 6. Environment Variables

### Frontend (project root .env)
| Variable | Description |
|---|---|
| VITE_API_BASE_URL | Backend API URL (no trailing slash) |

### Backend (ackend/.env)
| Variable | Description |
|---|---|
| DATABASE_URL | postgresql+asyncpg://... |
| DIRECT_DATABASE_URL | postgresql+psycopg2://... |
| ALLOWED_ORIGINS | Comma-separated CORS origins |
| SECRET_KEY | Strong random secret |
| APP_ENV | development or production |

---

## 7. Pre-Launch Verification Checklist

- [ ] 
pm run build exits code 0 (2300 modules, 0 TS errors)
- [ ] dist/_redirects contains /*    /index.html   200
- [ ] 
etlify.toml present in project root
- [ ] VITE_API_BASE_URL set in Netlify env vars
- [ ] FastAPI /health returns healthy
- [ ] CORS ALLOWED_ORIGINS includes your Netlify domain
- [ ] lembic upgrade head runs on production DB
- [ ] Nashik pilot data loaded in production PostgreSQL
- [ ] /analyze wizard completes end-to-end against real API
- [ ] /analysis/:analysisId renders Bento report
- [ ] cd backend && venv\Scripts\pytest — 24/24 passed

---

## 8. Deployment Files Created

| File | Purpose |
|---|---|
| public/_redirects | Netlify SPA route fallback |
| 
etlify.toml | Build config, SPA redirects, security headers |
| .env.example | Frontend dev env template |
| .env.production.example | Frontend production env template |
| ackend/.env.example | Backend dev env template |
| ackend/.env.production.example | Backend production env template |
| DEPLOYMENT.md | This file |
