/**
 * Parole Repository
 * 
 * This module handles all database operations related to parole records.
 * It provides methods to create, read, update, and delete parole records.
 */

const db = require('../db');
const { Parole } = require('../models');

/**
 * Get all parole records
 * @returns {Promise<Array>} Array of Parole objects
 */
async function getAllParoles() {
  const sql = `
    SELECT p.*, 
           pr.fname, pr.lname
    FROM Parole p
    JOIN Prisoner pr ON p.prisoner_id = pr.prisoner_id
    ORDER BY p.parole_id
  `;
  
  try {
    const result = await db.execute(sql);
    return result.rows.map(row => {
      const parole = mapToParole(row);
      // Add prisoner name information
      parole.prisoner_name = `${row.FNAME} ${row.LNAME}`;
      return parole;
    });
  } catch (err) {
    console.error('Error in getAllParoles:', err);
    throw err;
  }
}

/**
 * Get parole records for a specific prisoner
 * @param {number} prisonerId - Prisoner ID
 * @returns {Promise<Array>} Array of Parole objects
 */
async function getParolesByPrisonerId(prisonerId) {
  const sql = `
    SELECT p.*, 
           pr.fname, pr.lname
    FROM Parole p
    JOIN Prisoner pr ON p.prisoner_id = pr.prisoner_id
    WHERE p.prisoner_id = :prisonerId
    ORDER BY p.review_date DESC
  `;
  
  try {
    const result = await db.execute(sql, { prisonerId });
    return result.rows.map(row => {
      const parole = mapToParole(row);
      // Add prisoner name information
      parole.prisoner_name = `${row.FNAME} ${row.LNAME}`;
      return parole;
    });
  } catch (err) {
    console.error(`Error in getParolesByPrisonerId for id ${prisonerId}:`, err);
    throw err;
  }
}

/**
 * Get a parole record by ID
 * @param {string} id - Parole ID
 * @returns {Promise<Object|null>} Parole object or null if not found
 */
async function getParoleById(id) {
  const sql = `
    SELECT p.*, 
           pr.fname, pr.lname
    FROM Parole p
    JOIN Prisoner pr ON p.prisoner_id = pr.prisoner_id
    WHERE p.parole_id = :id
  `;
  
  try {
    const result = await db.execute(sql, { id });
    if (result.rows.length === 0) {
      return null;
    }
    
    const parole = mapToParole(result.rows[0]);
    // Add prisoner name information
    parole.prisoner_name = `${result.rows[0].FNAME} ${result.rows[0].LNAME}`;
    return parole;
  } catch (err) {
    console.error(`Error in getParoleById for id ${id}:`, err);
    throw err;
  }
}

/**
 * Add a new parole record
 * @param {Object} parole - Parole data
 * @returns {Promise<Object>} Created parole record
 */
async function addParole(parole) {
  const sql = `
    INSERT INTO Parole (
      parole_id, prisoner_id, status, review_date, notes
    ) VALUES (
      :parole_id, :prisoner_id, :status, TO_DATE(:review_date, 'YYYY-MM-DD'), :notes
    )
  `;
  
  try {
    const binds = {
      parole_id: parole.parole_id,
      prisoner_id: parole.prisoner_id,
      status: parole.status,
      review_date: parole.review_date,
      notes: parole.notes
    };
    
    await db.execute(sql, binds);
    
    // Update prisoner's parole status if needed
    if (parole.update_prisoner_status) {
      await updatePrisonerParoleStatus(parole.prisoner_id, parole.status);
    }
    
    return parole;
  } catch (err) {
    console.error('Error in addParole:', err);
    throw err;
  }
}

/**
 * Update an existing parole record
 * @param {string} id - Parole ID
 * @param {Object} parole - Updated parole data
 * @returns {Promise<Object>} Updated parole record
 */
async function updateParole(id, parole) {
  const sql = `
    UPDATE Parole SET
      prisoner_id = :prisoner_id,
      status = :status,
      review_date = TO_DATE(:review_date, 'YYYY-MM-DD'),
      notes = :notes
    WHERE parole_id = :parole_id
  `;
  
  try {
    const binds = {
      parole_id: id,
      prisoner_id: parole.prisoner_id,
      status: parole.status,
      review_date: parole.review_date,
      notes: parole.notes
    };
    
    const result = await db.execute(sql, binds);
    
    if (result.rowsAffected === 0) {
      throw new Error(`Parole record with ID ${id} not found`);
    }
    
    // Update prisoner's parole status if needed
    if (parole.update_prisoner_status) {
      await updatePrisonerParoleStatus(parole.prisoner_id, parole.status);
    }
    
    parole.parole_id = id;
    return parole;
  } catch (err) {
    console.error(`Error in updateParole for id ${id}:`, err);
    throw err;
  }
}

/**
 * Delete a parole record
 * @param {string} id - Parole ID
 * @returns {Promise<Object>} Object containing the deleted ID
 */
async function deleteParole(id) {
  const sql = `
    DELETE FROM Parole
    WHERE parole_id = :id
  `;
  
  try {
    const result = await db.execute(sql, { id });
    
    if (result.rowsAffected === 0) {
      throw new Error(`Parole record with ID ${id} not found`);
    }
    
    return { parole_id: id };
  } catch (err) {
    console.error(`Error in deleteParole for id ${id}:`, err);
    throw err;
  }
}

/**
 * Update a prisoner's parole status
 * @param {number} prisonerId - Prisoner ID
 * @param {string} paroleStatus - New parole status
 * @returns {Promise<void>}
 */
async function updatePrisonerParoleStatus(prisonerId, paroleStatus) {
  const sql = `
    UPDATE Prisoner
    SET parole_status = :paroleStatus
    WHERE prisoner_id = :prisonerId
  `;
  
  try {
    await db.execute(sql, { prisonerId, paroleStatus });
  } catch (err) {
    console.error(`Error updating prisoner parole status for ID ${prisonerId}:`, err);
    throw err;
  }
}

/**
 * Helper function to map database row to Parole object
 * @param {Object} row - Database row
 * @returns {Object} Parole object
 */
function mapToParole(row) {
  return new Parole({
    parole_id: row.PAROLE_ID,
    prisoner_id: row.PRISONER_ID,
    status: row.STATUS,
    review_date: row.REVIEW_DATE ? new Date(row.REVIEW_DATE).toISOString().split('T')[0] : null,
    notes: row.NOTES
  });
}

module.exports = {
  getAllParoles,
  getParolesByPrisonerId,
  getParoleById,
  addParole,
  updateParole,
  deleteParole
}; 