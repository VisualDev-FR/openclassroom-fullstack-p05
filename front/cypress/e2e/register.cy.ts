/// <reference types="cypress" />

describe('Register spec', () => {

  const mockUser = {
    firstName: 'firstName',
    lastName: 'lastName',
    email: 'test@example.com',
    password: 'password',
  };

  it('Redirect to login page after successful registration', () => {

    cy.visit("/register")
    cy.intercept('POST', '/api/auth/register', {
      statusCode: 201,
      body: {
        id: 1,
        username: mockUser.firstName,
        email: mockUser.email,
      },
    });

    cy.get('input[formControlName=firstName]').type(mockUser.firstName);
    cy.get('input[formControlName=lastName]').type(mockUser.lastName);
    cy.get('input[formControlName=email]').type(mockUser.email);
    cy.get('input[formControlName=password]').type(mockUser.password);

    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/login');
  });

  it('fail registration', () => {

    cy.visit("/register")
    cy.intercept('POST', '/api/auth/register', {
      statusCode: 403,
      body: null,
    });

    cy.get('input[formControlName=firstName]').type(mockUser.firstName);
    cy.get('input[formControlName=lastName]').type(mockUser.lastName);
    cy.get('input[formControlName=email]').type(mockUser.email);
    cy.get('input[formControlName=password]').type(mockUser.password);

    cy.get('button[type="submit"]').click();

    cy.url().should('include', '/register');
    cy.get("span.error").should("contain.text", "An error occurred");
  });

});
