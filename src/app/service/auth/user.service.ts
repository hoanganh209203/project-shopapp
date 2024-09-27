import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RegisterType } from '../../dtos/auth/register.dto';
import { LoginType } from '../../dtos/auth/login.dto';
import { environment } from '../../environments/environment';
import { UserResponse } from '../../interfaces/user.response';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUser = `${environment.apiBaseUrl}/users`;
  // private apiRegister = `${environment.apiBaseUrl}/users/register`;
  // private apiLogin = `${environment.apiBaseUrl}/users/login`;
  // private apiUserDetails = `${environment.apiBaseUrl}/users/details`;
  private apiConfig = {
    headers: this.createHeader(),
  };
  constructor(private http: HttpClient) {}
  private createHeader(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept-Language': 'vi',
    });
  }

  register(registerType: RegisterType): Observable<any> {
    return this.http.post(
      `${this.apiUser}/register`,
      registerType,
      this.apiConfig
    );
  }
  login(loginType: LoginType): Observable<any> {
    return this.http.post(`${this.apiUser}/login`, loginType, this.apiConfig);
  }
  userDetails(token: string) {
    debugger;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    return this.http.post(`${this.apiUser}/details`, {}, { headers });
  }

  getAllUser(page: number, limit: number): Observable<UserResponse[]> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    return this.http.get<UserResponse[]>(this.apiUser, { params });
  }

  saveUserResponseToLocalStorage(userResponse?: UserResponse) {
    try {
      if (userResponse == null || !userResponse) {
        return;
      }
      const userResponseJson = JSON.stringify(userResponse);

      localStorage.setItem('user', userResponseJson);
    } catch (error) {
      console.log('Error saving user response to local ', error);
    }
  }
  getUserFormLocalStorage(): UserResponse | null {
    try {
      debugger;
      const userResponseJSON = localStorage.getItem('user');
      if (userResponseJSON == null || userResponseJSON == undefined) {
        return null;
      }
      const userResponse = JSON.parse(userResponseJSON!);
      return userResponse;
    } catch (error) {
      console.log('Error saving user response to local ', error);
      return null;
    }
  }

  removeUserFormLocalStorage(): void {
    localStorage.removeItem('user');
  }
}
