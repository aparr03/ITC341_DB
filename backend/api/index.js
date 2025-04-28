const express = require('express');
const cors = require('cors');
const { Prisoner, Parole, Cell, CellBlock } = require('./models');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// In-memory stores
let prisoners = [];
let paroles = [];
let cells = [];
let cellblocks = [];

// Prisoner endpoints
app.get('/prisoners', (req, res) => res.json(prisoners));
app.post('/prisoners', (req, res) => {
  const prisoner = new Prisoner(req.body);
  prisoners.push(prisoner);
  res.status(201).json(prisoner);
});

// Parole endpoints
app.get('/paroles', (req, res) => res.json(paroles));
app.post('/paroles', (req, res) => {
  const parole = new Parole(req.body);
  paroles.push(parole);
  res.status(201).json(parole);
});

// Cell endpoints
app.get('/cells', (req, res) => res.json(cells));
app.post('/cells', (req, res) => {
  const cell = new Cell(req.body);
  cells.push(cell);
  res.status(201).json(cell);
});

// CellBlock endpoints
app.get('/cellblocks', (req, res) => res.json(cellblocks));
app.post('/cellblocks', (req, res) => {
  const cellblock = new CellBlock(req.body);
  cellblocks.push(cellblock);
  res.status(201).json(cellblock);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend API running on port ${PORT}`)); 