# Node.js Express Starter

A production-ready, enterprise-grade Node.js (v20+) & Express boilerplate with best practices for building scalable REST APIs using the Service-Repository-Controller pattern.

## Features

- **ES6 Modules** - Modern JavaScript with import/export syntax
- **Service-Controller Pattern** - Strict separation of business logic from HTTP transport
- **Path Aliases** - Import using `#config/*`, `#services/*`, etc.
- **Security** - Helmet, CORS, HPP, Express-Mongo-Sanitize, and Rate Limiting
- **Database** - MongoDB with Mongoose ODM and graceful shutdown
- **Validation** - Zod for request and environment validation (crashes on missing env vars)
- **Logging** - Winston with Daily Rotation + Morgan for HTTP logs
- **Correlation ID** - UUID attached to every request for distributed tracing
- **Error Handling** - Centralized error handling with custom AppError class
- **API Documentation** - Swagger/OpenAPI at `/api-docs`
- **Docker** - Multi-stage Dockerfile and docker-compose for local dev
- **Developer Experience** - ESLint, Prettier, Jest + Supertest

## Project Structure

```
src/
├── config/           # Environment vars, DB connection, Logger config
│   ├── index.js      # Environment configuration with Zod validation
│   ├── db.js         # Database connection
│   └── logger.js     # Winston logger with daily rotation
├── controllers/      # Request handling ONLY (req, res) -> Calls Services
│   └── userController.js
├── services/         # Business logic ONLY -> Returns plain objects
│   └── userService.js
├── models/           # Mongoose Schemas
│   └── User.js
├── routes/           # Express routes definitions
│   ├── index.js
│   └── userRoutes.js
├── middlewares/      # Auth, Validation, Error Handling
│   ├── correlationId.js    # Correlation ID middleware
│   ├── error.middleware.js # Global error handler
│   ├── notFound.js
│   └── validate.js
├── utils/            # AppError, CatchAsync, ApiResponse helpers
│   ├── AppError.js
│   ├── apiResponse.js
│   ├── catchAsync.js
│   └── logger.js     # Re-exports from config/logger.js
├── validations/      # Zod Schemas
│   └── user.validation.js
├── docs/             # Swagger/OpenAPI setup
│   └── swagger.js
├── app.js            # App setup (middleware, routes)
└── server.js         # Server entry point (port listening)
tests/                # Jest + Supertest setup
```

## Getting Started

### Prerequisites

- Node.js >= 20.0.0
- MongoDB (or use Docker)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/node-express-starter.git
cd node-express-starter
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Update `.env` with your configuration (MONGODB_URI is required):
```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/node-express-starter
LOG_LEVEL=debug
```

5. Start the server:
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

### Using Docker

```bash
# Start app + MongoDB
docker-compose up -d

# Start with MongoDB Express admin UI
docker-compose --profile admin up -d

# View logs
docker-compose logs -f app
```

## API Documentation

Interactive API documentation is available at `/api-docs` when the server is running.

### Endpoints

#### Health Check
- `GET /api/v1/health` - Server health status

#### Users
- `GET /api/v1/users` - Get all users
- `GET /api/v1/users/:id` - Get user by ID
- `POST /api/v1/users` - Create a new user
- `PATCH /api/v1/users/:id` - Update a user
- `DELETE /api/v1/users/:id` - Delete a user (soft delete)

## Architecture

### Service-Controller Pattern

Controllers only handle HTTP concerns (request/response):
```javascript
// src/controllers/userController.js
import userService from '#services/userService';
import catchAsync from '#utils/catchAsync';
import ApiResponse from '#utils/apiResponse';

export const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  ApiResponse.success(res, 200, 'User retrieved successfully', { user });
});
```

Services contain all business logic:
```javascript
// src/services/userService.js
import User from '#models/User';
import AppError from '#utils/AppError';

class UserService {
  async getUserById(id) {
    const user = await User.findById(id);
    if (!user) {
      throw new AppError('No user found with that ID', 404);
    }
    return user;
  }
}
```

### Path Aliases

Use path aliases instead of relative imports:
```javascript
// Instead of: import User from '../../../models/User.js';
import User from '#models/User';
import logger from '#config/logger';
import userService from '#services/userService';
```

## Scripts

```bash
npm start        # Start production server
npm run dev      # Start development server with auto-reload
npm run lint     # Run ESLint
npm run lint:fix # Run ESLint with auto-fix
npm run format   # Format code with Prettier
npm test         # Run tests
```

## Security Features

- **Helmet** - Sets various HTTP headers for security
- **CORS** - Cross-Origin Resource Sharing configuration
- **Rate Limiting** - Prevents brute-force attacks (100 requests per 15 minutes)
- **HPP** - HTTP Parameter Pollution prevention
- **Express-Mongo-Sanitize** - Prevents NoSQL injection attacks
- **Body Parser Limits** - Prevents large payload attacks (10kb limit)

## Error Handling

The application uses a centralized error handling approach:

```javascript
import AppError from '#utils/AppError';

// Throw an operational error
throw new AppError('User not found', 404);
```

## Validation

### Request Validation with Zod

```javascript
import { z } from 'zod';
import validate from '#middlewares/validate';

const schema = {
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email')
  }),
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid MongoDB ObjectId')
  })
};

router.post('/:id', validate(schema), controller);
```

### Environment Validation

Environment variables are validated on startup using Zod. The application will crash if required variables (like MONGODB_URI) are missing.

## Logging

### Winston Logger with Daily Rotation

```javascript
import logger from '#config/logger';

logger.info('Server started');
logger.error('Something went wrong', error);
```

### Correlation ID

Every request gets a unique correlation ID for distributed tracing:

```javascript
// Automatically attached to all log messages
// 2024-01-15 10:30:00 [abc-123-xyz] [info]: User created successfully

// Access in middleware/controllers
req.correlationId  // The correlation ID
req.log            // Logger with correlation ID attached
```

## Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| NODE_ENV | Environment mode | No | development |
| PORT | Server port | No | 3000 |
| MONGODB_URI | MongoDB connection string | **Yes** | - |
| RATE_LIMIT_WINDOW_MS | Rate limit window in ms | No | 900000 (15 min) |
| RATE_LIMIT_MAX | Max requests per window | No | 100 |
| LOG_LEVEL | Winston log level | No | info |

## Docker

### Multi-stage Dockerfile

The Dockerfile uses three stages for optimal image size:
1. **Base** - Node.js Alpine with dumb-init
2. **Dependencies** - Install production dependencies
3. **Release** - Copy application code

### Docker Compose

```yaml
services:
  app:      # Node.js application
  mongo:    # MongoDB database
  mongo-express:  # MongoDB admin UI (optional, use --profile admin)
```

## License

MIT