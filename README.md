# Node.js Express Starter

A production-ready Node.js/Express boilerplate with best practices for building scalable REST APIs.

## Features

- **ES6 Modules** - Modern JavaScript with import/export syntax
- **Security** - Helmet, CORS, and Rate Limiting configured by default
- **Database** - MongoDB with Mongoose ODM
- **Validation** - Request validation using Zod
- **Logging** - Winston and Morgan for comprehensive logging
- **Error Handling** - Centralized error handling with custom AppError class
- **Modular Structure** - Clean separation of concerns

## Project Structure

```
src/
├── config/          # Configuration files
│   ├── index.js     # Environment configuration
│   └── db.js        # Database connection
├── controllers/     # Route controllers
├── middlewares/     # Express middlewares
│   ├── errorHandler.js
│   ├── notFound.js
│   └── validate.js
├── models/          # Mongoose models
├── routes/          # API routes
│   ├── index.js
│   ├── userRoutes.js
│   └── validations/ # Zod validation schemas
├── utils/           # Utility functions
│   ├── AppError.js
│   └── logger.js
├── app.js           # Express app setup
└── server.js        # Server entry point
```

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- MongoDB

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

4. Update `.env` with your configuration:
```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/node-express-starter
```

5. Start the server:
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

## API Endpoints

### Health Check
- `GET /api/v1/health` - Server health status

### Users
- `GET /api/v1/users` - Get all users
- `GET /api/v1/users/:id` - Get user by ID
- `POST /api/v1/users` - Create a new user
- `PATCH /api/v1/users/:id` - Update a user
- `DELETE /api/v1/users/:id` - Delete a user (soft delete)

## Scripts

```bash
npm start      # Start production server
npm run dev    # Start development server with auto-reload
npm run lint   # Run ESLint
npm test       # Run tests
```

## Security Features

- **Helmet** - Sets various HTTP headers for security
- **CORS** - Cross-Origin Resource Sharing configuration
- **Rate Limiting** - Prevents brute-force attacks (100 requests per 15 minutes)
- **Body Parser Limits** - Prevents large payload attacks (10kb limit)

## Error Handling

The application uses a centralized error handling approach:

```javascript
import AppError from './utils/AppError.js';

// Throw an operational error
throw new AppError('User not found', 404);
```

## Validation

Request validation using Zod schemas:

```javascript
import { z } from 'zod';
import validate from '../middlewares/validate.js';

const schema = {
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email')
  })
};

router.post('/', validate(schema), controller);
```

## Logging

Winston logger with multiple transports:
- Console output (colorized in development)
- File logging (`logs/error.log` and `logs/combined.log`)

```javascript
import logger from './utils/logger.js';

logger.info('Server started');
logger.error('Something went wrong', error);
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| NODE_ENV | Environment mode | development |
| PORT | Server port | 3000 |
| MONGODB_URI | MongoDB connection string | mongodb://localhost:27017/node-express-starter |
| RATE_LIMIT_WINDOW_MS | Rate limit window in ms | 900000 (15 min) |
| RATE_LIMIT_MAX | Max requests per window | 100 |
| LOG_LEVEL | Winston log level | info |

## License

MIT