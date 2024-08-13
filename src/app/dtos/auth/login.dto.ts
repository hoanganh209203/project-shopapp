import { IsNotEmpty, IsPhoneNumber, IsString } from "class-validator";

export class LoginType  {
  @IsPhoneNumber()
  @IsNotEmpty()
  phone_number: string;


  @IsString()
  @IsNotEmpty()
  password: string;


  constructor(data:any){
    this.phone_number = data.phone_number;
    this.password = data.password
  }
}
