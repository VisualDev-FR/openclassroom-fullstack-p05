import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';
import { SessionApiService } from './session-api.service';
import { Session } from '../interfaces/session.interface';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('SessionsService', () => {

  let sessionApiService: SessionApiService;
  let httpController: HttpTestingController;

  const sessionMock: Session = {
    id: 1,
    name: 'Yoga Class',
    description: 'Description',
    date: new Date(),
    teacher_id: 1,
    users: [1],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SessionApiService],
    });
    sessionApiService = TestBed.inject(SessionApiService);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpController.verify();
  })

  it('should be created', () => {
    expect(sessionApiService).toBeTruthy();
  });

  it('should return an array of sessions', (done) => {

    sessionApiService.all().subscribe((sessions) => {
      expect(sessions).toEqual([sessionMock]);
      done();
    });

    const req = httpController.expectOne("api/session");
    expect(req.request.method).toBe("GET");

    req.flush([sessionMock]);
  });

  it('should return the session details', (done) => {

    sessionApiService.detail("1").subscribe((session) => {
      expect(session).toEqual(sessionMock);
      done();
    });

    const req = httpController.expectOne("api/session/1");
    expect(req.request.method).toBe("GET");

    req.flush(sessionMock);

  });

  it('should call delete on the session endpoint', (done) => {

    sessionApiService.delete("1").subscribe((session) => {
      expect(session).toBeNull();
      done();
    });

    const req = httpController.expectOne("api/session/1");
    expect(req.request.method).toBe("DELETE");

    req.flush(null);
  });

  it('should create a session', (done) => {

    sessionApiService.create(sessionMock).subscribe((session) => {
      expect(session).toEqual(sessionMock);
      done();
    });

    const req = httpController.expectOne("api/session");
    expect(req.request.method).toBe("POST");

    req.flush(sessionMock);
  });

  it('should update a session', (done) => {

    sessionApiService.update("1", sessionMock).subscribe((session) => {
      expect(session).toEqual(sessionMock);
      done();
    });

    const req = httpController.expectOne("api/session/1");
    expect(req.request.method).toBe("PUT");
    expect(req.request.body).toBe(sessionMock);

    req.flush(sessionMock);
  });

  it('should call participate endpoint', (done) => {

    sessionApiService.participate("1", "1").subscribe((session) => {
      expect(session).toBeNull();
      done();
    });

    const req = httpController.expectOne("api/session/1/participate/1");
    expect(req.request.method).toBe("POST");
    expect(req.request.body).toBeNull();

    req.flush(null);
  });

  it('should call unParticipate endpoint', (done) => {

    sessionApiService.unParticipate("1", "1").subscribe((session) => {
      expect(session).toBeNull();
      done();
    });

    const req = httpController.expectOne("api/session/1/participate/1");
    expect(req.request.method).toBe("DELETE");

    req.flush(null);
  });

});
