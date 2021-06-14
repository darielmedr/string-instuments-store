import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, pipe } from 'rxjs';
import { shareReplay, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/core/services/auth.service';
import { User } from 'src/app/shared/models/user.model';
import { environment } from 'src/environments/environment';

@Injectable()
export class ProfileService {

  private apiUrl: string = `${environment.API_URL}/user`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  public getUserDataFromLocalStorage(): User {
    let user: User = {
      id: 0,
      fullName: 'John Doe',
      username: 'johndoe',
      email: 'johndoe@mail.domain',
      photo: 'assets/images/user.svg'
    };

    try {
      const storedData = localStorage.getItem('user');
      if (storedData) {
        user = JSON.parse(storedData) as User;
      }
    } finally {
      return user;
    }
  }

  public updateUser(user: User): Observable<any> {
    const id = user.id;

    return this.http.put<any>(`${this.apiUrl}/${id}`, user).pipe(
      tap(data => this.authService.storeSessionData(data)),
      shareReplay()
    );
  }

  public deleteUser(id: number): void {
    this.http.delete<any>(`${this.apiUrl}/${id}`)
      pipe(
        tap(() => this.authService.logout())
      );
  }
}
