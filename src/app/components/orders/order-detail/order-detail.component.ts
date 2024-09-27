import { CommonModule, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { OrderTypeResponse } from '../../../interfaces/orderType.response';
import { OrderService } from '../../../service/orders/order.service';
import { OrderDetail } from '../../../interfaces/orderDetail.response';
import { environment } from '../../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [NgClass, NgIf, NgFor, CommonModule],
  templateUrl: './order-detail.component.html',
  styleUrl: './order-detail.component.scss',
})
export class OrderDetailComponent implements OnInit {
  orderTypeResponse: OrderTypeResponse = {
    id: 0,
    user_id: 0,
    fullname: '',
    phone_number: '',
    email: '',
    address: '',
    note: '',
    order_date: new Date(),
    status: '',
    total_money: 0,
    shipping_method: '',
    shipping_address: '',
    shipping_date: new Date(),
    payment_method: '',
    order_detail: [],
  };
  totalOrderAmount: number = 0;
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
        this.getOrderDetail(this.orderId);
      } else {
        console.error('Order ID không có trong URL');
      }
    });
  }

  getOrderDetail(orderId: number): void {
    this.orderService.getOrderById(orderId).subscribe({
      next: (response: any) => {
        debugger;
        this.orderTypeResponse.id = response.id;
        this.orderTypeResponse.user_id = response.user_id;
        this.orderTypeResponse.fullname = response.fullname;
        this.orderTypeResponse.email = response.email;
        this.orderTypeResponse.phone_number = response.phone_number;
        this.orderTypeResponse.address = response.address;
        this.orderTypeResponse.note = response.note;
        this.orderTypeResponse.payment_method = response.payment_method;
        this.orderTypeResponse.shipping_method = response.shipping_method;
        this.orderTypeResponse.shipping_address = response.shipping_address;
        this.orderTypeResponse.status = response.status;
        this.orderTypeResponse.total_money = response.total_money;

        // Tính tổng tiền từ các sản phẩm trong order_detail
        this.orderTypeResponse.order_detail = response.order_detail;

        this.totalOrderAmount = this.orderTypeResponse.order_detail.reduce(
          (total, item) => {
            return total + item.price * item.numberOfProduct;
          },
          0
        );

        console.log('Tổng tiền phải trả:', this.totalOrderAmount);
        this.orderTypeResponse.total_money = this.totalOrderAmount;
        debugger;
        this.orderTypeResponse.order_detail = response.order_detail.map(
          (order_detail: OrderDetail) => {
            order_detail.product.thumbnail = `${environment.apiBaseUrl}/products/images/${order_detail.product.thumbnail}`;
            return order_detail;
          }
        );
        this.orderTypeResponse.shipping_date = new Date(response.shipping_date);
        this.orderTypeResponse.order_date = new Date(
          response.order_date[0],
          response.order_date[1] - 1,
          response.order_date[2]
        );
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

  isModalOpen = false;

  toggleModal(): void {
    this.isModalOpen = !this.isModalOpen;
  }
  navigate() {
    this.router.navigate(['/']);
  }
}
