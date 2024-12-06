import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';

import { UserService } from './user.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('UserService', () => {

  let service: UserService;
  let httpController: HttpTestingController;

  const userMock = {

  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService],
    });
    service = TestBed.inject(UserService);
    httpController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return a user instance', (done) => {

    service.getById("1").subscribe((users) => {
      expect(users).toEqual(userMock);
      done();
    });

    const req = httpController.expectOne("api/user/1");
    expect(req.request.method).toBe("GET");

    req.flush(userMock);
  });

  it('should delete a user', (done) => {

    service.delete("1").subscribe((users) => {
      expect(users).toBeNull();
      done();
    });

    const req = httpController.expectOne("api/user/1");
    expect(req.request.method).toBe("DELETE");

    req.flush(null);
  });

});
