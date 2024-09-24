import { Component } from '@angular/core';
import {
  ProductResponse,
  ProductSoftResponse,
} from '../../../../interfaces/product.response';
import { CategoryResponse } from '../../../../interfaces/category.response';
import { Subject } from 'rxjs';
import { ProductService } from '../../../../service/products/product.service';
import { CategoryService } from '../../../../service/categories/category.service';
import { ToastrService } from 'ngx-toastr';
import { Router, RouterLink } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { CommonModule, NgClass, NgFor, NgIf } from '@angular/common';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-soft-deleted-list',
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
  templateUrl: './soft-deleted-list.component.html',
  styleUrl: './soft-deleted-list.component.scss',
})
export class SoftDeletedListComponent {
  products: ProductSoftResponse[] = [];
  categories: CategoryResponse[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  page: number[] = [];
  selectedCategoryId: number = 0;
  keyword: string = '';
  totalPages: number = 0;
  visiblePages: number[] = [];
  isLoading: boolean = false;
  isDropdownOpen = false;
  filteredProducts: ProductResponse[] = [];
  searchTerms = new Subject<string>();
  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.getSoftDeletedProducts(this.currentPage, this.itemsPerPage);
    this.getCategories(1, 100);
  }

  getCategories(page: number, limit: number) {
    debugger;
    this.categoryService.getCategories(page, limit).subscribe({
      next: (response: any) => {
        this.categories = response.category;
      },
      complete: () => {},
      error: (err: any) => {
        debugger;
        console.log('Error fetching categories', err);
      },
    });
  }

  getSoftDeletedProducts(page: number, limit: number) {
    this.productService.softDeletedList(page, limit).subscribe({
      next: (response: any) => {
        debugger;
        response.product.forEach((product: ProductSoftResponse) => {
          product.url = `${environment.apiBaseUrl}/products/images/${product.thumbnail}`;
        });
        this.isLoading = false;
        this.products = response.product;
        this.totalPages = response.totalPages;
        this.visiblePages = this.generateVisiblePageArry(
          this.currentPage,
          this.totalPages
        );
      },
      error: (err: any) => {
        this.toastr.error('Error fetching product details', 'Error', {
          timeOut: 1000,
        }); // Thêm thông báo lỗi
        console.error('Error fetching products:', err);
      },
    });
  }

  restoreProduct(productId: number) {
    if (window.confirm('Bạn chắc chắn muốn khôi phục sản phẩm này chứ!')) {
      this.productService.restoreProduct(productId).subscribe({
        next: (response: string) => {
          this.toastr.success('Khôi phục sản phẩm thành công', 'Product', {
            timeOut: 1000,
          });

          this.getSoftDeletedProducts(this.currentPage, this.itemsPerPage);
        },
        error: (err) => {
          const errorMessage =
            err.error?.message ||
            'An error occurred while deleting the product.';
          this.toastr.error(errorMessage, 'Product', {
            timeOut: 3000,
          });
          console.error('Error soft deleting product', err);
        },
      });
    }
  }

  onPageChange(page: number, event: MouseEvent) {
    this.isLoading = true;
    event.preventDefault();
    this.currentPage = page;
    this.getSoftDeletedProducts(this.currentPage, this.itemsPerPage);
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
