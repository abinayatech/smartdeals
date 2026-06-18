# Smart Deal

**AI-Powered Retail Intelligence Platform** — a full-stack demo application for smart shopping, deal discovery, and savings optimization across Indian retail.

Built as a Final Year Project portfolio piece demonstrating modern React architecture, offline-first data patterns, and production-grade UX without external backends.

![Smart Deal](docs/screenshots/placeholder.svg)

## Live Demo

Run locally — fully offline, no API keys required.

```bash
npm install
npm run dev
```

Open [http://localhost:8080](http://localhost:8080)

### Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@smartdeal.com` | `Admin@123` |
| User | `demo@smartdeal.com` | `Demo@123` |
| Dealer | `dealer@smartdeal.com` | `Dealer@123` |

## Features

- **1,500 products**, 150 stores, 150 categories, 1,000 deals — seeded mock catalog
- **10,000 reviews**, 500 orders, 500 users, 200 notifications
- **Simulated full-stack** — API → Service → Repository → localStorage
- **Per-user isolation** — cart, favorites, orders, activity scoped by account
- **Authentication** — signup validation, session/refresh tokens, remember me, roles
- **E-commerce** — cart, wishlist collections, checkout, mock payments, order tracking
- **AI Planner** — budget planning, price predictions, savings forecast (mock AI)
- **Deal Map** — OpenStreetMap + React Leaflet with markers, filters, nearby stores
- **Dashboard** — insights, achievements, activity tracking, personalized recommendations
- **Admin** — analytics, CRUD, search, pagination + `/admin/database` viewer
- **Product comparison** — side-by-side compare up to 3 products
- **Price history** — 7/30/90 day charts on product pages

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | TanStack Start (SSR) + TanStack Router |
| UI | React 19, Tailwind CSS v4, shadcn/ui |
| Charts | Recharts |
| Maps | OpenStreetMap + React Leaflet |
| State | React Context (`store/`) + per-user localStorage |
| Data | Seeded generator + repository + service layers |

## Architecture

```
src/
├── api/            # Mock API layer (200–800ms delay)
├── services/       # Domain services (cart, auth, insights, …)
├── repositories/   # Data access wrappers
├── models/         # TypeScript entity models
├── validators/     # Zod auth validation
├── middleware/     # Auth middleware simulation
├── store/          # AppStore (cart, favorites sync)
├── hooks/          # useCart, recommendations, debounce
├── components/     # Layout, map, deals, common UI
├── routes/         # 28+ file-based routes
├── utils/          # Storage helpers, user context
└── lib/            # Legacy re-exports + data generator
```

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md), [docs/SYSTEM_DESIGN.md](docs/SYSTEM_DESIGN.md), [docs/DATABASE_SCHEMA.md](docs/DATABASE_SCHEMA.md), and [docs/API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md).

## Demo Walkthrough

1. **Browse** — Home → Products → filter/sort/paginate
2. **Compare** — Product detail → Compare → `/compare`
3. **Shop** — Add to cart → Checkout → mock payment → Order tracking
4. **AI** — AI Planner → activate plans, view savings forecast
5. **Admin** — Sign in as admin → Analytics + catalog management → Database Viewer

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run lint` | ESLint |

## Data & Privacy

All data is stored in **browser localStorage**. No external APIs, no real payments, no cloud services. Suitable for demos, viva, and college exhibitions.

## License

MIT — portfolio / educational use.
