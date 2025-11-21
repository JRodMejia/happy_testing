import { 
  validateUserResponse, 
  validateErrorResponse, 
  generateUniqueEmail 
} from '../../support/helpers/apiHelpers';

describe('API Tests - Authentication', () => {
  let testUser;

  before(() => {
    cy.fixture('api/users').then((users) => {
      testUser = users.validUser;
    });
  });

  describe('POST /api/register', () => {
    it('should register a new user successfully', () => {
      const uniqueEmail = generateUniqueEmail('newuser');
      const userData = {
        ...testUser,
        email: uniqueEmail,
      };

      cy.apiRegister(userData).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('user');
        
        validateUserResponse(response.body.user);
        expect(response.body.user.email).to.eq(uniqueEmail);
        expect(response.body.user.firstName).to.eq(userData.firstName);
        expect(response.body.user.lastName).to.eq(userData.lastName);
      });
    });

    it('should fail when email is missing', () => {
      const invalidUser = {
        firstName: 'Test',
        lastName: 'User',
        password: 'password123',
      };

      cy.apiRegister(invalidUser).then((response) => {
        validateErrorResponse(response, 400);
      });
    });

    it('should fail when password is missing', () => {
      const invalidUser = {
        email: generateUniqueEmail('nopass'),
        firstName: 'Test',
        lastName: 'User',
      };

      cy.apiRegister(invalidUser).then((response) => {
        validateErrorResponse(response, 400);
      });
    });

    it('should fail when registering with duplicate email', () => {
      const uniqueEmail = generateUniqueEmail('duplicate');
      const userData = {
        ...testUser,
        email: uniqueEmail,
      };

      // First registration
      cy.apiRegister(userData).then((response) => {
        expect(response.status).to.eq(200);
      });

      // Attempt duplicate registration
      cy.apiRegister(userData).then((response) => {
        expect(response.status).to.be.oneOf([400, 409]);
        expect(response.body).to.have.property('error');
      });
    });
  });

  describe('POST /api/login', () => {
    let registeredUser;

    before(() => {
      // Register a user for login tests
      const uniqueEmail = generateUniqueEmail('loginuser');
      registeredUser = {
        ...testUser,
        email: uniqueEmail,
      };

      cy.apiRegister(registeredUser).then((response) => {
        expect(response.status).to.eq(200);
      });
    });

    it('should login successfully with valid credentials', () => {
      cy.apiLogin(registeredUser.email, registeredUser.password).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('user');
        
        validateUserResponse(response.body.user);
        expect(response.body.user.email).to.eq(registeredUser.email);
        
        // Should set session cookie
        expect(response.headers).to.have.property('set-cookie');
      });
    });

    it('should fail with invalid email', () => {
      cy.apiLogin('nonexistent@test.com', 'password123').then((response) => {
        expect(response.status).to.be.oneOf([400, 401]);
        validateErrorResponse(response, response.status);
      });
    });

    it('should fail with invalid password', () => {
      cy.apiLogin(registeredUser.email, 'wrongpassword').then((response) => {
        expect(response.status).to.be.oneOf([400, 401]);
        validateErrorResponse(response, response.status);
      });
    });

    it('should fail when email is missing', () => {
      cy.request({
        method: 'POST',
        url: '/api/login',
        body: { password: 'password123' },
        failOnStatusCode: false,
      }).then((response) => {
        validateErrorResponse(response, 400);
      });
    });

    it('should fail when password is missing', () => {
      cy.request({
        method: 'POST',
        url: '/api/login',
        body: { email: registeredUser.email },
        failOnStatusCode: false,
      }).then((response) => {
        validateErrorResponse(response, 400);
      });
    });
  });

  describe('POST /api/logout', () => {
    let authenticatedUser;

    before(() => {
      // Register and login a user
      const uniqueEmail = generateUniqueEmail('logoutuser');
      authenticatedUser = {
        ...testUser,
        email: uniqueEmail,
      };

      cy.apiRegister(authenticatedUser);
      cy.apiLogin(authenticatedUser.email, authenticatedUser.password);
    });

    it('should logout successfully', () => {
      cy.apiLogout().then((response) => {
        expect(response.status).to.eq(200);
        
        // Should clear session cookie
        const setCookie = response.headers['set-cookie'];
        if (setCookie) {
          expect(setCookie.toString()).to.include('session=;');
        }
      });
    });
  });
});
