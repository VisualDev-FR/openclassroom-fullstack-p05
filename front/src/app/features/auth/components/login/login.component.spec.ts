import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';
import { SessionService } from 'src/app/services/session.service';
import { LoginComponent } from './login.component';
import { throwError } from 'rxjs';
import { AuthService } from '../../services/auth.service';


describe('LoginComponent', () => {

  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let emailField: FormControl;
  let passwordField: FormControl;
  let submitButton: HTMLInputElement;
  let authService: AuthService;

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      providers: [SessionService],
      imports: [
        RouterTestingModule,
        BrowserAnimationsModule,
        HttpClientModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule
      ]
    }).compileComponents();

    authService = TestBed.inject(AuthService);
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    emailField = component.form.controls["email"];
    passwordField = component.form.controls["password"];
    submitButton = fixture.nativeElement.querySelector(".login-form button[type='submit']");
  });

  it('should create component with email / password fields and submit button', () => {
    expect(component).toBeTruthy();
    expect(emailField).toBeTruthy();
    expect(passwordField).toBeTruthy();
    expect(submitButton).toBeTruthy();
  });

  it("should disable submit button when one field is empty or invalid", () => {

    emailField.setValue("");
    passwordField.setValue("password");
    fixture.detectChanges()
    expect(submitButton.disabled).toBeTruthy();

    emailField.setValue("valid.email@example.com");
    passwordField.setValue("");
    fixture.detectChanges()
    expect(submitButton.disabled).toBeTruthy();

    emailField.setValue("invalid.email.example.com");
    passwordField.setValue("password");
    fixture.detectChanges()
    expect(submitButton.disabled).toBeTruthy();
  });

  it("should enable submit button if both fields are valid", () => {

    emailField.setValue("valid.email@example.com");
    passwordField.setValue("password");
    fixture.detectChanges()

    expect(submitButton.disabled).toBeFalsy();
  });

  it('should display error message when invalid credentials are provided', () => {

    jest.spyOn(authService, 'login').mockReturnValue(
      throwError(() => new Error('Invalid credentials'))
    );

    component.form.controls['email'].setValue('test@example.com');
    component.form.controls['password'].setValue('password');

    component.submit();
    fixture.detectChanges();

    const errorElement: HTMLElement = fixture.nativeElement.querySelector('.error');

    expect(authService.login).toHaveBeenCalled();
    expect(errorElement).toBeTruthy();
    expect(errorElement.textContent).toContain('An error occurred');
    expect(component.onError).toBeTruthy();
  });
  });

});
