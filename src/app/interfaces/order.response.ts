export interface OrderResponse {
  user_id: number;
  fullname: string;
  email: string;
  phone_number: string;
  address: string;
  note: string;
  total_money: number;
  shipping_address:string;
  shipping_method: string;
  payment_method: string;
  coupon_code: string;
  cart_items: {
    product_id: number;
    quantity: number;
  }[];
}
