import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SessionService } from 'src/app/services/session.service';
import { expect } from '@jest/globals';

import { MeComponent } from './me.component';
import { UserService } from 'src/app/services/user.service';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

describe('MeComponent', () => {

  let component: MeComponent;
  let fixture: ComponentFixture<MeComponent>;

  const userID = 1;

  const user = {
    id: userID,
    email: "test@example.com",
    lastName: "lastName",
    firstName: "firstName",
    admin: true,
    password: "password",
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const sessionService = {
    sessionInformation: {
      admin: true,
      id: userID,
    },
    logOut: jest.fn(),
  };

  const userService = {
    getById: jest.fn().mockReturnValue(of(user)),
    delete: jest.fn().mockReturnValue(of(null)),
  };

  const router = {
    navigate: jest.fn(),
  };

  const snackBar = {
    open: jest.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MeComponent],
      imports: [
        MatSnackBarModule,
        HttpClientModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        RouterTestingModule,
      ],
      providers: [
        { provide: Router, useValue: router },
        { provide: SessionService, useValue: sessionService },
        { provide: MatSnackBar, useValue: snackBar },
        { provide: UserService, useValue: userService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call userService.getById and set the user property', () => {

    component.ngOnInit();

    expect(userService.getById).toHaveBeenCalledWith(userID.toString());
    expect(component.user).toEqual(user);
  });

  it('should call userService.delete then navigate to home', () => {

    component.delete();

    expect(userService.delete).toHaveBeenCalledWith(userID.toString());
    expect(router.navigate).toHaveBeenCalledWith(['/']);
    expect(sessionService.logOut).toHaveBeenCalled();
  });

  it('should  navigate to home', () => {
    component.back();
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });
});
