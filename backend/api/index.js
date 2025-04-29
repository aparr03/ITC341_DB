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

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Database connection
const db = require('./db');

// Repositories
const prisonerRepository = require('./repositories/prisonerRepository');
const cellBlockRepository = require('./repositories/cellBlockRepository');
const cellRepository = require('./repositories/cellRepository');
const paroleRepository = require('./repositories/paroleRepository');

// Demonstration queries
const queries = require('./queries');

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database connection on startup
async function initializeApp() {
  try {
    await db.initialize();
    console.log('Database connection initialized successfully');
    
    // Start listening for requests once database is connected
    const PORT = process.env.PORT || 4000;
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
    await db.close();
    console.log('Database connection closed');
    process.exit(0);
  } catch (err) {
    console.error('Error during shutdown:', err);
    process.exit(1);
  }
});

// API Routes

// Prisoner routes
app.get('/api/prisoners', async (req, res) => {
  try {
    const search = req.query.search;
    
    // If search query is provided, use search function
    if (search) {
      const criteria = {};
      
      if (search.name) criteria.name = search.name;
      if (search.cellblock_id) criteria.cellblock_id = search.cellblock_id;
      if (search.offense) criteria.offense = search.offense;
      if (search.parole_status) criteria.parole_status = search.parole_status;
      
      const prisoners = await prisonerRepository.searchPrisoners(criteria);
      return res.json(prisoners);
    }
    
    // Otherwise get all
    const prisoners = await prisonerRepository.getAllPrisoners();
    res.json(prisoners);
  } catch (err) {
    console.error('Error getting prisoners:', err);
    res.status(500).json({ error: 'Failed to retrieve prisoners', details: err.message });
  }
});

app.get('/api/prisoners/:id', async (req, res) => {
  try {
    const prisoner = await prisonerRepository.getPrisonerById(req.params.id);
    
    if (!prisoner) {
      return res.status(404).json({ error: 'Prisoner not found' });
    }
    
    res.json(prisoner);
  } catch (err) {
    console.error(`Error getting prisoner ${req.params.id}:`, err);
    res.status(500).json({ error: 'Failed to retrieve prisoner', details: err.message });
  }
});

app.post('/api/prisoners', async (req, res) => {
  try {
    const prisoner = await prisonerRepository.addPrisoner(req.body);
    res.status(201).json(prisoner);
  } catch (err) {
    console.error('Error adding prisoner:', err);
    res.status(500).json({ error: 'Failed to add prisoner', details: err.message });
  }
});

app.put('/api/prisoners/:id', async (req, res) => {
  try {
    const prisoner = await prisonerRepository.updatePrisoner(req.params.id, req.body);
    res.json(prisoner);
  } catch (err) {
    console.error(`Error updating prisoner ${req.params.id}:`, err);
    res.status(500).json({ error: 'Failed to update prisoner', details: err.message });
  }
});

app.delete('/api/prisoners/:id', async (req, res) => {
  try {
    await prisonerRepository.deletePrisoner(req.params.id);
    res.status(204).send();
  } catch (err) {
    console.error(`Error deleting prisoner ${req.params.id}:`, err);
    res.status(500).json({ error: 'Failed to delete prisoner', details: err.message });
  }
});

// Cell Block routes
app.get('/api/cellblocks', async (req, res) => {
  try {
    const cellBlocks = await cellBlockRepository.getAllCellBlocks();
    res.json(cellBlocks);
  } catch (err) {
    console.error('Error getting cell blocks:', err);
    res.status(500).json({ error: 'Failed to retrieve cell blocks', details: err.message });
  }
});

app.get('/api/cellblocks/:id', async (req, res) => {
  try {
    const cellBlock = await cellBlockRepository.getCellBlockById(req.params.id);
    
    if (!cellBlock) {
      return res.status(404).json({ error: 'Cell block not found' });
    }
    
    res.json(cellBlock);
  } catch (err) {
    console.error(`Error getting cell block ${req.params.id}:`, err);
    res.status(500).json({ error: 'Failed to retrieve cell block', details: err.message });
  }
});

// Cell routes
app.get('/api/cells', async (req, res) => {
  try {
    const cellblockId = req.query.cellblock_id;
    
    if (cellblockId) {
      const cells = await cellRepository.getCellsByCellBlockId(cellblockId);
      return res.json(cells);
    }
    
    const cells = await cellRepository.getAllCells();
    res.json(cells);
  } catch (err) {
    console.error('Error getting cells:', err);
    res.status(500).json({ error: 'Failed to retrieve cells', details: err.message });
  }
});

// Parole routes
app.get('/api/paroles', async (req, res) => {
  try {
    const prisonerId = req.query.prisoner_id;
    
    if (prisonerId) {
      const paroles = await paroleRepository.getParolesByPrisonerId(prisonerId);
      return res.json(paroles);
    }
    
    const paroles = await paroleRepository.getAllParoles();
    res.json(paroles);
  } catch (err) {
    console.error('Error getting parole records:', err);
    res.status(500).json({ error: 'Failed to retrieve parole records', details: err.message });
  }
});

// Demonstration Query Routes
app.get('/api/reports/occupancy', async (req, res) => {
  try {
    const data = await queries.getOccupancyByBlock();
    res.json(data);
  } catch (err) {
    console.error('Error running occupancy report:', err);
    res.status(500).json({ error: 'Failed to retrieve occupancy data', details: err.message });
  }
});

app.get('/api/reports/parole-eligibility', async (req, res) => {
  try {
    const data = await queries.getUpcomingParoleEligibility();
    res.json(data);
  } catch (err) {
    console.error('Error running parole eligibility report:', err);
    res.status(500).json({ error: 'Failed to retrieve parole eligibility data', details: err.message });
  }
});

app.get('/api/reports/offense-statistics', async (req, res) => {
  try {
    const data = await queries.getOffenseStatistics();
    res.json(data);
  } catch (err) {
    console.error('Error running offense statistics report:', err);
    res.status(500).json({ error: 'Failed to retrieve offense statistics', details: err.message });
  }
});

app.get('/api/reports/length-of-stay', async (req, res) => {
  try {
    const data = await queries.getPrisonerLengthOfStay();
    res.json(data);
  } catch (err) {
    console.error('Error running length of stay report:', err);
    res.status(500).json({ error: 'Failed to retrieve length of stay data', details: err.message });
  }
});

app.get('/api/reports/behavior-ratings', async (req, res) => {
  try {
    const data = await queries.getBehaviorRatingDistribution();
    res.json(data);
  } catch (err) {
    console.error('Error running behavior ratings report:', err);
    res.status(500).json({ error: 'Failed to retrieve behavior rating data', details: err.message });
  }
});

// Initialize the application
initializeApp(); 