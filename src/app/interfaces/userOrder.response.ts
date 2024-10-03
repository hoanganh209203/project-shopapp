import { OrderDetailType } from './orderDetail.response';

export interface UserOrderResponse {
  id: number;
  user_id: number;
  fullname: string;
  phone_number: string;
  email: string;
  address: string;
  note: string;
  // order_date: null;
  status: string;
  total_money: number;
  // shipping_method: null;
  shipping_address: string;
  shipping_date: Date;
  // tracking_number: null;
  payment_method: string;
  order_detail: OrderDetailType[];
}
