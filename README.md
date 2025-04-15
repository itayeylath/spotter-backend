# Spotter Backend

This is the backend service for the Spotter application, built with Node.js, Express, TypeScript, and Firebase Authentication.

## Prerequisites

Before you begin, ensure you have the following installed:

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)

## Local Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/itayeylath/spotter-backend.git
cd spotter-backend
```

### 2. Environment Setup

Create a `.env.development` file in the root directory:

```bash
# Server Configuration
PORT=3000
NODE_ENV=development

# Firebase Configuration
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="your-private-key"
FIREBASE_CLIENT_EMAIL=your-client-email

# Admin Configuration
ADMIN_UIDS=uid1,uid2
```

### 3. Start the Development Server

Run the application in development mode with hot-reloading:

```bash
# Build and start the container
docker-compose -f docker-compose.dev.yml up

# Or run in detached mode
docker-compose -f docker-compose.dev.yml up -d
```

The server will be available at `http://localhost:3000`

### 4. Development Commands

```bash
# View logs
docker-compose -f docker-compose.dev.yml logs -f

# Restart the container
docker-compose -f docker-compose.dev.yml restart

# Stop the container
docker-compose -f docker-compose.dev.yml down

# Rebuild the container (after dependency changes)
docker-compose -f docker-compose.dev.yml up --build
```

### 5. Development Features

- Hot-reloading enabled (changes will automatically restart the server)
- Source maps for debugging
- Debugging port exposed at 9229
- Logs available in ./logs directory
- TypeScript compilation on the fly

## Project Structure

```
spotter-backend/
├── src/                    # Source code
│   ├── config/            # Configuration files
│   ├── controllers/       # Request handlers
│   ├── middlewares/       # Express middlewares
│   ├── routes/           # API routes
│   ├── types/            # TypeScript types and interfaces
│   ├── utils/            # Utility functions
│   ├── app.ts           # Express app setup
│   └── server.ts        # Server entry point
├── logs/                 # Application logs
├── docker-compose.dev.yml  # Development docker compose
├── docker-compose.prod.yml # Production docker compose
├── Dockerfile.dev         # Development dockerfile
├── Dockerfile.prod        # Production dockerfile
└── package.json          # Project dependencies and scripts
```

## Available API Endpoints

- Authentication Routes:
  - POST `/auth/google` - Sign in with Google
  - POST `/auth/signout` - Sign out
  - GET `/auth/user` - Get current user
  - GET `/auth/admin/check` - Check admin status
  - GET `/auth/admin/list` - Get admin list

## Debugging

1. Attach your IDE to port 9229 for Node.js debugging
2. View real-time logs:
   ```bash
   docker-compose -f docker-compose.dev.yml logs -f
   ```
3. Check the logs directory for detailed logs

## Common Issues and Solutions

1. **Container won't start**

   - Check if ports 3000 or 9229 are already in use
   - Ensure Docker daemon is running
   - Check logs for detailed error messages

2. **Changes not reflecting**

   - Ensure you're in the correct directory
   - Check if file watching is working
   - Try restarting the container

3. **Environment variables not working**
   - Verify `.env.development` file exists
   - Check for correct variable names
   - Ensure no spaces around '=' in env file

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Submit a pull request

## License

ISC
