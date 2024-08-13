import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RegisterType } from '../../dtos/auth/register.dto';
import { LoginType } from '../../dtos/auth/login.dto';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiRegister = `${environment.apiBaseUrl}/users/register`;
  private apiLogin = `${environment.apiBaseUrl}/users/login`;
  private apiConfig = {
    headers : this.createHeader(),
  }
  constructor(private http: HttpClient) { }
  private createHeader():HttpHeaders{
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept-Language':'vi'
    });
  }

  register(registerType : RegisterType):Observable<any>{
      return this.http.post(this.apiRegister,registerType,this.apiConfig)
  }
  login(loginType : LoginType) :Observable<any>{
    return this.http.post(this.apiLogin,loginType,this.apiConfig)

  }
}
