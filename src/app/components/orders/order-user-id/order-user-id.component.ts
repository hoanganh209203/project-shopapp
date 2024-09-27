import { Component, OnInit } from '@angular/core';
import { UserOrderResponse } from '../../../interfaces/userOrder.response';
import { OrderService } from '../../../service/orders/order.service';
import { Router } from 'express';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OrderDetail } from '../../../interfaces/orderDetail.response';
import { environment } from '../../../environments/environment';
import { CommonModule, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-order-user-id',
  standalone: true,
  imports: [NgIf, NgFor, CommonModule, RouterLink],
  templateUrl: './order-user-id.component.html',
  styleUrl: './order-user-id.component.scss',
})
export class OrderUserIdComponent implements OnInit {
  // userOrderResponse: UserOrderResponse = {
  //   id: 0,
  //   user_id: 0,
  //   fullname: '',
  //   phone_number: '',
  //   email: '',
  //   address: '',
  //   note: '',
  //   status: '',
  //   total_money: 0,
  //   shipping_address: '',
  //   shipping_date: new Date(),
  //   payment_method: '',
  //   order_detail: [],
  // };
  userOrderResponses: UserOrderResponse[] = [];
  orderId: number = 0;
  userId: number = 0;
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 0;
  visiblePages: number[] = [];
  isLoading: boolean = false;

  constructor(
    private orderService: OrderService,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      this.userId = user.id;
    }

    this.getUserOrderById(this.currentPage, this.itemsPerPage, this.userId);
  }

  getUserOrderById(page: number, limit: number, userId: number): void {
    this.orderService.getOrderUserId(page, limit, userId).subscribe({
      next: (response: any) => {
        this.toastr.success('Check user order loaded successfully', 'Success', {
          timeOut: 1000,
        });
        this.userOrderResponses = response.orders.map(
          (order: UserOrderResponse) => {
            if (order.order_detail) {
              order.order_detail = order.order_detail.map(
                (orderDetail: OrderDetail) => {
                  if (orderDetail.product && orderDetail.product.thumbnail) {
                    orderDetail.product.thumbnail = `${environment.apiBaseUrl}/products/images/${orderDetail.product.thumbnail}`;
                  }
                  return orderDetail;
                }
              );
            }
            return order;
          }
        );
        this.totalPages = response.totalPages;
        this.visiblePages = this.generateVisiblePageArray(
          this.currentPage,
          this.totalPages
        );
        this.isLoading = false;
      },
      complete: () => {
        console.log(123);
      },
      error: (err: any) => {
        console.error('Error fetching User Order', err);
      },
    });
  }

  onPageChange(page: number, event: MouseEvent): void {
    event.preventDefault();
    this.isLoading = true;
    this.currentPage = page;
    this.getUserOrderById(this.currentPage, this.itemsPerPage, this.userId);
  }

  generateVisiblePageArray(currentPage: number, totalPages: number): number[] {
    const maxVisiblePages = 5;
    const halfVisiblePages = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(currentPage - halfVisiblePages, 1);
    let endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(endPage - maxVisiblePages + 1, 1);
    }

    return new Array(endPage - startPage + 1)
      .fill(0)
      .map((_, index) => startPage + index);
  }
}
