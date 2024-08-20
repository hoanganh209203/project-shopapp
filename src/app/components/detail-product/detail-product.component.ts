import { Component, OnInit } from '@angular/core';
import { ProductResponse } from '../../interfaces/product.response';
import { ProductService } from '../../service/products/product.service';
import { CategoryService } from '../../service/categories/category.service';
import { Router } from 'express';
import { ActivatedRoute } from '@angular/router';
import { ProductImage } from '../../interfaces/productImage';
import { environment } from '../../environments/environment';
import { log } from 'console';
import { FormsModule } from '@angular/forms';
import { NgClass, NgFor, NgStyle } from '@angular/common';

@Component({
  selector: 'app-detail-product',
  standalone: true,
  imports: [FormsModule, NgClass, NgFor,NgStyle],
  templateUrl: './detail-product.component.html',
  styleUrl: './detail-product.component.scss',
})
export class DetailProductComponent implements OnInit {
  products?: ProductResponse;
  productId: number = 0;
  currentImageIndex: number = 0;
  quantity: number = 1;
  constructor(
    private productService: ProductService
  ) // private categoryService : CategoryService,
  // private router : Router,
  // private activatedRoute : ActivatedRoute,
  {}

  ngOnInit(): void {
    const iParam = 4;
    if (iParam !== null) {
      this.productId = +iParam;
    }

    console.log(this.productId);

    if (!isNaN(this.productId)) {
      this.productService.productDetail(this.productId).subscribe({
        next: (response: any) => {
          if (response.product_images && response.product_images.length > 0) {
            response.product_images.forEach((product_image: ProductImage) => {
              // Kiểm tra nếu image_url đã chứa apiBaseUrl
              if (!product_image.image_url.startsWith(environment.apiBaseUrl)) {
                product_image.image_url = `${environment.apiBaseUrl}/products/images/${product_image.image_url}`;
              }
            });
          } else {
            console.warn('product_image is not available or is empty');
          }

          this.products = response;
          this.showImage(0);
        },

        complete: () => {},
        error: (err: any) => {
          console.log('Error fetching detail ', err);
        },
      });
    } else {
      console.log('Invalid productId: ', iParam);
    }
  }
  showImage(index: number) {
    if (
      this.products &&
      this.products.product_images &&
      this.products.product_images.length > 0
    ) {
      if (index < 0) {
        index = 0;
      } else if (index >= this.products.product_images.length) {
        index = this.products.product_images.length - 1;
      }
      this.currentImageIndex = index;
    }
  }
  thumbnailClick(index: number) {
    this.currentImageIndex = index;
  }

  increaseQuantity() {
    this.quantity++;
  }

  decreaseQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }
  nextImage(): void {
    console.log('Current index before:', this.currentImageIndex);
    this.showImage(this.currentImageIndex + 1);
    console.log('Current index after:', this.currentImageIndex);
  }

  previousImage(): void {
    console.log('Current index before:', this.currentImageIndex);
    this.showImage(this.currentImageIndex - 1);
    console.log('Current index after:', this.currentImageIndex);
  }
}
