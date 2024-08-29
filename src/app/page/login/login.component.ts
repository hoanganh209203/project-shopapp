import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { LoginType } from '../../dtos/auth/login.dto';
import { Router } from '@angular/router';
import { UserService } from '../../service/auth/user.service';
import { LoginResponse } from '../../interfaces/login.response';
import { TokenService } from '../../service/tokens/token.service';
import { ToastrService } from 'ngx-toastr';
import { UserResponse } from '../../interfaces/user.response';
import { timestamp } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, NgIf, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [UserService],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isLoading: boolean = false;
  //userResponse?: UserResponse;
  constructor(
    private fb: FormBuilder,
    private router: Router, // Đã sửa lại Router
    private userService: UserService,
    private tokenService: TokenService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.loginForm = this.fb.group({
      phoneNumber: ['', [Validators.required, Validators.minLength(10)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  login() {
    this.isLoading = true;
    if (this.loginForm.invalid) {
      return;
    }

    const loginType: LoginType = {
      phone_number: this.loginForm.value.phoneNumber,
      password: this.loginForm.value.password,
    };
    //debugger
    this.userService.login(loginType).subscribe({
      next: (response: LoginResponse) => {
        //Muốn sử dụng token trong các yêu cầu API
        let token = response.token;
        this.tokenService.setToken(token);
        debugger;
        this.userService.userDetails(token).subscribe({
          next: (response: any) => {
            debugger;
            // this.userResponse = {
            //   id: response.id,
            //   fullname: response.fullname,
            //   phone_number: response.phone_number,
            //   address: response.address,
            //   facebook_account_id: response.facebook_account_id,
            //   google_account_id: response.google_account_id,
            //   date_of_brith: new Date(response.date_of_brith),
            // };
            let userResponse : UserResponse = {
              id: response.id,
              fullname: response.fullname,
              phone_number: response.phone_number,
              address: response.address,
              date_of_brith: new Date(response.date_of_brith),
              facebook_account_id: response.facebook_account_id,
              google_account_id: response.google_account_id
            }
            this.userService.saveUserResponseToLocalStorage(userResponse);
            this.toastr.success('SignIn Successfully', 'Signin', {
              timeOut: 3000,
            });
            this.isLoading = true;
            this.router.navigate(['home']);
            this.isLoading = false;
          },
          complete: () => {
            debugger;
            console.log('Login process completed.');
          },
          error: (err: any) => {
            // debugger
            this.toastr.error('Login failed', 'Signin', {
              timeOut: 3000,
            });
          },
        });
      },
      complete: () => {
        //debugger

        console.log('Login process completed.');
      },
      error: (err: any) => {
        // debugger
        this.toastr.error('Login failed', 'Signin', {
          timeOut: 3000,
        });
      },
    });
  }
}
