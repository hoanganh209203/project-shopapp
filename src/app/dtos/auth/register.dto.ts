import { IsString, IsNotEmpty, IsPhoneNumber, IsDate } from 'class-validator';

export class RegisterType {
  @IsString()
  fullname: string;

  @IsPhoneNumber()
  @IsNotEmpty()
  phone_number: string;

  @IsString()
  address: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  retype_password: string;

  @IsDate()
  @IsNotEmpty()
  date_of_brith: Date;

  facebook_account_id: number = 0;
  google_account_id: number = 0;
  role_id: number = 1;

  constructor(data: any) {
    this.fullname = data.fullName;
    this.phone_number = data.phone;
    this.address = data.address;
    this.password = data.password;
    this.retype_password = data.retypePassword;
    this.date_of_brith = data.dateOfBirth;
    this.facebook_account_id = data.facebook_account_id || 0;
    this.google_account_id = data.google_account_id || 0;
    this.role_id = data.role_id || 1;
  }
}
