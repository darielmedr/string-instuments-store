import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit, OnDestroy {

  private unsuscribe$: Subject<void> = new Subject<void>();
  private resetToken: string = '';
  public form!: FormGroup;

  public hidePassword: boolean = true;
  public hidePasswordConfirmation: boolean = true;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      passwordConfirmation: ['', [Validators.required, Validators.minLength(8)]]
    });

    this.getResetTokenParam();
  }

  ngOnDestroy(): void {
    this.unsuscribe$.next();
    this.unsuscribe$.complete();
  }

  private getResetTokenParam(): void {
    this.route.paramMap
      .pipe(takeUntil(this.unsuscribe$))
      .subscribe(
        ((params: ParamMap) => {
          const token = params.get('resetToken');
          if (token) {
            this.resetToken = token;
          } else {
            this.resetToken = '';
          }
        })
      );
  }

  public getPasswordErrorMessage(path: string): string {
    if (this.form.hasError('required', path)) {
      return 'This field is required';
    }
    return (this.form.hasError('minlength', path)) ? 'Password is too short.' : '';
  }

  public changePassword(): void {
    if (!this.form.valid) {
      this.showMessage('The form is not valid.');
      return;
    }

    if (!this.passwordsMatch()) {
      this.showMessage("Password and Password Confirmation don't match.");
      return;
    }

    this.authService.changePassword(this.resetToken, this.form.value.password)
      .pipe(takeUntil(this.unsuscribe$))
      .subscribe(
        (data: any) => {
          this.showMessage(data.message);
        },
        (err: any) => {
          this.showMessage(err.error?.message.message as string || err.error?.message?.name as string || err.statusText as string);
        }
      );
  }
  private passwordsMatch(): boolean {
    const password: string = this.form.value.password as string;
    const passwordConfirmation: string = this.form.value.passwordConfirmation as string;

    return (password === passwordConfirmation) ? true : false;
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
