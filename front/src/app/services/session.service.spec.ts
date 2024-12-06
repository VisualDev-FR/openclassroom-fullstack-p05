import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';

import { SessionService } from './session.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SessionInformation } from '../interfaces/sessionInformation.interface';

describe('SessionService', () => {
  let service: SessionService;
  let httpController: HttpTestingController;

  const sessionInformation: SessionInformation = {
    id: 0,
    token: "token",
    type: "Bearer",
    username: "username",
    firstName: "firstName",
    lastName: "lastName",
    admin: false,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SessionService],
    });
    service = TestBed.inject(SessionService);
    httpController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initially have isLogged set to false', () => {
    expect(service.isLogged).toBe(false);
  });

  it('should initially have sessionInformation as undefined', () => {
    expect(service.sessionInformation).toBeUndefined();
  });

  it('should have an observable isLoggedSubject', (done) => {

    service.$isLogged().subscribe(status => {
      expect(status).toBe(false);
      done();
    });
  });

  it('should log in a user', (done) => {

    service.logIn(sessionInformation);

    expect(service.isLogged).toBe(true);
    expect(service.sessionInformation).toEqual(sessionInformation);

    service.$isLogged().subscribe(status => {
      expect(status).toBe(true);
      done()
    });
  });

  it('should log out a user', (done) => {

    service.logIn(sessionInformation);
    service.logOut()

    expect(service.isLogged).toBe(false);
    expect(service.sessionInformation).toBeUndefined();

    service.$isLogged().subscribe(status => {
      expect(status).toBe(false);
      done()
    });
  });

});
