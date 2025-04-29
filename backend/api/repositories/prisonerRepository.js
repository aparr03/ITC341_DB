/**
 * Prisoner Repository
 * 
 * This module handles all database operations related to prisoners.
 * It provides methods to create, read, update, and delete prisoner records,
 * as well as more advanced operations like filtering and searching.
 */

const db = require('../db');
const { Prisoner } = require('../models');
const oracledb = require('oracledb');

/**
 * Get all prisoners from the database
 * @returns {Promise<Array>} Array of Prisoner objects
 */
async function getAllPrisoners() {
  const sql = `
    SELECT *
    FROM Prisoner
    ORDER BY prisoner_id
  `;
  
  try {
    const result = await db.execute(sql);
    return result.rows.map(row => mapToPrisoner(row));
  } catch (err) {
    console.error('Error in getAllPrisoners:', err);
    throw err;
  }
}

/**
 * Get a prisoner by ID
 * @param {number} id - Prisoner ID
 * @returns {Promise<Object|null>} Prisoner object or null if not found
 */
async function getPrisonerById(id) {
  const sql = `
    SELECT *
    FROM Prisoner
    WHERE prisoner_id = :id
  `;
  
  try {
    const result = await db.execute(sql, { id });
    if (result.rows.length === 0) {
      return null;
    }
    
    return mapToPrisoner(result.rows[0]);
  } catch (err) {
    console.error(`Error in getPrisonerById for id ${id}:`, err);
    throw err;
  }
}

/**
 * Add a new prisoner to the database
 * @param {Object} prisoner - Prisoner data
 * @returns {Promise<Object>} Created prisoner with ID
 */
async function addPrisoner(prisoner) {
  // Get next value from sequence
  const seqSql = `SELECT prisoner_id_seq.NEXTVAL FROM DUAL`;
  const seqResult = await db.execute(seqSql);
  const prisonerId = seqResult.rows[0].NEXTVAL;
  
  const sql = `
    INSERT INTO Prisoner (
      prisoner_id, cellblock_id, fName, lName, date_of_birth, Gender, 
      offense, sentence, admission_date, release_date, behavior_rating, parole_status
    ) VALUES (
      :prisoner_id, :cellblock_id, :fName, :lName, TO_DATE(:date_of_birth, 'YYYY-MM-DD'), 
      :gender, :offense, :sentence, 
      TO_TIMESTAMP(:admission_date, 'YYYY-MM-DD HH24:MI:SS'), 
      TO_TIMESTAMP(:release_date, 'YYYY-MM-DD HH24:MI:SS'), 
      :behavior_rating, :parole_status
    )
  `;
  
  try {
    // Format dates for Oracle
    const admissionDate = formatDateForOracle(prisoner.admission_date);
    const releaseDate = formatDateForOracle(prisoner.release_date);
    
    const binds = {
      prisoner_id: prisonerId,
      cellblock_id: prisoner.cellblock_id,
      fName: prisoner.fName,
      lName: prisoner.lName,
      date_of_birth: prisoner.date_of_birth,
      gender: prisoner.gender,
      offense: prisoner.offense,
      sentence: prisoner.sentence,
      admission_date: admissionDate,
      release_date: releaseDate,
      behavior_rating: prisoner.behavior_rating,
      parole_status: prisoner.parole_status
    };
    
    // Force autoCommit to true to ensure changes are persisted
    await db.execute(sql, binds, { autoCommit: true });
    
    console.log(`Prisoner with ID ${prisonerId} added and committed to database`);
    
    // Set the generated ID on the prisoner object
    prisoner.prisoner_id = prisonerId;
    return prisoner;
  } catch (err) {
    console.error('Error in addPrisoner:', err);
    throw err;
  }
}

/**
 * Update an existing prisoner
 * @param {number} id - Prisoner ID 
 * @param {Object} prisoner - Updated prisoner data
 * @returns {Promise<Object>} Updated prisoner
 */
