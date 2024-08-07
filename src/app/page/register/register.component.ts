import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  //Khai báo các biến tương ứng với các trường dữ liệu trong form
  phone: string;
  password: string;
  retypePassword: string;
  fullName: string;
  address: string;
  dateOfBirth: Date;
  constructor() {
    this.phone = '';
    this.password = '';
    this.retypePassword = '';
    this.fullName = '';
    this.address = '';
    this.dateOfBirth = new Date ;
    this.dateOfBirth.setFullYear(this.dateOfBirth.getFullYear() - 18);
  }
  onPhoneChange() {
    console.log(`Phone type : ${this.phone}`);
  }

  register() {
    const message =
      `phone : ${this.phone} -` +
      `password : ${this.password} -,` +
      `retypePassword : ${this.retypePassword} -` +
      `fullname : ${this.fullName} -` +
      `address : ${this.address} -` +
      `birth day : ${this.dateOfBirth} `;
      alert(message);
  }
}
