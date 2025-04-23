import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Form, Button, Card } from 'react-bootstrap';
import './App.css';

function App() {
  const [prisoners, setPrisoners] = useState([]);
  const [formData, setFormData] = useState({
    id: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    crime: '',
    sentenceYears: '',
    admissionDate: '',
    releaseDate: ''
  });

  // This would connect to your Oracle DB in a real app
  // For demo purposes, we'll use a mock data setup
  useEffect(() => {
    // Simulating data loading
    const mockData = [
      {
        id: 1001,
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '1985-06-15',
        crime: 'Robbery',
        sentenceYears: 5,
        admissionDate: '2019-03-10',
        releaseDate: '2024-03-10'
      },
      {
        id: 1002,
        firstName: 'Jane',
        lastName: 'Smith',
        dateOfBirth: '1990-11-22',
        crime: 'Fraud',
        sentenceYears: 3,
        admissionDate: '2020-01-15',
        releaseDate: '2023-01-15'
      }
    ];
    
    setPrisoners(mockData);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create a new prisoner entry
    const newPrisoner = {
      ...formData,
      id: formData.id || Math.floor(1000 + Math.random() * 9000)
    };
    
    // Add to state (in a real app, this would save to the database)
    setPrisoners([...prisoners, newPrisoner]);
    
    // Reset form
    setFormData({
      id: '',
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      crime: '',
      sentenceYears: '',
      admissionDate: '',
      releaseDate: ''
    });
  };

  return (
    <Container className="mt-4">
      <h1 className="text-center mb-4">Oracle Prisoner Database</h1>
      
      <Row>
        <Col md={4}>
          <Card className="mb-4">
            <Card.Header>Add/Edit Prisoner</Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-2">
                  <Form.Label>ID (optional)</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="id" 
                    value={formData.id} 
                    onChange={handleInputChange}
                    placeholder="Auto-generated if blank" 
                  />
                </Form.Group>
                
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
                
                <Button variant="primary" type="submit" className="w-100">
                  Save Prisoner Record
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={8}>
          <Card>
            <Card.Header>Prisoner Records</Card.Header>
            <Card.Body>
              <div className="table-responsive">
                <Table striped bordered hover>
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
                    {prisoners.map(prisoner => (
                      <tr key={prisoner.id}>
                        <td>{prisoner.id}</td>
                        <td>{prisoner.firstName} {prisoner.lastName}</td>
                        <td>{prisoner.dateOfBirth}</td>
                        <td>{prisoner.crime}</td>
                        <td>{prisoner.sentenceYears} years</td>
                        <td>{prisoner.admissionDate}</td>
                        <td>{prisoner.releaseDate}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default App; 