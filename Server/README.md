# GigFlow Backend

A Node.js + Express + MongoDB backend for the GigFlow freelancing platform with real-time notifications via Socket.io.

## Features

- **Authentication**: JWT-based auth with HttpOnly cookies
- **User Management**: Registration, login, profile management
- **Gig System**: Create, browse, and manage freelance gigs
- **Bidding System**: Submit and manage bids on gigs
- **Hiring Process**: Hire freelancers and update bid statuses
- **Real-time Notifications**: Socket.io for instant hire notifications
- **Search**: Server-side gig search by title

## Tech Stack

- **Node.js** with TypeScript
- **Express.js** for REST API
- **MongoDB** with Mongoose ODM
- **Socket.io** for real-time features
- **JWT** for authentication
- **Argon2** for password hashing
- **Joi** for validation

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Gigs

- `GET /api/gigs?title=<search>` - Get gigs with optional search
- `POST /api/gigs` - Create new gig (auth required)

### Bids

- `GET /api/bids` - Get current user's bids (auth required)
- `POST /api/bids` - Submit bid (auth required)
- `GET /api/bids/:gigId` - Get bids for gig (owner only)

### Hiring

- `PATCH /api/bids/:bidId/hire` - Hire freelancer (auth required)

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB running locally or connection string
- npm or yarn

### Installation

1. Install dependencies:

```bash
npm install
```

2. Copy environment variables:

```bash
cp .env.server.example .env.server
```

3. Update environment variables in `.env.server`:

```env
JWT_SECRET=your-jwt-secret-key
MONGO_URI=mongodb://localhost:27017/gigflow
JWT_EXPIRES_IN=7d
PORT=8000
CLIENT_URL=http://localhost:5173
```

### Development

Start the development server:

```bash
npm run dev
```

The server will be available at `http://localhost:8000`

### Build for Production

```bash
npm run build
npm start
```

## Database Models

### User

- `name`: string
- `email`: string (unique)
- `password`: string (hashed)

### Gig

- `title`: string
- `description`: string
- `budget`: number
- `ownerId`: ObjectId (ref: User)
- `status`: 'open' | 'assigned'

### Bid

- `gigId`: ObjectId (ref: Gig)
- `freelancerId`: ObjectId (ref: User)
- `message`: string
- `status`: 'pending' | 'hired' | 'rejected'

## Socket.io Events

### Client → Server

- Connection with JWT token via cookies

### Server → Client

- `hire`: Emitted when freelancer is hired
  ```json
  {
    "gig": { "title": "Gig Title", "id": "gigId" },
    "freelancerId": "userId"
  }
  ```
- `unauthorized` : Emitted when there is token error
  ```json
  {
    "cookie":"cookie"
  }
  ```

## Security Features

- **HttpOnly Cookies**: JWT stored in secure cookies
- **Password Hashing**: Argon2 for secure password storage
- **Input Validation**: Joi schemas for all endpoints
- **CORS**: Configured for frontend origin
- **Auth Middleware**: Protected routes require valid JWT

## Error Handling

- Centralized error handling middleware
- Consistent API response format
- Proper HTTP status codes
- Detailed error messages in development

## Project Structure

```
src/
├── constants/          # Enums and constants
├── controllers/        # Route handlers
├── db/                # Database connection
├── middlewares/       # Auth, validation, error handling
├── models/            # Mongoose schemas
├── routes/            # API route definitions
├── services/          # Business logic
├── types/             # TypeScript type definitions
├── utils/             # Utility functions
├── validation/        # Joi validation schemas
├── app.ts             # Express app setup
├── server.ts          # Server startup
└── socket.ts          # Socket.io configuration
```

## Environment Variables

| Variable         | Description                         | Default                 |
| ---------------- | ----------------------------------- | ----------------------- |
| `JWT_SECRET`     | Secret key for JWT signing          | Required                |
| `MONGO_URI`      | MongoDB connection string           | Required                |
| `JWT_EXPIRES_IN` | JWT expiration time                 | `7d`                    |
| `PORT`           | Server port                         | `8000`                  |
| `CLIENT_URL`     | Client URI to be used in production | `http://localhost:5173` |

## Contributing

1. Follow TypeScript best practices
2. Use proper error handling
3. Add validation for all inputs
4. Test API endpoints thoroughly
5. Update documentation as needed

## License

This project is part of the GigFlow assignment.
