/**
 * Cell Repository
 * 
 * This module handles all database operations related to cells.
 * It provides methods to create, read, update, and delete cell records.
 */

const db = require('../db');
const { Cell } = require('../models');

/**
 * Get all cells
 * @returns {Promise<Array>} Array of Cell objects
 */
async function getAllCells() {
  const sql = `
    SELECT c.*, cb.cellblock_name
    FROM Cell c
    JOIN Cell_Block cb ON c.cellblock_id = cb.cellblock_id
    ORDER BY c.cell_id
  `;
  
  try {
    const result = await db.execute(sql);
    return result.rows.map(row => {
      const cell = mapToCell(row);
      cell.cellblock_name = row.CELLBLOCK_NAME;
      return cell;
    });
  } catch (err) {
    console.error('Error in getAllCells:', err);
    throw err;
  }
}

/**
 * Get cells by cellblock ID
 * @param {string} cellblockId - Cell block ID
 * @returns {Promise<Array>} Array of Cell objects in the specified cell block
 */
async function getCellsByCellBlockId(cellblockId) {
  const sql = `
    SELECT c.*, cb.cellblock_name
    FROM Cell c
    JOIN Cell_Block cb ON c.cellblock_id = cb.cellblock_id
    WHERE c.cellblock_id = :cellblockId
    ORDER BY c.cell_number
  `;
  
  try {
    const result = await db.execute(sql, { cellblockId });
    return result.rows.map(row => {
      const cell = mapToCell(row);
      cell.cellblock_name = row.CELLBLOCK_NAME;
      return cell;
    });
  } catch (err) {
    console.error(`Error in getCellsByCellBlockId for cellblock ${cellblockId}:`, err);
    throw err;
  }
}

/**
 * Get a cell by ID
 * @param {string} id - Cell ID
 * @returns {Promise<Object|null>} Cell object or null if not found
 */
async function getCellById(id) {
  const sql = `
    SELECT c.*, cb.cellblock_name
    FROM Cell c
    JOIN Cell_Block cb ON c.cellblock_id = cb.cellblock_id
    WHERE c.cell_id = :id
  `;
  
  try {
    const result = await db.execute(sql, { id });
    if (result.rows.length === 0) {
      return null;
    }
    
    const cell = mapToCell(result.rows[0]);
    cell.cellblock_name = result.rows[0].CELLBLOCK_NAME;
    return cell;
  } catch (err) {
    console.error(`Error in getCellById for id ${id}:`, err);
    throw err;
  }
}

/**
 * Add a new cell
 * @param {Object} cell - Cell data
 * @returns {Promise<Object>} Created cell
 */
async function addCell(cell) {
  const sql = `
    INSERT INTO Cell (
      cell_id, cell_number, cellblock_id, capacity, occupancy
    ) VALUES (
      :cell_id, :cell_number, :cellblock_id, :capacity, :occupancy
    )
  `;
  
  try {
    const binds = {
      cell_id: cell.cell_id,
      cell_number: cell.cell_number,
      cellblock_id: cell.cellblock_id,
      capacity: cell.capacity,
      occupancy: cell.occupancy || 0
    };
    
    await db.execute(sql, binds);
    return cell;
  } catch (err) {
    console.error('Error in addCell:', err);
    throw err;
  }
}

/**
 * Update an existing cell
 * @param {string} id - Cell ID
 * @param {Object} cell - Updated cell data
 * @returns {Promise<Object>} Updated cell
 */
async function updateCell(id, cell) {
  const sql = `
    UPDATE Cell SET
      cell_number = :cell_number,
      cellblock_id = :cellblock_id,
      capacity = :capacity,
      occupancy = :occupancy
    WHERE cell_id = :cell_id
  `;
  
  try {
    const binds = {
      cell_id: id,
      cell_number: cell.cell_number,
      cellblock_id: cell.cellblock_id,
      capacity: cell.capacity,
      occupancy: cell.occupancy
    };
    
    const result = await db.execute(sql, binds);
    
    if (result.rowsAffected === 0) {
      throw new Error(`Cell with ID ${id} not found`);
    }
    
    cell.cell_id = id;
    return cell;
  } catch (err) {
    console.error(`Error in updateCell for id ${id}:`, err);
    throw err;
  }
}

/**
 * Delete a cell
 * @param {string} id - Cell ID
 * @returns {Promise<Object>} Object containing the deleted ID
 */
async function deleteCell(id) {
  const sql = `
    DELETE FROM Cell
    WHERE cell_id = :id
  `;
  
  try {
    const result = await db.execute(sql, { id });
    
    if (result.rowsAffected === 0) {
      throw new Error(`Cell with ID ${id} not found`);
    }
    
    return { cell_id: id };
  } catch (err) {
    console.error(`Error in deleteCell for id ${id}:`, err);
    throw err;
  }
}

/**
 * Get cell occupancy information
 * @returns {Promise<Array>} Array of cells with occupancy data
 */
async function getCellOccupancy() {
  const sql = `
    SELECT 
      c.cell_id,
      c.cell_number,
      c.cellblock_id,
      cb.cellblock_name,
      c.capacity,
      c.occupancy,
      (c.capacity - c.occupancy) AS available_space
    FROM 
      Cell c
    JOIN 
      Cell_Block cb ON c.cellblock_id = cb.cellblock_id
    ORDER BY 
      c.cellblock_id, c.cell_number
  `;
  
  try {
    const result = await db.execute(sql);
    return result.rows.map(row => ({
      cell_id: row.CELL_ID,
      cell_number: row.CELL_NUMBER,
      cellblock_id: row.CELLBLOCK_ID,
      cellblock_name: row.CELLBLOCK_NAME,
      capacity: row.CAPACITY,
      occupancy: row.OCCUPANCY,
      available_space: row.AVAILABLE_SPACE
    }));
  } catch (err) {
    console.error('Error in getCellOccupancy:', err);
    throw err;
  }
}

/**
 * Helper function to map database row to Cell object
 * @param {Object} row - Database row
 * @returns {Object} Cell object
 */
function mapToCell(row) {
  return new Cell({
    cell_id: row.CELL_ID,
    cell_number: row.CELL_NUMBER,
    cellblock_id: row.CELLBLOCK_ID,
    capacity: row.CAPACITY,
    occupancy: row.OCCUPANCY
  });
}

module.exports = {
  getAllCells,
  getCellsByCellBlockId,
  getCellById,
  addCell,
  updateCell,
  deleteCell,
  getCellOccupancy
}; 