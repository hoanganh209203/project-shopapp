import { Component, OnInit } from '@angular/core';
import { OrderType } from '../../../../dtos/orders/orders.dto';
import { OrderResponse } from '../../../../interfaces/order.response';
import { OrderService } from '../../../../service/orders/order.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { OrderTypeResponse } from '../../../../interfaces/orderType.response';
import { environment } from '../../../../environments/environment';
import { OrderDetail } from '../../../../interfaces/orderDetail.response';
import { CommonModule, NgClass, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-order-detail-admin',
  standalone: true,
  imports: [NgClass, NgIf, NgFor, CommonModule, RouterLink],
  templateUrl: './order-detail-admin.component.html',
  styleUrl: './order-detail-admin.component.scss',
})
export class OrderDetailAdminComponent implements OnInit {
  orderDetailAdmin: OrderTypeResponse = {
    id: 0,
    fullname: '',
    email: '',
    phone_number: '',
    address: '',
    order_date: '',
    note: '',
    status: '',
    total_money: 0,
    shipping_address: '',
    shipping_method: '',
    payment_method: '',
    shipping_date: '',
    order_detail: [],
  };
  orderId: number = 0;

  constructor(
    private orderService: OrderService,
    private router: Router,
    private route: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const idPr = params.get('id');
      if (idPr) {
        this.orderId = Number(idPr);
        this.getOrderDetailAdmin(this.orderId);
      } else {
        console.error('Order ID không có trong URL');
      }
    });
  }

  getOrderDetailAdmin(orderId: number): void {
    this.orderService.getOrderById(orderId).subscribe({
      next: (response: any) => {
        this.orderDetailAdmin.id = response.id;
        this.orderDetailAdmin.user_id = response.user_id;
        this.orderDetailAdmin.fullname = response.fullname;
        this.orderDetailAdmin.email = response.email;
        this.orderDetailAdmin.phone_number = response.phone_number;
        this.orderDetailAdmin.address = response.address;
        this.orderDetailAdmin.note = response.note;
        this.orderDetailAdmin.payment_method = response.payment_method;
        this.orderDetailAdmin.shipping_method = response.shipping_method;
        this.orderDetailAdmin.shipping_address = response.shipping_address;
        this.orderDetailAdmin.status = response.status;
        this.orderDetailAdmin.total_money = response.total_money;
        this.orderDetailAdmin.order_detail = response.order_detail;
        debugger;
        this.orderDetailAdmin.order_detail = response.order_detail.map(
          (order_detail: OrderDetail) => {
            order_detail.product.thumbnail = `${environment.apiBaseUrl}/products/images/${order_detail.product.thumbnail}`;
            return order_detail;
          }
        );
        this.orderDetailAdmin.shipping_date = response.shipping_date;
        this.orderDetailAdmin.order_date = response.order_date;
      },

      complete: () => {
        console.log(123456);
        debugger;
      },

      error: (error: any) => {
        debugger;
        console.error('Error fetching detail', error);
      },
    });
  }
}
