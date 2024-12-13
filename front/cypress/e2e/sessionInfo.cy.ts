/// <reference types="cypress" />


describe("Current session features", () => {

  const mockSessionInfo = {
    id: 1,
    username: 'userName',
    firstName: 'firstName',
    lastName: 'lastName',
    email: "test@example.com",
    admin: true,
  };

  const mockUser = {
    id: 1,
    email: mockSessionInfo.email,
    lastName: mockSessionInfo.lastName,
    firstName: mockSessionInfo.firstName,
    admin: mockSessionInfo.admin,
    password: "password",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    cy.intercept('POST', '/api/auth/login', { body: mockSessionInfo, });

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

  it('should redirect to /me then display user datas', () => {

    cy.url().should('include', '/sessions');
    cy.intercept('GET', '/api/user/1', { body: mockUser, });

    cy.get("span.link").contains("Account").click();
    cy.url().should('include', '/me');

    cy.get("p.name").should("contain.text", mockUser.firstName)
    cy.get("p.name").should("contain.text", mockUser.lastName.toUpperCase())
    cy.get("p.email").should("contain.text", mockUser.email)
  });

});
