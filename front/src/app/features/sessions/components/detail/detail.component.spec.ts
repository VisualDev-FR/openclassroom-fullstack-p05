import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';
import { of } from 'rxjs';
import { Teacher } from 'src/app/interfaces/teacher.interface';
import { TeacherService } from 'src/app/services/teacher.service';
import { SessionService } from '../../../../services/session.service';
import { Session } from '../../interfaces/session.interface';
import { SessionApiService } from '../../services/session-api.service';
import { DetailComponent } from './detail.component';

describe('DetailComponent', () => {

  let component: DetailComponent;
  let fixture: ComponentFixture<DetailComponent>;
  let sessionService: SessionService;
  let sessionApiService: SessionApiService;
  let teacherService: TeacherService;

  const mockSession: Session = {
    id: 1,
    name: 'name',
    description: 'description',
    date: new Date(),
    teacher_id: 1,
    users: [1],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockSessionService = {
    sessionInformation: { admin: true, id: 1 },
  };

  const mockTeacher: Teacher = {
    id: 1,
    lastName: 'lastName',
    firstName: 'firstName',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockTeacherService = {
    detail: jest.fn().mockReturnValue(of(mockTeacher)),
  };

  const mockSessionApiService = {
    detail: jest.fn().mockReturnValue(of(mockSession)),
    delete: jest.fn(),
    participate: jest.fn(),
    unParticipate: jest.fn().mockReturnValue(of(null)),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        MatSnackBarModule,
        ReactiveFormsModule,
        MatIconModule,
        MatCardModule,
      ],
      declarations: [DetailComponent],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: SessionApiService, useValue: mockSessionApiService },
        { provide: TeacherService, useValue: mockTeacherService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DetailComponent);
    component = fixture.componentInstance;

    sessionService = TestBed.inject(SessionService);
    sessionApiService = TestBed.inject(SessionApiService);
    teacherService = TestBed.inject(TeacherService);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call sessionApiService.detail(), then binding to datas to the component', () => {

    component.ngOnInit();

    expect(sessionApiService.detail).toHaveBeenCalledWith(component.sessionId);
    expect(component.session).toEqual(mockSession);
    expect(component.teacher).toEqual(mockTeacher);
    expect(component.isParticipate).toBe(true);
  });

  it('should inject correct session details into the dom', () => {

    component.ngOnInit();
    fixture.detectChanges();

    const titleField = fixture.nativeElement.querySelector('h1').textContent.toLowerCase();
    const descriptionField = fixture.nativeElement.querySelector('.description').textContent

    expect(titleField).toContain(mockSession.name.toLowerCase());
    expect(descriptionField).toContain(mockSession.description);
  });

  it('should call sessionApiService.unParticipate', () => {

    component.sessionId = mockSession.id!.toString();
    component.unParticipate();

    expect(sessionApiService.unParticipate).toHaveBeenCalledWith(
      mockSession.id!.toString(),
      mockSessionService.sessionInformation.id.toString()
    );
  });

  it('should call window.history.back()', () => {
    const spy = jest.spyOn(window.history, 'back');
    component.back();

    expect(spy).toHaveBeenCalled();
  });
});
