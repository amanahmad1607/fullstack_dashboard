# Fullstack World Bank Dashboard (Django + React)

This is a sample assignment implementation for an interactive dashboard using **Django (REST API)** and **React** (Recharts) with authentication.
The data is fetched from **World Bank Open Data** indicators and rendered as charts similar to the reference screenshot.

## Features
- JWT Auth (login/logout) using Django's auth users
- Protected endpoints for KPIs and charts
- Filters: country, date range, indicator set, and year
- Line chart: time-series for a chosen indicator (default: Population)
- Bar chart: multiple indicators for a chosen year (GDP, CO2 Emissions, Internet Users %, Renewable Energy %)
- Dark UI with KPI cards and two interactive charts

## Quick Start (Dev)
### 1) Backend
```bash
cd backend
python -m venv .venv && source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser  # create a test user
python manage.py runserver 8000
```

### 2) Frontend
```bash
cd ../frontend
npm install
npm run dev  # Vite dev server on http://localhost:5173
```
Set `VITE_API_BASE=http://localhost:8000` in `.env` (frontend).

### 3) Use the App
- Visit the frontend dev URL, login with the user you created.
- The dashboard page will fetch data from the backend using the token.
- Try changing filters (country/year/indicator).

## Deploy (One simple approach)
- Backend → Render/Railway/Heroku. Set `ALLOWED_HOSTS`, `CORS_ALLOWED_ORIGINS`, and `SECRET_KEY`.
- Frontend → Netlify/Vercel. Set `VITE_API_BASE` env to your backend URL.

## API (summary)
- `POST /api/auth/login/` → {username, password} → returns JWT access/refresh
- `POST /api/auth/refresh/` → refresh → access
- `GET /api/kpis/?country=IND&start=2019&end=2024` (auth)
- `GET /api/line/?country=IND&indicator=SP.POP.TOTL&start=2019&end=2024` (auth)
- `GET /api/bars/?country=IND&year=2022` (auth)

World Bank Docs: https://data.worldbank.org/
