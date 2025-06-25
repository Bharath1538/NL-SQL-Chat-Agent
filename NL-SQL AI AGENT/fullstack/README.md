# NL-SQL Authentication System

A complete authentication system with React frontend, Node.js backend, and SQLite database integration.

## Features

- **Beautiful UI**: Modern, responsive design with glassmorphism effects
- **Secure Authentication**: JWT-based authentication with bcrypt password hashing
- **Form Validation**: Client-side and server-side validation
- **SQLite Integration**: Lightweight, file-based database that requires no setup
- **Protected Routes**: Route protection with automatic redirects
- **User Dashboard**: Clean dashboard interface after authentication

## Prerequisites

Before running this application, make sure you have:

1. **Node.js** (v16 or higher)

## Installation & Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the backend server:
   ```bash
   npm run server
   ```

3. In a new terminal, start the frontend development server:
   ```bash
   npm run dev
   ```

4. Or run both simultaneously:
   ```bash
   npm run dev:full
   ```

## Usage

1. Navigate to `http://localhost:5173`
2. You'll be redirected to the authentication page
3. Create a new account or sign in with existing credentials
4. After successful authentication, you'll be redirected to the dashboard

## API Endpoints

- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/signin` - Sign in existing user
- `GET /api/auth/profile` - Get user profile (protected)
- `GET /api/health` - Health check endpoint

## Security Features

- Password hashing with bcrypt (12 salt rounds)
- JWT token authentication
- Input validation and sanitization
- Protected routes with token verification
- Secure password requirements (minimum 6 characters)

## Database Schema

The application automatically creates the following table in SQLite:

```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## Environment Variables

For production, make sure to set these environment variables:

- `JWT_SECRET` - Secret key for JWT token signing

## Production Deployment

1. Set up environment variables
2. Enable HTTPS
3. Set up proper CORS policies
4. Use a process manager like PM2 for the Node.js server
5. Consider using a more robust database solution for high-traffic applications