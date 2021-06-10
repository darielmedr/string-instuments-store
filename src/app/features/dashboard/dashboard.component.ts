import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map, shareReplay, takeUntil } from 'rxjs/operators';
import { AuthService } from '../../core/services/auth.service';
import { ProfileService } from './services/profile.service';
import { User } from '../../shared/models/user';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  public isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  private unsubscribe$: Subject<void> = new Subject();
  public isSidenavOpen: boolean = false;
  public username: string = '';

  constructor(
    private breakpointObserver: BreakpointObserver,
    private authService: AuthService,
    private profileService: ProfileService
  ) { }

  ngOnInit(): void {
    this.closeNavbarOverlayWhenIsNotHandset();
    this.getLoggedUsername();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private getLoggedUsername(): void {
    const user: User = this.profileService.getUserDataFromLocalStorage();
    this.username = user.username;

  }

  private closeNavbarOverlayWhenIsNotHandset(): void {
    this.isHandset$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (isHandset: boolean) => {
          if (!isHandset) {
            this.isSidenavOpen = false;
          }
        }
      );
  }

  public logout(): void {
    this.authService.logout();
  }

}
