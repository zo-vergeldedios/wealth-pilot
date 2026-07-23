# WealthPilot 💰

A personal finance dashboard MVP. Track your net worth, log expenses, and set
savings goals — with a clean, real-fintech-product feel.

Built as a portfolio piece to demonstrate full-stack development: database
design, a REST API, full CRUD, data visualization, and cloud deployment.

## Tech stack

| Layer     | Technology                          |
| --------- | ----------------------------------- |
| Frontend  | React + React Router + Recharts + plain CSS (Vite) |
| Backend   | Node.js + Express (REST API)        |
| Database  | Supabase (PostgreSQL)               |
| Hosting   | Vercel (frontend) · Render (backend) · Supabase (database) |

## Features

- **Dashboard** — summary cards (net worth, income, expenses, savings rate,
  investments, debt), a spending chart, and recent transactions. Monthly income
  and the savings rate are driven by the income you log.
- **Expense tracker** — full CRUD, a spending-breakdown donut chart, and a
  transactions table.
- **Income tracker** — full CRUD, an income-by-source donut chart, and an
  entries table; new income flows straight through to the dashboard.
- **Financial goals** — create goals, track progress with completion bars, and
  update or delete them.

> **Auth note:** This MVP uses a single fixed demo user (see
> `server/config/constants.js`). Every table keeps a `user_id` column, so real
> authentication (e.g. Supabase Auth) can be dropped in later without a schema
> change.

## Project structure

```
wealthpilot/
├── client/                 # React frontend
│   └── src/
│       ├── components/      # Reusable UI (cards, charts, forms, table, modal)
│       ├── pages/           # Dashboard, Expenses, Income, Goals
│       ├── services/        # api.js — all fetch calls in one place
│       ├── utils/           # formatting + shared constants
│       ├── styles/          # global.css
│       ├── App.jsx          # routes + layout
│       └── main.jsx         # entry point
└── server/                 # Express REST API
    ├── config/              # Supabase client + constants
    ├── controllers/         # request handlers (business logic)
    ├── routes/              # route definitions
    ├── db/                  # schema.sql + seed.sql
    └── index.js             # server entry point
```

## Getting started (local)

### 1. Set up the database (Supabase)

1. Create a free project at [supabase.com](https://supabase.com).
2. Open **SQL Editor** and run `server/db/schema.sql`.
3. Then run `server/db/seed.sql` to load realistic demo data.
4. From **Project Settings → API**, copy your **Project URL** and the
   **`service_role`** key (used only on the server).

### 2. Run the backend

```bash
cd server
npm install
cp .env.example .env      # then fill in SUPABASE_URL and SUPABASE_SERVICE_KEY
npm run dev               # starts on http://localhost:4000
```

### 3. Run the frontend

```bash
cd client
npm install
cp .env.example .env      # VITE_API_URL defaults to http://localhost:4000
npm run dev               # starts on http://localhost:5173
```

Open http://localhost:5173.

## API reference

Base URL: `/api`

| Method | Endpoint         | Description              |
| ------ | ---------------- | ------------------------ |
| GET    | `/profile`       | Get the financial profile |
| PUT    | `/profile`       | Update the profile        |
| GET    | `/expenses`      | List expenses             |
| POST   | `/expenses`      | Create an expense         |
| PUT    | `/expenses/:id`  | Update an expense         |
| DELETE | `/expenses/:id`  | Delete an expense         |
| GET    | `/income`        | List income               |
| POST   | `/income`        | Create an income entry    |
| PUT    | `/income/:id`    | Update an income entry    |
| DELETE | `/income/:id`    | Delete an income entry    |
| GET    | `/goals`         | List goals                |
| POST   | `/goals`         | Create a goal             |
| PUT    | `/goals/:id`     | Update a goal             |
| DELETE | `/goals/:id`     | Delete a goal             |

## Deployment

### Database — Supabase

Already live once you run `schema.sql` + `seed.sql` (see above).

### Backend — Render

1. New → **Web Service**, connect your repo, set **Root Directory** to `server`.
2. Build command `npm install`, start command `npm start`.
3. Add environment variables: `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, and
   `CLIENT_URL` (your Vercel URL). `PORT` is provided by Render automatically.
   (Or use the included `server/render.yaml` blueprint.)

### Frontend — Vercel

1. New Project, connect your repo, set **Root Directory** to `client`.
2. Framework preset: **Vite** (build `npm run build`, output `dist`).
3. Add environment variable `VITE_API_URL` = your Render backend URL.
4. `client/vercel.json` handles SPA routing so refreshing `/expenses` works.

## Notes for reviewers

- The API keeps logic in **controllers** and wiring in **routes** — a small,
  conventional Express layout that's easy to extend.
- The frontend keeps every network call in **`services/api.js`**, so components
  stay focused on rendering.
- Chart colors use a fixed, colorblind-safe per-category palette; identity is
  always reinforced with axis labels or a legend, never color alone.
