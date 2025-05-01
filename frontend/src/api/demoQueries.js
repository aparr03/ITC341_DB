// API service for demo queries
const API_URL = '/api';

/**
 * Get occupancy statistics by cell block
 * @returns {Promise<Array>} Array of cell blocks with occupancy statistics
 */
export const getOccupancyByBlock = async () => {
  try {
    const response = await fetch(`${API_URL}/demo/occupancy`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching occupancy data:', error);
    throw error;
  }
};

/**
 * Get prisoners eligible for parole
 * @returns {Promise<Array>} Array of prisoners eligible for parole
 */
export const getUpcomingParoleEligibility = async () => {
  try {
    const response = await fetch(`${API_URL}/demo/parole`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching parole data:', error);
    throw error;
  }
};

/**
 * Get statistics on offense types
 * @returns {Promise<Array>} Array of offense types with counts
 */
export const getOffenseStatistics = async () => {
  try {
    const response = await fetch(`${API_URL}/demo/offenses`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching offense data:', error);
    throw error;
  }
};

/**
 * Get prisoner length of stay statistics
 * @returns {Promise<Array>} Array of prisoners with length of stay information
 */
export const getPrisonerLengthOfStay = async () => {
  try {
    const response = await fetch(`${API_URL}/demo/length-of-stay`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching length of stay data:', error);
    throw error;
  }
};

/**
 * Get behavior rating distribution
 * @returns {Promise<Array>} Array with behavior rating distribution
 */
export const getBehaviorRatingDistribution = async () => {
  try {
    const response = await fetch(`${API_URL}/demo/behavior`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching behavior data:', error);
    throw error;
  }
};

/**
 * Get offense percentage distribution
 * @returns {Promise<Array>} Array with offense percentage distribution
 */
export const getOffensePercentageDistribution = async () => {
  try {
    const response = await fetch(`${API_URL}/demo/offense-percentages`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching offense percentage data:', error);
    throw error;
  }
}; 