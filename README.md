# Oracle Prisoner Database Application

A simple React application for managing a prisoner database using Oracle DB.

## Features

- Display prisoner records in a tabular format
- Add new prisoner records
- Basic form validation
- React Bootstrap UI components

## Prerequisites

- Docker and Docker Compose installed
- Access to Oracle Container Registry (for Oracle database image)

## Setup and Running

1. Clone this repository
2. Make sure you have Docker and Docker Compose installed
3. Run the application with Docker Compose:

```bash
docker-compose up -d
```
Access Localhost

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
- In a production environment, proper security measures should be implemented
- The Oracle database configuration requires access to the Oracle Container Registry 
