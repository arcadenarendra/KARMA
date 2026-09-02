# KARM API

Complete REST API reference for Thunder Client and frontend integration.

## Connection

Local backend:

```text
http://localhost:8787/api
```

For production, replace this with the deployed API URL, for example:

```text
https://api.example.com/api
```

All request bodies must be JSON:

```text
Content-Type: application/json
```

Protected endpoints also require:

```text
Authorization: Bearer YOUR_TOKEN
```

## Recommended Thunder Client workflow

1. Call `GET /health`.
2. Call `POST /auth/register` or `POST /auth/login`.
3. Copy the response `token`.
4. Add `Authorization: Bearer YOUR_TOKEN` to protected requests.
5. Create a report with `POST /reports`.
6. Copy its `id` for comments, upvotes, resolving, and status updates.

## Common values

### Categories

```text
Healthcare
Education
Municipal
Public Safety
Infrastructure
Other
```

### Statuses

```text
New
Under Review
Community Verified
In Progress
Resolved
Awaiting Action
```

## Health

### Check API and storage

```http
GET /health
```

Example response:

```json
{
  "status": "ok",
  "storage": "mongodb"
}
```

`storage` is `memory` when `DATABASE_URL` is empty and `mongodb` when Atlas is
connected.

## Authentication

### Register

```http
POST /auth/register
```

Body:

```json
{
  "name": "Test User",
  "email": "testuser@example.com",
  "password": "test123456",
  "location": "Ahmedabad"
}
```

Requirements:

- `name`, `email`, and `password` are required.
- Password must contain at least 6 characters.
- `location` is optional.

Response `201 Created`:

```json
{
  "token": "JWT_TOKEN",
  "user": {
    "id": "user-id",
    "name": "Test User",
    "email": "testuser@example.com",
    "role": "citizen",
    "location": "Ahmedabad",
    "joinedDate": "2 Sep 2026",
    "avatar": "TU"
  }
}
```

Errors:

- `400` — missing name, email, or valid password.
- `409` — email already exists.

### Login

```http
POST /auth/login
```

Body:

```json
{
  "email": "testuser@example.com",
  "password": "test123456"
}
```

Response `200 OK` has the same `{ "token", "user" }` shape as registration.

Error:

- `401` — invalid email or password.

### Get current user

```http
GET /auth/me
Authorization: Bearer YOUR_TOKEN
```

Response `200 OK`:

```json
{
  "id": "user-id",
  "name": "Test User",
  "email": "testuser@example.com",
  "role": "citizen",
  "location": "Ahmedabad",
  "joinedDate": "2 Sep 2026",
  "avatar": "TU"
}
```

Error:

- `401` — missing or invalid token.

## Reports

### List reports

```http
GET /reports
```

Response `200 OK`:

```json
[
  {
    "id": "report-id",
    "title": "Test pothole report",
    "description": "Large pothole near the main road.",
    "category": "Infrastructure",
    "location": "SG Highway, Ahmedabad",
    "daysUnresolved": 0,
    "upvotes": 0,
    "comments": 0,
    "status": "New",
    "reporter": "Test User",
    "reporterId": "user-id",
    "reportedDate": "2 Sep 2026",
    "image": "https://example.com/image.jpg",
    "verified": false,
    "trending": false,
    "comments_data": [],
    "timeline": [
      {
        "id": "timeline-id",
        "label": "Reported",
        "timestamp": "2 Sep 2026, 09:30 PM",
        "detail": "Issue submitted with a public tracking clock."
      }
    ]
  }
]
```

### Get one report

```http
GET /reports/REPORT_ID
```

Response `200 OK`: one report using the same shape as the list endpoint.

Error:

- `404` — issue not found.

### Get report statistics

```http
GET /reports/stats
```

Response `200 OK`:

```json
{
  "total": 3,
  "active": 2,
  "resolved": 1,
  "upvotes": 125,
  "critical": 1,
  "byCategory": [
    {
      "category": "Infrastructure",
      "count": 2
    }
  ]
}
```

### Create a report

```http
POST /reports
```

Authentication is optional. Without a token, or when `anonymous` is `true`, the
reporter is stored as `Anonymous`.

Body:

```json
{
  "title": "Test pothole report",
  "description": "Large pothole near the main road.",
  "category": "Infrastructure",
  "location": "SG Highway, Ahmedabad",
  "image": "",
  "anonymous": false
}
```

Notes:

- `title`, `location`, and a valid `category` are required.
- `description` defaults to `No description provided.`.
- `image` is optional.
- `anonymous` should be `true` or `false`.

Response `201 Created`: the newly created full report.

Errors:

- `400` — missing title/location or invalid category.

### Upvote a report

```http
POST /reports/REPORT_ID/upvote
Authorization: Bearer YOUR_TOKEN
```

Response `200 OK`:

```json
{
  "upvotes": 1
}
```

Each signed-in user can upvote a report once.

Errors:

- `401` — sign-in required.
- `404` — issue not found.

### Resolve a report

```http
POST /reports/REPORT_ID/resolve
Authorization: Bearer YOUR_TOKEN
```

The authenticated user must be the report owner or an admin.

Response `200 OK`: the updated full report, including a `Resolved` timeline
event.

Errors:

- `401` — sign-in required.
- `403` — user is not the reporter or an admin.
- `404` — issue not found.

### Update report status

```http
PATCH /reports/REPORT_ID/status
Authorization: Bearer ADMIN_TOKEN
```

Body:

```json
{
  "status": "In Progress"
}
```

Only an admin can use this endpoint. Valid statuses are listed above.

Response `200 OK`: the updated full report, including a timeline event.

Errors:

- `400` — invalid status.
- `401` — sign-in required.
- `403` — admin access required.
- `404` — issue not found.

### Add a comment

```http
POST /reports/REPORT_ID/comments
Authorization: Bearer YOUR_TOKEN
```

Body:

```json
{
  "text": "This is a test comment."
}
```

Response `201 Created`:

```json
{
  "id": "comment-id",
  "author": "Test User",
  "avatar": "TU",
  "text": "This is a test comment.",
  "timestamp": "2 Sep 2026, 09:35 PM"
}
```

Errors:

- `400` — comment text is empty.
- `401` — sign-in required.
- `404` — issue not found.

## Error format

Most errors use this shape:

```json
{
  "message": "Description of the error"
}
```

## Demo admin account

When MongoDB is first connected and the reports collection is empty, the
backend seeds:

```text
Email: admin@karm
Password: admin123
```

Change or remove this account before production.
