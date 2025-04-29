#!/bin/bash
# Script to run SQL files for initializing the database

# Wait longer for database to be ready
sleep 60

# Execute SQL scripts in order
echo "Running SQL initialization scripts..."
sqlplus -s system/ITC341ProjectPassword@//oracle-db:1521/xepdb1 <<EOF
-- Enable exception handling
WHENEVER SQLERROR EXIT SQL.SQLCODE;

-- Run initialization scripts
@/container-entrypoint-initdb.d/01_create_tables.sql
@/container-entrypoint-initdb.d/02_insert_sample_data.sql

-- Explicitly commit all changes
COMMIT;
EXECUTE DBMS_SESSION.SET_ROLE('DBA');
ALTER SYSTEM CHECKPOINT;

-- Check for any pending transactions
SELECT COUNT(*) FROM v\$transaction;

-- Output success message
SELECT 'Database initialization completed successfully.' FROM DUAL;

exit
EOF

# Check if the script execution was successful
if [ $? -eq 0 ]; then
  echo "Database initialization complete and changes committed."
else
  echo "Error occurred during database initialization. Exit code: $?"
fi 