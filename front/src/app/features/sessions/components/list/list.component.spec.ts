import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { expect } from '@jest/globals';
import { of } from 'rxjs';
import { SessionService } from 'src/app/services/session.service';
import { ListComponent } from './list.component';
import { SessionApiService } from '../../services/session-api.service';
import { Session } from '../../interfaces/session.interface';


describe('ListComponent', () => {

  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;
  let sessionApiService: SessionApiService;

  const mockSessions: Session[] = [
    {
      id: 1,
      name: 'session1',
      description: 'description1',
      date: new Date(),
      teacher_id: 1,
      users: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      name: 'session2',
      description: 'description2',
      date: new Date(),
      teacher_id: 2,
      users: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const mockSessionService = {
    sessionInformation: { admin: true, id: 1 },
  };

  const mockSessionApiService = {
    all: jest.fn().mockReturnValue(of(mockSessions)),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        MatCardModule,
        MatIconModule,
      ],
      declarations: [ListComponent],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: SessionApiService, useValue: mockSessionApiService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    sessionApiService = TestBed.inject(SessionApiService);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();

    expect(sessionApiService.all).toHaveBeenCalled()
  });

  it('should fetch sessions and display them', () => {

    fixture.detectChanges();

    const titleFields = fixture.nativeElement.querySelectorAll('.item mat-card-title');

    expect(titleFields.length).toBe(mockSessions.length);
    expect(titleFields[0].textContent).toContain(mockSessions[0].name);
    expect(titleFields[1].textContent).toContain(mockSessions[1].name);
  });

  it('should display the create button for admin users', () => {
    const createButton = fixture.nativeElement.querySelector('button[routerLink="create"]');
    expect(createButton).toBeTruthy();
    expect(createButton.textContent).toContain('Create');
  });

  it('should not display the create button for non-admin users', () => {
    mockSessionService.sessionInformation.admin = false;
    fixture.detectChanges();

    const createButton = fixture.nativeElement.querySelector('button[routerLink="create"]');
    expect(createButton).toBeFalsy();
  });

  it('should display session details button', () => {

    const detailButton = fixture.nativeElement.querySelector('button.detail-button');

    expect(detailButton).toBeTruthy();
    expect(detailButton.textContent).toContain('Detail');
  });

  it('should display edit button for admin users', () => {

    mockSessionService.sessionInformation.admin = true;
    fixture.detectChanges();

    const editButton = fixture.nativeElement.querySelector('button.edit-button');
    expect(editButton).toBeTruthy();
    expect(editButton.textContent).toContain('Edit');
  });

  it('should not display edit button for non-admin users', () => {

    mockSessionService.sessionInformation.admin = false;
    fixture.detectChanges();

    const editButton = fixture.nativeElement.querySelector('button.edit-button');
    expect(editButton).toBeFalsy();
  });
});
