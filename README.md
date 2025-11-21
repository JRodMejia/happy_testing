

# NutriApp

Web application built with Next.js and PostgreSQL for managing healthy dishes.

**Goals:**
- Explore the application features and flows.
- Analyze and design test cases for different user scenarios and dish management operations.
- Practice creating end-to-end automated tests using Cypress.io and modern development best practices.


## Features
- User registration and login (email/username and password)
- List, create, edit, and delete dishes
- Modern and responsive interface

## Requirements
* Node.js (v20.x or higher recommended)
* PostgreSQL (v15.x or higher recommended)

### How to install Node.js and PostgreSQL

#### Windows
- Download Node.js from [nodejs.org](https://nodejs.org/en/download/) and run the installer.
- Download PostgreSQL from [postgresql.org](https://www.postgresql.org/download/windows/) and run the installer.

#### macOS
- Install Node.js using Homebrew:
	```bash
	brew install node
	```
- Install PostgreSQL using Homebrew:
	```bash
	brew install postgresql
	```

#### Linux (Debian/Ubuntu)
- Install Node.js:
	```bash
	sudo apt update
	sudo apt install nodejs npm
	```
- Install PostgreSQL:
	```bash
	sudo apt update
	sudo apt install postgresql postgresql-contrib
	```

## Main Structure
- `/register`: User registration
- `/login`: Login
- `/dishes`: Dishes list
- `/dishes/new`: Create dish
- `/dishes/[id]`: Edit dish

## API
- `/api/register`: User registration
- `/api/login`: User login
- `/api/dishes`: List and create dishes
- `/api/dishes/[id]`: Edit and delete dishes

## Customization
You can modify the components in `src/app` to adapt the app to your needs.

## How to Start the Application from Scratch

1. Clone the repository and enter the directory:
	```bash
	git clone https://github.com/Academy-QA/happy_testing.git
	cd happy_testing
	```
2. Install dependencies:
	```bash
	npm install
	```
3. Set up your PostgreSQL database and configure the `DATABASE_URL` variable in `.env`:
	```env
	DATABASE_URL="postgresql://user:password@localhost:5432/nutriapp"
	```
4. Run migrations:
	```bash
	npx prisma migrate dev --name init
	```
5. Generate Prisma Client:
	```bash
	npx prisma generate
	```
6. (Optional) Run the seed script to populate the database with sample data:
	```bash
	node --loader ts-node/esm seed.ts
	```
7. Start the application:
	```bash
	npm run dev
	```
8. Open [http://localhost:3000](http://localhost:3000) in your browser


## Challenge: Automated Testing with Cypress.io


Add end-to-end tests using [Cypress.io](https://www.cypress.io/):

Official documentation: [https://docs.cypress.io/](https://docs.cypress.io/)

1. Install Cypress:
	 ```bash
	 npm install cypress --save-dev
	 ```
2. Add a script to `package.json`:
	 ```json
	 "scripts": {
		 ...
		 "cypress:open": "cypress open",
		 "cypress:run": "cypress run",
		 "cypress:api": "cypress run --spec 'cypress/e2e/api/**/*.cy.js'",
		 "cypress:e2e": "cypress run --spec 'cypress/e2e/tests/**/*.cy.js'"
	 }
	 ```
3. Run Cypress:
	 ```bash
	 # Open Cypress GUI
	 npm run cypress:open
	 
	 # Run all tests headless
	 npm run cypress:run
	 
	 # Run only API tests
	 npm run cypress:api
	 
	 # Run only E2E tests
	 npm run cypress:e2e
	 ```
4. Create your tests in the `cypress/e2e` folder.

### Test Structure

```
cypress/
├── e2e/
│   ├── api/              # API tests (27 tests)
│   │   ├── auth-api.cy.js    # Authentication API tests
│   │   └── dishes-api.cy.js  # Dishes CRUD API tests
│   └── tests/            # E2E UI tests
│       ├── login.cy.js
│       ├── register.cy.js
│       └── dishes.cy.js
├── fixtures/
│   └── api/              # Test data for API tests
│       ├── users.json
│       └── dishes.json
└── support/
    ├── commands/         # Custom Cypress commands
    │   ├── apiCommands.js
    │   └── commonCommands.js
    └── helpers/          # Helper functions
        └── apiHelpers.js
```

**Example API test:**

```js
// cypress/e2e/api/dishes-api.cy.js

describe('Dishes API', () => {
  it('should create a new dish', () => {
    cy.apiSetupAuth('test@nutriapp.com', 'password123');
    cy.apiCreateDish({
      name: 'Test Dish',
      description: 'Delicious test dish',
      prepTime: 15,
      cookTime: 30,
      steps: ['Mix ingredients', 'Cook', 'Serve']
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.dish).to.have.property('id');
    });
  });
});
```

**Example E2E test:**

```js
// cypress/e2e/tests/login.cy.js

describe('Login', () => {
	it('should log in with valid credentials', () => {
		cy.visit('/login');
		cy.get('input[name=email]').type('test@nutriapp.com');
		cy.get('input[name=password]').type('nutriapp123');
		cy.get('button[type=submit]').click();
		cy.url().should('include', '/dishes');
	});
});
```

### Available Custom Commands

#### API Commands
- `cy.apiRegister(userData)` - Register user
- `cy.apiLogin(email, password)` - Login
- `cy.apiSetupAuth(email, password)` - Setup authentication
- `cy.apiGetDishes()` - Get all dishes
- `cy.apiCreateDish(dishData)` - Create dish
- `cy.apiUpdateDish(id, data)` - Update dish
- `cy.apiDeleteDish(id)` - Delete dish

See [cypress/e2e/api/README.md](cypress/e2e/api/README.md) for complete API testing documentation.

Add more tests to validate user flows and dish management!

## 🚀 CI/CD Pipeline

This project uses an **optimized CI/CD pipeline** that runs only the necessary tests based on file changes.

### Pipeline Optimization

The CI automatically detects which files changed and runs only the relevant tests:

| Change Type | Tests Executed | Avg Time |
|-------------|---------------|----------|
| API code (`src/app/api/**`) | Playwright API + Cypress API | ~3 min |
| Cypress API tests | Cypress API only | ~1.5 min |
| Cypress E2E tests | Cypress E2E only | ~3 min |
| UI components (`src/**`) | Cypress E2E + Playwright E2E | ~5 min |
| Playwright tests | Playwright E2E only | ~3 min |

**Benefits:**
- ⚡ **60-81% faster** - Only runs necessary tests
- 💰 **Lower costs** - Reduced CI minutes
- 🎯 **Precise feedback** - Know exactly what failed

See [.github/workflows/CI-OPTIMIZATION.md](.github/workflows/CI-OPTIMIZATION.md) for detailed documentation.

### Running Tests Locally

```bash
# API Tests (Playwright)
npm run test:api

# API Tests (Cypress)
npm run cypress:api

# E2E Tests (Cypress)
npm run cypress:e2e

# E2E Tests (Playwright)
npm run playwright:test
```
