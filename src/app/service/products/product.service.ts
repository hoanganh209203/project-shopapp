import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { ProductType } from '../../dtos/products/products.dto';
import { Observable } from 'rxjs';
import { ProductResponse } from '../../interfaces/product.response';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiProduct = `${environment.apiBaseUrl}/products`;

  constructor(private http: HttpClient) {}

  getAllProduct(
    keyword: string,
    categoryId: number,
    page: number,
    limit: number
  ): Observable<ProductResponse[]> {
    const params = new HttpParams()
      .set('keyword', keyword)
      .set('category_id', categoryId)
      .set('page', page.toString())
      .set('limit', limit.toString());
    return this.http.get<ProductResponse[]>(this.apiProduct, { params });
  }

  productDetail(productId : number){
    return this.http.get(`${this.apiProduct}/${productId}`)
  }
}
