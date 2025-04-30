-- Oracle SQL Demo Queries for Prisoner Database

-- Query 1: List all prisoners with their cell block information
SELECT 
    p.prisoner_id, 
    p.fname || ' ' || p.lname AS full_name, 
    p.gender,
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
ORDER BY 
    p.prisoner_id;

-- Query 2: Find prisoners eligible for parole with good behavior (rating >= 4)
SELECT 
    p.prisoner_id, 
    p.fname || ' ' || p.lname AS full_name, 
    p.offense,
    p.behavior_rating,
    p.parole_status,
    cb.cellblock_name
FROM 
    Prisoner p
JOIN 
    Cell_Block cb ON p.cellblock_id = cb.cellblock_id
WHERE 
    p.parole_status = 'Eligible'
    AND p.behavior_rating >= 4
ORDER BY 
    p.behavior_rating DESC;

-- Query 3: Find all prisoners with good behavior (rating >= 4)
SELECT 
    p.prisoner_id, 
    p.fname || ' ' || p.lname AS full_name, 
    p.offense,
    p.behavior_rating,
    p.parole_status,
    cb.cellblock_name
FROM 
    Prisoner p
JOIN 
    Cell_Block cb ON p.cellblock_id = cb.cellblock_id
WHERE 
    p.behavior_rating >= 4
ORDER BY 
    p.behavior_rating DESC, p.fname, p.lname;

-- Query 4: Get cell block occupancy statistics
SELECT 
    cb.cellblock_id,
    cb.cellblock_name,
    cb.max_capacity,
    cb.current_capacity,
    ROUND((cb.current_capacity / cb.max_capacity) * 100, 2) AS occupancy_percentage
FROM 
    Cell_Block cb
ORDER BY 
    occupancy_percentage DESC;

-- Query 5: Distribution of prisoners by offense type
SELECT 
    offense,
    COUNT(*) as prisoner_count,
    ROUND((COUNT(*) / (SELECT COUNT(*) FROM Prisoner)) * 100, 2) AS percentage
FROM 
    Prisoner
GROUP BY 
    offense
ORDER BY 
    prisoner_count DESC; 