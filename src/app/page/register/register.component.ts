import { NgIf } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { error } from 'console';
import { UserService } from '../../service/auth/user.service';
import { RegisterType } from '../../dtos/auth/register.dto';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, NgIf,ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnInit{
  registerForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.registerForm = this.fb.group({
      fullName: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.minLength(10)]],
      address: [''],
      password: ['', [Validators.required, Validators.minLength(6)]],
      retypePassword: ['', Validators.required],
      dateOfBirth: [
        new Date(new Date().setFullYear(new Date().getFullYear() - 18)),
        Validators.required,
      ],
    }, { validators: this.checkPasswordMatch });
  }

  register() {
    if (this.registerForm.invalid) {
      return;
    }

    const registerType: RegisterType = {
      fullname: this.registerForm.value.fullName,
      phone_number: this.registerForm.value.phoneNumber,
      address: this.registerForm.value.address,
      password: this.registerForm.value.password,
      retype_password: this.registerForm.value.retypePassword,
      date_of_brith: this.registerForm.value.dateOfBirth,
      facebook_account_id: 0,
      google_account_id: 0,
      role_id: 1,
    };

    this.userService.register(registerType).subscribe({
      next: (response: any) => {
        alert('Register successful!');
        this.router.navigate(['login']);

      },
      complete: () => {
        console.log('Registration process completed.');
      },
      error: (error: any) => {
        console.log(`Cannot register, error: ${error.error}`);
      },
    });
  }

  checkPasswordMatch(group: FormGroup) {
    const password = group.get('password')?.value;
    const retypePassword = group.get('retypePassword')?.value;
    return password === retypePassword ? null : { passwordMismatch: true };
  }

  checkAge() {
    const birthDateControl = this.registerForm.get('dateOfBirth');
    if (birthDateControl) {
      const birthDate = new Date(birthDateControl.value);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      if (age < 18) {
        birthDateControl.setErrors({ invalidAge: true });
      } else {
        birthDateControl.setErrors(null);
      }
    }
  }
}
