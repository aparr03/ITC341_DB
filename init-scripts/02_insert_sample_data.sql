/* 
   This script populates all tables with sample data.
   - A prison facility
   - Multiple cell blocks
   - Cells within each block
   - Prisoners assigned to cell blocks
   - Parole records for eligible prisoners
*/

-- Insert sample prison
INSERT INTO Prison (prison_id, prison_name, location)
VALUES (1, 'Washington State Penitentiary', 'Walla Walla, WA');

-- Insert sample cell blocks
INSERT INTO Cell_Block (cellblock_id, cellblock_name, max_capacity, current_capacity)
VALUES (1, 'Block A - Maximum Security', 50, 42);

INSERT INTO Cell_Block (cellblock_id, cellblock_name, max_capacity, current_capacity)
VALUES (2, 'Block B - Medium Security', 100, 78);

INSERT INTO Cell_Block (cellblock_id, cellblock_name, max_capacity, current_capacity)
VALUES (3, 'Block C - Minimum Security', 150, 103);

INSERT INTO Cell_Block (cellblock_id, cellblock_name, max_capacity, current_capacity)
VALUES (4, 'Special Housing Unit', 25, 15);

-- Insert sample cells (10 for each block)
-- Block A Cells
INSERT INTO Cell (cell_id, cell_number, cellblock_id, capacity, occupancy)
VALUES (101, 'A-101', 1, 1, 1);

INSERT INTO Cell (cell_id, cell_number, cellblock_id, capacity, occupancy)
VALUES (102, 'A-102', 1, 1, 1);

INSERT INTO Cell (cell_id, cell_number, cellblock_id, capacity, occupancy)
VALUES (103, 'A-103', 1, 1, 1);

INSERT INTO Cell (cell_id, cell_number, cellblock_id, capacity, occupancy)
VALUES (104, 'A-104', 1, 1, 1);

INSERT INTO Cell (cell_id, cell_number, cellblock_id, capacity, occupancy)
VALUES (105, 'A-105', 1, 1, 1);

-- Block B Cells
INSERT INTO Cell (cell_id, cell_number, cellblock_id, capacity, occupancy)
VALUES (201, 'B-201', 2, 2, 2);

INSERT INTO Cell (cell_id, cell_number, cellblock_id, capacity, occupancy)
VALUES (202, 'B-202', 2, 2, 2);

INSERT INTO Cell (cell_id, cell_number, cellblock_id, capacity, occupancy)
VALUES (203, 'B-203', 2, 2, 2);

INSERT INTO Cell (cell_id, cell_number, cellblock_id, capacity, occupancy)
VALUES (204, 'B-204', 2, 2, 1);

INSERT INTO Cell (cell_id, cell_number, cellblock_id, capacity, occupancy)
VALUES (205, 'B-205', 2, 2, 1);

-- Block C Cells
INSERT INTO Cell (cell_id, cell_number, cellblock_id, capacity, occupancy)
VALUES (301, 'C-301', 3, 4, 3);

INSERT INTO Cell (cell_id, cell_number, cellblock_id, capacity, occupancy)
VALUES (302, 'C-302', 3, 4, 4);

INSERT INTO Cell (cell_id, cell_number, cellblock_id, capacity, occupancy)
VALUES (303, 'C-303', 3, 4, 2);

INSERT INTO Cell (cell_id, cell_number, cellblock_id, capacity, occupancy)
VALUES (304, 'C-304', 3, 4, 3);

INSERT INTO Cell (cell_id, cell_number, cellblock_id, capacity, occupancy)
VALUES (305, 'C-305', 3, 4, 4);

-- Special Housing Unit
INSERT INTO Cell (cell_id, cell_number, cellblock_id, capacity, occupancy)
VALUES (401, 'SHU-401', 4, 1, 1);

INSERT INTO Cell (cell_id, cell_number, cellblock_id, capacity, occupancy)
VALUES (402, 'SHU-402', 4, 1, 1);

INSERT INTO Cell (cell_id, cell_number, cellblock_id, capacity, occupancy)
VALUES (403, 'SHU-403', 4, 1, 1);

