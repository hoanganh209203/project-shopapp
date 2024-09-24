import { CommonModule, NgClass, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { CategoryResponse } from '../../../../interfaces/category.response';
import { ProductService } from '../../../../service/products/product.service';
import { CategoryService } from '../../../../service/categories/category.service';
import { ToastrService } from 'ngx-toastr';
import { ProductResponse } from '../../../../interfaces/product.response';
import { environment } from '../../../../environments/environment';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
  selector: 'app-products',
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
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent {
  products: ProductResponse[] = [];
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
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.getProducts(
      this.keyword,
      this.selectedCategoryId,
      this.currentPage,
      this.itemsPerPage
    );
  }

  searchProducts() {
    this.currentPage = 1;
    this.itemsPerPage = 10;
    this.getProducts(
      this.keyword,
      this.selectedCategoryId,
      this.currentPage,
      this.itemsPerPage
    );
  }

  getProducts(
    keyword: string,
    selectedCategoryId: number,
    page: number,
    limit: number
  ) {
    this.productService
      .getAllProduct(keyword, selectedCategoryId, page, limit)
      .subscribe({
        next: (response: any) => {
          debugger;
          response.product.forEach((product: ProductResponse) => {
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

  productSoftDelete(productId: number) {
    debugger;
    if (window.confirm('Bạn chắc chắn muốn xóa sản phẩm này chứ!')) {
      this.productService.softDeleteProduct(productId).subscribe({
        next: (response: string) => {
          this.toastr.warning('Delete product successfully', 'Product', {
            timeOut: 1000,
          });

          this.getProducts(
            this.keyword,
            this.selectedCategoryId,
            this.currentPage,
            this.itemsPerPage
          );
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

  restoreProduct(productId: number) {
    this.productService.restoreProduct(productId).subscribe({
      next: (response) => {
        console.log('Product restored successfully', response);
        alert('Sản phẩm đã được khôi phục thành công!');
      },
      error: (err) => {
        console.error('Error restoring product', err);
        alert('Có lỗi xảy ra khi khôi phục sản phẩm');
      },
    });
  }

  onPageChange(page: number, event: MouseEvent) {
    this.isLoading = true;
    event.preventDefault();
    this.currentPage = page;
    this.getProducts(
      this.keyword,
      this.selectedCategoryId,
      this.currentPage,
      this.itemsPerPage
    );
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
