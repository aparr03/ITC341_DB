/**
 * CellBlock Repository
 * 
 * This module handles all database operations related to cell blocks.
 * It provides methods to create, read, update, and delete cell block records.
 */

const db = require('../db');
const { CellBlock } = require('../models');

/**
 * Get all cell blocks
 * @returns {Promise<Array>} Array of CellBlock objects
 */
async function getAllCellBlocks() {
  const sql = `
    SELECT *
    FROM Cell_Block
    ORDER BY cellblock_id
  `;
  
  try {
    const result = await db.execute(sql);
    return result.rows.map(row => mapToCellBlock(row));
  } catch (err) {
    console.error('Error in getAllCellBlocks:', err);
    throw err;
  }
}

/**
 * Get a cell block by ID
 * @param {string} id - Cell block ID
 * @returns {Promise<Object|null>} CellBlock object or null if not found
 */
async function getCellBlockById(id) {
  const sql = `
    SELECT *
    FROM Cell_Block
    WHERE cellblock_id = :id
  `;
  
  try {
    const result = await db.execute(sql, { id });
    if (result.rows.length === 0) {
      return null;
    }
    
    return mapToCellBlock(result.rows[0]);
  } catch (err) {
    console.error(`Error in getCellBlockById for id ${id}:`, err);
    throw err;
  }
}

/**
 * Add a new cell block
 * @param {Object} cellBlock - Cell block data
 * @returns {Promise<Object>} Created cell block
 */
async function addCellBlock(cellBlock) {
  const sql = `
    INSERT INTO Cell_Block (
      cellblock_id, cellblock_name, max_capacity, current_capacity
    ) VALUES (
      :cellblock_id, :cellblock_name, :max_capacity, :current_capacity
    )
  `;
  
  try {
    const binds = {
      cellblock_id: cellBlock.cellblock_id,
      cellblock_name: cellBlock.name,
      max_capacity: cellBlock.max_capacity,
      current_capacity: cellBlock.current_capacity || 0
    };
    
    await db.execute(sql, binds);
    return cellBlock;
  } catch (err) {
    console.error('Error in addCellBlock:', err);
    throw err;
  }
}

/**
 * Update an existing cell block
 * @param {string} id - Cell block ID
 * @param {Object} cellBlock - Updated cell block data
 * @returns {Promise<Object>} Updated cell block
 */
async function updateCellBlock(id, cellBlock) {
  const sql = `
    UPDATE Cell_Block SET
      cellblock_name = :cellblock_name,
      max_capacity = :max_capacity,
      current_capacity = :current_capacity
    WHERE cellblock_id = :cellblock_id
  `;
  
  try {
    const binds = {
      cellblock_id: id,
      cellblock_name: cellBlock.name,
      max_capacity: cellBlock.max_capacity,
      current_capacity: cellBlock.current_capacity
    };
    
    const result = await db.execute(sql, binds);
    
    if (result.rowsAffected === 0) {
      throw new Error(`Cell block with ID ${id} not found`);
    }
    
    cellBlock.cellblock_id = id;
    return cellBlock;
  } catch (err) {
    console.error(`Error in updateCellBlock for id ${id}:`, err);
    throw err;
  }
}

/**
 * Delete a cell block
 * @param {string} id - Cell block ID
 * @returns {Promise<Object>} Object containing the deleted ID
 */
async function deleteCellBlock(id) {
  const sql = `
    DELETE FROM Cell_Block
    WHERE cellblock_id = :id
  `;
  
  try {
    const result = await db.execute(sql, { id });
    
    if (result.rowsAffected === 0) {
      throw new Error(`Cell block with ID ${id} not found`);
    }
    
    return { cellblock_id: id };
  } catch (err) {
    console.error(`Error in deleteCellBlock for id ${id}:`, err);
    throw err;
  }
}

/**
 * Get occupancy information for all cell blocks
 * @returns {Promise<Array>} Array of cell blocks with occupancy data
 */
async function getCellBlockOccupancy() {
  const sql = `
    SELECT 
      cb.cellblock_id,
      cb.cellblock_name,
      cb.max_capacity,
      cb.current_capacity,
      COUNT(p.prisoner_id) AS prisoner_count
    FROM 
      Cell_Block cb
    LEFT JOIN 
      Prisoner p ON cb.cellblock_id = p.cellblock_id
    GROUP BY 
      cb.cellblock_id, cb.cellblock_name, cb.max_capacity, cb.current_capacity
    ORDER BY 
      cb.cellblock_id
  `;
  
  try {
    const result = await db.execute(sql);
    return result.rows.map(row => ({
      cellblock_id: row.CELLBLOCK_ID,
      name: row.CELLBLOCK_NAME,
      max_capacity: row.MAX_CAPACITY,
      current_capacity: row.CURRENT_CAPACITY,
      prisoner_count: row.PRISONER_COUNT
    }));
  } catch (err) {
    console.error('Error in getCellBlockOccupancy:', err);
    throw err;
  }
}

/**
 * Helper function to map database row to CellBlock object
 * @param {Object} row - Database row
 * @returns {Object} CellBlock object
 */
function mapToCellBlock(row) {
  return new CellBlock({
    cellblock_id: row.CELLBLOCK_ID,
    name: row.CELLBLOCK_NAME,
    max_capacity: row.MAX_CAPACITY,
    current_capacity: row.CURRENT_CAPACITY
  });
}

module.exports = {
  getAllCellBlocks,
  getCellBlockById,
  addCellBlock,
  updateCellBlock,
  deleteCellBlock,
  getCellBlockOccupancy
}; 