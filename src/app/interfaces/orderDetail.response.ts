import { ProductResponse } from './product.response';

export interface OrderDetailType {
  id: number;
  product: ProductResponse;
  price: number;
  numberOfProduct: number;
  totalMoney: number;
  color: string;
}
