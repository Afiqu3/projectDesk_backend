# ProjectDesk Backend

ProjectDesk Backend is a REST API for student project submissions and administrator review. It provides authentication, role-based access to project workflows, and admin dashboard statistics.

## Live API

- **Production API:** [https://project-desk-backend.vercel.app](https://project-desk-backend.vercel.app)
- **Health check:** [https://project-desk-backend.vercel.app/](https://project-desk-backend.vercel.app/)

## Technologies

- Node.js and TypeScript
- Express 5
- PostgreSQL
- Prisma ORM
- JSON Web Tokens (JWT)
- Zod request validation

## Core features

- Student registration and login, token refresh, logout, and current-user lookup
- Role-based authorization for students and administrators
- Student project creation and personal project listing
- Admin project listing and approval/rejection workflow
- Admin dashboard statistics, including daily project trends
- Request validation, centralized error handling, and password hashing

## Dependencies

Runtime dependencies:

- `@prisma/adapter-pg`, `@prisma/client` — Prisma PostgreSQL adapter and client
- `bcryptjs` — password hashing
- `cookie-parser` — parsing authentication cookies
- `cors` — cross-origin request configuration
- `date-fns` — date utilities
- `dotenv` — environment variable loading
- `ejs` — template rendering support
- `express` — HTTP server and routing
- `http-status` — HTTP status constants
- `jsonwebtoken` — JWT creation and verification
- `pg` — PostgreSQL driver
- `zod` — request schema validation

Development dependencies include Prisma CLI, TypeScript, `tsx`, `tsup`, Biome, and the relevant Node.js/Express type packages. The full dependency definitions are in [package.json](./package.json).

## Run locally

### Prerequisites

- Node.js and npm
- A running PostgreSQL database and its connection URL

### Setup

1. Clone the repository and open its directory:

   ```powershell
   git clone <repository-url>
   cd projectDesk-backend
   ```

2. Install dependencies:

   ```powershell
   npm install
   ```

3. Create your local environment file from the example:

   ```powershell
   Copy-Item .env.example .env
   ```

   Edit `.env` and provide the required values:

   | Variable | Purpose |
   | --- | --- |
   | `DATABASE_URL` | PostgreSQL connection string |
   | `NODE_ENV` | Runtime environment, for example `development` |
   | `PORT` | Local server port, for example `5000` |
   | `JWT_ACCESS_SECRET` | Secret used to sign access tokens |
   | `JWT_REFRESH_SECRET` | Secret used to sign refresh tokens |
   | `JWT_ACCESS_EXPIRES_IN` | Access-token lifetime accepted by `jsonwebtoken` |
   | `JWT_REFRESH_EXPIRES_IN` | Refresh-token lifetime accepted by `jsonwebtoken` |
   | `BCRYPT_SALT_ROUNDS` | Password hashing cost |
   | `FRONTEND_URL` | Browser-client origin allowed by CORS |
   | `TESTER_ADMIN_NAME` | Name for the seeded admin account |
   | `TESTER_ADMIN_EMAIL` | Email for the seeded admin account |
   | `TESTER_ADMIN_PASSWORD` | Password for the seeded admin account |

   Use unique, strong secrets and never commit `.env` or real credentials. `BACKEND_URL` is present in `.env.example` for link configuration but is not currently used by the application.

4. Apply the existing Prisma migrations to the configured database and generate the Prisma client:

   ```powershell
   npx prisma migrate deploy
   npx prisma generate
   ```

5. Start the development server:

   ```powershell
   npm run dev
   ```

   The server listens on the configured `PORT` and seeds the tester admin account if it does not already exist. Visit `http://localhost:5000/` (or your configured port) to check that the API is running.

### Production build

Build the application and start the compiled server:

```powershell
npm run build
npm start
```

`npm run build` generates the Prisma client before compiling the server.

## API endpoints

All API routes use the `/api/v1` prefix.

| Method | Endpoint | Access |
| --- | --- | --- |
| `POST` | `/auth/register` | Public |
| `POST` | `/auth/login` | Public |
| `GET` | `/auth/me` | Authenticated student or admin |
| `POST` | `/auth/refresh` | Refresh-token cookie |
| `POST` | `/auth/logout` | Public |
| `POST` | `/project` | Student |
| `GET` | `/project` | Admin |
| `GET` | `/project/my-projects` | Student |
| `PATCH` | `/project/:id/review` | Admin |
| `GET` | `/stats/admin` | Admin |

## API testing

Import the Postman collection in [ProjectDesk Backend API.postman_collection.json](./ProjectDesk%20Backend%20API.postman_collection.json). Set its `baseUrl` to the local or production API URL and configure the admin credentials to match the server environment.
