# KARM - Technology Stack and Implementation Details

## 1. Project overview

KARM is a civic issue reporting platform. Users can browse public reports, submit issues, upvote reports, add comments, track status changes, and resolve issues. Administrators can update report statuses through the admin dashboard.

The project is split into:

- `frontend/`: React single-page application
- `backend/`: Express API and data-access layer
- MongoDB: optional persistent database
- In-memory storage: default fallback for local development when no database URL is configured

## 2. Technology stack

### Frontend

- React 19
- TypeScript 5.7+
- Vite 8
- Tailwind CSS 4
- `@vitejs/plugin-react`
- `@tailwindcss/vite`
- Inter font from Google Fonts
- Browser `fetch` API for backend requests
- `localStorage` for the client-side auth token

### Backend

- Node.js with ECMAScript modules
- Express 5
- TypeScript 5.7+
- `tsx` for running TypeScript during development
- CORS middleware
- `dotenv` for environment variables
- Mongoose 8 for MongoDB access
- Node.js `crypto` module for password hashing and token signing

### Development tools

- pnpm
- Concurrently for running frontend and backend together
- Oxfmt for formatting
- TypeScript compiler for production builds

## 3. Running the project

Install dependencies:

```bash
pnpm install
```

Start the frontend and backend together:

```bash
pnpm dev
```

Default development URLs:

- Frontend: `http://localhost:8443`
- Backend: `http://localhost:8787`
- API base path: `http://localhost:8787/api`

Build both applications:

```bash
pnpm build
```

Run only the frontend:

```bash
pnpm run dev:frontend
```

Run only the backend:

```bash
pnpm run dev:backend
```

Format the project:

```bash
pnpm format
```

## 4. Login and registration implementation

KARM uses its own backend authentication system:

- Login method: email and password
- Registration method: name, email, password, and optional location
- No Firebase, Supabase, Google OAuth, or other third-party login provider is used
- New accounts receive the `citizen` role
- The seeded demo account has the `admin` role

### Login flow

1. The user enters an email address and password on the Login page.
2. The frontend sends:

   ```http
   POST /api/auth/login
   Content-Type: application/json
   ```

   Request body:

   ```json
   {
     "email": "user@example.com",
     "password": "your-password"
   }
   ```

3. The backend normalizes the email to lowercase and finds the user by email.
4. The submitted password is checked against the stored password hash.
5. On success, the backend returns a signed token and a public user object.
6. The frontend stores the token in `localStorage` under `karm_token`.
7. Future API requests send the token as:

   ```http
   Authorization: Bearer <token>
   ```

8. On application startup, the frontend calls `GET /api/auth/me` when a stored token exists.
9. If the token is invalid or expired, it is removed and the user is signed out.

### Registration flow

Registration uses:

```http
POST /api/auth/register
Content-Type: application/json
```

Request body:

```json
{
  "name": "Example User",
  "email": "user@example.com",
  "password": "minimum-six-characters",
  "location": "Ahmedabad"
}
```

Requirements:

- Name is required
- Email is required
- Password must be at least 6 characters
- Email addresses must be unique
- Password confirmation is checked in the frontend

Successful registration logs the user in immediately by storing the returned token.

### Password security

Passwords are never stored as plain text. The backend uses:

- Node.js `crypto.scrypt`
- A random 16-byte salt per password
- A 64-byte derived key
- Constant-time comparison with `timingSafeEqual`

The stored format is:

```text
salt:derived-hash
```

### Token security

The application uses a custom signed token rather than a JWT library. The token contains:

- User ID
- User role
- Expiration timestamp

The payload is base64url encoded and signed with HMAC-SHA256 using `JWT_SECRET`. Tokens expire after 7 days. The backend verifies both the signature and expiration before accepting a token.

> The token is called an auth token in the code. Although the environment variable is named `JWT_SECRET`, this implementation is a custom HMAC-signed token and is not a standard JWT.

### Demo admin login

Use this seeded local-development account:

```text
Email: admin@karm.local
Password: admin123
Role: admin
```

Do not use this demo password in production. Change or remove the seed account before deploying a real application.

## 5. Authentication authorization rules

The backend supports two roles:

- `citizen`: normal registered user
- `admin`: administrative user

Route protection:

| Capability | Access |
|---|---|
| View reports and statistics | Public |
| Register and log in | Public |
| Submit a report | Public; anonymous submission is supported |
| Upvote a report | Signed-in user |
| Comment on a report | Signed-in user |
| Resolve own report | Report owner |
| Resolve any report | Admin |
| Update report status | Admin |
| Get current user profile | Signed-in user |

Unauthorized requests return HTTP `401`. Authenticated users without the required role return HTTP `403`.

## 6. API routes

All routes are mounted below `/api`.

### Health and authentication

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/health` | Check backend health |
| `POST` | `/auth/register` | Create a citizen account |
| `POST` | `/auth/login` | Authenticate with email and password |
| `GET` | `/auth/me` | Return the current signed-in user |

### Reports

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/reports` | List reports |
| `GET` | `/reports/stats` | Return report statistics |
| `GET` | `/reports/:id` | Get one report |
| `POST` | `/reports` | Submit a report |
| `POST` | `/reports/:id/upvote` | Add one user upvote |
| `POST` | `/reports/:id/resolve` | Resolve a report |
| `PATCH` | `/reports/:id/status` | Update status; admin only |
| `POST` | `/reports/:id/comments` | Add a comment |

