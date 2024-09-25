import { Component } from '@angular/core';
import { CategoryType } from '../../../../dtos/categories/category.dto';
import { CategoryService } from '../../../../service/categories/category.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import e from 'express';

@Component({
  selector: 'app-create-category',
  standalone: true,
  imports: [FormsModule, NgFor, NgIf],
  templateUrl: './create-category.component.html',
  styleUrl: './create-category.component.scss',
})
export class CreateCategoryComponent {
  isLoading: boolean = false;
  category: CategoryType = {
    name: '',
    thumnail: '',
  };
  selectedFile: any;
  imagePreview: string = '';

  constructor(
    private categoryService: CategoryService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  onFileSelect(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  onSubmit(): void {
    debugger;
    const formData = new FormData();
    formData.append('name', this.category.name);
    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    }

    this.categoryService.createCategory(formData).subscribe({
      next: (response: any) => {
        console.log('data', response);

        this.toastr.success('Create Category Successfully', 'Categories', {
          timeOut: 2000,
        });
        this.router.navigate([`/admin/category`]);
      },
      error: (err: any) => {
        console.error('Error', err);

        this.toastr.error('Create Category Error', 'Categories', {
          timeOut: 2000,
        });
      },
    });
  }
}
