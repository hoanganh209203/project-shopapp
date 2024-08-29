import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../service/categories/category.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from 'express';
import { CategoryResponse } from '../../interfaces/category.response';
import { environment } from '../../environments/environment';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-show-category',
  standalone: true,
  imports: [NgFor],
  templateUrl: './show-category.component.html',
  styleUrl: './show-category.component.scss'
})
export class ShowCategoryComponent implements OnInit{
  categories: CategoryResponse[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  page: number[] = [];
  totalPages: number = 0;
  visiblePages: number[] = [];
  constructor(
    private categoryService: CategoryService,

  ){}


  ngOnInit(): void {
    this.getCategories(1, 10);
  }

  getCategories(page: number, limit: number) {
    debugger
    this.categoryService.getCategories(page, limit).subscribe({
      next: (response: any) => {
        response.category.forEach((category:CategoryResponse) => {
          category.url_image = `${environment.apiBaseUrl}/categories/images/${category.image_thumnail}`;
        });
        this.categories = response.category;
      },
      complete:()=>{
        debugger
        console.log(123);

      },
      error: (err: any) => {
        debugger
        console.log('Error fetching categories', err);
      },
    });
  }

}
