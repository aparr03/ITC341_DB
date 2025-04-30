import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Form, Button, Card } from 'react-bootstrap';
import './App.css';

function App() {
  const [prisoners, setPrisoners] = useState([]);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    crime: '',
    sentenceYears: '',
    admissionDate: '',
    releaseDate: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch prisoners from the backend API
  useEffect(() => {
    fetchPrisoners();
  }, []);

  // Format date from API for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    // Log the incoming date format for debugging
    console.log('Formatting date:', dateString, typeof dateString);
    
    // Handle Oracle timestamp format which might come as a string
    if (typeof dateString === 'string') {
      // Try ISO format first (YYYY-MM-DDTHH:mm:ss.sssZ)
      try {
        const date = new Date(dateString);
        if (!isNaN(date.getTime())) {
          return date.toLocaleDateString();
        }
      } catch (e) {
        console.log('Failed to parse as ISO date:', e);
      }
      
      // Try Oracle format DD-MMM-YY
      const oracleMatch = dateString.match(/(\d{1,2})-([A-Z]{3})-(\d{2})/i);
      if (oracleMatch) {
        const months = {
          JAN: 0, FEB: 1, MAR: 2, APR: 3, MAY: 4, JUN: 5,
          JUL: 6, AUG: 7, SEP: 8, OCT: 9, NOV: 10, DEC: 11
        };
        
        const day = parseInt(oracleMatch[1], 10);
        const month = months[oracleMatch[2].toUpperCase()];
        // Add 2000 to 2-digit years for 21st century
        const year = parseInt(oracleMatch[3], 10) + (oracleMatch[3] < 50 ? 2000 : 1900);
        
        const date = new Date(year, month, day);
        if (!isNaN(date.getTime())) {
          return date.toLocaleDateString();
        }
      }
    }
    
    // If it's a Date object, simply format it
    if (dateString instanceof Date && !isNaN(dateString.getTime())) {
      return dateString.toLocaleDateString();
    }
    
    // If we've tried everything and failed, return the original
    console.warn('Could not format date:', dateString);
    return String(dateString);
  };

  const fetchPrisoners = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching prisoners data from API...');
      const response = await fetch('/api/prisoners');
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Raw data from API:', JSON.stringify(data, null, 2));
      
      if (Array.isArray(data)) {
        console.log('Prisoner data is an array with length:', data.length);
        
        if (data.length > 0) {
          console.log('First prisoner record structure:', JSON.stringify(data[0], null, 2));
          console.log('Available columns:', Object.keys(data[0]));
          
          // Process data to ensure all records have required fields
          const processedData = data.map(prisoner => {
            // Make sure all expected fields exist, even if null
            return {
              PRISONER_ID: prisoner.PRISONER_ID || null,
              FNAME: prisoner.FNAME || '',
              LNAME: prisoner.LNAME || '',
              DATE_OF_BIRTH: prisoner.DATE_OF_BIRTH || null,
              OFFENSE: prisoner.OFFENSE || '',
              SENTENCE: prisoner.SENTENCE || '',
              ADMISSION_DATE: prisoner.ADMISSION_DATE || null,
              RELEASE_DATE: prisoner.RELEASE_DATE || null,
              BEHAVIOR_RATING: prisoner.BEHAVIOR_RATING || null,
              PAROLE_STATUS: prisoner.PAROLE_STATUS || '',
              CELLBLOCK_ID: prisoner.CELLBLOCK_ID || null,
              CELLBLOCK_NAME: prisoner.CELLBLOCK_NAME || ''
            };
          });
          
          console.log('Processed data sample:', JSON.stringify(processedData[0], null, 2));
          setPrisoners(processedData);
        } else {
          console.log('No prisoner records found in response');
          setPrisoners([]);
        }
      } else {
        console.error('API did not return an array:', data);
        setPrisoners([]);
      }
    } catch (error) {
      console.error('Error fetching prisoners:', error);
      setError('Failed to load prisoners. Please refresh the page.');
      setPrisoners([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      const requestBody = {
        fName: formData.firstName,
        lName: formData.lastName,
        date_of_birth: formData.dateOfBirth,
        offense: formData.crime,
        sentence: `${formData.sentenceYears} years`,
        admission_date: formData.admissionDate,
        release_date: formData.releaseDate,
        cellblock_id: 1, // Default to first cellblock
        gender: 'Male', // Default value
        behavior_rating: 3, // Default value
        parole_status: 'Ineligible' // Default value
      };
      
      console.log('Sending request:', requestBody);
      
      const response = await fetch('/api/prisoners', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! Status: ${response.status}, message: ${errorText}`);
      }
      
      // Refresh the prisoners list
      await fetchPrisoners();
      
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        crime: '',
        sentenceYears: '',
        admissionDate: '',
        releaseDate: ''
      });
      
    } catch (error) {
      console.error('Error saving prisoner:', error);
      setError('Failed to save prisoner. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-4">
      <h1 className="text-center mb-4">Oracle Prisoner Database</h1>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      <Row>
        <Col md={4}>
          <Card className="mb-4">
            <Card.Header>Add Prisoner</Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-2">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="firstName" 
                    value={formData.firstName} 
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
                
                <Form.Group className="mb-2">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="lastName" 
                    value={formData.lastName} 
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
                
                <Form.Group className="mb-2">
                  <Form.Label>Date of Birth</Form.Label>
                  <Form.Control 
                    type="date" 
                    name="dateOfBirth" 
                    value={formData.dateOfBirth} 
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
                
                <Form.Group className="mb-2">
                  <Form.Label>Crime</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="crime" 
                    value={formData.crime} 
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
                
                <Form.Group className="mb-2">
                  <Form.Label>Sentence (years)</Form.Label>
                  <Form.Control 
                    type="number" 
                    name="sentenceYears" 
                    value={formData.sentenceYears} 
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
                
                <Form.Group className="mb-2">
                  <Form.Label>Admission Date</Form.Label>
                  <Form.Control 
                    type="date" 
                    name="admissionDate" 
                    value={formData.admissionDate} 
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
                
                <Form.Group className="mb-2">
                  <Form.Label>Release Date</Form.Label>
                  <Form.Control 
                    type="date" 
                    name="releaseDate" 
                    value={formData.releaseDate} 
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
                
                <Button 
                  variant="primary" 
                  type="submit" 
                  className="w-100" 
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Prisoner Record'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={8}>
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <span>Prisoner Records ({prisoners.length})</span>
              <Button 
                variant="outline-primary" 
                size="sm"
                onClick={fetchPrisoners}
                disabled={loading}
              >
                Refresh
              </Button>
            </Card.Header>
            <Card.Body>
              {loading ? (
                <p className="text-center">Loading records...</p>
              ) : prisoners.length === 0 ? (
                <p className="text-center">No prisoners found. Add a new prisoner using the form.</p>
              ) : (
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>DOB</th>
                      <th>Crime</th>
                      <th>Sentence</th>
                      <th>Admission</th>
                      <th>Release</th>
                    </tr>
                  </thead>
                  <tbody>
                    {prisoners.map(prisoner => {
                      // Add safety checks with defaults
                      const id = prisoner.PRISONER_ID || 'Unknown';
                      const firstName = prisoner.FNAME || '';
                      const lastName = prisoner.LNAME || '';
                      const fullName = `${firstName} ${lastName}`.trim() || 'Unknown';
                      const dob = formatDate(prisoner.DATE_OF_BIRTH) || 'Unknown';
                      const crime = prisoner.OFFENSE || 'Unknown';
                      const sentence = prisoner.SENTENCE || 'Unknown';
                      const admission = formatDate(prisoner.ADMISSION_DATE) || 'Unknown';
                      const release = formatDate(prisoner.RELEASE_DATE) || 'Unknown';
                      
                      return (
                        <tr key={id}>
                          <td>{id}</td>
                          <td>{fullName}</td>
                          <td>{dob}</td>
                          <td>{crime}</td>
                          <td>{sentence}</td>
                          <td>{admission}</td>
                          <td>{release}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default App; 