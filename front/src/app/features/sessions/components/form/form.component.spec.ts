import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';
import { SessionService } from 'src/app/services/session.service';
import { SessionApiService } from '../../services/session-api.service';

import { FormComponent } from './form.component';
import { of } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Session } from '../../interfaces/session.interface';

describe('FormComponent', () => {

  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;
  let submitButton: HTMLInputElement
  let router: Router;
  let route: ActivatedRoute;

  const sessionData = {
    name: "name",
    description: "description",
    date: new Date(),
    teacher_id: 1,
  };

  const sessionServiceMock = {
    sessionInformation: {
      admin: true
    }
  } as unknown as jest.Mocked<SessionService>;

  const sessionApiServiceMock = {
    detail: jest.fn().mockReturnValue(of(sessionData)),
    create: jest.fn().mockReturnValue(of(sessionData)),
    update: jest.fn().mockReturnValue(of(sessionData))
  } as unknown as jest.Mocked<SessionApiService>;

  const matSnackBarMock = {
    open: jest.fn()
  } as unknown as jest.Mocked<MatSnackBar>;

  const routerMock = {
    url: '/',
    navigate: jest.fn(),
  } as unknown as jest.Mocked<Router>;

  const activatedRouteMock = {
    snapshot: {
      paramMap: {
        get: jest.fn().mockReturnValue(of('1'))
      }
    }
  } as unknown as jest.Mocked<ActivatedRoute>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({

      imports: [
        RouterTestingModule,
        HttpClientModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        MatSelectModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: SessionService, useValue: sessionServiceMock },
        { provide: SessionApiService, useValue: sessionApiServiceMock },
        { provide: MatSnackBar, useValue: matSnackBarMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
      ],
      declarations: [FormComponent]
    }).compileComponents();

    router = TestBed.inject(Router);
    route = TestBed.inject(ActivatedRoute);

    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    submitButton = fixture.nativeElement.querySelector("button[type='submit']");
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should define all fields of the session form', () => {

    expect(component.sessionForm).toBeTruthy();
    expect(component.sessionForm!.controls['name']).toBeDefined();
    expect(component.sessionForm!.controls['date']).toBeDefined();
    expect(component.sessionForm!.controls['teacher_id']).toBeDefined();
    expect(component.sessionForm!.controls['description']).toBeDefined();
    expect(submitButton).toBeDefined();
  });

  it('should enable submit button and set form as valid', () => {

    component.sessionForm?.controls['name'].setValue('name');
    component.sessionForm?.controls['date'].setValue('2024-12-06');
    component.sessionForm?.controls['teacher_id'].setValue('1');
    component.sessionForm?.controls['description'].setValue('description');
    fixture.detectChanges()

    expect(component.sessionForm?.valid).toBe(true);
    expect(submitButton.disabled).toBe(false);
  });

  it('should set form controls to invalid when empty', () => {

    // missing name
    component.sessionForm?.controls['name'].setValue('');
    component.sessionForm?.controls['date'].setValue('2024-12-06');
    component.sessionForm?.controls['teacher_id'].setValue('1');
    component.sessionForm?.controls['description'].setValue('description');

    fixture.detectChanges();
    expect(component.sessionForm?.valid).toBe(false);
    expect(submitButton.disabled).toBe(true);

    // missing date
    component.sessionForm?.controls['name'].setValue('name');
    component.sessionForm?.controls['date'].setValue('');
    component.sessionForm?.controls['teacher_id'].setValue('1');
    component.sessionForm?.controls['description'].setValue('description');

    fixture.detectChanges();
    expect(component.sessionForm?.valid).toBe(false);
    expect(submitButton.disabled).toBe(true);

    // missing teacher id
    component.sessionForm?.controls['name'].setValue('name');
    component.sessionForm?.controls['date'].setValue('2024-12-06');
    component.sessionForm?.controls['teacher_id'].setValue('');
    component.sessionForm?.controls['description'].setValue('description');

    fixture.detectChanges();
    expect(component.sessionForm?.valid).toBe(false);
    expect(submitButton.disabled).toBe(true);

    // missing description
    component.sessionForm?.controls['name'].setValue('name');
    component.sessionForm?.controls['date'].setValue('2024-12-06');
    component.sessionForm?.controls['teacher_id'].setValue('1');
    component.sessionForm?.controls['description'].setValue('');

    fixture.detectChanges();
    expect(component.sessionForm?.valid).toBe(false);
    expect(submitButton.disabled).toBe(true);
  });

  it('should call sessionApiService.create when form is submitted and valid', () => {

    component.sessionForm?.setValue(sessionData as Session);
    component.onUpdate = false;
    component.submit();

    expect(sessionApiServiceMock.create).toHaveBeenCalled() //.toHaveBeenCalledWith(sessionData);
  });
});
