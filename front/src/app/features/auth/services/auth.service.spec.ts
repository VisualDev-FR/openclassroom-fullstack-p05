import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { RegisterRequest } from '../interfaces/registerRequest.interface';
import { LoginRequest } from '../interfaces/loginRequest.interface';
import { SessionInformation } from 'src/app/interfaces/sessionInformation.interface';

describe('AuthService', () => {

  let authService: AuthService;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    authService = TestBed.inject(AuthService);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpController.verify();
  });

  it('should be created', () => {
    expect(authService).toBeTruthy();
  });

  it('should make a POST request to the register URL and return nothing', () => {

    const registerRequest: RegisterRequest = {
      email: 'test@example.com',
      firstName: "firstName",
      lastName: "lastName",
      password: 'password'
    };

    authService.register(registerRequest).subscribe(response => {
      expect(response).toBeUndefined();
    });

    const req = httpController.expectOne('api/auth/register');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(registerRequest);

    req.flush(null);
  });

  it('should handle register errors correctly', () => {
    const registerRequest: RegisterRequest = {
      email: 'test@example.com',
      firstName: "firstName",
      lastName: "lastName",
      password: 'password'
    };

    const errorMessage = 'An error occurred';

    authService.register(registerRequest).subscribe({
      next: () => {
        fail('should have failed with an error');
      },
      error: (error) => {
        expect(error).toBe(errorMessage);
      }
    });

    const req = httpController.expectOne('api/auth/register');
    expect(req.request.method).toBe('POST');
    req.flush(errorMessage, { status: 500, statusText: 'Server Error' });
  });

  it('should make a POST request to the login URL and return session information', () => {

    const loginRequest: LoginRequest = {
      email: 'test@example.com',
      password: 'testpassword'
    };

    const mockSessionInfo: SessionInformation = {
      token: 'abc123',
      type: 'Bearer',
      id: 1,
      username: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      admin: false,
    };

    authService.login(loginRequest).subscribe(session => {
      expect(session).toEqual(mockSessionInfo);
    });

    const req = httpController.expectOne('api/auth/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(loginRequest);

    req.flush(mockSessionInfo);
  });

  it('should handle login errors correctly', () => {

    const loginRequest: LoginRequest = {
      email: 'test@example.com',
      password: 'testpassword'
    };

    const errorMessage = 'Login failed';

    authService.login(loginRequest).subscribe({
      next: () => {
        fail('should have failed with an error');
      },
      error: (error) => {
        expect(error).toBe(errorMessage);
      }
    });

    const req = httpController.expectOne('api/auth/login');
    expect(req.request.method).toBe('POST');
    req.flush(errorMessage, { status: 401, statusText: 'Unauthorized' });
  });
});

