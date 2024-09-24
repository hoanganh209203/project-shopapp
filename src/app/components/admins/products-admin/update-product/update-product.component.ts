import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CategoryResponse } from '../../../../interfaces/category.response';
import { ProductService } from '../../../../service/products/product.service';
import { CategoryService } from '../../../../service/categories/category.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductImage } from '../../../../interfaces/productImage';
import { environment } from '../../../../environments/environment';
import { ProductType } from '../../../../dtos/products/products.dto';
import { ProductResponse } from '../../../../interfaces/product.response';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-update-product',
  standalone: true,
  imports: [FormsModule, NgFor, NgIf, ReactiveFormsModule],
  templateUrl: './update-product.component.html',
  styleUrl: './update-product.component.scss',
})
export class UpdateProductComponent implements OnInit {
  updateForm!: FormGroup;
  categories: CategoryResponse[] = [];
  productId: number = 0;
  existingImages: string[] = [];
  selectedFiles: any[] = [];
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private productService: ProductService,
    private categoryService: CategoryService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.productId = id ? +id : 0;
    this.updateForm = this.fb.group({
      name: ['', Validators.required],
      price: ['', Validators.required],
      description: ['', Validators.required],
      categoryId: ['', Validators.required],
      images: [null],
    });
    this.getCategories(1, 30);
    if (this.productId) {
      this.getProductId();
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

  getProductId() {
    this.productService.productDetail(this.productId).subscribe((product) => {
      console.log('Product details:', product); // In dữ liệu sản phẩm ra console để kiểm tra

      if (product) {
        this.updateForm.patchValue({
          name: product.name,
          price: product.price,
          description: product.description,
          categoryId: product.category_id,
        });

        // Xác nhận hình ảnh và đường dẫn URL
        this.existingImages =
          product.product_images?.map(
            (img: ProductImage) =>
              `${environment.apiBaseUrl}/products/images/${img.image_url}`
          ) || [];

        console.log('Existing Images URLs:', this.existingImages); // In ra đường dẫn hình ảnh để kiểm tra
      }
    });
  }

  onFileChange(event: any) {
    const fileList: FileList = event.target.files;
    this.selectedFiles = Array.from(fileList);
    console.log('Files selected:', this.selectedFiles);
  }

  onSubmit(): void {
    debugger;
    if (this.updateForm.valid) {
      const productData = this.updateForm.value;
      console.log('Product Data:', productData);
      const formData = new FormData();

      formData.append('name', productData.name);
      formData.append('price', productData.price);
      formData.append('description', productData.description);
      formData.append('categoryId', productData.categoryId);

      this.selectedFiles.forEach((file) => {
        formData.append('files', file);
      });
      formData.forEach((value, key) => {
        console.log(`${key}: ${value}`);
      });

      console.log('Form Data:', formData);
      this.productService
        .updateProduct(this.productId, formData)
        .subscribe((response) => {
          this.toastr.success('Update Product Successfully', 'Products', {
            timeOut: 2000,
          });
          this.router.navigate(['/admin/products']);
          console.log('Update product successfully', response);
        });
    }
  }
}
