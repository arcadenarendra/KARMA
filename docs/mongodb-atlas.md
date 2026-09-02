# MongoDB Atlas setup

This guide explains the manual MongoDB Atlas steps needed before deploying the
KARM backend. The application uses Mongoose and creates its collections and
indexes automatically when it connects for the first time.

## 1. Create an Atlas project

1. Open [MongoDB Atlas](https://www.mongodb.com/atlas) and sign in.
2. Create a project, for example `KARM Production`.
3. Create a cluster. The smallest shared/free cluster is sufficient for testing.
   Choose a production region close to your backend server.

## 2. Create a database user

1. Open **Security > Database & Network Access > Database Users**.
2. Select **Add New Database User**.
3. Use **Password** authentication.
4. Create a dedicated application user, for example `karm-api`.
5. Generate a strong password and store it in a password manager.
6. For normal application access, grant **Read and write to any database**.

Do not use your Atlas account password in the application. Do not commit the
database password to Git.

## 3. Allow the backend server to connect

1. Open **Security > Database & Network Access > IP Access List**.
2. Add the public outbound IP address of the backend host.
3. For temporary local testing, add your current IP address using **Add My
   Current IP Address**.
4. Avoid `0.0.0.0/0` in production. It allows connections from every IP and
   should only be used briefly when there is no fixed backend IP.

If the backend is deployed on a platform with changing outbound IPs, follow
that platform's static egress IP or Atlas network-peering guidance instead of
opening the database to the entire internet.

## 4. Copy the connection string

1. Open the cluster and select **Connect**.
2. Choose **Drivers**.
3. Select **Node.js** and copy the connection string.
4. Replace the placeholder username and password.
5. Add the database name `karma` before the query string.

Example:

```text
mongodb+srv://karm-api:<PASSWORD>@cluster0.example.mongodb.net/karma?retryWrites=true&w=majority
```

If the password contains characters such as `@`, `:`, `/`, `?`, or `#`, URL
encode the password before putting it in the URI.

## 5. Configure the backend

Create a private `.env` file on the backend host and set these values. When
running this repository locally, the root `.env` also works; a
`backend/.env` takes priority when both files exist:

```text
BACKEND_PORT=8787
DATABASE_URL=mongodb+srv://karm-api:<PASSWORD>@cluster0.example.mongodb.net/karma?retryWrites=true&w=majority
JWT_SECRET=<long-random-secret>
FRONTEND_ORIGIN=https://your-frontend-domain.example
```

`DATABASE_URL` must contain only one assignment. For example, use:

```text
DATABASE_URL=mongodb+srv://...
```

Do not write `DATABASE_URL=DB_URI=mongodb+srv://...`.

The backend switches from memory storage to MongoDB when `DATABASE_URL` is
non-empty. On the first successful connection, it seeds the demo reports and
admin account if the reports collection is empty:

```text
Email: admin@karm.local
Password: admin123
```

Change or remove this demo account before allowing real users into production.

## 6. Start and verify the backend

From the `backend` directory:

```bash
pnpm install --frozen-lockfile
pnpm run build
pnpm start
```

Check the health endpoint:

```bash
curl http://127.0.0.1:8787/api/health
```

When Atlas is configured, the response should report MongoDB storage:

```json
{"status":"ok","storage":"mongodb"}
```

Then check the reports endpoint:

```bash
curl http://127.0.0.1:8787/api/reports
```

## 7. Confirm data in Atlas

After the first successful connection, open **Database > Browse Collections**.
The `karma` database and these collections should appear after the application
reads or writes data:

- `users`
- `reports`
- `comments`
- `timelineevents`
- `votes`

You do not need to manually create these collections. Mongoose creates them as
needed, and the application defines the indexes in
`backend/src/models/mongoSchemas.ts`.

## Production checklist

- [ ] A dedicated database user exists.
- [ ] The backend IP is allowlisted.
- [ ] `DATABASE_URL` is stored only as a deployment secret.
- [ ] The database name in the URI is `karma`.
- [ ] The password is URL encoded when necessary.
- [ ] `JWT_SECRET` is a strong random value.
- [ ] `FRONTEND_ORIGIN` matches the deployed frontend origin exactly.
- [ ] The demo admin password has been changed or the account removed.
- [ ] Atlas backups, monitoring, and alerts are enabled for production.
- [ ] The backend health endpoint reports `"storage":"mongodb"`.
