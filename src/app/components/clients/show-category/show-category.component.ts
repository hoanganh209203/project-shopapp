import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../../service/categories/category.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from 'express';
import { CategoryResponse } from '../../../interfaces/category.response';
import { environment } from '../../../environments/environment';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-show-category',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: './show-category.component.html',
  styleUrl: './show-category.component.scss',
})
export class ShowCategoryComponent implements OnInit {
  categories: CategoryResponse[] = [];
  isLoading: boolean = false;
  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.getCategories(1, 5);
  }

  getCategories(page: number, limit: number) {
    console.log(123);

    debugger;
    this.categoryService.getCategories(page, limit).subscribe({
      next: (response: any) => {
        debugger;
        this.isLoading = false;
        response.category.forEach((category: CategoryResponse) => {
          category.url_image = `${environment.apiBaseUrl}/categories/images/${category.thumnail}`;
        });
        this.categories = response.category;
      },
      complete: () => {
        debugger;
        console.log(123);
      },
      error: (err: any) => {
        debugger;
        console.log('Error fetching categories', err);
      },
    });
  }
}
