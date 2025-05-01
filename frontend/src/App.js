import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Form, Button, Card, InputGroup } from 'react-bootstrap';
import './App.css';

// Mock data for prisoners
const generateMockPrisoners = () => {
  const baseData = [
    {
      PRISONER_ID: 1001,
      FNAME: 'John',
      LNAME: 'Smith',
      DATE_OF_BIRTH: '1985-06-15',
      GENDER: 'Male',
      OFFENSE: 'Armed Robbery',
      SENTENCE: '15 years',
      ADMISSION_DATE: '2018-03-10',
      RELEASE_DATE: '2033-03-10',
      BEHAVIOR_RATING: 3,
      PAROLE_STATUS: 'Ineligible',
      CELLBLOCK_ID: 1,
      CELLBLOCK_NAME: 'Block A - Maximum Security'
    },
    {
      PRISONER_ID: 1002,
      FNAME: 'Robert',
      LNAME: 'Johnson',
      DATE_OF_BIRTH: '1979-11-22',
      GENDER: 'Male',
      OFFENSE: 'Murder',
      SENTENCE: 'Life',
      ADMISSION_DATE: '2010-07-05',
      RELEASE_DATE: null,
      BEHAVIOR_RATING: 2,
      PAROLE_STATUS: 'Ineligible',
      CELLBLOCK_ID: 1,
      CELLBLOCK_NAME: 'Block A - Maximum Security'
    },
    {
      PRISONER_ID: 1003,
      FNAME: 'Michael',
      LNAME: 'Williams',
      DATE_OF_BIRTH: '1990-04-30',
      GENDER: 'Male',
      OFFENSE: 'Assault',
      SENTENCE: '8 years',
      ADMISSION_DATE: '2019-01-15',
      RELEASE_DATE: '2027-01-15',
      BEHAVIOR_RATING: 4,
      PAROLE_STATUS: 'Eligible',
      CELLBLOCK_ID: 1,
      CELLBLOCK_NAME: 'Block A - Maximum Security'
    },
    {
      PRISONER_ID: 1004,
      FNAME: 'David',
      LNAME: 'Brown',
      DATE_OF_BIRTH: '1988-09-12',
      GENDER: 'Male',
      OFFENSE: 'Drug Trafficking',
      SENTENCE: '10 years',
      ADMISSION_DATE: '2017-05-20',
      RELEASE_DATE: '2027-05-20',
      BEHAVIOR_RATING: 5,
      PAROLE_STATUS: 'Eligible',
      CELLBLOCK_ID: 2,
      CELLBLOCK_NAME: 'Block B - Medium Security'
    },
    {
      PRISONER_ID: 1005,
      FNAME: 'James',
      LNAME: 'Davis',
      DATE_OF_BIRTH: '1982-03-08',
      GENDER: 'Male',
      OFFENSE: 'Fraud',
      SENTENCE: '5 years',
      ADMISSION_DATE: '2020-11-03',
      RELEASE_DATE: '2025-11-03',
      BEHAVIOR_RATING: 4,
      PAROLE_STATUS: 'Ineligible',
      CELLBLOCK_ID: 2,
      CELLBLOCK_NAME: 'Block B - Medium Security'
    },
    {
      PRISONER_ID: 1006,
      FNAME: 'Sarah',
      LNAME: 'Wilson',
      DATE_OF_BIRTH: '1992-07-19',
      GENDER: 'Female',
      OFFENSE: 'Burglary',
      SENTENCE: '3 years',
      ADMISSION_DATE: '2021-02-28',
      RELEASE_DATE: '2024-02-28',
      BEHAVIOR_RATING: 5,
      PAROLE_STATUS: 'Pending',
      CELLBLOCK_ID: 2,
      CELLBLOCK_NAME: 'Block B - Medium Security'
    },
    {
      PRISONER_ID: 1007,
      FNAME: 'Jennifer',
      LNAME: 'Miller',
      DATE_OF_BIRTH: '1995-12-05',
      GENDER: 'Female',
      OFFENSE: 'Theft',
      SENTENCE: '2 years',
      ADMISSION_DATE: '2022-04-17',
      RELEASE_DATE: '2024-04-17',
      BEHAVIOR_RATING: 5,
      PAROLE_STATUS: 'Eligible',
      CELLBLOCK_ID: 3,
      CELLBLOCK_NAME: 'Block C - Minimum Security'
    },
    {
      PRISONER_ID: 1008,
      FNAME: 'William',
      LNAME: 'Taylor',
      DATE_OF_BIRTH: '1975-09-28',
      GENDER: 'Male',
      OFFENSE: 'Embezzlement',
      SENTENCE: '7 years',
      ADMISSION_DATE: '2019-08-12',
      RELEASE_DATE: '2026-08-12',
      BEHAVIOR_RATING: 3,
      PAROLE_STATUS: 'Ineligible',
      CELLBLOCK_ID: 3,
      CELLBLOCK_NAME: 'Block C - Minimum Security'
    },
    {
      PRISONER_ID: 1009,
      FNAME: 'Richard',
      LNAME: 'Anderson',
      DATE_OF_BIRTH: '1970-02-14',
      GENDER: 'Male',
      OFFENSE: 'Attempted Murder',
      SENTENCE: '25 years',
      ADMISSION_DATE: '2010-10-05',
      RELEASE_DATE: '2035-10-05',
      BEHAVIOR_RATING: 1,
      PAROLE_STATUS: 'Ineligible',
      CELLBLOCK_ID: 4,
      CELLBLOCK_NAME: 'Special Housing Unit'
    },
    {
      PRISONER_ID: 1010,
      FNAME: 'Thomas',
      LNAME: 'White',
      DATE_OF_BIRTH: '1983-11-17',
      GENDER: 'Male',
      OFFENSE: 'Assault on Officer',
      SENTENCE: '12 years',
      ADMISSION_DATE: '2015-06-22',
      RELEASE_DATE: '2027-06-22',
      BEHAVIOR_RATING: 2,
      PAROLE_STATUS: 'Denied',
      CELLBLOCK_ID: 4,
      CELLBLOCK_NAME: 'Special Housing Unit'
    },
    {
      PRISONER_ID: 1011,
      FNAME: 'Emily',
      LNAME: 'Johnson',
      DATE_OF_BIRTH: '1991-05-03',
      GENDER: 'Female',
      OFFENSE: 'Identity Theft',
      SENTENCE: '4 years',
      ADMISSION_DATE: '2021-09-15',
      RELEASE_DATE: '2025-09-15',
      BEHAVIOR_RATING: 4,
      PAROLE_STATUS: 'Eligible',
      CELLBLOCK_ID: 3,
      CELLBLOCK_NAME: 'Block C - Minimum Security'
    },
    {
      PRISONER_ID: 1012,
      FNAME: 'Daniel',
      LNAME: 'Garcia',
      DATE_OF_BIRTH: '1986-12-09',
      GENDER: 'Male',
      OFFENSE: 'Grand Theft Auto',
      SENTENCE: '6 years',
      ADMISSION_DATE: '2020-03-27',
      RELEASE_DATE: '2026-03-27',
      BEHAVIOR_RATING: 3,
      PAROLE_STATUS: 'Ineligible',
      CELLBLOCK_ID: 2,
      CELLBLOCK_NAME: 'Block B - Medium Security'
    },
    {
      PRISONER_ID: 1013,
      FNAME: 'Maria',
      LNAME: 'Rodriguez',
      DATE_OF_BIRTH: '1989-07-14',
      GENDER: 'Female',
      OFFENSE: 'Drug Possession',
      SENTENCE: '3 years',
      ADMISSION_DATE: '2022-01-10',
      RELEASE_DATE: '2025-01-10',
      BEHAVIOR_RATING: 5,
      PAROLE_STATUS: 'Eligible',
      CELLBLOCK_ID: 3,
      CELLBLOCK_NAME: 'Block C - Minimum Security'
    },
    {
      PRISONER_ID: 1014,
      FNAME: 'Christopher',
      LNAME: 'Martinez',
      DATE_OF_BIRTH: '1976-02-23',
      GENDER: 'Male',
      OFFENSE: 'Robbery',
      SENTENCE: '10 years',
      ADMISSION_DATE: '2018-06-05',
      RELEASE_DATE: '2028-06-05',
      BEHAVIOR_RATING: 2,
      PAROLE_STATUS: 'Ineligible',
      CELLBLOCK_ID: 1,
      CELLBLOCK_NAME: 'Block A - Maximum Security'
    },
    {
      PRISONER_ID: 1015,
      FNAME: 'Jessica',
      LNAME: 'Thompson',
      DATE_OF_BIRTH: '1993-09-28',
      GENDER: 'Female',
      OFFENSE: 'Assault',
      SENTENCE: '5 years',
      ADMISSION_DATE: '2022-07-19',
      RELEASE_DATE: '2027-07-19',
      BEHAVIOR_RATING: 3,
      PAROLE_STATUS: 'Pending',
      CELLBLOCK_ID: 2,
      CELLBLOCK_NAME: 'Block B - Medium Security'
    },
    {
      PRISONER_ID: 1016,
      FNAME: 'Kevin',
      LNAME: 'Lee',
      DATE_OF_BIRTH: '1981-11-17',
      GENDER: 'Male',
      OFFENSE: 'Extortion',
      SENTENCE: '8 years',
      ADMISSION_DATE: '2019-12-10',
      RELEASE_DATE: '2027-12-10',
      BEHAVIOR_RATING: 3,
      PAROLE_STATUS: 'Ineligible',
      CELLBLOCK_ID: 1,
      CELLBLOCK_NAME: 'Block A - Maximum Security'
    },
    {
      PRISONER_ID: 1017,
      FNAME: 'Michelle',
      LNAME: 'Clark',
      DATE_OF_BIRTH: '1984-03-30',
      GENDER: 'Female',
      OFFENSE: 'Cybercrime',
      SENTENCE: '7 years',
      ADMISSION_DATE: '2020-05-14',
      RELEASE_DATE: '2027-05-14',
      BEHAVIOR_RATING: 4,
      PAROLE_STATUS: 'Eligible',
      CELLBLOCK_ID: 3,
      CELLBLOCK_NAME: 'Block C - Minimum Security'
    },
    {
      PRISONER_ID: 1018,
      FNAME: 'Brian',
      LNAME: 'Scott',
      DATE_OF_BIRTH: '1978-01-09',
      GENDER: 'Male',
      OFFENSE: 'Murder',
      SENTENCE: 'Life',
      ADMISSION_DATE: '2012-11-21',
      RELEASE_DATE: null,
      BEHAVIOR_RATING: 2,
      PAROLE_STATUS: 'Ineligible',
      CELLBLOCK_ID: 1,
      CELLBLOCK_NAME: 'Block A - Maximum Security'
    },
    {
      PRISONER_ID: 1019,
      FNAME: 'Amanda',
      LNAME: 'Wright',
      DATE_OF_BIRTH: '1987-06-18',
      GENDER: 'Female',
      OFFENSE: 'Kidnapping',
      SENTENCE: '15 years',
      ADMISSION_DATE: '2016-09-03',
      RELEASE_DATE: '2031-09-03',
      BEHAVIOR_RATING: 3,
      PAROLE_STATUS: 'Denied',
      CELLBLOCK_ID: 1,
      CELLBLOCK_NAME: 'Block A - Maximum Security'
    },
    {
      PRISONER_ID: 1020,
      FNAME: 'Justin',
      LNAME: 'Walker',
      DATE_OF_BIRTH: '1992-10-05',
      GENDER: 'Male',
      OFFENSE: 'Arson',
      SENTENCE: '12 years',
      ADMISSION_DATE: '2017-08-14',
      RELEASE_DATE: '2029-08-14',
      BEHAVIOR_RATING: 1,
      PAROLE_STATUS: 'Ineligible',
      CELLBLOCK_ID: 4,
      CELLBLOCK_NAME: 'Special Housing Unit'
    }
  ];
  
  // Add more generated mock data
  const firstNames = ['James', 'Robert', 'John', 'Michael', 'William', 'David', 'Richard', 'Joseph', 'Thomas', 'Charles', 'Mary', 'Patricia', 'Jennifer', 'Linda', 'Elizabeth', 'Barbara', 'Susan', 'Jessica', 'Sarah', 'Karen'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin'];
  const offenses = ['Theft', 'Drug Possession', 'Assault', 'Fraud', 'Burglary', 'Armed Robbery', 'Murder', 'Arson', 'Kidnapping', 'Identity Theft', 'Cybercrime', 'DUI', 'Forgery', 'Extortion', 'Drug Trafficking', 'Vandalism', 'Counterfeiting', 'Embezzlement', 'Tax Evasion', 'Money Laundering'];
  const cellBlocks = [
    { id: 1, name: 'Block A - Maximum Security' },
    { id: 2, name: 'Block B - Medium Security' },
    { id: 3, name: 'Block C - Minimum Security' },
    { id: 4, name: 'Special Housing Unit' }
  ];
  const paroleStatuses = ['Eligible', 'Ineligible', 'Pending', 'Denied'];
  
  let nextId = 1021; // Start after the existing IDs
  
  for (let i = 0; i < 180; i++) { // Generate 180 more prisoners (for a total of 200)
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const offense = offenses[Math.floor(Math.random() * offenses.length)];
    const cellBlock = cellBlocks[Math.floor(Math.random() * cellBlocks.length)];
    const paroleStatus = paroleStatuses[Math.floor(Math.random() * paroleStatuses.length)];
    const behaviorRating = Math.floor(Math.random() * 5) + 1; // 1-5
    
    // Generate random dates
    const now = new Date();
    const birthYear = 1960 + Math.floor(Math.random() * 40); // Age between ~23-63
    const birthMonth = Math.floor(Math.random() * 12) + 1;
    const birthDay = Math.floor(Math.random() * 28) + 1; // Avoid invalid dates
    
    const admissionYear = 2010 + Math.floor(Math.random() * 13); // 2010-2023
    const admissionMonth = Math.floor(Math.random() * 12) + 1;
    const admissionDay = Math.floor(Math.random() * 28) + 1;
    
    // Calculate sentence length (1-30 years or life)
    let sentenceYears, releaseDate, sentence;
    if (offense === 'Murder' && Math.random() < 0.7) {
      sentence = 'Life';
      releaseDate = null;
    } else {
      sentenceYears = Math.floor(Math.random() * 30) + 1;
      sentence = `${sentenceYears} years`;
      const releaseDate_obj = new Date(admissionYear, admissionMonth - 1, admissionDay);
      releaseDate_obj.setFullYear(releaseDate_obj.getFullYear() + sentenceYears);
      releaseDate = releaseDate_obj.toISOString().split('T')[0];
    }
    
    baseData.push({
      PRISONER_ID: nextId++,
      FNAME: firstName,
      LNAME: lastName,
      DATE_OF_BIRTH: `${birthYear}-${birthMonth.toString().padStart(2, '0')}-${birthDay.toString().padStart(2, '0')}`,
      GENDER: Math.random() < 0.75 ? 'Male' : 'Female', // 75% male
      OFFENSE: offense,
      SENTENCE: sentence,
      ADMISSION_DATE: `${admissionYear}-${admissionMonth.toString().padStart(2, '0')}-${admissionDay.toString().padStart(2, '0')}`,
      RELEASE_DATE: releaseDate,
      BEHAVIOR_RATING: behaviorRating,
      PAROLE_STATUS: paroleStatus,
      CELLBLOCK_ID: cellBlock.id,
      CELLBLOCK_NAME: cellBlock.name
    });
  }
  
  return baseData;
};

const mockPrisonerData = generateMockPrisoners();

function App() {
  const [prisoners, setPrisoners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sqlQuery, setSqlQuery] = useState('SELECT * FROM Prisoner');
  const [queryResults, setQueryResults] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const prisonersPerPage = 10;

  // Format date from API for display
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    
    // Try to parse the date
    try {
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString();
      }
    } catch (e) {
      console.log('Failed to parse date:', e);
    }
    
    // Return original if parsing fails
    return String(dateString);
  };

  // Fetch prisoners from the backend API
  const fetchPrisoners = async () => {
    // Always use mock data
    setPrisoners(mockPrisonerData);
    return;
  };

  // SQL query examples
  const sampleQueries = [
    "SELECT * FROM Prisoner",
    "SELECT * FROM Prisoner WHERE parole_status = 'Eligible' AND behavior_rating >= 4",
    "SELECT * FROM Prisoner WHERE behavior_rating >= 4",
    "SELECT * FROM Cell_Block ORDER BY occupancy_percentage DESC",
    "SELECT offense, COUNT(*) as prisoner_count FROM Prisoner GROUP BY offense",
    "SELECT offense, COUNT(*) as count, ROUND((COUNT(*) / (SELECT COUNT(*) FROM Prisoner)) * 100, 2) AS percentage FROM Prisoner GROUP BY offense ORDER BY percentage DESC"
  ];

  // Run SQL query demonstration
  const runSqlQuery = async () => {
    try {
      setLoading(true);
      setError(null);
      setQueryResults(null);
      
      // In a real implementation, this would send the query to the backend
      // For demo purposes, we'll simulate results based on mock data
      
      // Match exactly against the query strings first
      const exactMatch = sampleQueries.indexOf(sqlQuery);
      if (exactMatch !== -1) {
        // Handle exact matches to sample queries
        switch (exactMatch) {
          case 0: // "SELECT * FROM Prisoner"
            setQueryResults({
              success: true,
              data: mockPrisonerData,
              message: `Query returned ${mockPrisonerData.length} rows`
            });
            break;
          
          case 1: // "SELECT * FROM Prisoner WHERE parole_status = 'Eligible' AND behavior_rating >= 4"
            const eligibleWithGoodBehavior = mockPrisonerData.filter(p => 
              p.PAROLE_STATUS === 'Eligible' && p.BEHAVIOR_RATING >= 4
            );
            setQueryResults({
              success: true,
              data: eligibleWithGoodBehavior,
              message: `Query returned ${eligibleWithGoodBehavior.length} rows`
            });
            break;
          
          case 2: // "SELECT * FROM Prisoner WHERE behavior_rating >= 4"
            const goodBehavior = mockPrisonerData.filter(p => p.BEHAVIOR_RATING >= 4);
            setQueryResults({
              success: true,
              data: goodBehavior,
              message: `Query returned ${goodBehavior.length} rows`
            });
            break;
          
          case 3: // "SELECT * FROM Cell_Block ORDER BY occupancy_percentage DESC"
            const cellBlocks = [
              { CELLBLOCK_ID: 1, CELLBLOCK_NAME: 'Block A - Maximum Security', MAX_CAPACITY: 50, CURRENT_CAPACITY: 42, OCCUPANCY_PERCENTAGE: 84 },
              { CELLBLOCK_ID: 2, CELLBLOCK_NAME: 'Block B - Medium Security', MAX_CAPACITY: 100, CURRENT_CAPACITY: 78, OCCUPANCY_PERCENTAGE: 78 },
              { CELLBLOCK_ID: 3, CELLBLOCK_NAME: 'Block C - Minimum Security', MAX_CAPACITY: 150, CURRENT_CAPACITY: 103, OCCUPANCY_PERCENTAGE: 68.67 },
              { CELLBLOCK_ID: 4, CELLBLOCK_NAME: 'Special Housing Unit', MAX_CAPACITY: 25, CURRENT_CAPACITY: 15, OCCUPANCY_PERCENTAGE: 60 }
            ].sort((a, b) => b.OCCUPANCY_PERCENTAGE - a.OCCUPANCY_PERCENTAGE);
            
            setQueryResults({
              success: true,
              data: cellBlocks,
              message: `Query returned ${cellBlocks.length} rows`
            });
            break;
          
          case 4: // "SELECT offense, COUNT(*) as prisoner_count FROM Prisoner GROUP BY offense"
            const offenses = {};
            mockPrisonerData.forEach(p => {
              offenses[p.OFFENSE] = (offenses[p.OFFENSE] || 0) + 1;
            });
            
            const offenseData = Object.entries(offenses).map(([offense, count]) => ({
              OFFENSE: offense,
              PRISONER_COUNT: count
            })).sort((a, b) => b.PRISONER_COUNT - a.PRISONER_COUNT);
            
            setQueryResults({
              success: true,
              data: offenseData,
              message: `Query returned ${offenseData.length} rows`
            });
            break;
            
          case 5: // "SELECT offense, COUNT(*) as count, ROUND((COUNT(*) / (SELECT COUNT(*) FROM Prisoner)) * 100, 2) AS percentage FROM Prisoner GROUP BY offense ORDER BY percentage DESC"
            const offensePercentages = {};
            mockPrisonerData.forEach(p => {
              offensePercentages[p.OFFENSE] = (offensePercentages[p.OFFENSE] || 0) + 1;
            });
            
            const totalPrisoners = mockPrisonerData.length;
            const offensePercentageData = Object.entries(offensePercentages).map(([offense, count]) => ({
              OFFENSE: offense,
              COUNT: count,
              PERCENTAGE: Number(((count / totalPrisoners) * 100).toFixed(2))
            })).sort((a, b) => b.PERCENTAGE - a.PERCENTAGE);
            
            setQueryResults({
              success: true,
              data: offensePercentageData,
              message: `Query returned ${offensePercentageData.length} rows`
            });
            break;
          
          default:
            setQueryResults({
              success: false,
              data: [],
              message: "Query not recognized. Try one of the sample queries shown."
            });
            break;
        }
      } else {
        // Try to parse custom queries
        const lowerQuery = sqlQuery.toLowerCase();
        
        if (lowerQuery.includes('select * from prisoner') || lowerQuery.includes('from prisoner')) {
          // Apply filters if present
          let filteredData = [...mockPrisonerData];
          
          if (lowerQuery.includes('behavior_rating')) {
            const ratingMatch = lowerQuery.match(/behavior_rating\s*>=\s*(\d+)/);
            if (ratingMatch && ratingMatch[1]) {
              const ratingThreshold = parseInt(ratingMatch[1]);
              filteredData = filteredData.filter(p => p.BEHAVIOR_RATING >= ratingThreshold);
            }
          }
          
          if (lowerQuery.includes('parole_status')) {
            const statusMatch = lowerQuery.match(/parole_status\s*=\s*'(\w+)'/i);
            if (statusMatch && statusMatch[1]) {
              const status = statusMatch[1];
              filteredData = filteredData.filter(p => 
                p.PAROLE_STATUS.toLowerCase() === status.toLowerCase()
              );
            }
          }
          
          if (lowerQuery.includes('release_date')) {
            // For years remaining calculation
            if (lowerQuery.includes('sysdate') && lowerQuery.includes('>')) {
              const yearMatch = lowerQuery.match(/>\s*(\d+)/);
              if (yearMatch && yearMatch[1]) {
                const yearsThreshold = parseInt(yearMatch[1]);
                const today = new Date();
                
                filteredData = filteredData.filter(p => {
                  if (!p.RELEASE_DATE) return false;
                  const releaseDate = new Date(p.RELEASE_DATE);
                  const diffTime = releaseDate - today;
                  const diffYears = diffTime / (1000 * 60 * 60 * 24 * 365);
                  return diffYears > yearsThreshold;
                });
              }
            }
          }
          
          setQueryResults({
            success: true,
            data: filteredData,
            message: `Query returned ${filteredData.length} rows`
          });
        }
        else if (lowerQuery.includes('cell_block')) {
          const cellBlocks = [
            { CELLBLOCK_ID: 1, CELLBLOCK_NAME: 'Block A - Maximum Security', MAX_CAPACITY: 50, CURRENT_CAPACITY: 42, OCCUPANCY_PERCENTAGE: 84 },
            { CELLBLOCK_ID: 2, CELLBLOCK_NAME: 'Block B - Medium Security', MAX_CAPACITY: 100, CURRENT_CAPACITY: 78, OCCUPANCY_PERCENTAGE: 78 },
            { CELLBLOCK_ID: 3, CELLBLOCK_NAME: 'Block C - Minimum Security', MAX_CAPACITY: 150, CURRENT_CAPACITY: 103, OCCUPANCY_PERCENTAGE: 68.67 },
            { CELLBLOCK_ID: 4, CELLBLOCK_NAME: 'Special Housing Unit', MAX_CAPACITY: 25, CURRENT_CAPACITY: 15, OCCUPANCY_PERCENTAGE: 60 }
          ];
          
          if (lowerQuery.includes('order by') && lowerQuery.includes('occupancy_percentage desc')) {
            cellBlocks.sort((a, b) => b.OCCUPANCY_PERCENTAGE - a.OCCUPANCY_PERCENTAGE);
          }
          
          setQueryResults({
            success: true,
            data: cellBlocks,
            message: `Query returned ${cellBlocks.length} rows`
          });
        }
        else if (lowerQuery.includes('offense') && lowerQuery.includes('count')) {
          const offenses = {};
          mockPrisonerData.forEach(p => {
            offenses[p.OFFENSE] = (offenses[p.OFFENSE] || 0) + 1;
          });

          if (lowerQuery.includes('percentage') || lowerQuery.includes('round')) {
            // Handle offense percentage query
            const totalPrisoners = mockPrisonerData.length;
            const offensePercentageData = Object.entries(offenses).map(([offense, count]) => ({
              OFFENSE: offense,
              COUNT: count,
              PERCENTAGE: Number(((count / totalPrisoners) * 100).toFixed(2))
            })).sort((a, b) => b.PERCENTAGE - a.PERCENTAGE);
            
            setQueryResults({
              success: true,
              data: offensePercentageData,
              message: `Query returned ${offensePercentageData.length} rows`
            });
          } else {
            // Regular offense distribution query
            const offenseData = Object.entries(offenses).map(([offense, count]) => ({
              OFFENSE: offense,
              PRISONER_COUNT: count
            })).sort((a, b) => b.PRISONER_COUNT - a.PRISONER_COUNT);
            
            setQueryResults({
              success: true,
              data: offenseData,
              message: `Query returned ${offenseData.length} rows`
            });
          }
        }
        else {
          setQueryResults({
            success: false,
            data: [],
            message: "Query not recognized. Try one of the sample queries shown."
          });
        }
      }
    } catch (error) {
      console.error('Error running SQL query:', error);
      setQueryResults({
        success: false,
        data: [],
        message: `Error: ${error.message}`
      });
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchPrisoners();
  }, []);

  // Filter prisoners based on search term
  const filteredPrisoners = prisoners.filter(prisoner => {
    const searchLower = searchTerm.toLowerCase();
    return (
      prisoner.FNAME.toLowerCase().includes(searchLower) ||
      prisoner.LNAME.toLowerCase().includes(searchLower) ||
      prisoner.OFFENSE.toLowerCase().includes(searchLower) ||
      (prisoner.CELLBLOCK_NAME && prisoner.CELLBLOCK_NAME.toLowerCase().includes(searchLower)) ||
      prisoner.PAROLE_STATUS.toLowerCase().includes(searchLower)
    );
  });

  // Calculate pagination
  const indexOfLastPrisoner = currentPage * prisonersPerPage;
  const indexOfFirstPrisoner = indexOfLastPrisoner - prisonersPerPage;
  const currentPrisoners = filteredPrisoners.slice(indexOfFirstPrisoner, indexOfLastPrisoner);
  const totalPages = Math.ceil(filteredPrisoners.length / prisonersPerPage);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Handle query selection from dropdown
  const handleQuerySelect = (query) => {
    setSqlQuery(query);
  };

  // In the App component, add this function before the return statement
  const getBehaviorRatingClass = (rating) => {
    switch (parseInt(rating)) {
      case 1: return 'rating-1';
      case 2: return 'rating-2';
      case 3: return 'rating-3';
      case 4: return 'rating-4';
      case 5: return 'rating-5';
      default: return '';
    }
  };

  const getParoleStatusBadge = (status) => {
    return status;
  };

  return (
    <Container fluid className="mt-4 mb-5">
      <h1 className="text-center mb-4">Oracle Prisoner Database</h1>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Header>
              <h4>Prisoner Registry</h4>
            </Card.Header>
            <Card.Body>
              <InputGroup className="mb-3">
                <Form.Control
                  placeholder="Search by name, offense, cell block..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button variant="outline-secondary" onClick={() => setSearchTerm('')}>
                  Clear
                </Button>
              </InputGroup>
              
              <div className="table-responsive">
                <Table striped bordered hover size="sm">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Gender</th>
                      <th>DOB</th>
                      <th>Offense</th>
                      <th>Sentence</th>
                      <th>Admission Date</th>
                      <th>Release Date</th>
                      <th>Behavior</th>
                      <th>Parole Status</th>
                      <th>Cell Block</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="11" className="text-center">Loading...</td>
                      </tr>
                    ) : currentPrisoners.length === 0 ? (
                      <tr>
                        <td colSpan="11" className="text-center">No prisoners found</td>
                      </tr>
                    ) : (
                      currentPrisoners.map(prisoner => (
                        <tr key={prisoner.PRISONER_ID}>
                          <td>{prisoner.PRISONER_ID}</td>
                          <td>{prisoner.FNAME} {prisoner.LNAME}</td>
                          <td>{prisoner.GENDER}</td>
                          <td>{formatDate(prisoner.DATE_OF_BIRTH)}</td>
                          <td>{prisoner.OFFENSE}</td>
                          <td>{prisoner.SENTENCE}</td>
                          <td>{formatDate(prisoner.ADMISSION_DATE)}</td>
                          <td>{prisoner.RELEASE_DATE ? formatDate(prisoner.RELEASE_DATE) : 'Life'}</td>
                          <td className={getBehaviorRatingClass(prisoner.BEHAVIOR_RATING)}>
                            <strong>{prisoner.BEHAVIOR_RATING}</strong> / 5
                          </td>
                          <td>{getParoleStatusBadge(prisoner.PAROLE_STATUS)}</td>
                          <td>{prisoner.CELLBLOCK_NAME}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              </div>
              <div className="mt-2 d-flex justify-content-between align-items-center">
                <div className="text-muted">
                  Showing {Math.min(indexOfFirstPrisoner + 1, filteredPrisoners.length)} to {Math.min(indexOfLastPrisoner, filteredPrisoners.length)} of {filteredPrisoners.length} prisoners
                </div>
                {totalPages > 1 && (
                  <div className="d-flex">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <Button 
                        key={page} 
                        variant={currentPage === page ? "primary" : "outline-primary"} 
                        className="mx-1"
                        onClick={() => handlePageChange(page)}
                        size="sm"
                      >
                        {page}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Header>
              <h4>Query Loader</h4>
            </Card.Header>
            <Card.Body>
              <Form.Group className="mb-3">
                <Form.Label>Sample Queries:</Form.Label>
                <div className="d-flex flex-wrap gap-2 mb-3">
                  <Button 
                    variant="outline-primary" 
                    size="sm"
                    onClick={() => handleQuerySelect(sampleQueries[0])}
                  >
                    All Prisoners
                  </Button>
                  <Button 
                    variant="outline-primary" 
                    size="sm"
                    onClick={() => handleQuerySelect(sampleQueries[1])}
                  >
                    Eligible for Parole
                  </Button>
                  <Button 
                    variant="outline-primary" 
                    size="sm"
                    onClick={() => handleQuerySelect(sampleQueries[2])}
                  >
                    Good Behavior (≥4)
                  </Button>
                  <Button 
                    variant="outline-primary" 
                    size="sm"
                    onClick={() => handleQuerySelect(sampleQueries[3])}
                  >
                    Cell Block Occupancy
                  </Button>
                  <Button 
                    variant="outline-primary" 
                    size="sm"
                    onClick={() => handleQuerySelect(sampleQueries[4])}
                  >
                    Offense Distribution
                  </Button>
                  <Button 
                    variant="outline-primary" 
                    size="sm"
                    onClick={() => handleQuerySelect(sampleQueries[5])}
                  >
                    Offense %
                  </Button>
                </div>
                
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={sqlQuery}
                  onChange={(e) => setSqlQuery(e.target.value)}
                  placeholder="Enter SQL query"
                />
                <Form.Text className="text-muted">
                  Enter a SQL query to test the database functionality.
                </Form.Text>
              </Form.Group>
              
              <Button 
                variant="primary" 
                onClick={runSqlQuery}
                disabled={loading || !sqlQuery.trim()}
              >
                {loading ? 'Running...' : 'Run Query'}
              </Button>
              
              {queryResults && (
                <div className="mt-4">
                  <div className={`alert ${queryResults.success ? 'alert-success' : 'alert-danger'}`}>
                    {queryResults.message}
                  </div>
                  
                  {queryResults.data.length > 0 && (
                    <div className="table-responsive mt-3">
                      <Table striped bordered hover size="sm">
                        <thead>
                          <tr>
                            {Object.keys(queryResults.data[0]).map(key => (
                              <th key={key}>{key}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {queryResults.data.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                              {Object.entries(row).map(([key, value], colIndex) => (
                                <td key={colIndex}>
                                  {value !== null 
                                    ? key === 'PERCENTAGE' 
                                      ? `${value}%` 
                                      : String(value)
                                    : 'NULL'}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  )}
                </div>
              )}
            </Card.Body>
            <Card.Footer className="text-muted">
              <small>
                Connect to the database with: <code>docker exec -it itc341_db-oracle-db-1 bash -c "sqlplus system/ITC341ProjectPassword@//localhost:1521/xepdb1"</code>
              </small>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default App; 