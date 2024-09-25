import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from '../../../../service/categories/category.service';
import { ToastrService } from 'ngx-toastr';
import { Validator } from 'class-validator';
import { environment } from '../../../../environments/environment';
import { CategoryType } from '../../../../dtos/categories/category.dto';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-update-category',
  standalone: true,
  imports: [FormsModule, NgFor, NgIf, ReactiveFormsModule],
  templateUrl: './update-category.component.html',
  styleUrl: './update-category.component.scss',
})
export class UpdateCategoryComponent {
  updateForm!: FormGroup;
  categoryId: number = 0;
  selectedFiles: any = null;
  existingImages: string = '';
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private categoryService: CategoryService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.categoryId = id ? +id : 0;
    this.updateForm = this.fb.group({
      name: ['', Validators.required],
      thumnail: [''],
    });
    this.getCategoryId();
  }
  getCategoryId() {
    this.categoryService.categoryById(this.categoryId).subscribe(
      (category: CategoryType) => {
        console.log('Category details:', category);
        if (category) {
          // Gán dữ liệu vào form
          this.updateForm.patchValue({
            name: category.name,
          });
          // Lưu trữ URL hình ảnh hiện tại
          this.existingImages = `${environment.apiBaseUrl}/categories/images/${category.imageThumbnail}`;
        } else {
          console.error('Category not found');
        }
      },
      (error) => {
        console.error('Error fetching category details', error);
      }
    );
  }

  onFileChange(event: any) {
    const file: File = event.target.files[0]; // Dùng files (số nhiều)
    if (file) {
      this.selectedFiles = file;
      // Hiển thị xem trước ảnh mới
      const reader = new FileReader();
      reader.onload = () => {
        this.existingImages = reader.result as string; // Cập nhật hình ảnh xem trước
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.updateForm.valid) {
      const categoryData = this.updateForm.value;
      const formData = new FormData();

      // Append tên danh mục vào form data
      formData.append('name', categoryData.name);

      // Kiểm tra và thêm tệp nếu người dùng đã chọn
      if (this.selectedFiles) {
        formData.append('file', this.selectedFiles);
      }

      // Gửi yêu cầu cập nhật danh mục
      this.categoryService.updateCategory(this.categoryId, formData).subscribe({
        next: (response) => {
          this.toastr.success('Update category successfully', 'Category', {
            timeOut: 2000,
          });
          this.router.navigate(['/admin/category']);
          console.log('Update category successfully', response);
        },
        error: (err) => {
          console.error('Error updating category', err);
          this.toastr.error('Error updating category', 'Category', {
            timeOut: 2000,
          });
        },
      });
    }
  }
}
