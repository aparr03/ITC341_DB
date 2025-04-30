// API configuration for Oracle Prisoner Database
const API_URL = '/api';

// Local storage keys
const PRISONERS_STORAGE_KEY = 'prisoner_records';

// Helper function for debugging
const logData = (label, data) => {
  console.log(`${label}:`, typeof data, Array.isArray(data) ? 'array' : 'not array', data);
  return data;
};

// Helper functions for localStorage
const getStoredPrisoners = () => {
  try {
    const storedData = localStorage.getItem(PRISONERS_STORAGE_KEY);
    return storedData ? JSON.parse(storedData) : [];
  } catch (e) {
    console.error('Error retrieving data from localStorage:', e);
    return [];
  }
};

const storePrisoners = (prisoners) => {
  try {
    localStorage.setItem(PRISONERS_STORAGE_KEY, JSON.stringify(prisoners));
  } catch (e) {
    console.error('Error storing data in localStorage:', e);
  }
};

// Process API response and ensure consistent data structure
const processApiResponse = (data) => {
  console.log('Processing API response:', data);
  
  // If data is not an array, try to convert it
  if (!Array.isArray(data)) {
    console.warn('API response is not an array:', data);
    
    // If it's an object with rows property (Oracle format), use that
    if (data && Array.isArray(data.rows)) {
      console.log('Converting rows array to prisoners array');
      return data.rows;
    }
    
    // If it's an object but not in expected format, wrap in array
    if (data && typeof data === 'object') {
      console.log('Wrapping object in array');
      return [data];
    }
    
    console.error('Could not convert API response to array');
    return [];
  }
  
  // It's already an array, just return it
  return data;
};

export const getPrisoners = async () => {
  try {
    console.log('Fetching prisoners from API:', `${API_URL}/prisoners`);
    const response = await fetch(`${API_URL}/prisoners`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return logData('Prisoners retrieved from API', data);
  } catch (error) {
    console.error('Error fetching prisoners:', error);
    throw error;
  }
};

export const addPrisoner = async (prisoner) => {
  try {
    console.log('Form submitted with data:', prisoner);
    
    const requestBody = {
      fName: prisoner.firstName,
      lName: prisoner.lastName,
      date_of_birth: prisoner.dateOfBirth,
      offense: prisoner.crime,
      sentence: `${prisoner.sentenceYears} years`,
      admission_date: prisoner.admissionDate,
      release_date: prisoner.releaseDate,
      cellblock_id: 1, // Default to first cellblock
      gender: 'Male', // Default value
      behavior_rating: 3, // Default value
      parole_status: 'Ineligible' // Default value
    };
    
    console.log('Sending API request to:', `${API_URL}/prisoners`);
    console.log('Request body:', requestBody);
    
    const response = await fetch(`${API_URL}/prisoners`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });
    
    console.log('API Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }
    
    const responseData = await response.json();
    console.log('API Response data:', responseData);
    
    return responseData;
  } catch (error) {
    console.error('Error adding prisoner:', error);
    throw error;
  }
};

export const updatePrisoner = async (id, prisoner) => {
  try {
    const response = await fetch(`${API_URL}/api/prisoners/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fName: prisoner.firstName,
        lName: prisoner.lastName,
        date_of_birth: prisoner.dateOfBirth,
        offense: prisoner.crime,
        sentence: `${prisoner.sentenceYears} years`,
        admission_date: prisoner.admissionDate,
        release_date: prisoner.releaseDate
      }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error updating prisoner:', error);
    throw error;
  }
};

export const deletePrisoner = async (id) => {
  try {
    const response = await fetch(`${API_URL}/api/prisoners/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error deleting prisoner:', error);
    throw error;
  }
}; 