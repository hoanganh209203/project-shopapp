import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginType } from '../../dtos/auth/login.dto';
import { Router } from '@angular/router';
import { UserService } from '../../service/auth/user.service';
import { LoginResponse } from '../../interfaces/login.response';
import { TokenService } from '../../service/tokens/token.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, NgIf, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [UserService]
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,  // Đã sửa lại Router
    private userService: UserService,
    private tokenService : TokenService
  ) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      phoneNumber: ['', [Validators.required, Validators.minLength(10)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  login() {
    if (this.loginForm.invalid) {
      return;
    }

    const loginType: LoginType = {
      phone_number: this.loginForm.value.phoneNumber,
      password: this.loginForm.value.password,
    };
debugger
    this.userService.login(loginType).subscribe({
      next: (response: LoginResponse) => {
        //Muốn sử dụng token trong các yêu cầu API
        debugger
        console.log('Login successful!');
        let token = response.token;
        this.tokenService.setToken(token)
        console.log(response);

        this.router.navigate(['home']);
      },
      complete: () => {
        debugger
        console.log('Login process completed.');
      },
      error: (error: any) => {
        debugger
        console.log(`Cannot login, error: ${error}`);
      },
    });
  }
}
