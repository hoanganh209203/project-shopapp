import { ProductResponse } from "./product.response";

export interface OrderDetail {
  id : number;
  product:ProductResponse;
  price:number;
  numberOfProduct:number;
  totalMoney:string;
  color:string
}
