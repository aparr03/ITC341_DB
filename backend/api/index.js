/**
 * Prison Management System API
 * 
 * This is the main entry point for the backend API service.
 * It configures Express, establishes database connections, and defines API routes.
 */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const { initialize, close } = require('./db');
const PrisonerService = require('./prisonerService');
const Queries = require('./queries');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Create Express app
const app = express();

// Configure CORS
const corsOptions = {
  origin: ['http://localhost', 'http://localhost:80', 'http://localhost:3001'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204
};
app.use(cors(corsOptions));
app.use(express.json());

// Log all incoming requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});

// Initialize database connection on startup
async function initializeApp() {
  try {
    await initialize();
    console.log('Database connection initialized successfully');
    
    // Start listening for requests once database is connected
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Prison Management API running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Error initializing application:', err);
    process.exit(1);
  }
}

// Graceful shutdown handling
process.on('SIGINT', async () => {
  try {
    await close();
    console.log('Database connection closed');
    process.exit(0);
  } catch (err) {
    console.error('Error during shutdown:', err);
    process.exit(1);
  }
});

// Health check endpoint
app.get('/up', (req, res) => {
  res.status(200).send('OK');
});

// Prisoner routes
app.get('/api/prisoners', async (req, res) => {
  try {
    console.log('GET /api/prisoners - Fetching all prisoners');
    const prisoners = await PrisonerService.getAllPrisoners();
    console.log('Prisoners fetched. Count:', prisoners.length);
    
    if (prisoners.length > 0) {
      console.log('First prisoner record keys:', Object.keys(prisoners[0]));
      console.log('First prisoner record:', JSON.stringify(prisoners[0], null, 2));
      
      // Check for null or undefined values in the first record
      const firstPrisoner = prisoners[0];
      Object.keys(firstPrisoner).forEach(key => {
        if (firstPrisoner[key] === null || firstPrisoner[key] === undefined) {
          console.log(`WARNING: ${key} is ${firstPrisoner[key]}`);
        }
      });
    }
    
    res.json(prisoners);
  } catch (error) {
    console.error('Error getting prisoners:', error);
    res.status(500).json({ error: 'Failed to get prisoners' });
  }
});

app.get('/api/prisoners/:id', async (req, res) => {
  try {
    const prisoner = await PrisonerService.getPrisonerById(req.params.id);
    if (!prisoner) {
      return res.status(404).json({ error: 'Prisoner not found' });
    }
    res.json(prisoner);
  } catch (error) {
    console.error(`Error getting prisoner ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to get prisoner' });
  }
});

app.post('/api/prisoners', async (req, res) => {
  try {
    console.log('POST /api/prisoners - Creating new prisoner with data:', req.body);
    const prisoner = await PrisonerService.createPrisoner(req.body);
    console.log('Prisoner created:', prisoner);
    res.status(201).json(prisoner);
  } catch (error) {
    console.error('Error creating prisoner:', error);
    res.status(500).json({ error: 'Failed to create prisoner', details: error.message });
  }
});

app.put('/api/prisoners/:id', async (req, res) => {
  try {
    const prisoner = await PrisonerService.updatePrisoner(req.params.id, req.body);
    res.json(prisoner);
  } catch (error) {
    console.error(`Error updating prisoner ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to update prisoner' });
  }
});

app.delete('/api/prisoners/:id', async (req, res) => {
  try {
    await PrisonerService.deletePrisoner(req.params.id);
    res.status(204).send();
  } catch (error) {
    console.error(`Error deleting prisoner ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to delete prisoner' });
  }
});

// Also keep the original routes without /api prefix for backward compatibility
app.get('/prisoners', async (req, res) => {
  try {
    const prisoners = await PrisonerService.getAllPrisoners();
    res.json(prisoners);
  } catch (error) {
    console.error('Error getting prisoners:', error);
    res.status(500).json({ error: 'Failed to get prisoners' });
  }
});

app.post('/prisoners', async (req, res) => {
  try {
    const prisoner = await PrisonerService.createPrisoner(req.body);
    res.status(201).json(prisoner);
  } catch (error) {
    console.error('Error creating prisoner:', error);
    res.status(500).json({ error: 'Failed to create prisoner' });
  }
});

// Initialize the application
initializeApp();

// Add demonstration query endpoints
app.get('/api/demo/occupancy', async (req, res) => {
  try {
    const data = await Queries.getOccupancyByBlock();
    res.json(data);
  } catch (error) {
    console.error('Error getting occupancy data:', error);
    res.status(500).json({ error: 'Failed to get occupancy data' });
  }
});

app.get('/api/demo/parole', async (req, res) => {
  try {
    const data = await Queries.getUpcomingParoleEligibility();
    res.json(data);
  } catch (error) {
    console.error('Error getting parole data:', error);
    res.status(500).json({ error: 'Failed to get parole data' });
  }
});

app.get('/api/demo/offenses', async (req, res) => {
  try {
    const data = await Queries.getOffenseStatistics();
    res.json(data);
  } catch (error) {
    console.error('Error getting offense data:', error);
    res.status(500).json({ error: 'Failed to get offense data' });
  }
});

app.get('/api/demo/length-of-stay', async (req, res) => {
  try {
    const data = await Queries.getPrisonerLengthOfStay();
    res.json(data);
  } catch (error) {
    console.error('Error getting length of stay data:', error);
    res.status(500).json({ error: 'Failed to get length of stay data' });
  }
});

app.get('/api/demo/behavior', async (req, res) => {
  try {
    const data = await Queries.getBehaviorRatingDistribution();
    res.json(data);
  } catch (error) {
    console.error('Error getting behavior data:', error);
    res.status(500).json({ error: 'Failed to get behavior data' });
  }
});

app.get('/api/demo/offense-percentages', async (req, res) => {
  try {
    const data = await Queries.getOffensePercentageDistribution();
    res.json(data);
  } catch (error) {
    console.error('Error getting offense percentage data:', error);
    res.status(500).json({ error: 'Failed to get offense percentage data' });
  }
}); 