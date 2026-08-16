# Student Course Portal — Backend API

A RESTful API built with Express.js and PostgreSQL (Neon), powering the Student Course Portal. Implements JWT authentication, role-based access control, ownership-based authorization, and centralized error handling — the production-readiness concerns that sit behind a typical CRUD app.



---

## Why this stack

| Choice | Reasoning |
|---|---|
| **Express** | Minimal, unopinionated — makes the middleware chain (auth → authorization → validation → controller → error handler) explicit and easy to reason about, which was the point of this project. |
| **PostgreSQL via Neon** | Relational data (courses, students, instructors, users) with real foreign-key relationships (`courses.instructor_id → instructors.id`) fits a relational model better than a document store. Neon specifically gives a serverless Postgres that's free to run and easy to provision without managing a server. |
| **`pg` (node-postgres)** | Direct SQL via parameterized queries (`$1`, `$2`, …) rather than an ORM — deliberate choice to stay close to the SQL and understand exactly what's being sent to the database, rather than abstracting it away. |
| **JWT over sessions** | Stateless auth — no server-side session store needed, which matters for a horizontally-scalable/serverless deployment target like Koyeb. |
| **`bcrypt`** | Industry-standard for password hashing; salts and hashes automatically, resistant to rainbow-table attacks. |
| **`express-validator`** | Declarative request validation as middleware, keeping validation logic out of controllers. |

---

## Features

- **JWT Authentication** — register/login issue a signed token; protected routes verify it via middleware
- **Role-Based Access Control (RBAC)** — `admin` / `user` roles; write operations on courses and students are admin-only
- **Ownership-Based Authorization** — a user can update their own profile (`PUT /api/updateprofile`) because the target row is derived from the verified JWT (`req.user.id`), never from client-supplied input — there is structurally no way to edit another user's row through this endpoint
- **Centralized error handling** — a single 4-argument Express error middleware (`errorHandler`) catches everything forwarded via `next(error)`, logs it server-side, and returns a consistent JSON shape
- **Request validation** — `express-validator` rule sets applied before controllers run
- **Server-side search** — `GET /api/courses?search=...` filters via a parameterized `ILIKE` query (SQL-injection-safe)
- **CORS locked to the deployed frontend origin** in production

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express 5 |
| Database | PostgreSQL (Neon) |
| DB Driver | `pg` |
| Auth | `jsonwebtoken`, `bcrypt` |
| Validation | `express-validator` |
| Env config | `dotenv` |
| Deployment | Koyeb |

---

## Project Structure

```
StudentPortal-Backend/
├── Config/
│   └── db.js                     # pg Pool connected to Neon
├── controllers/
│   ├── authController.js         # register, login, profile, updateProfile, logout
│   ├── coursesController.js      # course CRUD + search
│   ├── studentController.js      # student CRUD
│   └── instructorsController.js  # instructor CRUD
├── middlewares/
│   ├── authMiddlware.js          # protect — verifies JWT, sets req.user
│   ├── adminAccess.js            # requires req.user.role === 'admin'
│   ├── errorHandler.js           # centralized 4-arg error middleware
│   └── validateData.js           # express-validator rule sets
├── routes/
│   ├── authRoutes.js
│   ├── coursesRoutes.js
│   ├── studentsRoutes.js
│   └── instructorRoutes.js
├── utils/
│   └── jwtToken.js               # signs a JWT from a user row
├── db/
│   └── schema.sql                # table definitions
├── server.js                     # app entry point, middleware wiring
└── package.json
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- A [Neon](https://neon.tech) Postgres database (or any Postgres instance)

### Installation

```bash
git clone https://github.com/tcintern-006/StudentPortal-Backend.git
cd StudentPortal-Backend
npm install
```

### Database setup

Run the SQL in `db/schema.sql` against your Postgres instance to create the `courses`, `instructors`, `students`, and `users` tables.

### Environment variables

Create a `.env` file in the project root:

```env
PORT=4000
DATABASE_URL=your_neon_connection_string
JWT_SECRET=your_jwt_secret
```

### Run locally

```bash
npm run dev
```

Server starts on `http://localhost:4000` (or `$PORT`).

