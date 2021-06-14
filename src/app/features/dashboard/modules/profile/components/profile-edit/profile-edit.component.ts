import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProfileService } from 'src/app/features/dashboard/services/profile.service';
import { User } from 'src/app/shared/models/user.model';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.scss']
})
export class ProfileEditComponent implements OnInit {

  private user!: User;
  public formUser!: FormGroup;

  constructor(
    private snackBar: MatSnackBar,
    private userProfileService: ProfileService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.initFormUser();
  }

  private initFormUser(): void {
     this.user = this.userProfileService.getUserDataFromLocalStorage();

    this.formUser = this.fb.group({
      photo: [this.user.photo],
      fullName: [this.user.fullName],
      username: [this.user.username],
      email: [this.user.email],
    });
  }

  public fileBrowse(event: Event): void {
    const target: HTMLInputElement = event.target as HTMLInputElement;
    const files: FileList | undefined = target?.files as FileList;

    if (!files?.length) {
      return this.showMessage("Error. Can't access the file.");
    }

    const file: File = files[0];
    this.uploadFile(file);
  }

  private uploadFile(file: File): void {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
      const image: string = reader.result as string;
      this.formUser.controls.photo.setValue(image);
    }

    reader.onerror = () => {
      return this.showMessage("Error. Can't upload the image.");
    }
  }

  private showMessage(message: string): void {
    this.snackBar.open(message, 'Got it', {
      duration: 2000,
      panelClass: 'error-snackBar'
    })
  }

  public saveUser(): void {
    if (!this.formUser.valid) {
      return this.showMessage("Error. The form is invalid");
    }

    const userData = this.formUser.value as User;
    this.userProfileService.updateUser(userData);
  }

  public deleteUser(): void {
    this.userProfileService.deleteUser(this.user.id);
  }
}
