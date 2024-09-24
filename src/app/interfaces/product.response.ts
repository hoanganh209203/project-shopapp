import { CategoryResponse } from './category.response';
import { ProductImage } from './productImage';

export interface ProductResponse {
  id: number;
  name: string;
  price: string;
  thumbnail?: string;
  description: string;
  created_at?: string;
  updated_at?: string;
  category_id: number;
  url?: string;
  product_images?: ProductImage[];
  active?: boolean;
}

export interface ProductSoftResponse {
  id: number;
  name: string;
  price: string;
  thumbnail?: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
  category: {
    id: number;
    name: string;
    imageThumbnail?: string;
  };
  url?: string;
  product_images?: ProductImage[];
}
