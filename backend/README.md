# KARM Backend

MVC Express API.

- `models/` MongoDB/Mongoose schemas, domain types, seed data
- `views/` JSON response shapes
- `controllers/` auth and report handlers
- `routes/` `/api/auth` and `/api/reports`
- `repositories/` in-memory store, or MongoDB when `DATABASE_URL` is set

Leave `DATABASE_URL` empty until MongoDB is available. Seed admin: `admin@karm.local` / `admin123`.
