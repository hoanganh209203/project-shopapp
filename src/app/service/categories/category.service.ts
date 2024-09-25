import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CategoryResponse } from '../../interfaces/category.response';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private apiCategory = `${environment.apiBaseUrl}/categories`;
  constructor(private http: HttpClient) {}

  getCategories(page: number, limit: number): Observable<CategoryResponse[]> {
    debugger;
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    return this.http.get<CategoryResponse[]>(this.apiCategory, { params });
  }

  categoryById(categoryId: number): Observable<CategoryResponse> {
    return this.http.get<CategoryResponse>(`${this.apiCategory}/${categoryId}`);
  }

  createCategory(formData: FormData): Observable<any> {
    debugger;
    return this.http.post(this.apiCategory, formData, {
      responseType: 'text',
    });
  }

  updateCategory(categoryId: number, formData: FormData): Observable<any> {
    debugger;
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.put(`${this.apiCategory}/${categoryId}`, formData, {
      headers,
      responseType: 'text',
    });
  }
}