---

## API Reference

Base path: `/api`

### Auth (`authRoutes.js`)

| Method | Endpoint | Access | Notes |
|---|---|---|---|
| POST | `/register` | Public | Validated via `registerValadation`. Role is accepted from the request body at signup. |
| POST | `/login` | Public | Returns a JWT + user object (password stripped) on success. |
| GET | `/profile` | Authenticated | Returns the logged-in user's own record. |
| PUT | `/updateprofile` | Authenticated (owner-only) | Updates the logged-in user's own email. The row updated is always `req.user.id` from the verified token — never a client-supplied ID. |
| GET | `/logout` | Authenticated | Stateless logout (client discards the token). |

### Courses (`coursesRoutes.js`)

| Method | Endpoint | Access | Notes |
|---|---|---|---|
| GET | `/courses` | Public | Supports `?search=` (parameterized `ILIKE`, `LIMIT 10` when searching). |
| GET | `/courses/:id` | Public | |
| POST | `/courses` | Admin only | `protect` → `adminAccess` → validated. |
| PUT | `/courses/:id` | Admin only | |
| DELETE | `/courses/:id` | Admin only | |

### Students (`studentsRoutes.js`)

| Method | Endpoint | Access | Notes |
|---|---|---|---|
| GET | `/students` | Public | |
| GET | `/students/:id` | Public | |
| POST | `/students` | Admin only | |
| PUT | `/students/:id` | Admin only | |
| DELETE | `/students/:id` | Admin only | |

### Instructors (`instructorRoutes.js`)

| Method | Endpoint | Access | Notes |
|---|---|---|---|
| GET | `/instructors` | Public | |
| POST | `/instructors` | Public (validated, not auth-gated) | |
| PUT | `/instructors/:id` | Public (not auth-gated) | |
| DELETE | `/instructors/:id` | Public (not auth-gated) | |

---

## Authorization Model

Protected routes expect:

```
Authorization: Bearer <token>
```

- **`401 Unauthorized`** — `protect` middleware: token missing, malformed, or fails `jwt.verify` (expired/invalid).
- **`403 Forbidden`** — `adminAccess` middleware: token is valid, but `req.user.role !== 'admin'`.
- **Ownership check** — enforced structurally, not via an explicit `if` comparing IDs: `updateProfile` only ever targets `req.user.id`, sourced from the verified JWT payload, so there's no code path where a request body or URL param can target a different user's row.

---

## Error Handling

Controllers wrap DB calls in `try/catch` and forward unexpected failures with `next(error)`. A single error-handling middleware, registered last in `server.js`, catches everything:

```js
app.use(errorHandler);
```

```json
{ "message": "Something went wrong" }
```

Expected outcomes (`404`, `403`, `409` on duplicate email, `400` on validation failure) are returned directly from controllers with a specific message, since these are normal business logic, not unexpected failures.

---

## Known Limitations / Next Steps

Documented honestly, since a real production checklist would flag these:

- **Instructor routes are not authentication-gated** — currently anyone can create/update/delete instructors. If instructors become admin-managed like courses/students, add `protect` + `adminAccess` there too.
- **`getallCourses`** currently applies `LIMIT` only on the search branch, and returns `404` when zero rows match — an empty result set from a search is arguably a valid response (`200` with `[]`), not an error, and is worth revisiting.
- **JWT is stored client-side in `localStorage`** (see frontend), which is simple but vulnerable to XSS-based token theft compared to an `httpOnly` cookie. Acceptable for a learning project; worth reconsidering for production.
- **Pagination** (`OFFSET`/page numbers) was scoped down to a flat `LIMIT` — no page-through UI exists yet.

---

## Author

**Muhammad Ammar Akbar**
[LinkedIn](https://www.linkedin.com/in/muhammadammar46/) · [GitHub](https://github.com/tcintern-006)
