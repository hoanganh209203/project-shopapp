import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrderResponse } from '../../interfaces/order.response';
import { OrderType } from '../../dtos/orders/orders.dto';
import { OrderTypeResponse } from '../../interfaces/orderType.response';
import { OrderDetail } from '../../interfaces/orderDetail.response';
import { UserOrderResponse } from '../../interfaces/userOrder.response';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiOrder = `${environment.apiBaseUrl}/orders`;

  constructor(private http: HttpClient) {}

  // Hàm để tạo đơn hàng kèm token
  createOrder(orderData: OrderType): Observable<any> {
    // Lấy token từ localStorage
    const token = localStorage.getItem('access_token');

    // Cấu hình headers bao gồm token
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`, // Thêm token vào Authorization header
    });

    return this.http.post<any>(this.apiOrder, orderData, { headers });
  }

  getOrderById(orderId: number): Observable<OrderTypeResponse> {
    return this.http.get<OrderTypeResponse>(`${this.apiOrder}/${orderId}`);
  }

  // Phương thức tính tổng số tiền từ order_detail
  calculateTotalPrice(orderDetails: any[]): number {
    return orderDetails.reduce((total, detail) => {
      return total + detail.price * detail.numberOfProduct;
    }, 0);
  }

  getOrderUserId(
    page: number,
    limit: number,
    userId: number
  ): Observable<UserOrderResponse[]> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    return this.http.get<UserOrderResponse[]>(
      `${this.apiOrder}/user/${userId}`,
      { params }
    );
  }

  getAllOrder(page: number, limit: number): Observable<OrderResponse[]> {
    debugger;
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    const token = localStorage.getItem('access_token');

    // Cấu hình headers bao gồm token
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<OrderResponse[]>(this.apiOrder, { params, headers });
  }
}
