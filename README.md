# GigFlow - Freelancing Platform

A full-stack freelancing platform built with React + Node.js, featuring real-time notifications and a complete bidding system.

## Project Overview

GigFlow is a modern freelancing platform that connects clients with freelancers. Clients can post gigs, freelancers can submit bids, and the platform facilitates the hiring process with real-time notifications.

## Architecture

- **Frontend**: React + TypeScript + Tailwind CSS + Vite
- **Backend**: Node.js + Express + MongoDB + Socket.io
- **Database**: MongoDB with Mongoose ODM
- **Real-time**: Socket.io for instant notifications
- **Authentication**: JWT with HttpOnly cookies

## Key Features

- 🔐 **Secure Authentication** - JWT-based auth with HttpOnly cookies
- 💼 **Gig Management** - Create, browse, and manage freelance projects
- 💰 **Bidding System** - Submit proposals and manage bids
- ⚡ **Real-time Notifications** - Instant hire notifications via Socket.io
- 🔍 **Search Functionality** - Debounced search with URL synchronization
- 📱 **Responsive Design** - Mobile-first approach with Tailwind CSS
- 🎯 **Toast Notifications** - Global notification system

## Project Structure

```
ServicehiveAssignment/
├── Client/                 # React Frontend
│   ├── src/
│   │   ├── api/           # API configuration
│   │   ├── components/    # Reusable components
│   │   ├── context/       # React contexts
│   │   ├── pages/         # Page components
│   │   └── hooks/         # Custom hooks
│   └── README.md          # Frontend documentation
├── Server/                # Node.js Backend
│   ├── src/
│   │   ├── controllers/   # Route handlers
│   │   ├── models/        # Database models
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic
│   │   └── socket.ts      # Socket.io setup
│   └── README.md          # Backend documentation
└── README.md              # This file
```

## Quick Start

### Prerequisites

- Node.js (v16+)
- MongoDB
- npm or yarn

### Backend Setup

1. Navigate to server directory:
```bash
cd Server
```

2. Install dependencies and setup:
```bash
npm install
cp .env.server.example .env.server
# Edit .env.server with your MongoDB URI and JWT secret
```

3. Start the server:
```bash
npm run dev
```

Server runs on `http://localhost:8000`

### Frontend Setup

1. Navigate to client directory:
```bash
cd Client
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

Frontend runs on `http://localhost:5173`

## Documentation

- **[Frontend Documentation](./Client/README.md)** - React app setup, components, and features
- **[Backend Documentation](./Server/README.md)** - API endpoints, database models, and Socket.io

## API Overview

### Authentication
- Register/Login with secure JWT cookies
- Protected routes with middleware

### Core Features
- **Gigs**: CRUD operations with search functionality
- **Bids**: Submit proposals and manage bid status
- **Hiring**: Hire freelancers with real-time notifications

### Real-time Features
- Socket.io connection with cookie-based auth
- Instant hire notifications to freelancers
- Global toast notification system

## Development Workflow

1. **Backend First**: Start the Node.js server
2. **Frontend**: Launch the React development server
3. **Database**: Ensure MongoDB is running
4. **Testing**: Use both applications together

## Key Technologies

### Frontend
- React 19 with TypeScript
- Vite for fast development
- Tailwind CSS for styling
- React Router for navigation
- Axios for API calls
- Socket.io Client for real-time features

### Backend
- Node.js with Express
- TypeScript for type safety
- MongoDB with Mongoose
- Socket.io for real-time communication
- JWT for authentication
- Argon2 for password hashing

## Contributing

1. Follow the existing code structure
2. Use TypeScript for type safety
3. Add proper error handling
4. Test both frontend and backend changes
5. Update documentation as needed

## License

This project is part of the GigFlow assignment.