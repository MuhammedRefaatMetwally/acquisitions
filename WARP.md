# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is a Node.js Express API for an acquisitions system using modern JavaScript (ES modules), Drizzle ORM with PostgreSQL (Neon), and follows a clean architecture pattern with clear separation of concerns.

## Common Development Commands

### Development Server

- `npm run dev` - Start development server with file watching using Node.js --watch flag
- `npm start` - Not configured, use dev command instead

### Code Quality

- `npm run lint` - Run ESLint on the entire project
- `npm run lint:fix` - Run ESLint with automatic fixes
- `npm run formate` - Format code with Prettier (note: typo in package.json "formate" instead of "format")
- `npm run formate:check` - Check code formatting with Prettier

### Database Operations (Drizzle)

- `npm run db:generate` - Generate database migration files from schema changes
- `npm run db:migrate` - Run pending migrations against the database
- `npm run db:studio` - Open Drizzle Studio for database management GUI

### Environment Setup

The project requires a `.env` file with:

- `DATABASE_URL` - PostgreSQL connection string (Neon database)
- `JWT_SECRET` - Secret key for JWT token signing
- `LOG_LEVEL` - Logging level (defaults to 'info')
- `NODE_ENV` - Environment ('production' or development)
- `PORT` - Server port (defaults to 3000)

## Architecture Overview

### Project Structure

The project follows a modular architecture with path aliases for clean imports:

```
src/
├── config/           # Configuration files (database, logger)
├── controllers/      # Request handlers and business logic
├── middleware/       # Express middleware (not yet implemented)
├── models/          # Drizzle ORM schema definitions
├── routes/          # Express route definitions
├── services/        # Business logic and data operations
├── utils/           # Utility functions (JWT, cookies, formatting)
└── validations/     # Zod schema validations
```

### Path Aliases

The project uses Node.js imports mapping for clean imports:

- `#src/*` → `./src/*`
- `#config/*` → `./src/config/*`
- `#controllers/*` → `./src/controllers/*`
- `#middleware/*` → `./src/middleware/*`
- `#models/*` → `./src/models/*`
- `#routes/*` → `./src/routes/*`
- `#services/*` → `./src/services/*`
- `#utils/*` → `./src/utils/*`
- `#validations/*` → `./src/validations/*`

### Technology Stack

- **Runtime**: Node.js with ES modules
- **Framework**: Express.js 5.x
- **Database**: PostgreSQL via Neon serverless
- **ORM**: Drizzle ORM with drizzle-kit for migrations
- **Validation**: Zod schemas
- **Authentication**: JWT with bcrypt for password hashing
- **Logging**: Winston with file and console transports
- **Security**: Helmet, CORS, cookie-parser

### Key Patterns

#### Database Layer

- Uses Drizzle ORM with PostgreSQL dialect
- Models defined using Drizzle's table schema syntax
- Database connection configured in `#config/database.js` using Neon serverless
- Migrations managed through drizzle-kit

#### Authentication Flow

- JWT-based authentication with secure cookie storage
- Password hashing using bcrypt (salt rounds: 10)
- Cookie settings configured for security (httpOnly, secure in production)
- Token expiration set to 1 day

#### Validation

- Request validation using Zod schemas in `#validations/`
- Centralized error formatting in `#utils/formate.js`
- Validation errors return structured 400 responses

#### Logging

- Winston logger with multiple transports (file + console)
- Structured JSON logging with timestamps
- Separate error.log and combined.log files
- Console logging in non-production environments with colorization

### Code Style

- ESLint configuration with recommended rules
- Prettier formatting with specific style preferences:
  - Single quotes, 2-space indentation
  - Semi-colons required, trailing commas in ES5 style
  - 80-character line width, arrow functions without parens when possible
- Unix line endings enforced

## Development Notes

### Current Implementation Status

- Authentication routes defined but not fully implemented (typo in route names: "sing-up" instead of "sign-up")
- User model and auth service partially implemented
- JWT utilities and cookie management ready
- Database schema and configuration complete

### Known Issues

- Route names have typos ("sing-up", "sing-in", "sing-out")
- Auth controller imported but not used in routes
- Missing middleware implementation directory structure exists but empty

### Database Development

- Use `npm run db:studio` to visually manage database records
- Always run `npm run db:generate` after model changes
- Run `npm run db:migrate` to apply schema changes to database
- Check drizzle.config.js for schema path and database configuration

### Testing

- ESLint configuration includes Jest globals for future test implementation
- No test scripts currently configured in package.json

### Security Considerations

- JWT secret must be set in environment variables
- Cookies use httpOnly and secure flags appropriately
- Password validation requires minimum 6 characters
- CORS enabled (configure origins as needed for production)
