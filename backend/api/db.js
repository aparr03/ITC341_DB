/**
 * Oracle Database Connection Module
 * 
 * This module manages connections to the Oracle database for the Prison Management System.
 * It handles connection pooling, query execution, and proper resource cleanup.
 * 
 * The connection details are obtained from environment variables to maintain security
 * and enable easy configuration changes across different environments.
 */

const oracledb = require('oracledb');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Set Oracle connection mode to Object
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

// Oracle connection configuration
const dbConfig = {
  user: process.env.DB_USER || 'system',
  password: process.env.DB_PASSWORD || 'ITC341ProjectPassword',
  connectString: `${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || '1522'}/${process.env.DB_DATABASE || 'xepdb1'}`
};

console.log('Oracle connection string:', dbConfig.connectString);

// Track if pool is initialized to avoid redundant initialization
let poolInitialized = false;

// Check if Oracle Instant Client is in the expected location
function checkInstantClient() {
  if (process.platform === 'win32') {
    // Windows checks
    console.log('Running on Windows, checking Oracle Instant Client...');
    // Client path from PATH environment variable
    const paths = process.env.PATH ? process.env.PATH.split(';') : [];
    console.log('PATH directories:', paths);
    const foundClientPath = paths.find(p => 
      fs.existsSync(path.join(p, 'oci.dll')) || 
      fs.existsSync(path.join(p, 'libclntsh.dll'))
    );
    return !!foundClientPath;
  } else {
    // Linux checks
    console.log('Running on Linux, checking Oracle Instant Client...');
    const ldLibraryPath = process.env.LD_LIBRARY_PATH || '';
    console.log('LD_LIBRARY_PATH:', ldLibraryPath);
    
    // Check multiple possible locations for Oracle Instant Client on Linux
    const commonPaths = [
      '/opt/oracle/instantclient_21_11',
      '/opt/oracle/instantclient_21_10',
      '/opt/oracle/instantclient_21_9',
      '/opt/oracle/instantclient_21_8',
      '/opt/oracle/instantclient_19_18',
      '/opt/oracle/instantclient_19_17'
    ];
    
    // Add paths from LD_LIBRARY_PATH
    const pathsToCheck = [
      ...ldLibraryPath.split(':').filter(p => p),
      ...commonPaths
    ];
    
    // Log paths being checked
    console.log('Checking paths for libclntsh.so:', JSON.stringify(pathsToCheck, null, 2));
    
    // Check each path for the Oracle client library
    for (const p of pathsToCheck) {
      if (fs.existsSync(path.join(p, 'libclntsh.so')) || 
          fs.existsSync(path.join(p, 'libclntsh.so.19.1')) ||
          fs.existsSync(path.join(p, 'libclntsh.so.21.1'))) {
        console.log('Found Oracle Instant Client at:', p);
        return true;
      }
    }
    
    // Also check if libraries can be found through ldconfig
    try {
      const { execSync } = require('child_process');
      const ldconfigOutput = execSync('ldconfig -p | grep libclntsh', { encoding: 'utf8' });
      if (ldconfigOutput) {
        console.log('Oracle client found in ldconfig:', ldconfigOutput);
        return true;
      }
    } catch (err) {
      console.log('ldconfig check failed:', err.message);
    }
    
    return false;
  }
}

/**
 * Initialize the Oracle connection pool
 * This should be called when the application starts
 */
async function initialize() {
  try {
    // Skip initialization if pool is already set up
    if (poolInitialized) {
      try {
        // Check if pool is still accessible
        oracledb.getPool();
        console.log('Using existing Oracle connection pool');
        return true;
      } catch (err) {
        // Pool was closed or is invalid, need to reinitialize
        console.log('Previous pool not available, reinitializing...');
        poolInitialized = false;
      }
    }
    
    // Check for Oracle Instant Client before attempting to connect
    const clientFound = checkInstantClient();
    if (!clientFound) {
      console.warn('Oracle Instant Client libraries not found in standard locations. Connection may fail.');
      console.warn('Node-oracledb installation instructions: https://oracle.github.io/node-oracledb/INSTALL.html');
      console.warn('You must have 64-bit Oracle Client libraries configured with ldconfig, or in LD_LIBRARY_PATH.');
      console.warn('If you do not have Oracle Database on this computer, then install the Instant Client Basic or Basic Light package from');
      console.warn('https://www.oracle.com/database/technologies/instant-client/linux-x86-64-downloads.html');
    }
    
    console.log('Initializing Oracle connection pool with config:', {
      user: dbConfig.user,
      connectString: dbConfig.connectString,
      // password is omitted for security
    });
    
    // Set connection pool configuration
    await oracledb.createPool({
      user: dbConfig.user,
      password: dbConfig.password,
      connectString: dbConfig.connectString,
      poolIncrement: 1,
      poolMax: 10,
      poolMin: 2,
      poolTimeout: 60
    });
    
    poolInitialized = true;
    console.log('Oracle DB connection pool initialized successfully');
    
    try {
      // Test the connection by making a simple query
      const result = await execute('SELECT 1 FROM DUAL');
      console.log('Connection test successful:', result);
    } catch (testErr) {
      console.error('Connection test failed but pool was created:', testErr);
      // Don't throw here, as pool creation was successful
    }
    
    return true;
  } catch (err) {
    console.error('Error initializing Oracle DB connection pool:', err);
    poolInitialized = false;
    throw err;
  }
}

/**
 * Close the Oracle connection pool
 * This should be called when the application shuts down
 */
async function close() {
  if (!poolInitialized) {
    console.log('No active Oracle DB connection pool to close');
    return true;
  }
  
  try {
    await oracledb.getPool().close(10); // Give connections up to 10 seconds to close
    console.log('Oracle DB connection pool closed');
    poolInitialized = false;
    return true;
  } catch (err) {
    console.error('Error closing Oracle DB connection pool:', err);
    throw err;
  }
}

/**
 * Execute a SQL query with optional binds and options
 * @param {string} sql - SQL query to execute
 * @param {Object|Array} binds - Bind parameters for the query
 * @param {Object} options - Additional options for the query
 * @returns {Promise<Object>} - Query results
 */
async function execute(sql, binds = {}, options = {}) {
  let connection;
  
  try {
    // Ensure pool is initialized
    if (!poolInitialized) {
      await initialize();
    }
    
    // Default options - ensure autoCommit is always true unless explicitly set to false
    const defaultOptions = {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
      autoCommit: true  // This ensures all changes are committed by default
    };
    
    // Get a connection from the pool
    connection = await oracledb.getPool().getConnection();
    
    // Execute the query with merged options, prioritizing user provided options
    const result = await connection.execute(sql, binds, { ...defaultOptions, ...options });
    
    // If autoCommit is manually set to false, explicitly commit
    if (options.autoCommit === false) {
      await connection.commit();
      console.log('Transaction explicitly committed');
    }
    
    return result;
  } catch (err) {
    // If there was an error and autoCommit is false, rollback
    if (connection && options.autoCommit === false) {
      try {
        await connection.rollback();
        console.log('Transaction rolled back due to error');
      } catch (rollbackErr) {
        console.error('Error rolling back transaction:', rollbackErr);
      }
    }
    
    console.error('Error executing query:', err);
    console.error('SQL:', sql);
    console.error('Binds:', JSON.stringify(binds, null, 2));
    throw err;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Error closing connection:', err);
      }
    }
  }
}

module.exports = { initialize, close, execute, dbConfig }; 