# KARM Deployment Guide

This guide explains how to deploy KARM as two independently deployable applications:

- Frontend: React, Vite, and Tailwind CSS
- Backend: Node.js HTTP API
- API connection: JSON REST requests under `/api`

The `frontend/` and `backend/` directories each contain their own package manifest.
They can be copied to separate hosting projects. The root scripts remain available
for convenient local development.

## 1. Production prerequisites

Install these on the build/deployment machine:

- Node.js 20 or newer
- pnpm 9 or newer
- Git
- A process manager such as PM2, systemd, or the hosting provider's process manager
- A reverse proxy such as Nginx or a managed HTTPS proxy

Verify the tools:

```bash
node --version
pnpm --version
```

## 2. Get the project

```bash
git clone <repository-url> karma
cd karma
pnpm install --frozen-lockfile
```

For local development, copy the complete repository, including:

- `frontend/`
- `backend/`
- `docs/`
- `package.json`
- `pnpm-lock.yaml`
- `vite.config.ts`
- `tsconfig.json`

Do not copy `node_modules`; install dependencies on the deployment machine.

For separate deployments, use one of these source directories instead:

```text
frontend/  -> static frontend hosting
backend/   -> Node.js API hosting
```

Install and build each application from its own directory:

```bash
cd frontend
pnpm install --frozen-lockfile
pnpm run build

cd ../backend
pnpm install --frozen-lockfile
pnpm run build
```

If no lockfile is present in the copied directory, use `pnpm install` on the
first deployment and commit the generated lockfile for reproducible builds.

## 3. Configure environment variables

### Backend

The backend reads:

```text
BACKEND_PORT=8787
FRONTEND_ORIGIN=https://karm.example.com
```

The default is `8787`, so this variable is optional when the reverse proxy forwards to that port.
Set `FRONTEND_ORIGIN` to the exact public frontend origin when the API is hosted
on a different domain. Leave it empty only for local development.

### Frontend

The frontend reads `VITE_API_BASE_URL` at build time:

```text
VITE_API_BASE_URL=/api
```

Use `/api` when the frontend and API share one public domain, for example:

```text
https://karm.example.com
https://karm.example.com/api/health
```

Use a full URL only when the API is hosted separately:

```text
VITE_API_BASE_URL=https://api.karm.example.com/api
```

Vite only exposes variables beginning with `VITE_` to browser code. Never put database passwords, private keys, or other secrets in frontend environment variables.

## 4. Build the application

Run the complete build:

```bash
pnpm run build
```

This creates:

```text
frontend/dist/       Static frontend files
backend/dist/        Compiled backend JavaScript
```

You can also build each side independently:

```bash
pnpm run build:frontend
pnpm run build:backend
```

For a separate API hostname, set `VITE_API_BASE_URL` before the frontend build.

Linux/macOS:

```bash
VITE_API_BASE_URL=https://api.karm.example.com/api pnpm run build:frontend
```

PowerShell:

```powershell
$env:VITE_API_BASE_URL = "https://api.karm.example.com/api"
pnpm run build:frontend
```

## 5. Start the production backend

The compiled backend is an ES module. Start it from the repository root:

```bash
node backend/dist/server.js
```

For another port:

Linux/macOS:

```bash
BACKEND_PORT=9000 node backend/dist/server.js
```

PowerShell:

```powershell
$env:BACKEND_PORT = "9000"
node backend/dist/server.js
```

The server listens on `0.0.0.0`, which allows a reverse proxy or container to reach it.

## 6. Serve the frontend

The frontend build is static. Deploy the contents of `frontend/dist` to any static host such as Nginx, Netlify, Vercel, Cloudflare Pages, or an object-storage website.

For a quick production preview on the deployment machine:

```bash
pnpm run preview
```

`vite preview` is useful for verification, but it is not recommended as the permanent production web server. Use the hosting provider's static server or Nginx instead.

## 7. Recommended single-server layout

A simple production layout is:

```text
Internet
  |
  | HTTPS
  v
Nginx :443
  |-- /             -> /var/www/karm/frontend/dist
  |-- /api/         -> http://127.0.0.1:8787
  '-- /api/health   -> backend health endpoint
```

Example Nginx configuration:

```nginx
server {
    listen 80;
    server_name karm.example.com;

    root /var/www/karm/frontend/dist;
    index index.html;

    location /api/ {
        proxy_pass http://127.0.0.1:8787;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

Use an HTTPS certificate, for example with Let's Encrypt and Certbot, before exposing the application publicly.

## 8. Keep the backend running

For a small VPS, PM2 is a straightforward option:

```bash
pnpm add --global pm2
pm2 start backend/dist/server.js --name karm-api
pm2 save
pm2 startup
```

After a new deployment:

```bash
pnpm install --frozen-lockfile
pnpm run build
pm2 restart karm-api
```

Use your hosting provider's native process manager instead when deploying to Render, Railway, Fly.io, Docker, or Kubernetes.

## 9. Deployment health checks

After starting the backend:

```bash
curl http://127.0.0.1:8787/api/health
```

Expected response:

```json
{"status":"ok"}
```

Check the report endpoint:

```bash
curl http://127.0.0.1:8787/api/reports
```

Then open the public frontend URL and verify:

1. The home feed loads reports.
2. Opening an issue loads its details.
3. Upvoting changes the count.
4. A new report appears after submission.
5. Resolving a report changes its status.
6. Browser developer tools show successful `/api/*` requests.

## 10. Important production limitations

### In-memory data

When `DATABASE_URL` is empty, reports are stored by the in-memory repository. All
new reports, upvotes, and status changes are lost when the backend restarts. Do
not treat this storage as production-ready.

Before launch, replace it with a database repository. See [docs/database.md](docs/database.md) for the proposed tables and migration approach.

### CORS

The backend allows all origins when `FRONTEND_ORIGIN` is empty for local
development. Before production, set `FRONTEND_ORIGIN` to the real frontend
origin when the frontend and backend use different domains.

### Authentication

The current authentication context is demo-only. Add real authentication, authorization, password handling, session or token expiry, and protected server-side mutation checks before public deployment.

### File uploads

The current report form selects files in the browser but does not upload them to the backend. Add object storage, upload limits, MIME validation, malware scanning, and EXIF removal before enabling real evidence uploads.

## 11. Updating and rolling back

For an update:

```bash
git pull
pnpm install --frozen-lockfile
pnpm run build
pm2 restart karm-api
```

Keep the previous `frontend/dist` and `backend/dist` artifacts until the new health checks pass. If the new version fails, restore the previous artifacts and restart the backend process.

## 12. Deployment checklist

- [ ] Node.js and pnpm versions are installed.
- [ ] Dependencies installed with `pnpm install --frozen-lockfile`.
- [ ] `pnpm run build` succeeds.
- [ ] `VITE_API_BASE_URL` is correct before building the frontend.
- [ ] Backend process manager is configured.
- [ ] Frontend static files are served from `frontend/dist`.
- [ ] `/api` is routed to the backend.
- [ ] HTTPS is enabled.
- [ ] `/api/health` returns `{ "status": "ok" }`.
- [ ] Database persistence is configured before accepting real reports.
- [ ] CORS and authentication are restricted for production.
- [ ] Logs and backups are configured.
