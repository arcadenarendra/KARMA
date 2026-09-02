# Development Guide

## Start the stack

```bash
pnpm install
pnpm dev
```

`pnpm dev` starts both processes. Use `pnpm run dev:frontend` or `pnpm run dev:backend` to run one process. Check `GET http://localhost:8787/api/health` when debugging connectivity.

## Add a feature

1. Decide whether the behavior is presentation, frontend state, or server data.
2. For server data, define the request and response in `docs/api.md` first.
3. Implement the backend route and repository mutation.
4. Add the typed frontend service method.
5. Connect the page or component to the service method.
6. Update the relevant README when a new folder or responsibility is introduced.
7. Run `pnpm run build` before opening a pull request.

## Troubleshooting

- Frontend cannot load reports: confirm the backend is listening on port `8787` and inspect the browser network tab.
- Port `8443` is busy: set `PORT` to another frontend port. Keep the backend proxy target at `8787` unless you also change `vite.config.ts`.
- Port `8787` is busy: set `BACKEND_PORT` and update the Vite proxy target.
- New reports disappear after restart: this is expected with the current in-memory repository; see `docs/database.md`.
- Type errors after changing an API shape: update `frontend/src/types.ts`, `frontend/src/services/api.ts`, backend types, and `docs/api.md` together.
