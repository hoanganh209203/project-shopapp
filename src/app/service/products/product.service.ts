import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { ProductAdd, ProductType } from '../../dtos/products/products.dto';
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
    categoryId: number | null,
    page: number,
    limit: number
  ): Observable<ProductResponse[]> {
    let params = new HttpParams()
      .set('keyword', keyword)
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (categoryId !== null) {
      params = params.set('category_id', categoryId.toString());
    }
    return this.http.get<ProductResponse[]>(this.apiProduct, { params });
  }

  productDetail(productId: number): Observable<ProductResponse> {
    return this.http.get<ProductResponse>(`${this.apiProduct}/${productId}`);
  }

  getProductsByIds(productIds: number[]): Observable<ProductResponse[]> {
    const params = new HttpParams().set('ids', productIds.join(','));
    return this.http.get<ProductResponse[]>(
      `${this.apiProduct}/by-ids?${params}`
    );
  }

  getCategoryProduct(
    categoryId: number,
    page: number,
    limit: number
  ): Observable<ProductResponse[]> {
    const params = new HttpParams().set('page', page).set('limit', limit);
    return this.http.get<ProductResponse[]>(
      `${this.apiProduct}/category/${categoryId}`,
      { params }
    );
  }

  createProduct(formData: FormData): Observable<any> {
    return this.http.post(this.apiProduct, formData);
  }

  updateProduct(productId: number, formData: FormData): Observable<any> {
    // Lấy token từ localStorage
    debugger;
    // const token = localStorage.getItem('access_token');
    // // Cấu hình headers bao gồm token
    // const headers = new HttpHeaders({
    //   Authorization: `Bearer ${token}`, // Thêm token vào Authorization header
    // });

    return this.http.put<any>(`${this.apiProduct}/${productId}`, formData);
  }

  softDeleteProduct(productId: number) {
    debugger;
    // const token = localStorage.getItem('access_token');
    // const headers = new HttpHeaders({
    //   Authorization: `Bearer ${token}`,
    // });
    return this.http.delete(
      `${this.apiProduct}/soft-delete/${productId}`,
      { responseType: 'text' }
      // {
      //   headers,
      // }
    );
  }
  // Phương thức khôi phục sản phẩm như trước
  restoreProduct(productId: number): Observable<any> {
    return this.http.put(`${this.apiProduct}/restore/${productId}`, null, {
      responseType: 'text',
    });
  }

  softDeletedList(page: number, limit: number): Observable<ProductResponse[]> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    return this.http.get<ProductResponse[]>(`${this.apiProduct}/soft-deleted`, {
      params,
    });
  }
}
