export const generateUniqueEmail = () => {
  const timestamp = Date.now();
  return `test${timestamp}@example.com`;
};

export const generateRandomUser = () => {
  return {
    firstName: 'Test',
    lastName: 'User',
    email: generateUniqueEmail(),
    nationality: 'México',
    phone: '+52123456789',
    password: 'TestPass123!'
  };
};