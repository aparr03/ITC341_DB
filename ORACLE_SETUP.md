# Prison Management System - Oracle Database Setup Guide

This document provides comprehensive instructions for setting up and using the Oracle database for the Prison Management System.

## Table of Contents

1. [Database Schema Overview](#database-schema-overview)
2. [Oracle Database Setup](#oracle-database-setup)
3. [Accessing the Database](#accessing-the-database)
4. [Changing Database Passwords](#changing-database-passwords)
5. [SQL Scripts Explanation](#sql-scripts-explanation)
6. [Demonstration Queries](#demonstration-queries)
7. [API Integration](#api-integration)
8. [Troubleshooting](#troubleshooting)

## Database Schema Overview

The database consists of the following tables:

### Prison Table
- Primary facility information
- **Columns:** `prison_id` (PK), `prison_name`, `location`

### Cell Block Table
- Sections within the prison
- **Columns:** `cellblock_id` (PK), `cellblock_name`, `max_capacity`, `current_capacity`

### Cell Table
- Individual cells within cell blocks
- **Columns:** `cell_id` (PK), `cell_number`, `cellblock_id` (FK), `capacity`, `occupancy`

### Prisoner Table
- Information about inmates
- **Columns:** `prisoner_id` (PK), `cellblock_id` (FK), `fName`, `lName`, `date_of_birth`, `gender`, `offense`, `sentence`, `admission_date`, `release_date`, `behavior_rating`, `parole_status`

### Parole Table
- Parole records for prisoners
- **Columns:** `parole_id` (PK), `prisoner_id` (FK), `status`, `review_date`, `notes`

## Oracle Database Setup

### Prerequisites

1. Docker and Docker Compose for containerized setup
2. Node.js and npm for local development (if not using Docker)
3. Oracle Instant Client (included in the Docker setup)

### Installation Steps

The project uses Docker Compose to set up the entire environment, including:
- Frontend (React app)
- Backend (Node.js with Express)
- Oracle Database (using gvenzl/oracle-xe:21-slim image)

To start the environment:

```bash
# Build and start all containers
docker-compose up -d

# View logs
docker logs itc341_db-backend-1
docker logs itc341_db-oracle-db-1
```

### Environment Configuration

The main configuration is in the docker-compose.yml file:

```yaml
# Backend configuration
environment:
  - PORT=4000
  - DB_HOST=oracle-db
  - DB_PORT=1521
  - DB_USER=system
  - DB_PASSWORD=YourStrongPassword123
  - DB_DATABASE=xepdb1

# Oracle DB configuration
environment:
  - ORACLE_PASSWORD=YourStrongPassword123
  - ORACLE_DATABASE=XE
```

## Accessing the Database

### Using SQL*Plus from the Container

You can access the Oracle database using SQL*Plus from within the container:

```bash
# Connect to the Oracle container
docker exec -it itc341_db-oracle-db-1 bash

# Use SQL*Plus to connect
sqlplus system/YourStrongPassword123@//localhost:1521/xepdb1
```

### Using SQL Developer or Oracle SQL Developer Web

You can also connect using external tools like Oracle SQL Developer:

- **Hostname:** localhost (or your machine's IP)
- **Port:** 1521
- **Service Name:** xepdb1
- **Username:** system
- **Password:** YourStrongPassword123

### Using Docker Exec

Run SQL commands directly:

```bash
docker exec -it itc341_db-oracle-db-1 sqlplus system/YourStrongPassword123@//localhost:1521/xepdb1 << EOF
SELECT table_name FROM user_tables;
EXIT;
EOF
```

## Changing Database Passwords

### In Docker Compose

To change the password in the Docker setup:

1. Update the password in `docker-compose.yml`:
   ```yaml
   backend:
     environment:
       - DB_PASSWORD=YourNewPassword
   
   oracle-db:
     environment:
       - ORACLE_PASSWORD=YourNewPassword
   ```

2. Update the password in the init scripts:
   ```bash
   # In init-scripts/run_scripts.sh
   sqlplus -s system/YourNewPassword@//oracle-db:1521/xepdb1 <<EOF
   ```

3. Rebuild and restart the containers:
   ```bash
   docker-compose down
   docker-compose up -d
   ```

### Using SQL Commands

You can also change the password inside the running database:

```bash
docker exec -it itc341_db-oracle-db-1 sqlplus system/YourStrongPassword123@//localhost:1521/xepdb1 << EOF
ALTER USER system IDENTIFIED BY YourNewPassword;
EXIT;
EOF
```

Remember to update the password in your `docker-compose.yml` and init scripts after changing it in the database.

## SQL Scripts Explanation

The database initialization is done through two main SQL scripts in the `init-scripts` directory:

### 1. 01_create_tables.sql

This script creates the database schema:

- **Tables:** Creates all tables with appropriate data types and constraints
- **Primary Keys:** Defines primary key constraints for each table
- **Foreign Keys:** Establishes relationships between tables
- **Indexes:** Creates performance-optimizing indexes
- **Drop Statements:** Includes safe drop statements for existing tables

Key features:
- Tables are dropped in reverse order of dependency to avoid constraint violations
- Error handling is included to handle non-existent tables
- Appropriate data types are used for each column based on the schema diagram
- Foreign key constraints ensure data integrity

### 2. 02_insert_sample_data.sql

This script populates the database with sample data:

- **Sample Prison:** Creates a main prison facility
- **Cell Blocks:** Adds multiple cell blocks with varying capacities
- **Cells:** Creates cells within each block
- **Prisoners:** Adds sample prisoner records with complete information
- **Parole Records:** Creates parole records for eligible prisoners
- **Sequence:** Sets up an auto-increment sequence for prisoner IDs

## Demonstration Queries

The application includes five demonstration queries to showcase Oracle's SQL capabilities:

### 1. Cell Block Occupancy Statistics

```sql
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
```

This query shows each cell block's occupancy rate with percentage calculations.

### 2. Upcoming Parole Eligibility

```sql
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
```

This query identifies prisoners eligible for parole in the next 6 months.

### 3. Offense Type Distribution

```sql
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
```

This query shows the distribution of offense types within the prison population.

### 4. Prisoner Length of Stay Statistics

```sql
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
```

This query calculates sentence duration, time served, and remaining time for each prisoner.

### 5. Behavior Rating Distribution

```sql
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
```

This query analyzes the distribution of prisoner behavior ratings.

## API Integration

The system uses a Node.js backend with the following components:

### Database Connection Module (db.js)

- Manages connection pool for Oracle database
- Provides methods for executing SQL queries
- Handles connection lifecycle (initialization and shutdown)

### Entity Repositories

- **prisonerRepository.js:** CRUD operations for prisoners
- **cellBlockRepository.js:** CRUD operations for cell blocks
- **cellRepository.js:** CRUD operations for cells
- **paroleRepository.js:** CRUD operations for parole records

### API Routes

- RESTful endpoints for each entity
- Report endpoints for demonstration queries
- Error handling and proper HTTP status codes

## Troubleshooting

### Common Issues

1. **Missing Oracle Client Libraries**
   - **Error:** `DPI-1047: Cannot locate a 64-bit Oracle Client library`
   - **Solution:** This is fixed in our Dockerfile by installing the Oracle Instant Client libraries
   ```dockerfile
   # Install Oracle Instant Client
   RUN apt-get update && apt-get install -y libaio1 wget unzip \
       && mkdir -p /opt/oracle \
       && cd /opt/oracle \
       && wget https://download.oracle.com/otn_software/linux/instantclient/instantclient-basiclite-linuxx64.zip \
       && unzip instantclient-basiclite-linuxx64.zip \
       && rm -f instantclient-basiclite-linuxx64.zip \
       && cd /opt/oracle/instantclient* \
       && rm -f *jdbc* *occi* *mysql* *README *jar uidrvci genezi adrci \
       && echo /opt/oracle/instantclient* > /etc/ld.so.conf.d/oracle-instantclient.conf \
       && ldconfig
   
   # Set environment variables for Oracle Instant Client
   ENV LD_LIBRARY_PATH=/opt/oracle/instantclient_21_10
   ```

2. **Service Name Issues**
   - **Error:** `ORA-12514: Cannot connect to database. Service XE is not registered with the listener`
   - **Solution:** Use the correct service name `xepdb1` (lowercase) instead of `XE` or `XEPDB1`

3. **Database Not Ready**
   - **Error:** Connection refused during container startup
   - **Solution:** Use `restart: on-failure` in docker-compose.yml for the backend service to automatically retry connecting

4. **Data Not Persisting After Application Restart**
   - **Error:** Data added through the interface disappears after container restart
   - **Solution:** This issue can be caused by several factors:
     
     a) **Transactions not being committed:**
     - Ensure all database operations in the code explicitly use `autoCommit: true`
     - The updated code now ensures all prisoner operations explicitly commit changes
     
     b) **Database container storage issues:**
     - The updated Docker Compose configuration includes named volumes for data persistence
     - Important volume configurations:
       ```yaml
       volumes:
         oracle-data:
           name: oracle-prison-data
         oracle-setup:
           name: oracle-prison-setup
         oracle-startup:
           name: oracle-prison-startup
       ```
     
     c) **Docker volume management:**
     - When rebuilding containers, make sure not to use `docker-compose down -v` as this would remove volumes
     - Use `docker-compose down` followed by `docker-compose up -d` to preserve data
     - If you need to check volume status: `docker volume ls | grep oracle-prison`
     
     d) **Proper database shutdown:**
     - The container configuration now includes a grace period: `stop_grace_period: 30s`
     - This allows Oracle to properly close files before container shutdown
     
     e) **For debugging data persistence issues:**
     - Check database redo logs: `docker exec -it itc341_db-oracle-db-1 ls -la /opt/oracle/oradata/XE/redo/`
     - Verify autocommit status: `docker exec -it itc341_db-oracle-db-1 sqlplus system/YourStrongPassword123@//localhost:1521/xepdb1 << EOF
       SELECT name, value FROM v\$parameter WHERE name = 'commit_write';
       EXIT;
       EOF`

### Logs to Check

- Application logs in the console:
  ```bash
  docker logs itc341_db-backend-1
  docker logs itc341_db-oracle-db-1
  ```

- Inside the container logs:
  ```bash
  docker exec -it itc341_db-oracle-db-1 cat /opt/oracle/diag/rdbms/xe/XE/trace/alert_XE.log
  ```

### Testing Database Connectivity

```bash
# Check listener status
docker exec -it itc341_db-oracle-db-1 lsnrctl status

# Test connection using SQL*Plus
docker exec -it itc341_db-oracle-db-1 sqlplus system/YourStrongPassword123@//localhost:1521/xepdb1
```

## Conclusion

This Oracle database setup provides a solid foundation for the Prison Management System. The schema design, sample data, and demonstration queries showcase Oracle's capabilities for effective data management and analysis in a correctional facility context.

For any additional assistance or questions, please contact the system administrator.