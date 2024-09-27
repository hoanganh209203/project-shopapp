import { CommonModule, NgClass, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { OrderResponse } from '../../../../interfaces/order.response';
import { ProductResponse } from '../../../../interfaces/product.response';
import { UserResponse } from '../../../../interfaces/user.response';
import { ProductService } from '../../../../service/products/product.service';
import { UserService } from '../../../../service/auth/user.service';
import { OrderService } from '../../../../service/orders/order.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [
    NgFor,
    NzPaginationModule,
    NgIf,
    NgClass,
    FormsModule,
    RouterLink,
    CommonModule,
  ],
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.scss',
})
export class OrderListComponent {
  orders: OrderResponse[] = [];
  product: ProductResponse[] = [];
  user: UserResponse[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  page: number[] = [];
  totalPages: number = 0;
  visiblePages: number[] = [];
  isLoading: boolean = false;

  constructor(
    private productService: ProductService,
    private userService: UserService,
    private orderService: OrderService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.getAllOrder(this.currentPage, this.itemsPerPage);
  }

  getAllOrder(page: number, limit: number) {
    this.orderService.getAllOrder(page, limit).subscribe({
      next: (response: any) => {
        this.orders = response.order;
        this.totalPages = response.totalPages;
        this.visiblePages = this.generateVisiblePageArry(
          this.currentPage,
          this.totalPages
        );
      },
      error: (err: any) => {
        this.toastr.error('Error fetching order', 'Error', {
          timeOut: 1000,
        }); // Thêm thông báo lỗi
        console.error('Error fetching order:', err);
      },
    });
  }

  onPageChange(page: number, event: MouseEvent) {
    this.isLoading = true;
    event.preventDefault();
    this.currentPage = page;
    this.getAllOrder(this.currentPage, this.itemsPerPage);
    this.isLoading = false;
  }

  generateVisiblePageArry(currentPage: number, totalPages: number): number[] {
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
