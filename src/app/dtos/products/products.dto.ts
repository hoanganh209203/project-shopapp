export class ProductType {
  name:string;
  price:string;
  thumbnail:string;
  description:string;
  created_at:string;
  updated_at:string;
  category_id:number;

  constructor(data : any){
    this.name = data.name;
    this.price = data.price;
    this.thumbnail = data.thumbnail;
    this.description = data.description;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
    this.category_id = data.category_id

  }

}
