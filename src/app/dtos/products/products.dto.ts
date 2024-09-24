export class ProductType {
  name: string;
  price: number;
  thumbnail?: string;
  description: string;
  created_at?: string;
  updated_at?: string;
  categoryId: number;
  active?: boolean = true;

  constructor(data: any) {
    this.name = data.name;
    this.price = data.price;
    this.thumbnail = data.thumbnail;
    this.description = data.description;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
    this.categoryId = data.category_id;
    this.active = data.active || 1;
  }
}

export type ProductAdd = Omit<
  ProductType,
  'thumbnail' | 'created_at' | 'updated_at'
> & {
  thumbnail: string;
  created_at: string;
  updated_at: string;
};
