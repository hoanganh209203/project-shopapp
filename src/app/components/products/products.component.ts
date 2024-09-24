import { CommonModule, NgClass, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { ProductResponse } from '../../interfaces/product.response';
import { CategoryResponse } from '../../interfaces/category.response';
import { ProductService } from '../../service/products/product.service';
import { CategoryService } from '../../service/categories/category.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../environments/environment';

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
export class ProductShopComponent {
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
    this.getCategories(1, 20);
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

  onCategoryChange(categoryId: number, event: Event) {
    const target = event.target as HTMLInputElement;
    const isChecked = target.checked;

    // Nếu chọn một danh mục cụ thể, đặt categoryId đó
    if (isChecked) {
      this.selectedCategoryId = categoryId;
    } else {
      this.selectedCategoryId = 0; // Nếu không chọn, lọc tất cả sản phẩm
    }
    this.searchProducts(); // Tìm kiếm sản phẩm khi thay đổi danh mục
  }
  getProducts(
    keyword: string,
    selectedCategoryId: number,
    page: number,
    limit: number
  ) {
    const categoryIdToSend =
      selectedCategoryId === 0 ? null : selectedCategoryId;
    this.productService
      .getAllProduct(keyword, selectedCategoryId, page, limit)
      .subscribe({
        next: (response: any) => {
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
  viewDetail(productId: number) {
    this.router.navigate(['home/detail', productId]); // Điều hướng tới trang chi tiết
  }
}
