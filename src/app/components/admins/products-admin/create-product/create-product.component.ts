import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, NgModel } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from '../../../../service/products/product.service';
import { CategoryService } from '../../../../service/categories/category.service';
import { ToastrService } from 'ngx-toastr';
import {
  ProductAdd,
  ProductType,
} from '../../../../dtos/products/products.dto';
import { CategoryResponse } from '../../../../interfaces/category.response';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-create-product',
  standalone: true,
  imports: [FormsModule, NgFor, NgIf],
  templateUrl: './create-product.component.html',
  styleUrl: './create-product.component.scss',
})
export class CreateProductComponent implements OnInit {
  categories: CategoryResponse[] = [];
  isLoading: boolean = false;
  product: ProductType = {
    name: '',
    price: 0,
    description: '',
    categoryId: 0,
    thumbnail: '',
    active: true || 1,
  };
  selectedFiles: any[] = [];
  imagePreviews: string[] = [];
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private productService: ProductService,
    private categoryService: CategoryService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getCategories(1, 20);
  }

  onFileSelect(event: any): void {
    const files = event.target.files;
    this.selectedFiles = Array.from(files);

    // Xóa danh sách previews cũ
    this.imagePreviews = [];

    // Đọc từng file và tạo URL preview
    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreviews.push(e.target.result);
      };
      reader.readAsDataURL(files[i]);
    }
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

  onSubmit(): void {
    debugger;
    const formData = new FormData();
    formData.append('name', this.product.name);
    formData.append('price', this.product.price.toString());
    formData.append('description', this.product.description);
    formData.append('categoryId', this.product.categoryId.toString());

    for (let i = 0; i < this.selectedFiles.length; i++) {
      formData.append('files', this.selectedFiles[i]);
    }

    debugger;
    this.productService.createProduct(formData).subscribe({
      next: () => {
        this.toastr.success('Create Product Successfully', 'Products', {
          timeOut: 2000,
        });
        this.router.navigate([`/admin/products`]);
      },
      error: (err: any) => {
        console.error('Error creating product', err);
      },
    });
  }
  removeFile(index: number): void {
    this.selectedFiles.splice(index, 1);
    this.imagePreviews.splice(index, 1);
  }
}
