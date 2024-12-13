/// <reference types="cypress" />

describe('Login spec', () => {

  const mockSession = {
    id: 1,
    username: 'userName',
    firstName: 'firstName',
    lastName: 'lastName',
    admin: true
  };

  beforeEach(() => {
    cy.intercept('POST', '/api/auth/login', { body: mockSession, });
    cy.intercept(
      {
        method: 'GET',
        url: '/api/session',
      },
      []).as('session');

    cy.visit('/login');
    cy.get('input[formControlName=email]').type("yoga@studio.com");
    cy.get('input[formControlName=password]').type(`${"test!1234"}`);
    cy.get('button[type="submit"]').click();
  });

  it('should logout the user then redirect to login page', () => {
    cy.url().should('include', '/sessions');

    const logoutButton = cy.get("span.link").contains("Logout");

    // logoutButton.should("exist");
    logoutButton.click();

    cy.url().should("equal", "http://localhost:4200/");
  });

});
