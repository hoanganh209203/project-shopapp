import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrderResponse } from '../../interfaces/order.response';
import { OrderType } from '../../dtos/orders/orders.dto';

@Injectable({
  providedIn: 'root'
})
export class OrderService {


  private apiOrder = `${environment.apiBaseUrl}/orders`;

  constructor(private http: HttpClient) { }

  // Hàm để tạo đơn hàng kèm token
  createOrder(orderData: OrderType): Observable<any> {
    // Lấy token từ localStorage
    const token = localStorage.getItem('access_token');

    // Cấu hình headers bao gồm token
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`  // Thêm token vào Authorization header
    });

    return this.http.post<any>(this.apiOrder, orderData, { headers });
  }
}
