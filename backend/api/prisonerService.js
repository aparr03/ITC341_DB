// This file would be replaced with actual Oracle DB connection code
// in a production environment using oracledb NPM package

let mockPrisoners = [
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

export const getPrisoners = () => {
  return Promise.resolve(mockPrisoners);
};

export const addPrisoner = (prisoner) => {
  const newPrisoner = {
    ...prisoner,
    id: prisoner.id || Math.floor(1000 + Math.random() * 9000)
  };
  mockPrisoners = [...mockPrisoners, newPrisoner];
  return Promise.resolve(newPrisoner);
};

export const updatePrisoner = (id, prisoner) => {
  mockPrisoners = mockPrisoners.map(p => 
    p.id === id ? { ...prisoner, id } : p
  );
  return Promise.resolve({ ...prisoner, id });
};

export const deletePrisoner = (id) => {
  mockPrisoners = mockPrisoners.filter(p => p.id !== id);
  return Promise.resolve({ id });
}; 