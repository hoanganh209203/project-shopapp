export class CategoryType {
  name: string;
  thumnail?: string;
  imageThumbnail?: string;

  constructor(data: any) {
    this.name = data.name;
    this.thumnail = data.thumbnail;
    this.imageThumbnail = data.imageThumbnail;
  }
}
