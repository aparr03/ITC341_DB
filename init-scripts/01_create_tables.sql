/* ========================================================================
   PRISON DATABASE - TABLE CREATION SCRIPT
   
   This script creates all necessary tables for the Prison Management System 
   according to the specified database schema. It includes:
   - Prison table for main facility information
   - CellBlock table for prison sections
   - Cell table for individual cells
   - Prisoner table for inmate information
   - Parole table for parole records
   
   Each table includes appropriate constraints, primary keys, foreign keys,
   and data types matching the schema diagram specifications.
   ======================================================================== */

-- Drop existing tables in reverse order of dependency
BEGIN
   EXECUTE IMMEDIATE 'DROP TABLE Parole CASCADE CONSTRAINTS';
EXCEPTION
   WHEN OTHERS THEN
      IF SQLCODE != -942 THEN
         RAISE;
      END IF;
END;
/

BEGIN
   EXECUTE IMMEDIATE 'DROP TABLE Prisoner CASCADE CONSTRAINTS';
EXCEPTION
   WHEN OTHERS THEN
      IF SQLCODE != -942 THEN
         RAISE;
      END IF;
END;
/

BEGIN
   EXECUTE IMMEDIATE 'DROP TABLE Cell CASCADE CONSTRAINTS';
EXCEPTION
   WHEN OTHERS THEN
      IF SQLCODE != -942 THEN
         RAISE;
      END IF;
END;
/

BEGIN
   EXECUTE IMMEDIATE 'DROP TABLE Cell_Block CASCADE CONSTRAINTS';
EXCEPTION
   WHEN OTHERS THEN
      IF SQLCODE != -942 THEN
         RAISE;
      END IF;
END;
/

BEGIN
   EXECUTE IMMEDIATE 'DROP TABLE Prison CASCADE CONSTRAINTS';
EXCEPTION
   WHEN OTHERS THEN
      IF SQLCODE != -942 THEN
         RAISE;
      END IF;
END;
/

BEGIN
   EXECUTE IMMEDIATE 'DROP SEQUENCE prisoner_id_seq';
EXCEPTION
   WHEN OTHERS THEN
      IF SQLCODE != -2289 THEN
         RAISE;
      END IF;
END;
/

-- Create Prison table
CREATE TABLE Prison (
  prison_id NUMBER PRIMARY KEY,
  prison_name VARCHAR2(100) NOT NULL,
  location VARCHAR2(255) NOT NULL
);

-- Create Cell Block table
CREATE TABLE Cell_Block (
  cellblock_id NUMBER PRIMARY KEY,
  cellblock_name VARCHAR2(50) NOT NULL,
  max_capacity NUMBER NOT NULL,
  current_capacity NUMBER DEFAULT 0
);

-- Create Cell table
CREATE TABLE Cell (
  cell_id NUMBER PRIMARY KEY,
  cell_number VARCHAR2(20) NOT NULL,
  cellblock_id NUMBER,
  capacity NUMBER NOT NULL,
  occupancy NUMBER DEFAULT 0,
  CONSTRAINT fk_cell_cellblock FOREIGN KEY (cellblock_id) REFERENCES Cell_Block(cellblock_id)
);

-- Create Prisoner table
CREATE TABLE Prisoner (
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
);

-- Create Parole table
CREATE TABLE Parole (
  parole_id NUMBER PRIMARY KEY,
  prisoner_id NUMBER,
  status VARCHAR2(20) NOT NULL,
  review_date DATE,
  notes VARCHAR2(500),
  CONSTRAINT fk_parole_prisoner FOREIGN KEY (prisoner_id) REFERENCES Prisoner(prisoner_id)
);

-- Create prisoner ID sequence
CREATE SEQUENCE prisoner_id_seq 
  START WITH 1000
  INCREMENT BY 1
  NOCACHE
  NOCYCLE;

-- Create indexes for improved query performance
CREATE INDEX idx_prisoner_cellblock ON Prisoner(cellblock_id);
CREATE INDEX idx_prisoner_parole_status ON Prisoner(parole_status);
CREATE INDEX idx_prisoner_release_date ON Prisoner(release_date);
CREATE INDEX idx_cell_cellblock ON Cell(cellblock_id);
CREATE INDEX idx_parole_prisoner ON Parole(prisoner_id);

-- Commit all changes to make them persistent
COMMIT;

-- Output success message
SELECT 'Tables created successfully.' FROM DUAL; 