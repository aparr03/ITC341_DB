/**
 * Test script to verify database connectivity and insert a test prisoner
 */

const { execute } = require('./api/db');
const PrisonerService = require('./api/prisonerService');

// Sample prisoner data for testing
const testPrisoner = {
  fName: 'Test',
  lName: 'Prisoner',
  date_of_birth: '05/15/1985',
  gender: 'Male',
  offense: 'Testing',
  sentence: '1 year',
  admission_date: '04/30/2025',
  release_date: '04/30/2026',
  behavior_rating: 3,
  parole_status: 'Ineligible',
  cellblock_id: 1
};

async function runTest() {
  try {
    console.log('Testing database connection...');
    
    // Initialize DB module
    const db = require('./api/db');
    await db.initialize();
    console.log('Database connection successful!');
    
    // Test a simple query
    console.log('Running a simple test query...');
    const result = await execute('SELECT 1 FROM DUAL');
    console.log('Query result:', result);
    
    // Test prisoner creation
    console.log('Testing prisoner creation...');
    console.log('Test data:', testPrisoner);
    
    const newPrisoner = await PrisonerService.createPrisoner(testPrisoner);
    console.log('Prisoner created successfully:', newPrisoner);
    
    // Close the connection
    await db.close();
    console.log('Test completed successfully!');
    
  } catch (error) {
    console.error('Test failed:', error);
    process.exit(1);
  }
}

// Run the test
runTest(); 