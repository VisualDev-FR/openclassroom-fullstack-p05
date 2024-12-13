/// <reference types="cypress" />

describe('Login spec', () => {

  const mockSessionInfo = {
    id: 1,
    username: 'userName',
    firstName: 'firstName',
    lastName: 'lastName',
    email: "test@example.com",
    admin: true,
  };

  const mockSession = {
    id: 1,
    name: "Session 1",
    date: "2024-05-01T00:00:00.000+00:00",
    teacher_id: 1,
    description: "My description",
    users: [],
    createdAt: "2024-05-04T14:11:11",
    updatedAt: "2024-05-04T14:11:11",
  };

  const mockTeacher = [
    {
      "id": 1,
      "lastName": "DELAHAYE",
      "firstName": "Margot",
      "createdAt": "2024-12-13T01:30:34",
      "updatedAt": "2024-12-13T01:30:34"
    },
  ]

  beforeEach(() => {
    cy.intercept('GET', '/api/session', { body: [mockSession] });
    cy.intercept('GET', '/api/session/1', { body: mockSession });
    cy.intercept('POST', '/api/auth/login', { body: mockSessionInfo, });

    cy.visit('/login');
    cy.get('input[formControlName=email]').type("yoga@studio.com");
    cy.get('input[formControlName=password]').type(`${"test!1234"}`);
    cy.get('button[type="submit"]').click();
  });

  it('should create a new yoga session', () => {

    cy.intercept('GET', '/api/teacher', { body: mockTeacher });
    cy.intercept('POST', '/api/session', { body: mockSession });

    cy.url().should('include', '/sessions');
    cy.get("span").contains("Create").click();
    cy.url().should('include', '/sessions/create');

    cy.get("input[formControlName=name]").type("sessionName")
    cy.get("input[formControlName=date]").type("2024-12-13")
    cy.get('mat-select').click();
    cy.get('mat-option').first().click();
    cy.get('textarea[formControlName=description]').type("description");
    cy.get("span").contains("Save").click()

    cy.url().should('include', '/sessions');
  });

  it('should edit an existing yoga session', () => {

    cy.url().should('include', '/sessions');
    cy.get("span").contains("Edit").click()
    cy.url().should('include', '/sessions/update/1');

  });

});
