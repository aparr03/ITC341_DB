# Oracle Prisoner Database Application

## Prerequisites
- Docker and Docker Compose installed
- Access to Oracle Container Registry (for Oracle database image)

## Setup and Running

1. Clone this repository
2. Make sure you have Docker and Docker Compose installed
3. Copy .env.example to a new file named .env and fill in the required environment variables
4. Run the application with Docker Compose:

```bash
docker-compose up -d
```
Access localhost:80

## Development

For development without Docker:

1. Install Node.js (v14 or later)
2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
cd backend
npm start
```

The development server will be available at http://localhost:3000

## Notes
- This is a demonstration application with mock data
- Access/Edit SQL tables and mock data via /init-scripts/