## 7. Data storage

The backend uses a repository abstraction so the application can run with either storage mode.

### In-memory mode

In-memory mode is used when `DATABASE_URL` is empty. It is useful for demos and local development, but all data is lost when the backend restarts.

The memory store seeds:

- The demo admin account
- Sample reports
- Sample comments
- Sample timeline events

### MongoDB mode

MongoDB is enabled when `DATABASE_URL` is set. Mongoose models are defined for:

- Users
- Reports
- Comments
- Timeline events
- Votes

The MongoDB store seeds the demo data only when the reports collection is empty.

Vote records have a unique compound index on `reportId` and `userId`, preventing the same user from voting for the same report more than once.

## 8. Environment variables

Environment variables can be placed in the project root `.env` or in `backend/.env`.

```env
DATABASE_URL=
BACKEND_PORT=8787
JWT_SECRET=replace-with-a-long-random-secret
FRONTEND_ORIGIN=http://localhost:8443
```

Variable details:

- `DATABASE_URL`: MongoDB connection string. Leave empty to use memory storage.
- `BACKEND_PORT`: Port used by the Express backend. Defaults to `8787`.
- `JWT_SECRET`: Secret used to sign and verify auth tokens. The default development fallback must not be used in production.
- `FRONTEND_ORIGIN`: Allowed frontend origin for CORS. If empty, the current backend configuration allows all origins.
- `VITE_API_BASE_URL`: Optional frontend API base URL. Defaults to `/api`.
- `VITE_DEV_API_PROXY`: Optional Vite development proxy target. Defaults to `http://localhost:8787`.

Never commit real database credentials or production secrets to source control.

## 9. Frontend structure

Important frontend areas:

- `src/App.tsx`: page selection and application shell
- `src/context/AuthContext.tsx`: login, registration, logout, and session restoration
- `src/services/api.ts`: typed API client and bearer-token handling
- `src/pages/Login.tsx`: login form
- `src/pages/Register.tsx`: registration form
- `src/pages/AdminDashboard.tsx`: administrator interface
- `src/pages/ReportProblem.tsx`: report submission form
- `src/pages/ProblemDetails.tsx`: report details, comments, voting, and resolution
- `src/components/`: shared navigation, footer, cards, badges, and timer components
- `src/types.ts`: frontend domain types
- `src/index.css`: global styles, design tokens, and Tailwind import

The frontend uses a lightweight page state in `App.tsx` instead of a dedicated routing package.

## 10. Backend structure

Important backend areas:

- `src/server.ts`: Express application setup and startup
- `src/config/env.ts`: environment loading and configuration
- `src/routes/`: HTTP route definitions
- `src/controllers/`: request handlers and validation
- `src/middleware/auth.ts`: optional auth parsing and protected-route guards
- `src/models/authToken.ts`: token creation and verification
- `src/models/helpers.ts`: password hashing and shared helpers
- `src/models/mongoSchemas.ts`: Mongoose schemas and indexes
- `src/models/seedData.ts`: sample reports and timeline data
- `src/repositories/`: memory and MongoDB storage implementations
- `src/views/serializers.ts`: conversion of internal records to public API responses

## 11. Report features

Reports support:

- Title and description
- Category: Healthcare, Education, Municipal, Public Safety, Infrastructure, or Other
- Location
- Optional image URL
- Anonymous or identified reporting
- Status tracking
- Upvotes
- Comments
- Timeline events
- Resolution tracking
- Community verification status

## 12. Production checklist

Before production deployment:

- Set a strong random `JWT_SECRET`
- Replace the demo admin password and account
- Configure a production `DATABASE_URL`
- Set a specific `FRONTEND_ORIGIN`
- Use HTTPS
- Do not commit `.env` files or credentials
- Add rate limiting and account lockout protections
- Increase password validation requirements as appropriate
- Review CORS, input validation, logging, and error handling
- Use a persistent storage mode instead of the in-memory store

## 13. Relevant source files

- [README.md](./README.md)
- [frontend/package.json](./frontend/package.json)
- [backend/package.json](./backend/package.json)
- [frontend/src/context/AuthContext.tsx](./frontend/src/context/AuthContext.tsx)
- [frontend/src/services/api.ts](./frontend/src/services/api.ts)
- [frontend/src/pages/Login.tsx](./frontend/src/pages/Login.tsx)
- [frontend/src/pages/Register.tsx](./frontend/src/pages/Register.tsx)
- [backend/src/controllers/authController.ts](./backend/src/controllers/authController.ts)
- [backend/src/middleware/auth.ts](./backend/src/middleware/auth.ts)
- [backend/src/models/authToken.ts](./backend/src/models/authToken.ts)
- [backend/src/models/helpers.ts](./backend/src/models/helpers.ts)
- [backend/src/repositories/index.ts](./backend/src/repositories/index.ts)
