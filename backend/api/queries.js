/**
 * Demonstration Queries for Prison Database
 * 
 * This module contains specialized SQL queries that provide useful insights
 * about the prison database. These queries can be used to demonstrate the
 * capabilities of the database to supervisors.
 * 
 * Each query is documented with its purpose and the expected output format.
 */

const db = require('./db');

/**
 * Query 1: Get occupancy statistics by cell block
 * 
 * Purpose: Shows capacity utilization for each cell block with percentage
 * 
 * @returns {Promise<Array>} Array of cell blocks with occupancy statistics
 */
async function getOccupancyByBlock() {
  const sql = `
    SELECT 
      cb.cellblock_id,
      cb.cellblock_name,
      cb.max_capacity,
      cb.current_capacity,
      COUNT(p.prisoner_id) AS prisoner_count,
      ROUND((COUNT(p.prisoner_id) / cb.max_capacity) * 100, 2) AS occupancy_percentage
    FROM 
      Cell_Block cb
    LEFT JOIN 
      Prisoner p ON cb.cellblock_id = p.cellblock_id
    GROUP BY 
      cb.cellblock_id, cb.cellblock_name, cb.max_capacity, cb.current_capacity
    ORDER BY 
      occupancy_percentage DESC
  `;
  
  try {
    const result = await db.execute(sql);
    return result.rows.map(row => ({
      cellblock_id: row.CELLBLOCK_ID,
      name: row.CELLBLOCK_NAME,
      max_capacity: row.MAX_CAPACITY,
      current_capacity: row.CURRENT_CAPACITY,
      prisoner_count: row.PRISONER_COUNT,
      occupancy_percentage: row.OCCUPANCY_PERCENTAGE
    }));
  } catch (err) {
    console.error('Error in getOccupancyByBlock:', err);
    throw err;
  }
}

/**
 * Query 2: Get prisoners eligible for parole within the next 6 months
 * 
 * Purpose: Identifies prisoners that will be eligible for parole review soon
 * 
 * @returns {Promise<Array>} Array of prisoners eligible for parole
 */
async function getUpcomingParoleEligibility() {
  const sql = `
    SELECT 
      p.prisoner_id,
      p.fname || ' ' || p.lname AS prisoner_name,
      p.offense,
      p.sentence,
      p.admission_date,
      p.release_date,
      p.behavior_rating,
      p.parole_status,
      cb.cellblock_name
    FROM 
      Prisoner p
    JOIN 
      Cell_Block cb ON p.cellblock_id = cb.cellblock_id
    WHERE 
      (p.parole_status = 'Eligible' OR p.parole_status = 'Pending')
      AND p.release_date <= ADD_MONTHS(SYSDATE, 6)
      AND p.release_date > SYSDATE
    ORDER BY 
      p.release_date
  `;
  
  try {
    const result = await db.execute(sql);
    return result.rows.map(row => ({
      prisoner_id: row.PRISONER_ID,
      prisoner_name: row.PRISONER_NAME,
      offense: row.OFFENSE,
      sentence: row.SENTENCE,
      admission_date: row.ADMISSION_DATE ? new Date(row.ADMISSION_DATE).toISOString() : null,
      release_date: row.RELEASE_DATE ? new Date(row.RELEASE_DATE).toISOString() : null,
      behavior_rating: row.BEHAVIOR_RATING,
      parole_status: row.PAROLE_STATUS,
      cellblock_name: row.CELLBLOCK_NAME
    }));
  } catch (err) {
    console.error('Error in getUpcomingParoleEligibility:', err);
    throw err;
  }
}

/**
 * Query 3: Get statistics on offense types
 * 
 * Purpose: Provides a breakdown of the prison population by offense type
 * 
 * @returns {Promise<Array>} Array of offense types with counts and percentages
 */
async function getOffenseStatistics() {
  const sql = `
    SELECT 
      offense,
      COUNT(*) as count,
      ROUND((COUNT(*) / (SELECT COUNT(*) FROM Prisoner)) * 100, 2) AS percentage
    FROM 
      Prisoner
    GROUP BY 
      offense
    ORDER BY 
      count DESC
  `;
  
  try {
    const result = await db.execute(sql);
    return result.rows.map(row => ({
      offense: row.OFFENSE,
      count: row.COUNT,
      percentage: row.PERCENTAGE
    }));
  } catch (err) {
    console.error('Error in getOffenseStatistics:', err);
    throw err;
  }
}

/**
 * Query 4: Get prisoner length of stay statistics
 * 
 * Purpose: Analyzes the current and projected length of stay for prisoners
 * 
 * @returns {Promise<Array>} Array of prisoners with length of stay information
 */
async function getPrisonerLengthOfStay() {
  const sql = `
    SELECT 
      p.prisoner_id,
      p.fname || ' ' || p.lname AS prisoner_name,
      p.offense,
      p.admission_date,
      p.release_date,
      ROUND((p.release_date - p.admission_date) / 365, 2) AS total_years,
      ROUND((SYSDATE - p.admission_date) / 365, 2) AS years_served,
      ROUND((p.release_date - SYSDATE) / 365, 2) AS years_remaining,
      ROUND(((SYSDATE - p.admission_date) / (p.release_date - p.admission_date)) * 100, 2) AS percentage_served
    FROM 
      Prisoner p
    WHERE 
      p.release_date > SYSDATE
    ORDER BY 
      percentage_served DESC
  `;
  
  try {
    const result = await db.execute(sql);
    return result.rows.map(row => ({
      prisoner_id: row.PRISONER_ID,
      prisoner_name: row.PRISONER_NAME,
      offense: row.OFFENSE,
      admission_date: row.ADMISSION_DATE ? new Date(row.ADMISSION_DATE).toISOString() : null,
      release_date: row.RELEASE_DATE ? new Date(row.RELEASE_DATE).toISOString() : null,
      total_years: row.TOTAL_YEARS,
      years_served: row.YEARS_SERVED,
      years_remaining: row.YEARS_REMAINING,
      percentage_served: row.PERCENTAGE_SERVED
    }));
  } catch (err) {
    console.error('Error in getPrisonerLengthOfStay:', err);
    throw err;
  }
}

/**
 * Query 5: Get behavior rating distribution
 * 
 * Purpose: Shows distribution of prisoner behavior ratings
 * 
 * @returns {Promise<Array>} Array with behavior rating distribution
 */
async function getBehaviorRatingDistribution() {
  const sql = `
    SELECT 
      behavior_rating,
      COUNT(*) as count,
      ROUND((COUNT(*) / (SELECT COUNT(*) FROM Prisoner WHERE behavior_rating IS NOT NULL)) * 100, 2) AS percentage
    FROM 
      Prisoner
    WHERE 
      behavior_rating IS NOT NULL
    GROUP BY 
      behavior_rating
    ORDER BY 
      behavior_rating DESC
  `;
  
  try {
    const result = await db.execute(sql);
    return result.rows.map(row => ({
      behavior_rating: row.BEHAVIOR_RATING,
      count: row.COUNT,
      percentage: row.PERCENTAGE
    }));
  } catch (err) {
    console.error('Error in getBehaviorRatingDistribution:', err);
    throw err;
  }
}

module.exports = {
  getOccupancyByBlock,
  getUpcomingParoleEligibility,
  getOffenseStatistics,
  getPrisonerLengthOfStay,
  getBehaviorRatingDistribution
};