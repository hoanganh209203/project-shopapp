import { Component } from '@angular/core';
import { CategoryResponse } from '../../../interfaces/category.response';
import { CategoryService } from '../../../service/categories/category.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [NgFor, NgClass, NgIf, RouterLink],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss',
})
export class CategoriesAdminComponent {
  categories: CategoryResponse[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  page: number[] = [];
  totalPages: number = 0;
  visiblePages: number[] = [];
  isLoading: boolean = false;
  constructor(
    private categoryService: CategoryService,
    private toastr: ToastrService,
    private router: Router
  ) {}
  ngOnInit(): void {
    (this.isLoading = true),
      this.getCategory(this.currentPage, this.itemsPerPage);
  }

  getCategory(page: number, limit: number) {
    this.categoryService.getCategories(page, limit).subscribe({
      next: (response: any) => {
        response.category.forEach((category: CategoryResponse) => {
          category.url_image = `${environment.apiBaseUrl}/categories/images/${category.thumnail}`;
        });
        this.categories = response.category;

        this.totalPages = response.totalPages;
        this.visiblePages = this.generateVisiblePageArry(
          this.currentPage,
          this.totalPages
        );
        this.isLoading = false;
      },
      complete: () => {
        console.log(123);
      },
      error: (error: any) => {
        console.error('Error get category', error);
      },
    });
  }
  onPageChange(page: number, event: MouseEvent) {
    this.isLoading = true;
    event.preventDefault();
    this.currentPage = page;
    this.getCategory(this.currentPage, this.itemsPerPage);
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
