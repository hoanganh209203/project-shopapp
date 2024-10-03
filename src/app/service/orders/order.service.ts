import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrderResponse } from '../../interfaces/order.response';
import { OrderType } from '../../dtos/orders/orders.dto';
import { OrderTypeResponse } from '../../interfaces/orderType.response';
import { UserOrderResponse } from '../../interfaces/userOrder.response';
import { OrderDetailType } from '../../interfaces/orderDetail.response';
import { OrderStatisticsDTO } from '../../dtos/orders/order.statistics.dto';

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

  updateOrderDetail(orderDetail: OrderDetailType): Observable<any> {
    return this.http.put(
      `${this.apiOrder}/order-detail/${orderDetail.id}`,
      orderDetail
    );
  }

  getOrderById(orderId: number): Observable<OrderTypeResponse> {
    const token = localStorage.getItem('access_token');

    // Cấu hình headers bao gồm token
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<OrderTypeResponse>(`${this.apiOrder}/${orderId}`, {
      headers,
    });
  }

  // Phương thức tính tổng số tiền từ order_detail
  calculateTotalPrice(orderDetails: any[]): number {
    return orderDetails.reduce((total, item: OrderDetailType) => {
      const totalMoney = item.price * item.numberOfProduct;
      item.totalMoney = totalMoney; // Tính toán totalMoney cho từng item
      return total + totalMoney;
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
    const token = localStorage.getItem('access_token');

    // Cấu hình headers bao gồm token
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<UserOrderResponse[]>(
      `${this.apiOrder}/user/${userId}`,
      { params, headers }
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

  updateStatus(orderId: number, status: string): Observable<any> {
    debugger;
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    const params = new HttpParams().set('status', status);
    return this.http.put(
      `${this.apiOrder}/status/${orderId}`,
      {},
      {
        headers: headers,
        params: params,
      }
    );
  }

  // Gọi API để lấy thống kê theo ngày
  getDailyStatistics(): Observable<OrderStatisticsDTO[]> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<OrderStatisticsDTO[]>(
      `${this.apiOrder}/statistics/daily`,
      { headers }
    );
  }

  // Gọi API để lấy thống kê theo tháng
  getMonthlyStatistics(): Observable<OrderStatisticsDTO[]> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<OrderStatisticsDTO[]>(
      `${this.apiOrder}/statistics/monthly`,
      { headers }
    );
  }
}
