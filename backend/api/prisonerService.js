// This file would be replaced with actual Oracle DB connection code
// in a production environment using oracledb NPM package

const PrisonerRepository = require('./repositories/prisonerRepository');

class PrisonerService {
  static async getAllPrisoners() {
    try {
      console.log('Getting all prisoners from database...');
      const prisoners = await PrisonerRepository.getAll();
      console.log(`Retrieved ${prisoners.length} prisoners from database`);
      return prisoners;
    } catch (error) {
      console.error('Error in getAllPrisoners:', error);
      throw error;
    }
  }

  static async getPrisonerById(prisonerId) {
    try {
      console.log(`Getting prisoner with ID ${prisonerId} from database...`);
      const prisoner = await PrisonerRepository.getById(prisonerId);
      if (!prisoner) {
        console.log(`No prisoner found with ID ${prisonerId}`);
        throw new Error(`Prisoner with ID ${prisonerId} not found`);
      }
      console.log('Retrieved prisoner:', prisoner);
      return prisoner;
    } catch (error) {
      console.error(`Error in getPrisonerById for id ${prisonerId}:`, error);
      throw error;
    }
  }

  static async createPrisoner(prisonerData) {
    try {
      console.log('Creating new prisoner with data:', prisonerData);
      
      // Format dates to YYYY-MM-DD format for database
      const formatDate = (dateStr) => {
        if (!dateStr) return null;
        
        console.log('Formatting date:', dateStr);
        
        // Check if date is already in YYYY-MM-DD format
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
          console.log('Date is already in YYYY-MM-DD format:', dateStr);
          return dateStr;
        }
        
        // Handle MM/DD/YYYY format
        if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateStr)) {
          const [month, day, year] = dateStr.split('/');
          const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
          console.log('Formatted date from MM/DD/YYYY to YYYY-MM-DD:', formattedDate);
          return formattedDate;
        }
        
        // If we can't parse it, return as is
        console.log('Unknown date format, returning as is:', dateStr);
        return dateStr;
      };

      // Set default values for required fields
      const prisoner = {
        ...prisonerData,
        cellblock_id: prisonerData.cellblock_id || 1, // Default to cellblock 1
        gender: prisonerData.gender || 'Male', // Default to Male
        behavior_rating: prisonerData.behavior_rating || 3, // Default to 3
        parole_status: prisonerData.parole_status || 'Ineligible', // Default to Ineligible
        date_of_birth: formatDate(prisonerData.date_of_birth),
        admission_date: formatDate(prisonerData.admission_date),
        release_date: formatDate(prisonerData.release_date)
      };

      console.log('Prepared prisoner data for database:', prisoner);
      console.log('Attempting to create prisoner in database...');
      
      const prisonerId = await PrisonerRepository.create(prisoner);
      console.log('Prisoner created successfully with ID:', prisonerId);
      
      console.log('Fetching created prisoner details...');
      const createdPrisoner = await PrisonerRepository.getById(prisonerId);
      console.log('Retrieved created prisoner:', createdPrisoner);
      
      return createdPrisoner;
    } catch (error) {
      console.error('Error in createPrisoner:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        data: prisonerData
      });
      throw error;
    }
  }

  static async updatePrisoner(prisonerId, prisonerData) {
    try {
      console.log(`Updating prisoner ${prisonerId} with data:`, prisonerData);
      
      // Check if prisoner exists
      const existingPrisoner = await PrisonerRepository.getById(prisonerId);
      if (!existingPrisoner) {
        console.log(`No prisoner found with ID ${prisonerId}`);
        throw new Error(`Prisoner with ID ${prisonerId} not found`);
      }

      // Update the prisoner
      console.log('Attempting to update prisoner in database...');
      await PrisonerRepository.update(prisonerId, prisonerData);
      console.log('Prisoner updated successfully');
      
      const updatedPrisoner = await PrisonerRepository.getById(prisonerId);
      console.log('Retrieved updated prisoner:', updatedPrisoner);
      return updatedPrisoner;
    } catch (error) {
      console.error(`Error in updatePrisoner for id ${prisonerId}:`, error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        data: prisonerData
      });
      throw error;
    }
  }

  static async deletePrisoner(prisonerId) {
    try {
      console.log(`Attempting to delete prisoner ${prisonerId}...`);
      
      // Check if prisoner exists
      const existingPrisoner = await PrisonerRepository.getById(prisonerId);
      if (!existingPrisoner) {
        console.log(`No prisoner found with ID ${prisonerId}`);
        throw new Error(`Prisoner with ID ${prisonerId} not found`);
      }

      console.log('Deleting prisoner from database...');
      await PrisonerRepository.delete(prisonerId);
      console.log('Prisoner deleted successfully');
      
      return { prisonerId };
    } catch (error) {
      console.error(`Error in deletePrisoner for id ${prisonerId}:`, error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack
      });
      throw error;
    }
  }
}

module.exports = PrisonerService; 