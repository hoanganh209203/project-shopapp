import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RegisterType } from '../../dtos/auth/register.dto';
import { LoginType } from '../../dtos/auth/login.dto';
import { environment } from '../../environments/environment';
import { UserResponse } from '../../interfaces/user.response';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiRegister = `${environment.apiBaseUrl}/users/register`;
  private apiLogin = `${environment.apiBaseUrl}/users/login`;
  private apiUserDetails = `${environment.apiBaseUrl}/users/details`;
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
  userDetails(token: string) {
    debugger;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });

    return this.http.post(this.apiUserDetails, {}, { headers });
  }

  saveUserResponseToLocalStorage(userResponse? : UserResponse){
    try{
      debugger
      if(userResponse == null || !userResponse){
        return;
      }
      const userResponseJson = JSON.stringify(userResponse);

      localStorage.setItem('user',userResponseJson);
    }catch(error){
      console.log("Error saving user response to local ",error);

    }
  }
  getUserFormLocalStorage() : UserResponse | null  {
    try{
      debugger
      const userResponseJSON = localStorage.getItem('user');
      if(userResponseJSON == null || userResponseJSON == undefined){
        return null;
      }
      const userResponse = JSON.parse(userResponseJSON!)
      return userResponse;
    }catch(error){
      console.log("Error saving user response to local ",error);
      return null
    }
  }

  removeUserFormLocalStorage() :void{
     localStorage.removeItem('user');
  }
}
