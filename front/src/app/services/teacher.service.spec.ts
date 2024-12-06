import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';

import { SessionService } from './session.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Teacher } from '../interfaces/teacher.interface';
import { TeacherService } from './teacher.service';

describe('TeacherService', () => {
  let service: TeacherService;
  let httpController: HttpTestingController;

  const teacherMock: Teacher = {
    id: 1,
    lastName: "lastName",
    firstName: "firstName",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SessionService],
    });
    service = TestBed.inject(TeacherService);
    httpController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return a list of teachers', (done) => {

    service.all().subscribe((teachers) => {
      expect(teachers).toEqual([teacherMock]);
      done();
    });

    const req = httpController.expectOne("api/teacher");
    expect(req.request.method).toBe("GET");

    req.flush([teacherMock]);
  });

  it('should return teachers', (done) => {

    service.detail("1").subscribe((teachers) => {
      expect(teachers).toEqual(teacherMock);
      done();
    });

    const req = httpController.expectOne("api/teacher/1");
    expect(req.request.method).toBe("GET");

    req.flush(teacherMock);
  });

});
