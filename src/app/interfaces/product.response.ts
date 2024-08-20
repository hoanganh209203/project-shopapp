import { ProductImage } from "./productImage";

export interface ProductResponse {
  id:number;
  name:string;
  price:string;
  thumbnail:string;
  description:string;
  created_at:string;
  updated_at:string;
  category_id:number;
  url:string
  product_images: ProductImage[];
}
