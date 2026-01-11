# GigFlow Frontend

A React-based frontend for the GigFlow freelancing platform built with Vite, TypeScript, and Tailwind CSS.

## Features

- **Authentication**: JWT-based authentication with HttpOnly cookies
- **Gig Management**: Create, browse, and manage gigs
- **Bidding System**: Submit and manage bids on gigs
- **Real-time Notifications**: Socket.io integration for instant hire notifications
- **Search Functionality**: Debounced search with URL synchronization
- **Responsive Design**: Mobile-first design with Tailwind CSS

## Tech Stack

- **React 19** with TypeScript
- **Vite** for build tooling
- **React Router v6** for routing
- **Tailwind CSS** for styling
- **Axios** for API calls
- **Socket.io Client** for real-time features
- **Context API** for state management

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend server running on port 8000

### Installation

1. Install dependencies:
```bash
npm install
```

2. Copy environment variables:
```bash
cp .env.example .env
```

3. Update environment variables in `.env`:
```env
VITE_API_BASE_URL=http://localhost:8000/api
```

### Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── api/
│   └── axios.ts              # Axios configuration
├── components/
│   ├── BidItem.tsx           # Individual bid component
│   ├── BidList.tsx           # List of bids
│   ├── GigCard.tsx           # Gig display card
│   ├── NavBar.tsx            # Navigation component
│   ├── NotificationToast.tsx # Toast notifications
│   ├── ProtectedRoute.tsx    # Route protection
│   └── SearchBar.tsx         # Search with debouncing
├── context/
│   └── AuthContext.tsx       # Authentication context
├── hooks/
│   └── useSocket.ts          # Socket.io hook
├── pages/
│   ├── CreateGig.tsx         # Create new gig
│   ├── Dashboard.tsx         # User dashboard
│   ├── GigDetail.tsx         # Gig details and bidding
│   ├── GigFeed.tsx           # Browse all gigs
│   ├── Login.tsx             # Login page
│   ├── MyBids.tsx            # User's submitted bids
│   ├── MyGigs.tsx            # User's created gigs
│   └── Register.tsx          # Registration page
├── App.tsx                   # Main app component
├── routes.tsx                # Route configuration
└── main.tsx                  # App entry point
```

## Key Features

### SearchBar Component

The SearchBar component includes:
- **Debounced input** (300ms configurable delay)
- **URL synchronization** with query parameters
- **Loading states** during search
- **Clear functionality** with visual feedback
- **Keyboard shortcuts** (Enter for immediate search)
- **Accessibility** features

Usage:
```tsx
<SearchBar
  value={searchTerm}
  onChange={handleSearch}
  placeholder="Search gigs..."
  debounceMs={300}
/>
```

### Real-time Notifications

Socket.io integration provides:
- **Connection status** monitoring
- **Hire notifications** when freelancers are selected
- **Toast notifications** for user feedback
- **Automatic reconnection** handling

### Authentication Flow

- **Cookie-based authentication** with HttpOnly cookies
- **Automatic token refresh** via API calls
- **Protected routes** with redirect to login
- **User context** available throughout the app

## API Integration

The frontend integrates with the following backend endpoints:

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Gigs
- `GET /api/gigs?title=<search>` - Get gigs with optional search
- `POST /api/gigs` - Create new gig

### Bids
- `POST /api/bids` - Submit bid
- `GET /api/bids/:gigId` - Get bids for gig (owner only)

### Hiring
- `PATCH /api/bids/:bidId/hire` - Hire freelancer

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:8000/api` |

## Development Notes

### SearchBar Behavior
- Server-side filtering is preferred when backend supports `?title=` query parameter
- Falls back to client-side filtering if server doesn't support search
- URL query string is synchronized with search state
- Debouncing prevents excessive API calls

### Socket.io Connection
- Connects automatically when user is authenticated
- Uses JWT token from cookie for authentication
- Handles connection/disconnection states gracefully
- Emits 'hire' events for real-time notifications

### Error Handling
- Global axios interceptor handles 401 errors
- Form validation with backend error display
- Loading states for all async operations
- Graceful fallbacks for failed operations

## Browser Support

- Modern browsers with ES2015+ support
- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+

## Contributing

1. Follow the existing code style
2. Use TypeScript for type safety
3. Add proper error handling
4. Test responsive design
5. Update documentation as needed

## License

This project is part of the GigFlow assignment.