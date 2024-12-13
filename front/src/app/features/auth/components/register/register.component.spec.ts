import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { expect } from '@jest/globals';

import { RegisterComponent } from './register.component';
import { AuthService } from '../../services/auth.service';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { RegisterRequest } from '../../interfaces/registerRequest.interface';

describe('RegisterComponent', () => {

  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  let firstNameField: FormControl;
  let lastNameField: FormControl;
  let emailField: FormControl;
  let passwordField: FormControl;
  let submitButton: HTMLInputElement;

  let authService: AuthService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      imports: [
        BrowserAnimationsModule,
        HttpClientModule,
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule
      ]
    })
      .compileComponents();

    router = TestBed.inject(Router);
    authService = TestBed.inject(AuthService);
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    firstNameField = component.form.controls["firstName"];
    lastNameField = component.form.controls["lastName"];
    emailField = component.form.controls["email"];
    passwordField = component.form.controls["password"];
    submitButton = fixture.nativeElement.querySelector(".register-form button[type='submit']");
  });

  it('should create component with required fields and submit button', () => {
    expect(component).toBeTruthy();
    expect(firstNameField).toBeTruthy();
    expect(lastNameField).toBeTruthy();
    expect(emailField).toBeTruthy();
    expect(passwordField).toBeTruthy();
    expect(submitButton).toBeTruthy();
  });

  it("should disable submit button when one field is empty or invalid", () => {

    // no first name
    firstNameField.setValue("");
    lastNameField.setValue("lastName");
    emailField.setValue("valid.email@example.com");
    passwordField.setValue("password");
    fixture.detectChanges()
    expect(submitButton.disabled).toBeTruthy();

    // no last name
    firstNameField.setValue("firstName");
    lastNameField.setValue("");
    emailField.setValue("valid.email@example.com");
    passwordField.setValue("password");
    fixture.detectChanges()
    expect(submitButton.disabled).toBeTruthy();

    // no email
    firstNameField.setValue("firstName");
    lastNameField.setValue("lastName");
    emailField.setValue("");
    passwordField.setValue("password");
    fixture.detectChanges()
    expect(submitButton.disabled).toBeTruthy();

    // no password
    firstNameField.setValue("firstName");
    lastNameField.setValue("lastName");
    emailField.setValue("valid.email@example.com");
    passwordField.setValue("");
    fixture.detectChanges()
    expect(submitButton.disabled).toBeTruthy();

    // invalid email
    firstNameField.setValue("firstName");
    lastNameField.setValue("lastName");
    emailField.setValue("invalid.email.example.com");
    passwordField.setValue("password");
    fixture.detectChanges()
    expect(submitButton.disabled).toBeTruthy();
  });

  it("should enable submit button if all fields are valid", () => {

    firstNameField.setValue("firstName");
    lastNameField.setValue("lastName");
    emailField.setValue("valid.email@example.com");
    passwordField.setValue("password");
    fixture.detectChanges()

    expect(submitButton.disabled).toBeFalsy();
  });

  it('should display error message when register datas already exists', () => {

    jest.spyOn(authService, 'register').mockReturnValue(
      throwError(() => new Error('email already exists'))
    );

    component.form.controls['email'].setValue('test@example.com');
    component.form.controls['password'].setValue('password');

    component.submit();
    fixture.detectChanges();

    const errorElement: HTMLElement = fixture.nativeElement.querySelector('.error');

    expect(authService.register).toHaveBeenCalled();
    expect(errorElement).toBeTruthy();
    expect(errorElement.textContent).toContain('An error occurred');
    expect(component.onError).toBeTruthy();
  });

  it('should call authService.register and handle successful register', () => {

    jest.spyOn(authService, 'register').mockReturnValue(of(undefined));
    jest.spyOn(router, 'navigate').mockReturnValue(new Promise(resolve => resolve(true)));

    const registerRequest: RegisterRequest = {
      firstName: "firstName",
      lastName: "lastName",
      email: "valid.email@example.com",
      password: "password",
    };

    component.form.setValue(registerRequest);
    component.submit();

    expect(authService.register).toHaveBeenCalledWith(registerRequest);
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});
