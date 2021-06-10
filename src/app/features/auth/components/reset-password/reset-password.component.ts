import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit, OnDestroy {


  public form!: FormGroup;
  private unsuscribe$: Subject<void> = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnDestroy(): void {
    this.unsuscribe$.next();
    this.unsuscribe$.complete();
  }

  public getEmailErrorMessage(): string {
    if (this.form.hasError('required', 'email')) {
      return 'Email field is empty';
    }
    return this.form.hasError('email', 'email') ? 'Email is invalid' : '';
  }

  public sendResetPasswordEmail(): void {
    this.authService.sendResetPasswordEmail(this.form.value.email)
      .pipe(takeUntil(this.unsuscribe$))
      .subscribe(
        (data: any) => {
          this.showMessage(data.message);
        },
        (err: any) => {
          this.showMessage(err.error?.message || err.statusText);
        }
      );
  }

  private showMessage(message: string) {
    this.snackBar.open(message, "Close", {
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: 'error-snackBar'
    });
  }

}
