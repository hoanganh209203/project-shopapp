import { Component, Input, OnInit } from '@angular/core';
import { BannerComponent } from '../../components/clients/banner/banner.component';
import { ProductService } from '../../service/products/product.service';
import { environment } from '../../environments/environment';
import { ProductResponse } from '../../interfaces/product.response';
import { CommonModule, NgClass, NgFor, NgIf } from '@angular/common';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { CategoryResponse } from '../../interfaces/category.response';
import { CategoryService } from '../../service/categories/category.service';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../service/carts/cart.service';
import { ToastrService } from 'ngx-toastr';
import { ShowCategoryComponent } from '../../components/clients/show-category/show-category.component';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [
    BannerComponent,
    NgFor,
    NzPaginationModule,
    NgIf,
    NgClass,
    FormsModule,
    RouterLink,
    ShowCategoryComponent,
    CommonModule,
  ],
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
})
export class HomepageComponent implements OnInit {
  products: ProductResponse[] = [];
  categories: CategoryResponse[] = [];
  selectedCategoryId: number = 0;
  currentPage: number = 1;
  itemsPerPage: number = 10;
  page: number[] = [];
  totalPages: number = 0;
  visiblePages: number[] = [];
  keyword: string = '';
  quantity: number = 1;
  isLoading: boolean = false;
  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit() {
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
          this.isLoading = false; // tắt loading sau khi nhận dữ liệu
          this.toastr.success('Product loaded successfully', 'Succeess', {
            timeOut: 1000,
          }); // Toast thông báo thành công
          response.product.forEach((product: ProductResponse) => {
            product.url = `${environment.apiBaseUrl}/products/images/${product.thumbnail}`;
          });
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