INSERT INTO Cell (cell_id, cell_number, cellblock_id, capacity, occupancy)
VALUES (404, 'SHU-404', 4, 1, 0);

INSERT INTO Cell (cell_id, cell_number, cellblock_id, capacity, occupancy)
VALUES (405, 'SHU-405', 4, 1, 0);

-- Insert sample prisoners
INSERT INTO Prisoner (prisoner_id, cellblock_id, fName, lName, date_of_birth, gender, offense, sentence, admission_date, release_date, behavior_rating, parole_status)
VALUES (1001, 1, 'John', 'Smith', TO_DATE('1985-06-15', 'YYYY-MM-DD'), 'Male', 'Armed Robbery', '15 years', 
        TO_TIMESTAMP('2018-03-10 09:00:00', 'YYYY-MM-DD HH24:MI:SS'), 
        TO_TIMESTAMP('2033-03-10 09:00:00', 'YYYY-MM-DD HH24:MI:SS'), 
        3, 'Ineligible');

INSERT INTO Prisoner (prisoner_id, cellblock_id, fName, lName, date_of_birth, gender, offense, sentence, admission_date, release_date, behavior_rating, parole_status)
VALUES (1002, 1, 'Robert', 'Johnson', TO_DATE('1979-11-22', 'YYYY-MM-DD'), 'Male', 'Murder', 'Life', 
        TO_TIMESTAMP('2010-07-05 11:30:00', 'YYYY-MM-DD HH24:MI:SS'), 
        NULL, 
        2, 'Ineligible');

INSERT INTO Prisoner (prisoner_id, cellblock_id, fName, lName, date_of_birth, gender, offense, sentence, admission_date, release_date, behavior_rating, parole_status)
VALUES (1003, 1, 'Michael', 'Williams', TO_DATE('1990-04-30', 'YYYY-MM-DD'), 'Male', 'Assault', '8 years', 
        TO_TIMESTAMP('2019-01-15 14:45:00', 'YYYY-MM-DD HH24:MI:SS'), 
        TO_TIMESTAMP('2027-01-15 14:45:00', 'YYYY-MM-DD HH24:MI:SS'), 
        4, 'Eligible');

INSERT INTO Prisoner (prisoner_id, cellblock_id, fName, lName, date_of_birth, gender, offense, sentence, admission_date, release_date, behavior_rating, parole_status)
VALUES (1004, 2, 'David', 'Brown', TO_DATE('1988-09-12', 'YYYY-MM-DD'), 'Male', 'Drug Trafficking', '10 years', 
        TO_TIMESTAMP('2017-05-20 08:15:00', 'YYYY-MM-DD HH24:MI:SS'), 
        TO_TIMESTAMP('2027-05-20 08:15:00', 'YYYY-MM-DD HH24:MI:SS'), 
        5, 'Eligible');

INSERT INTO Prisoner (prisoner_id, cellblock_id, fName, lName, date_of_birth, gender, offense, sentence, admission_date, release_date, behavior_rating, parole_status)
VALUES (1005, 2, 'James', 'Davis', TO_DATE('1982-03-08', 'YYYY-MM-DD'), 'Male', 'Fraud', '5 years', 
        TO_TIMESTAMP('2020-11-03 16:30:00', 'YYYY-MM-DD HH24:MI:SS'), 
        TO_TIMESTAMP('2025-11-03 16:30:00', 'YYYY-MM-DD HH24:MI:SS'), 
        4, 'Ineligible');

INSERT INTO Prisoner (prisoner_id, cellblock_id, fName, lName, date_of_birth, gender, offense, sentence, admission_date, release_date, behavior_rating, parole_status)
VALUES (1006, 2, 'Sarah', 'Wilson', TO_DATE('1992-07-19', 'YYYY-MM-DD'), 'Female', 'Burglary', '3 years', 
        TO_TIMESTAMP('2021-02-28 10:00:00', 'YYYY-MM-DD HH24:MI:SS'), 
        TO_TIMESTAMP('2024-02-28 10:00:00', 'YYYY-MM-DD HH24:MI:SS'), 
        5, 'Pending');

