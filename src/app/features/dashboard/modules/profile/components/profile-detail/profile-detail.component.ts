import { Component, OnInit } from '@angular/core';
import { ProfileService } from 'src/app/features/dashboard/services/profile.service';
import { User } from 'src/app/shared/models/user';

@Component({
  selector: 'app-profile-detail',
  templateUrl: './profile-detail.component.html',
  styleUrls: ['./profile-detail.component.scss']
})
export class ProfileDetailComponent implements OnInit {

  public user!: User;

  constructor(
    private userProfileService: ProfileService
  ) { }

  ngOnInit(): void {
    this.getUserStoredData();
  }

  private getUserStoredData(): void {
    this.user = this.userProfileService.getUserDataFromLocalStorage();
  }
}
