/// <reference types="cypress" />

describe('Login spec', () => {

  const mockSession = {
    id: 1,
    username: 'userName',
    firstName: 'firstName',
    lastName: 'lastName',
    admin: true
  };

  it('Login successfull', () => {

    cy.visit('/login');
    cy.intercept('POST', '/api/auth/login', { body: mockSession, });
    cy.intercept(
      {
        method: 'GET',
        url: '/api/session',
      },
      []).as('session');

    cy.get('input[formControlName=email]').type("yoga@studio.com");
    cy.get('input[formControlName=password]').type(`${"test!1234"}{enter}{enter}`);

    cy.url().should('include', '/sessions');
  });

  it('Login fail', () => {

    cy.visit('/login')
    cy.intercept('POST', '/api/auth/login', { statusCode: 403, body: null, });

    cy.get('input[formControlName=email]').type("yoga@studio.com");
    cy.get('input[formControlName=password]').type("test!1234");
    cy.get("button[type=submit]").click();

    cy.url().should('include', '/login');
    cy.get("p.error").should("contain.text", "An error occurred");
  });

});
