/**
 * Script to initialize the database tables
 */

const fs = require('fs');
const path = require('path');
const { execute } = require('./api/db');

async function initializeDatabase() {
  try {
    console.log('Initializing database...');
    
    // Initialize DB module
    const db = require('./api/db');
    await db.initialize();
    console.log('Database connection successful!');
    
    // Read the SQL files
    console.log('Reading SQL initialization scripts...');
    // Use absolute path to the init-scripts directory
    const scriptsDir = path.join('/app/init-scripts');
    console.log('Scripts directory:', scriptsDir);
    
    const createTablesPath = path.join(scriptsDir, '01_create_tables.sql');
    const sampleDataPath = path.join(scriptsDir, '02_insert_sample_data.sql');
    
    console.log('Create tables script path:', createTablesPath);
    console.log('Sample data script path:', sampleDataPath);
    
    // Check if files exist
    if (!fs.existsSync(createTablesPath)) {
      console.error('Create tables script does not exist at path:', createTablesPath);
      
      // List all files in the init-scripts directory
      console.log('Checking available files in init-scripts directory...');
      try {
        const files = fs.readdirSync(scriptsDir);
        console.log('Files in init-scripts directory:', files);
      } catch (err) {
        console.error('Error reading init-scripts directory:', err.message);
      }
      
      throw new Error('Create tables script not found');
    }
    
    const createTablesSQL = fs.readFileSync(createTablesPath, 'utf8');
    const sampleDataSQL = fs.readFileSync(sampleDataPath, 'utf8');
    
    // Split SQL statements (assuming they end with semicolon followed by newline or end of file)
    console.log('Executing create tables script...');
    const createTableStatements = createTablesSQL.split(/;\n|\s*;\s*$/);
    
    for (const statement of createTableStatements) {
      if (statement.trim()) {
        try {
          console.log('Executing SQL:', statement.trim());
          await execute(statement.trim());
          console.log('Statement executed successfully');
        } catch (err) {
          console.error('Error executing statement:', err.message);
          // Continue with other statements
        }
      }
    }
    
    console.log('Executing sample data script...');
    const sampleDataStatements = sampleDataSQL.split(/;\n|\s*;\s*$/);
    
    for (const statement of sampleDataStatements) {
      if (statement.trim()) {
        try {
          await execute(statement.trim());
        } catch (err) {
          console.error('Error executing sample data statement:', err.message);
          // Continue with other statements
        }
      }
    }
    
    console.log('Database initialization completed successfully!');
    
    // Close the connection
    await db.close();
    
  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1);
  }
}

// Run the initialization
initializeDatabase(); 