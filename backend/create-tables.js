/**
 * Create database tables needed for the prisoner application
 */
const { execute } = require('./api/db');

async function createTables() {
  try {
    console.log('Creating database tables...');
    
    // Initialize DB module
    const db = require('./api/db');
    await db.initialize();
    console.log('Database connection successful!');
    
    // Drop existing tables if they exist
    const dropStatements = [
      'DROP TABLE Parole CASCADE CONSTRAINTS',
      'DROP TABLE Prisoner CASCADE CONSTRAINTS',
      'DROP TABLE Cell CASCADE CONSTRAINTS',
      'DROP TABLE Cell_Block CASCADE CONSTRAINTS',
      'DROP TABLE Prison CASCADE CONSTRAINTS',
      'DROP SEQUENCE prisoner_id_seq'
    ];
    
    for (const statement of dropStatements) {
      try {
        console.log(`Executing: ${statement}`);
        await execute(statement);
        console.log('Drop statement executed successfully');
      } catch (err) {
        // Ignore errors if tables don't exist
        console.log(`Table/sequence doesn't exist, continuing: ${err.message}`);
      }
    }
    
    // Create tables
    const createStatements = [
      // Create Prison table
      `CREATE TABLE Prison (
        prison_id NUMBER PRIMARY KEY,
        prison_name VARCHAR2(100) NOT NULL,
        location VARCHAR2(255) NOT NULL
      )`,
      
      // Create Cell Block table
      `CREATE TABLE Cell_Block (
        cellblock_id NUMBER PRIMARY KEY,
        cellblock_name VARCHAR2(50) NOT NULL,
        max_capacity NUMBER NOT NULL,
        current_capacity NUMBER DEFAULT 0
      )`,
      
      // Create Cell table
      `CREATE TABLE Cell (
        cell_id NUMBER PRIMARY KEY,
        cell_number VARCHAR2(20) NOT NULL,
        cellblock_id NUMBER,
        capacity NUMBER NOT NULL,
        occupancy NUMBER DEFAULT 0,
        CONSTRAINT fk_cell_cellblock FOREIGN KEY (cellblock_id) REFERENCES Cell_Block(cellblock_id)
      )`,
      
      // Create Prisoner table
      `CREATE TABLE Prisoner (
        prisoner_id NUMBER PRIMARY KEY,
        cellblock_id NUMBER,
        fName VARCHAR2(50) NOT NULL,
        lName VARCHAR2(50) NOT NULL,
        date_of_birth DATE,
        Gender VARCHAR2(10),
        offense VARCHAR2(100),
        sentence VARCHAR2(50),
        admission_date TIMESTAMP,
        release_date TIMESTAMP,
        behavior_rating NUMBER(1) CHECK (behavior_rating BETWEEN 1 AND 5),
        parole_status VARCHAR2(20) CHECK (parole_status IN ('Eligible', 'Ineligible', 'Pending', 'Approved', 'Denied')),
        CONSTRAINT fk_prisoner_cellblock FOREIGN KEY (cellblock_id) REFERENCES Cell_Block(cellblock_id)
      )`,
      
      // Create Parole table
      `CREATE TABLE Parole (
        parole_id NUMBER PRIMARY KEY,
        prisoner_id NUMBER,
        status VARCHAR2(20) NOT NULL,
        review_date DATE,
        notes VARCHAR2(500),
        CONSTRAINT fk_parole_prisoner FOREIGN KEY (prisoner_id) REFERENCES Prisoner(prisoner_id)
      )`,
      
      // Create prisoner ID sequence
      `CREATE SEQUENCE prisoner_id_seq
        START WITH 1000
        INCREMENT BY 1
        NOCACHE
        NOCYCLE`,
      
      // Create indexes
      `CREATE INDEX idx_prisoner_cellblock ON Prisoner(cellblock_id)`,
      `CREATE INDEX idx_prisoner_parole_status ON Prisoner(parole_status)`,
      `CREATE INDEX idx_prisoner_release_date ON Prisoner(release_date)`,
      `CREATE INDEX idx_cell_cellblock ON Cell(cellblock_id)`,
      `CREATE INDEX idx_parole_prisoner ON Parole(prisoner_id)`
    ];
    
    // Execute each statement
    for (const statement of createStatements) {
      try {
        console.log('Executing SQL:', statement.substring(0, 60) + '...');
        await execute(statement);
        console.log('Statement executed successfully');
      } catch (err) {
        console.error('Error executing statement:', err.message);
        // Continue with other statements despite errors
      }
    }
    
    // Insert basic Cell Block data to avoid foreign key failures
    const insertCellBlockSQL = `
      INSERT INTO Cell_Block (cellblock_id, cellblock_name, max_capacity, current_capacity)
      VALUES (1, 'Block A - Maximum Security', 50, 0)
    `;
    
    try {
      console.log('Inserting default Cell Block...');
      await execute(insertCellBlockSQL);
      console.log('Default Cell Block inserted successfully');
    } catch (err) {
      console.error('Error inserting default Cell Block:', err.message);
    }
    
    // Commit changes
    try {
      console.log('Committing changes...');
      await execute('COMMIT');
      console.log('Changes committed successfully');
    } catch (err) {
      console.error('Error committing changes:', err.message);
    }
    
    // Successful database setup
    console.log('Database tables created successfully!');
    await db.close();
    
  } catch (error) {
    console.error('Failed to create tables:', error);
    process.exit(1);
  }
}

// Run the function
createTables(); 