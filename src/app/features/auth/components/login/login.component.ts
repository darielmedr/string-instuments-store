import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LoginUser } from 'src/app/shared/models/login-user.model';
import { SessionData } from 'src/app/shared/models/session-data.model';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  public hidePassword: boolean = true;
  public loginForm!: FormGroup;

  private unsuscribe$: Subject<void> = new Subject<void>();

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  ngOnDestroy(): void {
    this.unsuscribe$.next();
    this.unsuscribe$.complete();
  }

  public getEmailErrorMessage(): string {
    if (this.loginForm.hasError('required', 'email')) {
      return 'Email field is empty'
    }
    return (this.loginForm.hasError('email', 'email')) ? 'Email is invalid' : '';
  }
  public getPasswordErrorMessage(): string {
    if (this.loginForm.hasError('required', 'password')) {
      return 'Password field is empty'
    }
    return (this.loginForm.hasError('minlength', 'password')) ? 'Password is too short' : '';
  }

  public loginWithEmailAndPassword(): void {
    if (this.loginForm.valid) {
      const loginUser: LoginUser = this.loginForm.value as LoginUser;

      this.authService.loginWithEmailAndPassword(loginUser.email, loginUser.password)
        .pipe(takeUntil(this.unsuscribe$))
        .subscribe(
          (data: SessionData) => {
            if (data && data.idToken) {
              this.router.navigate(['/dashboard']);
            }
            else {
              this.showMessage('Wrong credentials');
            }
          },
          (err: any) => {
            this.showMessage('Upss! Something went wrong.');
            console.error(err);
          }
        );
    }
    else {
      this.showMessage('Login form has invalid fields.');
    }
  }

  private showMessage(message: string): void {
    this.snackBar.open(message, "Close", {
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: 'error-snackBar'
    });
  }
}