async function updatePrisoner(id, prisoner) {
  const sql = `
    UPDATE Prisoner SET
      cellblock_id = :cellblock_id,
      fName = :fName,
      lName = :lName,
      date_of_birth = TO_DATE(:date_of_birth, 'YYYY-MM-DD'),
      Gender = :gender,
      offense = :offense,
      sentence = :sentence,
      admission_date = TO_TIMESTAMP(:admission_date, 'YYYY-MM-DD HH24:MI:SS'),
      release_date = TO_TIMESTAMP(:release_date, 'YYYY-MM-DD HH24:MI:SS'),
      behavior_rating = :behavior_rating,
      parole_status = :parole_status
    WHERE prisoner_id = :prisoner_id
  `;
  
  try {
    // Format dates for Oracle
    const admissionDate = formatDateForOracle(prisoner.admission_date);
    const releaseDate = formatDateForOracle(prisoner.release_date);
    
    const binds = {
      prisoner_id: id,
      cellblock_id: prisoner.cellblock_id,
      fName: prisoner.fName,
      lName: prisoner.lName,
      date_of_birth: prisoner.date_of_birth,
      gender: prisoner.gender,
      offense: prisoner.offense,
      sentence: prisoner.sentence,
      admission_date: admissionDate,
      release_date: releaseDate,
      behavior_rating: prisoner.behavior_rating,
      parole_status: prisoner.parole_status
    };
    
    // Force autoCommit to true to ensure changes are persisted
    const result = await db.execute(sql, binds, { autoCommit: true });
    
    console.log(`Prisoner with ID ${id} updated and committed to database`);
    
    if (result.rowsAffected === 0) {
      throw new Error(`Prisoner with ID ${id} not found`);
    }
    
    // Set the ID on the prisoner object
    prisoner.prisoner_id = parseInt(id);
    return prisoner;
  } catch (err) {
    console.error(`Error in updatePrisoner for id ${id}:`, err);
    throw err;
  }
}

/**
 * Delete a prisoner
 * @param {number} id - Prisoner ID
 * @returns {Promise<Object>} Object containing the deleted ID
 */
async function deletePrisoner(id) {
  const sql = `
    DELETE FROM Prisoner
    WHERE prisoner_id = :id
  `;
  
  try {
    // Force autoCommit to true to ensure changes are persisted
    const result = await db.execute(sql, { id }, { autoCommit: true });
    
    console.log(`Prisoner with ID ${id} deleted and committed to database`);
    
    if (result.rowsAffected === 0) {
      throw new Error(`Prisoner with ID ${id} not found`);
    }
    
    return { prisoner_id: parseInt(id) };
  } catch (err) {
    console.error(`Error in deletePrisoner for id ${id}:`, err);
    throw err;
  }
}

/**
 * Search for prisoners based on criteria
 * @param {Object} criteria - Search criteria
 * @returns {Promise<Array>} Array of matching Prisoner objects
 */
async function searchPrisoners(criteria) {
  let sql = `
    SELECT *
    FROM Prisoner
    WHERE 1=1
  `;
  
  const binds = {};
  
  if (criteria.name) {
    sql += ` AND (UPPER(fName) LIKE UPPER('%' || :name || '%') OR UPPER(lName) LIKE UPPER('%' || :name || '%'))`;
    binds.name = criteria.name;
  }
  
  if (criteria.cellblock_id) {
    sql += ` AND cellblock_id = :cellblock_id`;
    binds.cellblock_id = criteria.cellblock_id;
  }
  
  if (criteria.offense) {
    sql += ` AND UPPER(offense) LIKE UPPER('%' || :offense || '%')`;
    binds.offense = criteria.offense;
  }
  
  if (criteria.parole_status) {
    sql += ` AND UPPER(parole_status) = UPPER(:parole_status)`;
    binds.parole_status = criteria.parole_status;
  }
  
  sql += ` ORDER BY prisoner_id`;
  
  try {
    const result = await db.execute(sql, binds);
    return result.rows.map(row => mapToPrisoner(row));
  } catch (err) {
    console.error('Error in searchPrisoners:', err);
    throw err;
  }
}

/**
 * Helper function to map database row to Prisoner object
 * @param {Object} row - Database row
 * @returns {Object} Prisoner object
 */
function mapToPrisoner(row) {
  return new Prisoner({
    prisoner_id: row.PRISONER_ID,
    cellblock_id: row.CELLBLOCK_ID,
    fName: row.FNAME,
    lName: row.LNAME,
    date_of_birth: row.DATE_OF_BIRTH ? new Date(row.DATE_OF_BIRTH).toISOString().split('T')[0] : null,
    gender: row.GENDER,
    offense: row.OFFENSE,
    sentence: row.SENTENCE,
    admission_date: row.ADMISSION_DATE ? new Date(row.ADMISSION_DATE).toISOString() : null,
    release_date: row.RELEASE_DATE ? new Date(row.RELEASE_DATE).toISOString() : null,
    behavior_rating: row.BEHAVIOR_RATING,
    parole_status: row.PAROLE_STATUS
  });
}

/**
 * Format a date for Oracle
 * @param {string} dateString - Date string from API
 * @returns {string} Formatted date string
 */
function formatDateForOracle(dateString) {
  if (!dateString) return null;
  
  // If it's just a date without time, add default time
  if (dateString.length === 10) { // YYYY-MM-DD
    return dateString + ' 00:00:00';
  }
  
  // Try to format ISO date string to Oracle format
  try {
    const date = new Date(dateString);
    return date.toISOString().replace('T', ' ').split('.')[0];
  } catch (e) {
    return dateString;
  }
}

module.exports = {
  getAllPrisoners,
  getPrisonerById,
  addPrisoner,
  updatePrisoner,
  deletePrisoner,
  searchPrisoners
}; 