/**
 * Prisoner Repository
 * 
 * This module handles all database operations related to prisoners.
 * It provides methods to create, read, update, and delete prisoner records,
 * as well as more advanced operations like filtering and searching.
 */

const { execute } = require('../db');
const oracledb = require('oracledb');

class PrisonerRepository {
  static async getAll() {
    console.log('PrisonerRepository: Executing getAll query...');
    const sql = `
      SELECT 
        p.prisoner_id,
        p.fName, 
        p.lName,
        p.date_of_birth,
        p.gender,
        p.offense,
        p.sentence,
        p.admission_date,
        p.release_date,
        p.behavior_rating,
        p.parole_status,
        p.cellblock_id,
        cb.cellblock_name
      FROM Prisoner p
      LEFT JOIN Cell_Block cb ON p.cellblock_id = cb.cellblock_id
      ORDER BY p.prisoner_id
    `;
    console.log('SQL Query:', sql);
    const result = await execute(sql);
    console.log(`PrisonerRepository: Retrieved ${result.rows.length} rows`);
    
    if (result.rows.length > 0) {
      // Process the rows to ensure consistent uppercase keys
      const processedRows = result.rows.map(row => {
        const newRow = {};
        // Map each key to its uppercase version
        newRow.PRISONER_ID = row.PRISONER_ID;
        newRow.FNAME = row.FNAME;
        newRow.LNAME = row.LNAME;
        newRow.DATE_OF_BIRTH = row.DATE_OF_BIRTH;
        newRow.GENDER = row.GENDER;
        newRow.OFFENSE = row.OFFENSE;
        newRow.SENTENCE = row.SENTENCE;
        newRow.ADMISSION_DATE = row.ADMISSION_DATE;
        newRow.RELEASE_DATE = row.RELEASE_DATE;
        newRow.BEHAVIOR_RATING = row.BEHAVIOR_RATING;
        newRow.PAROLE_STATUS = row.PAROLE_STATUS;
        newRow.CELLBLOCK_ID = row.CELLBLOCK_ID;
        newRow.CELLBLOCK_NAME = row.CELLBLOCK_NAME;
        
        return newRow;
      });
      
      console.log('Processed data sample:', JSON.stringify(processedRows[0], null, 2));
      return processedRows;
    }
    
    return result.rows;
  }

  static async getById(prisonerId) {
    console.log(`PrisonerRepository: Getting prisoner with ID ${prisonerId}`);
    const sql = `
      SELECT 
        p.prisoner_id,
        p.fName, 
        p.lName,
        p.date_of_birth,
        p.gender,
        p.offense,
        p.sentence,
        p.admission_date,
        p.release_date,
        p.behavior_rating,
        p.parole_status,
        p.cellblock_id,
        cb.cellblock_name
      FROM Prisoner p
      LEFT JOIN Cell_Block cb ON p.cellblock_id = cb.cellblock_id
      WHERE p.prisoner_id = :prisonerId
    `;
    console.log('SQL Query:', sql);
    console.log('Parameters:', { prisonerId });
    const result = await execute(sql, { prisonerId });
    
    if (result.rows.length > 0) {
      // Process the row to ensure consistent uppercase keys
      const row = result.rows[0];
      const processedRow = {};
      
      // Map each key to its uppercase version
      processedRow.PRISONER_ID = row.PRISONER_ID;
      processedRow.FNAME = row.FNAME;
      processedRow.LNAME = row.LNAME;
      processedRow.DATE_OF_BIRTH = row.DATE_OF_BIRTH;
      processedRow.GENDER = row.GENDER;
      processedRow.OFFENSE = row.OFFENSE;
      processedRow.SENTENCE = row.SENTENCE;
      processedRow.ADMISSION_DATE = row.ADMISSION_DATE;
      processedRow.RELEASE_DATE = row.RELEASE_DATE;
      processedRow.BEHAVIOR_RATING = row.BEHAVIOR_RATING;
      processedRow.PAROLE_STATUS = row.PAROLE_STATUS;
      processedRow.CELLBLOCK_ID = row.CELLBLOCK_ID;
      processedRow.CELLBLOCK_NAME = row.CELLBLOCK_NAME;
      
      console.log('Processed row data:', JSON.stringify(processedRow, null, 2));
      return processedRow;
    }
    
    console.log('Query result: No prisoner found');
    return null;
  }

  static async create(prisoner) {
    try {
      console.log('PrisonerRepository: Creating new prisoner');
      console.log('Input data:', prisoner);
      
      const sql = `
        INSERT INTO Prisoner (
          prisoner_id, cellblock_id, fName, lName, date_of_birth, 
          gender, offense, sentence, admission_date, release_date, 
          behavior_rating, parole_status
        ) VALUES (
          prisoner_id_seq.NEXTVAL, :cellblock_id, :fName, :lName, 
          TO_DATE(:date_of_birth, 'YYYY-MM-DD'), :gender, :offense, 
          :sentence, TO_DATE(:admission_date, 'YYYY-MM-DD'), 
          TO_DATE(:release_date, 'YYYY-MM-DD'), :behavior_rating, 
          :parole_status
        )
        RETURNING prisoner_id INTO :outId
      `;
      
      console.log('SQL Query:', sql);
      
      const binds = {
        cellblock_id: prisoner.cellblock_id,
        fName: prisoner.fName,
        lName: prisoner.lName,
        date_of_birth: prisoner.date_of_birth,
        gender: prisoner.gender,
        offense: prisoner.offense,
        sentence: prisoner.sentence,
        admission_date: prisoner.admission_date,
        release_date: prisoner.release_date,
        behavior_rating: prisoner.behavior_rating,
        parole_status: prisoner.parole_status,
        outId: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
      };
      
      console.log('Bind parameters:', binds);
      
      const result = await execute(sql, binds);
      console.log('Insert result:', result);
      console.log('New prisoner ID:', result.outBinds.outId[0]);
      
      return result.outBinds.outId[0];
    } catch (error) {
      console.error('PrisonerRepository: Error in create:', error);
      console.error('SQL Error Code:', error.errorNum);
      console.error('SQL Error Message:', error.message);
      throw error;
    }
  }

  static async update(prisonerId, prisoner) {
    console.log(`PrisonerRepository: Updating prisoner ${prisonerId}`);
    console.log('Update data:', prisoner);
    
    const sql = `
      UPDATE Prisoner
      SET 
        cellblock_id = :cellblock_id,
        fName = :fName,
        lName = :lName,
        date_of_birth = TO_DATE(:date_of_birth, 'YYYY-MM-DD'),
        gender = :gender,
        offense = :offense,
        sentence = :sentence,
        admission_date = TO_DATE(:admission_date, 'YYYY-MM-DD'),
        release_date = TO_DATE(:release_date, 'YYYY-MM-DD'),
        behavior_rating = :behavior_rating,
        parole_status = :parole_status
      WHERE prisoner_id = :prisonerId
    `;
    
    console.log('SQL Query:', sql);
    console.log('Parameters:', { ...prisoner, prisonerId });
    
    const result = await execute(sql, { ...prisoner, prisonerId });
    console.log('Update result:', result);
    return prisonerId;
  }

  static async delete(prisonerId) {
    console.log(`PrisonerRepository: Deleting prisoner ${prisonerId}`);
    const sql = 'DELETE FROM Prisoner WHERE prisoner_id = :prisonerId';
    console.log('SQL Query:', sql);
    console.log('Parameters:', { prisonerId });
    const result = await execute(sql, { prisonerId });
    console.log('Delete result:', result);
    return prisonerId;
  }
}

module.exports = PrisonerRepository; 