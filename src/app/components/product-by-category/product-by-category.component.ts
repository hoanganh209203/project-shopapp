import { Component } from '@angular/core';
import { ProductResponse } from '../../interfaces/product.response';
import { ProductService } from '../../service/products/product.service';
import { ToastrService } from 'ngx-toastr';

import { environment } from '../../environments/environment';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-product-by-category',
  standalone: true,
  imports: [NgFor, NgIf, RouterLink, CommonModule],
  templateUrl: './product-by-category.component.html',
  styleUrl: './product-by-category.component.scss',
})
export class ProductByCategoryComponent {
  products: ProductResponse[] = [];
  categoryId: number = 0;
  currentPage: number = 1;
  itemsPerPage: number = 10;
  page: number[] = [];
  totalPages: number = 0;
  visiblePages: number[] = [];
  isLoading: boolean = false;
  constructor(
    private productService: ProductService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.route.paramMap.subscribe((params) => {
      const idPr = params.get('id');
      this.categoryId = Number(idPr);
      if (this.categoryId) {
        this.getProductByCategory(
          this.categoryId,
          this.currentPage,
          this.itemsPerPage
        );
      }
    });
  }

  getProductByCategory(categoryId: number, page: number, limit: number) {
    this.productService.getCategoryProduct(categoryId, page, limit).subscribe({
      next: (response: any) => {
        debugger;
        this.toastr.success('Product loaded successfully', 'Success', {
          timeOut: 1000,
        }); // Toast thông báo thành công
        response.product.forEach((product: ProductResponse) => {
          product.url = `${environment.apiBaseUrl}/products/images/${product.thumbnail}`;
        });

        this.products = response.product;
        this.totalPages = response.totalPages;
        this.visiblePages = this.generateVisiblePageArry(
          this.currentPage,
          this.totalPages);
        this.isLoading = false;
      },
      error: (err: any) => {
        this.isLoading = false; // Tắt loading nếu có lỗi
        this.toastr.error('Error fetching product details', 'Error', {
          timeOut: 1000,
        });
        console.error('Error fetching products:', err);
      },
    });
  }
  onPageChange(page: number, event: MouseEvent) {
    this.isLoading = true;
    event.preventDefault();
    this.currentPage = page;
    this.getProductByCategory(
      this.categoryId,
      this.currentPage,
      this.itemsPerPage
    );
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
