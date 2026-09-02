# KARM

Civic issue reporting with a React frontend and an Express MVC backend.

## Run

```bash
pnpm install
pnpm dev
```

Frontend: `http://localhost:8443`  
Backend: `http://localhost:8787`

`DATABASE_URL` in `.env` is empty on purpose. Leave it blank to run with in-memory data. When you are ready, paste a MongoDB connection string:

```text
DATABASE_URL=mongodb://127.0.0.1:27017/karm
```

or a MongoDB Atlas URI. The backend applies Mongoose schemas and seeds sample reports if the database is empty.

Admin demo account: `admin@karm.local` / `admin123`

## Layout

- `frontend/` React UI
- `backend/src/models` schemas and types
- `backend/src/views` JSON serializers
- `backend/src/controllers` request handlers
- `backend/src/routes` HTTP routes
- `backend/src/repositories` memory or MongoDB storage
