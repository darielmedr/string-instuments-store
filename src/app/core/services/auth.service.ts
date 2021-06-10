import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { shareReplay, tap } from 'rxjs/operators';
import * as dayjs from 'dayjs';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { SessionData } from 'src/app/shared/models/session-data';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl: string = `${environment.API_URL}/auth`;

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  public loginWithEmailAndPassword(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/signin`, { email, password }).pipe(
      tap(data => this.storeSessionData(data)),
      shareReplay()
    );
  }
  public storeSessionData(data: SessionData): void {
    const expiresAt = dayjs().add(data.expiresIn, 'seconds');

    localStorage.setItem('id_token', data.idToken);
    localStorage.setItem('expires_at', JSON.stringify(expiresAt.valueOf()));
    localStorage.setItem('user', JSON.stringify(data.user));
  }

  public sendResetPasswordEmail(email: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/reset-password`, { email });
  }

  public changePassword(resetToken: string, newPassword: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/change-password`, { resetToken, newPassword });
  }

  public logout(): void {
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    localStorage.removeItem('user');
    this.router.navigate(['/auth']);
  }

  public isLoggedIn(): boolean {
    return dayjs().isBefore(this.getExpiration());
  }
  public isLoggedOut(): boolean {
    return !this.isLoggedIn();
  }
  private getExpiration() {
    const expiration = localStorage.getItem('expires_at');
    if (expiration) {
      const expiresAt = JSON.parse(expiration);
      return expiresAt;
    }
    return dayjs().subtract(1, 'day');
  }
}