INSERT INTO Prisoner (prisoner_id, cellblock_id, fName, lName, date_of_birth, gender, offense, sentence, admission_date, release_date, behavior_rating, parole_status)
VALUES (1007, 3, 'Jennifer', 'Miller', TO_DATE('1995-12-05', 'YYYY-MM-DD'), 'Female', 'Theft', '2 years', 
        TO_TIMESTAMP('2022-04-17 13:20:00', 'YYYY-MM-DD HH24:MI:SS'), 
        TO_TIMESTAMP('2024-04-17 13:20:00', 'YYYY-MM-DD HH24:MI:SS'), 
        5, 'Eligible');

INSERT INTO Prisoner (prisoner_id, cellblock_id, fName, lName, date_of_birth, gender, offense, sentence, admission_date, release_date, behavior_rating, parole_status)
VALUES (1008, 3, 'William', 'Taylor', TO_DATE('1975-09-28', 'YYYY-MM-DD'), 'Male', 'Embezzlement', '7 years', 
        TO_TIMESTAMP('2019-08-12 09:45:00', 'YYYY-MM-DD HH24:MI:SS'), 
        TO_TIMESTAMP('2026-08-12 09:45:00', 'YYYY-MM-DD HH24:MI:SS'), 
        3, 'Ineligible');

INSERT INTO Prisoner (prisoner_id, cellblock_id, fName, lName, date_of_birth, gender, offense, sentence, admission_date, release_date, behavior_rating, parole_status)
VALUES (1009, 4, 'Richard', 'Anderson', TO_DATE('1970-02-14', 'YYYY-MM-DD'), 'Male', 'Attempted Murder', '25 years', 
        TO_TIMESTAMP('2010-10-05 07:30:00', 'YYYY-MM-DD HH24:MI:SS'), 
        TO_TIMESTAMP('2035-10-05 07:30:00', 'YYYY-MM-DD HH24:MI:SS'), 
        1, 'Ineligible');

INSERT INTO Prisoner (prisoner_id, cellblock_id, fName, lName, date_of_birth, gender, offense, sentence, admission_date, release_date, behavior_rating, parole_status)
VALUES (1010, 4, 'Thomas', 'White', TO_DATE('1983-11-17', 'YYYY-MM-DD'), 'Male', 'Assault on Officer', '12 years', 
        TO_TIMESTAMP('2015-06-22 15:10:00', 'YYYY-MM-DD HH24:MI:SS'), 
        TO_TIMESTAMP('2027-06-22 15:10:00', 'YYYY-MM-DD HH24:MI:SS'), 
        2, 'Denied');

-- Insert sample parole records
INSERT INTO Parole (parole_id, prisoner_id, status, review_date, notes)
VALUES (1, 1003, 'Scheduled', TO_DATE('2023-06-15', 'YYYY-MM-DD'), 'Good behavior, eligible for early parole');

INSERT INTO Parole (parole_id, prisoner_id, status, review_date, notes)
VALUES (2, 1004, 'Pending', TO_DATE('2023-07-10', 'YYYY-MM-DD'), 'Rehabilitation program completed');

INSERT INTO Parole (parole_id, prisoner_id, status, review_date, notes)
VALUES (3, 1006, 'Scheduled', TO_DATE('2023-05-05', 'YYYY-MM-DD'), 'First offense, exemplary behavior');

INSERT INTO Parole (parole_id, prisoner_id, status, review_date, notes)
VALUES (4, 1007, 'Approved', TO_DATE('2023-04-20', 'YYYY-MM-DD'), 'Approved for release on 2023-06-01');

INSERT INTO Parole (parole_id, prisoner_id, status, review_date, notes)
VALUES (5, 1010, 'Denied', TO_DATE('2022-12-15', 'YYYY-MM-DD'), 'Multiple disciplinary actions, not recommended');

-- Update the sequence to start after the last prisoner ID
ALTER SEQUENCE prisoner_id_seq INCREMENT BY 1 MINVALUE 1000 MAXVALUE 9999999999 START WITH 1011 CACHE 20 NOORDER NOCYCLE;

-- Explicitly commit all changes to ensure data persistence
COMMIT;

-- Output success message
SELECT 'Sample data inserted successfully.' FROM DUAL; 