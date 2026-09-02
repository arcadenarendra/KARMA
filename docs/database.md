# Data storage

Leave `DATABASE_URL` empty to use the in-memory store. Paste a MongoDB URI later to persist data.

## Collections (Mongoose)

- `users` — name, email, passwordHash, role (`citizen` | `admin`), location
- `reports` — title, description, category, location, status, reporter, image, verified, upvotes, timestamps
- `comments` — reportId, author, text
- `timelineevents` — reportId, label, detail, timestamp
- `votes` — unique `{ reportId, userId }`

Schemas live in `backend/src/models/mongoSchemas.ts`.

For the manual Atlas setup and deployment checklist, see
[mongodb-atlas.md](mongodb-atlas.md).
