# User Management System

A production-ready full-stack application for managing users, built with Next.js, Prisma, and PostgreSQL.

## Features

- **CRUD Operations**: Create, Read, Update, and Delete users
- **Search**: Search users by name or email
- **Pagination**: Efficient pagination with page navigation
- **Form Validation**: Robust form validation using react-hook-form and zod
- **Toast Notifications**: Success and error feedback
- **Loading States**: Loading skeletons for better UX
- **Modern UI**: Clean, responsive design with Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: Tailwind CSS
- **Form Validation**: react-hook-form + zod
- **UI Components**: Radix UI + custom components

## Project Structure

```
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── app/
│   │   ├── (dashboard)/       # Dashboard routes
│   │   │   ├── users/
│   │   │   │   ├── page.tsx    # User list
│   │   │   │   └── new/page.tsx # Add user
│   │   │   └── [id]/edit/      # Edit user
│   │   └── api/
│   │       └── users/          # API routes
│   ├── components/
│   │   ├── ui/                 # Reusable UI components
│   │   ├── user-form.tsx       # User form component
│   │   └── user-table.tsx      # User table component
│   ├── lib/
│   │   ├── prisma.ts           # Prisma client
│   │   ├── api-client.ts       # API client
│   │   ├── utils.ts            # Utilities
│   │   └── validations.ts      # Zod schemas
│   └── types/
│       └── index.ts            # TypeScript types
└── .env                        # Environment variables
```

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone and install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your database connection string:
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/user_management"
   ```

3. **Set up the database:**
   ```bash
   # Generate Prisma client
   npm run db:generate

   # Push schema to database
   npm run db:push

   # Or run migrations
   npm run db:migrate
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000)**

## API Endpoints

### Users API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | Get all users (with search & pagination) |
| GET | `/api/users/:id` | Get a single user |
| POST | `/api/users` | Create a new user |
| PUT | `/api/users/:id` | Update a user |
| DELETE | `/api/users/:id` | Delete a user |

### Query Parameters (GET /api/users)

| Parameter | Type | Description |
|-----------|------|-------------|
| search | string | Search by name or email |
| page | number | Page number (default: 1) |
| limit | number | Items per page (default: 10) |
| sortBy | string | Sort field: name, email, createdAt |
| sortOrder | string | Sort order: asc, desc |

### Request/Response Examples

**Create User (POST /api/users)**
```json
// Request
{
  "name": "John Doe",
  "email": "john@example.com",
  "role": "User"
}

// Response (201)
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "User",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

**Get Users (GET /api/users?page=1&limit=10)**
```json
// Response
{
  "data": [...],
  "total": 100,
  "page": 1,
  "limit": 10,
  "totalPages": 10
}
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Push schema to database |
| `npm run db:migrate` | Run database migrations |
| `npm run db:studio` | Open Prisma Studio |

## Error Handling

The API returns consistent error responses:

```json
{
  "error": "Error message describing what went wrong"
}
```

Status codes:
- `400` - Bad Request (validation errors)
- `404` - Not Found
- `409` - Conflict (duplicate email)
- `500` - Internal Server Error
