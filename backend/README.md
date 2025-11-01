# Event Management Backend (Express + SQLite)

A simple, production-ready-ish backend for an event management app with two roles: `user` and `admin`.

- Users can browse events, register, and cancel registration.
- Admins can create, update, delete events and view registrations.

## Quick Start

1) Install dependencies
```
npm install
```

2) Create env file
```
# PowerShell (Windows)
Copy-Item .env.example .env -Force
```

3) Start server
```
npm start
```

- Base URL: `http://localhost:4000`
- A default admin user is auto-created at first run using the values in `.env`.

## Environment Variables (.env)
- `JWT_SECRET`: Secret for signing JWTs
- `PORT`: Port to run the server (default 4000)
- `DEFAULT_ADMIN_EMAIL`, `DEFAULT_ADMIN_PASSWORD`, `DEFAULT_ADMIN_NAME`: seed admin user

## Data Storage
- SQLite file stored at `backend/data.sqlite` (auto-created)

## Auth
- JWT Bearer tokens.
- Include header: `Authorization: Bearer <token>`

### Auth Endpoints
- POST `/api/auth/register` { name, email, password }
- POST `/api/auth/login` { email, password }
- GET `/api/auth/me` (auth)

## User Endpoints
- GET `/api/events` query: `page`, `pageSize`, `search`, `upcoming`
- GET `/api/events/:id`
- POST `/api/events/:id/register` (auth)
- POST `/api/events/:id/cancel` (auth)
- GET `/api/me/profile` (auth)
- GET `/api/me/registrations` (auth)

## Admin Endpoints (auth + role=admin)
- POST `/api/admin/events` { title, description?, location?, start_time, end_time, capacity }
- PUT `/api/admin/events/:id` partial update allowed
- DELETE `/api/admin/events/:id`
- GET `/api/admin/events/:id/registrations`

Notes
- `end_time` must be after `start_time`.
- `capacity` is an integer >= 0. Available seats computed as `capacity - registeredCount`.
- A user can only have one registration per event; cancelling flips status to `cancelled` and re-registering restores it.

## Typical Flow (PowerShell examples)

Login as admin:
```
$login = Invoke-RestMethod -Method Post -Uri "http://localhost:4000/api/auth/login" -ContentType 'application/json' -Body '{"email":"admin@example.com","password":"Admin@12345"}'
$adminToken = $login.token
```

Create an event:
```
$body = @{ title = 'Tech Meetup'; description = 'Monthly meetup'; location = 'Online'; start_time = '2030-01-01T10:00:00Z'; end_time = '2030-01-01T12:00:00Z'; capacity = 100 } | ConvertTo-Json
Invoke-RestMethod -Method Post -Uri "http://localhost:4000/api/admin/events" -Headers @{ Authorization = "Bearer $adminToken" } -ContentType 'application/json' -Body $body
```

Register a user and join the event:
```
$u = Invoke-RestMethod -Method Post -Uri "http://localhost:4000/api/auth/register" -ContentType 'application/json' -Body '{"name":"User One","email":"user1@example.com","password":"Password1"}'
$token = $u.token

# Replace 1 with the created event ID
Invoke-RestMethod -Method Post -Uri "http://localhost:4000/api/events/1/register" -Headers @{ Authorization = "Bearer $token" }
```

List registrations for an event (admin):
```
Invoke-RestMethod -Method Get -Uri "http://localhost:4000/api/admin/events/1/registrations" -Headers @{ Authorization = "Bearer $adminToken" }
```

## Error Format
Errors return JSON with `error` or `errors` (validation) fields and appropriate HTTP status codes.
