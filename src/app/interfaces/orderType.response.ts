import { OrderDetailType } from './orderDetail.response';

export interface OrderTypeResponse {
  id: number;
  user_id?: UserType;
  fullname: string;
  email: string;
  phone_number: string;
  address: string;
  note: string;
  order_date: Date | string;
  status: string;
  total_money: number;
  shipping_method: string;
  shipping_address: string;
  shipping_date: Date | string;
  payment_method: string;
  order_detail: OrderDetailType[];
}

export interface UserType {
  id: number;
  fullName: string;
  phoneNumber: string;
  address: string;
  dateOfBirth: string;
  facebookAccountId: number;
  googleAccountId: number;
  createdAt: string;
  updatedAt: string;
  role: {
    id: number;
    name: string;
  };
}
