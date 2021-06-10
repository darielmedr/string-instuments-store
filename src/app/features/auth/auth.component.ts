import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { filter, map, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit, OnDestroy {

  public unsubscribe$: Subject<string> = new Subject();
  public bgImageUrl: string = '';

  private images: Map<string, string> = new Map([
    ['login', "url(assets/images/bg-login.jpg)"],
    ['change-password', "url(assets/images/bg-change-password.jpg)"],
    ['reset-password', "url(assets/images/bg-reset-password.jpg)"]
  ]);

  constructor(
    private router: Router,
  ) {
    this.router.events
      .pipe(
        takeUntil(this.unsubscribe$),
        filter(event => event instanceof NavigationEnd),
        map(event => (event as NavigationEnd).urlAfterRedirects)
      )
      .subscribe((url: string) => {
        const urlSegmentWithoutParameters: string = url.split('?')[0];
        const lastUrlSegment: string | undefined = urlSegmentWithoutParameters.split('/').pop();

        if (lastUrlSegment && this.images.has(lastUrlSegment)) {
          this.bgImageUrl = this.images.get(lastUrlSegment) as string;
        }
      });
  }

  ngOnInit(): void { }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
